import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, X, CheckCircle2, AlertTriangle, Info, Globe, Mic } from 'lucide-react';
import useStore from '../store/useStore';

const LANGUAGES = [
    { code: 'en', label: 'EN', full: 'English' },
    { code: 'hi', label: 'हिं', full: 'हिंदी' },
    { code: 'mr', label: 'मर', full: 'मराठी' },
    { code: 'ta', label: 'த', full: 'தமிழ்' },
    { code: 'te', label: 'తె', full: 'తెలుగు' },
    { code: 'gu', label: 'ગુ', full: 'ગુજરાતી' },
    { code: 'bn', label: 'বাং', full: 'বাংলা' },
    { code: 'pa', label: 'ਪੰ', full: 'ਪੰਜਾਬੀ' },
    { code: 'ml', label: 'മ', full: 'മലയാളം' },
    { code: 'or', label: 'ଓ', full: 'ଓଡ଼ିଆ' },
    { code: 'as', label: 'অ', full: 'অসমীয়া' },
];

export default function Header({ title, subtitle, titleHindi }) {
    const { notifications, markAllRead, language, setLanguage } = useStore();
    const [showNotif, setShowNotif] = useState(false);
    const [showLang, setShowLang] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const notifRef = useRef(null);
    const langRef = useRef(null);
    const unread = notifications.filter(n => !n.read).length;

    useEffect(() => {
        function handleClickOutside(e) {
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
            if (langRef.current && !langRef.current.contains(e.target)) setShowLang(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const notifIcon = (type) => {
        if (type === 'success') return <CheckCircle2 size={13} style={{ color: '#10b981' }} />;
        if (type === 'warning') return <AlertTriangle size={13} style={{ color: '#f59e0b' }} />;
        return <Info size={13} style={{ color: '#6366f1' }} />;
    };

    const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

    return (
        <header className="page-header">
            {/* Title */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h1 className="header-title">{title}</h1>
                </div>
                {subtitle && <p className="header-subtitle">{subtitle}</p>}
            </div>

            {/* Actions */}
            <div className="header-actions">
                {/* Search */}
                <AnimatePresence>
                    {showSearch ? (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 260, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            style={{ position: 'relative', overflow: 'hidden' }}
                        >
                            <input
                                autoFocus
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search schemes..."
                                className="input"
                                style={{ paddingRight: 36, height: 38, fontSize: 12 }}
                            />
                            <button
                                onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                                style={{
                                    position: 'absolute', right: 10, top: '50%',
                                    transform: 'translateY(-50%)', background: 'none',
                                    border: 'none', cursor: 'pointer', color: 'var(--text-muted)'
                                }}
                            >
                                <X size={13} />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.button
                            className="btn-icon btn"
                            onClick={() => setShowSearch(true)}
                            whileHover={{ scale: 1.04 }}
                        >
                            <Search size={15} />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Language Selector */}
                <div style={{ position: 'relative' }} ref={langRef}>
                    <button
                        onClick={() => setShowLang(!showLang)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '7px 12px',
                            borderRadius: 10,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            fontSize: 12,
                            fontWeight: 600,
                            transition: 'all 0.18s',
                        }}
                        className="hover:bg-white/10"
                    >
                        <Globe size={13} />
                        {currentLang.label}
                    </button>
                    <AnimatePresence>
                        {showLang && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                transition={{ duration: 0.14 }}
                                style={{
                                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                                    background: '#0d1525',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 14,
                                    overflow: 'hidden',
                                    zIndex: 200,
                                    minWidth: 160,
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                }}
                            >
                                <div style={{ padding: '8px 12px 6px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Language
                                </div>
                                {LANGUAGES.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => { setLanguage(lang.code); setShowLang(false); }}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center',
                                            gap: 8, padding: '9px 14px',
                                            background: language === lang.code ? 'rgba(249,115,22,0.1)' : 'transparent',
                                            border: 'none', cursor: 'pointer',
                                            color: language === lang.code ? '#fb923c' : 'var(--text-secondary)',
                                            fontSize: 13, fontWeight: language === lang.code ? 600 : 400,
                                            transition: 'all 0.15s', textAlign: 'left',
                                        }}
                                    >
                                        <span style={{ fontSize: 14, width: 20 }}>{lang.label}</span>
                                        <span>{lang.full}</span>
                                        {language === lang.code && (
                                            <CheckCircle2 size={12} style={{ marginLeft: 'auto', color: '#fb923c' }} />
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Notifications */}
                <div style={{ position: 'relative' }} ref={notifRef}>
                    <button
                        onClick={() => setShowNotif(!showNotif)}
                        className="btn-icon btn"
                        style={{ position: 'relative' }}
                    >
                        <Bell size={15} />
                        {unread > 0 && <span className="notif-dot" />}
                    </button>

                    <AnimatePresence>
                        {showNotif && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.14 }}
                                style={{
                                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                                    width: 320, background: '#0d1525',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 16, overflow: 'hidden', zIndex: 200,
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                }}
                            >
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '14px 16px',
                                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                                }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                                        Notifications
                                    </span>
                                    <button onClick={markAllRead} style={{ fontSize: 11, color: '#fb923c', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                        Mark all read
                                    </button>
                                </div>
                                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                                    {notifications.map((n) => (
                                        <div key={n.id} style={{
                                            display: 'flex', alignItems: 'flex-start', gap: 10,
                                            padding: '12px 16px',
                                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                                            background: !n.read ? 'rgba(249,115,22,0.04)' : 'transparent',
                                        }}>
                                            <div style={{ marginTop: 2, flexShrink: 0 }}>{notifIcon(n.type)}</div>
                                            <div>
                                                <p style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.5 }}>{n.message}</p>
                                                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>{n.time}</p>
                                            </div>
                                            {!n.read && (
                                                <div style={{
                                                    width: 6, height: 6, borderRadius: '50%',
                                                    background: '#f97316', flexShrink: 0, marginTop: 4, marginLeft: 'auto'
                                                }} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
