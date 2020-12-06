const mysql = require('mysql');
const express = require("express");
const app = express();
var bodyParser = require('body-parser');
const moment = require("moment");
const jwt = require("jsonwebtoken");
 
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mysql@strong",
    database: "todolist"
});
 
const secret = "secretKey";
app.use(bodyParser.json());



app.post('/api/posts', verifyToken, (req,res)=>{
    jwt.verify(req.token, "secretkey", (err,authData)=>{
        if(err){
            res.sendStatus(403)
        }
        else {
            res.json({
                message:"post created",
                authData
            });
        }
    });
});
 
 
app.post('/api/login', function (req, res, next) {
    sql = `SELECT * from users WHERE name = "${req.body.name}"`
    con.query(sql, function (error, result) {
        if (error) {
            throw error;
        }
        else if (result.length == 0) {
            res.json({ success: "user doesn't exist", })
            //console.log(result)
 
        }
        else if (result.length == 1) {
            if (result[0].password == req.body.password) {
                jwt.sign({user:result[0]},"secretkey", (err,token)=>{
                    res.json({
                        token, sucess:"login can be done"
                    })
                })
                // res.json({
                //     success: "login can be done",
                //     userid: result[0].id,
                //     result: result
                // })
            }
            else {
                res.json({ success: "wrong password" })
            }
        }
 
    })
})
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1]
        req.token = bearerToken
        next()
    }
    else {
        res.sendStatus(403)
    }
}
 
app.listen(3000, function () {
    console.log("app listening on 3000 port")
});
