package com.ashutosh.LibraryManagementSystem.Service;

import com.ashutosh.LibraryManagementSystem.Entity.User;
import com.ashutosh.LibraryManagementSystem.Exception.DuplicateBookException;
import com.ashutosh.LibraryManagementSystem.Exception.DuplicateUserException;
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

        boolean emailExists = userRepository.findByEmail(user.getEmail()).isPresent();

        boolean phoneNoExists = userRepository.findByPhoneNo(user.getPhoneNo()).isPresent();

        if(emailExists && phoneNoExists){
            throw new DuplicateUserException("Email and phone number already exixts");
        }

        if(emailExists){
            throw new DuplicateUserException("Email already exixts");
        }

        if(phoneNoExists){
            throw new DuplicateUserException("Phone number already exixts");
        }
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
