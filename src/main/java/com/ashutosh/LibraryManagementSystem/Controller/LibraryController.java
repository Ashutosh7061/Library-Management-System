package com.ashutosh.LibraryManagementSystem.Controller;

import com.ashutosh.LibraryManagementSystem.Entity.Library;
import com.ashutosh.LibraryManagementSystem.Service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/search/title")
    public List<Library> searchByTitle(@RequestParam String title){
        return libraryService.searchBookByTitle(title);
    }

    @GetMapping("/search/author")
    public List<Library> searchByAuthor(@RequestParam String author){
        return libraryService.searchBookByAuthor(author);
    }
}
