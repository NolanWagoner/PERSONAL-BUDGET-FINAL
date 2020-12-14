const express = require('express');
const mysql = require('mysql');

const port = process.env.port || 3000;
const cors = require('cors');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());

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
    var sql = 'SELECT * FROM budget WHERE username="' + req.query.username + '"';
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
    var sql = 'SELECT * FROM expense WHERE username="' + req.query.username + '"';
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
    //Make database connection
    var connection = mysql.createConnection({
        host        : 'sql9.freemysqlhosting.net',
        user        : 'sql9374804',
        password    : 'faUfZtFVHZ',
        database    : 'sql9374804'
    });
    connection.connect();
    //Create sql statement from req body
    var sql = 'INSERT INTO budget (username, title, budget) VALUES ("' + req.body.username + '", "' + req.body.title + '", ' + req.body.budget + ')';
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
    //Make database connection
    var connection = mysql.createConnection({
        host        : 'sql9.freemysqlhosting.net',
        user        : 'sql9374804',
        password    : 'faUfZtFVHZ',
        database    : 'sql9374804'
    });
    connection.connect();
    //Create sql statement from req body
    var sql = 'INSERT INTO expense (username, title, expense) VALUES ("' + req.body.username + '", "' + req.body.title + '", ' + req.body.expense + ')';
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
    //Make database connection
    var connection = mysql.createConnection({
        host        : 'sql9.freemysqlhosting.net',
        user        : 'sql9374804',
        password    : 'faUfZtFVHZ',
        database    : 'sql9374804'
    });
    connection.connect();
    //Create sql statement from req body
    var sql = 'DELETE FROM budget WHERE username="' + req.body.username + '" AND id="' + req.body.id + '"';
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
    //Make database connection
    var connection = mysql.createConnection({
        host        : 'sql9.freemysqlhosting.net',
        user        : 'sql9374804',
        password    : 'faUfZtFVHZ',
        database    : 'sql9374804'
    });
    connection.connect();
    //Create sql statement from req body
    var sql = 'DELETE FROM expense WHERE username="' + req.body.username + '" AND id="' + req.body.id + '"';
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