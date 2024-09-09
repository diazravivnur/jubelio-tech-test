const db = require('../../config/database');
const CommonHelper = require('../../helpers/commonHelper');
const dbHelpers = require('../../helpers/dbHelpers');

jest.mock('../../config/database');
jest.mock('../../helpers/commonHelper');

describe('dbHelpers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('insertProducts', () => {
    it('should insert multiple products and log success', async () => {
      const mockProducts = {
        products: [{ id: 1, title: 'Product 1', price: 100, sku: 'SKU1', image: 'img1.jpg', description: 'Desc 1' }]
      };

      db.none.mockResolvedValueOnce();

      await dbHelpers.insertProducts(mockProducts);

      expect(db.none).toHaveBeenCalledTimes(mockProducts.products.length);
      expect(CommonHelper.log).toHaveBeenCalledWith(['INFO', 'insertProducts', 'dbHelpers.js'], expect.any(Object));
    });
  });

  describe('getProducts', () => {
    it('should return all products from the database', async () => {
      const mockProducts = [{ id: 2, title: 'Product 2', price: 200, sku: 'SKU2', image: 'img2.jpg', description: 'Desc 2' }];
      db.any.mockResolvedValue(mockProducts);

      const result = await dbHelpers.getProducts();

      expect(db.any).toHaveBeenCalledWith('SELECT * FROM products');
      expect(result).toEqual(mockProducts);
      expect(CommonHelper.log).toHaveBeenCalledWith(['INFO', 'getProducts', 'dbHelpers.js'], expect.any(Object));
    });
  });

  describe('updateProduct', () => {
    it('should update a product and log success', async () => {
      db.none.mockResolvedValueOnce();

      const mockProductData = {
        title: 'Updated Product',
        price: 150,
        sku: 'UpdatedSKU',
        image: 'updated-image.jpg',
        description: 'Updated description'
      };

      const result = await dbHelpers.updateProduct(1, mockProductData);

      expect(db.none).toHaveBeenCalledWith(expect.any(String), [
        mockProductData.title,
        mockProductData.price,
        mockProductData.sku,
        mockProductData.image,
        mockProductData.description,
        1
      ]);
      expect(result).toEqual({ success: true, message: 'Product updated successfully' });
      expect(CommonHelper.log).toHaveBeenCalledWith(['INFO', 'updateProduct', 'dbHelpers.js'], expect.any(Object));
    });

    it('should handle errors when updating a product', async () => {
      db.none.mockRejectedValueOnce(new Error('DB Update Error'));

      const result = await dbHelpers.updateProduct(1, {});

      expect(result).toEqual({
        success: false,
        message: 'Failed to update product',
        error: 'DB Update Error'
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and log success', async () => {
      db.none.mockResolvedValueOnce();

      const result = await dbHelpers.deleteProduct(1);

      expect(db.none).toHaveBeenCalledWith(expect.any(String), [1]);
      expect(result).toEqual({ success: true, message: 'Product deleted successfully' });
      expect(CommonHelper.log).toHaveBeenCalledWith(['INFO', 'deleteProduct', 'dbHelpers.js'], expect.any(Object));
    });

    it('should handle errors when deleting a product', async () => {
      db.none.mockRejectedValueOnce(new Error('DB Delete Error'));

      const result = await dbHelpers.deleteProduct(1);

      expect(result).toEqual({
        success: false,
        message: 'Failed to delete product',
        error: 'DB Delete Error'
      });
      expect(CommonHelper.log).toHaveBeenCalledWith(['ERROR', 'deleteProduct', 'dbHelpers.js'], expect.any(Object));
    });
  });

  describe('getProductDetails', () => {
    it('should return product details', async () => {
      const mockProductDetails = { id: 1, title: 'Product 1', price: 100, sku: 'SKU1', description: 'Desc 1' };
      db.oneOrNone.mockResolvedValueOnce(mockProductDetails);

      const result = await dbHelpers.getProductDetails(1);

      expect(db.oneOrNone).toHaveBeenCalledWith(expect.any(String), [1]);
      expect(result).toEqual({ success: true, data: mockProductDetails });
      expect(CommonHelper.log).toHaveBeenCalledWith(['INFO', 'getProductDetails', 'dbHelpers.js'], expect.any(Object));
    });

    it('should return an error if product not found', async () => {
      db.oneOrNone.mockResolvedValueOnce(null);

      const result = await dbHelpers.getProductDetails(1);

      expect(result).toEqual({ success: false, message: 'Product not found' });
      expect(CommonHelper.log).toHaveBeenCalledWith(['INFO', 'getProductDetails', 'dbHelpers.js'], expect.any(Object));
    });

    it('should handle errors when getting product details', async () => {
      db.oneOrNone.mockRejectedValueOnce(new Error('DB Fetch Error'));

      const result = await dbHelpers.getProductDetails(1);

      expect(result).toEqual({
        success: false,
        message: 'Failed to retrieve product details',
        error: 'DB Fetch Error'
      });
      expect(CommonHelper.log).toHaveBeenCalledWith(['ERROR', 'getProductDetails', 'dbHelpers.js'], expect.any(Object));
    });
  });
});
