import React from 'react';
import ProductCard from '../productCard/ProductCard';
import './productList.css';

const ProductList = ({ products, onProductClick, onAddProduct}) => {
  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
      ))}
      <div className="add-product-button-container">
        <button className="add-product-button" onClick={() => onAddProduct(true)}>Add Product</button>
      </div>
    </div>
  );
};

export default ProductList;
