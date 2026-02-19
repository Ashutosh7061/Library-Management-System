package com.ashutosh.LibraryManagementSystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.jdbc.core.SqlReturnType;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequestDTO {
    private String name;
    private String email;
    private String phoneNo;
    private String password;
}
