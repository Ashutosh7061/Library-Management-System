package com.ashutosh.LibraryManagementSystem.Config;

import com.ashutosh.LibraryManagementSystem.Entity.User;
import com.ashutosh.LibraryManagementSystem.Enum.Role;
import com.ashutosh.LibraryManagementSystem.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class AdminInitialization implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        String adminEmail = "library@admin.com";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {

            User admin = new User();

            admin.setName("Super Admin");
            admin.setEmail(adminEmail);
            admin.setPhoneNo("9999999999");
            admin.setPassword(passwordEncoder.encode("admin@123"));

//            Set<Role> roles = new HashSet<>();
            admin.setRole(Role.ROLE_ADMIN);
//            admin.setRole(Role.ROLE_USER);

//            admin.setRole(roles);

            userRepository.save(admin);

            System.out.println("Default Admin Created");
        }
    }
}