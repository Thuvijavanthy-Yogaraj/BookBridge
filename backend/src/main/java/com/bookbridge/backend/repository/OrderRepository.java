package com.bookbridge.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.bookbridge.backend.model.BookOrder;

public interface OrderRepository extends JpaRepository<BookOrder, Long> {
    List<BookOrder> findByUserIdOrderByIdDesc(Long userId);

    @Transactional
    void deleteByUserId(Long userId);
}
