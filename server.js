// / require('dotenv').config();
const express = require("express");
var mysql = require('mysql');
const cors = require("cors");
const { query } = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const jwt = require("jsonwebtoken");


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'social_portal'
});
connection.connect();



const author = (req, res, next) => {
    const token =  req.body.user?req.body.user.data.token:null;
    if(!token){
        console.log("need token!")
        res.send("Need a token");
    }
    else{
        jwt.verify(token, process.env.KEY, (error, decoded) => {
            if(error){
                console.log("Verification Failed");
                res.json("VF")
            }
            else{
                req.userId = decoded.id;
                console.log("Done")
                next();
            }
        })
    }
}









app.get('/', (req, res) => {
    res.send('Server Running');
});

app.post('/login', author, (req, res) => {

});

app.post('/signup', (req, res) => {
    const { username, password, email, phone_number } = req.body;
    connection.query(`INSERT INTO sign_in (user_id, password, email, phone_number) VALUES ('${username}', '${password}', '${email}', '${phone_number}')`, (err, result) => {
        if(err){
            console.log(err);
            res.send("Error");
        }
        else {
            connection.query(`INSERT INTO users (user_id) VALUES ('${username}');`, (err, result) => {
                if (err) {
                    console.log(err);
                    res.send("Error");
                }
                else {
                    const token = jwt.sign({ id: result.insertId },"Hello");
                    res.json({ username, token });
                };
            });
            // res.send("Error");        
        }
    })
});

app.post('/profile', async (req, res) => {
    console.log(req.body)
    const data = req.body;
    var c = 0;// update with each query run
    for (var x in data) {
        if (x !== 'userId') {            
             connection.query(`UPDATE users SET ${x} = '${data[x]}' WHERE user_id = '${data.userId}';`, (err, result) => {
                if (err) {
                    console.log(err);
                    res.send("Error");
                }
                else {
                    console.log("123")
                    c++;
                    console.log(c)
                }
            });
        }
    }
    console.log(c)
    res.json({fields_updated: c});
});


app.post('/request', (req, res) => {
    const userId = req.userId;
    const query = `SELECT allie_id, name from requests,users WHERE requests.user_id = ${userId} AND requests.allie_id = users.id;`;
    connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error");
        }
        else {
            res.send(result);
        }
    });
});

app.post('/friends', (req, res) => {
});

app.post('/posts', (req, res) => {

});

app.post('/home', (req, res) => {
});

app.post('/admin', (req, res) => {
});

app.post('/compaints', (req, res) => {
});

    
    

//Listening on port 5000
app.listen(process.env.PORT || 5000, () => {
    console.log("Running on port 5000");
});