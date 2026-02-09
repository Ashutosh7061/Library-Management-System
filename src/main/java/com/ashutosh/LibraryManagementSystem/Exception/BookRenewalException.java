package com.ashutosh.LibraryManagementSystem.Exception;

import com.ashutosh.LibraryManagementSystem.Entity.BookTransaction;

public class BookRenewalException extends RuntimeException{
    public BookRenewalException(String message){
        super(message);
    }
}
