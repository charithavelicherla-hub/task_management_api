const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

let db;

async function initializeDatabase() {
    db = await open({
        filename: path.join(__dirname, "../data/tasks.db"),
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'pending',
            priority TEXT NOT NULL DEFAULT 'medium',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("Database initialized successfully.");
}

function getDatabase() {
    if (!db) {
        throw new Error("Database has not been initialized.");
    }

    return db;
}

module.exports = {
    initializeDatabase,
    getDatabase
};