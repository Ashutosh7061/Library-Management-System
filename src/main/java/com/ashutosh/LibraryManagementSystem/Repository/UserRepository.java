package com.ashutosh.LibraryManagementSystem.Repository;

import com.ashutosh.LibraryManagementSystem.DTO.UserBookCountDTO;
import com.ashutosh.LibraryManagementSystem.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByPhoneNo(String phoneNo);

    List<User> findByNoOfBooksTaken(int count);

    List<User> findByNoOfBooksTakenLessThan(int count);

    List<User> findByNoOfBooksTakenGreaterThan(int count);


}
