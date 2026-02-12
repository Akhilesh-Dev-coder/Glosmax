const productDb = require('../database/productDb');

exports.addReview = (req, res) => {
    const { productId } = req.params;
    const { user, rating, comment } = req.body;

    if (!productId) {
        return res.status(400).json({ success: false, error: 'Product ID is required' });
    }
    if (!user || !rating || !comment) {
        return res.status(400).json({ success: false, error: 'User, rating, and comment are required' });
    }

    // rating validation
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({ success: false, error: 'Rating must be a number between 1 and 5' });
    }

    // 1. Get current product data
    productDb.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Database error fetching product' });
        }
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        let reviews = [];
        try {
            reviews = JSON.parse(product.reviews || '[]');
        } catch (e) {
            console.error('Error parsing reviews JSON', e);
            reviews = [];
        }

        // 2. Add new review
        const newReview = {
            user,
            rating: numRating,
            comment,
            date: new Date().toISOString()
        };
        reviews.push(newReview);

        // 3. Recalculate stats
        const reviewCount = reviews.length;
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = (totalRating / reviewCount).toFixed(1); // Keep 1 decimal place

        // 4. Update product
        const updateQuery = `
            UPDATE products 
            SET reviews = ?, rating = ?, review_count = ? 
            WHERE id = ?
        `;

        productDb.run(updateQuery, [JSON.stringify(reviews), averageRating, reviewCount, productId], function (err) {
            if (err) {
                return res.status(500).json({ success: false, error: 'Failed to update product with review' });
            }
            res.status(201).json({
                success: true,
                message: 'Review added successfully',
                productStats: {
                    rating: averageRating,
                    reviewCount: reviewCount
                },
                newReview: newReview
            });
        });
    });
};
