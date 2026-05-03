package com.ashutosh.LibraryManagementSystem.Service;

import com.ashutosh.LibraryManagementSystem.DTO.DashboardResponseDto;
import com.ashutosh.LibraryManagementSystem.Entity.User;
import com.ashutosh.LibraryManagementSystem.Enum.Role;
import com.ashutosh.LibraryManagementSystem.Enum.TransactionStatus;
import com.ashutosh.LibraryManagementSystem.Exception.UserNotFoundException;
import com.ashutosh.LibraryManagementSystem.Repository.BookTransactionRepository;
import com.ashutosh.LibraryManagementSystem.Repository.LibraryRepository;
import com.ashutosh.LibraryManagementSystem.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final LibraryRepository libraryRepository;
    private final BookTransactionRepository bookTransactionRepository;

    @Transactional
    public String makeAdminById(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with this id."));

        if (user.getRole() == (Role.ROLE_ADMIN)) {
            return "User is already an ADMIN";
        }

        user.setRole(Role.ROLE_ADMIN);
        return "User promoted to ADMIN";
    }


    @Transactional
    public String removeUserFromAdmin(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with this id."));

        if (user.getRole() != Role.ROLE_ADMIN) {
            return "User is not an ADMIN";
        }
        user.setRole(Role.ROLE_USER);

        return "Admin role removed";
    }

    public DashboardResponseDto getDashboardDetails() {

        long totalBook = libraryRepository.count();
        long totalUser = userRepository.count();
        long totalIssuedBook = bookTransactionRepository
                .countByStatus(TransactionStatus.ISSUED);
        long availableBook = libraryRepository.countByNoOfBooksGreaterThan(0);

        return new DashboardResponseDto(
                totalBook,
                totalUser,
                totalIssuedBook,
                availableBook
        );
    }
}
