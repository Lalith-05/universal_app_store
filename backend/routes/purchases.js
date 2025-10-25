const express = require('express');
const router = express.Router();
const db = require('../database');

// Get user's purchase history
router.get('/history', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Please login to view purchase history' });
    }
    
    const query = `
        SELECT purchases.*, apps.name, apps.image, apps.category, apps.store 
        FROM purchases 
        JOIN apps ON purchases.app_id = apps.id 
        WHERE purchases.user_id = ? 
        ORDER BY purchases.purchase_date DESC
    `;
    
    db.all(query, [req.session.userId], (err, purchases) => {
        if (err) {
            console.error('❌ Error fetching purchase history:', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log(`✅ Fetched ${purchases.length} purchases for user ${req.session.userId}`);
        res.json(purchases);
    });
});

// Check if user owns an app
router.get('/check/:appId', (req, res) => {
    if (!req.session.userId) {
        return res.json({ owned: false });
    }
    
    db.get(
        'SELECT * FROM purchases WHERE user_id = ? AND app_id = ?',
        [req.session.userId, req.params.appId],
        (err, purchase) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ owned: !!purchase });
        }
    );
});

// Purchase an app
router.post('/', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Please login to purchase apps' });
    }
    
    const { app_id } = req.body;
    
    if (!app_id) {
        return res.status(400).json({ error: 'App ID is required' });
    }
    
    // Check if app exists
    db.get('SELECT * FROM apps WHERE id = ?', [app_id], (err, app) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (!app) {
            return res.status(404).json({ error: 'App not found' });
        }
        
        // Check if user already owns the app
        db.get(
            'SELECT * FROM purchases WHERE user_id = ? AND app_id = ?',
            [req.session.userId, app_id],
            (err, existingPurchase) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                
                if (existingPurchase) {
                    return res.status(400).json({ error: 'You already own this app' });
                }
                
                // Insert purchase
                db.run(
                    'INSERT INTO purchases (user_id, app_id, price) VALUES (?, ?, ?)',
                    [req.session.userId, app_id, app.price],
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }
                        
                        // Increment download count
                        db.run(
                            'UPDATE apps SET downloads = downloads + 1 WHERE id = ?',
                            [app_id]
                        );
                        
                        console.log(`✅ User ${req.session.userId} purchased app ${app_id}`);
                        res.status(201).json({ 
                            message: 'Purchase successful',
                            purchaseId: this.lastID 
                        });
                    }
                );
            }
        );
    });
});

module.exports = router;
