const db = require('../config/database'); // Make sure you have the correct path for your DB connection
const CommonHelper = require('../helpers/commonHelper');

const insertProducts = async (products) => {
  const timeStart = process.hrtime();

  const insertQuery = `
    INSERT INTO products (id, title, price, sku, image, description) 
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (id) 
    DO UPDATE SET 
      title = EXCLUDED.title,
      price = EXCLUDED.price,
      sku = EXCLUDED.sku,
      image = EXCLUDED.image,
      description = EXCLUDED.description;
  `;

  const insertPromises = products.products.map((product) => {
    return db.none(insertQuery, [product.id, product.title, product.price, product.sku, product.thumbnail, product.description]);
  });

  Promise.all(insertPromises);

  const timeDiff = process.hrtime(timeStart);
  const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
  const logData = { timeTaken: timeTaken };

  CommonHelper.log(['INFO', 'insertProducts', 'dbHelpers.js'], { logData });

  return;
};

const getProducts = async () => {
  const timeStart = process.hrtime();
  const dataFromDB = db.any('SELECT * FROM products');
  const timeDiff = process.hrtime(timeStart);
  const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
  const logData = { timeTaken: timeTaken };
  CommonHelper.log(['INFO', 'getProducts', 'dbHelpers.js'], { logData });

  return dataFromDB;
};

const updateProduct = async (productId, productData) => {
  const timeStart = process.hrtime();
  const updateQuery = `
      UPDATE products
      SET title = $1, price = $2, sku = $3, image = $4, description = $5
      WHERE id = $6;
  `;
  try {
    await db.none(updateQuery, [productData.title, productData.price, productData.sku, productData.image, productData.description, productId]);
    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    CommonHelper.log(['INFO', 'updateProduct', 'dbHelpers.js'], { timeTaken });
    return { success: true, message: 'Product updated successfully' };
  } catch (error) {
    CommonHelper.log(['ERROR', 'updateProduct', 'dbHelpers.js'], { error: error.message });
    return { success: false, message: 'Failed to update product', error: error.message };
  }
};

const deleteProduct = async (productId) => {
  const timeStart = process.hrtime();
  const deleteQuery = `
      DELETE FROM products
      WHERE id = $1;
  `;
  try {
    await db.none(deleteQuery, [productId]);
    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    CommonHelper.log(['INFO', 'deleteProduct', 'dbHelpers.js'], { timeTaken });
    return { success: true, message: 'Product deleted successfully' };
  } catch (error) {
    CommonHelper.log(['ERROR', 'deleteProduct', 'dbHelpers.js'], { error: error.message });
    return { success: false, message: 'Failed to delete product', error: error.message };
  }
};

const insertProduct = async (productData) => {
  const timeStart = process.hrtime();
  const insertQuery = `
      INSERT INTO products (title, price, sku, image, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
  `;
  try {
    const newProductId = await db.one(insertQuery, [
      productData.title,
      productData.price,
      productData.sku,
      productData.image,
      productData.description
    ]);
    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    CommonHelper.log(['INFO', 'insertProduct', 'dbHelpers.js'], { timeTaken });
    return { success: true, message: 'Product inserted successfully', newProductId: newProductId.id };
  } catch (error) {
    CommonHelper.log(['ERROR', 'insertProduct', 'dbHelpers.js'], { error: error.message });
    return { success: false, message: 'Failed to insert product', error: error.message };
  }
};

const getProductDetails = async (productId) => {
  const timeStart = process.hrtime();
  const detailsQuery = `
      SELECT id, title, price, sku, image, description
      FROM products
      WHERE id = $1;
  `;
  try {
    const productDetails = await db.oneOrNone(detailsQuery, [productId]);
    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    CommonHelper.log(['INFO', 'getProductDetails', 'dbHelpers.js'], { timeTaken });
    if (productDetails) {
      return { success: true, data: productDetails };
    } else {
      return { success: false, message: 'Product not found' };
    }
  } catch (error) {
    CommonHelper.log(['ERROR', 'getProductDetails', 'dbHelpers.js'], { error: error.message });
    return { success: false, message: 'Failed to retrieve product details', error: error.message };
  }
};

module.exports = {
  insertProducts,
  getProducts,
  updateProduct,
  deleteProduct,
  insertProduct,
  getProductDetails
};
