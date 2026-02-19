package com.ashutosh.LibraryManagementSystem.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@JsonPropertyOrder({ "id", "name", "email", "phoneNo", "noOfBooksTaken" })
@Table(
        name = "user",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email"),
                @UniqueConstraint(columnNames = "phoneNo")
        }
)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("userId")
    private Long id;

    @Column(nullable = false)
    private String name;
    @Column(nullable = false,unique = true)
    private String email;
    @Column(name="phone_no" ,nullable = false, unique = true)
    private String phoneNo;

    private int noOfBooksTaken = 0;

    private String password;

}
