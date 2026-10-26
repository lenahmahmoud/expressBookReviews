const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.some((user) => user.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Task 1: Get the list of all books
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).send(JSON.stringify(book, null, 4));
    }
    return res.status(404).json({ message: "Book not found" });
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const result = Object.keys(books)
        .filter((key) => books[key].author.toLowerCase() === author)
        .map((key) => ({ isbn: key, ...books[key] }));

    if (result.length > 0) {
        return res.status(200).send(JSON.stringify({ booksbyauthor: result }, null, 4));
    }
    return res.status(404).json({ message: "No books found for this author" });
});

// Task 4: Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const result = Object.keys(books)
        .filter((key) => books[key].title.toLowerCase() === title)
        .map((key) => ({ isbn: key, ...books[key] }));

    if (result.length > 0) {
        return res.status(200).send(JSON.stringify({ booksbytitle: result }, null, 4));
    }
    return res.status(404).json({ message: "No books found with this title" });
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    if (Object.keys(book.reviews).length === 0) {
        return res.status(200).json({ message: "No reviews found for this book." });
    }
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
});

// Shared error handler for the Axios routes
const handleAxiosError = (res, error, fallback) => {
    if (error.response) {
        return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ message: fallback });
};

// Task 10: Get all books using async/await with Axios
public_users.get('/async/books', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        return handleAxiosError(res, error, "Error fetching books");
    }
});

// Task 11: Get book by ISBN using async/await with Axios
public_users.get('/async/isbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/isbn/${encodeURIComponent(req.params.isbn)}`);
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        return handleAxiosError(res, error, "Error fetching book by ISBN");
    }
});

// Task 12: Get books by author using async/await with Axios
public_users.get('/async/author/:author', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(req.params.author)}`);
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        return handleAxiosError(res, error, "Error fetching books by author");
    }
});

// Task 13: Get books by title using async/await with Axios
public_users.get('/async/title/:title', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(req.params.title)}`);
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        return handleAxiosError(res, error, "Error fetching books by title");
    }
});

module.exports.general = public_users;