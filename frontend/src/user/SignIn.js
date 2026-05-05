import React, { useState } from "react";
import { signInAPI, authenticate, isAuthenticated } from '../auth';
import { Navigate, Link } from 'react-router-dom';
import Layout from "../core/Layout";

function SignIn() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        redirectToReferrer: false
    });

    const { email, password, loading, error, redirectToReferrer } = formData;
    const { user } = isAuthenticated();

    const handleChange = name => event => {
        setFormData({ ...formData, error: false, [name]: event.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormData({ ...formData, error: false, loading: true });
        signInAPI({ email, password }).then((data) => {
            if (data.error) {
                setFormData({ ...formData, error: data.error, loading: false });
            } else {
                authenticate(data, () => {
                    setFormData({ ...formData, redirectToReferrer: true });
                });
            }
        });
    };

    if (redirectToReferrer) {
        return <Navigate to={user?.role === 1 ? '/admin/dashboard' : '/'} />;
    }
    if (isAuthenticated()) return <Navigate to="/" />;

    return (
        <Layout>
            <div className="auth-page">
                <div className="auth-card">
                    <div className="auth-header">
                        <span className="auth-logo">🛍️</span>
                        <h1 className="auth-title">Welcome back</h1>
                        <p className="auth-subtitle">Sign in to your account to continue</p>
                    </div>

                    {error && <div className="auth-alert error">{error}</div>}
                    {loading && <div className="auth-alert info">Signing you in…</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={handleChange('email')}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={handleChange('password')}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary btn-full btn-lg">
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account?
                        <Link to="/signup">Create one</Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
}

export default SignIn;
