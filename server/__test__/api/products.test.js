const Hapi = require('@hapi/hapi');
const productController = require('../../controllers/productController');
const DatabaseHelper = require('../../helpers/dbHelpers');
const AxiosHelper = require('../../helpers/axiosHelper');

// Mock the helpers
jest.mock('../../helpers/dbHelpers');
jest.mock('../../helpers/axiosHelper');

// Initialize Hapi server for testing
let server;

beforeAll(async () => {
  server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  server.route([
    { method: 'GET', path: '/products', handler: productController.getAllProducts },
    { method: 'POST', path: '/products/import', handler: productController.importProducts },
    { method: 'PUT', path: '/products/{id}', handler: productController.updateProduct },
    { method: 'DELETE', path: '/products/{id}', handler: productController.deleteProduct },
    { method: 'POST', path: '/products', handler: productController.insertProduct },
    { method: 'GET', path: '/products/{id}', handler: productController.getProductDetails },
  ]);
});

afterAll(async () => {
  await server.stop();
});

// Test for getAllProducts
describe('GET /products', () => {
  it('should return all products from the database', async () => {
    const mockProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
    DatabaseHelper.getProducts.mockResolvedValue(mockProducts);

    const response = await server.inject({
      method: 'GET',
      url: '/products',
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload).data).toEqual(mockProducts);
  });
});

// Test for importProducts
describe('POST /products/import', () => {
  it('should fetch and insert products successfully', async () => {
    const mockProducts = [{ id: 1, name: 'Product 1' }];
    AxiosHelper.getData.mockResolvedValue(mockProducts);
    DatabaseHelper.insertProducts.mockResolvedValue();

    const response = await server.inject({
      method: 'POST',
      url: '/products/import',
    });

    expect(response.statusCode).toBe(200);
    expect(DatabaseHelper.insertProducts).toHaveBeenCalledWith(mockProducts);
  });
});

// Test for updateProduct
describe('PUT /products/{id}', () => {
  it('should update the product successfully', async () => {
    const productId = 1;
    const productData = { name: 'Updated Product' };
    DatabaseHelper.updateProduct.mockResolvedValue();

    const response = await server.inject({
      method: 'PUT',
      url: `/products/${productId}`,
      payload: productData,
    });

    expect(response.statusCode).toBe(200);
    expect(DatabaseHelper.updateProduct).toHaveBeenCalledWith(productId.toString(), productData);
  });
});

// Test for deleteProduct
describe('DELETE /products/{id}', () => {
  it('should delete the product successfully', async () => {
    const productId = 1;
    DatabaseHelper.deleteProduct.mockResolvedValue();

    const response = await server.inject({
      method: 'DELETE',
      url: `/products/${productId}`,
    });

    expect(response.statusCode).toBe(200);
    expect(DatabaseHelper.deleteProduct).toHaveBeenCalledWith(productId.toString());
  });
});

// Test for insertProduct
describe('POST /products', () => {
  it('should insert a new product successfully', async () => {
    const newProduct = { name: 'New Product' };
    DatabaseHelper.insertProduct.mockResolvedValue();

    const response = await server.inject({
      method: 'POST',
      url: '/products',
      payload: newProduct,
    });

    expect(response.statusCode).toBe(200);
    expect(DatabaseHelper.insertProduct).toHaveBeenCalledWith(newProduct);
  });
});

// Test for getProductDetails
describe('GET /products/{id}', () => {
  it('should fetch product details successfully', async () => {
    const mockProduct = { id: 1, name: 'Product 1' };
    DatabaseHelper.getProductDetails.mockResolvedValue({ success: true, data: mockProduct });

    const response = await server.inject({
      method: 'GET',
      url: '/products/1',
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload).data).toEqual(mockProduct);
  });

  it('should return 404 if product not found', async () => {
    DatabaseHelper.getProductDetails.mockResolvedValue({ success: false, message: 'Product not found' });

    const response = await server.inject({
      method: 'GET',
      url: '/products/999',
    });

    expect(response.statusCode).toBe(404);
  });
});
