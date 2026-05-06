import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { addItem } from '../utils/cartHelpers';
import ProductCardImage from './ProductCardImage';

function ProductDetailsCard({ product }) {
    const [redirect, setRedirect] = useState(false);

    const addToCart = () => {
        addItem(product, () => setRedirect(true));
    };

    if (redirect) return <Navigate to="/cart" />;

    if (!product?.name) return null;

    return (
        <div className="product-detail-card">
            <div className="product-detail-image-col">
                <ProductCardImage product={product} url="product" />
            </div>

            <div className="product-detail-info">
                {product.category?.name && (
                    <span className="product-detail-category">{product.category.name}</span>
                )}

                <h1 className="product-detail-title">{product.name}</h1>

                <p className="product-detail-price">₹{product.price}</p>

                <p className="product-detail-description">{product.description}</p>

                <div className="product-detail-meta">
                    {product.quantity > 0 ? (
                        <span className="badge badge-success">In Stock ({product.quantity})</span>
                    ) : (
                        <span className="badge badge-danger">Out of Stock</span>
                    )}
                    {product.shipping && (
                        <span className="badge badge-info">🚚 Free Shipping</span>
                    )}
                </div>

                <button
                    onClick={addToCart}
                    className="btn-primary btn-lg"
                    disabled={product.quantity === 0}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

export default ProductDetailsCard;
