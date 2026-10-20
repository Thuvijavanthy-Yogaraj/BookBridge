package com.bookbridge.backend;

import org.springframework.http.HttpStatus;

/** Thrown anywhere in the API; ErrorHandler turns it into {"error": "..."} */
public class ApiException extends RuntimeException {
    public final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }
}