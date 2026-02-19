package com.ashutosh.LibraryManagementSystem.Controller;

import com.ashutosh.LibraryManagementSystem.DTO.UserTransactionDTO;
import com.ashutosh.LibraryManagementSystem.Entity.User;
import com.ashutosh.LibraryManagementSystem.Enum.TransactionStatus;
import com.ashutosh.LibraryManagementSystem.Service.LibraryService;
import com.ashutosh.LibraryManagementSystem.Service.UserService;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final LibraryService libraryService;

    @PostMapping("/register")
    public User register(@RequestBody User user){
        return userService.registerUser(user);
    }

    @GetMapping("/{userId}/transaction")
    public List<UserTransactionDTO> getUserTransaction(
            @PathVariable Long userId,
            @RequestParam(required = false)TransactionStatus status
    ){
        return userService.getUserTransactionDetails(userId, status);
    }

    @PostMapping("/issue")
    public String issueBook(@RequestParam Long userId, @RequestParam Long bookId){
        return libraryService.issueBook(userId, bookId);
    }

    @PostMapping("/return")
    public String returnBook(@RequestParam Long userId, @RequestParam Long bookId){
        return libraryService.returnBook(userId,bookId);
    }


    @PostMapping("/{userId}/transaction/{transactionId}/renew")
    public String renewBook(
            @PathVariable Long userId,
            @PathVariable Long transactionId) {

        return libraryService.renewBook(userId, transactionId);
    }
}
