require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const paymentRouter = require('./routes/payment');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const ordersRouter = require('./routes/orders');

app.use('/api/orders', ordersRouter); 
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 