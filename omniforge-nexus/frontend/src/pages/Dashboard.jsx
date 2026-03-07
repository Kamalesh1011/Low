import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp, Users, Landmark, ArrowUpRight, ArrowRight,
    CheckCircle, Clock, AlertCircle, Mic, RefreshCw,
    Building2, FileCheck, CreditCard, Globe, Zap,
    Sparkles, Bot, Activity, ChevronRight, Star,
    Shield, Target, BarChart3, Package
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Header from '../components/Header';
import useStore from '../store/useStore';

const areaData = [
    { month: 'Sep', loans: 12, schemes: 8, apps: 2 },
    { month: 'Oct', loans: 18, schemes: 14, apps: 5 },
    { month: 'Nov', loans: 24, schemes: 19, apps: 8 },
    { month: 'Dec', loans: 30, schemes: 25, apps: 12 },
    { month: 'Jan', loans: 28, schemes: 22, apps: 15 },
    { month: 'Feb', loans: 38, schemes: 31, apps: 21 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: '#0a1228', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12, padding: '10px 14px', fontSize: 11,
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>{label}</div>
            {payload.map(p => (
                <div key={p.name} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{p.value}</span>
                </div>
            ))}
        </div>
    );
};

const STATS = [
    { key: 'msme', value: '6.3Cr+', label: 'MSMEs in India', delta: '+4.2%', up: true, icon: Building2, color: '#f97316', glow: 'rgba(249,115,22,0.2)' },
    { key: 'schemes', value: '47', label: 'Active Gov Schemes', delta: '+3 New', up: true, icon: Landmark, color: '#6366f1', glow: 'rgba(99,102,241,0.2)' },
    { key: 'loans', value: '₹2.1L Cr', label: 'Loans Disbursed', delta: '+18.5%', up: true, icon: CreditCard, color: '#10b981', glow: 'rgba(16,185,129,0.2)' },
    { key: 'members', value: '1.2M', label: 'Platform Members', delta: '+12K', up: true, icon: Users, color: '#f59e0b', glow: 'rgba(245,158,11,0.2)' },
];

const QUICK_ACTIONS = [
    { icon: Sparkles, label: 'Build App with AI', sub: 'Nexus Coder', color: '#f97316', path: '/vibe', featured: true },
    { icon: Bot, label: 'Create AI Agent', sub: 'Automation', color: '#6366f1', path: '/agents' },
    { icon: Landmark, label: 'Find Schemes', sub: '47 Available', color: '#10b981', path: '/schemes' },
    { icon: CreditCard, label: 'Apply for Loan', sub: 'Quick Approval', color: '#f59e0b', path: '/loans' },
    { icon: FileCheck, label: 'GST Compliance', sub: 'Auto-filing', color: '#0ea5e9', path: '/compliance' },
    { icon: Globe, label: 'Export Hub', sub: 'Global Markets', color: '#8b5cf6', path: '/community' },
];

const AI_HIGHLIGHTS = [
    { emoji: '🤖', name: 'GST Filing Agent', status: 'Running', runs: 134, color: '#10b981' },
    { emoji: '💬', name: 'Customer Support Bot', status: 'Active', runs: 892, color: '#6366f1' },
    { emoji: '📊', name: 'Inventory Monitor', status: 'Idle', runs: 47, color: '#f59e0b' },
];

