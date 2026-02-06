package com.ashutosh.LibraryManagementSystem.Controller;

import com.ashutosh.LibraryManagementSystem.DTO.UserTransactionDTO;
import com.ashutosh.LibraryManagementSystem.Entity.BookTransaction;
import com.ashutosh.LibraryManagementSystem.Entity.User;
import com.ashutosh.LibraryManagementSystem.Repository.BookTransactionRepository;
import com.ashutosh.LibraryManagementSystem.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final BookTransactionRepository transactionRepository;

    @PostMapping("/register")
    public User register(@RequestBody User user){
        return userService.registerUser(user);
    }

    @GetMapping("/allUsers")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/{userId}/transaction")
    public List<UserTransactionDTO> getUserTransaction(@PathVariable Long userId){
        return userService.getUserTransactionDetails(userId);
    }

}
