const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Create database connection
const dbPath = path.resolve(__dirname, 'appstore.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Create apps table
    db.run(`
        CREATE TABLE IF NOT EXISTS apps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            rating REAL NOT NULL,
            price TEXT NOT NULL,
            store TEXT NOT NULL,
            image TEXT,
            featured INTEGER DEFAULT 0,
            detailed_description TEXT,
            developer TEXT,
            version TEXT,
            size TEXT,
            downloads INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('❌ Error creating apps table:', err.message);
        } else {
            console.log('✅ Apps table ready');
            seedData();
        }
    });

    // Create users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('❌ Error creating users table:', err.message);
        } else {
            console.log('✅ Users table ready');
        }
    });

    // Create reviews table
    db.run(`
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            app_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (app_id) REFERENCES apps(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `, (err) => {
        if (err) {
            console.error('❌ Error creating reviews table:', err.message);
        } else {
            console.log('✅ Reviews table ready');
        }
    });

    // Create purchases table
    db.run(`
        CREATE TABLE IF NOT EXISTS purchases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            app_id INTEGER NOT NULL,
            purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            price TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (app_id) REFERENCES apps(id)
        )
    `, (err) => {
        if (err) {
            console.error('❌ Error creating purchases table:', err.message);
        } else {
            console.log('✅ Purchases table ready');
        }
    });
}

// Seed initial data
function seedData() {
    db.get('SELECT COUNT(*) as count FROM apps', (err, row) => {
        if (err) {
            console.error('❌ Error checking data:', err);
            return;
        }
        
        if (row.count === 0) {
            console.log('📦 Seeding initial data...');
            
            const apps = [
                ['Fortnite', 'games', 'Battle royale game with building mechanics', 4.5, 'Free', 'android', 'https://cdn2.unrealengine.com/21br-keyart-squaddisplay-motd-1920x1080-1920x1080-dc8eb0f0323e.jpg', 1, 'Fortnite is a free-to-play Battle Royale game with numerous game modes for every type of player. Jump in and compete in 100 player PvP, join forces in 50v50 or create your own world!', 'Epic Games', '25.30', '85 MB', 50000000],
                ['Minecraft', 'games', 'Sandbox game about breaking and placing blocks', 4.8, '$6.99', 'apple', 'https://www.minecraft.net/content/dam/games/minecraft/key-art/MC_2023_Updates_Keyart_1200x630.jpg', 1, 'Explore randomly generated worlds and build amazing things from the simplest of homes to the grandest of castles. Play in creative mode with unlimited resources or mine deep into the world in survival mode.', 'Mojang', '1.20.41', '150 MB', 30000000],
                ['Cyberpunk 2077', 'games', 'Open-world RPG set in a dystopian future', 4.2, '$59.99', 'nvidia', 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg', 1, 'Cyberpunk 2077 is an open-world, action-adventure RPG set in the dark future of Night City — a dangerous megalopolis obsessed with power, glamor, and ceaseless body modification.', 'CD PROJEKT RED', '2.0', '70 GB', 20000000],
                ['Call of Duty: Mobile', 'games', 'First-person shooter game', 4.3, 'Free', 'android', 'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/hero/codm/CODM-S3-Announcement-TOUT.jpg', 0, 'Experience the thrill of Call of Duty on mobile with iconic multiplayer maps and modes. Play 100-player Battle Royale or engage in intense 5v5 multiplayer action.', 'Activision', '1.0.35', '120 MB', 15000000],
                ['Among Us', 'games', 'Online multiplayer social deduction game', 4.4, '$3.99', 'apple', 'https://play-lh.googleusercontent.com/8ddL1kuoNUB5vUvgDVjYY3_6HwQcrg1K2fd_R8soD-e2QYj8fT9cfhfh3G0hnSruLKec', 0, 'Join your crewmates in a multiplayer game of teamwork and betrayal! Play with 4-15 players online or via local WiFi as you attempt to prep your spaceship for departure.', 'InnerSloth', '2023.11.28', '250 MB', 10000000],
                ['The Witcher 3', 'games', 'Open-world fantasy RPG', 4.9, '$39.99', 'nvidia', 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/capsule_616x353.jpg', 0, 'As war rages on throughout the Northern Realms, you take on the greatest contract of your life — tracking down the Child of Prophecy, a living weapon that can alter the shape of the world.', 'CD PROJEKT RED', '4.04', '50 GB', 8000000],
                ['UberEats', 'food', 'Food delivery service', 4.2, 'Free', 'android', 'https://play-lh.googleusercontent.com/A8jF58KO1y2uHPBUaaHbs9zSvPHoS1FrMdrg8jooV9ftDidkOhnKNWacfPhjKae1IA', 1, 'Order food delivery and takeout from restaurants near you. Browse menus, view ratings, pay securely, and track orders in real time.', 'Uber Technologies', '6.160.10000', '45 MB', 100000000],
                ['DoorDash', 'food', 'Food delivery from local restaurants', 4.3, 'Free', 'apple', 'https://play-lh.googleusercontent.com/Ht1zP-aXTUySezUly7zy8oj0PVUj4Bav9AJxC9UZV-HpFJFRxcOGkAjvhm8CC-sNdg', 0, 'Get your favorite foods delivered in a snap. Connect with your favorite restaurants and have meals delivered right to your door.', 'DoorDash', '15.50.7', '52 MB', 80000000],
                ['Yummly', 'food', 'Personalized recipe recommendations', 4.5, 'Free', 'android', 'https://play-lh.googleusercontent.com/eLuXdMmqr9qDGKz1gC7JDnODSJG_kBTyMgLgTGrNE-XmWvrPky1g6qcBGhUqBOQzuaA', 0, 'Discover recipes based on your taste preferences, dietary needs, and what you have in your kitchen. Get personalized recommendations and step-by-step cooking guidance.', 'Yummly', '8.2.0', '38 MB', 5000000],
                ['Microsoft Office', 'productivity', 'Suite of productivity applications', 4.6, '$6.99/month', 'apple', 'https://play-lh.googleusercontent.com/D5cIl0bz9stWpdVGJzIe7e8o2lY2g_fGBJTZoNThy_l7NXRNRKgkF0yyxZ2SXEAJSoE', 1, 'Get work done on the go with Office mobile apps. Create, edit, and share Word, Excel, and PowerPoint files across all your devices.', 'Microsoft Corporation', '2.75', '320 MB', 50000000],
                ['Notion', 'productivity', 'All-in-one workspace for notes and tasks', 4.7, 'Free', 'android', 'https://play-lh.googleusercontent.com/Ac6dCN7hzOQqcQt5OjUQGZUnhAYJZ8jQB3ej5QqDQE0YuRVPzuHQvC5yX3gWULxJKQ', 0, 'Write, plan, collaborate, and get organized. Notion is all you need — in one tool. Customize your workspace with databases, kanban boards, wikis, and more.', 'Notion Labs', '0.6.430', '95 MB', 30000000],
                ['Adobe Photoshop', 'productivity', 'Photo editing and design software', 4.4, '$9.99/month', 'apple', 'https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN', 0, 'Create beautiful images, graphics, paintings, and 3D artwork on your mobile device with Photoshop. Retouch photos with ease and access powerful editing tools.', 'Adobe', '24.0', '680 MB', 20000000],
                ['Netflix', 'entertainment', 'Streaming service for TV shows and movies', 4.5, 'Free (Subscription required)', 'android', 'https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI', 1, 'Netflix is the leading subscription service for watching TV episodes and movies. Get unlimited access to thousands of shows and movies with new titles added regularly.', 'Netflix Inc.', '8.82.1', '58 MB', 1000000000],
                ['Spotify', 'entertainment', 'Music streaming service', 4.7, 'Free (Premium available)', 'apple', 'https://play-lh.googleusercontent.com/cShys-AmJ93dB0SV8kE6Fl5eSaf4-qRpwXJ3ISAqBcZMUxpcpL1u_fHwjwbbaNYW9jI', 0, 'Listen to millions of songs and podcasts on Spotify. Discover new music, create playlists, and enjoy personalized recommendations based on your taste.', 'Spotify AB', '8.8.72.527', '98 MB', 500000000],
                ['Disney+', 'entertainment', 'Streaming service for Disney content', 4.6, 'Free (Subscription required)', 'android', 'https://play-lh.googleusercontent.com/xoGGYH2LgLibLDBoxMg-ZE16b-RNfITw_OgXBWRAPin2FZY4FGB-rYdU0LyJxJ3-nA', 0, 'Stream exclusive Disney, Pixar, Marvel, Star Wars, and National Geographic content. Download to watch offline and enjoy GroupWatch with friends and family.', 'Disney', '1.19.1', '45 MB', 150000000],
                ['Instagram', 'social', 'Photo and video sharing social network', 4.3, 'Free', 'apple', 'https://play-lh.googleusercontent.com/VRMWkE5p3CkWhJs6nv-9ZsLAs1QOg5ob1_3qg-rckwYW7yp1fMrYZqnEFpk0IoVP4LM', 1, 'Share photos and videos with friends and followers. Discover inspiring content, connect with creators, and express yourself through Stories, Reels, and Posts.', 'Meta Platforms', '306.0.0.34.110', '185 MB', 2000000000],
                ['TikTok', 'social', 'Short-form video sharing platform', 4.4, 'Free', 'android', 'https://play-lh.googleusercontent.com/OS-MhSWOPtlUZLt0_UP5TI4JlYXdHy5YS4fWCyCIumHSLOIjC_gOvNxzDeCVuJFmW5s', 0, 'Watch, create, and discover millions of short videos. Join trends, express yourself, and connect with a global community of creators.', 'TikTok Pte. Ltd.', '31.9.4', '175 MB', 1500000000],
                ['Twitter', 'social', 'Social networking service', 4.1, 'Free', 'apple', 'https://play-lh.googleusercontent.com/wIf3HtczQDjHzHuu7vezhqNs0zXAG85F7VmP7nhsTxO3OHegrVXlqIh_DWBYi86FTIGk', 0, 'Join the conversation! Follow your interests, hear directly from the people and organizations you care about, and engage with real-time updates.', 'Twitter Inc.', '9.71', '120 MB', 500000000],
                ['Google Drive', 'utilities', 'Cloud storage and file backup', 4.5, 'Free (Premium available)', 'android', 'https://play-lh.googleusercontent.com/t-juVwXA8lDAk8uQ2L6d6K83jpgQoqmK1icB_l9yvhIAQ2QT_1XbRwg5IpY08906qEw', 0, 'Store files safely and access them from any device. Share files and folders, collaborate in real time, and work with Office files without conversion.', 'Google LLC', '2.23.437.0', '95 MB', 5000000000],
                ['1Password', 'utilities', 'Password manager and secure wallet', 4.8, '$3.99/month', 'apple', 'https://play-lh.googleusercontent.com/6Ke1oOBgqGgUMcRF3jYYCyFRlNbJK4JvAHN8TbhNJBXAOGD2gu3zm_MwuUlH7p4RXQ', 0, 'Keep all your passwords safe and secure. Autofill login credentials, generate strong passwords, and protect sensitive documents with military-grade encryption.', '1Password', '8.10.18', '175 MB', 1000000],
                ['CCleaner', 'utilities', 'System cleaning and optimization tool', 4.3, 'Free (Premium available)', 'android', 'https://play-lh.googleusercontent.com/So91qs_eRRralMxUBRqzQUTz0vLZQJl3LqotrqNrFfLBwTYysYwzNXiS5YlHPeNYHX4', 0, 'Clean junk files, free up storage space, and optimize your device performance. Monitor system health and manage apps efficiently.', 'Piriform', '6.5.0', '35 MB', 100000000]
            ];

            const stmt = db.prepare('INSERT INTO apps (name, category, description, rating, price, store, image, featured, detailed_description, developer, version, size, downloads) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            
            apps.forEach(app => {
                stmt.run(app, (err) => {
                    if (err) console.error('❌ Error inserting app:', err);
                });
            });
            
            stmt.finalize(() => {
                console.log('✅ Initial data seeded successfully! (21 apps added)');
            });
        } else {
            console.log(`ℹ️  Database already has ${row.count} apps`);
        }
    });
}

module.exports = db;
