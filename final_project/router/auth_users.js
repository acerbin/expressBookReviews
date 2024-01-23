const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    const matchedUsers = users.filter((user) => {
        return user.username === username;
    })
    if(matchedUsers.length > 0) {
        return false;
    }
    return true;
}


const authenticatedUser = (username, password) => {
    const validUsers = users.filter((user) => {
        return (user.username === username) && (user.password === password)
    })

    if (validUsers.length > 0) return true;

    return false;
}



//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        res.status(404).send("Please, provide valid credentials.")
    } 
    if(authenticatedUser(username, password)) {
        const accessToken = jwt.sign({
            data: password
        },'access', {expiresIn : 60 * 60 * 60});
        req.session.authorization = { accessToken, username}
        return res.status(200).send('User logged in')
    } else {
        return res.status(208).send('Login failed')
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const review = req.query.review;
    if(!review || !book) {
        return res.status(400).json({message: "Cannot add review, please review your data."})
    }
    books[isbn].reviews[req.session.authorization.username] = review;
    res.status(200).json({
        book : books[isbn].title,
        review: books[isbn].reviews[req.session.authorization.username]
    })
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => { 
    const isbn = req.params.isbn;
    const book = books[isbn];
    if(!book) {
        return res.status(400).json({message: "Cannot delete review, please review your data."})
    }
    books[isbn].reviews[req.session.authorization.username] = {};
    res.status(200).json({
        book : books[isbn].title,
        review: {}
    })

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
