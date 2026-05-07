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

function createFolder(name, description, visibilityId, userId, parentFolderId = null) {
    const db = getDb();
    const stmt = db.prepare('INSERT INTO Folder (name, description, visibilityId, userId, parentFolderId) VALUES (?, ?, ?, ?, ?)');
    return stmt.run(name, description || null, visibilityId, userId, parentFolderId);
}

function getFoldersByUserId(userId) {
    const db = getDb();
    return db.prepare(`
        SELECT f.*, v.name as visibilityName, 
               (SELECT COUNT(*) FROM File WHERE folderId = f.folderId) as fileCount,
               (SELECT COUNT(*) FROM Folder cf WHERE cf.parentFolderId = f.folderId) as subfolderCount
        FROM Folder f
        JOIN Visibility v ON f.visibilityId = v.visibilityId
        WHERE f.userId = ? AND f.parentFolderId IS NULL
        ORDER BY f.folderId DESC
    `).all(userId);
}

function getSubfoldersByFolderId(folderId) {
    const db = getDb();
    return db.prepare(`
        SELECT f.*, v.name as visibilityName, 
               (SELECT COUNT(*) FROM File WHERE folderId = f.folderId) as fileCount,
               (SELECT COUNT(*) FROM Folder cf WHERE cf.parentFolderId = f.folderId) as subfolderCount
        FROM Folder f
        JOIN Visibility v ON f.visibilityId = v.visibilityId
        WHERE f.parentFolderId = ?
        ORDER BY f.folderId DESC
    `).all(folderId);
}

function getFolderById(folderId) {
    const db = getDb();
    return db.prepare(`
        SELECT f.*, v.name as visibilityName, u.username as ownerUsername,
               pf.name as parentFolderName, pf.folderId as parentFolderIdRef
        FROM Folder f
        JOIN Visibility v ON f.visibilityId = v.visibilityId
        JOIN User u ON f.userId = u.userId
        LEFT JOIN Folder pf ON f.parentFolderId = pf.folderId
        WHERE f.folderId = ?
    `).get(folderId);
}

function getFolderBreadcrumbs(folderId) {
    const db = getDb();
    const breadcrumbs = [];
    let currentId = folderId;
    while (currentId) {
        const folder = db.prepare('SELECT folderId, name, parentFolderId FROM Folder WHERE folderId = ?').get(currentId);
        if (!folder) break;
        breadcrumbs.unshift(folder);
        currentId = folder.parentFolderId;
    }
    return breadcrumbs;
}

function getAllDescendantFolderIds(folderId) {
    const db = getDb();
    const ids = [];
    const queue = [folderId];
    while (queue.length > 0) {
        const currentId = queue.shift();
        ids.push(currentId);
        const children = db.prepare('SELECT folderId FROM Folder WHERE parentFolderId = ?').all(currentId);
        children.forEach(c => queue.push(c.folderId));
    }
    return ids;
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
    getSubfoldersByFolderId,
    getFolderById,
    getFolderBreadcrumbs,
    getAllDescendantFolderIds,
    updateFolder,
    deleteFolder,
    createFile,
    getFilesByFolderId,
    getFileById,
    updateFile,
    deleteFile,
    getPublicFilesByFolderId,
};
