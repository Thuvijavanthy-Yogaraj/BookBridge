package com.bookbridge.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookbridge.backend.ApiException;
import com.bookbridge.backend.AuthService;
import com.bookbridge.backend.model.Book;
import com.bookbridge.backend.model.Favourite;
import com.bookbridge.backend.model.User;
import com.bookbridge.backend.repository.BookRepository;
import com.bookbridge.backend.repository.FavouriteRepository;

/** The books a user has saved with the heart button. */
@RestController
@RequestMapping("/api/favourites")
public class FavouriteController {
    private final FavouriteRepository favourites;
    private final BookRepository books;
    private final AuthService auth;

    public FavouriteController(FavouriteRepository favourites, BookRepository books, AuthService auth) {
        this.favourites = favourites;
        this.books = books;
        this.auth = auth;
    }

    @GetMapping
    public List<Book> list(@RequestHeader(value = "Authorization", required = false) String header) {
        User user = auth.require(header);
        List<Long> ids = favourites.findByUserId(user.id).stream().map(f -> f.bookId).toList();
        return books.findAllById(ids);
    }

    @PutMapping("/{bookId}")
    public Map<String, Object> save(@RequestHeader(value = "Authorization", required = false) String header,
                                    @PathVariable Long bookId) {
        User user = auth.require(header);
        if (!books.existsById(bookId)) throw new ApiException(HttpStatus.NOT_FOUND, "Book not found.");
        if (!favourites.existsByUserIdAndBookId(user.id, bookId)) favourites.save(new Favourite(user.id, bookId));
        return Map.of("ok", true);
    }

    @DeleteMapping("/{bookId}")
    public Map<String, Object> remove(@RequestHeader(value = "Authorization", required = false) String header,
                                      @PathVariable Long bookId) {
        User user = auth.require(header);
        favourites.deleteByUserIdAndBookId(user.id, bookId);
        return Map.of("ok", true);
    }
}