package com.ashutosh.LibraryManagementSystem.Exception;

public class MaxBookLimitException extends RuntimeException {
    public MaxBookLimitException(String message){
        super(message);
    }
}
