import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowUpRight, ExternalLink, Tag, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import useStore from '../store/useStore';

const CATEGORIES = ['All', 'Loan', 'Subsidy', 'Guarantee', 'Registration', 'Finance'];

export default function Schemes() {
    const { schemes } = useStore();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [selected, setSelected] = useState(null);

    const filtered = schemes.filter(s => {
        const matchCat = category === 'All' || s.category === category;
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div style={{ flex: 1, overflowY: 'auto' }}>
            <Header
                title="Government Schemes"
                subtitle="Complete list of Government Schemes for MSMEs"
            />

            <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Filters */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            className="input"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search schemes or keywords..."
                            style={{ paddingLeft: 36 }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`badge ${category === cat ? 'badge-saffron' : 'badge-muted'}`}
                                style={{ cursor: 'pointer', border: 'none', fontSize: 12, padding: '6px 14px' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{filtered.length}</span> schemes found
                </div>

                {/* Schemes Grid + Detail */}
                <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: 20, transition: 'all 0.3s' }}>
                    {/* Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                        {filtered.map((scheme, i) => (
                            <motion.div
                                key={scheme.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelected(selected?.id === scheme.id ? null : scheme)}
                                className="scheme-card"
                                style={{
                                    borderColor: selected?.id === scheme.id ? `${scheme.color}40` : 'rgba(255,255,255,0.07)',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <div style={{
                                        width: 42, height: 42, borderRadius: 12,
                                        background: `${scheme.color}15`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 20,
                                    }}>
                                        {scheme.icon}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                                        <span className={`badge ${scheme.category === 'Loan' ? 'badge-indigo' : scheme.category === 'Subsidy' ? 'badge-saffron' : scheme.category === 'Guarantee' ? 'badge-green' : 'badge-muted'}`}>
                                            {scheme.category}
                                        </span>
                                        <span className="badge badge-green" style={{ fontSize: 9 }}>✓ Active</span>
                                    </div>
                                </div>

                                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{scheme.name}</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                                    {[
                                        { l: 'Max Amount', v: scheme.maxAmount },
                                        { l: 'Interest', v: scheme.interestRate },
                                        { l: 'Ministry', v: scheme.ministry },
                                        { l: 'Deadline', v: scheme.deadline },
                                    ].map(item => (
                                        <div key={item.l}>
                                            <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginBottom: 2 }}>{item.l}</div>
                                            <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-primary)' }}>{item.v}</div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                                    {scheme.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="badge badge-muted" style={{ fontSize: 10 }}>{tag}</span>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: 8 }}>
                                    <a
                                        href={scheme.applyUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-primary"
                                        style={{ fontSize: 11.5, padding: '8px 14px', flex: 1, justifyContent: 'center' }}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        Apply Now <ExternalLink size={10} />
                                    </a>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ fontSize: 11.5, padding: '8px 14px' }}
                                        onClick={() => setSelected(selected?.id === scheme.id ? null : scheme)}
                                    >
                                        Details
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Scheme Detail Panel */}
                    {selected && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: `1px solid ${selected.color}30`,
                                borderRadius: 20,
                                padding: 24,
                                height: 'fit-content',
                                position: 'sticky',
                                top: 0,
                            }}
                        >
                            <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
                                <div style={{ fontSize: 32 }}>{selected.icon}</div>
                                <div>
                                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{selected.name}</h3>
                                </div>
                            </div>

                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                                {selected.description}
                            </p>

                            <div className="divider" />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {[
                                    { l: 'Maximum Amount', v: selected.maxAmount },
                                    { l: 'Interest Rate', v: selected.interestRate },
                                    { l: 'Eligibility', v: selected.eligibility },
                                    { l: 'Ministry', v: selected.ministry },
                                    { l: 'Last Scraped', v: selected.scraped },
                                ].map(item => (
                                    <div key={item.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.l}</span>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{item.v}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="divider" />

                            <div style={{ display: 'flex', gap: 8 }}>
                                <a
                                    href={selected.applyUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-primary"
                                    style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}
                                >
                                    Apply Now <ExternalLink size={12} />
                                </a>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
