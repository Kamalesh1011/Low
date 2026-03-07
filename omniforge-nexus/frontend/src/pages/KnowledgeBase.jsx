import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Search, Plus, FileText, Star, Upload,
    Brain, Zap, Globe, MessageSquare, File, FolderOpen,
    Eye, Edit3, Trash2, ChevronDown, ChevronUp
} from 'lucide-react';
import Header from '../components/Header';

const ARTICLES = [
    {
        id: 'kb_001', title: 'Complete Guide to MUDRA Loan Application 2026',
        category: 'Finance', tags: ['MUDRA', 'Loan', 'MSME'], pinned: true,
        summary: 'Step-by-step process to apply for MUDRA Shishu, Kishore & Tarun loans. Includes document checklist.',
        views: 1240, updated: '3 days ago', readTime: '8 min',
    },
    {
        id: 'kb_002', title: 'GST Input Tax Credit (ITC) Reconciliation Masterclass',
        category: 'Taxation', tags: ['GST', 'ITC', 'GSTR-2A'], pinned: true,
        summary: 'Matching ITC in GSTR-2A vs purchase register — avoid notices with proper reconciliation steps.',
        views: 3420, updated: '1 week ago', readTime: '12 min',
    },
    {
        id: 'kb_003', title: 'Export Documentation Checklist — RCMC, FSSAI, APEDA',
        category: 'Export', tags: ['Export', 'APEDA'], pinned: false,
        summary: 'Everything you need before your first export shipment. State-wise requirements included.',
        views: 890, updated: '2 weeks ago', readTime: '15 min',
    },
    {
        id: 'kb_004', title: 'Udyam Registration: Upgrade from UAM to New Portal',
        category: 'Registration', tags: ['Udyam', 'UAM'], pinned: false,
        summary: 'If you have old Udyamashakti or UAM number, here is how to migrate to the new Udyam portal.',
        views: 2100, updated: '5 days ago', readTime: '5 min',
    },
    {
        id: 'kb_005', title: 'PF & ESI Compliance for MSMEs — Full Setup Guide',
        category: 'HR & Compliance', tags: ['PF', 'ESI', 'Labour Law'], pinned: false,
        summary: 'When to register, how to calculate contributions, and how to avoid penalties under PF/ESI.',
        views: 780, updated: '3 weeks ago', readTime: '10 min',
    },
    {
        id: 'kb_006', title: 'OmniForge Nexus Coder — AI App Building Tutorial',
        category: 'Platform', tags: ['Nexus', 'AI', 'Tutorial'], pinned: false,
        summary: 'Use Nexus Coder to generate full-stack apps for your MSME in under 10 minutes.',
        views: 560, updated: '1 day ago', readTime: '6 min',
    },
];

const SOURCES = [
    { name: 'MSME Ministry Portal', type: 'web', articles: 34, icon: Globe, color: '#10b981' },
    { name: 'GST Council Circulars', type: 'web', articles: 89, icon: FileText, color: '#6366f1' },
    { name: 'Business SOP Documents', type: 'upload', articles: 12, icon: File, color: '#f97316' },
    { name: 'Internal Policy Docs', type: 'upload', articles: 7, icon: FolderOpen, color: '#f59e0b' },
];

const CATS = ['All', 'Finance', 'Taxation', 'Export', 'Registration', 'HR & Compliance', 'Platform'];

