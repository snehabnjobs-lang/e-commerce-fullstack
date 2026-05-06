import React, { memo, useCallback, useEffect, useState, useRef } from "react";
import { listRelatedProducts } from '../api/product';

import Carousel from '../ui/Carousel';

function RelatedProducts({ productId }) {
    const [products, setProducts] = useState([]);
    const isInitialMount = useRef(true); // Track initial mount

    const loadProducts = useCallback(() => {
        listRelatedProducts(productId).then(
            (data) => {
                if (data?.products) {
                    setProducts(data.products);
                }
            })
    }, [productId])

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false; // Set to false after the first call
        } else if (productId) {
            loadProducts();
        }
    }, [productId, loadProducts]);

    return (
        <Carousel
            products={products}
            title="Related Products"
            isLoading={false}
        />
        
    )
}

export default memo(RelatedProducts);
