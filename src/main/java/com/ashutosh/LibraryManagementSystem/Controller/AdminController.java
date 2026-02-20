package com.ashutosh.LibraryManagementSystem.Controller;

import com.ashutosh.LibraryManagementSystem.DTO.UserBookCountDTO;
import com.ashutosh.LibraryManagementSystem.DTO.UserTransactionDTO;
import com.ashutosh.LibraryManagementSystem.Entity.Library;
import com.ashutosh.LibraryManagementSystem.Entity.User;
import com.ashutosh.LibraryManagementSystem.Enum.Role;
import com.ashutosh.LibraryManagementSystem.Enum.TransactionStatus;
import com.ashutosh.LibraryManagementSystem.Repository.UserRepository;
import com.ashutosh.LibraryManagementSystem.Service.LibraryService;
import com.ashutosh.LibraryManagementSystem.Service.UserService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final LibraryService libraryService;
    private final UserRepository userRepository;

    @PostMapping("/addBook")
    public Library addBook(@RequestBody Library book){
        return libraryService.addBook(book);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteBook(@PathVariable Long id){
        libraryService.deleteBook(id);
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
            @PathVariable Long userId,
            @RequestParam(required = false) TransactionStatus status
    ){
        return userService.getUserTransactionDetails(userId, status);
    }

    @PutMapping("/make-admin/{email}")
    public String makeAdmin(@PathVariable String email){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.getRoles().add(Role.ROLE_ADMIN);

        userRepository.save(user);

        return "User promoted to ADMIN";
    }

    @PutMapping("/remove-admin/{email}")
    public String removeAdmin(@PathVariable String email){

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        user.getRoles().remove(Role.ROLE_ADMIN);

        userRepository.save(user);

        return "Admin role removed";
    }


}
