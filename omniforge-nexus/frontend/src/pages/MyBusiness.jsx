import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2, Users, TrendingUp, IndianRupee, MapPin, Briefcase,
    Package, Edit3, Plus, Star, Shield, Clock, CheckCircle,
    Globe, Award, Activity, ChevronRight, FileText, BarChart3
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';
import Header from '../components/Header';
import useStore from '../store/useStore';

const revenueData = [
    { month: 'Sep', revenue: 4.2, expenses: 2.8 },
    { month: 'Oct', revenue: 5.1, expenses: 3.1 },
    { month: 'Nov', revenue: 4.8, expenses: 2.9 },
    { month: 'Dec', revenue: 6.3, expenses: 3.4 },
    { month: 'Jan', revenue: 7.1, expenses: 3.8 },
    { month: 'Feb', revenue: 8.4, expenses: 4.2 },
];

const KPIS = [
    { label: 'Annual Revenue', value: '₹2.4 Cr', delta: '+18.5%', up: true, icon: IndianRupee, color: '#10b981' },
    { label: 'Net Profit', value: '22.4%', delta: '+3.1%', up: true, icon: TrendingUp, color: '#6366f1' },
    { label: 'Team Size', value: '24', delta: '+3 YoY', up: true, icon: Users, color: '#f59e0b' },
    { label: 'Orders', value: '138', delta: '+21', up: true, icon: Package, color: '#f97316' },
];

const TEAM = [
    { name: 'Rahul Sharma', role: 'CEO / Owner', avatar: 'R', dept: 'Management', status: 'active', since: '2019' },
    { name: 'Anita Desai', role: 'Finance Manager', avatar: 'A', dept: 'Finance', status: 'active', since: '2021' },
    { name: 'Vijay Patel', role: 'Operations Head', avatar: 'V', dept: 'Operations', status: 'active', since: '2020' },
    { name: 'Sneha Kulkarni', role: 'Sales Executive', avatar: 'S', dept: 'Sales', status: 'active', since: '2022' },
    { name: 'Manish Joshi', role: 'Production Lead', avatar: 'M', dept: 'Production', status: 'on-leave', since: '2021' },
];

const DOCS = [
    { name: 'Udyam Certificate', status: 'valid', expiry: 'Lifetime', icon: '📋' },
    { name: 'GST Registration', status: 'valid', expiry: 'Ongoing', icon: '🏛️' },
    { name: 'Shop Act License', status: 'valid', expiry: 'Dec 2026', icon: '📄' },
    { name: 'FSSAI License', status: 'expiring', expiry: 'Apr 2026', icon: '🍽️' },
    { name: 'Import Export Code', status: 'valid', expiry: 'Lifetime', icon: '🌍' },
    { name: 'ISO 9001:2015', status: 'renewal', expiry: 'Mar 2026', icon: '🏅' },
];

const TABS = ['Overview', 'Team', 'Documents', 'Operations'];

const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: 'var(--panel)', border: '1px solid var(--b1)', borderRadius: 10, padding: '10px 14px', fontSize: 11 }}>
            <div style={{ color: 'var(--t3)', marginBottom: 6, fontWeight: 600 }}>{label}</div>
            {payload.map(p => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: p.color }} />
                    <span style={{ color: 'var(--t2)' }}>{p.name}:</span>
                    <span style={{ color: 'var(--t1)', fontWeight: 700 }}>₹{p.value}L</span>
                </div>
            ))}
        </div>
    );
};

