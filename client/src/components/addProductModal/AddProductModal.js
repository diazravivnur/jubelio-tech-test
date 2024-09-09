import React, { useState } from 'react';
import './addProductModal.css';

const AddProductModal = ({ onClose, onAdd }) => {
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (onAdd && newProduct) {
      try {
        await onAdd(newProduct);
        alert('Product successfully added!');
        onClose(); 
      } catch (error) {
        console.error('Error adding product:', error);
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Add New Product</h2>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={newProduct.title}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={newProduct.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Price:
          <input
            type="string"
            name="price"
            value={newProduct.price}
            onChange={handleChange}
          />
        </label>
        <label>
          Image URL:
          <input
            type="text"
            name="image"
            value={newProduct.image}
            onChange={handleChange}
          />
        </label>
        <button className="modal-save" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default AddProductModal;
