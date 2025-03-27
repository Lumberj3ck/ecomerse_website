const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Get all products
router.get('/', (req, res) => {
  db.all('SELECT * FROM products', [], (err, products) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Error fetching products' });
    }
    res.json(products);
  });
});

// Get single product
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
    if (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({ message: 'Error fetching product' });
    }
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });
});

module.exports = router; 