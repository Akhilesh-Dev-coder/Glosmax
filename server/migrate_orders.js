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

db.serialize(() => {
  // Check if column exists first
  db.all("PRAGMA table_info(orders)", [], (err, rows) => {
    if (err) {
      console.error("Error getting table info:", err);
      return;
    }

    const columnExists = rows.some((row) => row.name === "items");

    if (!columnExists) {
      console.log("Adding 'items' column to orders table...");
      db.run("ALTER TABLE orders ADD COLUMN items TEXT", (err) => {
        if (err) {
          console.error("Error adding column:", err.message);
        } else {
          console.log("Column 'items' added successfully.");
        }
      });
    } else {
      console.log("Column 'items' already exists.");
    }
  });

  // Also verify schema
  db.all("PRAGMA table_info(orders)", [], (err, rows) => {
    // console.log("Final Schema:", rows);
  });
});
