const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const Ajv = require('ajv');
const fs = require('fs');

const port = process.env.port || 3000;
const cors = require('cors');
let ajv = new Ajv.default({ allErrors: true });
const app = express();

var bodyParser = require('body-parser');
const { response } = require('express');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Validation schema reads
const userSchema = JSON.parse(fs.readFileSync('./schemas/user.json'));
const budgetSchema = JSON.parse(fs.readFileSync('./schemas/budget.json'));
const expenseSchema = JSON.parse(fs.readFileSync('./schemas/expense.json'));
const delBESchema = JSON.parse(fs.readFileSync('./schemas/delBE.json'));

app.use(express.json());

app.use(cors());

app.use(expressJwt({secret: '-----BEGIN RSA PRIVATE KEY-----\nMIIBOgIBAAJBAIE8m0ISlVk1TAjOPouJ+W5vYYZZ20DsTVLiVLXMIlPNzZlE5bKN\n5jEIONjfyuIaUMY+qnAtb3LoBgW9GwjDTmcCAwEAAQJAfRyEHWnKJYuAKUIosIOI\n8o1nN15D8M0Sajvrz/doAAHrKheaO4kMJwZDRIXEByhAbLLb7AUZK5l9gzJY64uk\nIQIhALz4r2RyI+NW1qG0HA4mdRZCWi1Jaj8mdnYfIjHo9KVXAiEArxPJuGvm8JPa\npKt15WC1LCm2n+nRX/s3cRAIbpLtZXECIFkcC9kZ2cKCWIO4IuKpT91HPK7OR8Ov\np3zcAYv3hiXRAiA1APekJr6u/QRHsEUsIYAYE7TfawlhVovtZd43o7HNcQIhALi6\nyG+rAYLiTiPnsz0cCWKst2cj6s71OwzZNvYkfanc\n-----END RSA PRIVATE KEY-----', algorithms: ['RS256']}).unless({path: ['/auth', '/newuser']}));

//Auth endpoint for sending uname and pass and receiving response of token
app.post('/auth', function(req, res) {
    //Validate
    const updateData = req.body;
    try {
        const valid = ajv.validate(userSchema, updateData);
        if (!valid) {
        res.status(400).json({ errors: ajv.errors });
        return;
        }
    } catch (ex) {
        res.status(500);
        return;
    }
    //Make database connection
    var connection = mysql.createConnection({
        host        : 'sql9.freemysqlhosting.net',
        user        : 'sql9374804',
        password    : 'faUfZtFVHZ',
        database    : 'sql9374804'
    });
    connection.connect();
    //Create sql statement from req body
    var sql = 'SELECT * FROM user WHERE username="' + req.body.username + '"';
    console.log(sql + " will be executed");
    //Execute database action
    connection.query(sql, function (error, results, fields) {
        connection.end();
        if (error) throw error;

        if(!results[0] || req.body.username != results[0].username || req.body.password != results[0].password) return res.sendStatus(401);
        
        var token = jwt.sign({userID: results[0].username}, '-----BEGIN RSA PRIVATE KEY-----\nMIIBOgIBAAJBAIE8m0ISlVk1TAjOPouJ+W5vYYZZ20DsTVLiVLXMIlPNzZlE5bKN\n5jEIONjfyuIaUMY+qnAtb3LoBgW9GwjDTmcCAwEAAQJAfRyEHWnKJYuAKUIosIOI\n8o1nN15D8M0Sajvrz/doAAHrKheaO4kMJwZDRIXEByhAbLLb7AUZK5l9gzJY64uk\nIQIhALz4r2RyI+NW1qG0HA4mdRZCWi1Jaj8mdnYfIjHo9KVXAiEArxPJuGvm8JPa\npKt15WC1LCm2n+nRX/s3cRAIbpLtZXECIFkcC9kZ2cKCWIO4IuKpT91HPK7OR8Ov\np3zcAYv3hiXRAiA1APekJr6u/QRHsEUsIYAYE7TfawlhVovtZd43o7HNcQIhALi6\nyG+rAYLiTiPnsz0cCWKst2cj6s71OwzZNvYkfanc\n-----END RSA PRIVATE KEY-----', {algorithm: 'RS256', expiresIn: '2h'});

        console.log('responding with token: ' + token);

        res.send({token});
    });
  });

//Auth endpoint for creating new user
app.post('/newuser', function(req, res) {
    //Validate
    const updateData = req.body;
    try {
        const valid = ajv.validate(userSchema, updateData);
        if (!valid) {
        res.status(400).json({ errors: ajv.errors });
        return;
        }
    } catch (ex) {
        res.status(500);
        return;
    }
    //Make database connection
    var connection = mysql.createConnection({
        host        : 'sql9.freemysqlhosting.net',
        user        : 'sql9374804',
        password    : 'faUfZtFVHZ',
        database    : 'sql9374804'
    });
    connection.connect();
    //Create sql statement from req body
    var sql = 'INSERT IGNORE INTO user (username, password) VALUES ("' + req.body.username + '", "' + req.body.password + '")';
    console.log(sql + " will be executed");
    //Execute database action
    connection.query(sql, function (error, results, fields) {
        connection.end();
        if (error) throw error;
        res.json(results);
    });
});

