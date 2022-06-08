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
    const token =  req.body?req.body.token:null;
    if(!token){
        console.log("need token!")
        res.send("Need a token");
    }
    else{
        jwt.verify(token, "Hello", (error, decoded) => {
            if(error){
                console.log("Verification Failed");
                res.json("VF")
            }
            else {
                console.log(req.body.userId)
                if(req.body.userId !== decoded.id) res.json("VF");
                console.log("Done");
                console.log(req.body)
                next();
            }
        })
    }
}









app.get('/', (req, res) => {
    res.send('Server Running');
});

app.post('/login',(req, res) => {
    const userId = req.body.userId;
    const password = req.body.password;
    const query = `SELECT * FROM users WHERE userId = '${userId}' AND password = '${password}'`;
    connection.query(query, (error, results) => {
        if (error) {
            console.log(error);
            res.send("Error");
        }
        else {
            if (results.length > 0) {
                const token = jwt.sign({ id: userId }, "Hello");
                res.json({
                    token: token,
                    userId: userId
                });
            }
            else {
                res.send("Invalid Credentials");
            }
        }
    });
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
                    const token = jwt.sign({ id: username },"Hello");
                    res.json({ username, token });
                };
            });
            // res.send("Error");        
        }
    })
});

app.post('/editprofile', author, async (req, res) => {
    // console.log(req.body)
    const data = req.body;
    console.log("herere")
    var c = 0;// update with each query run
    for (var x in data) {
        if (x !== 'userId' && x!== 'token' ) {            
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
    res.json("Success");
});

app.post("/showprofile", (req, res) => {
    const userId = req.body.userId;
    connection.query(`SELECT * FROM users WHERE user_id = '${userId}'`, (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error");
        }
        else {
            console.log(result)
            res.json(result);
        }
    });
})


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

app.post('/allies', (req, res) => {
    const userId = req.userId;
    const query = `SELECT allie_id, name from allies,users WHERE allies.user_id = ${userId} AND allies.allie_id = users.id;`;
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


app.post("/sendrequest", (req, res) => {
    const userId = req.body.userId;
    const allieId = req.body.allieId;
    const query = `INSERT INTO requests (user_id, allie_id) VALUES ('${userId}', '${allieId}');`;
    connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error");
        }
        else {
            res.send("Success");
        }
    });
});

app.post("/acceptrequest", (req, res) => {
    const userId = req.body.userId;
    const allieId = req.body.allieId;
    const query = `INSERT INTO allies (user_id, allie_id) VALUES ('${userId}', '${allieId}');`;
    connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error");
        }
        else {
            const query2 = `DELETE FROM requests WHERE user_id = '${userId}' AND allie_id = '${allieId}';`;
            connection.query(query2, (err, result) => {
                if (err) {
                    console.log(err);
                    res.send("Error");
                }
                else {
                    res.send("Success");
                }
            });
        }
    });
});


app.post("/deleterequest", (req, res) => {
    const userId = req.body.userId;
    const allieId = req.body.allieId;
    const query = `DELETE FROM requests WHERE user_id = '${userId}' AND allie_id = '${allieId}';`;
    connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error");
        }
        else {
            res.send("Success");
        }
    });
});

app.post('/posts', (req, res) => {
    const userId = req.userId;
    const query = `SELECT * from posts WHERE user_id = ${userId};`;
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


app.post('/addpost', (req, res) => {
    const userId = req.body.userId;
    const postReact = req.body.postReact;
    const postPhoto = req.body.postPhoto;
    const postText = req.body.postText;
    const postId = req.body.postId;
    const query = `INSERT INTO posts (user_id, post_react, post_photo, post_text, post_id) VALUES ('${userId}', '${postReact}', '${postPhoto}', '${postText}', '${postId}');`;
    connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error");
        }
        else {
            res.send("Success");
        }
    });
});

app.post("/deletepost", (req, res) => {
    const userId = req.body.userId;
    const postId = req.body.postId;
    const query = `DELETE FROM posts WHERE user_id = '${userId}' AND post_id = '${postId}';`;
    connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error");
        }
        else {
            res.send("Success");
        }
    });
});



app.post('/home', (req, res) => {
    const query = `SELECT * from posts;`;
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








app.post('/admin', (req, res) => {
});

app.post('/compaints', (req, res) => {
});

    
    

//Listening on port 5000
app.listen(process.env.PORT || 5000, () => {
    console.log("Running on port 5000");
});