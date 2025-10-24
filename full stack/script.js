// Sample app data that combines Android, Apple, and NVIDIA stores
const appData = [
    // Games category
    {
        id: 1,
        name: "Fortnite",
        category: "games",
        description: "Battle royale game with building mechanics",
        rating: 4.5,
        price: "Free",
        store: "android",
        image: "https://cdn2.unrealengine.com/21br-keyart-squaddisplay-motd-1920x1080-1920x1080-dc8eb0f0323e.jpg",
        featured: true
    },
    {
        id: 2,
        name: "Minecraft",
        category: "games",
        description: "Sandbox game about breaking and placing blocks",
        rating: 4.8,
        price: "$6.99",
        store: "apple",
        image: "https://www.minecraft.net/content/dam/games/minecraft/key-art/MC_2023_Updates_Keyart_1200x630.jpg",
        featured: true
    },
    {
        id: 3,
        name: "Cyberpunk 2077",
        category: "games",
        description: "Open-world RPG set in a dystopian future",
        rating: 4.2,
        price: "$59.99",
        store: "nvidia",
        image: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg",
        featured: true
    },
    {
        id: 4,
        name: "Call of Duty: Mobile",
        category: "games",
        description: "First-person shooter game",
        rating: 4.3,
        price: "Free",
        store: "android",
        image: "https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/hero/codm/CODM-S3-Announcement-TOUT.jpg"
    },
    {
        id: 5,
        name: "Among Us",
        category: "games",
        description: "Online multiplayer social deduction game",
        rating: 4.4,
        price: "$3.99",
        store: "apple",
        image: "https://play-lh.googleusercontent.com/8ddL1kuoNUB5vUvgDVjYY3_6HwQcrg1K2fd_R8soD-e2QYj8fT9cfhfh3G0hnSruLKec"
    },
    {
        id: 6,
        name: "The Witcher 3",
        category: "games",
        description: "Open-world fantasy RPG",
        rating: 4.9,
        price: "$39.99",
        store: "nvidia",
        image: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/capsule_616x353.jpg"
    },

    // Food & Drink category
    {
        id: 7,
        name: "UberEats",
        category: "food",
        description: "Food delivery service",
        rating: 4.2,
        price: "Free",
        store: "android",
        image: "https://play-lh.googleusercontent.com/A8jF58KO1y2uHPBUaaHbs9zSvPHoS1FrMdrg8jooV9ftDidkOhnKNWacfPhjKae1IA",
        featured: true
    },
    {
        id: 8,
        name: "DoorDash",
        category: "food",
        description: "Food delivery from local restaurants",
        rating: 4.3,
        price: "Free",
        store: "apple",
        image: "https://play-lh.googleusercontent.com/Ht1zP-aXTUySezUly7zy8oj0PVUj4Bav9AJxC9UZV-HpFJFRxcOGkAjvhm8CC-sNdg"
    },
    {
        id: 9,
        name: "Yummly",
        category: "food",
        description: "Personalized recipe recommendations",
        rating: 4.5,
        price: "Free",
        store: "android",
        image: "https://play-lh.googleusercontent.com/eLuXdMmqr9qDGKz1gC7JDnODSJG_kBTyMgLgTGrNE-XmWvrPky1g6qcBGhUqBOQzuaA"
    },

    // Productivity category
    {
        id: 10,
        name: "Microsoft Office",
        category: "productivity",
        description: "Suite of productivity applications",
        rating: 4.6,
        price: "$6.99/month",
        store: "apple",
        image: "https://play-lh.googleusercontent.com/D5cIl0bz9stWpdVGJzIe7e8o2lY2g_fGBJTZoNThy_l7NXRNRKgkF0yyxZ2SXEAJSoE",
        featured: true
    },
    {
        id: 11,
        name: "Notion",
        category: "productivity",
        description: "All-in-one workspace for notes and tasks",
        rating: 4.7,
        price: "Free",
        store: "android",
        image: "https://play-lh.googleusercontent.com/Ac6dCN7hzOQqcQt5OjUQGZUnhAYJZ8jQB3ej5QqDQE0YuRVPzuHQvC5yX3gWULxJKQ"
    },
    {
        id: 12,
        name: "Adobe Photoshop",
        category: "productivity",
        description: "Photo editing and design software",
        rating: 4.4,
        price: "$9.99/month",
        store: "apple",
        image: "https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN"
    },

    // Entertainment category
    {
        id: 13,
        name: "Netflix",
        category: "entertainment",
        description: "Streaming service for TV shows and movies",
        rating: 4.5,
        price: "Free (Subscription required)",
        store: "android",
        image: "https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI",
        featured: true
    },
    {
        id: 14,
        name: "Spotify",
        category: "entertainment",
        description: "Music streaming service",
        rating: 4.7,
        price: "Free (Premium available)",
        store: "apple",
        image: "https://play-lh.googleusercontent.com/cShys-AmJ93dB0SV8kE6Fl5eSaf4-qRpwXJ3ISAqBcZMUxpcpL1u_fHwjwbbaNYW9jI"
    },
    {
        id: 15,
        name: "Disney+",
        category: "entertainment",
        description: "Streaming service for Disney content",
        rating: 4.6,
        price: "Free (Subscription required)",
        store: "android",
        image: "https://play-lh.googleusercontent.com/xoGGYH2LgLibLDBoxMg-ZE16b-RNfITw_OgXBWRAPin2FZY4FGB-rYdU0LyJxJ3-nA"
    },

    // Social category
    {
        id: 16,
        name: "Instagram",
        category: "social",
        description: "Photo and video sharing social network",
        rating: 4.3,
        price: "Free",
        store: "apple",
        image: "https://play-lh.googleusercontent.com/VRMWkE5p3CkWhJs6nv-9ZsLAs1QOg5ob1_3qg-rckwYW7yp1fMrYZqnEFpk0IoVP4LM",
        featured: true
    },
    {
        id: 17,
        name: "TikTok",
        category: "social",
        description: "Short-form video sharing platform",
        rating: 4.4,
        price: "Free",
        store: "android",
        image: "https://play-lh.googleusercontent.com/OS-MhSWOPtlUZLt0_UP5TI4JlYXdHy5YS4fWCyCIumHSLOIjC_gOvNxzDeCVuJFmW5s"
    },
    {
        id: 18,
        name: "Twitter",
        category: "social",
        description: "Social networking service",
        rating: 4.1,
        price: "Free",
        store: "apple",
        image: "https://play-lh.googleusercontent.com/wIf3HtczQDjHzHuu7vezhqNs0zXAG85F7VmP7nhsTxO3OHegrVXlqIh_DWBYi86FTIGk"
    },

    // Utilities category
    {
        id: 19,
        name: "Google Drive",
        category: "utilities",
        description: "Cloud storage and file backup",
        rating: 4.5,
        price: "Free (Premium available)",
        store: "android",
        image: "https://play-lh.googleusercontent.com/t-juVwXA8lDAk8uQ2L6d6K83jpgQoqmK1icB_l9yvhIAQ2QT_1XbRwg5IpY08906qEw"
    },
    {
        id: 20,
        name: "1Password",
        category: "utilities",
        description: "Password manager and secure wallet",
        rating: 4.8,
        price: "$3.99/month",
        store: "apple",
        image: "https://play-lh.googleusercontent.com/6Ke1oOBgqGgUMcRF3jYYCyFRlNbJK4JvAHN8TbhNJBXAOGD2gu3zm_MwuUlH7p4RXQ"
    },
    {
        id: 21,
        name: "CCleaner",
        category: "utilities",
        description: "System cleaning and optimization tool",
        rating: 4.3,
        price: "Free (Premium available)",
        store: "android",
        image: "https://play-lh.googleusercontent.com/So91qs_eRRralMxUBRqzQUTz0vLZQJl3LqotrqNrFfLBwTYysYwzNXiS5YlHPeNYHX4"
    }
];

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
function initApp() {
    renderFeaturedApps();
    renderApps();
    setupEventListeners();
    setupCustomCursor(); // Add custom cursor setup
}

