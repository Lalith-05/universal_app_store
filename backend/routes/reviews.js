const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all reviews for an app
router.get('/app/:appId', (req, res) => {
    const query = `
        SELECT reviews.*, users.username 
        FROM reviews 
        JOIN users ON reviews.user_id = users.id 
        WHERE reviews.app_id = ? 
        ORDER BY reviews.created_at DESC
    `;
    
    db.all(query, [req.params.appId], (err, reviews) => {
        if (err) {
            console.error('❌ Error fetching reviews:', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log(`✅ Fetched ${reviews.length} reviews for app ${req.params.appId}`);
        res.json(reviews);
    });
});

// Add a review (requires login)
router.post('/', (req, res) => {
    // Check if user is logged in
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Please login to post a review' });
    }
    
    const { app_id, rating, comment } = req.body;
    
    if (!app_id || !rating) {
        return res.status(400).json({ error: 'App ID and rating are required' });
    }
    
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Check if user already reviewed this app
    db.get(
        'SELECT * FROM reviews WHERE app_id = ? AND user_id = ?',
        [app_id, req.session.userId],
        (err, existingReview) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            if (existingReview) {
                return res.status(400).json({ error: 'You already reviewed this app' });
            }
            
            // Insert review
            db.run(
                'INSERT INTO reviews (app_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
                [app_id, req.session.userId, rating, comment || ''],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    
                    // Update app average rating
                    updateAppRating(app_id);
                    
                    console.log(`✅ Review added by user ${req.session.userId} for app ${app_id}`);
                    res.status(201).json({ 
                        message: 'Review added successfully',
                        reviewId: this.lastID 
                    });
                }
            );
        }
    );
});

// Update app average rating
function updateAppRating(appId) {
    db.get(
        'SELECT AVG(rating) as avgRating FROM reviews WHERE app_id = ?',
        [appId],
        (err, result) => {
            if (err || !result) return;
            
            const newRating = Math.round(result.avgRating * 10) / 10; // Round to 1 decimal
            
            db.run(
                'UPDATE apps SET rating = ? WHERE id = ?',
                [newRating, appId],
                (err) => {
                    if (err) console.error('Error updating app rating:', err);
                    else console.log(`✅ Updated app ${appId} rating to ${newRating}`);
                }
            );
        }
    );
}

// Delete review (user can only delete their own)
router.delete('/:id', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Please login to delete a review' });
    }
    
    db.run(
        'DELETE FROM reviews WHERE id = ? AND user_id = ?',
        [req.params.id, req.session.userId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Review not found or unauthorized' });
            }
            
            console.log(`✅ Review ${req.params.id} deleted`);
            res.json({ message: 'Review deleted successfully' });
        }
    );
});

module.exports = router;
