import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Star, MapPin, Briefcase, Clock, Calendar,
    MessageSquare, Search, CheckCircle, Award, Filter
} from 'lucide-react';
import Header from '../components/Header';

const EXPERTS = [
    {
        id: 'exp_001', name: 'CA Ramesh Iyer', role: 'GST & Tax Consultant',
        avatar: 'R', color: '#10b981',
        specialty: ['GST', 'Income Tax', 'TDS', 'Audit'],
        rating: 4.9, reviews: 312, experience: '18 yrs',
        location: 'Chennai, TN', rate: '₹2,500/hr',
        availability: 'Available Today', verified: true, topRated: true, sessions: 1840,
        bio: 'Former CBIC officer. Expert in GST notices, audits, and MSME tax planning.',
    },
    {
        id: 'exp_002', name: 'Adv. Priya Mehta', role: 'Business & Contract Lawyer',
        avatar: 'P', color: '#6366f1',
        specialty: ['Company Law', 'Contracts', 'FSSAI', 'Export'],
        rating: 4.8, reviews: 198, experience: '12 yrs',
        location: 'Mumbai, MH', rate: '₹3,000/hr',
        availability: 'Available Tomorrow', verified: true, topRated: true, sessions: 920,
        bio: 'Specializes in MSME registration, export compliance and business structuring.',
    },
    {
        id: 'exp_003', name: 'Sunil Kapoor', role: 'MSME Finance & Loan Advisor',
        avatar: 'S', color: '#f97316',
        specialty: ['MUDRA', 'CGTMSE', 'Working Capital', 'SIDBI'],
        rating: 4.7, reviews: 245, experience: '15 yrs',
        location: 'Delhi, NCR', rate: '₹1,800/hr',
        availability: 'Available in 2 hrs', verified: true, topRated: false, sessions: 1200,
        bio: 'Ex-SIDBI banker. Helps MSMEs get the right loan at best rates.',
    },
    {
        id: 'exp_004', name: 'Ananya Krishnan', role: 'Digital Marketing & Exports',
        avatar: 'A', color: '#ec4899',
        specialty: ['D2C', 'Amazon Export', 'ONDC', 'Google Ads'],
        rating: 4.9, reviews: 186, experience: '9 yrs',
        location: 'Bangalore, KA', rate: '₹2,200/hr',
        availability: 'Available Today', verified: true, topRated: true, sessions: 680,
        bio: 'Helped 100+ MSMEs go digital on ONDC, Amazon Global, and Flipkart.',
    },
    {
        id: 'exp_005', name: 'Vikram Sharma', role: 'Manufacturing & Operations',
        avatar: 'V', color: '#f59e0b',
        specialty: ['Lean Mfg', 'ISO 9001', 'Quality', 'Supply Chain'],
        rating: 4.6, reviews: 142, experience: '20 yrs',
        location: 'Pune, MH', rate: '₹2,800/hr',
        availability: 'Available in 3 days', verified: true, topRated: false, sessions: 430,
        bio: 'Former Tata Motors factory head — transforms MSME shop floors with lean.',
    },
    {
        id: 'exp_006', name: 'Deepa Nair', role: 'HR & Labour Law Expert',
        avatar: 'D', color: '#0ea5e9',
        specialty: ['PF', 'ESI', 'Labour Law', 'Payroll'],
        rating: 4.8, reviews: 167, experience: '14 yrs',
        location: 'Kochi, KL', rate: '₹1,500/hr',
        availability: 'Available Today', verified: true, topRated: false, sessions: 760,
        bio: 'HR specialist. 200+ companies made PF/ESI compliant under her guidance.',
    },
];

