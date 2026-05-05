import React, { useCallback, useEffect, useState } from "react";
import { useUserData } from "../hooks/useAuth";
import Layout from "./Layout";
import ProductCard from "../ui/ProductCard";
import { getCategories } from "../api/admin";
import { prices } from '../utils/fixedPrices';
import { getFilteredProduct } from '../api/product';

function Shop() {
    const { token } = useUserData();

    const [filters, setFilters] = useState({ filters: { category: [], price: [] } });
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [priceFilter, setPriceFilter] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [error, setError] = useState(false);
    const limit = 6;
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(0);

    const loadFilteredResults = (newFilters) => {
        getFilteredProduct(skip, limit, newFilters).then((data) => {
            if (data.error) { setError(data.error); }
            else { setFilteredResults(data.data); setSize(data.size); setSkip(0); }
        });
    };

    const loadMore = () => {
        getFilteredProduct(skip + limit, limit, filters.filters).then((data) => {
            if (data.error) { setError(data.error); }
            else { setFilteredResults([...filteredResults, ...data.data]); setSize(data.size); }
        });
    };

    const handleToggle = (categoryId) => () => {
        const pos = checked.indexOf(categoryId);
        const next = [...checked];
        pos === -1 ? next.push(categoryId) : next.splice(pos, 1);
        setChecked(next);
        handleFilters(next, 'category');
    };

    const handlePriceToggle = (val) => {
        setPriceFilter(val);
        handleFilters(val, 'price');
    };

    const loadCategories = useCallback(() => {
        getCategories({ token }).then((data) => {
            if (!data.error) setCategories(data);
        });
    }, [token]);

    useEffect(() => {
        loadCategories();
        loadFilteredResults(filters.filters); // eslint-disable-line react-hooks/exhaustive-deps
    }, [loadCategories]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleFilters = (selectedValues, filterBy = 'category') => {
        const newFilters = { ...filters };
        if (filterBy === 'price') {
            let array = [];
            for (let key in prices) {
                if (prices[key]._id === parseInt(selectedValues)) array = prices[key].array;
            }
            newFilters.filters[filterBy] = array;
        } else {
            newFilters.filters[filterBy] = selectedValues;
        }
        loadFilteredResults(newFilters.filters);
        setFilters(newFilters);
    };

    return (
        <Layout>
            <div className="page-content">
                <div className="shop-page">
                    <aside className="shop-sidebar">
                        <p className="shop-sidebar__title">Filters</p>

                        <div className="shop-sidebar__section">
                            <p className="shop-sidebar__section-label">Categories</p>
                            <ul className="shop-sidebar__list">
                                {categories.map((cat, i) => (
                                    <li key={i}>
                                        <label className="form-check">
                                            <input
                                                type="checkbox"
                                                onChange={handleToggle(cat._id)}
                                                checked={checked.includes(cat._id)}
                                            />
                                            <span className="form-check-label">{cat.name}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="shop-sidebar__section">
                            <p className="shop-sidebar__section-label">Price Range</p>
                            <ul className="shop-sidebar__list">
                                {prices.map((price, i) => (
                                    <li key={i}>
                                        <label className="form-check">
                                            <input
                                                type="radio"
                                                name="price"
                                                value={price._id}
                                                checked={priceFilter === price._id}
                                                onChange={() => handlePriceToggle(price._id)}
                                            />
                                            <span className="form-check-label">{price.name}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    <div className="shop-main">
                        <div className="shop-topbar">
                            <p className="result-count">
                                Showing <strong>{filteredResults.length}</strong> products
                            </p>
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="product-grid">
                            {filteredResults.map((product, i) => (
                                <ProductCard key={i} product={product} />
                            ))}
                        </div>

                        {filteredResults.length === 0 && (
                            <div className="empty-state">
                                <p className="empty-title">No products found</p>
                                <p className="empty-desc">Try adjusting your filters.</p>
                            </div>
                        )}

                        {size > 0 && size >= limit && (
                            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                <button className="btn-secondary" onClick={loadMore}>Load More</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Shop;
