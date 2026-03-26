const Database = require("better-sqlite3");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

function initDb({ dbPath, defaultAdminUsername, defaultAdminPassword }) {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      material TEXT,
      size TEXT,
      country TEXT,
      stock INTEGER DEFAULT 0,
      images TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      product_name TEXT,
      quantity INTEGER NOT NULL,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      note TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const existingAdmin = db.prepare("SELECT id FROM admins LIMIT 1").get();
  if (!existingAdmin) {
    const hash = bcrypt.hashSync(defaultAdminPassword, 10);
    db.prepare(
      "INSERT INTO admins (id, username, password) VALUES (?, ?, ?)",
    ).run(uuidv4(), defaultAdminUsername, hash);
    console.log(
      `Default admin created - username: ${defaultAdminUsername}, password: ${defaultAdminPassword}`,
    );
  }

  return db;
}

module.exports = { initDb };
