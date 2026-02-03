package com.ashutosh.LibraryManagementSystem.Repository;

import com.ashutosh.LibraryManagementSystem.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}
