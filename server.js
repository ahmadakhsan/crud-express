const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Parse the requests of content-type 'application/json'
app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json());

// Create the MySQL connection pool
const connection = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'express-crud'
});

connection.getConnection((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL');
});


// get all product
app.get('/product', (req, res) => {
    connection.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Error retrieving products: ', err);
            res.status(500).send('Error retrieving products');
            return;
        }

        res.send(results);
    });
});


// get a specific record
app.get('/product/:id', (req, res) => {
    const id = req.params.id;

    connection.query('SELECT * FROM products WHERE id = ?', id, (err, results) => {
        if (err) {
            console.error('Error retrieving products: ', err);
            res.status(500).send('Error retrieving products');
            return;
        }

        res.send(results[0]);
    });
});


// Create a new record
app.post('/product', (req, res) => {
    const { name, price, description, img } = req.body;

    connection.query('INSERT INTO products SET ?', { name, price, description, img }, (err, result) => {
        if (err) {
            console.error('Error creating products: ', err);
            res.status(500).send('Error creating products');
            return;
        }

        res.send(result);
    });
});


// Update an existing record
app.put('/product/:id', (req, res) => {
    const id = req.params.id;
    const { name, age } = req.body;

    connection.query('UPDATE products SET name = ?, age = ? WHERE id = ?', [name, age, id], (err, result) => {
        if (err) {
            console.error('Error updating products: ', err);
            res.status(500).send('Error updating products');
            return;
        }

        res.send(result);
    });
});

// Delete a record
app.delete('/product/:id', (req, res) => {
    const id = req.params.id;

    connection.query('DELETE FROM products WHERE id = ?', id, (err, result) => {
        if (err) {
            console.error('Error deleting products: ', err);
            res.status(500).send('Error deleting products');
            return;
        }

        res.send(result);
    });
});


// Start a server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});