package com.ashutosh.LibraryManagementSystem.Service;

import com.ashutosh.LibraryManagementSystem.DTO.UserBookCountDTO;
import com.ashutosh.LibraryManagementSystem.DTO.UserTransactionDTO;
import com.ashutosh.LibraryManagementSystem.Entity.BookTransaction;
import com.ashutosh.LibraryManagementSystem.Entity.User;
import com.ashutosh.LibraryManagementSystem.Enum.TransactionStatus;
import com.ashutosh.LibraryManagementSystem.Exception.DuplicateBookException;
import com.ashutosh.LibraryManagementSystem.Exception.DuplicateUserException;
import com.ashutosh.LibraryManagementSystem.Exception.UserNotFoundException;
import com.ashutosh.LibraryManagementSystem.Repository.BookTransactionRepository;
import com.ashutosh.LibraryManagementSystem.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// Using Constructor injection
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BookTransactionRepository bookTransactionRepository;


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



    public List<UserBookCountDTO> getUsersWithExactBooks(int count){

        List<User> users = userRepository.findByNoOfBooksTaken(count);

        return users
                .stream()
                .map(u -> new UserBookCountDTO(
                        u.getId(),
                        u.getName(),
                        u.getPhoneNo(),
                        u.getNoOfBooksTaken()
                ))
                .toList();
    }


    public List<UserBookCountDTO> getUsersWithLessThanBooks(int count){
        return userRepository.findByNoOfBooksTakenLessThan(count)
                .stream()
                .map(u-> new UserBookCountDTO(
                        u.getId(),
                        u.getName(),
                        u.getPhoneNo(),
                        u.getNoOfBooksTaken()
                ))
                .toList();
    }

    public List<UserBookCountDTO> getUserWithGreaterThanBooks(int count){
        return userRepository.findByNoOfBooksTakenGreaterThan(count)
                .stream()
                .map(u-> new UserBookCountDTO(
                        u.getId(),
                        u.getName(),
                        u.getPhoneNo(),
                        u.getNoOfBooksTaken()
                ))
                .toList();
    }


    public List<UserTransactionDTO> getUserTransactionDetails(String email, TransactionStatus status){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Long userId = user.getId();

        List<BookTransaction> transactions;

        if(status == null){
            transactions = bookTransactionRepository.findByUser_Id(userId);
        }
        else{
            transactions = bookTransactionRepository.findByUser_IdAndStatus(userId, status);
        }

        return transactions.stream()
                .map(UserTransactionDTO::new)
                .toList();

    }

}