export default function Dashboard() {
    const { stats, schemes, communityPosts, loanApplications, user } = useStore();
    const [greeting, setGreeting] = useState('');
    const [activeStatIdx, setActiveStatIdx] = useState(0);

    useEffect(() => {
        const h = new Date().getHours();
        setGreeting(h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening');
        const timer = setInterval(() => setActiveStatIdx(i => (i + 1) % STATS.length), 3000);
        return () => clearInterval(timer);
    }, []);

    const topSchemes = schemes.slice(0, 3);
    const topPosts = communityPosts.slice(0, 2);

    return (
        <div style={{ flex: 1, overflowY: 'auto', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Header title="Mission Control" subtitle="Your MSME intelligence dashboard" />

            <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>

                {/* ── Hero Banner ──────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(99,102,241,0.09) 50%, rgba(16,185,129,0.06) 100%)',
                        border: '1px solid rgba(249,115,22,0.2)',
                        borderRadius: 20,
                        padding: '26px 28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 24,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* BG orb */}
                    <div style={{
                        position: 'absolute', top: -60, right: -60,
                        width: 220, height: 220, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(249,115,22,0.08), transparent)',
                        pointerEvents: 'none',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: -40, left: '40%',
                        width: 180, height: 180, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99,102,241,0.06), transparent)',
                        pointerEvents: 'none',
                    }} />

                    {/* Left: Greeting */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: 12, color: '#fb923c', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span>👋</span>
                            <span>{greeting}, {user?.name?.split(' ')[0] || 'User'}</span>
                            <span style={{ fontSize: 10, background: 'rgba(249,115,22,0.15)', padding: '2px 8px', borderRadius: 100, border: '1px solid rgba(249,115,22,0.25)' }}>
                                MSME Owner
                            </span>
                        </div>
                        <h1 style={{
                            fontSize: 26, fontWeight: 900,
                            fontFamily: 'var(--font-display)',
                            color: 'var(--text-primary)',
                            letterSpacing: -0.8,
                            lineHeight: 1.2,
                        }}>
                            Build. Automate.{' '}
                            <span className="text-grad-saffron">Scale.</span>
                        </h1>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.7, maxWidth: 600 }}>
                            {user?.businessName || 'My Business'} · Udyam: <strong style={{ color: 'var(--text-secondary)' }}>{user?.udyamNo || 'Pending'}</strong>
                            <br />
                            AI-powered platform for Indian MSMEs — build apps, find schemes, and grow faster.
                        </p>
                        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                            <motion.a
                                href="/vibe"
                                whileHover={{ scale: 1.03, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className="btn btn-primary"
                                style={{ fontSize: 12.5, padding: '9px 18px', textDecoration: 'none' }}
                            >
                                <Sparkles size={13} /> Build with AI
                            </motion.a>
                            <motion.a
                                href="/schemes"
                                whileHover={{ scale: 1.03, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className="btn btn-secondary"
                                style={{ fontSize: 12.5, padding: '9px 16px', textDecoration: 'none' }}
                            >
                                <Landmark size={13} /> Find Schemes
                            </motion.a>
                            <motion.a
                                href="/voice"
                                whileHover={{ scale: 1.03, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className="btn btn-secondary"
                                style={{ fontSize: 12.5, padding: '9px 16px', textDecoration: 'none' }}
                            >
                                <Mic size={13} /> Voice AI
                            </motion.a>
                        </div>
                    </div>

                    {/* Right: KPIs */}
                    <div style={{ display: 'flex', gap: 10, flexShrink: 0, position: 'relative', zIndex: 1 }}>
                        {[
                            { label: 'MSME Grade', value: 'Small', color: '#10b981', icon: Shield },
                            { label: 'AI Credits', value: '480', color: '#6366f1', icon: Zap },
                            { label: 'State', value: user?.state || 'India', color: '#f97316', icon: Target },
                        ].map(({ label, value, color, icon: Icon }) => (
                            <div key={label} style={{
                                textAlign: 'center', padding: '14px 16px',
                                background: 'rgba(255,255,255,0.04)',
                                borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)',
                                minWidth: 80,
                            }}>
                                <Icon size={14} style={{ color, margin: '0 auto 6px' }} />
                                <div style={{ fontSize: 16, fontWeight: 800, color, fontFamily: 'var(--font-display)' }}>{value}</div>
                                <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 3, fontWeight: 600 }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Stats Row ────────────────────────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                    {STATS.map((s, i) => (
                        <motion.div
                            key={s.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07, duration: 0.45 }}
                            className="stat-card"
                            style={{ position: 'relative', overflow: 'hidden' }}
                        >
                            {/* Accent top bar */}
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0,
                                height: 2,
                                background: `linear-gradient(90deg, ${s.color}, transparent)`,
                            }} />
                            {/* BG glow */}
                            <div style={{
                                position: 'absolute', top: -20, right: -20,
                                width: 80, height: 80, borderRadius: '50%',
                                background: `radial-gradient(circle, ${s.glow}, transparent)`,
                                pointerEvents: 'none',
                            }} />
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
                                <div>
                                    <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                                    <div className="stat-label">{s.label}</div>
                                    <div className={`stat-delta ${s.up ? 'delta-up' : 'delta-down'}`}>
                                        {s.up ? '▲' : '▼'} {s.delta} this month
                                    </div>
                                </div>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    background: `${s.glow}`,
                                    border: `1px solid ${s.color}30`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <s.icon size={16} style={{ color: s.color }} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Main Grid: Chart + Loans ─────────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18 }}>

                    {/* Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="card card-p"
                    >
                        <div className="flex-between" style={{ marginBottom: 18 }}>
                            <div>
                                <div className="section-title">Platform Growth</div>
                                <div className="section-subtitle">Loans · Schemes · AI Apps built</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span className="dot-live" />
                                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--emerald-400)' }}>Live</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={190}>
                            <AreaChart data={areaData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gLoan" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gScheme" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gApp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="loans" name="Loans" stroke="#f97316" fill="url(#gLoan)" strokeWidth={2} dot={false} />
                                <Area type="monotone" dataKey="schemes" name="Schemes" stroke="#6366f1" fill="url(#gScheme)" strokeWidth={2} dot={false} />
                                <Area type="monotone" dataKey="apps" name="AI Apps" stroke="#10b981" fill="url(#gApp)" strokeWidth={2} dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                        {/* Legend */}
                        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                            {[['#f97316', 'Loans'], ['#6366f1', 'Schemes'], ['#10b981', 'AI Apps']].map(([c, l]) => (
                                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <div style={{ width: 10, height: 3, borderRadius: 2, background: c }} />
                                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{l}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Loan Applications */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.42 }}
                        className="card card-p"
                    >
                        <div className="flex-between" style={{ marginBottom: 16 }}>
                            <div className="section-title">My Loan Applications</div>
                            <button className="btn btn-ghost" style={{ fontSize: 10.5, padding: '4px 8px' }}>
                                View All <ArrowRight size={10} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {loanApplications.map(loan => (
                                <motion.div
                                    key={loan.id}
                                    whileHover={{ x: 3 }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        padding: '11px 13px', borderRadius: 12,
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid var(--border-faint)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 10,
                                        background: 'rgba(255,255,255,0.05)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 18, flexShrink: 0,
                                    }}>
                                        {loan.icon}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }} className="truncate">{loan.bank}</div>
                                        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 1 }}>{loan.scheme} · {loan.amount}</div>
                                    </div>
                                    <span className={`badge ${loan.status === 'approved' ? 'badge-green' : loan.status === 'processing' ? 'badge-warning' : 'badge-red'}`}>
                                        {loan.status === 'approved' ? '✓ Approved' : loan.status === 'processing' ? '↻ Processing' : '✗ Rejected'}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                        <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 12, fontSize: 12 }}>
                            + Apply for New Loan
                        </button>
                    </motion.div>
                </div>

                {/* ── Quick Actions ────────────────────────────────────── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <div className="flex-between" style={{ marginBottom: 14 }}>
                        <div className="section-title">Quick Actions</div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Powered by AI</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
                        {QUICK_ACTIONS.map((action, i) => (
                            <motion.a
                                key={action.label}
                                href={action.path}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.06 }}
                                whileHover={{ y: -4, scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                    background: action.featured
                                        ? `linear-gradient(135deg, ${action.color}18, ${action.color}08)`
                                        : 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${action.featured ? action.color + '30' : 'var(--border-faint)'}`,
                                    borderRadius: 14,
                                    padding: '16px 12px',
                                    cursor: 'pointer', textAlign: 'center',
                                    textDecoration: 'none',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                                    transition: 'all 0.2s',
                                    boxShadow: action.featured ? `0 4px 20px ${action.color}20` : 'none',
                                }}
                            >
                                <div style={{
                                    width: 40, height: 40, borderRadius: 12,
                                    background: `${action.color}20`,
                                    border: `1px solid ${action.color}30`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <action.icon size={18} style={{ color: action.color }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{action.label}</div>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{action.sub}</div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* ── Bottom Grid: AI Agents + Schemes + Community ─────── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>

                    {/* My AI Agents */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card card-p">
                        <div className="flex-between" style={{ marginBottom: 14 }}>
                            <div>
                                <div className="section-title">My AI Agents</div>
                                <div className="section-subtitle">3 agents running</div>
                            </div>
                            <span className="badge badge-green"><span className="dot-live" /> Live</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {AI_HIGHLIGHTS.map(agent => (
                                <motion.div key={agent.name} whileHover={{ x: 3 }} style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '9px 11px', borderRadius: 10,
                                    background: 'rgba(255,255,255,0.025)',
                                    border: '1px solid var(--border-faint)', cursor: 'pointer',
                                }}>
                                    <span style={{ fontSize: 18 }}>{agent.emoji}</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }} className="truncate">{agent.name}</div>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{agent.runs} runs today</div>
                                    </div>
                                    <span style={{
                                        fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 100,
                                        background: `${agent.color}18`, color: agent.color, border: `1px solid ${agent.color}30`,
                                    }}>{agent.status}</span>
                                </motion.div>
                            ))}
                        </div>
                        <a href="/agents" style={{ textDecoration: 'none' }}>
                            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 10, fontSize: 11 }}>
                                Manage Agents <ChevronRight size={11} />
                            </button>
                        </a>
                    </motion.div>

                    {/* Featured Schemes */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="card card-p">
                        <div className="flex-between" style={{ marginBottom: 14 }}>
                            <div className="section-title">Matched Schemes</div>
                            <span className="badge badge-saffron">🎯 For You</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                            {schemes.slice(0, 3).map(scheme => (
                                <motion.div key={scheme.id} whileHover={{ x: 3 }} style={{
                                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                                    borderRadius: 10, background: 'rgba(255,255,255,0.025)',
                                    border: '1px solid var(--border-faint)', cursor: 'pointer',
                                }}>
                                    <span style={{ fontSize: 18 }}>{scheme.icon}</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }} className="truncate">{scheme.name}</div>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{scheme.maxAmount}</div>
                                    </div>
                                    <ArrowUpRight size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                </motion.div>
                            ))}
                        </div>
                        <a href="/schemes" style={{ textDecoration: 'none' }}>
                            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 10, fontSize: 11 }}>
                                All 47 Schemes <ChevronRight size={11} />
                            </button>
                        </a>
                    </motion.div>

                    {/* Community Highlights */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="card card-p">
                        <div className="flex-between" style={{ marginBottom: 14 }}>
                            <div className="section-title">Community</div>
                            <span className="badge badge-indigo">🌐 1.2M Members</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {communityPosts.slice(0, 2).map(post => (
                                <motion.div key={post.id} whileHover={{ y: -2 }} style={{
                                    padding: '12px', borderRadius: 11,
                                    background: 'rgba(255,255,255,0.025)',
                                    border: '1px solid var(--border-faint)', cursor: 'pointer',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: 8,
                                            background: 'rgba(255,255,255,0.07)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 14,
                                        }}>{post.avatar}</div>
                                        <div>
                                            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-primary)' }}>{post.author}</div>
                                            <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{post.business}</div>
                                        </div>
                                        <span className="badge badge-muted" style={{ marginLeft: 'auto', fontSize: 9 }}>{post.category}</span>
                                    </div>
                                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }} className="truncate">{post.title}</p>
                                    <div style={{ display: 'flex', gap: 12, marginTop: 7 }}>
                                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>❤️ {post.likes}</span>
                                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>💬 {post.replies}</span>
                                        <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }}>{post.time}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <a href="/community" style={{ textDecoration: 'none' }}>
                            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 10, fontSize: 11 }}>
                                Join Community <ChevronRight size={11} />
                            </button>
                        </a>
                    </motion.div>
                </div>

            </div>

            {/* ── Platform Health & Analytics (New) ────────────────── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="card card-p" style={{
                background: 'rgba(5, 12, 30, 0.4)',
                border: '1px solid var(--b1)',
                marginBottom: 20
            }}>
                <div className="flex-between" style={{ marginBottom: 16 }}>
                    <div>
                        <div className="section-title">Nexus Global Infrastructure</div>
                        <div className="section-subtitle">Real-time performance across 1.2M MSME nodes</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>SYSTEM STATUS</div>
                            <div style={{ fontSize: 13, color: '#00ff88', fontWeight: 700 }}>● ALL SYSTEMS OPERATIONAL</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
                    {[
                        { label: 'Cloud Requests', value: '12.4M', sub: 'Last 24h', color: 'var(--cyan)' },
                        { label: 'Active Builders', value: '842', sub: 'Coding now', color: 'var(--fire)' },
                        { label: 'Avg Latency', value: '12ms', sub: 'Edge Optimized', color: 'var(--plasma)' },
                        { label: 'Uptime', value: '99.98%', sub: 'High Availability', color: '#00ff88' },
                        { label: 'AI Builds', value: '1,420', sub: 'Today', color: '#ffd700' },
                    ].map(m => (
                        <div key={m.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-faint)', borderRadius: 14, padding: '14px 16px' }}>
                            <div style={{ fontSize: 18, fontWeight: 900, color: m.color, fontFamily: 'var(--font-display)' }}>{m.value}</div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{m.label}</div>
                            <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{m.sub}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
