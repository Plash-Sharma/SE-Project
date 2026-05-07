const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'uploader.db');

let db;

function getDb() {
    if (!db) {
        const fs = require('fs');
        const dataDir = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        initializeSchema();
    }
    return db;
}

function initializeSchema() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS Visibility (
            visibilityId INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS User (
            userId INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            password TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Folder (
            folderId INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            visibilityId INTEGER NOT NULL DEFAULT 1,
            userId INTEGER NOT NULL,
            parentFolderId INTEGER DEFAULT NULL,
            FOREIGN KEY (visibilityId) REFERENCES Visibility(visibilityId),
            FOREIGN KEY (userId) REFERENCES User(userId),
            FOREIGN KEY (parentFolderId) REFERENCES Folder(folderId) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS File (
            fileId INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            originalName TEXT NOT NULL,
            description TEXT,
            mimeType TEXT,
            size INTEGER DEFAULT 0,
            storagePath TEXT NOT NULL,
            creationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
            visibilityId INTEGER NOT NULL DEFAULT 1,
            folderId INTEGER NOT NULL,
            FOREIGN KEY (visibilityId) REFERENCES Visibility(visibilityId),
            FOREIGN KEY (folderId) REFERENCES Folder(folderId) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS Session (
            sid TEXT PRIMARY KEY,
            sess TEXT NOT NULL,
            expired DATETIME NOT NULL
        );
    `);

    // Seed visibility options if not exist
    const count = db.prepare('SELECT COUNT(*) as cnt FROM Visibility').get();
    if (count.cnt === 0) {
        const insert = db.prepare('INSERT INTO Visibility (name, description) VALUES (?, ?)');
        insert.run('private', 'Only visible to the owner of the file/folder');
        insert.run('public', 'Visible to anyone with the link');
    }

    // Migration: add parentFolderId to Folder if it doesn't exist (for existing databases)
    try {
        db.exec('ALTER TABLE Folder ADD COLUMN parentFolderId INTEGER DEFAULT NULL REFERENCES Folder(folderId) ON DELETE CASCADE');
    } catch (e) {
        // Column already exists — ignore
    }
}

// Graceful shutdown — close DB connection
process.on('SIGTERM', () => {
    if (db) {
        db.close();
    }
});

module.exports = { getDb };
