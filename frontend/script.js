// API Configuration
const API_URL = 'http://localhost:3000/api/apps';

let currentUser = null;

// Check authentication on page load
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

// Render authentication section
function renderAuthSection(isLoggedIn) {
    const authSection = document.getElementById('auth-section');
    
    if (isLoggedIn) {
        authSection.innerHTML = `
            <span style="color: var(--text-light);">Hi, ${currentUser.username}!</span>
            <button onclick="window.location.href='/profile.html'" class="btn" style="padding: 0.5rem 1rem; background: var(--card-bg);">
                <i class="fas fa-user"></i> Profile
            </button>
            <button onclick="logout()" class="btn" style="padding: 0.5rem 1rem; background: var(--secondary-black);">
                Logout
            </button>
        `;
    } else {
        authSection.innerHTML = `
            <button onclick="window.location.href='/login.html'" class="btn" style="padding: 0.5rem 1rem; background: var(--card-bg);">
                Login
            </button>
            <button onclick="window.location.href='/register.html'" class="btn btn-primary" style="padding: 0.5rem 1rem;">
                Register
            </button>
        `;
    }
}

// Logout function
async function logout() {
    try {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        window.location.reload();
    } catch (error) {
        console.error('Error logging out:', error);
    }
}


// DOM Elements
const appGrid = document.getElementById('app-grid');
const featuredSlider = document.getElementById('featured-slider');
const categoryLinks = document.querySelectorAll('.category-nav li');
const storeSelect = document.getElementById('store-select');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const currentCategoryTitle = document.getElementById('current-category');

// Current filters
let currentCategory = 'all';
let currentStore = 'all';
let searchTerm = '';

// Initialize the app
async function initApp() {
    console.log('🚀 Initializing app...');
    await checkAuth(); // Add this line
    await renderFeaturedApps();
    await renderApps();
    setupEventListeners();
    setupCustomCursor();
}


// Fetch apps from backend API
async function fetchApps(filters = {}) {
    try {
        const params = new URLSearchParams();
        
        if (filters.category && filters.category !== 'all') {
            params.append('category', filters.category);
        }
        if (filters.store && filters.store !== 'all') {
            params.append('store', filters.store);
        }
        if (filters.search) {
            params.append('search', filters.search);
        }
        
        console.log(`📡 Fetching apps from backend...`);
        const response = await fetch(`${API_URL}?${params}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Received ${data.length} apps from backend`);
        return data;
    } catch (error) {
        console.error('❌ Error fetching apps:', error);
        return [];
    }
}