// Render featured apps
function renderFeaturedApps() {
    const featuredApps = appData.filter(app => app.featured);
    
    featuredSlider.innerHTML = '';
    
    featuredApps.forEach(app => {
        const appElement = createFeaturedAppElement(app);
        featuredSlider.appendChild(appElement);
    });
}

// Create featured app element
function createFeaturedAppElement(app) {
    const appElement = document.createElement('div');
    appElement.className = 'featured-app';
    
    appElement.innerHTML = `
        <img src="${app.image}" alt="${app.name}">
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
function renderApps() {
    // Filter apps based on current category, store, and search term
    const filteredApps = appData.filter(app => {
        const categoryMatch = currentCategory === 'all' || app.category === currentCategory;
        const storeMatch = currentStore === 'all' || app.store === currentStore;
        const searchMatch = searchTerm === '' || 
                          app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        return categoryMatch && storeMatch && searchMatch;
    });
    
    // Update category title
    currentCategoryTitle.textContent = getCategoryTitle();
    
    // Clear the app grid
    appGrid.innerHTML = '';
    
    // If no apps match the filters
    if (filteredApps.length === 0) {
        const noAppsMessage = document.createElement('div');
        noAppsMessage.className = 'no-apps-message';
        noAppsMessage.textContent = 'No apps found matching your filters.';
        appGrid.appendChild(noAppsMessage);
        return;
    }
    
    // Render each app
    filteredApps.forEach(app => {
        const appElement = createAppElement(app);
        appGrid.appendChild(appElement);
    });
}

// Create app element
function createAppElement(app) {
    const appElement = document.createElement('div');
    appElement.className = 'app-card';
    
    appElement.innerHTML = `
        <img src="${app.image}" alt="${app.name}">
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