export default function MyBusiness() {
    const { user } = useStore();
    const [tab, setTab] = useState('Overview');

    return (
        <div style={{ flex: 1, overflowY: 'auto' }}>
            <Header title="My Business" subtitle="Business profile, team & operational intelligence" />

            <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* ── Identity Banner ───────────────────── */}
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(249,115,22,.1) 0%, rgba(99,102,241,.08) 100%)',
                        border: '1px solid rgba(249,115,22,.22)',
                        borderRadius: 18, padding: '20px 22px',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', gap: 16,
                        position: 'relative', overflow: 'hidden',
                    }}>
                    <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,115,22,.07),transparent)', pointerEvents: 'none' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1, minWidth: 0 }}>
                        <div style={{
                            width: 58, height: 58, borderRadius: 16, flexShrink: 0,
                            background: 'linear-gradient(135deg,#f97316,#ea580c)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 26, boxShadow: '0 0 28px rgba(249,115,22,.4)',
                        }}>🏭</div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', fontFamily: 'var(--font-display)', letterSpacing: -0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user.businessName}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 4 }}>
                                <span style={{ fontSize: 11, color: 'var(--t3)', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10} />{user.state}</span>
                                <span style={{ fontSize: 11, color: 'var(--t3)', display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={10} />{user.businessType}</span>
                                <span style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={10} />{user.udyamNo}</span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                                <span className="badge badge-green">⭐ ISO Certified</span>
                                <span className="badge badge-indigo">🏆 MSME Star</span>
                                <span className="badge badge-saffron">🇮🇳 Make in India</span>
                            </div>
                        </div>
                    </div>

                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        className="btn btn-secondary" style={{ flexShrink: 0 }}>
                        <Edit3 size={13} /> Edit
                    </motion.button>
                </motion.div>

                {/* ── KPI Row ───────────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
                    {KPIS.map((k, i) => (
                        <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                            className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${k.color},transparent)` }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div className="stat-value" style={{ color: k.color, fontSize: 22 }}>{k.value}</div>
                                    <div className="stat-label">{k.label}</div>
                                    <div className={`stat-delta ${k.up ? 'delta-up' : 'delta-down'}`}>{k.up ? '▲' : '▼'} {k.delta}</div>
                                </div>
                                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${k.color}18`, border: `1px solid ${k.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <k.icon size={15} style={{ color: k.color }} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Tabs ──────────────────────────────── */}
                <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--b1)', paddingBottom: 0 }}>
                    {TABS.map(t => (
                        <button key={t} onClick={() => setTab(t)} style={{
                            padding: '8px 18px', background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 12.5, fontWeight: tab === t ? 700 : 500,
                            color: tab === t ? 'var(--cyan)' : 'var(--t3)',
                            borderBottom: tab === t ? '2px solid var(--cyan)' : '2px solid transparent',
                            marginBottom: -1, transition: 'all .2s', fontFamily: 'var(--font-ui)',
                        }}>{t}</button>
                    ))}
                </div>

                {/* ── Tab Content ───────────────────────── */}
                <AnimatePresence mode="wait">
                    <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>

                        {/* OVERVIEW */}
                        {tab === 'Overview' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(240px,1fr)', gap: 18 }}>

                                {/* Revenue Chart */}
                                <div className="card card-p">
                                    <div className="flex-between" style={{ marginBottom: 16 }}>
                                        <div>
                                            <div className="section-title">Revenue vs Expenses</div>
                                            <div className="section-subtitle">Last 6 months · ₹ Lakhs</div>
                                        </div>
                                        <span className="badge badge-green"><span className="dot-live" /> Live</span>
                                    </div>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={revenueData} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                            <XAxis dataKey="month" tick={{ fill: 'var(--t3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fill: 'var(--t3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <Tooltip content={<ChartTooltip />} />
                                            <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="expenses" name="Expenses" fill="#f97316" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
                                        {[['#10b981', 'Revenue'], ['#f97316', 'Expenses']].map(([c, l]) => (
                                            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                <div style={{ width: 10, height: 3, borderRadius: 2, background: c }} />
                                                <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600 }}>{l}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Info cards */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {[
                                        { label: 'Business Type', value: user.businessType, icon: Briefcase, color: '#6366f1' },
                                        { label: 'State', value: user.state, icon: MapPin, color: '#f97316' },
                                        { label: 'MSME Category', value: 'Small Enterprise', icon: Award, color: '#10b981' },
                                        { label: 'Est. Since', value: '2019', icon: Clock, color: '#f59e0b' },
                                        { label: 'Industry', value: 'Textiles & Mfg', icon: Activity, color: '#0ea5e9' },
                                    ].map(({ label, value, icon: Icon, color }) => (
                                        <div key={label} style={{
                                            display: 'flex', alignItems: 'center', gap: 12,
                                            padding: '11px 14px', borderRadius: 12,
                                            background: 'rgba(255,255,255,0.025)', border: '1px solid var(--b1)',
                                        }}>
                                            <div style={{ width: 32, height: 32, borderRadius: 9, background: `${color}18`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Icon size={14} style={{ color }} />
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ fontSize: 9.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
                                                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t1)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TEAM */}
                        {tab === 'Team' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div className="flex-between" style={{ marginBottom: 4 }}>
                                    <span style={{ fontSize: 12, color: 'var(--t3)' }}>{TEAM.length} members across all departments</span>
                                    <motion.button whileHover={{ scale: 1.04 }} className="btn btn-primary" style={{ padding: '7px 14px', fontSize: 11 }}>
                                        <Plus size={12} /> Add Member
                                    </motion.button>
                                </div>
                                {TEAM.map((m, i) => (
                                    <motion.div key={m.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                                        whileHover={{ x: 4 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--b1)', cursor: 'pointer' }}>
                                        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#f97316,#7b2fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{m.avatar}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{m.name}</div>
                                            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 1 }}>{m.role} · Since {m.since}</div>
                                        </div>
                                        <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: 'rgba(99,102,241,.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,.2)', flexShrink: 0 }}>{m.dept}</span>
                                        <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 8px', borderRadius: 100, flexShrink: 0, background: m.status === 'active' ? 'rgba(16,185,129,.12)' : 'rgba(245,158,11,.12)', color: m.status === 'active' ? '#10b981' : '#f59e0b', border: `1px solid ${m.status === 'active' ? 'rgba(16,185,129,.25)' : 'rgba(245,158,11,.25)'}` }}>
                                            {m.status === 'active' ? '● Active' : '◌ On Leave'}
                                        </span>
                                        <ChevronRight size={13} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* DOCUMENTS */}
                        {tab === 'Documents' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
                                {DOCS.map((doc, i) => (
                                    <motion.div key={doc.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                        whileHover={{ y: -3 }} className="card card-p" style={{ cursor: 'pointer' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                            <span style={{ fontSize: 24 }}>{doc.icon}</span>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
                                                <div style={{ fontSize: 10.5, color: 'var(--t3)', marginTop: 2 }}>Expires: {doc.expiry}</div>
                                            </div>
                                        </div>
                                        <div className="flex-between">
                                            <span className={`badge ${doc.status === 'valid' ? 'badge-green' : doc.status === 'expiring' ? 'badge-warning' : 'badge-saffron'}`}>
                                                {doc.status === 'valid' ? '✓ Valid' : doc.status === 'expiring' ? '⚠ Expiring' : '↻ Renewal Due'}
                                            </span>
                                            <button style={{ background: 'none', border: 'none', color: 'var(--cyan)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-display)', letterSpacing: 0.5 }}>View →</button>
                                        </div>
                                    </motion.div>
                                ))}
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} whileHover={{ y: -3 }}
                                    style={{ padding: '18px', borderRadius: 14, border: '1px dashed var(--b2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', minHeight: 100, background: 'rgba(0,212,255,.02)' }}>
                                    <Plus size={20} style={{ color: 'var(--t3)' }} />
                                    <span style={{ fontSize: 11.5, color: 'var(--t3)', fontWeight: 600 }}>Upload Document</span>
                                </motion.div>
                            </div>
                        )}

                        {/* OPERATIONS */}
                        {tab === 'Operations' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                                {[
                                    { title: 'Production Status', items: [{ label: 'Orders Pending', val: '38', color: '#f59e0b' }, { label: 'In Progress', val: '72', color: '#6366f1' }, { label: 'Ready to Ship', val: '28', color: '#10b981' }], icon: Package },
                                    { title: 'Financial Health', items: [{ label: 'Receivables', val: '₹18.4L', color: '#f97316' }, { label: 'Payables', val: '₹9.2L', color: '#ef4444' }, { label: 'Cash Balance', val: '₹42.8L', color: '#10b981' }], icon: IndianRupee },
                                    { title: 'Compliance', items: [{ label: 'GST Returns', val: 'Up to Date', color: '#10b981' }, { label: 'TDS Deducted', val: 'Current', color: '#10b981' }, { label: 'PF / ESI', val: 'Paid', color: '#10b981' }], icon: Shield },
                                    { title: 'Digital Presence', items: [{ label: 'Website/Month', val: '4.2K', color: '#6366f1' }, { label: 'WA Leads', val: '186', color: '#10b981' }, { label: 'B2B Inquiries', val: '34', color: '#f59e0b' }], icon: Globe },
                                ].map(({ title, items, icon: Icon }) => (
                                    <div key={title} className="card card-p">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                                            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(0,212,255,.08)', border: '1px solid var(--b1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Icon size={15} style={{ color: 'var(--cyan)' }} />
                                            </div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{title}</div>
                                        </div>
                                        {items.map(it => (
                                            <div key={it.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--b0)' }}>
                                                <span style={{ fontSize: 11.5, color: 'var(--t3)' }}>{it.label}</span>
                                                <span style={{ fontSize: 13, fontWeight: 700, color: it.color, fontFamily: 'var(--font-display)' }}>{it.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
