package com.bookbridge.backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.bookbridge.backend.ApiException;
import com.bookbridge.backend.AuthService;
import com.bookbridge.backend.Input;
import com.bookbridge.backend.model.Book;
import com.bookbridge.backend.model.User;
import com.bookbridge.backend.repository.BookRepository;
import com.bookbridge.backend.repository.FavouriteRepository;
import com.bookbridge.backend.repository.OrderRepository;
import com.bookbridge.backend.repository.UserRepository;

/** Register, log in, log out, and the logged-in user's own account. */
@RestController
@RequestMapping("/api")
public class AuthController {
    private final UserRepository users;
    private final BookRepository books;
    private final FavouriteRepository favourites;
    private final OrderRepository orders;
    private final AuthService auth;

    public AuthController(UserRepository users, BookRepository books, FavouriteRepository favourites,
                          OrderRepository orders, AuthService auth) {
        this.users = users;
        this.books = books;
        this.favourites = favourites;
        this.orders = orders;
        this.auth = auth;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> register(@RequestBody Map<String, Object> body) {
        String name = Input.text(body, "name", 80);
        String email = Input.text(body, "email", 120).toLowerCase();
        Object pw = body.get("password");
        String password = pw == null ? "" : pw.toString();

        if (name.length() < 2) throw new ApiException(HttpStatus.BAD_REQUEST, "Enter your full name.");
        if (!Input.validEmail(email)) throw new ApiException(HttpStatus.BAD_REQUEST, "Enter a valid email.");
        if (password.length() < 8 || !password.matches(".*\\d.*"))
            throw new ApiException(HttpStatus.BAD_REQUEST, "Use at least 8 characters, including a number.");
        if (users.findByEmail(email).isPresent())
            throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists.");

        User user = new User();
        user.name = name;
        user.email = email;
        user.password = auth.hash(password);
        users.save(user);
        return Map.of("token", auth.startSession(user), "user", user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, Object> body) {
        Object pw = body.get("password");
        User user = users.findByEmail(Input.text(body, "email", 120).toLowerCase()).orElse(null);
        if (user == null || pw == null || !auth.matches(pw.toString(), user.password))
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Wrong email or password.");
        return Map.of("token", auth.startSession(user), "user", user);
    }

    @PostMapping("/logout")
    public Map<String, Object> logout(@RequestHeader(value = "Authorization", required = false) String header) {
        User user = auth.require(header);
        user.token = null;
        users.save(user);
        return Map.of("ok", true);
    }

    @GetMapping("/me")
    public User me(@RequestHeader(value = "Authorization", required = false) String header) {
        return auth.require(header);
    }

    @PutMapping("/me")
    public User update(@RequestHeader(value = "Authorization", required = false) String header,
                       @RequestBody Map<String, Object> body) {
        User user = auth.require(header);
        String name = Input.text(body, "name", 80);
        String email = Input.text(body, "email", 120).toLowerCase();

        if (name.length() < 2) throw new ApiException(HttpStatus.BAD_REQUEST, "Enter your full name.");
        if (!Input.validEmail(email)) throw new ApiException(HttpStatus.BAD_REQUEST, "Enter a valid email.");
        User other = users.findByEmail(email).orElse(null);
        if (other != null && !other.id.equals(user.id))
            throw new ApiException(HttpStatus.CONFLICT, "That email is already in use.");

        String contactPref = Input.text(body, "contactPref", 30);
        user.name = name;
        user.email = email;
        user.uni = Input.text(body, "uni", 120);
        user.contactPref = contactPref.isEmpty() ? "Email" : contactPref;
        user.n1 = Input.flag(body, "n1");
        user.n2 = Input.flag(body, "n2");
        user.n3 = Input.flag(body, "n3");
        users.save(user);

        // keep the name shown on this user's listings up to date
        for (Book b : books.findByOwnerIdOrderByIdDesc(user.id)) {
            b.ownerName = name;
            books.save(b);
        }
        return user;
    }

    /** Deletes the account with its listings, orders and saved books. */
    @DeleteMapping("/me")
    @Transactional
    public Map<String, Object> delete(@RequestHeader(value = "Authorization", required = false) String header) {
        User user = auth.require(header);
        for (Book b : books.findByOwnerIdOrderByIdDesc(user.id)) {
            favourites.deleteByBookId(b.id);
            books.delete(b);
        }
        favourites.deleteByUserId(user.id);
        orders.deleteByUserId(user.id);
        users.delete(user);
        return Map.of("ok", true);
    }
}