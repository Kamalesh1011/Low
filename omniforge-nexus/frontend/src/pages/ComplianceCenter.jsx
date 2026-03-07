import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, AlertTriangle, CheckCircle, Clock, FileText,
    Download, ExternalLink, Zap, Shield, AlertCircle
} from 'lucide-react';
import Header from '../components/Header';

const ITEMS = [
    { id: 'c01', name: 'GSTR-1 (Feb 2026)', cat: 'GST', due: '11 Mar 2026', status: 'due-soon', priority: 'high', penalty: '₹200/day', desc: 'Monthly outward supply return' },
    { id: 'c02', name: 'GSTR-3B (Feb 2026)', cat: 'GST', due: '20 Mar 2026', status: 'pending', priority: 'high', penalty: '₹50/day', desc: 'Monthly summary return with tax payment' },
    { id: 'c03', name: 'TDS Payment (Feb)', cat: 'Income Tax', due: '07 Mar 2026', status: 'overdue', priority: 'critical', penalty: '1.5% per month', desc: 'Tax deducted at source payment' },
    { id: 'c04', name: 'PF Contribution (Feb)', cat: 'Labour', due: '15 Mar 2026', status: 'pending', priority: 'high', penalty: '12% p.a.', desc: 'Employee + Employer PF deposit' },
    { id: 'c05', name: 'ESI Contribution (Feb)', cat: 'Labour', due: '15 Mar 2026', status: 'pending', priority: 'medium', penalty: '12% p.a.', desc: 'Employee State Insurance' },
    { id: 'c06', name: 'Advance Tax (Q4)', cat: 'Income Tax', due: '15 Mar 2026', status: 'pending', priority: 'high', penalty: '1% per month', desc: '4th quarter advance tax payment' },
    { id: 'c07', name: 'Annual Return (ROC)', cat: 'Company Law', due: '30 Sep 2026', status: 'upcoming', priority: 'low', penalty: '₹100/day', desc: 'Annual compliance with MCA' },
    { id: 'c08', name: 'FSSAI License Renewal', cat: 'FSSAI', due: '15 Apr 2026', status: 'due-soon', priority: 'medium', penalty: 'Cancellation', desc: 'Food licence annual renewal' },
];

const STATUS_CFG = {
    overdue: { bg: 'rgba(239,68,68,.12)', color: '#ef4444', border: 'rgba(239,68,68,.25)', label: '⚠ Overdue', bar: '#ef4444' },
    'due-soon': { bg: 'rgba(245,158,11,.12)', color: '#f59e0b', border: 'rgba(245,158,11,.25)', label: '⏰ Due Soon', bar: '#f59e0b' },
    pending: { bg: 'rgba(99,102,241,.1)', color: '#818cf8', border: 'rgba(99,102,241,.2)', label: '◌ Pending', bar: '#818cf8' },
    upcoming: { bg: 'rgba(16,185,129,.1)', color: '#10b981', border: 'rgba(16,185,129,.2)', label: '✓ Upcoming', bar: '#10b981' },
    done: { bg: 'rgba(16,185,129,.12)', color: '#10b981', border: 'rgba(16,185,129,.25)', label: '✓ Filed', bar: '#10b981' },
};

const PRI_COLOR = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#10b981' };

const CERTS = [
    { name: 'ISO 9001:2015', issuer: 'Bureau Veritas', expiry: 'Mar 2026', status: 'renewal' },
    { name: 'Udyam Certificate', issuer: 'MSME Ministry', expiry: 'Lifetime', status: 'valid' },
    { name: 'GST Registration', issuer: 'GSTN', expiry: 'Ongoing', status: 'valid' },
    { name: 'Shop Act License', issuer: 'Municipal Corp.', expiry: 'Dec 2026', status: 'valid' },
    { name: 'IEC (Import/Export)', issuer: 'DGFT', expiry: 'Lifetime', status: 'valid' },
];

