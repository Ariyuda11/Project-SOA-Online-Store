const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3002;

let products = [];

// GET semua product
app.get('/products', (req, res) => {
  res.json(products);
});

// GET product by id
app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});

// POST product
app.post('/products', (req, res) => {
  const { name, price, stock } = req.body;

  if (!name || price == null || stock == null) {
    return res.status(400).json({
      message: 'Name, price, and stock are required'
    });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price,
    stock
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.listen(PORT, () => {
  console.log(`Product Service running on http://localhost:${PORT}`);
});