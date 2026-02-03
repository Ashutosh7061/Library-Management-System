package com.ashutosh.LibraryManagementSystem.Service;

import com.ashutosh.LibraryManagementSystem.Entity.Library;
import com.ashutosh.LibraryManagementSystem.Entity.User;
import com.ashutosh.LibraryManagementSystem.Exception.BookNotAvailableException;
import com.ashutosh.LibraryManagementSystem.Exception.MaxBookLimitException;
import com.ashutosh.LibraryManagementSystem.Repository.LibraryRepository;
import com.ashutosh.LibraryManagementSystem.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.print.Book;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LibraryService {

    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    //For adding new book
    public Library addBook(Library book){
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
    public String issueBook(Long userId, String bookTitle){
        User user = userService.getUser(userId);

        if(user.getNoOfBooksTaken() >= 3){
            throw new MaxBookLimitException("Return the previous book to take new book, you alredy have taken 3 books");
        }

        Library book = libraryRepository.findByTitle(bookTitle)
                .orElseThrow(()-> new BookNotAvailableException("Book not found with given author name"));

        if(book.getNoOfBooks() == 0){
            throw new BookNotAvailableException("Book is out of Stock");
        }
        book.setNoOfBooks(book.getNoOfBooks() - 1);
        user.setNoOfBooksTaken(user.getNoOfBooksTaken() + 1);
        libraryRepository.save(book);

        return "Book issued successfully";
    }

    //For returning book
    public String returnBook(Long userId, String bookTitle){
        User user = userService.getUser(userId);

        Library book = libraryRepository.findByTitle(bookTitle)
                .orElseThrow(()-> new BookNotAvailableException("Book not Found"));

        book.setNoOfBooks(book.getNoOfBooks() + 1);
        user.setNoOfBooksTaken(user.getNoOfBooksTaken() - 1);

        libraryRepository.save(book);

        return "Book returned successfully";
    }
}
