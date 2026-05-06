import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { processPayment } from "../api/checkout";
import { createOrder } from "../api/order";
import { emptyCart } from "../utils/cartHelpers";
import { isAuthenticated } from "../auth";

const PaymentModal = ({ status, details, failureMsg, onRetry, onClose }) => {
    const isSuccess = status === "success";
    return (
        <div className="payment-modal-overlay" onClick={isSuccess ? undefined : onClose}>
            <div className="payment-modal" onClick={e => e.stopPropagation()}>
                <div className={`payment-modal-icon ${isSuccess ? "success" : "failure"}`}>
                    {isSuccess ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    )}
                </div>

                <h2 className="payment-modal-title">
                    {isSuccess ? "Payment Successful!" : "Payment Failed"}
                </h2>
                <p className="payment-modal-subtitle">
                    {isSuccess
                        ? "Your order has been placed and is being processed."
                        : failureMsg || "Something went wrong. Please try again."}
                </p>

                {isSuccess && details && (
                    <div className="payment-modal-details">
                        <div className="payment-modal-detail-row">
                            <span>Amount Paid</span>
                            <strong>₹{details.amount?.toLocaleString()}</strong>
                        </div>
                        <div className="payment-modal-detail-row">
                            <span>Payment ID</span>
                            <code>{details.paymentId}</code>
                        </div>
                        <div className="payment-modal-detail-row">
                            <span>Delivery To</span>
                            <span className="payment-modal-address">{details.address}</span>
                        </div>
                    </div>
                )}

                <div className="payment-modal-actions">
                    {isSuccess ? (
                        <>
                            <Link to="/user/dashboard" className="payment-modal-btn primary" onClick={onClose}>
                                View My Orders
                            </Link>
                            <Link to="/" className="payment-modal-btn secondary" onClick={onClose}>
                                Continue Shopping
                            </Link>
                        </>
                    ) : (
                        <>
                            <button className="payment-modal-btn primary" onClick={onRetry}>
                                Try Again
                            </button>
                            <Link to="/cart" className="payment-modal-btn secondary" onClick={onClose}>
                                Go to Cart
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const Checkout = ({ products = [] }) => {
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [paymentStatus, setPaymentStatus] = useState(null); // null | 'success' | 'failed'
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [failureMsg, setFailureMsg] = useState("");

    const userId = isAuthenticated()?.user?._id;
    const token = isAuthenticated()?.token;

    const getTotal = () =>
        products.reduce((sum, p) => sum + (p.count || 1) * p.price, 0);

    const handlePayment = async () => {
        if (!address.trim()) { setError("Please enter a delivery address."); return; }
        setLoading(true);
        setError("");

        try {
            const total = getTotal();
            const orderData = { amount: total, currency: "INR", receipt: "receipt#1" };
            const data = await processPayment(userId, token, orderData);
            const { order, success: orderSuccess } = data;

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "FreshRoot",
                description: "Farm-fresh delivery",
                order_id: order.id,
                handler: function (response) {
                    const paidAmount = total;
                    setPaymentDetails({
                        paymentId: response.razorpay_payment_id,
                        amount: paidAmount,
                        address,
                    });
                    setPaymentStatus("success");
                    emptyCart(() => {});

                    if (orderSuccess) {
                        createOrder(userId, token, {
                            products,
                            transaction_id: response.razorpay_payment_id,
                            amount: paidAmount,
                            address,
                        }).catch(console.error);
                    }
                },
                prefill: { name: "", email: "", contact: "" },
                theme: { color: "#3b82f6" },
            };

            const rzp = new window.Razorpay(options);

            rzp.on("payment.failed", function (response) {
                setFailureMsg(response.error?.description || "Payment declined. Please try a different method.");
                setPaymentStatus("failed");
            });

            rzp.open();
        } catch (err) {
            setError("Payment initiation failed. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setPaymentStatus(null);
        setFailureMsg("");
    };

    const handleClose = () => {
        setPaymentStatus(null);
        setFailureMsg("");
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    const total = getTotal();

    return (
        <>
            {paymentStatus && (
                <PaymentModal
                    status={paymentStatus}
                    details={paymentDetails}
                    failureMsg={failureMsg}
                    onRetry={handleRetry}
                    onClose={handleClose}
                />
            )}

            <div className="checkout-card">
                <h3 className="summary-title">Order Summary</h3>

                <ul className="summary-items">
                    {products.map(p => (
                        <li key={p._id} className="summary-item">
                            <span className="summary-item-name">
                                {p.name}
                                <em className="summary-item-qty"> ×{p.count || 1}</em>
                            </span>
                            <span className="summary-item-price">
                                ₹{((p.count || 1) * p.price).toLocaleString()}
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="summary-divider" />

                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                    <span>Delivery</span>
                    <span className="summary-free">Free</span>
                </div>

                <div className="summary-divider" />

                <div className="summary-total">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                </div>

                {isAuthenticated() ? (
                    <div className="summary-checkout-section">
                        <label className="summary-label">Delivery Address</label>
                        <textarea
                            className="summary-address"
                            value={address}
                            onChange={e => { setAddress(e.target.value); setError(""); }}
                            placeholder="House no., street, city, pincode…"
                            rows={3}
                        />
                        {error && <p className="summary-error">{error}</p>}
                        <button
                            className="summary-pay-btn"
                            onClick={handlePayment}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="summary-pay-spinner" />
                            ) : (
                                `Pay ₹${total.toLocaleString()}`
                            )}
                        </button>
                    </div>
                ) : (
                    <Link to="/signin" className="summary-signin-btn">
                        Sign in to Checkout
                    </Link>
                )}
            </div>
        </>
    );
};

export default Checkout;
