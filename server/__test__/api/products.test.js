const Hapi = require('@hapi/hapi');
const productController = require('../../controllers/productController');
const DatabaseHelper = require('../../helpers/dbHelpers');
const AxiosHelper = require('../../helpers/axiosHelper');
const CommonHelper = require('../../helpers/commonHelper');

jest.mock('../../helpers/dbHelpers');
jest.mock('../../helpers/axiosHelper');

let server;

beforeAll(async () => {
  server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  server.route([
    { method: 'GET', path: '/api/v1/products', handler: productController.getAllProducts },
    { method: 'GET', path: '/api/v1/import-product', handler: productController.importProducts },
    { method: 'PUT', path: '/api/v1/products/{id}', handler: productController.updateProduct },
    { method: 'DELETE', path: '/api/v1/products/{id}', handler: productController.deleteProduct },
    { method: 'POST', path: '/api/v1/products', handler: productController.insertProduct },
    { method: 'GET', path: '/api/v1/products/{id}', handler: productController.getProductDetails }
  ]);
});

afterAll(async () => {
  await server.stop();
});

describe('GET /products', () => {
  it('should return all products from the database with correctly encrypted IDs', async () => {
    const mockProducts = [
      { id: 1, name: 'Product 1' },
      { id: 2, name: 'Product 2' }
    ];

    const mockEncryptId = jest.fn((id) => {
      const encryptionMap = {
        1: '7d0b8bf3d6dd836ba3c87830eeeda788:bc9eee2e3865fc46ed804805b8a9aa71',
        2: 'cce2d2f45c8f4512796537f853e497fa:a0fa2e3821cd34c295f14f4da9f0c80d'
      };
      return encryptionMap[id] || id;
    });

    CommonHelper.encryptId = mockEncryptId;

    const encryptedProducts = mockProducts.map((item) => ({
      ...item,
      id: CommonHelper.encryptId(item.id.toString())
    }));

    DatabaseHelper.getProducts.mockResolvedValue(mockProducts);

    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/products'
    });

    expect(response.statusCode).toBe(200);
    const responsePayload = JSON.parse(response.payload);

    expect(responsePayload.data).toEqual(encryptedProducts);
  });
});

describe('GET /api/v1/import-product', () => {
  it('should fetch and insert products successfully', async () => {
    const mockProducts = [{ id: 1, name: 'Product 1' }];
    const encryptedProducts = mockProducts.map((item) => ({
      ...item,
      id: CommonHelper.encryptId(item.id.toString())
    }));
    AxiosHelper.getData.mockResolvedValue(mockProducts);
    DatabaseHelper.insertProducts.mockResolvedValue();

    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/import-product'
    });

    expect(response.statusCode).toBe(200);
    expect(DatabaseHelper.insertProducts).toHaveBeenCalledWith(mockProducts);
  });
});

describe('PUT /products/{id}', () => {
  it('should update the product successfully', async () => {
    const productId = '46d612f8a662904864d55640ff8110ca:d525b4418da9218d66cfc0b8e7476016';
    const productData = { name: 'Updated Product' };
    DatabaseHelper.updateProduct.mockResolvedValue();

    const response = await server.inject({
      method: 'PUT',
      url: `/api/v1/products/${productId}`,
      payload: productData
    });

    expect(response.statusCode).toBe(200);
  });
});

describe('DELETE /products/{id}', () => {
  it('should delete the product successfully', async () => {
    const productId = '46d612f8a662904864d55640ff8110ca:d525b4418da9218d66cfc0b8e7476016';
    DatabaseHelper.deleteProduct.mockResolvedValue();

    const response = await server.inject({
      method: 'DELETE',
      url: `/api/v1/products/${productId}`
    });

    expect(response.statusCode).toBe(200);
  });
});

describe('POST /products', () => {
  it('should insert a new product successfully', async () => {
    const newProduct = { name: 'New Product' };
    DatabaseHelper.insertProduct.mockResolvedValue();

    const response = await server.inject({
      method: 'POST',
      url: '/api/v1/products',
      payload: newProduct
    });

    expect(response.statusCode).toBe(200);
    expect(DatabaseHelper.insertProduct).toHaveBeenCalledWith(newProduct);
  });
});

describe('GET /products/{id}', () => {
  it('should fetch product details successfully', async () => {
    const mockProduct = { id: 1, name: 'Product 1' };
    DatabaseHelper.getProductDetails.mockResolvedValue({ success: true, data: mockProduct });

    const response = await server.inject({
      method: 'GET',
      url: `/api/v1/products/46d612f8a662904864d55640ff8110ca:d525b4418da9218d66cfc0b8e7476016`
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload).data).toEqual(mockProduct);
  });
});
