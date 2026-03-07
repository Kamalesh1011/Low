import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Sparkles, ExternalLink, Settings, Search, Plus,
    Activity, CheckCircle, Clock, TrendingUp, Grid3X3,
    AlignJustify, Zap, Eye, ArrowUpRight
} from 'lucide-react';
import Header from '../components/Header';
import useStore from '../store/useStore';

const APPS = [
    {
        id: 'app_001', name: 'MUDRA Loan Tracker', type: 'Finance', emoji: '💰',
        status: 'running', desc: 'Tracks loan applications & EMI schedules. Auto-syncs with bank APIs.',
        color: '#10b981', built: 'Nexus Coder', users: 1, uptime: '99.8%', requests: '2.4K',
        tags: ['Loans', 'Finance'], lastDeploy: '2 days ago',
    },
    {
        id: 'app_002', name: 'GST Filing Assistant', type: 'Compliance', emoji: '🏛️',
        status: 'running', desc: 'AI-powered GST return filing. Handles GSTR-1, GSTR-3B and reconciliation.',
        color: '#6366f1', built: 'Nexus Coder', users: 1, uptime: '100%', requests: '890',
        tags: ['GST', 'Tax'], lastDeploy: '1 week ago',
    },
    {
        id: 'app_003', name: 'Inventory Manager Pro', type: 'Operations', emoji: '📦',
        status: 'paused', desc: 'Smart inventory with barcode scanning, low-stock alerts, and reorder automation.',
        color: '#f59e0b', built: 'AgentBuilder', users: 3, uptime: '—', requests: '—',
        tags: ['Inventory', 'Ops'], lastDeploy: '3 weeks ago',
    },
    {
        id: 'app_004', name: 'WhatsApp Sales Bot', type: 'CRM', emoji: '💬',
        status: 'running', desc: 'AI chatbot for WhatsApp that handles product queries, orders and support.',
        color: '#f97316', built: 'AgentBuilder', users: 12, uptime: '98.2%', requests: '8.7K',
        tags: ['WhatsApp', 'CRM'], lastDeploy: '4 days ago',
    },
    {
        id: 'app_005', name: 'Export Documentation AI', type: 'Export', emoji: '🌍',
        status: 'draft', desc: 'Automates FSSAI, APEDA, RCMC documentation for food export orders.',
        color: '#8b5cf6', built: 'Nexus Coder', users: 0, uptime: '—', requests: '—',
        tags: ['Export', 'Docs'], lastDeploy: 'Never',
    },
    {
        id: 'app_006', name: 'HR & Payroll System', type: 'HR', emoji: '👥',
        status: 'running', desc: 'Full payroll processing with PF/ESI calculations and salary slips.',
        color: '#ec4899', built: 'Nexus Coder', users: 2, uptime: '99.1%', requests: '320',
        tags: ['HR', 'Payroll'], lastDeploy: '5 days ago',
    },
];

// STATS generated dynamically now

const STATUS = {
    running: { bg: 'rgba(16,185,129,.12)', color: '#10b981', border: 'rgba(16,185,129,.25)', label: '● Running' },
    paused: { bg: 'rgba(245,158,11,.12)', color: '#f59e0b', border: 'rgba(245,158,11,.25)', label: '◌ Paused' },
    draft: { bg: 'rgba(99,102,241,.1)', color: '#818cf8', border: 'rgba(99,102,241,.25)', label: '✎ Draft' },
};

