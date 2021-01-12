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


// create a new note
app.post('/api/note', verifyToken, (req, res) => {
    sql = `insert into notes (notes, user_id, updated_on, deleted_on) values ("${req.body.notes}","${req.userInfo.id}" , now(), now()); `
    con.query(sql, function (error, result) {
        if (error) throw error
        res.json({ success: true, message: "new note created", resmsg: req.body.notes })
    })
    // res.json({
    // message: "post created",
    // userInfo: req.userInfo
    //});
});

// update a note
app.put('/api/note/:noteId', verifyToken, (req, res) => {
    sql = `update notes set notes="${req.body.notes}" where id= "${req.userInfo.id}"`
    con.query(sql, function (error,result) {
        if (error) throw error;
        res.json({
            message: "post updated",
            userInfo: req.userInfo,
            updatednotes: req.body.notes
        });
    });
});

// delete a note
app.delete('/api/note/:id', verifyToken, (req, res) => {
    sql = `delete from notes where id= "${req.params.id}"`
    con.query(sql, function (error, result) {
        if (error) throw error;
        res.json({
            message: "post deleted",
            userInfo: req.userInfo
        });
    });
});


// get just one single note
app.get('/api/note/:id', verifyToken, (req, res) => {
    sql = `Select * from notes where id="${req.params.id}"`
    con.query(sql, function (error, result) {
        if (error) throw error;
        res.json({
            message: "get single note ",
            message1: result,
            userInfo: req.userInfo
        });
    });
});

// get all notes
app.get('/api/note', verifyToken, (req, res) => {
    sql = `Select * from notes where user_id="${req.userInfo.id}"`
    con.query(sql, function (error, result) {
        if (error) throw error;
        res.json({
            message: result,
            userInfo: req.userInfo,
            userId: req.userInfo.id

        });
    });
});

// login
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
                jwt.sign({ user: result[0] }, "secretkey", (err, token) => {
                    res.json({
                        token: token, sucess: "login can be done"
                    })
                })
            }
            else {
                res.json({ success: "wrong password" })
            }
        }

    })
})

//registration
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
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1]
        jwt.verify(bearerToken, "secretkey", (err, authData) => {
            if (err) {
                res.sendStatus(403)
            }
            else {
                req.userInfo = authData.user
                next()
            }
        });
    }
    else {
        res.sendStatus(403)
    }
}



app.listen(3000, function () {
    console.log("app listening on 3000 port")
});
