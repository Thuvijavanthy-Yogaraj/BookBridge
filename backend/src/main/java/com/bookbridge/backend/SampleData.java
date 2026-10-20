package com.bookbridge.backend;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.bookbridge.backend.model.Book;
import com.bookbridge.backend.repository.BookRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/** Reads seed.json: the category list, and the sample books added the first time the app starts. */
@Component
public class SampleData implements CommandLineRunner {
    private final BookRepository books;
    private final JsonNode seed;
    private final List<Map<String, String>> categories;

    public SampleData(BookRepository books, ObjectMapper mapper) throws Exception {
        this.books = books;
        try (InputStream in = new ClassPathResource("seed.json").getInputStream()) {
            this.seed = mapper.readTree(in);
        }
        this.categories = mapper.convertValue(seed.get("categories"), new TypeReference<List<Map<String, String>>>() {});
    }

    public List<Map<String, String>> categories() {
        return categories;
    }

    public boolean hasCategory(String id) {
        return categories.stream().anyMatch(c -> id.equals(c.get("id")));
    }

    @Override
    public void run(String... args) {
        if (books.count() > 0) return;
        for (JsonNode n : seed.get("books")) {
            Book b = new Book();
            b.title = n.get("title").asText();
            b.author = n.get("author").asText();
            b.category = n.get("category").asText();
            b.condition = n.get("condition").asText();
            b.type = n.get("type").asText();
            b.price = n.get("price").asInt();
            b.wants = n.get("wants").asText();
            b.isbn = n.get("isbn").asText();
            b.ownerName = n.get("ownerName").asText();
            b.place = "Campus library entrance";
            books.save(b);
        }
        System.out.println("Added " + books.count() + " sample books");
    }
}