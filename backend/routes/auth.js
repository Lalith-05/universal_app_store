const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../database');

// Register new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user
        db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).json({ error: 'Username or email already exists' });
                    }
                    return res.status(500).json({ error: err.message });
                }
                
                console.log(`✅ User registered: ${username}`);
                res.status(201).json({ 
                    message: 'User registered successfully',
                    userId: this.lastID 
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login user
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Compare password
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Store user in session
        req.session.userId = user.id;
        req.session.username = user.username;
        
        console.log(`✅ User logged in: ${username}`);
        res.json({ 
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    });
});

// Logout user
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Check if user is logged in
router.get('/check', (req, res) => {
    if (req.session.userId) {
        db.get('SELECT id, username, email FROM users WHERE id = ?', [req.session.userId], (err, user) => {
            if (err || !user) {
                return res.json({ loggedIn: false });
            }
            res.json({ 
                loggedIn: true,
                user: user
            });
        });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;
