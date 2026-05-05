import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/product';
import { useToast } from '../context/ToastContext';

import Layout from './Layout';
import Banner from './Banner';
import BestSellersCarousel from '../ui/BestSellersCarousel';
import ProductList from './ProductList';
import { ProductGridSkeleton } from '../ui/ProductCardSkeleton';

function Home() {
    const [productsBySell, setProductsBySell] = useState([]);
    const [productsByArrival, setProductsByArrival] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        Promise.all([
            getProducts('sold'),
            getProducts('createdAt'),
        ]).then(([sellRes, arrivalRes]) => {
            if (sellRes?.error)    toast.error('Could not load best sellers.');
            else                   setProductsBySell(sellRes?.data ?? []);

            if (arrivalRes?.error) toast.error('Could not load new arrivals.');
            else                   setProductsByArrival(arrivalRes?.data ?? []);
        }).catch(() => {
            toast.error('Failed to connect to the server. Please try again.');
        }).finally(() => setLoading(false));
    }, []);

    return (
        <Layout>
            <Banner />

            {loading ? (
                <section className="bs-section">
                    <div className="bs-container">
                        <div className="bs-header">
                            <div className="bs-header-left">
                                <span className="skeleton-line w-50" style={{ height: '0.75rem', display: 'block', marginBottom: '0.5rem' }} />
                                <span className="skeleton-line w-75" style={{ height: '1.5rem', display: 'block' }} />
                            </div>
                        </div>
                        <ProductGridSkeleton count={4} />
                    </div>
                </section>
            ) : (
                <BestSellersCarousel products={productsBySell} />
            )}

            {loading ? (
                <section className="product-section">
                    <div className="product-container">
                        <div className="skeleton-line w-50" style={{ height: '1.5rem', display: 'block', marginBottom: '2rem' }} />
                        <ProductGridSkeleton count={8} />
                    </div>
                </section>
            ) : (
                productsByArrival.length > 0 && (
                    <ProductList
                        products={productsByArrival}
                        header="New Arrivals"
                        subheader="Just landed — fresh picks added this season"
                        showViewAll
                    />
                )
            )}
        </Layout>
    );
}

export default Home;
