import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, Plus, Search, Filter, TrendingUp, Award } from 'lucide-react';
import Header from '../components/Header';
import useStore from '../store/useStore';

const CATEGORIES = ['All', 'Loan', 'GST', 'Scheme', 'Export', 'Manufacturing'];

export default function Community() {
    const { communityPosts, likePost, toggleSavePost } = useStore();
    const [category, setCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', body: '' });

    const filtered = communityPosts.filter(p => {
        const matchCat = category === 'All' || p.category === category;
        const matchSearch = p.title.includes(search) || p.body.includes(search);
        return matchCat && matchSearch;
    });

    return (
        <div style={{ flex: 1, overflowY: 'auto' }}>
            <Header
                title="MSME Community"
                subtitle="Your platform to share, learn, and grow"
            />

            <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Top Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                    {[
                        { value: '1.2L+', label: 'Members', emoji: '👥', color: '#6366f1' },
                        { value: '48K+', label: 'Discussions', emoji: '💬', color: '#10b981' },
                        { value: '8.2K', label: 'Success Stories', emoji: '🌟', color: '#f97316' },
                        { value: '320+', label: 'Experts Online', emoji: '🎓', color: '#f59e0b' },
                    ].map(stat => (
                        <div key={stat.label} className="card card-p-sm" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 22 }}>{stat.emoji}</span>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 800, color: stat.color, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{stat.value}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters + New Post */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                        <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            className="input"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search discussions..."
                            style={{ paddingLeft: 36 }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`badge ${category === cat ? 'badge-saffron' : 'badge-muted'}`}
                                style={{ cursor: 'pointer', border: 'none', padding: '6px 12px', fontSize: 11.5 }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowNew(!showNew)}
                        className="btn btn-primary"
                        style={{ fontSize: 12, padding: '9px 16px' }}
                    >
                        <Plus size={13} /> New Post
                    </button>
                </div>

                {/* New Post Form */}
                {showNew && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card card-p"
                        style={{ border: '1px solid rgba(249,115,22,0.25)' }}
                    >
                        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--text-primary)' }}>
                            ✍️ Start a New Discussion
                        </h3>
                        <input
                            className="input"
                            placeholder="Title..."
                            value={newPost.title}
                            onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                            style={{ marginBottom: 10 }}
                        />
                        <textarea
                            className="input"
                            placeholder="Share your experience, question, or advice..."
                            value={newPost.body}
                            onChange={e => setNewPost({ ...newPost, body: e.target.value })}
                            rows={4}
                            style={{ resize: 'vertical' }}
                        />
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <button className="btn btn-primary" style={{ fontSize: 12 }}>Post</button>
                            <button className="btn btn-secondary" onClick={() => setShowNew(false)} style={{ fontSize: 12 }}>Cancel</button>
                        </div>
                    </motion.div>
                )}

                {/* Layout: Posts + Sidebar */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
                    {/* Posts */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {filtered.map((post, i) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="post-card"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                    <div className="post-avatar">{post.avatar}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{post.author}</div>
                                        <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{post.business} · {post.time}</div>
                                    </div>
                                    <span className={`badge ${post.category === 'Loan' ? 'badge-indigo' : post.category === 'GST' ? 'badge-warning' : post.category === 'Scheme' ? 'badge-saffron' : 'badge-muted'}`}>
                                        {post.category}
                                    </span>
                                </div>

                                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>
                                    {post.title}
                                </h3>

                                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>
                                    {post.body.length > 160 ? post.body.substring(0, 160) + '...' : post.body}
                                </p>

                                <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                                    {post.tags.map(tag => (
                                        <span key={tag} className="badge badge-muted" style={{ fontSize: 10 }}>#{tag}</span>
                                    ))}
                                </div>

                                <div className="divider" style={{ margin: '0 0 12px' }} />

                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <button
                                        onClick={() => likePost(post.id)}
                                        className="btn btn-ghost"
                                        style={{ fontSize: 12, padding: '6px 10px', gap: 5 }}
                                    >
                                        <Heart size={13} style={{ color: '#f97316' }} />
                                        {post.likes}
                                    </button>
                                    <button
                                        className="btn btn-ghost"
                                        style={{ fontSize: 12, padding: '6px 10px', gap: 5 }}
                                    >
                                        <MessageCircle size={13} />
                                        {post.replies} Replies
                                    </button>
                                    <button
                                        onClick={() => toggleSavePost(post.id)}
                                        className="btn btn-ghost"
                                        style={{ fontSize: 12, padding: '6px 10px', marginLeft: 'auto', color: post.saved ? '#f97316' : 'var(--text-muted)' }}
                                    >
                                        <Bookmark size={13} fill={post.saved ? '#f97316' : 'none'} />
                                        {post.saved ? 'Saved' : 'Save'}
                                    </button>
                                    <button className="btn btn-primary" style={{ fontSize: 11, padding: '6px 12px' }}>
                                        Read →
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {/* Trending */}
                        <div className="card card-p-sm">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                                <TrendingUp size={14} style={{ color: '#f97316' }} />
                                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Trending Topics</span>
                            </div>
                            {['MUDRA Loan 2026', 'GST ITC Claim', 'PMEGP Apply', 'Export MSME', 'CGTMSE'].map((topic, i) => (
                                <div key={topic} style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '8px 0',
                                    borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                    cursor: 'pointer',
                                }}>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 16 }}>#{i + 1}</span>
                                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{topic}</span>
                                </div>
                            ))}
                        </div>

                        {/* Top Contributors */}
                        <div className="card card-p-sm">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                                <Award size={14} style={{ color: '#f59e0b' }} />
                                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Top Contributors</span>
                            </div>
                            {[
                                { name: 'Kavitha Reddy', pts: 2840, emoji: '👩‍💻' },
                                { name: 'Suresh Kumar', pts: 2310, emoji: '👨‍🔧' },
                                { name: 'Priya Patel', pts: 1980, emoji: '👩‍💼' },
                                { name: 'Amandeep Singh', pts: 1720, emoji: '👨‍🌾' },
                            ].map((c, i) => (
                                <div key={c.name} style={{
                                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0',
                                    borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                }}>
                                    <span style={{ fontSize: 18 }}>{c.emoji}</span>
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</div>
                                        <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{c.pts.toLocaleString()} pts</div>
                                    </div>
                                    {i === 0 && <span style={{ marginLeft: 'auto', fontSize: 14 }}>🥇</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
