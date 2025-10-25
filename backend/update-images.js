const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'appstore.db');
const db = new sqlite3.Database(dbPath);

// Updated image URLs for all apps
const imageUpdates = [
    // Games
    { id: 1, name: 'Fortnite', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=250&fit=crop' },
    { id: 2, name: 'Minecraft', image: 'https://images.unsplash.com/photo-1587225678040-13270f4c3c10?w=400&h=250&fit=crop' },
    { id: 3, name: 'Cyberpunk 2077', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg' }, // Keep original
    { id: 4, name: 'Call of Duty: Mobile', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=250&fit=crop' },
    { id: 5, name: 'Among Us', image: 'https://play-lh.googleusercontent.com/8ddL1kuoNUB5vUvgDVjYY3_6HwQcrg1K2fd_R8soD-e2QYj8fT9cfhfh3G0hnSruLKec' }, // Keep original
    { id: 6, name: 'The Witcher 3', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/capsule_616x353.jpg' }, // Keep original
    
    // Food & Drink
    { id: 7, name: 'UberEats', image: 'https://play-lh.googleusercontent.com/A8jF58KO1y2uHPBUaaHbs9zSvPHoS1FrMdrg8jooV9ftDidkOhnKNWacfPhjKae1IA' }, // Keep original
    { id: 8, name: 'DoorDash', image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400&h=250&fit=crop' },
    { id: 9, name: 'Yummly', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=250&fit=crop' },
    
    // Productivity
    { id: 10, name: 'Microsoft Office', image: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400&h=250&fit=crop' },
    { id: 11, name: 'Notion', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=250&fit=crop' },
    { id: 12, name: 'Adobe Photoshop', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=250&fit=crop' },
    
    // Entertainment
    { id: 13, name: 'Netflix', image: 'https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI' }, // Keep original
    { id: 14, name: 'Spotify', image: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=400&h=250&fit=crop' },
    { id: 15, name: 'Disney+', image: 'https://images.unsplash.com/photo-1609743522471-83c84ce23e32?w=400&h=250&fit=crop' },
    
    // Social
    { id: 16, name: 'Instagram', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop' },
    { id: 17, name: 'TikTok', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=250&fit=crop' },
    { id: 18, name: 'Twitter', image: 'https://play-lh.googleusercontent.com/wIf3HtczQDjHzHuu7vezhqNs0zXAG85F7VmP7nhsTxO3OHegrVXlqIh_DWBYi86FTIGk' }, // Keep original
    
    // Utilities
    { id: 19, name: 'Google Drive', image: 'https://play-lh.googleusercontent.com/t-juVwXA8lDAk8uQ2L6d6K83jpgQoqmK1icB_l9yvhIAQ2QT_1XbRwg5IpY08906qEw' }, // Keep original
    { id: 20, name: '1Password', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop' },
    { id: 21, name: 'CCleaner', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=250&fit=crop' }
];

console.log('🔄 Updating app images...\n');

const stmt = db.prepare('UPDATE apps SET image = ? WHERE id = ?');

let completed = 0;

imageUpdates.forEach(update => {
    stmt.run(update.image, update.id, (err) => {
        if (err) {
            console.error(`❌ Error updating ${update.name}:`, err);
        } else {
            console.log(`✅ Updated ${update.name} (ID: ${update.id})`);
        }
        
        completed++;
        
        if (completed === imageUpdates.length) {
            stmt.finalize(() => {
                console.log('\n✅ All app images updated successfully!');
                console.log('🔄 Restart your server to see the changes.');
                db.close();
                process.exit(0);
            });
        }
    });
});
