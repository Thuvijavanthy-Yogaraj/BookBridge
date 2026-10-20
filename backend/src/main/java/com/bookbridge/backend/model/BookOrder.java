package com.bookbridge.backend.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** An order (sell), a request (free) or an exchange offer (swap). */
@Entity
@Table(name = "orders")
public class BookOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @JsonIgnore
    public Long userId;                 // who placed it

    public Long bookId;
    public String title;
    public String type;
    public int price;
    public String pickup;

    @Column(length = 500)
    public String note = "";

    public String offer = "";           // for swaps: the book offered in exchange
    public String status;
    public LocalDateTime created = LocalDateTime.now();
}