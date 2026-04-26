# Uploader - File Hosting Platform

A modern file hosting web application built with Node.js, Express, EJS, and SQLite. Upload, organize, and share your files from anywhere.

## Features

- **User Authentication** - Signup, login, logout with bcrypt-hashed passwords
- **Folder Management** - Create, edit, delete folders with visibility controls
- **Multi-File Upload** - Support for images (JPEG, PNG, GIF, WebP, SVG, BMP), PDFs, TXT, DOC, DOCX
- **File Management** - Edit metadata, view files, download files
- **Public Sharing** - Share folders and files via public links
- **Premium Dark UI** - Modern dark theme with glassmorphism and micro-animations
- **Responsive Design** - Works on mobile, tablet, and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express 4 |
| Database | SQLite (better-sqlite3) |
| Sessions | connect-sqlite3 |
| Auth | Passport.js + bcryptjs |
| Templates | EJS |
| File Upload | Multer |
| Validation | express-validator |

## Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment** (optional - defaults work out of the box):
   ```bash
   # Edit .env file
   PORT=8080
   COOKIE_SECRET=your-secret-key
   ```

3. **Start the server:**
   ```bash
   node app.js
   ```

4. **Open in browser:**
   ```
   http://localhost:8080
   ```

## Deployment

### Railway

1. Push your project to GitHub
2. Go to [railway.app](https://railway.app) and create a new project
3. Connect your GitHub repository
4. Railway will auto-detect Node.js and deploy
5. Set environment variables in Railway dashboard:
   - `PORT` → (Railway sets this automatically)
   - `COOKIE_SECRET` → A secure random string

### Render

1. Push your project to GitHub
2. Go to [render.com](https://render.com) and create a new **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node app.js`
5. Set environment variables:
   - `COOKIE_SECRET` → A secure random string

### Vercel / Netlify

These platforms are designed for static/serverless apps. For full Express apps, use **Railway** or **Render** instead.

## Project Structure

```
├── app.js              # Express server entry point
├── .env                # Environment variables
├── database/
│   ├── init.js         # SQLite schema initialization
│   └── queries.js      # Database queries
├── auth/
│   ├── passport.js     # Passport auth strategy
│   └── password.js     # Bcrypt utilities
├── controllers/
│   ├── indexController.js   # Home, auth, folder controllers
│   ├── folderController.js  # File management controllers
│   └── shareController.js   # Public sharing controllers
├── routes/
│   ├── indexRouter.js       # Root routes
│   ├── folderRouter.js      # Folder routes
│   └── shareRouter.js       # Share routes
├── middleware/
│   └── auth.js              # Auth middleware
├── public/
│   └── css/                 # Stylesheets
├── uploads/                 # Uploaded files (auto-created)
├── data/                    # SQLite database (auto-created)
└── views/                   # EJS templates
```

## Skills Demonstrated

- ORM/Database (SQLite)
- File Upload (Multer)
- Authentication (Passport.js)
- Server-side rendering (EJS)
- RESTful routing
- Form validation
- Responsive CSS design
