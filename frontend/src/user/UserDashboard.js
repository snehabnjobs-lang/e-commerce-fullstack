import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import PurchaseHistory from "./PurchaseHistory";
import { getPurchaseHistory } from "../api/user";

// ── Icons ──────────────────────────────────────────────────────────────────
const IconUser = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
);
const IconPackage = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
);
const IconMapPin = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
    </svg>
);
const IconMail = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
    </svg>
);
const IconShield = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
);
const IconEdit = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);

// ── My Profile section ─────────────────────────────────────────────────────
function ProfileSection({ id, name, email, isAdmin }) {
    return (
        <div className="profile-card">
            <div className="profile-info-rows">
                <div className="profile-info-row">
                    <span className="profile-info-icon"><IconUser /></span>
                    <div className="profile-info-text">
                        <span className="profile-info-label">Display name</span>
                        <span className="profile-info-value">{name}</span>
                    </div>
                </div>
                <div className="profile-info-row">
                    <span className="profile-info-icon"><IconMail /></span>
                    <div className="profile-info-text">
                        <span className="profile-info-label">Email address</span>
                        <span className="profile-info-value">{email}</span>
                    </div>
                </div>
                <div className="profile-info-row">
                    <span className="profile-info-icon"><IconShield /></span>
                    <div className="profile-info-text">
                        <span className="profile-info-label">Account type</span>
                        <span className="profile-info-value">{isAdmin ? "Administrator" : "Registered User"}</span>
                    </div>
                </div>
            </div>
            <div className="profile-card-footer">
                <Link to={`/profile/${id}`} className="profile-edit-btn">
                    <IconEdit />
                    Edit Profile
                </Link>
            </div>
        </div>
    );
}

// ── Icons for address section ──────────────────────────────────────────────
const IconCheck = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
);
const IconX = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);
const IconTrash = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14H6L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4h6v2"/>
    </svg>
);
const IconPlus = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
);

const LS_KEY = "freshroot_addresses";
const loadSaved = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; } };
const saveSaved = arr => localStorage.setItem(LS_KEY, JSON.stringify(arr));

