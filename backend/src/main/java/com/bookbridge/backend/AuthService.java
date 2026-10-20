package com.bookbridge.backend;

import java.security.SecureRandom;
import java.util.HexFormat;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.bookbridge.backend.model.User;
import com.bookbridge.backend.repository.UserRepository;

/** Passwords and login tokens. */
@Service
public class AuthService {
    private final UserRepository users;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final SecureRandom random = new SecureRandom();

    public AuthService(UserRepository users) {
        this.users = users;
    }

    public String hash(String password) {
        return encoder.encode(password);
    }

    public boolean matches(String password, String hash) {
        return encoder.matches(password, hash);
    }

    /** Gives the user a fresh token and saves it. */
    public String startSession(User user) {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        user.token = HexFormat.of().formatHex(bytes);
        users.save(user);
        return user.token;
    }

    /** The logged-in user, read from the "Authorization: Bearer <token>" header. */
    public User require(String header) {
        String token = header != null && header.startsWith("Bearer ") ? header.substring(7).trim() : "";
        if (token.isEmpty()) throw new ApiException(HttpStatus.UNAUTHORIZED, "Log in to continue.");
        return users.findByToken(token)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Log in to continue."));
    }
}