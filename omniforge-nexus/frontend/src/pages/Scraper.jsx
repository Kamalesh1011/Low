import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle, Globe, Database, Clock, AlertCircle, Zap, ExternalLink } from 'lucide-react';
import Header from '../components/Header';
import useStore from '../store/useStore';

const SOURCES = [
    { url: 'msme.gov.in', name: 'MSME Ministry', icon: '🏛️', color: '#f97316' },
    { url: 'sidbi.in', name: 'SIDBI', icon: '🏦', color: '#6366f1' },
    { url: 'mudra.org.in', name: 'MUDRA', icon: '💰', color: '#10b981' },
    { url: 'standupmitra.in', name: 'Stand-Up India', icon: '🌟', color: '#f59e0b' },
    { url: 'udyamregistration.gov.in', name: 'Udyam Portal', icon: '📋', color: '#ec4899' },
    { url: 'cgtmse.in', name: 'CGTMSE', icon: '🛡️', color: '#06b6d4' },
    { url: 'nsic.co.in', name: 'NSIC', icon: '🏭', color: '#8b5cf6' },
    { url: 'kvic.gov.in', name: 'KVIC', icon: '🪡', color: '#f97316' },
];

const RECENT_SCHEMES = [
    { name: 'PM Vishwakarma Yojana', source: 'msme.gov.in', date: '2026-02-26', isNew: true, amount: '₹15,000 - ₹2 Lakh', category: 'Artisans' },
    { name: 'MUDRA Tarun Plus', source: 'mudra.org.in', date: '2026-02-25', isNew: true, amount: '₹20 Lakh', category: 'Loan' },
    { name: 'Digital MSME Scheme Update', source: 'msme.gov.in', date: '2026-02-24', isNew: false, amount: '50% Subsidy', category: 'Technology' },
    { name: 'CGTMSE Limit Enhancement', source: 'cgtmse.in', date: '2026-02-23', isNew: false, amount: '₹5 Crore', category: 'Guarantee' },
    { name: 'ZED Certification Scheme', source: 'msme.gov.in', date: '2026-02-22', isNew: false, amount: '50-80% Subsidy', category: 'Quality' },
];

export default function Scraper() {
    const { scraperStatus, scraperResults, runScraper, lastScraped, schemes } = useStore();

    return (
        <div style={{ flex: 1, overflowY: 'auto' }}>
            <Header
                title="Live Data Scraper"
                subtitle="Automatically pull the latest MSME data from government portals"
            />

            <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Status Banner */}
                <div className="scraper-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                <Database size={16} style={{ color: '#818cf8' }} />
                                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>MSME Data Intelligence Engine</span>
                                {scraperStatus === 'done' && <span className="badge badge-green">✓ Updated</span>}
                                {scraperStatus === 'scraping' && <span className="badge badge-indigo">⟳ Scraping...</span>}
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                Sources monitored: <strong style={{ color: 'var(--text-primary)' }}>{SOURCES.length}</strong> government portals ·
                                Last updated: <strong style={{ color: 'var(--text-primary)' }}>{lastScraped}</strong>
                            </p>
                        </div>
                        <motion.button
                            onClick={runScraper}
                            disabled={scraperStatus === 'scraping'}
                            className="btn btn-primary"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            style={{ opacity: scraperStatus === 'scraping' ? 0.7 : 1 }}
                        >
                            {scraperStatus === 'scraping' ? '🔄 Updating...' : 'Update Now'}
                        </motion.button>
                    </div>

                    {scraperStatus === 'scraping' && (
                        <div style={{ marginTop: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Scanning portals...</span>
                                <span style={{ fontSize: 11, color: '#818cf8' }}>Processing...</span>
                            </div>
                            <div className="progress-track">
                                <motion.div
                                    className="progress-fill"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '80%' }}
                                    transition={{ duration: 3, ease: 'easeInOut' }}
                                    style={{ background: 'linear-gradient(90deg, #6366f1, #818cf8)' }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats after scrape */}
                {scraperStatus === 'done' && scraperResults.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>✅ Scrape Complete — Results</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                            {scraperResults.map(r => (
                                <div key={r.source} className="card card-p-sm">
                                    <div style={{ fontSize: 11, color: '#34d399', marginBottom: 4 }}>✓ {r.source}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>
                                        <span style={{ color: '#fb923c', fontWeight: 700 }}>{r.schemes}</span> schemes, <span style={{ color: '#818cf8', fontWeight: 700 }}>{r.loans}</span> loans
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Sources Grid */}
                <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
                        📡 Monitored Sources
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                        {SOURCES.map((source, i) => (
                            <motion.div
                                key={source.url}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.04 }}
                                className="card card-p-sm"
                                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                            >
                                <span style={{ fontSize: 20 }}>{source.icon}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{source.name}</div>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{source.url}</div>
                                </div>
                                <span className="dot-online" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Main Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
                    {/* Recent Scraped Data */}
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
                            🆕 Recently Scraped Schemes
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {RECENT_SCHEMES.map((scheme, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.07 }}
                                    className="card card-p-sm"
                                    style={{ display: 'flex', alignItems: 'center', gap: 14 }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{scheme.name}</span>
                                            {scheme.isNew && <span className="badge badge-saffron" style={{ fontSize: 9 }}>NEW</span>}
                                        </div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                            Source: {scheme.source} · {scheme.date}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: '#fb923c' }}>{scheme.amount}</div>
                                        <span className="badge badge-muted" style={{ fontSize: 10 }}>{scheme.category}</span>
                                    </div>
                                    <a href={`https://${scheme.source}`} target="_blank" rel="noreferrer">
                                        <ExternalLink size={13} style={{ color: 'var(--text-muted)' }} />
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Scraper Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="card card-p-sm">
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>📊 Database Summary</div>
                            {[
                                { l: 'Total Schemes', v: schemes.length, color: '#f97316' },
                                { l: 'Loan Schemes', v: schemes.filter(s => s.category === 'Loan').length, color: '#6366f1' },
                                { l: 'Subsidies', v: schemes.filter(s => s.category === 'Subsidy').length, color: '#10b981' },
                                { l: 'Active Sources', v: SOURCES.length, color: '#f59e0b' },
                            ].map(item => (
                                <div key={item.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.l}</span>
                                    <span style={{ fontSize: 14, fontWeight: 800, color: item.color, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{item.v}</span>
                                </div>
                            ))}
                        </div>

                        <div className="card card-p-sm">
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
                                <Zap size={13} style={{ color: '#f97316', display: 'inline', marginRight: 5 }} />
                                Auto-Refresh Schedule
                            </div>
                            {[
                                { freq: 'Every 6 hours', type: 'Full scan', status: 'active' },
                                { freq: 'Real-time', type: 'Alerts only', status: 'active' },
                                { freq: 'Daily 6 AM', type: 'Deep scrape', status: 'active' },
                            ].map(item => (
                                <div key={item.type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <div>
                                        <div style={{ fontSize: 11.5, color: 'var(--text-primary)', fontWeight: 500 }}>{item.type}</div>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.freq}</div>
                                    </div>
                                    <span className="dot-online" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
