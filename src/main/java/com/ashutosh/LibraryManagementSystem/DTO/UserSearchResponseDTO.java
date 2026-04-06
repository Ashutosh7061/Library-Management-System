package com.ashutosh.LibraryManagementSystem.DTO;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class UserSearchResponseDTO {
    private Long bookId;
    private String title;
    private String author;
    private String genre;
    private boolean available;
    private String description;

}
