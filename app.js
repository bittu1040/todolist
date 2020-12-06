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
 
 
app.post('/login', function (req, res, next) {
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
                res.json({
                    success: "login can be done",
                    userid: result[0].id
                })
            }
            else {
                res.json({ success: "wrong password" })
            }
        }
 
    })
})
 
app.post('/registration', function (req, res, next) {
    req.body.created_on = moment().format('YYYY-MM-DD HH:mm:ss');
    sql1 = `SELECT * FROM users WHERE name = "${req.body.name}"`;
    con.query(sql1, function (error, result) {
        if (error) {
            throw error;
        }
        else if (result.length == 1) {
            return res.json({ success: 'user exist' });
        }
        else {
            sql2 = `INSERT INTO users(name,password,created_on) VALUES("${req.body.name}","${req.body.password}", "${req.body.created_on}")`
            con.query(sql2, function (error, result) {
                if (error) {
                    throw error;
                    //return res.json({success: 'error'})
                }
                else {
                    return res.json({ success: 'new registration done' }); ``
                }
            });
        }
    });
});
 
app.post('/insertpost', function (req, res, next) {
    sql = `INSERT INTO notes (notes,user_id, updated_on,deleted_on) VALUES("${req.body.notes}","${req.body.user_id}", NOW(), NOW())`
    con.query(sql, function (error, result) {
        if (error) throw error;
        const response = {
            success: true
        };
        res.json(response);
    });
});
 
var myLogger = function (req, res, next) {
    if (!req.headers.userid) {
        res.json({ success: "unauthorised", code: "401" })
        return;
    }
    sql = `SELECT * from users WHERE id = "${req.headers.userid}"`
    con.query(sql, function (error, result) {
        if (error) throw error;
        if (result.length == 1) {
            req.userInfo = result[0];
            next()
 
        }
        else {
            res.json({ success: "unauthorised", code: "401" })
        }
    })
}
 
app.post('/test', myLogger, function (req, res, next) {
 
    res.json({ success: "authorised", user: req.userInfo })
})
 
 
app.post('/testapi', function (req, res, next) {
    sql = `SELECT * FROM users`
    con.query(sql, function (error, result) {
        if (error) throw error;
        res.json(result);
    });
});
 
app.listen(3000, function () {
    console.log("app listening on 3000 port")
});
