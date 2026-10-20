package com.bookbridge.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** One row for each book a user has saved. */
@Entity
@Table(name = "favourites")
public class Favourite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public Long userId;
    public Long bookId;

    public Favourite() {}

    public Favourite(Long userId, Long bookId) {
        this.userId = userId;
        this.bookId = bookId;
    }
}