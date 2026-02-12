const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'orders.sqlite');

const orderDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening order database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the orders SQLite database.');
        orderDb.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            amount INTEGER NOT NULL,
            user_name TEXT NOT NULL,
            house TEXT,
            street TEXT,
            town TEXT,
            city TEXT,
            pincode TEXT,
            phone_number TEXT,
            payment_status TEXT DEFAULT 'pending', -- pending, success, failed
            razorpay_order_id TEXT,
            razorpay_payment_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating orders table: ' + err.message);
            } else {
                console.log('Orders table ready.');
            }
        });
    }
});

module.exports = orderDb;
