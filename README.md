# URL Shortener 🚀

A fast, secure, and beautiful full-stack URL shortener with built-in click analytics and a stunning glassmorphic user interface.

## ✨ Features
- **Instant URL Shortening**: Convert long, cumbersome URLs into compact, easy-to-share links.
- **Smart Link Deduplication**: Automatically returns existing short IDs for duplicate URLs to save database space and prevent redundancy.
- **Intelligent Input Parsing**: Safely extract Short IDs even if users accidentally paste full URLs into the analytics search.
- **Lightning Fast Redirection**: Highly optimized backend ensuring users get to their destination instantly.
- **Detailed Analytics**: Track the performance of your links. See total clicks and timestamps for every single visit.
- **Premium UI**: A gorgeous, responsive Single Page Application (SPA) featuring a dark theme, glassmorphism, and dynamic animations.
- **One-Click Copy**: Easily copy generated links to your clipboard.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3 (Custom Glassmorphic UI), Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Utilities**: dotenv (Environment management), nanoid (ID generation)

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine
- A MongoDB cluster (e.g., MongoDB Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Hellblaze07/URL-Shortener.git
   cd URL-Shortener
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project and add your MongoDB connection string:
   ```env
   MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/URL-SHORTENER?retryWrites=true&w=majority
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:8001
   ```

## 📂 Project Structure
- `public/` - Contains the frontend SPA (HTML, CSS, JS).
- `models/` - Mongoose database schemas.
- `routes/` - Express route definitions.
- `controllers/` - Core API logic for URL generation and analytics.
- `index.js` - Server entry point and configuration.

## 📄 License
This project is licensed under the ISC License.
