const productController = require('../controllers/productController');
const validationHelper = require('../helpers/validationHelper');
module.exports = [
  {
    method: 'GET',
    path: '/api/v1/import-product',
    handler: productController.importProducts
  },
  {
    method: 'GET',
    path: '/api/v1/products',
    handler: productController.getAllProducts
  },
  {
    method: 'GET',
    path: '/api/v1/products/{id}',
    handler: productController.getProductDetails
  },
  {
    method: 'PUT',
    path: '/api/v1/products/{id}',
    handler: productController.updateProduct,
    options: {
      validate: {
        params: validationHelper.productIdSchema,
        payload: validationHelper.productUpdateSchema
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/v1/products/{id}',
    handler: productController.deleteProduct
  },
  {
    method: 'POST',
    path: '/api/v1/products',
    handler: productController.insertProduct
  }
];
