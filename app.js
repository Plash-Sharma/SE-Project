require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const passport = require('./auth/passport');

// Initialize database
const { getDb } = require('./database/init');
getDb();

// Import routes
const indexRouter = require('./routes/indexRouter');
const folderRouter = require('./routes/folderRouter');
const shareRouter = require('./routes/shareRouter');

// Auth middleware
const { attachUserToLocals } = require('./middleware/auth');

const app = express();

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
        },
    })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Attach user to all views
app.use(attachUserToLocals);

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

app.listen(PORT, () => {
    console.log(`🚀 Uploader running at http://localhost:${PORT}`);
});
