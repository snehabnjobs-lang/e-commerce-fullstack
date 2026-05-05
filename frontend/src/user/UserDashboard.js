import React from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from 'react-router-dom';
import PurchaseHistory from "./PurchaseHistory";

function Dashboard() {
    const { user: { _id, name, email, role } } = isAuthenticated();

    return (
        <Layout>
            <div className="page-content">
                <div className="dashboard-page">
                    <aside className="dashboard-sidebar">
                        <div className="sidebar-avatar-block">
                            <div className="sidebar-avatar" style={{
                                background: 'var(--brand-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: '1.5rem', fontWeight: 800
                            }}>
                                {name?.[0]?.toUpperCase()}
                            </div>
                            <span className="sidebar-name">{name}</span>
                            <span className="sidebar-email">{email}</span>
                        </div>
                        <nav>
                            <Link to="/cart">🛒 Cart</Link>
                            <Link to={`/profile/${_id}`}>👤 Update Profile</Link>
                            <Link to="/purchase-history" className="active">📦 Purchase History</Link>
                        </nav>
                    </aside>

                    <div className="dashboard-main">
                        <div className="profile-form">
                            <h2 className="dashboard-section-title">Account Info</h2>
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input className="form-control" value={name} readOnly />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input className="form-control" value={email} readOnly />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <input className="form-control" value={role === 1 ? 'Admin' : 'Registered User'} readOnly />
                            </div>
                        </div>

                        <div>
                            <h2 className="dashboard-section-title">Purchase History</h2>
                            <PurchaseHistory />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;
