package com.ashutosh.LibraryManagementSystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class PublicSearchResponseDTO {
    private Long bookId;
    private String title;
    private String author;
    private String genre;
    private boolean available;
}
