const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all apps with filters
router.get('/', (req, res) => {
    const { category, store, search } = req.query;
    
    let query = 'SELECT * FROM apps WHERE 1=1';
    const params = [];
    
    if (category && category !== 'all') {
        query += ' AND category = ?';
        params.push(category);
    }
    
    if (store && store !== 'all') {
        query += ' AND store = ?';
        params.push(store);
    }
    
    if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY featured DESC, rating DESC';
    
    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('❌ Error fetching apps:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log(`✅ Fetched ${rows.length} apps`);
        res.json(rows);
    });
});

// GET featured apps
router.get('/featured', (req, res) => {
    db.all('SELECT * FROM apps WHERE featured = 1 ORDER BY rating DESC', [], (err, rows) => {
        if (err) {
            console.error('❌ Error fetching featured apps:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log(`✅ Fetched ${rows.length} featured apps`);
        res.json(rows);
    });
});

// GET single app by ID
router.get('/:id', (req, res) => {
    db.get('SELECT * FROM apps WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            console.error('❌ Error fetching app:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'App not found' });
            return;
        }
        console.log(`✅ Fetched app: ${row.name}`);
        res.json(row);
    });
});

// POST new app (Create)
router.post('/', (req, res) => {
    const { name, category, description, rating, price, store, image, featured } = req.body;
    
    if (!name || !category || !description || !rating || !price || !store) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    
    const query = `INSERT INTO apps (name, category, description, rating, price, store, image, featured) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [name, category, description, rating, price, store, image || '', featured || 0], function(err) {
        if (err) {
            console.error('❌ Error creating app:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log(`✅ Created app: ${name} (ID: ${this.lastID})`);
        res.status(201).json({ 
            id: this.lastID, 
            message: 'App created successfully',
            app: { id: this.lastID, name, category, description, rating, price, store, image, featured }
        });
    });
});

// PUT update app
router.put('/:id', (req, res) => {
    const { name, category, description, rating, price, store, image, featured } = req.body;
    
    const query = `UPDATE apps SET name = ?, category = ?, description = ?, rating = ?, 
                   price = ?, store = ?, image = ?, featured = ? WHERE id = ?`;
    
    db.run(query, [name, category, description, rating, price, store, image, featured, req.params.id], function(err) {
        if (err) {
            console.error('❌ Error updating app:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'App not found' });
            return;
        }
        console.log(`✅ Updated app ID: ${req.params.id}`);
        res.json({ message: 'App updated successfully' });
    });
});

// DELETE app
router.delete('/:id', (req, res) => {
    db.run('DELETE FROM apps WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            console.error('❌ Error deleting app:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'App not found' });
            return;
        }
        console.log(`✅ Deleted app ID: ${req.params.id}`);
        res.json({ message: 'App deleted successfully' });
    });
});

module.exports = router;
