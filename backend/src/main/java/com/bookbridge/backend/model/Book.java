package com.bookbridge.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String title;
    public String author;
    public String category;             // category id, such as "cs"

    @Column(name = "book_condition")    // "condition" is a reserved word in MySQL
    public String condition;            // Like new, Good or Fair

    public String type;                 // sell, free or swap
    public int price;
    public String wants = "";           // for swaps: what the owner wants in return

    @Column(length = 1000)
    public String description = "";

    public String place = "";
    public String isbn = "";

    @Lob                                // cover photo as a data:image/... string
    @Column(columnDefinition = "LONGTEXT")
    public String image = "";

    public Long ownerId;                // null for the sample books
    public String ownerName = "";
}