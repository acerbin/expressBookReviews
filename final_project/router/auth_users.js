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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
