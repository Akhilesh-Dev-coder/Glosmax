const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "database/users.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
    process.exit(1);
  }
  console.log("Connected to the users database.");
});

db.all("SELECT * FROM users", [], (err, rows) => {
  if (err) {
    throw err;
  }
  console.log("Users found in DB:", rows.length);
  rows.forEach((row) => {
    console.log(
      `${row.id}: ${row.full_name} (${row.email}) - Admin: ${row.admin}`,
    );
  });
  // Check if 'admin' column exists and what its values are
});
