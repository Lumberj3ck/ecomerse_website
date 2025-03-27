const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const db = require('../db/database');

// Add this near the top of payment.js
if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
  console.error('PayPal credentials are not set in environment variables');
}

// Create order in database
router.post('/order', async (req, res) => {
  try {
    const { items, shipping, paypalOrderId, total } = req.body;

    // Insert order
    db.run(
      `INSERT INTO orders (
        total_amount, status, paypal_order_id, 
        shipping_name, shipping_address, shipping_city, shipping_postal_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
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