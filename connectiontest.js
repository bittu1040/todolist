const mysql = require('mysql');
const express = require("express");
const app = express();


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mysql@strong",
    database: "todolist"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

app.listen(3000, function () {
    console.log("app listening on 3000 port")
});