const PORTALS = [
    { name: 'GST Portal', url: 'https://www.gst.gov.in', color: '#6366f1' },
    { name: 'TRACES — TDS', url: 'https://www.tdscpc.gov.in', color: '#f97316' },
    { name: 'EPFO — PF Portal', url: 'https://www.epfindia.gov.in', color: '#10b981' },
    { name: 'ESIC Portal', url: 'https://www.esic.in', color: '#0ea5e9' },
    { name: 'MCA21 (ROC)', url: 'https://www.mca.gov.in', color: '#f59e0b' },
];

const SUMMARY = [
    { label: 'Total Filings', value: '28', color: '#6366f1', icon: FileText },
    { label: 'Filed on Time', value: '24', color: '#10b981', icon: CheckCircle },
    { label: 'Overdue', value: '1', color: '#ef4444', icon: AlertTriangle },
    { label: 'Due This Month', value: '6', color: '#f59e0b', icon: Clock },
];

const FILTERS = ['all', 'overdue', 'due-soon', 'pending', 'upcoming'];

export default function ComplianceCenter() {
    const [filter, setFilter] = useState('all');
    const [done, setDone] = useState(new Set());

    const toggleDone = id => setDone(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

    const items = ITEMS.filter(it => filter === 'all' || it.status === filter);

    return (
        <div style={{ flex: 1, overflowY: 'auto' }}>
            <Header title="Compliance Center" subtitle="GST, Labour, Tax & Regulatory filing tracker" />

            <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* ── Score Banner ─────────────────────── */}
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(16,185,129,.1) 0%, rgba(6,182,212,.07) 100%)',
                        border: '1px solid rgba(16,185,129,.22)', borderRadius: 18, padding: '20px 24px',
                        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                        position: 'relative', overflow: 'hidden',
                    }}>
                    <div style={{ position: 'absolute', right: -30, top: -30, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,.08), transparent)', pointerEvents: 'none' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        {/* Score ring */}
                        <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                            <svg width="80" height="80" viewBox="0 0 80 80">
                                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                <circle cx="40" cy="40" r="32" fill="none" stroke="#10b981" strokeWidth="8"
                                    strokeDasharray={`${2 * Math.PI * 32 * 0.86} ${2 * Math.PI * 32 * 0.14}`}
                                    strokeLinecap="round" strokeDashoffset={2 * Math.PI * 32 * 0.25} />
                            </svg>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: 20, fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-display)', lineHeight: 1 }}>86</span>
                                <span style={{ fontSize: 8, color: 'var(--t3)', letterSpacing: 1 }}>SCORE</span>
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', fontFamily: 'var(--font-display)' }}>Compliance Score: Good</div>
                            <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 4 }}>1 overdue item needs immediate attention · 6 filings due this month</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                                <span className="badge badge-green">✓ PF Compliant</span>
                                <span className="badge badge-green">✓ GST Active</span>
                                <span className="badge badge-saffron">⚠ TDS Overdue</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <motion.button whileHover={{ scale: 1.04 }} className="btn btn-secondary" style={{ fontSize: 11, padding: '8px 14px' }}>
                            <Download size={12} /> Report
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.04 }} className="btn btn-primary" style={{ fontSize: 11, padding: '8px 14px' }}>
                            <Zap size={12} /> AI Filing Assistant
                        </motion.button>
                    </div>
                </motion.div>

                {/* ── Stats ────────────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                    {SUMMARY.map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                            className="stat-card" style={{ padding: '14px 18px', position: 'relative', overflow: 'hidden' }}>
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

                {/* ── Main Grid ────────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(220px,1fr)', gap: 20 }}>

                    {/* Filing Tracker */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
                        <div className="flex-between" style={{ flexWrap: 'wrap', gap: 8 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Upcoming Filings</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                {FILTERS.map(f => (
                                    <button key={f} onClick={() => setFilter(f)} style={{
                                        padding: '4px 10px', borderRadius: 6,
                                        border: `1px solid ${filter === f ? 'var(--cyan)' : 'var(--b1)'}`,
                                        background: filter === f ? 'rgba(0,212,255,.08)' : 'none',
                                        color: filter === f ? 'var(--cyan)' : 'var(--t3)',
                                        fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)',
                                        textTransform: f === 'due-soon' ? 'none' : 'capitalize',
                                        whiteSpace: 'nowrap',
                                    }}>{f === 'due-soon' ? 'Due Soon' : f}</button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {items.map((item, i) => {
                                const effStatus = done.has(item.id) ? 'done' : item.status;
                                const s = STATUS_CFG[effStatus];
                                return (
                                    <motion.div key={item.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 12,
                                            padding: '12px 16px', borderRadius: 14,
                                            background: done.has(item.id) ? 'rgba(16,185,129,.04)' : 'rgba(255,255,255,.025)',
                                            border: `1px solid ${done.has(item.id) ? 'rgba(16,185,129,.18)' : 'var(--b1)'}`,
                                            opacity: done.has(item.id) ? 0.7 : 1, transition: 'all .18s',
                                        }}>
                                        {/* Priority bar */}
                                        <div style={{ width: 3, height: 38, borderRadius: 3, background: s.bar, flexShrink: 0 }} />

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t1)', textDecoration: done.has(item.id) ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                            <div style={{ fontSize: 10.5, color: 'var(--t3)', marginTop: 2 }}>{item.desc}</div>
                                            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                                                <span style={{ fontSize: 10, color: PRI_COLOR[item.priority], fontWeight: 700 }}>● {item.priority.toUpperCase()}</span>
                                                <span style={{ fontSize: 10, color: 'var(--t3)' }}>Penalty: {item.penalty}</span>
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 80 }}>
                                            <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 5 }}>Due: <strong style={{ color: effStatus === 'overdue' ? '#ef4444' : 'var(--t2)' }}>{item.due}</strong></div>
                                            <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: 'nowrap' }}>{s.label}</span>
                                        </div>

                                        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                                            <button onClick={() => toggleDone(item.id)}
                                                style={{ width: 28, height: 28, borderRadius: 8, background: done.has(item.id) ? 'rgba(16,185,129,.15)' : 'rgba(0,212,255,.05)', border: `1px solid ${done.has(item.id) ? 'rgba(16,185,129,.3)' : 'var(--b1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: done.has(item.id) ? '#10b981' : 'var(--t3)' }}>
                                                <CheckCircle size={12} />
                                            </button>
                                            <button style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(0,212,255,.05)', border: '1px solid var(--b1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--t3)' }}>
                                                <ExternalLink size={12} />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {items.length === 0 && (
                                <div className="empty-state" style={{ padding: '30px 0' }}>
                                    <CheckCircle size={28} style={{ opacity: 0.3 }} />
                                    <div style={{ fontSize: 13, color: 'var(--t3)' }}>All clear for this filter</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Certs + Portals */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>

                        {/* Certificates */}
                        <div className="card card-p">
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 14 }}>Licenses & Certificates</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                {CERTS.map(cert => (
                                    <div key={cert.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, background: 'rgba(255,255,255,.025)', border: '1px solid var(--b0)' }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: cert.status === 'valid' ? '#10b981' : '#f59e0b', flexShrink: 0 }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cert.name}</div>
                                            <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 1 }}>{cert.issuer} · Expires {cert.expiry}</div>
                                        </div>
                                        <span style={{
                                            fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 100, flexShrink: 0,
                                            background: cert.status === 'valid' ? 'rgba(16,185,129,.1)' : 'rgba(245,158,11,.12)',
                                            color: cert.status === 'valid' ? '#10b981' : '#f59e0b',
                                            border: `1px solid ${cert.status === 'valid' ? 'rgba(16,185,129,.2)' : 'rgba(245,158,11,.25)'}`,
                                        }}>{cert.status === 'valid' ? '✓ Valid' : '⚠ Renewal'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Portals */}
                        <div className="card card-p">
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 14 }}>Government Portals</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {PORTALS.map(({ name, url, color }) => (
                                    <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, background: 'rgba(255,255,255,.025)', border: '1px solid var(--b0)', textDecoration: 'none', transition: 'all .15s', cursor: 'pointer' }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                                        <span style={{ flex: 1, fontSize: 11.5, color: 'var(--t2)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                                        <ExternalLink size={11} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
