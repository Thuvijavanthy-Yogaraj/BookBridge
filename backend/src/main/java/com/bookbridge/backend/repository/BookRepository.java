package com.bookbridge.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookbridge.backend.model.Book;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByOwnerIdOrderByIdDesc(Long ownerId);
}