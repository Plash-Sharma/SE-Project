const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const queries = require('../database/queries');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: function (req, file, cb) {
        // Allow images, PDFs, and text files
        const allowedMimes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp',
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not supported. Allowed: Images (JPEG, PNG, GIF, WebP, SVG, BMP), PDF, TXT, DOC, DOCX'), false);
        }
    }
});

// ==================== GET CONTROLLERS ====================

function controllerGetFolder(req, res) {
    if (!req.isAuthenticated()) return res.redirect('/login');
    const folderId = parseInt(req.params.folderId);
    const folder = queries.getFolderById(folderId);

    if (!folder || folder.userId !== req.user.userId) {
        return res.status(404).render('error', {
            title: 'Error',
            errorCode: 404,
            errorDescription: 'Folder not found',
            errorMessage: 'The folder you are looking for does not exist or you do not have access.',
        });
    }

    const files = queries.getFilesByFolderId(folderId);
    const subfolders = queries.getSubfoldersByFolderId(folderId);
    const breadcrumbs = queries.getFolderBreadcrumbs(folderId);
    res.render('folder', {
        title: folder.name,
        folder,
        files,
        subfolders,
        breadcrumbs,
    });
}

function controllerGetCreateFile(req, res) {
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

    const visibilities = queries.getAllVisibilities();
    res.render('create-file', {
        title: 'Upload File',
        folder,
        errors: [],
        visibilities,
    });
}

function controllerGetFile(req, res) {
    if (!req.isAuthenticated()) return res.redirect('/login');
    const fileId = parseInt(req.params.fileId);
    const file = queries.getFileById(fileId);

    if (!file || file.ownerId !== req.user.userId) {
        return res.status(404).render('error', {
            title: 'Error',
            errorCode: 404,
            errorDescription: 'File not found',
            errorMessage: 'The file you are looking for does not exist.',
        });
    }

    const isImage = file.mimeType && file.mimeType.startsWith('image/');
    res.render('view-file', {
        title: file.name,
        file,
        isImage,
    });
}

function controllerGetEditFile(req, res) {
    if (!req.isAuthenticated()) return res.redirect('/login');
    const fileId = parseInt(req.params.fileId);
    const file = queries.getFileById(fileId);

    if (!file || file.ownerId !== req.user.userId) {
        return res.status(404).render('error', {
            title: 'Error',
            errorCode: 404,
            errorDescription: 'File not found',
            errorMessage: 'The file you are looking for does not exist.',
        });
    }

    const visibilities = queries.getAllVisibilities();
    res.render('edit-file', {
        title: 'Edit File',
        file,
        errors: [],
        visibilities,
    });
}

function controllerGetDeleteFile(req, res) {
    if (!req.isAuthenticated()) return res.redirect('/login');
    const fileId = parseInt(req.params.fileId);
    const file = queries.getFileById(fileId);

    if (!file || file.ownerId !== req.user.userId) {
        return res.status(404).render('error', {
            title: 'Error',
            errorCode: 404,
            errorDescription: 'File not found',
            errorMessage: 'The file you are looking for does not exist.',
        });
    }

    res.render('delete-file', {
        title: 'Delete File',
        file,
    });
}

// Subfolder creation — GET
function controllerGetCreateSubfolder(req, res) {
    if (!req.isAuthenticated()) return res.redirect('/login');
    const parentFolderId = parseInt(req.params.folderId);
    const parentFolder = queries.getFolderById(parentFolderId);

    if (!parentFolder || parentFolder.userId !== req.user.userId) {
        return res.status(404).render('error', {
            title: 'Error',
            errorCode: 404,
            errorDescription: 'Folder not found',
            errorMessage: 'The parent folder does not exist.',
        });
    }

    const visibilities = queries.getAllVisibilities();
    const breadcrumbs = queries.getFolderBreadcrumbs(parentFolderId);
    res.render('create-folder', {
        title: 'Create Subfolder',
        errors: [],
        visibilities,
        parentFolderId,
        parentFolderName: parentFolder.name,
        breadcrumbs,
    });
}

// ==================== POST CONTROLLERS ====================

const fileMetaValidation = [
    body('name').optional({ checkFalsy: true }).trim().isLength({ max: 100 }).withMessage('File name must not exceed 100 characters'),
    body('description').optional({ checkFalsy: true }).trim().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
    body('visibility').isIn(['private', 'public']).withMessage('Please select a valid visibility option'),
];

