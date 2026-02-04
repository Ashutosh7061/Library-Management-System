package com.ashutosh.LibraryManagementSystem.Exception;


public class DuplicateBookException extends  RuntimeException {
    public DuplicateBookException(String message){
        super(message);
    }
}
