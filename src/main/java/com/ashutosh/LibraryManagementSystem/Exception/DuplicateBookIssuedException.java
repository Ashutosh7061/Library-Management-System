package com.ashutosh.LibraryManagementSystem.Exception;

public class DuplicateBookIssuedException  extends  RuntimeException{

    public DuplicateBookIssuedException(String message){
        super(message);
    }
}
