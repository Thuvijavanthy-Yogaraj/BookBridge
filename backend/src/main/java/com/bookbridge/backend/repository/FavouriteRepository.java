package com.bookbridge.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.bookbridge.backend.model.Favourite;

public interface FavouriteRepository extends JpaRepository<Favourite, Long> {
    List<Favourite> findByUserId(Long userId);

    boolean existsByUserIdAndBookId(Long userId, Long bookId);

    @Transactional
    void deleteByUserIdAndBookId(Long userId, Long bookId);

    @Transactional
    void deleteByUserId(Long userId);

    @Transactional
    void deleteByBookId(Long bookId);
}