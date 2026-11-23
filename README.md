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
| Frontend | React 19, React Router 7, Vite |
| Backend | Java 21, Spring Boot 3.5, Spring Data JPA |
| Database | MySQL 8 |

## Project structure

```
BookBridge/
  frontend-react/   React website (Vite)
    public/         favicon
    src/
      pages/        Home, Login, Register, Profile, Settings, Contact, ListBook
      components/   Header, Footer, Browse, BookCard, BookModal, Field, ...
      context/      AppContext: session, books, favourites, orders
      lib/          API client, form hook, book helpers
      data/         categories and sample books
  backend/          Spring Boot REST API
```

## How to run

### Requirements

- Java 21
- MySQL 8, running on port 3306
- Node.js 20 or newer (for the React frontend)

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

On macOS or Linux, use `./mvnw spring-boot:run`. Wait for `Started BackendApplication`. The API runs at `http://localhost:8081/api`.

### 3. Start the website

```
cd frontend-react
npm install
npm run dev
```

The site opens at `http://localhost:5173`. It talks to the API at `http://localhost:8081/api`; to use a different address, copy `.env.example` to `.env` and change `VITE_API_URL`.

To build a production version, run `npm run build`. The finished site is in `frontend-react/dist`. When you host it, send every unknown path to `index.html` so links like `/profile` work on refresh.

### Pages

| Route | Page |
|---|---|
| `/` | Home, browse and search |
| `/login`, `/register` | Log in, create an account |
| `/profile` | Saved books, orders and listings |
| `/settings` | Account details and deletion |
| `/list-book` | Share a book (`?type=free` or `?type=swap` preselects the type) |
| `/contact` | Contact form |

Old addresses such as `/login.html` redirect to the new routes.

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