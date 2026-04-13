package com.ashutosh.LibraryManagementSystem.Service;

import com.ashutosh.LibraryManagementSystem.DTO.PublicSearchResponseDTO;
import com.ashutosh.LibraryManagementSystem.DTO.UserSearchResponseDTO;
import com.ashutosh.LibraryManagementSystem.Entity.BookTransaction;
import com.ashutosh.LibraryManagementSystem.Entity.Library;
import com.ashutosh.LibraryManagementSystem.Entity.User;
import com.ashutosh.LibraryManagementSystem.Enum.Role;
import com.ashutosh.LibraryManagementSystem.Enum.TransactionStatus;
import com.ashutosh.LibraryManagementSystem.Exception.*;
import com.ashutosh.LibraryManagementSystem.Repository.BookTransactionRepository;
import com.ashutosh.LibraryManagementSystem.Repository.LibraryRepository;
import com.ashutosh.LibraryManagementSystem.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.security.Principal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LibraryService {

    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final BookTransactionRepository transactionRepository;

    //For adding new book
    public Library addBook(Library book){

        boolean exist = libraryRepository
                .findByTitleAndAuthor(book.getTitle(), book.getAuthor())
                .isPresent();

        if(exist){
            throw new DuplicateBookException("This book by the same author already exixts");
        }
        return libraryRepository.save(book);
    }

    //For deleting book
    public void deleteBook(Long bookId){
        libraryRepository.deleteById(bookId);
    }

    //Get all books
    public List<Library> getAllBooks(){
        return libraryRepository.findAll();
    }

    //For issuing book
    @Transactional
    public String issueBookByEmail(String email, Long bookId){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Long userId = user.getId();

        boolean alreadyExist = transactionRepository.findByUser_IdAndBook_IdAndStatus(userId, bookId, TransactionStatus.ISSUED).isPresent();

        if(alreadyExist){
            throw new DuplicateBookIssuedException("You have already issued this same book earlier, please return that to take new book.");
        }

        if(user.getNoOfBooksTaken() >= 3){
            throw new MaxBookLimitException("Return the previous book to take new book, you already have taken 3 books");
        }

        Library book = libraryRepository.findById(bookId)
                .orElseThrow(()-> new BookNotAvailableException("Book not found with given Id"));

        if(book.getNoOfBooks() == 0){
            throw new BookNotAvailableException("Book is out of Stock");
        }

        book.setNoOfBooks(book.getNoOfBooks() - 1);
        user.setNoOfBooksTaken(user.getNoOfBooksTaken() + 1);

        //Start Transaction
        BookTransaction transaction = new BookTransaction();
        transaction.setUser(user);
        transaction.setBook(book);

        LocalDate issueDate = LocalDate.now();
        transaction.setIssueDate(issueDate);
        transaction.setDueDate(issueDate.plusDays(15));

        transaction.setStatus(TransactionStatus.ISSUED);

        transactionRepository.save(transaction);

        return "Book issued successfully";
    }

    //For returning book
    @Transactional
    public String returnBook(String email, Long bookId){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Long userId = user.getId();
        
        Library book = libraryRepository.findById(bookId)
                .orElseThrow(()-> new BookNotAvailableException("Book not Found"));

        BookTransaction transaction =
                transactionRepository
                        .findByUser_IdAndBook_IdAndStatus(
                                userId, bookId, TransactionStatus.ISSUED
                        )
                        .orElseThrow(() -> new BookNotAvailableException("No active issue found"));


        LocalDate returnDate = LocalDate.now();
        transaction.setReturnDate(returnDate);

        int fineAmount = calculateFine(transaction.getDueDate(), returnDate);
        transaction.setFineAmount(fineAmount);


        book.setNoOfBooks(book.getNoOfBooks() + 1);
        user.setNoOfBooksTaken(user.getNoOfBooksTaken() - 1);

        transaction.setStatus(TransactionStatus.RETURNED);

        transactionRepository.save(transaction);

        return fineAmount > 0
                ? "Book returned successfully. Fine amount : "+fineAmount
                : "Book returned successfully. No fine";
    }


    public List<String> getAllBookTitles(){
        return libraryRepository.findAllTitles();
    }

    public List<Library> searchBookByTitle(String title){
        List<Library> books = libraryRepository.findByTitleContainingIgnoreCase(title);

        if(books.isEmpty()){
            throw new BookNotAvailableException("No book found with given title");
        }

        return books;
    }

    public List<Library> searchBookByAuthor(String author){
        List<Library> books = libraryRepository.findByAuthorContainingIgnoreCase(author);

        if(books.isEmpty()){
            throw new BookNotAvailableException("Book not found with given author");
        }
        return books;
    }

    public List<?> searchBooks(Long bookId, String title, String author, Principal principal) {

        List<Library> books;

        if(bookId != null) {
            Library book = libraryRepository.findById(bookId)
                    .orElseThrow(() -> new BookNotAvailableException("Book not found with given Id"));

            books = List.of(book);
        }
        else if (title != null && !title.isBlank()) {
            books = searchBookByTitle(title);

        }
        else if (author != null && !author.isBlank()) {
            books = searchBookByAuthor(author);
        }
        else {
            throw new IllegalArgumentException("Provide at least one search parameter");
        }

        // Public DTO
        if (principal == null) {
            List<PublicSearchResponseDTO> result = new ArrayList<>();

            for (Library b : books) {
                result.add(new PublicSearchResponseDTO(
                        b.getId(),
                        b.getTitle(),
                        b.getAuthor(),
                        b.getGenre(),
                        b.getNoOfBooks() > 0
                ));
            }
            return result;
        }

        // Logged-in-user
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Admin
        if (user.getRole() == (Role.ROLE_ADMIN)) {
            return books;
        }

        // Normal user
        List<UserSearchResponseDTO> result = new ArrayList<>();

        for (Library b : books) {
            result.add(new UserSearchResponseDTO(
                    b.getId(),
                    b.getTitle(),
                    b.getAuthor(),
                    b.getGenre(),
                    b.getNoOfBooks() > 0,
                    b.getDescription()
            ));
        }
        return result;
    }


    public int calculateFine(LocalDate dueDate, LocalDate returnDate){
        if(dueDate == null || returnDate == null){
            return 0;
        }
        if(!returnDate.isAfter(dueDate)){
            return 0;
        }
        long daysKept = ChronoUnit.DAYS.between(dueDate,returnDate);

        return (int) daysKept * 2;
    }

    @Transactional
    public String renewBook(String email, Long transactionId){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();

        System.out.println(">>> RENEW BOOK API HIT <<<");

        BookTransaction transaction =
                transactionRepository
                        .findByIdAndUser_IdAndStatus(
                                transactionId, userId, TransactionStatus.ISSUED
                        )
                        .orElseThrow(() ->
                                new BookRenewalException("Active transaction not found")
                        );

        if (transaction.getDueDate() == null) {
            transaction.setDueDate(transaction.getIssueDate().plusDays(15));
        }

        transaction.setDueDate(transaction.getDueDate().plusDays(15));
        transactionRepository.save(transaction);

        return "Book renewed successfully. New due date: " + transaction.getDueDate();
    }

}
