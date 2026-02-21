package com.ashutosh.LibraryManagementSystem.Controller;

import com.ashutosh.LibraryManagementSystem.DTO.UserBookCountDTO;
import com.ashutosh.LibraryManagementSystem.DTO.UserTransactionDTO;
import com.ashutosh.LibraryManagementSystem.Entity.Library;
import com.ashutosh.LibraryManagementSystem.Entity.User;
import com.ashutosh.LibraryManagementSystem.Enum.Role;
import com.ashutosh.LibraryManagementSystem.Enum.TransactionStatus;
import com.ashutosh.LibraryManagementSystem.Repository.UserRepository;
import com.ashutosh.LibraryManagementSystem.Service.AdminService;
import com.ashutosh.LibraryManagementSystem.Service.LibraryService;
import com.ashutosh.LibraryManagementSystem.Service.UserService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final LibraryService libraryService;
    private final UserRepository userRepository;
    private final AdminService adminService;

    @PostMapping("/addBook")
    public Library addBook(@RequestBody Library book){
        return libraryService.addBook(book);
    }

    @DeleteMapping("/delete/{bookId}")
    public String deleteBook(@PathVariable Long bookId){
        libraryService.deleteBook(bookId);
        return "Book deleted successfully";
    }

    // we can't directly use .findAll because controller layer should not directly talk to repository directly.
    @GetMapping("/all")
    public List<Library> getAllBooks(){
        return libraryService.getAllBooks();
    }

    @GetMapping("/allUsers")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/books/equal")
    public List<UserBookCountDTO> userWithExactBooks(@RequestParam int count){
        return userService.getUsersWithExactBooks(count);
    }

    @GetMapping("/books/less-than")
    public List<UserBookCountDTO> userWithLessThanBooks(@RequestParam int count){
        return userService.getUsersWithLessThanBooks(count);
    }

    @GetMapping("/books/greater-than")
    public List<UserBookCountDTO> userWithGreaterThanBooks(@RequestParam int count){
        return userService.getUserWithGreaterThanBooks(count);
    }


    @GetMapping("/users/{userId}/transaction")
    public List<UserTransactionDTO> getUserTransaction(
            Principal principal,
            @RequestParam(required = false) TransactionStatus status
    ){

        String email = principal.getName();

        return userService.getUserTransactionDetails(email, status);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/make-admin/{userId}")
    public String makeAdmin(@PathVariable Long userId){
        return adminService.makeAdminById(userId);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/remove-admin/{userId}")
    public String removeAdmin(@PathVariable Long userId){
        System.out.println("Inside remove controller");
        return adminService.removeUserFromAdmin(userId);
    }


}
