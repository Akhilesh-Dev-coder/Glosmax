const productDb = require("../database/productDb");

exports.createProduct = (req, res) => {
  const {
    name,
    price,
    description_short,
    long_description,
    category,
    features,
    specifications,
    tag,
    stock,
  } = req.body;

  // Handle image upload
  let image_url = req.body.image_url;
  let images = req.body.images
    ? typeof req.body.images === "string"
      ? JSON.parse(req.body.images)
      : req.body.images
    : [];

  if (req.files && req.files.length > 0) {
    const protocol = req.protocol;
    const host = req.get("host");
    const uploadedImages = req.files.map(
      (file) => `${protocol}://${host}/uploads/${file.filename}`,
    );
    images = [...images, ...uploadedImages];
    image_url = uploadedImages[0]; // Set primary image to the first uploaded one
  }

  if (!image_url && images.length > 0) {
    image_url = images[0];
  }

  if (!name || !price || !image_url) {
    return res
      .status(400)
      .json({ success: false, error: "Name, Price, and Image are required." });
  }

  // Convert arrays/objects to JSON strings for SQLite storage
  const featuresStr =
    typeof features === "string"
      ? features
      : features
        ? JSON.stringify(features)
        : "[]";
  const specificationsStr =
    typeof specifications === "string"
      ? specifications
      : specifications
        ? JSON.stringify(specifications)
        : "{}";
  const reviewsStr = "[]"; // Initialize empty reviews array
  const imagesStr = JSON.stringify(images);

  const query = `
        INSERT INTO products (
            name, price, image_url, description_short, long_description, 
            category, features, specifications, tag, reviews, rating, review_count, images, stock
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0.0, 0, ?, ?)
    `;

  const params = [
    name,
    price,
    image_url,
    description_short || "",
    long_description || "",
    category || "",
    featuresStr,
    specificationsStr,
    tag || "",
    reviewsStr,
    imagesStr,
    stock || 0,
  ];

  productDb.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      productId: this.lastID,
    });
  });
};

exports.getAllProducts = (req, res) => {
  const query = "SELECT * FROM products";

  productDb.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    // Parse JSON strings back to objects
    const products = rows.map((row) => {
      try {
        const safeParse = (val, defaultVal) => {
          if (!val) return defaultVal;
          try {
            let parsed = JSON.parse(val);
            // Handle double-encoding
            if (typeof parsed === "string") {
              try {
                parsed = JSON.parse(parsed);
              } catch (e) {
                return parsed; // Return first parsing if second fails
              }
            }
            return parsed;
          } catch (e) {
            return defaultVal;
          }
        };

        return {
          ...row,
          features: safeParse(row.features, []),
          specifications: safeParse(row.specifications, {}),
          reviews: safeParse(row.reviews, []),
          images: (() => {
            let imgs = safeParse(row.images, []);
            if (imgs.length === 0 && row.image_url) {
              imgs = [row.image_url];
            }
            return imgs;
          })(),
        };
      } catch (e) {
        console.error("Error parsing JSON for product id " + row.id, e);
        // Fallback if parsing fails
        return {
          ...row,
          features: row.features || [],
          specifications: row.specifications || {},
          reviews: row.reviews || [],
          images: row.images
            ? JSON.parse(row.images)
            : row.image_url
              ? [row.image_url]
              : [],
        };
      }
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products: products,
    });
  });
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, error: "Product ID is required" });
  }

  // Define allowed fields to prevent pollution
  const allowedFields = [
    "name",
    "price",
    "image_url",
    "description_short",
    "long_description",
    "category",
    "features",
    "specifications",
    "tag",
    "stock",
  ];

  if (Object.keys(updates).length === 0 && !req.file) {
    return res
      .status(400)
      .json({ success: false, error: "No fields to update provided" });
  }

  // Handle image upload if new file provided
  if (req.files && req.files.length > 0) {
    const protocol = req.protocol;
    const host = req.get("host");
    const newImages = req.files.map(
      (file) => `${protocol}://${host}/uploads/${file.filename}`,
    );

    // If 'images' provided in body (existing images to keep), merge
    let currentImages = [];
    if (updates.images) {
      try {
        currentImages =
          typeof updates.images === "string"
            ? JSON.parse(updates.images)
            : updates.images;
      } catch (e) {
        currentImages = [];
      }
    }

    // Combine existing and new images
    const combinedImages = [...currentImages, ...newImages];
    updates.images = JSON.stringify(combinedImages);
    updates.image_url = newImages[0]; // Update main image to the first *newly uploaded* one, or maybe the first of all? specific logic needed.
    // Let's set image_url to the first of combined images if available
    if (combinedImages.length > 0) {
      updates.image_url = combinedImages[0];
    }
  } else if (updates.images) {
    // Just updating the list of images (e.g. reordering or deleting) without adding new files
    try {
      const imgs =
        typeof updates.images === "string"
          ? JSON.parse(updates.images)
          : updates.images;
      if (imgs.length > 0) {
        updates.image_url = imgs[0];
      }
      updates.images = JSON.stringify(imgs);
    } catch (e) {
      // ignore
    }
  }

  // Handle JSON fields if they are being updated
  if (updates.features) {
    updates.features =
      typeof updates.features === "string"
        ? updates.features
        : JSON.stringify(updates.features);
  }
  if (updates.specifications) {
    updates.specifications =
      typeof updates.specifications === "string"
        ? updates.specifications
        : JSON.stringify(updates.specifications);
  }

  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key) || key === "images") {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  values.push(id); // For the WHERE clause

  const query = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`;

  productDb.run(query, values, function (err) {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (this.changes === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      changes: this.changes,
    });
  });
};

exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, error: "Product ID is required" });
  }

  const query = "DELETE FROM products WHERE id = ?";

  productDb.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (this.changes === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  });
};
