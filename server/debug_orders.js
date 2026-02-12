const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "database/orders.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
    process.exit(1);
  }
  console.log("Connected to the orders database.");
});

db.all(
  "SELECT id, user_name, amount, payment_status FROM orders",
  [],
  (err, rows) => {
    if (err) {
      throw err;
    }
    console.log("Orders found:", rows.length);
    rows.forEach((row) => {
      console.log(
        `Order ${row.id}: Name='${row.user_name}', Amount=${row.amount}, Status=${row.payment_status}`,
      );
    });
  },
);
