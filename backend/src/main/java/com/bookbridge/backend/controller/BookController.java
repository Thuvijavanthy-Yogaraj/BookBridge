package com.bookbridge.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.bookbridge.backend.ApiException;
import com.bookbridge.backend.AuthService;
import com.bookbridge.backend.Input;
import com.bookbridge.backend.SampleData;
import com.bookbridge.backend.model.Book;
import com.bookbridge.backend.model.User;
import com.bookbridge.backend.repository.BookRepository;
import com.bookbridge.backend.repository.FavouriteRepository;

/** Browse, search, list and remove books. */
@RestController
@RequestMapping("/api")
public class BookController {
    private static final List<String> CONDITIONS = List.of("Like new", "Good", "Fair");
    private static final List<String> TYPES = List.of("sell", "free", "swap");

    private final BookRepository books;
    private final FavouriteRepository favourites;
    private final SampleData data;
    private final AuthService auth;

    public BookController(BookRepository books, FavouriteRepository favourites, SampleData data, AuthService auth) {
        this.books = books;
        this.favourites = favourites;
        this.data = data;
        this.auth = auth;
    }

    @GetMapping("/categories")
    public List<Map<String, String>> categories() {
        return data.categories();
    }

    /** /api/books?q=python&category=cs&type=free  (every filter is optional) */
    @GetMapping("/books")
    public List<Book> list(@RequestParam(defaultValue = "") String q,
                           @RequestParam(defaultValue = "") String category,
                           @RequestParam(defaultValue = "") String type) {
        String find = q.trim().toLowerCase();
        return books.findAll().stream()
                .filter(b -> find.isEmpty() || b.title.toLowerCase().contains(find) || b.author.toLowerCase().contains(find))
                .filter(b -> category.isEmpty() || category.equals(b.category))
                .filter(b -> type.isEmpty() || type.equals(b.type))
                .toList();
    }

    @GetMapping("/books/{id}")
    public Book one(@PathVariable Long id) {
        return books.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Book not found."));
    }

    @GetMapping("/my/books")
    public List<Book> mine(@RequestHeader(value = "Authorization", required = false) String header) {
        return books.findByOwnerIdOrderByIdDesc(auth.require(header).id);
    }

    @PostMapping("/books")
    @ResponseStatus(HttpStatus.CREATED)
    public Book create(@RequestHeader(value = "Authorization", required = false) String header,
                       @RequestBody Map<String, Object> body) {
        User user = auth.require(header);
        String title = Input.text(body, "title", 200);
        String author = Input.text(body, "author", 200);
        String category = Input.text(body, "category", 20);
        String condition = Input.text(body, "condition", 20);
        String type = Input.text(body, "type", 10);
        String wants = Input.text(body, "wants", 200);
        String place = Input.text(body, "place", 200);
        String image = Input.text(body, "image", 1_000_000);
        int price = (int) Input.number(body, "price");

        if (title.length() < 2) throw new ApiException(HttpStatus.BAD_REQUEST, "Enter the book title.");
        if (author.length() < 2) throw new ApiException(HttpStatus.BAD_REQUEST, "Enter the author.");
        if (!data.hasCategory(category)) throw new ApiException(HttpStatus.BAD_REQUEST, "Choose a category.");
        if (!CONDITIONS.contains(condition)) throw new ApiException(HttpStatus.BAD_REQUEST, "Choose a condition.");
        if (!TYPES.contains(type)) throw new ApiException(HttpStatus.BAD_REQUEST, "Choose sell, free or swap.");
        if (type.equals("sell") && price <= 0) throw new ApiException(HttpStatus.BAD_REQUEST, "Enter a price above 0.");
        if (type.equals("swap") && wants.length() < 2)
            throw new ApiException(HttpStatus.BAD_REQUEST, "Say what you'd like in return.");
        if (!image.isEmpty() && !image.startsWith("data:image/"))
            throw new ApiException(HttpStatus.BAD_REQUEST, "The cover must be an image.");

        Book b = new Book();
        b.title = title;
        b.author = author;
        b.category = category;
        b.condition = condition;
        b.type = type;
        b.price = type.equals("sell") ? price : 0;
        b.wants = type.equals("swap") ? wants : "";
        b.description = Input.text(body, "description", 1000);
        b.place = place.isEmpty() ? "Campus library entrance" : place;
        b.image = image;
        b.ownerId = user.id;
        b.ownerName = user.name;
        return books.save(b);
    }

    /** Only the owner can remove a listing. */
    @DeleteMapping("/books/{id}")
    @Transactional
    public Map<String, Object> delete(@RequestHeader(value = "Authorization", required = false) String header,
                                      @PathVariable Long id) {
        User user = auth.require(header);
        Book b = books.findById(id).orElse(null);
        if (b == null || !user.id.equals(b.ownerId))
            throw new ApiException(HttpStatus.NOT_FOUND, "That isn't one of your listings.");
        favourites.deleteByBookId(id);
        books.delete(b);
        return Map.of("ok", true);
    }
}