const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Adjust path as needed

router.post('/', async (req, res) => {
  console.log('Received order data:', req.body); // For debugging

  const { user, products, totalAmount, paymentMethodId, address } = req.body;

  if (!Array.isArray(products) || products.length === 0 ||
      typeof totalAmount !== 'number' || !paymentMethodId ||
      !address || !address.street || !address.city || !address.state || !address.zip) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const order = new Order({
      user, // Optional
      products,
      totalAmount,
      paymentMethodId,
      address
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an order by ID
router.put('/:id', async (req, res) => {
  const { user, products, totalAmount, paymentMethodId, address } = req.body;

  if (!Array.isArray(products) || products.length === 0 ||
      typeof totalAmount !== 'number' || !paymentMethodId ||
      !address || !address.street || !address.city || !address.state || !address.zip) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const order = await Order.findByIdAndUpdate(req.params.id, {
      user,
      products,
      totalAmount,
      paymentMethodId,
      address
    }, { new: true });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an order by ID
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
