const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "products.sqlite");

const productDb = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(
      "Error opening product database " + dbPath + ": " + err.message,
    );
  } else {
    console.log("Connected to the products SQLite database.");
    productDb.run(
      `CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            image_url TEXT NOT NULL,
            description_short TEXT,
            long_description TEXT,
            category TEXT,
            features TEXT, -- JSON Array
            specifications TEXT, -- JSON Object
            tag TEXT,
            rating REAL DEFAULT 0,
            review_count INTEGER DEFAULT 0,
            reviews TEXT DEFAULT '[]' -- JSON Array of review objects
        )`,
      (err) => {
        if (err) {
          console.error("Error creating products table: " + err.message);
        } else {
          console.log("Products table ready.");

          // Check for missing columns (Migration)
          productDb.all("PRAGMA table_info(products)", (err, rows) => {
            if (err) {
              console.error("Error checking table info:", err);
              return;
            }

            // Check for 'images' column
            const hasImagesColumn = rows.some((row) => row.name === "images");
            if (!hasImagesColumn) {
              console.log("Adding 'images' column to products table...");
              productDb.run(
                "ALTER TABLE products ADD COLUMN images TEXT DEFAULT '[]'",
                (err) => {
                  if (err) console.error("Error adding 'images' column:", err);
                  else console.log("'images' column added successfully.");
                },
              );
            }

            // Check for 'stock' column
            const hasStockColumn = rows.some((row) => row.name === "stock");
            if (!hasStockColumn) {
              console.log("Adding 'stock' column to products table...");
              productDb.run(
                "ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0",
                (err) => {
                  if (err) console.error("Error adding 'stock' column:", err);
                  else console.log("'stock' column added successfully.");
                },
              );
            }
          });
        }
      },
    );
  }
});

module.exports = productDb;
