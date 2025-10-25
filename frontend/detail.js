// API Configuration
const API_URL = 'http://localhost:3000/api';

let currentUser = null;
let currentApp = null;
let selectedRating = 0;

// Initialize page
async function initDetailPage() {
    console.log('🚀 Initializing app detail page...');
    
    // Get app ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('id');
    
    if (!appId) {
        alert('No app selected');
        window.location.href = '/';
        return;
    }
    
    // Check if user is logged in
    await checkAuth();
    
    // Load app details
    await loadAppDetails(appId);
    
    // Load reviews
    await loadReviews(appId);
    
    setupCustomCursor();
}

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/auth/check`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.loggedIn) {
            currentUser = data.user;
            renderAuthSection(true);
        } else {
            renderAuthSection(false);
        }
    } catch (error) {
        console.error('Error checking auth:', error);
        renderAuthSection(false);
    }
}

// Render auth section in header
function renderAuthSection(isLoggedIn) {
    const authSection = document.getElementById('auth-section');
    
    if (isLoggedIn) {
        authSection.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="color: var(--text-light);">Welcome, ${currentUser.username}!</span>
                <button onclick="window.location.href='/profile.html'" class="btn" style="padding: 0.5rem 1rem;">
                    <i class="fas fa-user"></i> Profile
                </button>
                <button onclick="logout()" class="btn" style="padding: 0.5rem 1rem; background: var(--secondary-black);">
                    Logout
                </button>
            </div>
        `;
    } else {
        authSection.innerHTML = `
            <div style="display: flex; gap: 1rem;">
                <button onclick="window.location.href='/login.html'" class="btn" style="padding: 0.5rem 1rem;">
                    Login
                </button>
                <button onclick="window.location.href='/register.html'" class="btn btn-primary" style="padding: 0.5rem 1rem;">
                    Register
                </button>
            </div>
        `;
    }
}

