package com.ashutosh.LibraryManagementSystem.Controller;

import com.ashutosh.LibraryManagementSystem.Entity.Library;
import com.ashutosh.LibraryManagementSystem.Service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/library")
@RequiredArgsConstructor
public class LibraryController {

    private final LibraryService libraryService;

    @PostMapping("/add")
    public Library addBook(@RequestBody Library book){
        return libraryService.addBook(book);
    }

    // we can't directly use .findAll because controller layer should not directly talk to repository directly.
    @GetMapping("/all")
    public List<Library> getAllBooks(){
        return libraryService.getAllBooks();
    }

    @DeleteMapping("/delete/{id}")
    public String deleteBook(@PathVariable Long id){
        libraryService.deleteBook(id);
        return "Book deleted successfully";
    }

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
