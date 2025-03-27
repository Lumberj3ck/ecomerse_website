const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/', (req, res) => {
  db.all(`
    SELECT 
      o.*,
      oi.product_id,
      oi.quantity,
      oi.price,
      p.name as product_name
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    ORDER BY o.created_at DESC
  `, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error fetching orders' });
    }

    if (!rows || rows.length === 0) {
      return res.json([]);
    }

    // Group order items by order
    const orders = rows.reduce((acc, row) => {
      if (!row.id) return acc;
      
      const order = acc.find(o => o.id === row.id);
      
      if (order) {
        if (row.product_id) {  // Only add item if product exists
          order.items.push({
            id: row.product_id,
            name: row.product_name,
            quantity: row.quantity,
            price: row.price
          });
        }
      } else {
        const newOrder = {
          id: row.id,
          total_amount: row.total_amount,
          status: row.status,
          shipping_name: row.shipping_name,
          shipping_address: row.shipping_address,
          shipping_city: row.shipping_city,
          shipping_postal_code: row.shipping_postal_code,
          created_at: row.created_at,
          items: []
        };
        
        if (row.product_id) {  // Only add item if product exists
          newOrder.items.push({
            id: row.product_id,
            name: row.product_name,
            quantity: row.quantity,
            price: row.price
          });
        }
        
        acc.push(newOrder);
      }
      
      return acc;
    }, []);

    res.json(orders);
  });
});

module.exports = router; 