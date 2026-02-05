package com.ashutosh.LibraryManagementSystem.Controller;

import com.ashutosh.LibraryManagementSystem.Service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/operations")
public class OperationController {

    private final LibraryService libraryService;

    @PostMapping("/issue")
    public String issueBook(@RequestParam Long userId, @RequestParam Long bookId){
        return libraryService.issueBook(userId, bookId);
    }

    @PostMapping("/return")
    public String returnBook(@RequestParam Long userId, @RequestParam Long bookId){
        return libraryService.returnBook(userId,bookId);
    }
}
