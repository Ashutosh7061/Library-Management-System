package com.ashutosh.LibraryManagementSystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String phoneNo;
    private int noOfBook;
}
