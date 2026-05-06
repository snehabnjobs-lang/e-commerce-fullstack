import React, { useState, useEffect, useCallback } from "react";
import Layout from "../core/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, update, updateUser } from "../api/user";

const IconArrowLeft = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
);
const IconUser = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);
const IconMail = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
    </svg>
);
const IconLock = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
);
const IconEye = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
);
const IconEyeOff = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
);
const IconCheckCircle = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
);

const UserProfile = () => {
    const [values, setValues] = useState({
        name: "", email: "", password: "",
        error: "", success: false, loading: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const { userId } = useParams();
    const navigate = useNavigate();

    const initials = values.name
        ? values.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
        : "?";

    const init = useCallback(() => {
        getUser(userId).then(data => {
            if (data?.error) {
                setValues(v => ({ ...v, error: "Failed to load profile." }));
            } else {
                setValues(v => ({ ...v, name: data.name, email: data.email }));
            }
        });
    }, [userId]);

    useEffect(() => {
        if (userId) init();
    }, [userId, init]);

    const handleChange = field => e => {
        setValues(v => ({ ...v, error: "", [field]: e.target.value }));
    };

    const clickSubmit = async e => {
        e.preventDefault();
        setValues(v => ({ ...v, loading: true, error: "" }));
        try {
            const data = await update({ name: values.name, email: values.email, password: values.password });
            if (data.error) {
                setValues(v => ({ ...v, loading: false, error: data.error }));
            } else {
                updateUser(data, () => {
                    setValues(v => ({ ...v, name: data.name, email: data.email, password: "", success: true, loading: false }));
                });
            }
        } catch {
            setValues(v => ({ ...v, loading: false, error: "Something went wrong. Please try again." }));
        }
    };

    if (values.success) {
        return (
            <Layout>
                <div className="profile-edit-page">
                    <div className="profile-edit-success-card">
                        <div className="pes-icon"><IconCheckCircle /></div>
                        <h2 className="pes-title">Profile Updated!</h2>
                        <p className="pes-desc">Your changes have been saved successfully.</p>
                        <button className="pes-btn" onClick={() => navigate("/user/dashboard")}>
                            <IconArrowLeft />
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="profile-edit-page">
                <div className="profile-edit-container">

                    <button className="profile-back-btn" onClick={() => navigate("/user/dashboard")}>
                        <IconArrowLeft />
                        Back to Dashboard
                    </button>

                    <div className="profile-edit-card">
                        <div className="pec-header">
                            <div className="pec-avatar">{initials}</div>
                            <div className="pec-header-text">
                                <h1 className="pec-title">Edit Profile</h1>
                                <p className="pec-subtitle">Update your name, email or password</p>
                            </div>
                        </div>

                        {values.error && (
                            <div className="pec-error">{values.error}</div>
                        )}

                        <form className="pec-form" onSubmit={clickSubmit}>
                            <div className="pec-field">
                                <label className="pec-label">
                                    <span className="pec-label-icon"><IconUser /></span>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    className="pec-input"
                                    value={values.name}
                                    onChange={handleChange("name")}
                                    placeholder="Your full name"
                                    required
                                />
                            </div>

                            <div className="pec-field">
                                <label className="pec-label">
                                    <span className="pec-label-icon"><IconMail /></span>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="pec-input"
                                    value={values.email}
                                    onChange={handleChange("email")}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div className="pec-field">
                                <label className="pec-label">
                                    <span className="pec-label-icon"><IconLock /></span>
                                    New Password
                                    <span className="pec-optional">optional</span>
                                </label>
                                <div className="pec-password-wrap">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="pec-input"
                                        value={values.password}
                                        onChange={handleChange("password")}
                                        placeholder="Leave blank to keep current password"
                                    />
                                    <button
                                        type="button"
                                        className="pec-eye-btn"
                                        onClick={() => setShowPassword(v => !v)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <IconEyeOff /> : <IconEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="pec-actions">
                                <button
                                    type="button"
                                    className="pec-cancel-btn"
                                    onClick={() => navigate("/user/dashboard")}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="pec-submit-btn"
                                    disabled={values.loading}
                                >
                                    {values.loading
                                        ? <span className="pec-spinner" />
                                        : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default UserProfile;