//Get the budget rows for the specified user
app.get('/getbudget', async (req, res) => {
    //Make database connection
    var connection = mysql.createConnection({
        host        : 'sql9.freemysqlhosting.net',
        user        : 'sql9374804',
        password    : 'faUfZtFVHZ',
        database    : 'sql9374804'
    });
    connection.connect();
    //Create sql statement from req body
    var sql = 'SELECT * FROM budget WHERE username="' + req.user.userID + '"';
    console.log(sql + " will be executed");
    //Execute database action
    connection.query(sql, function (error, results, fields) {
        connection.end();
        if (error) throw error;
        res.json(results);
    });
});

//Get the expense rows for the specified user
app.get('/getexpense', async (req, res) => {
    //Make database connection
    var connection = mysql.createConnection({
        host        : 'sql9.freemysqlhosting.net',
        user        : 'sql9374804',
        password    : 'faUfZtFVHZ',
        database    : 'sql9374804'
    });
    connection.connect();
    //Create sql statement from req body
    var sql = 'SELECT * FROM expense WHERE username="' + req.user.userID + '"';
    console.log(sql + " will be executed");
    //Execute database action
    connection.query(sql, function (error, results, fields) {
        connection.end();
        if (error) throw error;
        res.json(results);
    });
});

//Insert into the budget table based off of user input
app.post('/postbudget', async (req, res) => {
    //Validate
    const updateData = req.body;
    try {
        const valid = ajv.validate(budgetSchema, updateData);
        if (!valid) {
        res.status(400).json({ errors: ajv.errors });
        return;
        }
    } catch (ex) {
        res.status(500);
        return;
    }
    //Make database connection
    var connection = mysql.createConnection({
        host        : 'sql9.freemysqlhosting.net',
        user        : 'sql9374804',
        password    : 'faUfZtFVHZ',
        database    : 'sql9374804'
    });
    connection.connect();
    //Create sql statement from req body
    var sql = 'INSERT IGNORE INTO budget (username, title, budget) VALUES ("' + req.user.userID + '", "' + req.body.title + '", ' + req.body.budget + ')';
    console.log(sql + " will be executed");
    //Execute database action
    connection.query(sql, function (error, results, fields) {
        connection.end();
        if (error) throw error;
        res.json(results);
    });
});

//Insert into the expense table based off of user input
app.post('/postexpense', async (req, res) => {
    //Validate
    const updateData = req.body;
    try {
        const valid = ajv.validate(expenseSchema, updateData);
        if (!valid) {
        res.status(400).json({ errors: ajv.errors });
        return;
        }
    } catch (ex) {
        res.status(500);
        return;
    }
    //Make database connection
    var connection = mysql.createConnection({
        host        : 'sql9.freemysqlhosting.net',
        user        : 'sql9374804',
        password    : 'faUfZtFVHZ',
        database    : 'sql9374804'
    });
    connection.connect();
    //Create sql statement from req body
    var sql = 'INSERT IGNORE INTO expense (username, title, expense) VALUES ("' + req.user.userID + '", "' + req.body.title + '", ' + req.body.expense + ')';
    console.log(sql + " will be executed");
    //Execute database action
    connection.query(sql, function (error, results, fields) {
        connection.end();
        if (error) throw error;
        res.json(results);
    });
});

//Delete row from budget table based on user input
app.post('/delbudget', async (req, res) => {
    //Validate
    const updateData = req.body;
    try {
        const valid = ajv.validate(delBESchema, updateData);
        if (!valid) {
        res.status(400).json({ errors: ajv.errors });
        return;
        }
    } catch (ex) {
        res.status(500);
        return;
    }
    //Make database connection
    var connection = mysql.createConnection({
        host        : 'sql9.freemysqlhosting.net',
        user        : 'sql9374804',
        password    : 'faUfZtFVHZ',
        database    : 'sql9374804'
    });
    connection.connect();
    //Create sql statement from req body
    var sql = 'DELETE FROM budget WHERE username="' + req.user.userID + '" AND id="' + req.body.id + '"';
    console.log(sql + " will be executed");
    //Execute database action
    connection.query(sql, function (error, results, fields) {
        connection.end();
        if (error) throw error;
        res.json(results);
    });
});

//Delete row from expense table based on user input
app.post('/delexpense', async (req, res) => {
    //Validate
    const updateData = req.body;
    try {
        const valid = ajv.validate(delBESchema, updateData);
        if (!valid) {
        res.status(400).json({ errors: ajv.errors });
        return;
        }
    } catch (ex) {
        res.status(500);
        return;
    }
    //Make database connection
    var connection = mysql.createConnection({
        host        : 'sql9.freemysqlhosting.net',
        user        : 'sql9374804',
        password    : 'faUfZtFVHZ',
        database    : 'sql9374804'
    });
    connection.connect();
    //Create sql statement from req body
    var sql = 'DELETE FROM expense WHERE username="' + req.user.userID + '" AND id="' + req.body.id + '"';
    console.log(sql + " will be executed");
    //Execute database action
    connection.query(sql, function (error, results, fields) {
        connection.end();
        if (error) throw error;
        res.json(results);
    });
});

app.listen(port, () =>{
    console.log(`Backend served on port ${port}`);
});