package com.ashutosh.LibraryManagementSystem.DTO;

import com.ashutosh.LibraryManagementSystem.Enum.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    String jwt;
    Long userId;
    Role role;
}
