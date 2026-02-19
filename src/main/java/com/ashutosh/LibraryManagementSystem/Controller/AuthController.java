package com.ashutosh.LibraryManagementSystem.Controller;


import com.ashutosh.LibraryManagementSystem.DTO.LoginRequestDTO;
import com.ashutosh.LibraryManagementSystem.DTO.LoginResponseDTO;
import com.ashutosh.LibraryManagementSystem.DTO.SignupRequestDTO;
import com.ashutosh.LibraryManagementSystem.DTO.SignupResponseDTO;
import com.ashutosh.LibraryManagementSystem.Security.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO){
        return ResponseEntity.ok(authService.login(loginRequestDTO));
    }

    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDTO> signup(@RequestBody SignupRequestDTO signupRequestDTO){
        return ResponseEntity.ok(authService.signup(signupRequestDTO));
    }
}
