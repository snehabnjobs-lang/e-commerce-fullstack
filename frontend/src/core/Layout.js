import React from "react";
import Navbar from "./Navbar";

function Layout({ className, children }) {
    return (
        <div className="layout-root">
            <div className="shadow-xl shadow-gray-500/50"><Navbar /></div>
            <main className={className}>
                {children}
            </main>
        </div>
    )
}

export default Layout