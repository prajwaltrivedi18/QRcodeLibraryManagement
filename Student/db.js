const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const dotenv = require("dotenv")
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
// h = "localhost"
// r="root"
// p=""
// db="lib"
// const connection = mysql.createConnection({
//   host: process.env.localhost,
//   user: process.env.root,
//   password: process.env,
//   database: process.env.lib,
//   port: 3306, // Corrected the port to 3306
// });
// dotenv.config({ path: './config.env' });
// PORT=3001
// DB_HOST='localhost'
// DB_PORT=3306
// DB_USER='root'
// DB_PASSWORD=''
// DB_NAME='lib'
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lib',
  port:3306,
});
// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// })
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the MySQL database");
});
app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");

})
app.get("/select",function(req,res){
  res.render('select-book');
})
app.post("/select", function (req, res) {
  const query = "SELECT * FROM allbooks";
  connection.query(query, function (err, data) {
    if (err) throw err;
    res.render("select-book", { books: data });
  });
});

app.post("/book", function (req, res) {
  const bookId = req.body.bookId;
  const query = "SELECT * FROM allbooks WHERE bid = ?";
  connection.query(query, [bookId], function (err, data) {
    if (err) throw err;
    res.render("book-details", { book: data[0] });
  });
});
app.get("/enter",function(req,res){
  res.render('book-details');
})
app.post("/enter",function(req,res){
  const { usn, sname, bid,bn,author,publication} = req.body;
  const data = { usn, sname, bid,bn,author,publication};
    // const data = { usn, sname, bid,bn,author,publication};
    // const q2='SELECT * FROM issued WHERE usn = usn';
    const query1 = 'INSERT INTO issued SET ?';
    // connection.query(q2, function(errr,rest){
      // if(q2){
      // res.send("You have already borrowed a book. Please return it.");
      // res.send(rest);
      // }
      // else{
        connection.query(query1, data, (err, result) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              res.send('<script>alert("You have already borrowed a book. Please return it."); window.location.href = "/";</script>');
            } else {
              console.error('Error:', err);
              res.status(500).send('Internal Server Error');
            }
          } else {
            console.log('Data inserted successfully');
            res.send('<script>alert("Book issued"); window.location.href = "/";</script>');
           
          }
        });
    })
    // app.use('/.netlify/db', app);
app.listen(3001, function () { // Changed the server port to 3000
  console.log("Server is running on port 3000");
});







// const express = require("express");
// const bodyParser = require("body-parser");
// const mysql = require("mysql");

// const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.set("view engine", "ejs");
// app.use(express.static("public"));

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "SQL@1234",
//   database: "lib",
//   port: 3306,
// });

// connection.connect((err) => {
//   if (err) throw err;
//   console.log("Connected to the MySQL database");
// });

// app.get("/", function (req, res) {
//   const query = "SELECT * FROM allbooks";
//   connection.query(query, function (err, data) {
//     if (err) throw err;
//     res.render("select-book", { books: data });
//   });
// });

// app.post("/book", function (req, res) {
//   const bookId = req.body.bookId;
//   const query = "SELECT * FROM allbooks WHERE bid = ?";
//   connection.query(query, [bookId], function (err, data) {
//     if (err) throw err;
//     res.render("book-details", { book: data[0] });
//   });
// });

// app.post("/borrow", function (req, res) {
//   const studentName = req.body.studentName;
//   const bookId = req.body.bookId;

//   const insertQuery = "INSERT INTO borrowed_books (studentName, bookId) VALUES (?, ?)";
//   connection.query(insertQuery, [studentName, bookId], function (err, result) {
//     if (err) throw err;
//     console.log("Book borrowed successfully");
//     res.redirect("/");
//   });
// });

// app.listen(3000, function () {
//   console.log("Server is running on port 3000");
// });
