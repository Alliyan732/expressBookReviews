const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "Unable to register user, Incomplete Information Provided!" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Write your code here
  const getBookList = new Promise(function(resolve, reject) {
    const books_string = JSON.stringify(books);
    resolve(books_string);
  });

  getBookList
    .then(function(books_string) {
      return res.status(200).send(books_string);
    })
    .catch(function(error) {
      return res.status(500).send('Error retrieving book list');
    });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Write your code here
  const isbn = req.params.isbn;

  const getBookByISBN = new Promise(function(resolve, reject) {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error('Book not found'));
    }
  });

  getBookByISBN
    .then(function(book) {
      return res.status(200).json(book);
    })
    .catch(function(error) {
      return res.status(404).send('Book not found');
    });
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // Write your code here
  const author = req.params.author;

  const filterBooksByAuthor = new Promise(function(resolve, reject) {
    const filteredResult = Object.values(books).filter(book => book.author === author);
    if (filteredResult.length > 0) {
      resolve(filteredResult);
    } else {
      reject(new Error('No books found for the provided author'));
    }
  });

  filterBooksByAuthor
    .then(function(filteredResult) {
      return res.status(200).json(filteredResult);
    })
    .catch(function(error) {
      return res.status(404).send('No books found for the provided author');
    });
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  // Write your code here
  const title = req.params.title;

  const filterBooksByTitle = new Promise(function(resolve, reject) {
    const filteredResult = Object.values(books).filter(book => book.title === title);
    if (filteredResult.length > 0) {
      resolve(filteredResult);
    } else {
      reject(new Error('No books found for the provided title'));
    }
  });

  filterBooksByTitle
    .then(function(filteredResult) {
      return res.status(200).json(filteredResult);
    })
    .catch(function(error) {
      return res.status(404).send('No books found for the provided title');
    });
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  // Write your code here
  const isbn = req.params.isbn;

  const getBookReviews = new Promise(function(resolve, reject) {
    const book = books[isbn];
    if (book && book.reviews) {
      resolve(book.reviews);
    } else {
      reject(new Error('No reviews found for the provided ISBN'));
    }
  });

  getBookReviews
    .then(function(reviews) {
      return res.status(200).json(reviews);
    })
    .catch(function(error) {
      return res.status(404).send('No reviews found for the provided ISBN');
    });
});


module.exports.general = public_users;
