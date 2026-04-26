const queries = require('../database/queries');

function controllerGetSharedFolder(req, res) {
    const folderId = parseInt(req.params.folderId);
    const folder = queries.getFolderById(folderId);

    if (!folder) {
        return res.status(404).render('error', {
            title: 'Error',
            errorCode: 404,
            errorDescription: 'Folder not found',
            errorMessage: 'The folder you are looking for does not exist.',
        });
    }

    if (folder.visibilityName !== 'public') {
        return res.status(403).render('error', {
            title: 'Error',
            errorCode: 403,
            errorDescription: 'Access Denied',
            errorMessage: 'This folder is private and cannot be viewed.',
        });
    }

    const files = queries.getPublicFilesByFolderId(folderId);
    res.render('share-folder', {
        title: `Shared: ${folder.name}`,
        folder,
        files,
    });
}

function controllerGetSharedFile(req, res) {
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

    if (file.visibilityName !== 'public') {
        return res.status(403).render('error', {
            title: 'Error',
            errorCode: 403,
            errorDescription: 'Access Denied',
            errorMessage: 'This file is private and cannot be viewed.',
        });
    }

    const isImage = file.mimeType && file.mimeType.startsWith('image/');
    res.render('share-file', {
        title: `Shared: ${file.name}`,
        file,
        isImage,
    });
}

module.exports = {
    controllerGetSharedFolder,
    controllerGetSharedFile,
};
