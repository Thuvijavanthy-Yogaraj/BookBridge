package com.bookbridge.backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.bookbridge.backend.ApiException;
import com.bookbridge.backend.Input;
import com.bookbridge.backend.model.Message;
import com.bookbridge.backend.repository.MessageRepository;

/** Saves messages sent from the contact page. */
@RestController
@RequestMapping("/api/contact")
public class ContactController {
    private final MessageRepository messages;

    public ContactController(MessageRepository messages) {
        this.messages = messages;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> send(@RequestBody Map<String, Object> body) {
        Message m = new Message();
        m.name = Input.text(body, "name", 80);
        m.email = Input.text(body, "email", 120);
        m.subject = Input.text(body, "subject", 80);
        m.message = Input.text(body, "message", 2000);
        if (m.name.length() < 2 || !Input.validEmail(m.email) || m.subject.isEmpty() || m.message.length() < 10)
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Fill in your name, email, topic and a message of at least 10 characters.");
        messages.save(m);
        return Map.of("ok", true);
    }
}