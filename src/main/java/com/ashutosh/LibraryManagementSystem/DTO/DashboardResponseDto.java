package com.ashutosh.LibraryManagementSystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardResponseDto {

    private long totalBook;
    private long totalUser;
    private long totalIssuedBook;
    private long availableBook;
}
