# Uploader — File Hosting Platform

A modern file hosting web application built with Node.js, Express, EJS, and SQLite. Upload, organize, and share your files from anywhere — deployable for **free** on cloud platforms.

---

## Features

- **User Authentication** — Signup, login, logout with bcrypt-hashed passwords
- **Folder Management** — Create, edit, delete folders with visibility controls
- **Multi-File Upload** — Images (JPEG, PNG, GIF, WebP, SVG, BMP), PDFs, TXT, DOC, DOCX
- **File Management** — Edit metadata, view files, download files
- **Public Sharing** — Share folders and files via public links
- **Premium Dark UI** — Modern dark theme with glassmorphism and micro-animations
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Health Check** — Built-in `/health` endpoint for platform monitoring

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js ≥ 18 |
| Framework | Express 5 |
| Database | SQLite (better-sqlite3) |
| Sessions | connect-sqlite3 |
| Auth | Passport.js + bcryptjs |
| Templates | EJS |
| File Upload | Multer |
| Validation | express-validator |

---

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set `NODE_ENV=development` for local use.

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Open in browser:**
   ```
   http://localhost:8080
   ```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `8080` | Server port (auto-set by most platforms) |
| `COOKIE_SECRET` | **Yes** | fallback key | Random string for session encryption |
| `NODE_ENV` | No | — | Set to `production` on deployed platforms |

---

## Deployment — 100% Free Options

> **Important:** This app uses SQLite and local file storage. On free-tier platforms with ephemeral filesystems, uploaded files and the database will reset on each deploy/restart. This is expected and fine for a project demo.

### Option 1: Render (Recommended)

Render offers a **free Web Service** tier — no credit card required.

**Step-by-step:**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "deployment ready"
   git push origin main
   ```

2. **Create account** at [render.com](https://render.com) (sign up with GitHub)

3. **New Web Service:**
   - Click **New → Web Service**
   - Connect your GitHub repository
   - Render auto-detects Node.js

4. **Configure settings:**
   | Setting | Value |
   |---------|-------|
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | **Free** |
   | Health Check Path | `/health` |

5. **Set environment variables** (Dashboard → Environment):
   | Key | Value |
   |-----|-------|
   | `COOKIE_SECRET` | Any random string (e.g. `my-secret-key-123`) |
   | `NODE_ENV` | `production` |

6. **Deploy** — Your app will be live at `https://your-app.onrender.com`

> ⚠️ Free tier spins down after 15 min of inactivity. First request after sleep takes ~30s to wake up.

---

### Option 2: Glitch

Glitch is completely free with zero friction.

**Step-by-step:**

1. Go to [glitch.com](https://glitch.com) and sign up

2. Click **New Project → Import from GitHub**

3. Paste your GitHub repo URL (e.g. `https://github.com/YOUR_USERNAME/YOUR_REPO`)

4. Glitch auto-installs dependencies and starts the app

5. Open the `.env` file in the Glitch editor and add:
   ```
   PORT=3000
   COOKIE_SECRET=my-secret-key-123
   NODE_ENV=production
   ```

6. Your app is instantly live at `https://your-project.glitch.me`

> ⚠️ Free projects sleep after 5 min of inactivity. Limits: 200 MB disk, 512 MB RAM.

---

### Option 3: Koyeb

Koyeb offers a **free Nano instance** — no credit card required.

**Step-by-step:**

1. Push your project to GitHub

2. Sign up at [koyeb.com](https://www.koyeb.com)

3. Click **Create App → GitHub** and select your repo

4. Configure:
   | Setting | Value |
   |---------|-------|
   | Build Command | `npm install` |
   | Run Command | `npm start` |
   | Instance Type | **Free (Nano)** |
   | Health Check Path | `/health` |

5. Add environment variables:
   | Key | Value |
   |-----|-------|
   | `COOKIE_SECRET` | Any random string |
   | `NODE_ENV` | `production` |

6. Deploy — your app will be live on a `.koyeb.app` subdomain

---

### Platforms NOT Recommended

| Platform | Reason |
|----------|--------|
| Railway | No free tier — requires paid plan |
| Heroku | Free tier discontinued in 2022 |
| Vercel / Netlify | Designed for static/serverless apps, not full Express servers |

---

## Project Structure

```
├── app.js              # Express server entry point
├── .env                # Environment variables (not committed)
├── .env.example        # Environment variable template
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

---

## Skills Demonstrated

- ORM / Database (SQLite)
- File Upload (Multer)
- Authentication (Passport.js)
- Server-side Rendering (EJS)
- RESTful Routing
- Form Validation
- Responsive CSS Design
- Cloud Deployment
