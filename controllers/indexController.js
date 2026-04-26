const { body, validationResult } = require('express-validator');
const passport = require('passport');
const { hashPassword } = require('../auth/password');
const queries = require('../database/queries');

// ==================== GET CONTROLLERS ====================

function controllerGetIndex(req, res) {
    if (req.isAuthenticated()) {
        const folders = queries.getFoldersByUserId(req.user.userId);
        return res.render('index', {
            title: 'Home',
            folders,
        });
    }
    res.render('index', {
        title: 'Uploader',
        folders: [],
    });
}

function controllerGetLogin(req, res) {
    if (req.isAuthenticated()) return res.redirect('/');
    res.render('login', {
        title: 'Login',
        errors: [],
    });
}

function controllerGetSignup(req, res) {
    if (req.isAuthenticated()) return res.redirect('/');
    res.render('signup', {
        title: 'Signup',
        errors: [],
    });
}

function controllerGetHelp(req, res) {
    res.render('help', { title: 'Help' });
}

function controllerGetLogout(req, res) {
    if (!req.isAuthenticated()) return res.redirect('/');
    res.render('logout', { title: 'Logout' });
}

function controllerGetCreateFolder(req, res) {
    if (!req.isAuthenticated()) return res.redirect('/login');
    const visibilities = queries.getAllVisibilities();
    res.render('create-folder', {
        title: 'Create Folder',
        errors: [],
        visibilities,
    });
}

function controllerGetEditFolder(req, res) {
    if (!req.isAuthenticated()) return res.redirect('/login');
    const folder = queries.getFolderById(parseInt(req.params.folderId));
    if (!folder || folder.userId !== req.user.userId) {
        return res.status(404).render('error', {
            title: 'Error',
            errorCode: 404,
            errorDescription: 'Folder not found',
            errorMessage: 'The folder you are looking for does not exist or you do not have access.',
        });
    }
    const visibilities = queries.getAllVisibilities();
    res.render('edit-folder', {
        title: 'Edit Folder',
        folder,
        errors: [],
        visibilities,
    });
}

function controllerGetDeleteFolder(req, res) {
    if (!req.isAuthenticated()) return res.redirect('/login');
    const folder = queries.getFolderById(parseInt(req.params.folderId));
    if (!folder || folder.userId !== req.user.userId) {
        return res.status(404).render('error', {
            title: 'Error',
            errorCode: 404,
            errorDescription: 'Folder not found',
            errorMessage: 'The folder you are looking for does not exist or you do not have access.',
        });
    }
    res.render('delete-folder', {
        title: 'Delete Folder',
        folder,
    });
}

// ==================== POST CONTROLLERS ====================

const signupValidation = [
    body('name').trim().isLength({ min: 1, max: 50 }).withMessage('Name must be between 1 and 50 characters'),
    body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
        .isAlphanumeric().withMessage('Username must only contain letters and numbers'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
];

async function controllerPostSignup(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('signup', {
            title: 'Signup',
            errors: errors.array(),
        });
    }

    const { username, name, password } = req.body;

    // Check if username already exists
    const existing = queries.getUserByUsername(username);
    if (existing) {
        return res.status(400).render('signup', {
            title: 'Signup',
            errors: [{ msg: 'Username is already taken' }],
        });
    }

    try {
        const hashedPassword = await hashPassword(password);
        queries.createUser(username, name, hashedPassword);

        // Auto-login after signup
        const user = queries.getUserByUsername(username);
        req.login(user, (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', {
            title: 'Error',
            errorCode: 500,
            errorDescription: 'Internal Server Error',
            errorMessage: 'Something went wrong while creating your account.',
        });
    }
}

function controllerPostLogin(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(400).render('login', {
                title: 'Login',
                errors: [{ msg: info.message || 'Invalid credentials' }],
            });
        }
        req.login(user, (err) => {
            if (err) return next(err);
            res.redirect('/');
        });
    })(req, res, next);
}

function controllerPostLogout(req, res) {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return res.redirect('/');
        }
        res.redirect('/');
    });
}

const folderValidation = [
    body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Folder name must be between 1 and 100 characters'),
    body('description').optional({ checkFalsy: true }).trim().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
    body('visibility').isIn(['private', 'public']).withMessage('Please select a valid visibility option'),
];

function controllerPostCreateFolder(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const visibilities = queries.getAllVisibilities();
        return res.status(400).render('create-folder', {
            title: 'Create Folder',
            errors: errors.array(),
            visibilities,
        });
    }

    if (!req.isAuthenticated()) return res.redirect('/login');

    const { name, description, visibility } = req.body;
    const vis = queries.getVisibilityByName(visibility);

    queries.createFolder(name, description, vis.visibilityId, req.user.userId);
    res.redirect('/');
}

function controllerPostEditFolder(req, res) {
    const errors = validationResult(req);
    const folderId = parseInt(req.params.folderId);
    const folder = queries.getFolderById(folderId);

    if (!folder || folder.userId !== req.user.userId) {
        return res.status(404).render('error', {
            title: 'Error',
            errorCode: 404,
            errorDescription: 'Folder not found',
            errorMessage: 'The folder you are looking for does not exist.',
        });
    }

    if (!errors.isEmpty()) {
        const visibilities = queries.getAllVisibilities();
        return res.status(400).render('edit-folder', {
            title: 'Edit Folder',
            folder,
            errors: errors.array(),
            visibilities,
        });
    }

    const { name, description, visibility } = req.body;
    const vis = queries.getVisibilityByName(visibility);
    queries.updateFolder(folderId, name, description, vis.visibilityId);
    res.redirect('/');
}

function controllerPostDeleteFolder(req, res) {
    if (!req.isAuthenticated()) return res.redirect('/login');
    const folderId = parseInt(req.params.folderId);
    const folder = queries.getFolderById(folderId);

    if (!folder || folder.userId !== req.user.userId) {
        return res.status(404).render('error', {
            title: 'Error',
            errorCode: 404,
            errorDescription: 'Folder not found',
            errorMessage: 'The folder you are looking for does not exist.',
        });
    }

    // Delete associated files from disk
    const fs = require('fs');
    const path = require('path');
    const files = queries.getFilesByFolderId(folderId);
    files.forEach(file => {
        const filePath = path.join(__dirname, '..', file.storagePath);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });

    queries.deleteFolder(folderId);
    res.redirect('/');
}

module.exports = {
    controllerGetIndex,
    controllerGetLogin,
    controllerGetSignup,
    controllerGetHelp,
    controllerGetLogout,
    controllerGetCreateFolder,
    controllerGetEditFolder,
    controllerGetDeleteFolder,
    controllerPostSignup: [...signupValidation, controllerPostSignup],
    controllerPostLogin,
    controllerPostLogout,
    controllerPostCreateFolder: [...folderValidation, controllerPostCreateFolder],
    controllerPostEditFolder: [...folderValidation, controllerPostEditFolder],
    controllerPostDeleteFolder,
};
