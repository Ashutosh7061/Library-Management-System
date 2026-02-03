package com.ashutosh.LibraryManagementSystem.Repository;

import com.ashutosh.LibraryManagementSystem.Entity.Library;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LibraryRepository extends JpaRepository<Library, Long> {
    Optional<Library> findByTitle(String title);
}
