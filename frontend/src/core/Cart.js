import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { getCart } from "../utils/cartHelpers";
import ProductCard from "../ui/ProductCard";
import Checkout from "./Checkout";

const Cart = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        setItems(getCart());
    }, []);

    return (
        <Layout>
            <div className="page-content">
                <div className="cart-page">
                    <div>
                        <h2 className="cart-heading">
                            Your Cart
                            <span>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                        </h2>

                        {items.length > 0 ? (
                            <div className="cart-list">
                                {items.map((product, i) => (
                                    <ProductCard
                                        key={i}
                                        product={product}
                                        showAddToCartButton={false}
                                        cartUpdate={true}
                                        showRemoveProductButton={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="cart-empty">
                                <div className="empty-icon">🛒</div>
                                <h3 className="empty-title">Your cart is empty</h3>
                                <p className="empty-desc">Looks like you haven't added anything yet.</p>
                                <Link to="/shop" className="btn-primary">Continue Shopping</Link>
                            </div>
                        )}
                    </div>

                    <div className="cart-summary">
                        <h3 className="summary-title">Order Summary</h3>
                        <Checkout products={items} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Cart;
