const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const db = require('../db/database');
const auth = require('../middleware/auth');

// Add this near the top of payment.js
if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
  console.error('PayPal credentials are not set in environment variables');
}

// Create order in database
router.post('/order', auth, async (req, res) => {
  try {
    const { items, shipping, paypalOrderId, total } = req.body;
    const userId = req.user.id; // Get user ID from the request

    // Insert order
    db.run(
      `INSERT INTO orders (
        user_id, total_amount, status, paypal_order_id, 
        shipping_name, shipping_address, shipping_city, shipping_postal_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, // Store user ID
        total,
        'completed',
        paypalOrderId,
        shipping.fullName,
        shipping.address,
        shipping.city,
        shipping.postalCode
      ],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          throw err;
        }

        const orderId = this.lastID;

        // Insert order items
        const stmt = db.prepare(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)'
        );

        items.forEach(item => {
          stmt.run([orderId, item.id, item.quantity, item.price]);
        });

        stmt.finalize();

        res.status(201).json({ 
          message: 'Order created successfully',
          orderId: orderId
        });
      }
    );
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

module.exports = router;