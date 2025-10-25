# 🛍️ Universal App Store

A full-stack web application for browsing and purchasing apps from multiple stores (Android, Apple, NVIDIA).

## ✨ Features

- 🔐 **User Authentication** - Register, Login, Logout
- 📱 **App Browsing** - Browse apps from Android, Apple, and NVIDIA stores
- 🔍 **Search & Filter** - Search apps and filter by category/store
- 📄 **Detailed App Pages** - View app details, ratings, and reviews
- ⭐ **Review System** - Rate and review apps (1-5 stars)
- 💳 **Purchase/Download** - Buy or download apps
- 📊 **Purchase History** - View your purchased apps in profile
- 🎨 **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome Icons

**Backend:**
- Node.js
- Express.js
- SQLite3
- bcryptjs (password hashing)
- express-session (authentication)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup

1. **Clone the repository:**
git remote add origin https://github.com/Lalith-05/universal_app_store.git

2. **Install dependencies:**
npm install


3. **Start the development server:**
npm run dev


4. **Open in browser:**
http://localhost:3000



## 📁 Project Structure


## 🚀 Usage

### Register a New User
1. Go to `http://localhost:3000/register.html`
2. Fill in username, email, and password
3. Click "Register"

### Browse Apps
1. Home page shows all apps
2. Use category tabs to filter by category
3. Use store dropdown to filter by platform
4. Use search bar to find specific apps

### View App Details & Purchase
1. Click any app card
2. View full details, ratings, and reviews
3. Click "Download" or "Buy" button
4. App will be added to your purchase history

### Write Reviews
1. Navigate to app detail page
2. Select star rating (1-5)
3. Write a comment
4. Click "Submit Review"

### View Purchase History
1. Click "Profile" button in header
2. See all your purchased apps

## 📊 API Endpoints

### Apps
- `GET /api/apps` - Get all apps (with filters)
- `GET /api/apps/featured` - Get featured apps
- `GET /api/apps/:id` - Get single app

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check auth status

### Reviews
- `GET /api/reviews/app/:appId` - Get reviews for an app
- `POST /api/reviews` - Add a review

### Purchases
- `GET /api/purchases/history` - Get user's purchase history
- `GET /api/purchases/check/:appId` - Check if user owns app
- `POST /api/purchases` - Purchase an app

## 🗄️ Database Schema

### Tables
- **apps** - App information (name, category, price, rating, etc.)
- **users** - User accounts (username, email, hashed password)
- **reviews** - User reviews (rating, comment, timestamps)
- **purchases** - Purchase records (user_id, app_id, date)

## 🔒 Security Features

- Password hashing with bcryptjs
- Session-based authentication
- SQL injection prevention with prepared statements
- Input validation
- CORS protection

## 🎨 UI Features

- Dark theme design
- Custom dragon cursor 🐉
- Smooth animations
- Responsive layout
- Color-coded store badges
- Star ratings with Font Awesome

## 📝 License

MIT License

## 👨‍💻 Author

Your Name

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- Email: your.email@example.com

