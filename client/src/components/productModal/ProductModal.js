import React, { useEffect, useState } from 'react';
import './productModal.css';

const ProductModal = ({ product, onClose, onDelete, onUpdate }) => {
  const [editProduct, setEditProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (product) {
      setEditProduct({ ...product });
    }
  }, [product]);

  if (!product) return null;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(product.id);
    }
  };

  const handleSave = async () => {
    if (onUpdate && editProduct) {
      try {
        await onUpdate(editProduct, editProduct.id);
        onClose();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <img src={editProduct?.image} alt={editProduct?.title} className="modal-image" />
        {isEditing ? (
          <>
            <h2 className="modal-title">
              <input type="text" name="title" value={editProduct?.title || ''} onChange={handleChange} />
            </h2>
            <p className="modal-description">
              <textarea name="description" value={editProduct?.description || ''} onChange={handleChange} />
            </p>
            <p className="modal-price">
              <input type="text" name="price" value={editProduct?.price || ''} onChange={handleChange} />
            </p>
            <button className="modal-save" onClick={handleSave}>
              Save
            </button>
          </>
        ) : (
          <>
            <h2 className="modal-title">{editProduct?.title}</h2>
            <p className="modal-description">{editProduct?.description}</p>
            <p className="modal-price">${editProduct?.price}</p>
            <button className="modal-edit" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          </>
        )}
        <button className="modal-delete" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductModal;
