require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/cart');
const checkoutRoutes = require('./src/routes/checkout');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 