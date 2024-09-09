import React, { useEffect, useState } from 'react';
import useProductStore from '../store/productStore';
import debounce from 'lodash/debounce';

import ProductList from '../components/productList/ProductList';
import ProductModal from '../components/productModal/ProductModal';
import AddProductModal from '../components/addProductModal/AddProductModal';

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const { products, fetchProducts, deleteProduct, updateProduct, addProduct } = useProductStore((state) => ({
    products: state.products,
    fetchProducts: state.fetchProducts,
    deleteProduct: state.deleteProduct,
    updateProduct: state.updateProduct,
    addProduct: state.addProduct
  }));

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setSelectedProduct(null); // Close the modal after deletion
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleUpdate = async (updatedProduct, id) => {
    if (updatedProduct) {
      try {
        await updateProduct(updatedProduct, id);
        alert('Product successfully updated!');
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error('Bad request error:', error.response.data.message);
          alert(`Error: ${error.response.data.message}`); // Show error to the user
        } else {
          console.error('Error updating product:', error);
          alert('An unexpected error occurred. Please try again later.');
        }
      }
    }
  };

  const handleAddProduct = async (newProduct) => {
    if (newProduct) {
      try {
        await addProduct(newProduct);
        alert('Product successfully added!');
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error('Bad request error:', error.response.data.message);
          alert(`Error: ${error.response.data.message}`);
        } else {
          console.error('Error adding product:', error);
          alert('An unexpected error occurred. Please try again later.');
        }
      }
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleOpenAddProductModal = () => {
    setShowAddProductModal(true);
  };

  const handleCloseAddProductModal = () => {
    setShowAddProductModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchProducts(page);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchProducts, page]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    }, 300);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  if (loading && page === 1) return <div>Loading products...</div>;
  if (error) return <div>Error loading products: {error.message}</div>;
  if (!products || products.length === 0) return <div>No products available</div>;

  return (
    <div className="HomePage-logo">
      <div className="content">
        <h1>PRODUCT LIST</h1>
        <ProductList products={products} onProductClick={handleProductClick} onAddProduct={handleOpenAddProductModal} />\
        {selectedProduct && <ProductModal product={selectedProduct} onClose={handleCloseModal} onDelete={handleDelete} onUpdate={handleUpdate} />}
        {showAddProductModal && <AddProductModal onClose={handleCloseAddProductModal} onAdd={handleAddProduct} />}
        {loading && <div>Loading more products...</div>}
      </div>
    </div>
  );
}

export default HomePage;
