import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../ui/ProductCard";
import "./ProductList.css";

const ProductList = ({ products = [], header, subheader, showViewAll = false }) => {
  if (!products.length) return null;

  return (
    <section className="product-section">
      <div className="product-container">

        <div className="product-section-header">
          <div className="product-section-heading">
            <h2 className="product-section-title">{header}</h2>
            {subheader && <p className="product-section-sub">{subheader}</p>}
          </div>
          {showViewAll && (
            <Link to="/shop" className="view-all-link">
              View All
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