// Fetch featured apps from backend
async function fetchFeaturedApps() {
    try {
        console.log('📡 Fetching featured apps from backend...');
        const response = await fetch(`${API_URL}/featured`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Received ${data.length} featured apps from backend`);
        return data;
    } catch (error) {
        console.error('❌ Error fetching featured apps:', error);
        return [];
    }
}

// Render featured apps
async function renderFeaturedApps() {
    const featuredApps = await fetchFeaturedApps();
    
    featuredSlider.innerHTML = '';
    
    if (featuredApps.length === 0) {
        featuredSlider.innerHTML = '<p style="color: #aaa; padding: 1rem;">No featured apps available</p>';
        return;
    }
    
    featuredApps.forEach(app => {
        const appElement = createFeaturedAppElement(app);
        featuredSlider.appendChild(appElement);
    });
}

// Create featured app element
function createFeaturedAppElement(app) {
    const appElement = document.createElement('div');
    appElement.className = 'featured-app';
    appElement.style.cursor = 'pointer';
    appElement.onclick = () => window.location.href = `/detail.html?id=${app.id}`;
    
    appElement.innerHTML = `
        <img src="${app.image}" alt="${app.name}" onerror="this.src='https://via.placeholder.com/300x150?text=No+Image'">
        <div class="featured-app-info">
            <h3>${app.name}</h3>
            <p>${app.description}</p>
            <div>
                <span class="store-badge ${app.store}">${getStoreName(app.store)}</span>
                <span class="app-rating"><i class="fas fa-star"></i> ${app.rating}</span>
            </div>
            <div class="app-meta">
                <span class="app-price ${app.price === 'Free' ? 'free' : ''}">${app.price}</span>
            </div>
        </div>
    `;
    
    return appElement;
}


// Render all apps based on current filters
async function renderApps() {
    const filters = {
        category: currentCategory,
        store: currentStore,
        search: searchTerm
    };
    
    const apps = await fetchApps(filters);
    
    // Update category title
    currentCategoryTitle.textContent = getCategoryTitle();
    
    // Clear the app grid
    appGrid.innerHTML = '';
    
    // If no apps match the filters
    if (apps.length === 0) {
        const noAppsMessage = document.createElement('div');
        noAppsMessage.className = 'no-apps-message';
        noAppsMessage.textContent = 'No apps found matching your filters.';
        noAppsMessage.style.gridColumn = '1 / -1';
        noAppsMessage.style.textAlign = 'center';
        noAppsMessage.style.padding = '2rem';
        noAppsMessage.style.color = '#aaa';
        appGrid.appendChild(noAppsMessage);
        return;
    }
    
    // Render each app
    apps.forEach(app => {
        const appElement = createAppElement(app);
        appGrid.appendChild(appElement);
    });
}

// Create app element
function createAppElement(app) {
    const appElement = document.createElement('div');
    appElement.className = 'app-card';
    appElement.style.cursor = 'pointer';
    appElement.onclick = () => window.location.href = `/detail.html?id=${app.id}`;
    
    appElement.innerHTML = `
        <img src="${app.image}" alt="${app.name}" onerror="this.src='https://via.placeholder.com/250x150?text=No+Image'">
        <div class="app-info">
            <h3>${app.name}</h3>
            <p>${app.description}</p>
            <div>
                <span class="store-badge ${app.store}">${getStoreName(app.store)}</span>
            </div>
            <div class="app-meta">
                <span class="app-rating"><i class="fas fa-star"></i> ${app.rating}</span>
                <span class="app-price ${app.price === 'Free' ? 'free' : ''}">${app.price}</span>
            </div>
        </div>
    `;
    
    return appElement;
}


// Get store name from store code
function getStoreName(storeCode) {
    switch(storeCode) {
        case 'android':
            return 'Android';
        case 'apple':
            return 'Apple';
        case 'nvidia':
            return 'NVIDIA';
        default:
            return 'Unknown';
    }
}

// Get category title based on current filters
function getCategoryTitle() {
    let title = '';
    
    // Category part
    switch(currentCategory) {
        case 'all':
            title = 'All';
            break;
        case 'games':
            title = 'Games';
            break;
        case 'food':
            title = 'Food & Drink';
            break;
        case 'productivity':
            title = 'Productivity';
            break;
        case 'entertainment':
            title = 'Entertainment';
            break;
        case 'social':
            title = 'Social';
            break;
        case 'utilities':
            title = 'Utilities';
            break;
        default:
            title = 'Apps';
    }
    
    // Store part
    if (currentStore !== 'all') {
        title += ` from ${getStoreName(currentStore)}`;
    }
    
    // Search part
    if (searchTerm !== '') {
        title += ` matching "${searchTerm}"`;
    }
    
    return title + ' Apps';
}

// Setup event listeners
function setupEventListeners() {
    // Category navigation
    categoryLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from all links
            categoryLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Update current category
            currentCategory = link.getAttribute('data-category');
            
            // Re-render apps
            renderApps();
        });
    });
    
    // Store select
    storeSelect.addEventListener('change', () => {
        currentStore = storeSelect.value;
        renderApps();
    });
    
    // Search
    searchButton.addEventListener('click', () => {
        searchTerm = searchInput.value.trim();
        renderApps();
    });
    
    // Search on Enter key
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchTerm = searchInput.value.trim();
            renderApps();
        }
    });
}

// Custom cursor implementation
function setupCustomCursor() {
    // Create cursor element
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    // Update cursor position on mouse move
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    
    // Add click animation
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicking');
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicking');
    });
    
    // Make sure cursor is visible when mouse enters window
    document.addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
    });
    
    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
