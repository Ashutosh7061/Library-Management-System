package com.ashutosh.LibraryManagementSystem.Repository;

import com.ashutosh.LibraryManagementSystem.Entity.Library;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LibraryRepository extends JpaRepository<Library, Long> {

    Optional<Library> findByTitleAndAuthor(String title, String author);

    List<Library> findByTitleContainingIgnoreCase(String title);

    List<Library> findByAuthorContainingIgnoreCase(String author);

    @Query("SELECT l.title FROM Library l")
    List<String> findAllTitles();
}