export default function MyApps() {
    const { builtProjects } = useStore();
    const [search, setSearch] = useState('');
    const [view, setView] = useState('grid');
    const [filter, setFilter] = useState('all');

    const aiApps = builtProjects.map(p => ({
        id: p.id,
        name: p.prompt ? p.prompt.substring(0, 30) + (p.prompt.length > 30 ? '...' : '') : 'AI Generated App',
        type: p.mode ? p.mode.charAt(0).toUpperCase() + p.mode.slice(1) : 'App',
        emoji: '🤖',
        status: 'running',
        desc: p.prompt || 'Generated using Nexus Coder',
        color: '#06b6d4',
        built: 'Nexus Coder',
        users: 1,
        uptime: '100%',
        requests: '0',
        tags: ['AI Generated'],
        lastDeploy: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    }));

    const combinedApps = [...aiApps, ...APPS];

    const filtered = combinedApps.filter(a =>
        (filter === 'all' || a.status === filter) &&
        a.name.toLowerCase().includes(search.toLowerCase())
    );

    const stats = [
        { label: 'Total Apps', value: String(combinedApps.length), icon: Package, color: '#f97316' },
        { label: 'Running', value: String(combinedApps.filter(a => a.status === 'running').length), icon: Activity, color: '#10b981' },
        { label: 'API Calls', value: '12.3K', icon: Zap, color: '#6366f1' },
        { label: 'Avg Uptime', value: '99.3%', icon: TrendingUp, color: '#f59e0b' },
    ];

    return (
        <div style={{ flex: 1, overflowY: 'auto' }}>
            <Header title="My Apps" subtitle="Deployed applications and AI-built tools" />

            <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* ── Stats ───────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                    {stats.map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                            className="stat-card" style={{ padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${s.color},transparent)` }} />
                            <div className="flex-between">
                                <div>
                                    <div className="stat-value" style={{ color: s.color, fontSize: 22 }}>{s.value}</div>
                                    <div className="stat-label">{s.label}</div>
                                </div>
                                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${s.color}18`, border: `1px solid ${s.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <s.icon size={15} style={{ color: s.color }} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Toolbar ─────────────────────── */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                    <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
                        <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', pointerEvents: 'none' }} />
                        <input className="input" style={{ paddingLeft: 34, height: 36 }}
                            placeholder="Search apps…" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>

                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {['all', 'running', 'paused', 'draft'].map(f => (
                            <button key={f} onClick={() => setFilter(f)} style={{
                                padding: '7px 13px', borderRadius: 8,
                                border: `1px solid ${filter === f ? 'var(--cyan)' : 'var(--b1)'}`,
                                background: filter === f ? 'rgba(0,212,255,.08)' : 'rgba(0,212,255,.02)',
                                color: filter === f ? 'var(--cyan)' : 'var(--t3)',
                                fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)', textTransform: 'capitalize',
                            }}>{f}</button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 2, background: 'rgba(0,212,255,.04)', borderRadius: 8, border: '1px solid var(--b1)', padding: 3 }}>
                        {[{ v: 'grid', Icon: Grid3X3 }, { v: 'list', Icon: AlignJustify }].map(({ v, Icon }) => (
                            <button key={v} onClick={() => setView(v)}
                                style={{ width: 30, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', background: view === v ? 'rgba(0,212,255,.12)' : 'transparent', color: view === v ? 'var(--cyan)' : 'var(--t3)' }}>
                                <Icon size={13} />
                            </button>
                        ))}
                    </div>

                    <motion.a href="/vibe" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 11.5, textDecoration: 'none', flexShrink: 0 }}>
                        <Sparkles size={13} /> Build New App
                    </motion.a>
                </div>

                {/* ── Grid View ───────────────────── */}
                {view === 'grid' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                        {filtered.map((app, i) => {
                            const s = STATUS[app.status];
                            return (
                                <motion.div key={app.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                                    whileHover={{ y: -4 }} className="card" style={{ padding: 20, position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${app.color},transparent)` }} />

                                    <div className="flex-between" style={{ marginBottom: 14 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                                            <div style={{ width: 44, height: 44, borderRadius: 13, background: `${app.color}18`, border: `1px solid ${app.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{app.emoji}</div>
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.name}</div>
                                                <div style={{ fontSize: 10.5, color: 'var(--t3)', marginTop: 2 }}>{app.type} · {app.built}</div>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 9px', borderRadius: 100, background: s.bg, color: s.color, border: `1px solid ${s.border}`, flexShrink: 0, marginLeft: 8, whiteSpace: 'nowrap' }}>{s.label}</span>
                                    </div>

                                    <p style={{ fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.6, marginBottom: 12 }}>{app.desc}</p>

                                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                                        {app.tags.map(t => <span key={t} style={{ fontSize: 9.5, padding: '2px 8px', borderRadius: 100, background: 'rgba(0,212,255,.06)', color: 'var(--cyan)', border: '1px solid var(--b1)' }}>{t}</span>)}
                                    </div>

                                    <div style={{ borderTop: '1px solid var(--b0)', paddingTop: 12 }} className="flex-between">
                                        <div style={{ display: 'flex', gap: 16 }}>
                                            <span style={{ fontSize: 10.5, color: 'var(--t3)' }}><span style={{ color: 'var(--t1)', fontWeight: 700 }}>{app.requests}</span> reqs</span>
                                            <span style={{ fontSize: 10.5, color: 'var(--t3)' }}><span style={{ color: '#10b981', fontWeight: 700 }}>{app.uptime}</span> uptime</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 5 }}>
                                            {[Eye, Settings, ExternalLink].map((Icon, idx) => (
                                                <button key={idx} style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(0,212,255,.06)', border: '1px solid var(--b1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--t2)' }}>
                                                    <Icon size={12} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* ── List View ───────────────────── */}
                {view === 'list' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {filtered.map((app, i) => {
                            const s = STATUS[app.status];
                            return (
                                <motion.div key={app.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                    whileHover={{ x: 4 }}
                                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', borderRadius: 14, background: 'rgba(255,255,255,.025)', border: '1px solid var(--b1)', cursor: 'pointer' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 11, background: `${app.color}18`, border: `1px solid ${app.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{app.emoji}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.name}</div>
                                        <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 1 }}>{app.type} · Deployed: {app.lastDeploy}</div>
                                    </div>
                                    <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 9px', borderRadius: 100, background: s.bg, color: s.color, border: `1px solid ${s.border}`, flexShrink: 0 }}>{s.label}</span>
                                    <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 80 }}>
                                        <div style={{ fontSize: 11.5, color: 'var(--t1)', fontWeight: 600 }}>{app.requests} reqs</div>
                                        <div style={{ fontSize: 10.5, color: '#10b981' }}>{app.uptime} uptime</div>
                                    </div>
                                    <ArrowUpRight size={14} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* ── Empty state ─────────────────── */}
                {filtered.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon"><Package size={36} /></div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t2)' }}>No apps found</div>
                        <div style={{ fontSize: 12, color: 'var(--t3)' }}>Try a different filter or build a new app with Nexus Coder</div>
                        <motion.a href="/vibe" whileHover={{ scale: 1.04 }} className="btn btn-primary" style={{ marginTop: 8, textDecoration: 'none' }}>
                            <Sparkles size={13} /> Build with AI
                        </motion.a>
                    </div>
                )}
            </div>
        </div>
    );
}
