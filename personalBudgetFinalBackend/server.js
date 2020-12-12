const express = require('express');
const mysql = require('mysql');

const port = process.env.port || 3000;
const app = express();

var connection = mysql.createConnection({
    host        : 'sql9.freemysqlhosting.net',
    user        : 'sql9374804',
    password    : 'faUfZtFVHZ',
    database    : 'sql9374804'
});

app.get('/budget', async (req, res) => {
    connection.connect();
    connection.query('SELECT * FROM budget', function (error, results, fields) {
        connection.end();
        if (error) throw error;
        res.json(results);
    });
});

app.get('/expense', async (req, res) => {
    connection.connect();
    connection.query('SELECT * FROM expense', function (error, results, fields) {
        connection.end();
        if (error) throw error;
        res.json(results);
    });
});

app.listen(port, () =>{
    console.log(`Server on port ${port}`);
});