const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
const users = require('../data').userDB;

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join('C:\Users\Dipak\Desktop','.Authentication Sytem/container')));

app.get('/',(req,res) => {
    res.sendFile(path.join('C:\Users\Dipak\Desktop','.Authentication Sytem/container/index.html'));
});

app.post('/register', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (!foundUser) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 15);
    
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User list', users);
    
            res.send("<div align ='center'><h2>Account Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>Login</a></div><br><br><div align='center'><a href='./registration.html'>Register Next User</a></div>");
        } else {
            res.send("<div align ='center'><h2>This Email is already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register Once Again</a></div>");
        }
    } catch{
        res.send("Might have an Internal server error");
    }
});

app.post('/login', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (foundUser) {
    
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password; 
    
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let usrname = foundUser.username;
                res.send(`<div align ='center'><h2>Login into Account is done</h2></div><br><br><br><div align ='center'><h3>Hi! ${usrname}</h3></div><br><br><div align='center'><a href='./login.html'>Logout</a></div>`);
            } else {
                res.send("<div align ='center'><h2>You have entered an Invalid email or Password, please retry once more</h2></div><br><br><div align ='center'><a href='./login.html'>Login again</a></div>");
            }
        }
        else {
    
            let dumyPass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, dumyPass);
    
            res.send("<div align ='center'><h2>You have entered an Invalid email or Password</h2></div><br><br><div align='center'><a href='./login.html'>Login again<a><div>");
        }
    } catch{
        res.send("Might have any Internal server error");
    }
});

server.listen(8000, function(){
    console.log("server is listening on port: 8000");
});
