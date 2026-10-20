# BookBridge

BookBridge is a student book exchange. Students can browse used books, buy them, swap them, or give them away for free, and list their own books.

## Features

- Browse and search books by title, author or category, and sort by price, condition or title
- Free Shelf and Exchange Shelf
- Register and log in (passwords are stored hashed with BCrypt)
- Save books to favourites
- Order a book, request a free one, or propose an exchange
- List your own books, with an optional cover photo
- Profile page with saved books, orders and listings
- Account settings and account deletion
- Contact form

## Tech stack

| Part | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Java 21, Spring Boot 3.5, Spring Data JPA |
| Database | MySQL 8 |

## Project structure

```
BookBridge/
  Frontend/   website pages, styles, scripts and images
  backend/    Spring Boot REST API
```

## How to run

### Requirements

- Java 21
- MySQL 8, running on port 3306

### 1. Set the database password

Create a file named `secret.properties` inside the `backend` folder, containing one line with your MySQL root password:

```
spring.datasource.password=your_mysql_password
```

This file is not uploaded to GitHub. The `bookbridge` database and its tables are created automatically on the first run, along with 44 sample books.

### 2. Start the backend

```
cd backend
.\mvnw.cmd spring-boot:run
```

On macOS or Linux, use `./mvnw spring-boot:run`. Wait for `Started BackendApplication`. The API runs at `http://localhost:8080/api`.

### 3. Open the website

Open `Frontend/index.html` in a browser while the backend is running.

## API

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/register` | Create an account |
| POST | `/api/login` | Log in |
| POST | `/api/logout` | Log out |
| GET, PUT, DELETE | `/api/me` | View, update or delete your account |
| GET | `/api/categories` | List categories |
| GET | `/api/books` | List and search books (`q`, `category`, `type`) |
| GET | `/api/books/{id}` | One book |
| POST | `/api/books` | List a book |
| DELETE | `/api/books/{id}` | Remove your listing |
| GET | `/api/my/books` | Your listings |
| GET | `/api/favourites` | Your saved books |
| PUT, DELETE | `/api/favourites/{bookId}` | Save or unsave a book |
| GET, POST | `/api/orders` | Your orders, or place an order |
| POST | `/api/contact` | Send a contact message |

Routes that need a login expect the header `Authorization: Bearer <token>`, using the token returned by register or login.

## Author

Thuvijavanthy Yogaraj