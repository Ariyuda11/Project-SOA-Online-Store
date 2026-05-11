const express = require('express');
const cors = require('cors');
const axios = require('axios');
const amqp = require('amqplib');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3003;

let orders = [];

async function sendOrderToQueue(order) {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();

    const queue = 'order_queue';

    await channel.assertQueue(queue, {
      durable: false
    });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)));

    console.log('Order sent to RabbitMQ:', order);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.log('RabbitMQ error:', error.message);
  }
}

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

    // Jika jalan di Docker, gunakan nama service:
    // user-service dan product-service
    let userResponse;
    try {
      userResponse = await axios.get(`http://user-service:3001/users/${userId}`);
    } catch (err) {
      return res.status(404).json({
        message: 'User not found or User Service unavailable'
      });
    }

    let productResponse;
    try {
      productResponse = await axios.get(`http://product-service:3002/products/${productId}`);
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

    // Kirim order ke RabbitMQ secara asynchronous
    await sendOrderToQueue(newOrder);

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