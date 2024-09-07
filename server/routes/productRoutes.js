const productController = require('../controllers/productController');

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: productController.getAllProducts,
  },
];