export default function ExpertConnect() {
    const [search, setSearch] = useState('');
    const [avail, setAvail] = useState('all');
    const [booked, setBooked] = useState(new Set());

    const toggle = (id) => setBooked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

    const filtered = EXPERTS.filter(e => {
        if (avail === 'today' && !e.availability.includes('Today')) return false;
        if (avail === 'top' && !e.topRated) return false;
        const q = search.toLowerCase();
        return !q || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.specialty.some(s => s.toLowerCase().includes(q));
    });

    return (
        <div style={{ flex: 1, overflowY: 'auto' }}>
            <Header title="Expert Connect" subtitle="Book 1-on-1 sessions with verified MSME advisors" />

            <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* ── Hero ──────────────────────────────── */}
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,.12) 0%, rgba(249,115,22,.08) 100%)',
                        border: '1px solid rgba(99,102,241,.22)', borderRadius: 18, padding: '20px 24px',
                        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                        position: 'relative', overflow: 'hidden',
                    }}>
                    <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,.07), transparent)', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: 11, color: '#818cf8', fontWeight: 700, marginBottom: 5 }}>✨ OmniForge Expert Network</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', fontFamily: 'var(--font-display)', letterSpacing: -0.5 }}>Get Expert Advice for Your MSME</div>
                        <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 5, lineHeight: 1.6 }}>500+ verified experts in tax, law, finance, and operations.</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 12 }}>
                            {['✅ 500+ Experts', '⭐ Avg 4.8 Rating', '🔒 Verified', '💬 Chat + Video'].map(badge => (
                                <span key={badge} style={{ fontSize: 11, color: 'var(--t3)' }}>{badge}</span>
                            ))}
                        </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.04 }} className="btn btn-primary" style={{ padding: '11px 22px', fontSize: 12.5, flexShrink: 0, position: 'relative', zIndex: 1 }}>
                        <Calendar size={14} /> Schedule Free Call
                    </motion.button>
                </motion.div>

                {/* ── Filters ───────────────────────────── */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 0 }}>
                        <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)', pointerEvents: 'none' }} />
                        <input className="input" style={{ paddingLeft: 32, height: 36 }}
                            placeholder="Search by name, role or specialty…" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    {[{ k: 'all', l: 'All Experts' }, { k: 'today', l: 'Available Today' }, { k: 'top', l: 'Top Rated' }].map(({ k, l }) => (
                        <button key={k} onClick={() => setAvail(k)} style={{
                            padding: '7px 14px', borderRadius: 8,
                            border: `1px solid ${avail === k ? 'var(--cyan)' : 'var(--b1)'}`,
                            background: avail === k ? 'rgba(0,212,255,.08)' : 'rgba(0,212,255,.02)',
                            color: avail === k ? 'var(--cyan)' : 'var(--t3)',
                            fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)', whiteSpace: 'nowrap',
                        }}>{l}</button>
                    ))}
                </div>

                {/* ── Expert Cards ──────────────────────── */}
                {filtered.length === 0
                    ? <div className="empty-state"><Users size={32} style={{ opacity: 0.3 }} /><div style={{ fontSize: 13, color: 'var(--t3)' }}>No experts match your search</div></div>
                    : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                            {filtered.map((exp, i) => (
                                <motion.div key={exp.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                    whileHover={{ y: -5 }}
                                    className="card" style={{ padding: 20, position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${exp.color},transparent)` }} />

                                    {/* Header row */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                                        <div style={{
                                            width: 50, height: 50, borderRadius: 14, flexShrink: 0,
                                            background: `linear-gradient(135deg,${exp.color},${exp.color}99)`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 20, fontWeight: 700, color: '#fff',
                                            boxShadow: `0 0 20px ${exp.color}30`,
                                        }}>{exp.avatar}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                                <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--t1)' }}>{exp.name}</div>
                                                {exp.verified && <CheckCircle size={12} fill="#10b981" color="#10b981" />}
                                                {exp.topRated && <Award size={12} color="#f59e0b" fill="#f59e0b" />}
                                            </div>
                                            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{exp.role}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                                <Star size={11} fill="#f59e0b" color="#f59e0b" />
                                                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>{exp.rating}</span>
                                                <span style={{ fontSize: 10.5, color: 'var(--t3)' }}>({exp.reviews}) · {exp.sessions} sessions</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p style={{ fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.65, marginBottom: 12 }}>{exp.bio}</p>

                                    {/* Specialty tags */}
                                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                                        {exp.specialty.slice(0, 3).map(s => (
                                            <span key={s} style={{ fontSize: 9.5, padding: '2px 8px', borderRadius: 100, background: `${exp.color}12`, color: exp.color, border: `1px solid ${exp.color}25` }}>{s}</span>
                                        ))}
                                    </div>

                                    {/* Meta */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, borderTop: '1px solid var(--b0)', paddingTop: 12, marginBottom: 14 }}>
                                        <span style={{ fontSize: 10.5, color: 'var(--t3)', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10} />{exp.location}</span>
                                        <span style={{ fontSize: 10.5, color: 'var(--t3)', display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={10} />{exp.experience}</span>
                                        <span style={{ fontSize: 10.5, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} />{exp.availability}</span>
                                    </div>

                                    {/* CTA */}
                                    <div className="flex-between">
                                        <div style={{ fontSize: 15, fontWeight: 800, color: exp.color, fontFamily: 'var(--font-display)' }}>{exp.rate}</div>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                                                onClick={() => toggle(exp.id)}
                                                style={{
                                                    padding: '7px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
                                                    background: booked.has(exp.id) ? '#10b981' : `linear-gradient(135deg,${exp.color},${exp.color}BB)`,
                                                    color: '#fff', fontSize: 11.5, fontWeight: 700, fontFamily: 'var(--font-display)',
                                                    letterSpacing: 0.5, transition: 'all .2s',
                                                }}>
                                                {booked.has(exp.id) ? '✓ Booked!' : 'Book Now'}
                                            </motion.button>
                                            <button style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(0,212,255,.06)', border: '1px solid var(--b1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--cyan)' }}>
                                                <MessageSquare size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )
                }
            </div>
        </div>
    );
}
