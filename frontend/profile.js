const API_URL = 'http://localhost:3000/api';

let currentUser = null;

async function initProfile() {
    console.log('🚀 Initializing profile page...');
    
    // Check if user is logged in
    await checkAuth();
    
    if (!currentUser) {
        alert('Please login to view profile');
        window.location.href = '/login.html';
        return;
    }
    
    // Render user info
    renderUserInfo();
    
    // Load purchase history
    await loadPurchases();
    
    setupCustomCursor();
}

async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/auth/check`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.loggedIn) {
            currentUser = data.user;
        }
    } catch (error) {
        console.error('Error checking auth:', error);
    }
}

function renderUserInfo() {
    document.getElementById('username').textContent = currentUser.username;
    document.getElementById('email').textContent = currentUser.email;
    document.getElementById('avatar').textContent = currentUser.username.charAt(0).toUpperCase();
}

async function loadPurchases() {
    try {
        const response = await fetch(`${API_URL}/purchases/history`, {
            credentials: 'include'
        });
        const purchases = await response.json();
        
        renderPurchases(purchases);
    } catch (error) {
        console.error('Error loading purchases:', error);
    }
}

function renderPurchases(purchases) {
    const grid = document.getElementById('purchases-grid');
    
    if (purchases.length === 0) {
        grid.innerHTML = '<p style="color: #aaa; grid-column: 1/-1;">No purchases yet. Browse the store to find apps!</p>';
        return;
    }
    
    grid.innerHTML = purchases.map(purchase => `
        <div class="purchase-card" onclick="window.location.href='/detail.html?id=${purchase.app_id}'">
            <img src="${purchase.image}" alt="${purchase.name}" onerror="this.src='https://via.placeholder.com/250x150?text=No+Image'">
            <div class="purchase-info">
                <h3>${purchase.name}</h3>
                <div>
                    <span class="store-badge ${purchase.store}">${getStoreName(purchase.store)}</span>
                </div>
                <p class="purchase-date">
                    <i class="fas fa-calendar"></i> 
                    Purchased: ${new Date(purchase.purchase_date).toLocaleDateString()}
                </p>
                <p style="color: var(--light-green); font-weight: 600; margin-top: 0.5rem;">
                    ${purchase.price}
                </p>
            </div>
        </div>
    `).join('');
}

function getStoreName(store) {
    const names = {
        'android': 'Android',
        'apple': 'Apple',
        'nvidia': 'NVIDIA'
    };
    return names[store] || 'Unknown';
}

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

document.addEventListener('DOMContentLoaded', initProfile);
