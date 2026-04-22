const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3003;

let orders = [];

// GET semua order
app.get('/orders', (req, res) => {
  res.json(orders);
});

// GET order by id
app.get('/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const order = orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
});

// POST order
app.post('/orders', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        message: 'userId, productId, and quantity are required'
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: 'Quantity must be greater than 0'
      });
    }

    // cek user ke User Service
    let userResponse;
    try {
      userResponse = await axios.get(`http://localhost:3001/users/${userId}`);
    } catch (err) {
      return res.status(404).json({
        message: 'User not found or User Service unavailable'
      });
    }

    // cek product ke Product Service
    let productResponse;
    try {
      productResponse = await axios.get(`http://localhost:3002/products/${productId}`);
    } catch (err) {
      return res.status(404).json({
        message: 'Product not found or Product Service unavailable'
      });
    }

    const user = userResponse.data;
    const product = productResponse.data;

    const total = product.price * quantity;

    const newOrder = {
      id: orders.length + 1,
      userId: user.id,
      userName: user.name,
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
      total,
      status: 'SUCCESS'
    };

    orders.push(newOrder);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Order Service running on http://localhost:${PORT}`);
});