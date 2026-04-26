const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

// ------------ GET ROUTES ------------
router.get('/', indexController.controllerGetIndex);
router.get('/signup', indexController.controllerGetSignup);
router.get('/login', indexController.controllerGetLogin);
router.get('/help', indexController.controllerGetHelp);
router.get('/logout', indexController.controllerGetLogout);
router.get('/create-folder', indexController.controllerGetCreateFolder);
router.get('/edit-folder/:folderId', indexController.controllerGetEditFolder);
router.get('/delete-folder/:folderId', indexController.controllerGetDeleteFolder);

// ------------ POST ROUTES ------------
router.post('/signup', indexController.controllerPostSignup);
router.post('/login', indexController.controllerPostLogin);
router.post('/logout', indexController.controllerPostLogout);
router.post('/create-folder', indexController.controllerPostCreateFolder);
router.post('/edit-folder/:folderId', indexController.controllerPostEditFolder);
router.post('/delete-folder/:folderId', indexController.controllerPostDeleteFolder);

module.exports = router;
