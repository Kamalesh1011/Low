import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
    Settings, User, Bell, Shield, CreditCard, Palette, Globe,
    Cpu, Save, ChevronRight, GitBranch, Check, X, Eye, EyeOff,
    ExternalLink, RefreshCw, Loader, Star, Lock, AlertCircle, Plus
} from 'lucide-react';
import Header from '../components/Header';
import useStore from '../store/useStore';
import { toast } from 'react-hot-toast';

const SECTIONS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'ai', label: 'AI Settings', icon: Cpu },
    { id: 'deployment', label: 'GitHub & Deploy', icon: GitBranch },
];

function GitHubSection() {
    const { github, setGitHubToken, disconnectGitHub, refreshGitHubRepos } = useStore();
    const [tokenInput, setTokenInput] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleConnect = async () => {
        if (!tokenInput.trim()) {
            setError('Please enter your GitHub Personal Access Token');
            return;
        }
        setLoading(true);
        setError('');
        const result = await setGitHubToken(tokenInput.trim());
        setLoading(false);
        if (result.success) {
            toast.success(`✅ Connected as @${result.user.login}!`);
            setTokenInput('');
        } else {
            setError(result.error || 'Failed to connect. Check your token.');
        }
    };

    const handleDisconnect = () => {
        disconnectGitHub();
        toast.success('GitHub disconnected');
    };

    const handleRefresh = async () => {
        await refreshGitHubRepos();
        toast.success('Repos refreshed');
    };

    return (
        <div className="space-y-4">
            {/* Connected State */}
            {github.connected && github.user ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Profile Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(0,255,136,0.06), rgba(0,255,136,0.02))',
                        border: '1px solid rgba(0,255,136,0.25)',
                        borderRadius: 14,
                        padding: 18,
                        marginBottom: 16,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                            {github.user.avatar_url ? (
                                <img
                                    src={github.user.avatar_url}
                                    alt={github.user.login}
                                    style={{ width: 52, height: 52, borderRadius: 12, border: '2px solid rgba(0,255,136,0.3)' }}
                                />
                            ) : (
                                <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(0,255,136,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                                    👤
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                                        {github.user.name || github.user.login}
                                    </span>
                                    <span style={{ fontSize: 10, color: '#34d399', background: 'rgba(0,255,136,0.1)', padding: '2px 8px', borderRadius: 100, border: '1px solid rgba(0,255,136,0.3)' }}>
                                        ✓ Connected
                                    </span>
                                </div>
                                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>@{github.user.login}</div>
                                {github.user.email && (
                                    <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>{github.user.email}</div>
                                )}
                            </div>
                            <a href={github.user.profile_url} target="_blank" rel="noopener noreferrer"
                                style={{ padding: '7px 12px', borderRadius: 9, border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', fontSize: 11, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                                <ExternalLink size={11} /> Profile
                            </a>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
                            {[
                                { label: 'Public Repos', value: github.user.public_repos },
                                { label: 'Followers', value: github.user.followers },
                                { label: 'Following', value: github.user.following },
                            ].map(stat => (
                                <div key={stat.label} style={{ textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</div>
                                    <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 2 }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                onClick={handleRefresh}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 9, border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer' }}>
                                <RefreshCw size={12} /> Refresh Repos
                            </button>
                            <button
                                onClick={handleDisconnect}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 9, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#f87171', fontSize: 12, cursor: 'pointer', marginLeft: 'auto' }}>
                                <X size={12} /> Disconnect
                            </button>
                        </div>
                    </div>

                    {/* Recent Repos */}
                    {github.repos && github.repos.length > 0 && (
                        <div className="card p-4">
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <GitBranch size={13} style={{ color: '#6366f1' }} />
                                Your Repositories ({github.repos.length})
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
                                {github.repos.map(repo => (
                                    <div key={repo.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border-faint)', background: 'rgba(255,255,255,0.02)' }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', truncate: true }}>{repo.name}</span>
                                                {repo.private && (
                                                    <span style={{ fontSize: 9, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '1px 6px', borderRadius: 100, border: '1px solid rgba(245,158,11,0.2)' }}>
                                                        <Lock size={7} style={{ display: 'inline' }} /> Private
                                                    </span>
                                                )}
                                            </div>
                                            {repo.description && (
                                                <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{repo.description}</div>
                                            )}
                                            <div style={{ display: 'flex', gap: 10, marginTop: 4, alignItems: 'center' }}>
                                                {repo.language && <span style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>● {repo.language}</span>}
                                                <span style={{ fontSize: 9.5, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}><Star size={9} /> {repo.stars}</span>
                                            </div>
                                        </div>
                                        <a href={repo.url} target="_blank" rel="noopener noreferrer"
                                            style={{ flexShrink: 0, padding: '5px 10px', borderRadius: 7, border: '1px solid var(--border-faint)', background: 'transparent', color: 'var(--text-muted)', fontSize: 10.5, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <ExternalLink size={10} /> View
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            ) : (
                /* Not Connected State */
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 14, padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <GitBranch size={20} style={{ color: '#818cf8' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Connect Your GitHub</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Push generated code directly to your GitHub repos</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
                            {[
                                { icon: '🔀', text: 'Auto-create repos for generated projects' },
                                { icon: '⚡', text: 'One-click push from VibeCoder' },
                                { icon: '🌐', text: 'Deploy to GitHub Pages instantly' },
                                { icon: '🔒', text: 'Your token stays on your device' },
                            ].map((f, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: 16 }}>{f.icon}</span>
                                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Token Input */}
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Lock size={11} /> Personal Access Token (PAT)
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showToken ? 'text' : 'password'}
                                    value={tokenInput}
                                    onChange={e => { setTokenInput(e.target.value); setError(''); }}
                                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                    onKeyDown={e => e.key === 'Enter' && handleConnect()}
                                    className="input-field"
                                    style={{ paddingRight: 40, fontFamily: 'monospace', fontSize: 12 }}
                                />
                                <button
                                    onClick={() => setShowToken(!showToken)}
                                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                    {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            {error && (
                                <div style={{ fontSize: 11, color: '#f87171', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <AlertCircle size={11} /> {error}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button
                                onClick={handleConnect}
                                disabled={loading || !tokenInput.trim()}
                                style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    padding: '10px 0', borderRadius: 10, border: 'none',
                                    background: loading || !tokenInput.trim() ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    color: 'white', fontSize: 13, fontWeight: 700, cursor: loading || !tokenInput.trim() ? 'not-allowed' : 'pointer',
                                    opacity: loading || !tokenInput.trim() ? 0.7 : 1,
                                }}>
                                {loading ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <GitBranch size={14} />}
                                {loading ? 'Verifying...' : 'Connect GitHub'}
                            </button>
                            <a
                                href="https://github.com/settings/tokens/new?scopes=repo,read:user,user:email&description=OmniForge+Nexus"
                                target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', fontSize: 12, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                                <ExternalLink size={12} /> Get Token
                            </a>
                        </div>

                        <div style={{ marginTop: 12, fontSize: 10.5, color: 'var(--text-faint)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                            <Lock size={10} style={{ marginTop: 2, flexShrink: 0 }} />
                            Your token is stored locally and only sent to GitHub's API. We never store it on our servers.
                            <br />
                            Required scopes: <strong>repo</strong>, <strong>read:user</strong>, <strong>user:email</strong>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default function SettingsPage() {
    const { user } = useStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const [active, setActive] = useState(searchParams.get('tab') || 'profile');
    const [name, setName] = useState(user?.name || 'Demo User');
    const [email, setEmail] = useState(user?.email || 'demo@omniforge.ai');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && SECTIONS.some(s => s.id === tab)) {
            setActive(tab);
        }
    }, [searchParams]);

    const handleTabChange = (tabId) => {
        setActive(tabId);
        setSearchParams({ tab: tabId });
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <Header title="Settings" subtitle="Configure your OmniForge Nexus workspace" />
            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="card p-3">
                        {SECTIONS.map(s => (
                            <button
                                key={s.id}
                                onClick={() => handleTabChange(s.id)}
                                className={`sidebar-item w-full mb-0.5 ${active === s.id ? 'active' : ''}`}
                            >
                                <s.icon size={15} />
                                <span>{s.label}</span>
                                <ChevronRight size={12} className="ml-auto" />
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3 space-y-4">
                        {active === 'profile' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
                                <h3 className="text-sm font-bold text-white mb-5">Profile Settings</h3>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                        {(name || 'U').charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{name}</p>
                                        <p className="text-xs text-slate-500">Owner · OmniForge Nexus</p>
                                        <button className="text-xs text-indigo-400 mt-1 hover:text-indigo-300">Change avatar</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-slate-400 mb-1.5 block">Full Name</label>
                                        <input value={name} onChange={e => setName(e.target.value)} className="input-field" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
                                        <input value={email} onChange={e => setEmail(e.target.value)} className="input-field" />
                                    </div>
                                </div>
                                <button onClick={() => toast.success('Profile saved!')} className="btn-primary mt-5 flex items-center gap-2 text-sm">
                                    <Save size={14} /> Save Changes
                                </button>
                            </motion.div>
                        )}

                        {active === 'ai' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
                                <h3 className="text-sm font-bold text-white mb-5">AI Configuration</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium text-slate-400 mb-1.5 block">Default AI Model</label>
                                        <select className="input-field">
                                            <option value="openai/gpt-4o">GPT-4o (Recommended)</option>
                                            <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                                            <option value="deepseek/deepseek-r1">DeepSeek R1</option>
                                            <option value="google/gemini-pro-1.5">Gemini Pro 1.5</option>
                                            <option value="meta-llama/llama-3.1-70b-instruct">Llama 3.1 70B</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-400 mb-1.5 block">Max Tokens per Build</label>
                                        <input type="number" defaultValue={16000} className="input-field" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-400 mb-1.5 block">Temperature: 0.3</label>
                                        <input type="range" min="0" max="1" step="0.1" defaultValue="0.3" className="w-full accent-indigo-500" />
                                    </div>
                                    <button onClick={() => toast.success('AI config saved!')} className="btn-primary flex items-center gap-2 text-sm">
                                        <Save size={14} /> Save AI Config
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {active === 'deployment' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="card p-6">
                                    <h3 className="text-sm font-bold text-white mb-1">GitHub & Deployment</h3>
                                    <p className="text-xs text-slate-500 mb-5">Connect your personal GitHub account to push generated code and deploy</p>
                                    <GitHubSection />
                                </div>
                            </motion.div>
                        )}

                        {active === 'billing' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
                                <h3 className="text-sm font-bold text-white mb-5">Billing & Plan</h3>
                                <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-5 mb-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-lg font-bold text-white">Developer Plan</p>
                                            <p className="text-xs text-slate-400 mt-1">Unlimited builds · Real AI generation via OpenRouter</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-indigo-400">Free</p>
                                            <p className="text-xs text-slate-500">Self-hosted</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500">This is a self-hosted deployment. Add your OpenRouter API key in the .env file to use real AI generation.</p>
                            </motion.div>
                        )}

                        {!['profile', 'billing', 'ai', 'deployment'].includes(active) && (
                            <div className="card p-8 text-center">
                                <Settings size={32} className="text-slate-700 mx-auto mb-3" />
                                <p className="text-sm text-slate-500">Settings for <strong className="text-slate-300">{SECTIONS.find(s => s.id === active)?.label}</strong> coming soon</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