export default function KnowledgeBase() {
    const [search, setSearch] = useState('');
    const [cat, setCat] = useState('All');
    const [expanded, setExpanded] = useState(null);

    const filtered = ARTICLES.filter(a =>
        (cat === 'All' || a.category === cat) &&
        a.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ flex: 1, overflowY: 'auto' }}>
            <Header title="Knowledge Base" subtitle="AI-powered MSME knowledge & document vault" />

            <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* ── AI Banner ─────────────────────── */}
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,.12) 0%, rgba(0,212,255,.07) 100%)',
                        border: '1px solid rgba(99,102,241,.25)', borderRadius: 16, padding: '18px 22px',
                        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14,
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                        <div style={{ width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Brain size={22} color="white" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>AI Knowledge Assistant</div>
                            <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2 }}>Ask any MSME question — trained on your docs + government data</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,.05)', border: '1px solid var(--b1)', cursor: 'text', minWidth: 200 }}>
                            <MessageSquare size={12} style={{ color: 'var(--t3)' }} />
                            <span style={{ fontSize: 12, color: 'var(--t3)' }}>Ask AI anything…</span>
                        </div>
                        <motion.button whileHover={{ scale: 1.05 }} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 11.5 }}>
                            <Zap size={13} /> Ask AI
                        </motion.button>
                    </div>
                </motion.div>

                {/* ── Stats Row ────────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                    {[
                        { label: 'Articles', value: String(ARTICLES.length), color: '#6366f1' },
                        { label: 'Total Views', value: '9.0K', color: '#10b981' },
                        { label: 'Sources', value: String(SOURCES.length), color: '#f97316' },
                        { label: 'AI Replies', value: '2.4K', color: '#f59e0b' },
                    ].map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                            className="stat-card" style={{ padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${s.color},transparent)` }} />
                            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Main Layout ──────────────────── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.8fr) minmax(220px,1fr)', gap: 20 }}>

                    {/* Left: Articles */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
                        {/* Search + Add */}
                        <div style={{ display: 'flex', gap: 8 }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                                <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', pointerEvents: 'none' }} />
                                <input className="input" style={{ paddingLeft: 32, height: 36 }}
                                    placeholder="Search articles…" value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                            <motion.button whileHover={{ scale: 1.04 }} className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: 11, flexShrink: 0 }}>
                                <Plus size={13} /> New Article
                            </motion.button>
                        </div>

                        {/* Category Pills */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {CATS.map(c => (
                                <button key={c} onClick={() => setCat(c)} style={{
                                    padding: '5px 12px', borderRadius: 100,
                                    border: `1px solid ${cat === c ? 'var(--cyan)' : 'var(--b1)'}`,
                                    background: cat === c ? 'rgba(0,212,255,.08)' : 'rgba(0,212,255,.02)',
                                    color: cat === c ? 'var(--cyan)' : 'var(--t3)',
                                    fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'all .15s',
                                }}>{c}</button>
                            ))}
                        </div>

                        {/* Article List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {filtered.length === 0 && (
                                <div className="empty-state">
                                    <BookOpen size={32} style={{ opacity: 0.3 }} />
                                    <div style={{ fontSize: 13, color: 'var(--t3)' }}>No articles match your search</div>
                                </div>
                            )}
                            {filtered.map((art, i) => (
                                <motion.div key={art.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                    style={{
                                        borderRadius: 14, cursor: 'pointer',
                                        background: expanded === art.id ? 'rgba(0,212,255,.05)' : 'rgba(255,255,255,.025)',
                                        border: `1px solid ${expanded === art.id ? 'var(--b2)' : 'var(--b1)'}`,
                                        transition: 'all .18s', overflow: 'hidden',
                                    }}>
                                    <div style={{ padding: '14px 16px' }} onClick={() => setExpanded(expanded === art.id ? null : art.id)}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, flexWrap: 'wrap' }}>
                                                    {art.pinned && <Star size={11} fill="#f59e0b" color="#f59e0b" />}
                                                    <span style={{ fontSize: 9.5, padding: '1px 7px', borderRadius: 100, background: 'rgba(99,102,241,.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,.2)', whiteSpace: 'nowrap' }}>{art.category}</span>
                                                </div>
                                                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', lineHeight: 1.4, marginBottom: 5 }}>{art.title}</div>
                                                <div style={{ fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.6 }}>{art.summary}</div>
                                                <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                                                    {art.tags.map(t => (
                                                        <span key={t} style={{ fontSize: 9.5, padding: '1px 7px', borderRadius: 100, background: 'rgba(0,212,255,.05)', color: 'var(--cyan)', border: '1px solid var(--b1)' }}>#{t}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 60 }}>
                                                <div style={{ fontSize: 10, color: 'var(--t3)' }}>👁 {art.views.toLocaleString()}</div>
                                                <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 3 }}>⏱ {art.readTime}</div>
                                                <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 3 }}>{art.updated}</div>
                                                <div style={{ marginTop: 6, color: 'var(--t3)' }}>
                                                    {expanded === art.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded actions */}
                                    <AnimatePresence>
                                        {expanded === art.id && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                style={{ borderTop: '1px solid var(--b1)', padding: '12px 16px', display: 'flex', gap: 8 }}>
                                                <button className="btn btn-primary" style={{ padding: '7px 14px', fontSize: 11 }}><Eye size={12} /> Read Full</button>
                                                <button className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: 11 }}><Edit3 size={12} /> Edit</button>
                                                <button style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444' }}>
                                                    <Trash2 size={12} />
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Sources + Upload */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
                        {/* Sources */}
                        <div className="card card-p">
                            <div className="flex-between" style={{ marginBottom: 14 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Knowledge Sources</div>
                                <button className="btn btn-ghost" style={{ fontSize: 10, padding: '4px 8px' }}><Upload size={10} /> Connect</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {SOURCES.map(src => (
                                    <div key={src.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, background: 'rgba(255,255,255,.025)', border: '1px solid var(--b0)' }}>
                                        <div style={{ width: 30, height: 30, borderRadius: 9, background: `${src.color}18`, border: `1px solid ${src.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <src.icon size={13} style={{ color: src.color }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{src.name}</div>
                                            <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 1 }}>{src.articles} articles · {src.type}</div>
                                        </div>
                                        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: 'rgba(16,185,129,.1)', color: '#10b981', border: '1px solid rgba(16,185,129,.2)', flexShrink: 0 }}>✓ synced</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upload Zone */}
                        <motion.div whileHover={{ scale: 1.02 }} style={{ padding: 22, borderRadius: 14, border: '1.5px dashed var(--b2)', textAlign: 'center', cursor: 'pointer', background: 'rgba(0,212,255,.02)' }}>
                            <Upload size={22} style={{ color: 'var(--t3)', margin: '0 auto 9px' }} />
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)' }}>Upload Documents</div>
                            <div style={{ fontSize: 10.5, color: 'var(--t3)', marginTop: 4 }}>PDF, DOCX, TXT · Max 10 MB</div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
