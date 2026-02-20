package com.ashutosh.LibraryManagementSystem.Security;

import com.ashutosh.LibraryManagementSystem.DTO.LoginRequestDTO;
import com.ashutosh.LibraryManagementSystem.DTO.LoginResponseDTO;
import com.ashutosh.LibraryManagementSystem.DTO.SignupRequestDTO;
import com.ashutosh.LibraryManagementSystem.DTO.SignupResponseDTO;
import com.ashutosh.LibraryManagementSystem.Entity.User;
import com.ashutosh.LibraryManagementSystem.Enum.Role;
import com.ashutosh.LibraryManagementSystem.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AuthUtil authUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO){

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDTO.getEmail(), loginRequestDTO.getPassword())
        );

        CustomUserDetails customUserDetails =
                (CustomUserDetails) authentication.getPrincipal();

        User user = customUserDetails.getUser();

        String token = authUtil.generateAccessToken(user);

        return new LoginResponseDTO(token, user.getId());
    }


    public SignupResponseDTO signup(SignupRequestDTO signupRequestDTO){

        User existingUser = userRepository.findByEmail(signupRequestDTO.getEmail())
                .orElse(null);

        if(existingUser != null){
            throw new IllegalArgumentException("User already exists");
        }

        User user = User.builder()
                .name(signupRequestDTO.getName())
                .email(signupRequestDTO.getEmail())
                .phoneNo(signupRequestDTO.getPhoneNo())
                .password(passwordEncoder.encode(signupRequestDTO.getPassword()))
                .roles(Set.of(Role.ROLE_USER))
                .build();

        user = userRepository.save(user);

        return new SignupResponseDTO(user.getId(), user.getName(), user.getEmail(),user.getPhoneNo(), user.getNoOfBooksTaken());
    }
}
