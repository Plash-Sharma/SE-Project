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

## Deployment (100% Free Options)

> **Note:** This app uses SQLite and local file storage. On platforms with ephemeral filesystems (most free tiers), uploaded files and the database will reset on each deploy/restart. For a student project demo this is usually fine.

### Render (Recommended)

Render offers a **free Web Service** tier — no credit card required.

1. Push your project to GitHub
2. Go to [render.com](https://render.com) and sign up for free
3. Click **New → Web Service** and connect your GitHub repo
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node app.js`
   - **Instance Type:** **Free**
5. Add environment variables:
   - `COOKIE_SECRET` → Any random string (e.g. `mysecretkey123`)
6. Click **Deploy** — your app will be live at `https://your-app.onrender.com`

⚠️ Free tier spins down after 15 min of inactivity (first request after sleep takes ~30s).

### Glitch

Glitch is completely free with no signup friction.

1. Go to [glitch.com](https://glitch.com) and sign up
2. Click **New Project → Import from GitHub**
3. Paste your GitHub repo URL
4. Glitch auto-installs dependencies and starts the app
5. Edit the `.env` file in the Glitch editor to set `COOKIE_SECRET`
6. Your app is instantly live at `https://your-project.glitch.me`

⚠️ Free projects sleep after 5 min of inactivity and have 200 MB disk/512 MB RAM limits.

### Koyeb

Koyeb offers a **free Nano instance** — no credit card required.

1. Push your project to GitHub
2. Sign up at [koyeb.com](https://www.koyeb.com)
3. Click **Create App → GitHub** and select your repo
4. Set:
   - **Build Command:** `npm install`
   - **Run Command:** `node app.js`
   - **Instance Type:** **Free (Nano)**
5. Add environment variable `COOKIE_SECRET`
6. Deploy — your app will be live on a `.koyeb.app` subdomain

### Not Recommended

| Platform | Reason |
|----------|--------|
| Railway | No free tier anymore — requires paid plan |
| Vercel / Netlify | Designed for static/serverless apps, not full Express servers |
| Heroku | Free tier discontinued in 2022 |

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
