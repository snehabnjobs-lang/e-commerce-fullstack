import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/product';
import { useToast } from '../context/ToastContext';

import Layout from './Layout';
import Banner from './Banner';
import Carousel from '../ui/Carousel';

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
            if (sellRes?.data) setProductsBySell(sellRes.data);
            if (arrivalRes?.data) setProductsByArrival(arrivalRes.data);
        }).catch(() => {
            toast.error('Failed to connect to the server. Please try again.');
        }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Layout>
            <Banner />
                <Carousel
                    products={productsBySell}
                    eyebrow="Top Picks"
                    title="Best Sellers"
                    viewAllLink="/shop"
                    renderBadge={(product) =>
                        product.sold > 0 && (
                            <span className="bs-card-sold-badge">🔥 {product.sold} sold</span>
                        )
                    }
                    isLoading={loading}
                />

                <Carousel
                    products={productsByArrival}
                    eyebrow="Just Arrived"
                    title="New Arrivals"
                    viewAllLink="/shop"
                    renderBadge={() => (
                        <span className="bs-card-sold-badge bs-card-new-badge">🌿 New</span>
                    )}
                    isLoading={loading}
                />
            
        </Layout>
    );
}

export default Home;
