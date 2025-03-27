const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');

// PayPal configuration
let environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
let client = new paypal.core.PayPalHttpClient(environment);

// Initialize checkout session
router.post('/create-order', async (req, res) => {
  try {
    const { items } = req.body;
    
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: items.reduce((total, item) => 
            total + (item.price * item.quantity), 0).toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: items.reduce((total, item) => 
                total + (item.price * item.quantity), 0).toFixed(2)
            }
          }
        },
        items: items.map(item => ({
          name: item.name,
          unit_amount: {
            currency_code: 'USD',
            value: item.price.toFixed(2)
          },
          quantity: item.quantity
        }))
      }]
    });

    const order = await client.execute(request);
    res.json({ orderId: order.result.id });
  } catch (error) {
    console.error('PayPal order creation error:', error);
    res.status(500).json({ message: 'Error creating PayPal order' });
  }
});

// Handle successful payment
router.post('/capture-order', async (req, res) => {
  try {
    const { orderID } = req.body;
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    const capture = await client.execute(request);
    
    // Here you can add logic to save the order to your database
    
    res.json({ 
      message: 'Payment successful',
      captureID: capture.result.purchase_units[0].payments.captures[0].id
    });
  } catch (error) {
    console.error('PayPal capture error:', error);
    res.status(500).json({ message: 'Error capturing PayPal payment' });
  }
});

module.exports = router; 