// var http = require("http");
const express=require("express");
// var router = express.Router();
// const https=require("https");
const bodyParser=require("body-parser");
const app=express();
const PORT = process.env.PORT || 2022
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


// var bname;
// const {createPool}=require('mysql');
// const pool =createPool({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "lib",
//     connectionLimit:10
// })
// var inc;
// // pool.connect();
// // pool.query('select * from allbooks',(err,result,fields)=>{
// //     if(err){
// / return console.log(err);
// //     }
// //     return console.log(result);
// // })
// // http
// //   .createServer(function (req, res) {
// //     if (req.url == "/list.html") {
// //       // redirect to page-b.html with 301 (Moved Permanently) HTTP code in the response
// //       res.writeHead(301, { Location: "http://" + req.headers["host"] + "/enter.html" });
// //       return res.end();
// //   }
// // })

// // Importing MySQL module
// const mysql = require("mysql");
  
// // Creating connection
// // let db_con = mysql.createConnection({
// //   host: "localhost",
// //   user: "root",
// //   password: "",
// //   database: "lib"
// // });
  
// // Connect to MySQL server
// // db_con.connect((err) => {
// //   if (err) {
// //     console.log("Database Connection Failed !!!", err);
// //   } else {
// //     console.log("connected to Database");
// //   }
// // });
  
// // module.exports = db_con;
// app.get("/",function(req,res){
//     res.sendFile(__dirname+ "/list.html");
//     // bname=req.body.book;
//     // var sql1 = 'INSERT INTO allbooks VALUES (bname, 1)';
//     // pool.query(sql1, bname,function (err) { 
//     //     if (err){
//     //         res.send(err);
//     //     }
//     //     else{
//     //         res.send("Book added");
//     //     }
//     // })
// });
// app.post("/enter",function(req,res){

//     res.sendFile(__dirname+ "/enter.ejs");
//     bname=req.body.book;

//   res.render("enter", { book: bname});

// app.post("/",function(req,res){
    
//     const details=req.body;
//     // inc=req.body.ret;
//     // if(inc==false){
//         // res.redirect("/enter");
//     // }
//     // else if(inc==true){
//         var sql2 = 'INSERT INTO issued SET ?';
//         pool.query(sql2, details,function (err) { 
//             if (err){
//                 res.send("Reload or go back");
//                 // res.send("You already have a borrowed book. Please return it.");
//             }
//             // res.send(inc);
//             // if(inc=="true")
//             // else
//             res.send("Book issued"); 
//     //         // res.send(http.STATUS_CODES)
//     })
//     }
// );
 
// })
var totalb,totali;
const mysql = require('mysql');
const { unzipSync } = require("zlib");
var bn;
var susn;
var sn;
const errors = [];

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lib',
  port:3306,
});
var bid;
var bname;
var sem;
var count;
// app.use(express.static('public'));    
// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database');
});
// var sq1="SELECT COUNT(bid) from allbooks;";
// connection.query(sq1, function (err, count, fields) {
//   if (err) throw err;

app.get('/',function(req,res){
  res.sendFile(__dirname+"/main1.html");
  // var sq1= "SELECT COUNT (bid) FROM allbooks;";
  // connection.query(sq1, function (err, count, fields) {
  //   // if (err) throw err;
  //   var c=count;
  //   // res.render('all', { title: 'List of books', booklist: data});
  //   // res.redirect("/enter");
  // });
  // app.getElementById("totalb").textContent=c;
})

app.get('/all', (req, res) => {
  res.render('all');

});
app.post('/all', function(req, res) {
  var sql='SELECT * FROM allbooks';
  connection.query(sql, function (err, data, fields) {
  if (err) throw err;
  res.render('all', { title: 'List of books', bookData: data});
  // res.redirect("/enter");
});
});

app.get('/stud', (req, res) => {
  res.render('stud');

});
app.post('/stud', function(req, res) {
  var sql1='SELECT * FROM issued';
  connection.query(sql1, function (err, data, fields) {
  if (err) throw err;
  res.render('stud', { title: 'List of issued books', studlist: data});
  
});
});


app.get('/add1', (req, res) => {
  res.render('add1');

});
app.post('/add1', function (req, res) {
  const { bid, bname,author,publication } = req.body;
  const data = { bid, bname,author, publication};
  const q1 = 'INSERT INTO allbooks SET ?';

  connection.query(q1, data, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.send('<script>alert("Book is already present in the library."); window.location.href = "/add1";</script>');
      } else {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
      }
    } else {
      console.log('Data inserted successfully');
      res.send('<script>alert("Book added successfully"); window.location.href = "/add1";</script>');
     
    }
  });
});
app.get('/del', (req, res) => {
  res.render('del');

});
app.post('/del',function(req,res){
  var sql1='SELECT * FROM allbooks';
  connection.query(sql1, function (err, data, fields) {
  if (err) throw err;
  res.render('del', { title: 'List of books', bookD: data});
  // res.redirect("/enter");
})
})
app.get('/delete/:id', function(req, res, next) {
  var id= req.params.id;
    var q3 = 'DELETE FROM allbooks WHERE bid = ?';
  connection.query(q3, [id], function (err, data) {
    if (err) throw err;
    res.send('<script>alert("Book deleted"); window.location.href = "/";</script>');
  });
})
app.get('/ret/:susn',function(req,res,next){
  var susn= req.params.susn;
  var q4 = 'DELETE FROM issued WHERE usn = ?';
connection.query(q4, [susn], function (err, data) {
  if (err) throw err;
  res.send('<script>alert("Student has returned the book"); window.location.href = "/";</script>');
});
})

app.listen(2022);