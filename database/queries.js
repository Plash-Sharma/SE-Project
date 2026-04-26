const { getDb } = require('./init');

// ==================== USER QUERIES ====================

function createUser(username, name, hashedPassword) {
    const db = getDb();
    const stmt = db.prepare('INSERT INTO User (username, name, password) VALUES (?, ?, ?)');
    return stmt.run(username, name, hashedPassword);
}

function getUserByUsername(username) {
    const db = getDb();
    return db.prepare('SELECT * FROM User WHERE username = ?').get(username);
}

function getUserById(userId) {
    const db = getDb();
    return db.prepare('SELECT * FROM User WHERE userId = ?').get(userId);
}

// ==================== VISIBILITY QUERIES ====================

function getAllVisibilities() {
    const db = getDb();
    return db.prepare('SELECT * FROM Visibility').all();
}

function getVisibilityByName(name) {
    const db = getDb();
    return db.prepare('SELECT * FROM Visibility WHERE name = ?').get(name);
}

// ==================== FOLDER QUERIES ====================

function createFolder(name, description, visibilityId, userId) {
    const db = getDb();
    const stmt = db.prepare('INSERT INTO Folder (name, description, visibilityId, userId) VALUES (?, ?, ?, ?)');
    return stmt.run(name, description || null, visibilityId, userId);
}

function getFoldersByUserId(userId) {
    const db = getDb();
    return db.prepare(`
        SELECT f.*, v.name as visibilityName, 
               (SELECT COUNT(*) FROM File WHERE folderId = f.folderId) as fileCount
        FROM Folder f
        JOIN Visibility v ON f.visibilityId = v.visibilityId
        WHERE f.userId = ?
        ORDER BY f.folderId DESC
    `).all(userId);
}

function getFolderById(folderId) {
    const db = getDb();
    return db.prepare(`
        SELECT f.*, v.name as visibilityName, u.username as ownerUsername
        FROM Folder f
        JOIN Visibility v ON f.visibilityId = v.visibilityId
        JOIN User u ON f.userId = u.userId
        WHERE f.folderId = ?
    `).get(folderId);
}

function updateFolder(folderId, name, description, visibilityId) {
    const db = getDb();
    const stmt = db.prepare('UPDATE Folder SET name = ?, description = ?, visibilityId = ? WHERE folderId = ?');
    return stmt.run(name, description || null, visibilityId, folderId);
}

function deleteFolder(folderId) {
    const db = getDb();
    // Delete all files in folder first
    db.prepare('DELETE FROM File WHERE folderId = ?').run(folderId);
    return db.prepare('DELETE FROM Folder WHERE folderId = ?').run(folderId);
}

// ==================== FILE QUERIES ====================

function createFile(name, originalName, description, mimeType, size, storagePath, visibilityId, folderId) {
    const db = getDb();
    const stmt = db.prepare(`
        INSERT INTO File (name, originalName, description, mimeType, size, storagePath, visibilityId, folderId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(name, originalName, description || null, mimeType, size, storagePath, visibilityId, folderId);
}

function getFilesByFolderId(folderId) {
    const db = getDb();
    return db.prepare(`
        SELECT fi.*, v.name as visibilityName
        FROM File fi
        JOIN Visibility v ON fi.visibilityId = v.visibilityId
        WHERE fi.folderId = ?
        ORDER BY fi.fileId DESC
    `).all(folderId);
}

function getFileById(fileId) {
    const db = getDb();
    return db.prepare(`
        SELECT fi.*, v.name as visibilityName,
               fo.name as folderName, fo.userId as ownerId, fo.folderId as parentFolderId
        FROM File fi
        JOIN Visibility v ON fi.visibilityId = v.visibilityId
        JOIN Folder fo ON fi.folderId = fo.folderId
        WHERE fi.fileId = ?
    `).get(fileId);
}

function updateFile(fileId, name, description, visibilityId) {
    const db = getDb();
    const stmt = db.prepare('UPDATE File SET name = ?, description = ?, visibilityId = ? WHERE fileId = ?');
    return stmt.run(name, description || null, visibilityId, fileId);
}

function deleteFile(fileId) {
    const db = getDb();
    return db.prepare('DELETE FROM File WHERE fileId = ?').run(fileId);
}

function getPublicFilesByFolderId(folderId) {
    const db = getDb();
    const publicVis = getVisibilityByName('public');
    return db.prepare(`
        SELECT fi.*, v.name as visibilityName
        FROM File fi
        JOIN Visibility v ON fi.visibilityId = v.visibilityId
        WHERE fi.folderId = ? AND fi.visibilityId = ?
        ORDER BY fi.fileId DESC
    `).all(folderId, publicVis.visibilityId);
}

module.exports = {
    createUser,
    getUserByUsername,
    getUserById,
    getAllVisibilities,
    getVisibilityByName,
    createFolder,
    getFoldersByUserId,
    getFolderById,
    updateFolder,
    deleteFolder,
    createFile,
    getFilesByFolderId,
    getFileById,
    updateFile,
    deleteFile,
    getPublicFilesByFolderId,
};
