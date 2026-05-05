import React, { useState } from "react";
import { signUpAPI } from '../auth';
import { Link } from 'react-router-dom';
import Layout from "../core/Layout";

function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    });

    const { name, email, password, error, success } = formData;

    const handleChange = name => event => {
        setFormData({ ...formData, error: false, [name]: event.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        signUpAPI({ name, email, password }).then((data) => {
            if (data.error) {
                setFormData({ ...formData, error: data.error, success: false });
            } else {
                setFormData({ name: '', email: '', password: '', error: '', success: true });
            }
        });
    };

    return (
        <Layout>
            <div className="auth-page">
                <div className="auth-card">
                    <div className="auth-header">
                        <span className="auth-logo">🛍️</span>
                        <h1 className="auth-title">Create account</h1>
                        <p className="auth-subtitle">Join us and start shopping today</p>
                    </div>

                    {error   && <div className="auth-alert error">{error}</div>}
                    {success && (
                        <div className="auth-alert success">
                            Account created! <Link to="/signin">Sign in now →</Link>
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={handleChange('name')}
                                placeholder="John Doe"
                                required
                            />
                        </div>

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
                                placeholder="Min. 6 characters"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary btn-full btn-lg">
                            Create Account
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account?
                        <Link to="/signin">Sign in</Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
}

export default SignUp;
