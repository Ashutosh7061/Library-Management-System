package com.ashutosh.LibraryManagementSystem.Service;

import com.ashutosh.LibraryManagementSystem.Entity.BookTransaction;
import com.ashutosh.LibraryManagementSystem.Entity.Library;
import com.ashutosh.LibraryManagementSystem.Entity.User;
import com.ashutosh.LibraryManagementSystem.Enum.TransactionStatus;
import com.ashutosh.LibraryManagementSystem.Exception.BookNotAvailableException;
import com.ashutosh.LibraryManagementSystem.Exception.DuplicateBookException;
import com.ashutosh.LibraryManagementSystem.Exception.MaxBookLimitException;
import com.ashutosh.LibraryManagementSystem.Repository.BookTransactionRepository;
import com.ashutosh.LibraryManagementSystem.Repository.LibraryRepository;
import com.ashutosh.LibraryManagementSystem.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.print.Book;
import java.time.LocalDateTime;
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
    public String issueBook(Long userId, Long bookId){

        User user = userService.getUser(userId);

        if(user.getNoOfBooksTaken() >= 3){
            throw new MaxBookLimitException("Return the previous book to take new book, you alredy have taken 3 books");
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
        transaction.setIssueDate(LocalDateTime.now());
        transaction.setStatus(TransactionStatus.ISSUED);

        transactionRepository.save(transaction);

//        libraryRepository.save(book);

        return "Book issued successfully";
    }

    //For returning book
    @Transactional
    public String returnBook(Long userId, Long bookId){
        User user = userService.getUser(userId);

        Library book = libraryRepository.findById(bookId)
                .orElseThrow(()-> new BookNotAvailableException("Book not Found"));

        //Start Transaction
        BookTransaction transaction =
                transactionRepository
                        .findByUser_IdAndStatus(userId, TransactionStatus.ISSUED)
                        .stream().filter(t-> t.getBook().getId().equals(bookId))
                        .findFirst()
                        .orElseThrow(()-> new BookNotAvailableException("No active issue found"));


        book.setNoOfBooks(book.getNoOfBooks() + 1);
        user.setNoOfBooksTaken(user.getNoOfBooksTaken() - 1);

        transaction.setReturnDate(LocalDateTime.now());
        transaction.setStatus(TransactionStatus.RETURNED);

        transactionRepository.save(transaction);

//        libraryRepository.save(book);

        return "Book returned successfully";
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
}
