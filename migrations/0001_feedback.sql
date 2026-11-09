CREATE TABLE feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT NOT NULL, email TEXT, user_agent TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')));
