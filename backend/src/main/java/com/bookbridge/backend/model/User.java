package com.bookbridge.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String name;

    @Column(unique = true, nullable = false)
    public String email;

    @JsonIgnore                 // the hashed password never leaves the server
    public String password;

    @JsonIgnore                 // login token, empty when logged out
    public String token;

    public String uni = "";
    public String contactPref = "Email";
    public boolean n1 = true;   // email me when a saved book is available
    public boolean n2 = true;   // show my first name on my listings
    public boolean n3 = false;  // monthly newsletter
}