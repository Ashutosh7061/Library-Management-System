package com.ashutosh.LibraryManagementSystem.Controller;

import com.ashutosh.LibraryManagementSystem.DTO.UserTransactionDTO;
import com.ashutosh.LibraryManagementSystem.Entity.User;
import com.ashutosh.LibraryManagementSystem.Enum.TransactionStatus;
import com.ashutosh.LibraryManagementSystem.Repository.UserRepository;
import com.ashutosh.LibraryManagementSystem.Service.LibraryService;
import com.ashutosh.LibraryManagementSystem.Service.UserService;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final LibraryService libraryService;
    private final UserRepository userRepository;


    @GetMapping("/transaction")
    public List<UserTransactionDTO> getUserTransaction(
            Principal principal,
            @RequestParam(required = false)TransactionStatus status
    ){

        String email = principal.getName();
        return userService.getUserTransactionDetails(email, status);
    }


    @PostMapping("/issue")
    public String issueBook(@RequestParam Long bookId,
                            Principal principal) {

        String email = principal.getName(); // username from JWT

        return libraryService.issueBookByEmail(email, bookId);
    }

    @PostMapping("/return")
    public String returnBook(@RequestParam Long bookId,
                             Principal principal){

        String email = principal.getName();

        return libraryService.returnBook(email,bookId);
    }


    @PostMapping("/transaction/{transactionId}/renew")
    public String renewBook(
            @PathVariable Long transactionId,
            Principal principal) {

        String email = principal.getName();

        return libraryService.renewBook(email, transactionId);
    }
}
