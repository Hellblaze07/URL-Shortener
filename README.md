# Shortlink — URL Shortener

A fast, secure URL shortener with built-in click analytics and a professionally designed split-panel interface.

## Features

- **Instant URL Shortening** — Convert long URLs into compact, shareable links with a single click.
- **Smart Link Deduplication** — Automatically returns existing short IDs for duplicate URLs, preventing redundant database entries.
- **Click Analytics** — Track total clicks and view timestamped visit history for every shortened link.
- **Intelligent Input Parsing** — Extracts short IDs even when users paste full URLs into the analytics search.
- **One-Click Copy** — Copy shortened links to clipboard with animated feedback.
- **Responsive Design** — Split-panel layout on desktop, stacked single-column on mobile.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3 (custom design system), Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (via Mongoose) |
| **Fonts** | Outfit, Work Sans, JetBrains Mono (Google Fonts) |

## Getting Started

### Prerequisites

- Node.js (v18+)
- A MongoDB cluster (e.g., [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Hellblaze07/URL-Shortener.git
   cd URL-Shortener
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```env
   MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/URL-SHORTENER?retryWrites=true&w=majority
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser at:
   ```
   http://localhost:8001
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/url` | Create a shortened URL. Body: `{ "url": "https://..." }` |
| `GET` | `/url/analytics/:shortID` | Get click count and visit history for a short ID |
| `GET` | `/:shortID` | Redirect to the original URL |

## Project Structure

```
├── public/              Frontend SPA (HTML, CSS, JS)
│   ├── index.html       Split-panel layout with brand + app panels
│   ├── style.css        Design system (tokens, layout, components)
│   └── script.js        Tab switching, API calls, copy, toast messages
├── controllers/         Core API logic (shorten + analytics)
├── models/              Mongoose schemas
├── routes/              Express route definitions
├── connect.js           MongoDB connection helper
├── index.js             Server entry point
└── vercel.json          Vercel deployment config
```

## Design

The frontend uses a **split-panel layout** with a dark theme and emerald (`#10B981`) accent color:

- **Left panel** — Brand identity with dot-grid pattern, headline, and feature pills
- **Right panel** — Functional tool with tab-based navigation (Shorten / Analytics)
- **Typography** — Outfit (headings), Work Sans (body), JetBrains Mono (URLs)
- **Interactions** — Animated count-up for click stats, inline toast errors, copy feedback with checkmark tooltip
- **Responsive** — Collapses to single column at 768px

## License

This project is licensed under the ISC License.
