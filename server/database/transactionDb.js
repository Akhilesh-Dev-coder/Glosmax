const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'transactions.sqlite');

const transactionDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening transaction database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the transactions SQLite database.');
        transactionDb.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            payment_id TEXT NOT NULL,
            amount INTEGER NOT NULL,
            status TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating transactions table: ' + err.message);
            } else {
                console.log('Transactions table ready.');
            }
        });
    }
});

module.exports = transactionDb;
