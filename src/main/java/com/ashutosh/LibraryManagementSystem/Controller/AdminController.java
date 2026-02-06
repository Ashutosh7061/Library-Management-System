package com.ashutosh.LibraryManagementSystem.Controller;

import com.ashutosh.LibraryManagementSystem.DTO.UserBookCountDTO;
import com.ashutosh.LibraryManagementSystem.Service.UserService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/manager")
public class AdminController {

    private final UserService userService;

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


}
