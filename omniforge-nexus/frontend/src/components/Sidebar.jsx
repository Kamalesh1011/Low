import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, FileText, Users, Landmark, Mic2,
    Settings, ChevronLeft, ChevronRight, Globe, TrendingUp,
    BookOpen, ShieldCheck, LogOut, Cpu,
    Search, RefreshCw, Sparkles, Bot, Package,
    Activity, Zap
} from 'lucide-react';
import useStore from '../store/useStore';

const NAV = [
    {
        group: 'OVERVIEW', items: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/', key: 'home' },
            { icon: TrendingUp, label: 'My Business', path: '/business', key: 'business' },
        ]
    },
    {
        group: 'AI BUILDER', items: [
            { icon: Sparkles, label: 'Nexus Coder', path: '/vibe', key: 'vibe', badge: 'AI', color: 'var(--fire)' },
            { icon: Bot, label: 'Agent Studio', path: '/agents', key: 'agents', color: 'var(--plasma)' },
            { icon: Package, label: 'My Apps', path: '/apps', key: 'apps' },
        ]
    },
    {
        group: 'GOVERNMENT', items: [
            { icon: Landmark, label: 'Gov Schemes', path: '/schemes', key: 'schemes', badge: '47' },
            { icon: FileText, label: 'Loans & Finance', path: '/loans', key: 'loans' },
            { icon: Search, label: 'Scheme Finder', path: '/finder', key: 'finder' },
            { icon: RefreshCw, label: 'Live Data', path: '/scraper', key: 'scraper' },
        ]
    },
    {
        group: 'COMMUNITY', items: [
            { icon: Users, label: 'Global Network', path: '/community', key: 'community' },
            { icon: BookOpen, label: 'Knowledge Base', path: '/knowledge', key: 'knowledge' },
            { icon: Globe, label: 'Expert Connect', path: '/experts', key: 'experts' },
        ]
    },
    {
        group: 'SYSTEM', items: [
            { icon: Mic2, label: 'Voice AI', path: '/voice', key: 'voice' },
            { icon: ShieldCheck, label: 'Compliance', path: '/compliance', key: 'compliance' },
            { icon: Settings, label: 'Settings', path: '/settings', key: 'settings' },
        ]
    },
];

export default function Sidebar() {
    const { sidebarCollapsed, setSidebarCollapsed, user, notifications } = useStore();
    const location = useLocation();
    const unread = notifications.filter(n => !n.read).length;

    return (
        <motion.aside
            animate={{ width: sidebarCollapsed ? 62 : 252 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            className="sidebar"
        >
            {/* Brand */}
            <div className="sidebar-logo">
                <div className="brand-mark" style={{ minWidth: 36 }}>
                    <span style={{ fontSize: 17 }}>🇮🇳</span>
                </div>
                <AnimatePresence>
                    {!sidebarCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: 'hidden', flex: 1 }}
                        >
                            <div className="brand-name">OmniForge</div>
                            <div className="brand-sub">Nexus · MSME OS</div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.button
                    whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    style={{
                        background: 'rgba(0,212,255,0.06)',
                        border: '1px solid var(--b1)',
                        borderRadius: 7, padding: 5, cursor: 'pointer',
                        color: 'var(--t3)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, transition: 'all 0.2s',
                    }}
                >
                    {sidebarCollapsed
                        ? <ChevronRight size={12} color="var(--cyan)" />
                        : <ChevronLeft size={12} color="var(--cyan)" />}
                </motion.button>
            </div>

            {/* AI Status */}
            <AnimatePresence>
                {!sidebarCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ padding: '8px 10px 0' }}
                    >
                        <div style={{
                            padding: '8px 11px',
                            borderRadius: 9,
                            background: 'linear-gradient(135deg, rgba(0,212,255,0.07), rgba(123,47,255,0.05))',
                            border: '1px solid var(--b1)',
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                            >
                                <Cpu size={11} style={{ color: 'var(--cyan)' }} />
                            </motion.div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, fontWeight: 700, color: 'var(--cyan)', letterSpacing: 1.5, textTransform: 'uppercase' }}>AI Engine Online</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'var(--t3)', marginTop: 1 }}>GPT-4o · Gemini Ultra</div>
                            </div>
                            <span className="dot-live" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nav */}
            <nav className="sidebar-nav">
                {NAV.map((group) => (
                    <div key={group.group}>
                        {!sidebarCollapsed
                            ? <div className="nav-group-label">{group.group}</div>
                            : <div style={{ height: 12 }} />}

                        {group.items.map((item) => {
                            const isActive = location.pathname === item.path
                                || (item.path !== '/' && location.pathname.startsWith(item.path));
                            return (
                                <Link
                                    key={item.key}
                                    to={item.path}
                                    data-tip={sidebarCollapsed ? item.label : undefined}
                                    className={`nav-item ${isActive ? 'active' : ''}`}
                                    style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
                                >
                                    <item.icon size={15} style={{ flexShrink: 0, color: isActive ? (item.color || 'var(--cyan)') : undefined }} />
                                    <AnimatePresence>
                                        {!sidebarCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                style={{ flex: 1, fontSize: 12.5, fontWeight: 500 }}
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    <AnimatePresence>
                                        {!sidebarCollapsed && item.badge && (
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0.7 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.7 }}
                                                className={`nav-badge ${item.badge === 'AI' ? 'nb-ai' : 'nb-count'}`}
                                            >
                                                {item.badge}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    <AnimatePresence>
                                        {!sidebarCollapsed && item.key === 'community' && unread > 0 && (
                                            <motion.span initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} className="nav-badge nb-fire">
                                                {unread}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <AnimatePresence>
                    {!sidebarCollapsed && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 8 }}>
                                {[
                                    { label: 'Apps Built', value: '3', color: 'var(--fire)' },
                                    { label: 'Agents', value: '2', color: 'var(--plasma)' },
                                ].map(s => (
                                    <div key={s.label} style={{
                                        padding: '7px 10px', borderRadius: 8,
                                        background: 'rgba(0,212,255,0.04)', border: '1px solid var(--b0)', textAlign: 'center',
                                    }}>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: s.color }}>{s.value}</div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--t3)', marginTop: 1 }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="user-card">
                    <div className="user-avatar">{user.name.charAt(0)}</div>
                    <AnimatePresence>
                        {!sidebarCollapsed && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, minWidth: 0 }}>
                                <div className="user-name truncate">{user.name}</div>
                                <div className="user-role">{user.businessType} · {user.state}</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {!sidebarCollapsed && <LogOut size={12} style={{ color: 'var(--t3)', flexShrink: 0, cursor: 'pointer' }} />}
                </div>
            </div>
        </motion.aside>
    );
}
