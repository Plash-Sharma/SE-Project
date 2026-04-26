const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');

// ------------ GET ROUTES ------------
router.get('/:folderId', folderController.controllerGetFolder);
router.get('/:folderId/create-file', folderController.controllerGetCreateFile);
router.get('/:folderId/file/:fileId', folderController.controllerGetFile);
router.get('/:folderId/edit-file/:fileId', folderController.controllerGetEditFile);
router.get('/:folderId/delete-file/:fileId', folderController.controllerGetDeleteFile);
router.get('/:folderId/download/:fileId', folderController.controllerGetDownload);

// ------------ POST ROUTES ------------
router.post('/:folderId/create-file',
    folderController.upload.single('file'),
    folderController.fileMetaValidation,
    folderController.controllerPostCreateFile
);

router.post('/:folderId/edit-file/:fileId',
    folderController.fileMetaValidation,
    folderController.controllerPostEditFile
);

router.post('/:folderId/delete-file/:fileId', folderController.controllerPostDeleteFile);

module.exports = router;
