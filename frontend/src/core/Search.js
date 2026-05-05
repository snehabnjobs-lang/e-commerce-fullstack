import React, { useEffect, useState } from "react";
import { getCategories } from "../api/admin";
import { listProduct } from "../api/product";
import ProductCard from "../ui/ProductCard";

function Search() {
    const [data, setData] = useState({
        categories: [],
        category: '',
        search: '',
        results: [],
        searched: false
    });

    const { category, search, results, searched } = data;

    useEffect(() => {
        getCategories().then(_data => {
            if (!_data?.error) setData(prev => ({ ...prev, categories: _data }));
        });
    }, []);

    const searchSubmit = (e) => {
        e.preventDefault();
        if (!search) return;
        listProduct({ search, category: category || undefined }).then(response => {
            if (!response?.error) {
                setData(prev => ({ ...prev, results: response, searched: true }));
            }
        });
    };

    const handleChange = (name) => (event) => {
        setData(prev => ({ ...prev, [name]: event.target.value, searched: false }));
    };

    return (
        <div>
            <form className="search-bar" onSubmit={searchSubmit}>
                <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                    type="search"
                    className="search-input"
                    onChange={handleChange('search')}
                    value={search}
                    placeholder="Search products…"
                />
            </form>

            {searched && (
                <p className="text-muted" style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                    {results.length > 0
                        ? `Found ${results.length} product${results.length !== 1 ? 's' : ''}`
                        : 'No products found'}
                </p>
            )}

            <div className="product-grid" style={{ marginTop: '1.5rem' }}>
                {results.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
}

export default Search;
