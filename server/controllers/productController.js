const db = require('../config/database');

// Get all products
const getAllProducts = async (req, h) => {
  try {
    const products = await db.any('SELECT * FROM users');
    return h.response(products).code(200);
  } catch (error) {
    return h.response({ error: 'Unable to fetch products' }).code(500);
  }
};

module.exports = {
  getAllProducts,
};
