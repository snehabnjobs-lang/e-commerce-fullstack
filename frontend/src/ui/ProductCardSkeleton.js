import React from 'react';

const ProductCardSkeleton = () => (
    <div className="skeleton-card">
        <div className="skeleton-img" />
        <div className="skeleton-body">
            <div className="skeleton-line w-75" />
            <div className="skeleton-line w-50" />
            <div className="skeleton-line w-90" />
            <div className="skeleton-line w-60" />
            <div className="skeleton-footer">
                <div className="skeleton-pill" />
                <div className="skeleton-btn" />
            </div>
        </div>
    </div>
);

/* Renders n skeleton cards inside the product grid */
const ProductGridSkeleton = ({ count = 8 }) => (
    <div className="product-grid">
        {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
        ))}
    </div>
);

export { ProductCardSkeleton, ProductGridSkeleton };
export default ProductCardSkeleton;
