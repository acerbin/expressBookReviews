const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const {username, password} = req.body;
    if(!isValid(username)) {
        return res.status(400).send("Account already exists with the given username.");
    }
    
    if(username && password && isValid(username)) {
        users.push({username, password})
        res.status(200).send("Sucessfully created user " + username);
    } else {
        res.status(400).send("Please, provide valid username and password.");
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    console.log(JSON.stringify(books))
    res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res, next) {
    const isbn = req.params.isbn;
    let result;
    if (isbn) {
        result = books[isbn];
    }
    if(!result) {
        res.status(404).json({"message": "Resource not found"})
    } else {
        res.status(200).json(result);
    }

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res, next) {
    const author = req.params.author;
    let result = [];
    if (author) {

        for (let isbn in books) {
            if(books[isbn].author === author) {
                result.push(books[isbn])
            }
        }
    }
    if(!result || result.length < 1) {
        res.status(404).json({"message": "Resource not found"})
    } else {
        res.status(200).json(result);
    }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let result = [];
    if (title) {

        for (let isbn in books) {
            if(books[isbn].title === title) {
                result.push(books[isbn])
            }
        }
    }
    if(!result || result.length < 1) {
        res.status(404).json({"message": "Resource not found"})
    } else {
        res.status(200).json(result);
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let result;
    if (isbn) {
        result = books[isbn].reviews;
    }
    if(!result) {
        res.status(404).json({"message": "Resource not found"})
    } else {
        res.status(200).json(result);
    }
});


// Task 10: Get all books - Using Callback

const getBooks = () => {
    axios.get('http://localhost:5000')
    .then((response) => {
        console.log(response.data);
    })
    .catch((error) => {
        console.log(error);
    })
}
// getBooks()

// Task 11: Search by ISBN – Using Promises
const getBooksByISBN = (isbn) => { 
    return new Promise((resolve, reject) => {
        try {
            const books = axios.get(`http://localhost:5000/isbn/${isbn}`).then((books) => {
                resolve(books.data)
            })           
        } catch (err) {
            reject(err)
        }
    })
}

// getBooksByISBN(2).then(
//     (books) => console.log(books),
//     (err) => console.log(err)
// )

// Task 12: Search by Author – Async / Await
const getBooksByAuthor = async(author) => {
    let booksData;
    try {
        booksData = await axios.get(`http://localhost:5000/author/${author}`)
    } catch(error) {
        console.log(error)
        return;
    }
    console.log(booksData.data)
}

//getBooksByAuthor("Unknown")

// Task 13: Search by Title – Async / Await
const getBooksByTitle = async(title) => {
    let booksData;
    try {
        booksData = await axios.get(`http://localhost:5000/title/${title}`)
    } catch(error) {
        console.log(error)
        return;
    }
    console.log(booksData.data)
}

// getBooksByTitle("The Book Of Job")

module.exports.general = public_users;
