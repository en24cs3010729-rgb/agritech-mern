const Product = require('../models/Product');
const store = require('../utils/memoryStore');
const { getDbStatus } = require('../config/db');

// @desc    Get all products (with category filter and search)
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    if (getDbStatus()) {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }
      const products = await Product.find(query);
      return res.json({ success: true, count: products.length, data: products });
    }

    let products = [...store.products];
    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
    }
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, data: product });
    }

    const product = store.products.find(p => p._id === id || p.id === id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new product (Admin only)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, category, price, unit, inStock, description, imageUrl, benefits } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name, category, and price are required' });
    }

    if (getDbStatus()) {
      const product = await Product.create({
        name,
        category,
        price: Number(price),
        unit: unit || 'kg',
        inStock: Number(inStock || 50),
        description: description || '',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=600&auto=format&fit=crop&q=80',
        benefits: benefits || []
      });
      return res.status(201).json({ success: true, data: product });
    }

    const newProduct = {
      _id: `prod_${Date.now()}`,
      id: `prod_${Date.now()}`,
      name,
      category,
      price: Number(price),
      unit: unit || 'kg',
      inStock: Number(inStock || 50),
      rating: 5.0,
      description: description || '',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=600&auto=format&fit=crop&q=80',
      benefits: benefits || ['Eco-friendly', 'High Yield Guarantee'],
      createdAt: new Date()
    };

    store.products.push(newProduct);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct };
