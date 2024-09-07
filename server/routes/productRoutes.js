const productController = require('../controllers/productController');
const validationHelper = require('../helpers/validationHelper')
module.exports = [
  {
    method: 'GET',
    path: '/import-product',
    handler: productController.importProducts
  },
  {
    method: 'GET',
    path: '/products',
    handler: productController.getAllProducts
  },
  {
    method: 'GET',
    path: '/products/{id}',
    handler: productController.getProductDetails
  },
  {
    method: 'PUT',
    path: '/products/{id}',
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
    path: '/products/{id}',
    handler: productController.deleteProduct
  },
  {
    method: 'POST',
    path: '/products',
    handler: productController.insertProduct
  },
  
];
