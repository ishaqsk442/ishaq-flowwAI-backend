const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // For password hashing
const db = require('../database/db'); // Assuming you have a db module to interact with SQLite
const router = express.Router();

// Secret for signing the JWT (set this in your .env or config file)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Register a new user
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database (adjust for your DB)
    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function (err) {
        if (err) return res.status(500).send('Error registering user');
        res.status(201).send('User registered');
    });
});

// Login user and return JWT token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Find the user in the database
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err || !user) {
            return res.status(400).send('Invalid email or password');
        }

        // Compare the provided password with the hashed password in the DB
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).send('Invalid email or password');
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        // Send the token back to the user
        res.json({ token });
    });
});

module.exports = router;
