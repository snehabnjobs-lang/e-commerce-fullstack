import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { signout } from "../auth";

function Menu() {
    const navigate = useNavigate();

    return (
        <nav style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1rem' }}>
            <Link to="/" className="btn-ghost btn-sm">Home</Link>
            <Link to="/signin" className="btn-ghost btn-sm">Sign In</Link>
            <Link to="/signup" className="btn-ghost btn-sm">Sign Up</Link>
            <button
                className="btn-danger btn-sm"
                onClick={() => signout(() => navigate("/"))}
            >
                Sign Out
            </button>
        </nav>
    );
}

export default Menu;
