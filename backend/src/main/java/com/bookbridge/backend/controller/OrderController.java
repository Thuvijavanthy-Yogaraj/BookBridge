package com.bookbridge.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.bookbridge.backend.ApiException;
import com.bookbridge.backend.AuthService;
import com.bookbridge.backend.Input;
import com.bookbridge.backend.model.Book;
import com.bookbridge.backend.model.BookOrder;
import com.bookbridge.backend.model.User;
import com.bookbridge.backend.repository.BookRepository;
import com.bookbridge.backend.repository.OrderRepository;

/** Buying a book, requesting a free one, or proposing an exchange. */
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderRepository orders;
    private final BookRepository books;
    private final AuthService auth;

    public OrderController(OrderRepository orders, BookRepository books, AuthService auth) {
        this.orders = orders;
        this.books = books;
        this.auth = auth;
    }

    @GetMapping
    public List<BookOrder> list(@RequestHeader(value = "Authorization", required = false) String header) {
        return orders.findByUserIdOrderByIdDesc(auth.require(header).id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookOrder create(@RequestHeader(value = "Authorization", required = false) String header,
                            @RequestBody Map<String, Object> body) {
        User user = auth.require(header);
        Book book = books.findById(Input.number(body, "bookId"))
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Book not found."));
        if (user.id.equals(book.ownerId)) throw new ApiException(HttpStatus.BAD_REQUEST, "This is your own listing.");

        String offer = Input.text(body, "offer", 200);
        if (book.type.equals("swap") && offer.isEmpty())
            throw new ApiException(HttpStatus.BAD_REQUEST, "Tell them which book you'd offer.");
        String pickup = Input.text(body, "pickup", 60);

        BookOrder o = new BookOrder();
        o.userId = user.id;
        o.bookId = book.id;
        o.title = book.title;
        o.type = book.type;
        o.price = book.price;
        o.pickup = pickup.isEmpty() ? "Meet on campus" : pickup;
        o.note = Input.text(body, "note", 500);
        o.offer = offer;
        o.status = book.type.equals("sell") ? "Order placed"
                 : book.type.equals("free") ? "Request sent" : "Exchange proposed";
        return orders.save(o);
    }
}