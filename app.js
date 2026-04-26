require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const passport = require('./auth/passport');

// Initialize database
const { getDb } = require('./database/init');
getDb();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Import routes
const indexRouter = require('./routes/indexRouter');
const folderRouter = require('./routes/folderRouter');
const shareRouter = require('./routes/shareRouter');

// Auth middleware
const { attachUserToLocals } = require('./middleware/auth');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Trust reverse proxy (Render, Koyeb, etc.)
if (isProduction) {
    app.set('trust proxy', 1);
}

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Session
const cookieSecret = process.env.COOKIE_SECRET || 'uploader-secret-key-change-in-production';

app.use(
    session({
        store: new SQLiteStore({
            db: 'sessions.sqlite',
            dir: path.join(__dirname, 'data'),
        }),
        secret: cookieSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            secure: isProduction, // HTTPS only in production
        },
    })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Attach user to all views
app.use(attachUserToLocals);

// Health check endpoint (used by Render, Koyeb, etc.)
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/', indexRouter);
app.use('/folder', folderRouter);
app.use('/share', shareRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Not Found',
        errorCode: 404,
        errorDescription: 'Page Not Found',
        errorMessage: 'The page you are looking for does not exist.',
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('error', {
        title: 'Error',
        errorCode: 500,
        errorDescription: 'Internal Server Error',
        errorMessage: 'Something went wrong. Please try again later.',
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Uploader running at http://localhost:${PORT}`);
});

// Graceful shutdown (free platforms send SIGTERM on sleep/restart)
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});
