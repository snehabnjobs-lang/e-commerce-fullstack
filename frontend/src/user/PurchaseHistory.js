import React, { useEffect, useState } from 'react';
import { getPurchaseHistory } from '../api/user';

const TRACK_STEPS = ["Not processed", "Processing", "Shipped", "Delivered"];

const statusMeta = {
    "Not processed": { label: "Pending",    cls: "status-pending"   },
    "Processing":    { label: "Processing", cls: "status-processing" },
    "Shipped":       { label: "Shipped",    cls: "status-shipped"    },
    "Delivered":     { label: "Delivered",  cls: "status-delivered"  },
    "Cancelled":     { label: "Cancelled",  cls: "status-cancelled"  },
};

function TrackStepper({ status }) {
    if (status === "Cancelled") {
        return (
            <div className="track-cancelled">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                Order Cancelled
            </div>
        );
    }

    const activeIdx = TRACK_STEPS.indexOf(status);

    return (
        <div className="track-stepper">
            {TRACK_STEPS.map((step, i) => (
                <React.Fragment key={step}>
                    <div className={`track-step ${i <= activeIdx ? "done" : ""} ${i === activeIdx ? "active" : ""}`}>
                        <div className="track-dot">
                            {i < activeIdx && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            )}
                        </div>
                        <span className="track-label">{step}</span>
                    </div>
                    {i < TRACK_STEPS.length - 1 && (
                        <div className={`track-line ${i < activeIdx ? "done" : ""}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

function OrderCard({ order, index }) {
    const [expanded, setExpanded] = useState(false);
    const meta = statusMeta[order.status] || statusMeta["Not processed"];
    const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
    }) : "—";
    const shortId = order.transaction_id
        ? String(order.transaction_id).slice(-10).toUpperCase()
        : `ORD-${index + 1}`;

    return (
        <div className="order-card">
            <div className="order-card-header">
                <div className="order-card-meta">
                    <span className="order-card-id">#{shortId}</span>
                    <span className="order-card-date">{orderDate}</span>
                </div>
                <div className="order-card-right">
                    <span className={`order-status-badge ${meta.cls}`}>{meta.label}</span>
                    <span className="order-card-total">₹{Number(order.amount || 0).toLocaleString()}</span>
                </div>
            </div>

            <TrackStepper status={order.status || "Not processed"} />

            {order.address && (
                <div className="order-card-address">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>{order.address}</span>
                </div>
            )}

            <button className="order-card-toggle" onClick={() => setExpanded(v => !v)}>
                {expanded ? "Hide items" : `Show ${order.products?.length || 0} item${order.products?.length !== 1 ? "s" : ""}`}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>

            {expanded && (
                <ul className="order-products-list">
                    {order.products?.map((p, j) => (
                        <li key={j} className="order-product-row">
                            <span className="order-product-name">{p.name}</span>
                            <span className="order-product-qty">×{p.count || 1}</span>
                            <span className="order-product-price">₹{((p.count || 1) * p.price).toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            )}

            {order.transaction_id && (
                <div className="order-txn-id">
                    Txn: <code>{order.transaction_id}</code>
                </div>
            )}
        </div>
    );
}

function PurchaseHistory() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        getPurchaseHistory().then((data) => {
            if (data && !data.error) setHistory(data);
        });
    }, []);

    if (!history.length) {
        return (
            <div className="empty-state">
                <p className="empty-title">No orders yet</p>
                <p className="empty-desc">Your completed orders will appear here.</p>
            </div>
        );
    }

    return (
        <div className="order-history">
            {history.map((order, i) => (
                <OrderCard key={order._id || i} order={order} index={i} />
            ))}
        </div>
    );
}

export default PurchaseHistory;
