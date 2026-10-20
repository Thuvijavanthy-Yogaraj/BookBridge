package com.bookbridge.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookbridge.backend.model.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
}