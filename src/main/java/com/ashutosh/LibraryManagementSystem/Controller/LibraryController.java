package com.ashutosh.LibraryManagementSystem.Controller;

import com.ashutosh.LibraryManagementSystem.Service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class LibraryController {

    private final LibraryService libraryService;

    @GetMapping("/titles")
    public List<String> getAllBookTiles(){
        return libraryService.getAllBookTitles();
    }

    @GetMapping("/search")
    public List<?> searchBooks(
            @RequestParam(required = false) Long bookId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            Principal principal
    ) {
        return libraryService.searchBooks(bookId, title, author,principal);
    }

}
