import React, { useEffect, useState } from 'react';
import { getPurchaseHistory } from '../api/user';

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
                <div key={i}>
                    {order?.products?.map((p, j) => (
                        <div key={j} className="order-row">
                            <div className="order-info">
                                <span className="order-name">{p.name}</span>
                                <span className="order-date">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}</span>
                            </div>
                            <span className="order-total">${p.price}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default PurchaseHistory;
