const CommonHelper = require('../helpers/commonHelper');
const AxiosHelper = require('../helpers/axiosHelper');
const DatabaseHelper = require('../helpers/dbHelpers');
const _ = require('lodash');

const importProducts = async (req, h) => {
  const timeStart = process.hrtime();
  try {
    const products = await AxiosHelper.getData('/products');
    await DatabaseHelper.insertProducts(products);
    return CommonHelper.responseSuccess(h, req, 200, 'Success Fetch & Import Products', timeStart, products);
  } catch (error) {
    CommonHelper.log(['ERROR', 'importProducts', 'productController.js'], { message: `${error}` });
    return CommonHelper.errorResponse(h, error.status, error.message);
  }
};

const getAllProducts = async (req, h) => {
  const timeStart = process.hrtime();

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 8;
  const offset = (page - 1) * limit;

  try {
    const dataFromDB = await DatabaseHelper.getProducts();
    const paginatedProducts = dataFromDB.slice(offset, offset + limit);
    const response = paginatedProducts.map((item) => {
      return {
        ...item,
        id: CommonHelper.encryptId(item.id.toString())
      };
    });

    return CommonHelper.responseSuccess(h, req, 200, 'Success Fetch Data From DB', timeStart, response);
  } catch (error) {
    CommonHelper.log(['ERROR', 'getAllProducts', 'productController.js'], { message: `${error}` });
    return CommonHelper.errorResponse(h, error.status, error.message);
  }
};

const updateProduct = async (req, h) => {
  const timeStart = process.hrtime();
  try {
    const productId = CommonHelper.decryptId(req.params.id);
    const productData = req.payload;
    await DatabaseHelper.updateProduct(productId, productData);
    return CommonHelper.responseSuccess(h, req, 200, 'Product Updated Successfully', timeStart);
  } catch (error) {
    CommonHelper.log(['ERROR', 'updateProduct', 'productController.js'], { message: `${error}` });
    return CommonHelper.errorResponse(h, error.status, error.message);
  }
};

const deleteProduct = async (req, h) => {
  const timeStart = process.hrtime();
  try {
    const productId = CommonHelper.decryptId(req.params.id);
    await DatabaseHelper.deleteProduct(productId);
    return CommonHelper.responseSuccess(h, req, 200, 'Product Deleted Successfully', timeStart);
  } catch (error) {
    CommonHelper.log(['ERROR', 'deleteProduct', 'productController.js'], { message: `${error}` });
    return CommonHelper.errorResponse(h, error.status, error.message);
  }
};

const insertProduct = async (req, h) => {
  const timeStart = process.hrtime();
  try {
    const newProduct = req.payload;
    await DatabaseHelper.insertProduct(newProduct);
    return CommonHelper.responseSuccess(h, req, 200, 'Product Inserted Successfully', timeStart, newProduct);
  } catch (error) {
    CommonHelper.log(['ERROR', 'insertProduct', 'productController.js'], { message: `${error}` });
    return CommonHelper.errorResponse(h, error.status, error.message);
  }
};

const getProductDetails = async (req, h) => {
  const timeStart = process.hrtime();
  const productId = CommonHelper.decryptId(req.params.id);
  try {
    const result = await DatabaseHelper.getProductDetails(productId);
    if (result.success) {
      return CommonHelper.responseSuccess(h, req, 200, 'Product details fetched successfully', timeStart, result.data);
    } else {
      return h.response({ message: result.message }).code(404); 
    }
  } catch (error) {
    CommonHelper.log(['ERROR', 'getProductDetails', 'productController.js'], { message: `${error}` });
    return CommonHelper.errorResponse(h, error.status, error.message);
  }
};

module.exports = {
  importProducts,
  getAllProducts,
  updateProduct,
  deleteProduct,
  insertProduct,
  getProductDetails
};
