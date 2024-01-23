const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const axios = require('axios');


const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;



const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization) {
        const token = req.session.authorization['accessToken']
        jwt.verify(token, "access", (err, user) => {
            if(!err) {
                req.user = user;
                next()
            } else {
                console.log("Incorrect password supplied")
                res.status(403).send("Please, login to access this resource")
            }
        } )

    } else {
        res.status(403).send("Please, login to access this resource")
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

// Task 12: Search by Title – Async / Await
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

const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
