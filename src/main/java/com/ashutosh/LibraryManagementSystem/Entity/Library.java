package com.ashutosh.LibraryManagementSystem.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"title","author"})
        }
)
@JsonPropertyOrder({"id" , "title" , "author" , "price" , "noOfBooks"})
public class Library {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("bookId")
    private Long id;

    private String title;
    private String author;
    private int noOfBooks;
    private double price;
    
    private String genre;
    private String description;
    
}