// Load app details
async function loadAppDetails(appId) {
    try {
        const response = await fetch(`${API_URL}/apps/${appId}`);
        const app = await response.json();
        
        if (response.ok) {
            currentApp = app;
            renderAppDetails(app);
            
            // Check if user owns the app
            if (currentUser) {
                await checkOwnership(appId);
            }
        } else {
            alert('App not found');
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error loading app:', error);
    }
}

// Check if user owns the app
async function checkOwnership(appId) {
    try {
        const response = await fetch(`${API_URL}/purchases/check/${appId}`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.owned) {
            // Update button to show "Open" or "Owned"
            const purchaseBtn = document.getElementById('purchase-btn');
            if (purchaseBtn) {
                purchaseBtn.innerHTML = '<i class="fas fa-check"></i> Owned';
                purchaseBtn.style.backgroundColor = '#555';
                purchaseBtn.disabled = true;
            }
        }
    } catch (error) {
        console.error('Error checking ownership:', error);
    }
}

// Render app details
function renderAppDetails(app) {
    const detailContainer = document.getElementById('app-detail');
    
    const price = app.price === 'Free' ? 'Free' : app.price;
    const priceBtn = app.price === 'Free' ? 'Download' : `Buy ${price}`;
    
    detailContainer.innerHTML = `
        <div class="app-header">
            <img src="${app.image}" alt="${app.name}" onerror="this.src='https://via.placeholder.com/200?text=No+Image'">
            <div class="app-header-info">
                <h1>${app.name}</h1>
                <p style="color: #aaa; margin: 0.5rem 0;">${app.developer || 'Unknown Developer'}</p>
                
                <div class="app-meta-info">
                    <div>
                        <i class="fas fa-star" style="color: gold;"></i>
                        ${app.rating} Rating
                    </div>
                    <div>
                        <i class="fas fa-download"></i>
                        ${formatDownloads(app.downloads || 0)} Downloads
                    </div>
                    <div>
                        <span class="store-badge ${app.store}">${getStoreName(app.store)}</span>
                    </div>
                    <div>
                        <span class="status status--${app.category}">${getCategoryName(app.category)}</span>
                    </div>
                </div>
                
                <div class="app-meta-info">
                    <div><strong>Version:</strong> ${app.version || 'N/A'}</div>
                    <div><strong>Size:</strong> ${app.size || 'N/A'}</div>
                </div>
                
                <div class="app-actions">
                    <button id="purchase-btn" class="btn-large btn-primary" onclick="purchaseApp(${app.id})">
                        <i class="fas fa-download"></i> ${priceBtn}
                    </button>
                    <button class="btn-large btn-secondary" onclick="window.location.href='/'">
                        <i class="fas fa-arrow-left"></i> Back to Store
                    </button>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h2>About this app</h2>
            <p>${app.detailed_description || app.description}</p>
        </div>
    `;
}

// Format downloads count
function formatDownloads(downloads) {
    if (downloads >= 1000000000) return (downloads / 1000000000).toFixed(1) + 'B';
    if (downloads >= 1000000) return (downloads / 1000000).toFixed(1) + 'M';
    if (downloads >= 1000) return (downloads / 1000).toFixed(1) + 'K';
    return downloads.toString();
}

// Get store name
function getStoreName(store) {
    const names = {
        'android': 'Android',
        'apple': 'Apple',
        'nvidia': 'NVIDIA'
    };
    return names[store] || 'Unknown';
}

// Get category name
function getCategoryName(category) {
    const names = {
        'games': 'Games',
        'food': 'Food & Drink',
        'productivity': 'Productivity',
        'entertainment': 'Entertainment',
        'social': 'Social',
        'utilities': 'Utilities'
    };
    return names[category] || category;
}

// Load reviews
async function loadReviews(appId) {
    try {
        const response = await fetch(`${API_URL}/reviews/app/${appId}`);
        const reviews = await response.json();
        
        renderReviewForm();
        renderReviews(reviews);
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

// Render review form
function renderReviewForm() {
    const reviewForm = document.getElementById('review-form');
    
    if (!currentUser) {
        reviewForm.innerHTML = '<p style="color: #aaa;">Please <a href="/login.html" style="color: var(--primary-green);">login</a> to write a review.</p>';
        return;
    }
    
    reviewForm.innerHTML = `
        <h3>Write a Review</h3>
        <div class="rating-input" id="rating-stars">
            ${[1, 2, 3, 4, 5].map(star => `
                <span class="star" onclick="selectRating(${star})" data-rating="${star}">
                    <i class="fas fa-star"></i>
                </span>
            `).join('')}
        </div>
        <textarea id="review-comment" placeholder="Share your thoughts about this app..."></textarea>
        <button class="btn btn-primary" onclick="submitReview()">Submit Review</button>
    `;
}

// Select rating
function selectRating(rating) {
    selectedRating = rating;
    const stars = document.querySelectorAll('#rating-stars .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Submit review
async function submitReview() {
    if (!currentUser) {
        alert('Please login to submit a review');
        return;
    }
    
    if (selectedRating === 0) {
        alert('Please select a rating');
        return;
    }
    
    const comment = document.getElementById('review-comment').value.trim();
    
    try {
        const response = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                app_id: currentApp.id,
                rating: selectedRating,
                comment: comment
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Review submitted successfully!');
            selectedRating = 0;
            document.getElementById('review-comment').value = '';
            loadReviews(currentApp.id);
        } else {
            alert(data.error || 'Failed to submit review');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review');
    }
}

// Render reviews
function renderReviews(reviews) {
    const reviewsList = document.getElementById('reviews-list');
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p style="color: #aaa;">No reviews yet. Be the first to review!</p>';
        return;
    }
    
    reviewsList.innerHTML = `
        <h3>${reviews.length} Review${reviews.length !== 1 ? 's' : ''}</h3>
        ${reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-user">${review.username}</span>
                    <span class="review-date">${new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <div class="review-rating">
                    ${'<i class="fas fa-star"></i>'.repeat(review.rating)}
                    ${'<i class="far fa-star"></i>'.repeat(5 - review.rating)}
                </div>
                <p>${review.comment || '<em>No comment</em>'}</p>
            </div>
        `).join('')}
    `;
}

// Purchase app
async function purchaseApp(appId) {
    if (!currentUser) {
        alert('Please login to purchase apps');
        window.location.href = '/login.html';
        return;
    }
    
    if (!confirm(`Do you want to ${currentApp.price === 'Free' ? 'download' : 'purchase'} ${currentApp.name}?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/purchases`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ app_id: appId })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(currentApp.price === 'Free' ? 'Download started!' : 'Purchase successful!');
            checkOwnership(appId);
        } else {
            alert(data.error || 'Purchase failed');
        }
    } catch (error) {
        console.error('Error purchasing app:', error);
        alert('Purchase failed');
    }
}

// Logout
async function logout() {
    try {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        window.location.href = '/';
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Custom cursor
function setupCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    
    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDetailPage);
