package com.ashutosh.LibraryManagementSystem.Service;

import com.ashutosh.LibraryManagementSystem.Entity.User;
import com.ashutosh.LibraryManagementSystem.Exception.UserNotFoundException;
import com.ashutosh.LibraryManagementSystem.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// Using Constructor injection

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User registerUser(User user){
        return userRepository.save(user);
    }
    public User getUser(Long userId){
        return userRepository.findById(userId)
                .orElseThrow(()-> new UserNotFoundException("Please Register first"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
