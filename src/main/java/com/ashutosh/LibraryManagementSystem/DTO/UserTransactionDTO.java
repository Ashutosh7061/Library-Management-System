package com.ashutosh.LibraryManagementSystem.DTO;

import com.ashutosh.LibraryManagementSystem.Entity.BookTransaction;
import com.ashutosh.LibraryManagementSystem.Enum.TransactionStatus;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;


@AllArgsConstructor
@Getter
@JsonPropertyOrder({ "transactionId", "bookId", "bookTitle", "bookAuthor", "issueDate", "returnDate", "status" })
public class UserTransactionDTO {

    private Long transactionId;
    private Long bookId;

    private String bookTitle;
    private String bookAuthor;

    private LocalDate issueDate;
    private LocalDate returnDate;

    private TransactionStatus status;

    public UserTransactionDTO(BookTransaction tx){
        this.transactionId = tx.getId();
        this.bookId = tx.getBook().getId();
        this.bookTitle = tx.getBook().getTitle();
        this.bookAuthor = tx.getBook().getAuthor();
        this.issueDate = tx.getIssueDate();
        this.returnDate = tx.getReturnDate();
        this.status = tx.getStatus();
    }

}
