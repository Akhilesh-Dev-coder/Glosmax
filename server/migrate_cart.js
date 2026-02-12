const db = require("./database/db");

// Add cart column to users table
db.run(`ALTER TABLE users ADD COLUMN cart TEXT`, (err) => {
  if (err) {
    if (err.message.includes("duplicate column name")) {
      console.log("Column 'cart' already exists.");
    } else {
      console.error("Error adding 'cart' column:", err.message);
    }
  } else {
    console.log("Successfully added 'cart' column to users table.");
  }
});