function controllerPostCreateFile(req, res) {
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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const visibilities = queries.getAllVisibilities();
        return res.status(400).render('create-file', {
            title: 'Upload File',
            folder,
            errors: errors.array(),
            visibilities,
        });
    }

    // Handle multiple files (req.files) or fall back to single (req.file)
    const uploadedFiles = req.files || (req.file ? [req.file] : []);

    if (uploadedFiles.length === 0) {
        const visibilities = queries.getAllVisibilities();
        return res.status(400).render('create-file', {
            title: 'Upload File',
            folder,
            errors: [{ msg: 'Please select at least one file to upload' }],
            visibilities,
        });
    }

    const { name, description, visibility } = req.body;
    const vis = queries.getVisibilityByName(visibility);
    const isSingleFile = uploadedFiles.length === 1;

    uploadedFiles.forEach((file) => {
        // Only use custom name for single file upload
        const displayName = (isSingleFile && name && name.trim()) ? name.trim() : file.originalname;
        const storagePath = 'uploads/' + file.filename;

        queries.createFile(
            displayName,
            file.originalname,
            isSingleFile ? description : null,
            file.mimetype,
            file.size,
            storagePath,
            vis.visibilityId,
            folderId
        );
    });

    res.redirect(`/folder/${folderId}`);
}

// Subfolder creation — POST
const subfolderValidation = [
    body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Folder name must be between 1 and 100 characters'),
    body('description').optional({ checkFalsy: true }).trim().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
    body('visibility').isIn(['private', 'public']).withMessage('Please select a valid visibility option'),
];

function controllerPostCreateSubfolder(req, res) {
    if (!req.isAuthenticated()) return res.redirect('/login');

    const parentFolderId = parseInt(req.params.folderId);
    const parentFolder = queries.getFolderById(parentFolderId);

    if (!parentFolder || parentFolder.userId !== req.user.userId) {
        return res.status(404).render('error', {
            title: 'Error',
            errorCode: 404,
            errorDescription: 'Folder not found',
            errorMessage: 'The parent folder does not exist.',
        });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const visibilities = queries.getAllVisibilities();
        const breadcrumbs = queries.getFolderBreadcrumbs(parentFolderId);
        return res.status(400).render('create-folder', {
            title: 'Create Subfolder',
            errors: errors.array(),
            visibilities,
            parentFolderId,
            parentFolderName: parentFolder.name,
            breadcrumbs,
        });
    }

    const { name, description, visibility } = req.body;
    const vis = queries.getVisibilityByName(visibility);

    queries.createFolder(name, description, vis.visibilityId, req.user.userId, parentFolderId);
    res.redirect(`/folder/${parentFolderId}`);
}

function controllerPostEditFile(req, res) {
    if (!req.isAuthenticated()) return res.redirect('/login');

    const fileId = parseInt(req.params.fileId);
    const file = queries.getFileById(fileId);

    if (!file || file.ownerId !== req.user.userId) {
        return res.status(404).render('error', {
            title: 'Error',
            errorCode: 404,
            errorDescription: 'File not found',
            errorMessage: 'The file you are looking for does not exist.',
        });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const visibilities = queries.getAllVisibilities();
        return res.status(400).render('edit-file', {
            title: 'Edit File',
            file,
            errors: errors.array(),
            visibilities,
        });
    }

    const { name, description, visibility } = req.body;
    const vis = queries.getVisibilityByName(visibility);
    queries.updateFile(fileId, name, description, vis.visibilityId);
    res.redirect(`/folder/${file.parentFolderId}`);
}

function controllerPostDeleteFile(req, res) {
    if (!req.isAuthenticated()) return res.redirect('/login');

    const fileId = parseInt(req.params.fileId);
    const file = queries.getFileById(fileId);

    if (!file || file.ownerId !== req.user.userId) {
        return res.status(404).render('error', {
            title: 'Error',
            errorCode: 404,
            errorDescription: 'File not found',
            errorMessage: 'The file you are looking for does not exist.',
        });
    }

    // Delete from disk
    const filePath = path.join(__dirname, '..', file.storagePath);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    queries.deleteFile(fileId);
    res.redirect(`/folder/${file.parentFolderId}`);
}

// Download handler
function controllerGetDownload(req, res) {
    const fileId = parseInt(req.params.fileId);
    const file = queries.getFileById(fileId);
    
    if (!file) {
        return res.status(404).render('error', {
            title: 'Error',
            errorCode: 404,
            errorDescription: 'File not found',
            errorMessage: 'The file you are looking for does not exist.',
        });
    }

    // Check access: owner or public
    const isOwner = req.isAuthenticated() && file.ownerId === req.user.userId;
    const isPublic = file.visibilityName === 'public';

    if (!isOwner && !isPublic) {
        return res.status(403).render('error', {
            title: 'Error',
            errorCode: 403,
            errorDescription: 'Access Denied',
            errorMessage: 'You do not have permission to access this file.',
        });
    }

    const filePath = path.join(__dirname, '..', file.storagePath);
    res.download(filePath, file.originalName);
}

module.exports = {
    controllerGetFolder,
    controllerGetCreateFile,
    controllerGetFile,
    controllerGetEditFile,
    controllerGetDeleteFile,
    controllerGetCreateSubfolder,
    controllerPostCreateFile,
    controllerPostCreateSubfolder: [...subfolderValidation, controllerPostCreateSubfolder],
    controllerPostEditFile,
    controllerPostDeleteFile,
    controllerGetDownload,
    upload,
    fileMetaValidation,
};
