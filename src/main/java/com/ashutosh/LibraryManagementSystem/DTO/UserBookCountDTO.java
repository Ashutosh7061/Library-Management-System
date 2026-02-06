package com.ashutosh.LibraryManagementSystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@AllArgsConstructor
@Getter
public class UserBookCountDTO {
    private Long id;
    private String name;
    private String phonoNO;
    private int noOfBooksTaken;
}
