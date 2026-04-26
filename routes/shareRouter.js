const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');

// ------------ GET ROUTES ------------
router.get('/folder/:folderId', shareController.controllerGetSharedFolder);
router.get('/file/:fileId', shareController.controllerGetSharedFile);

module.exports = router;