// ── My Address section ─────────────────────────────────────────────────────
function AddressSection() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [editingIdx, setEditingIdx] = useState(null);
    const [editText, setEditText]     = useState("");
    const [addingNew, setAddingNew]   = useState(false);
    const [newText, setNewText]       = useState("");

    useEffect(() => {
        getPurchaseHistory().then(data => {
            const saved = loadSaved();
            const savedMap = Object.fromEntries(saved.map(s => [s.originalText ?? s.text, s]));

            let merged = [];
            if (data && !data.error) {
                const seen = new Set();
                for (const o of data) {
                    const raw = o.address?.trim();
                    if (!raw || seen.has(raw)) continue;
                    seen.add(raw);
                    const override = savedMap[raw];
                    merged.push({
                        text:         override?.text ?? raw,
                        originalText: raw,
                        date:         o.createdAt,
                        isCustom:     false,
                    });
                }
            }
            // Append purely manual addresses (not from orders)
            for (const s of saved) {
                if (s.isCustom) merged.push(s);
            }
            setAddresses(merged);
            setLoading(false);
        });
    }, []);

    const persist = updated => {
        setAddresses(updated);
        // Save overrides + custom entries
        const toSave = updated
            .filter(a => a.isCustom || a.text !== a.originalText)
            .map(a => ({ text: a.text, originalText: a.originalText, date: a.date, isCustom: a.isCustom }));
        saveSaved(toSave);
    };

    const startEdit = idx => { setEditingIdx(idx); setEditText(addresses[idx].text); };
    const cancelEdit = ()  => { setEditingIdx(null); setEditText(""); };

    const saveEdit = idx => {
        if (!editText.trim()) return;
        const updated = addresses.map((a, i) => i === idx ? { ...a, text: editText.trim() } : a);
        persist(updated);
        setEditingIdx(null);
    };

    const deleteAddress = idx => {
        persist(addresses.filter((_, i) => i !== idx));
    };

    const saveNew = () => {
        if (!newText.trim()) return;
        persist([...addresses, { text: newText.trim(), originalText: null, isCustom: true, date: new Date().toISOString() }]);
        setNewText(""); setAddingNew(false);
    };

    if (loading) return <div className="address-loading">Loading addresses…</div>;

    return (
        <div className="address-section">
            {addresses.length === 0 && !addingNew && (
                <div className="empty-state">
                    <div className="empty-state-icon"><IconMapPin /></div>
                    <p className="empty-title">No saved addresses</p>
                    <p className="empty-desc">Addresses you enter at checkout will appear here, or add one manually.</p>
                </div>
            )}

            <div className="address-list">
                {addresses.map((a, i) => (
                    <div key={i} className={`address-card ${editingIdx === i ? "editing" : ""}`}>
                        <div className="address-card-icon"><IconMapPin /></div>

                        <div className="address-card-body">
                            <span className="address-card-label">
                                {a.isCustom ? "Saved address" : `Delivery address ${i + 1}`}
                            </span>

                            {editingIdx === i ? (
                                <textarea
                                    className="address-edit-textarea"
                                    value={editText}
                                    onChange={e => setEditText(e.target.value)}
                                    rows={3}
                                    autoFocus
                                />
                            ) : (
                                <p className="address-card-text">{a.text}</p>
                            )}

                            {a.date && editingIdx !== i && (
                                <span className="address-card-date">
                                    {a.isCustom ? "Added manually" : `Used on ${new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                                </span>
                            )}
                        </div>

                        <div className="address-card-actions">
                            {editingIdx === i ? (
                                <>
                                    <button className="addr-btn save"   onClick={() => saveEdit(i)} title="Save"><IconCheck /></button>
                                    <button className="addr-btn cancel" onClick={cancelEdit}         title="Cancel"><IconX /></button>
                                </>
                            ) : (
                                <>
                                    <span className={`address-card-badge ${i === 0 && !a.isCustom ? "default" : ""}`}>
                                        {i === 0 && !a.isCustom ? "Most recent" : a.isCustom ? "Custom" : `#${i + 1}`}
                                    </span>
                                    <button className="addr-btn edit"   onClick={() => startEdit(i)} title="Edit"><IconEdit /></button>
                                    <button className="addr-btn delete" onClick={() => deleteAddress(i)} title="Delete"><IconTrash /></button>
                                </>
                            )}
                        </div>
                    </div>
                ))}

                {addingNew && (
                    <div className="address-card editing new-address-card">
                        <div className="address-card-icon"><IconMapPin /></div>
                        <div className="address-card-body">
                            <span className="address-card-label">New address</span>
                            <textarea
                                className="address-edit-textarea"
                                value={newText}
                                onChange={e => setNewText(e.target.value)}
                                placeholder="House no., street, city, pincode…"
                                rows={3}
                                autoFocus
                            />
                        </div>
                        <div className="address-card-actions">
                            <button className="addr-btn save"   onClick={saveNew}                   title="Save"><IconCheck /></button>
                            <button className="addr-btn cancel" onClick={() => { setAddingNew(false); setNewText(""); }} title="Cancel"><IconX /></button>
                        </div>
                    </div>
                )}
            </div>

            {!addingNew && (
                <button className="address-add-btn" onClick={() => setAddingNew(true)}>
                    <IconPlus />
                    Add New Address
                </button>
            )}
        </div>
    );
}

// ── Dashboard ──────────────────────────────────────────────────────────────
const TABS = [
    { key: "profile", label: "My Profile",  Icon: IconUser    },
    { key: "orders",  label: "My Orders",   Icon: IconPackage },
    { key: "address", label: "My Address",  Icon: IconMapPin  },
];

function Dashboard() {
    const { user: { _id, name, email, role } } = isAuthenticated();
    const [activeTab, setActiveTab] = useState("profile");

    const initials = name
        ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
        : "?";
    const isAdmin = role === 1;

    const sectionTitle = TABS.find(t => t.key === activeTab)?.label ?? "";

    return (
        <Layout>
            <div className="page-content">
                <div className="dashboard-page">

                    {/* ── Sidebar ── */}
                    <aside className="dashboard-sidebar">
                        <div className="sidebar-avatar-block">
                            <div className="sidebar-avatar-circle">{initials}</div>
                            <span className="sidebar-name">{name}</span>
                            <span className="sidebar-email">{email}</span>
                            <span className={`sidebar-role-pill ${isAdmin ? "admin" : ""}`}>
                                {isAdmin ? "Admin" : "Member"}
                            </span>
                        </div>

                        <nav>
                            {TABS.map(({ key, label, Icon }) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={activeTab === key ? "active" : ""}
                                    onClick={() => setActiveTab(key)}
                                >
                                    <Icon />
                                    {label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* ── Main ── */}
                    <div className="dashboard-main">
                        <div className="dashboard-section-header">
                            <h2 className="dashboard-section-title">{sectionTitle}</h2>
                        </div>

                        {activeTab === "profile" && (
                            <ProfileSection id={_id} name={name} email={email} isAdmin={isAdmin} />
                        )}
                        {activeTab === "orders" && <PurchaseHistory />}
                        {activeTab === "address" && <AddressSection />}
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export default Dashboard;
