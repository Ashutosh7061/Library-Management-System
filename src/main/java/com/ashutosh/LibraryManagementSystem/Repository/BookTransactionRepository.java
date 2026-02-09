package com.ashutosh.LibraryManagementSystem.Repository;

import com.ashutosh.LibraryManagementSystem.Entity.BookTransaction;
import com.ashutosh.LibraryManagementSystem.Enum.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookTransactionRepository extends JpaRepository<BookTransaction, Long> {

    List<BookTransaction> findByUser_Id(Long userId);

    List<BookTransaction> findByUser_IdAndStatus(Long userId, TransactionStatus status);

    Optional<BookTransaction> findByUser_IdAndBook_IdAndStatus(Long userId, Long bookId, TransactionStatus status);

    Optional<BookTransaction> findByIdAndUser_IdAndStatus(Long transactionId,Long userId, TransactionStatus status);
}
