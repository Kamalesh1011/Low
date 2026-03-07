import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Key, Plus, Eye, EyeOff, Copy, Trash2, Shield,
    Lock, CheckCircle2, AlertTriangle, RefreshCw,
    Zap, Code2, Globe, Database, Bot, Activity
} from 'lucide-react';
import Header from '../components/Header';

const VAULT_KEYS = [
    { id: 'k1', name: 'OpenRouter API', service: 'OpenRouter', key: 'sk-or-v1-••••••••••••••••••••••••••••••••••••4f2a', status: 'active', usage: '2.1M tokens', lastUsed: '2m ago', icon: '🤖', color: '#6366f1' },
    { id: 'k2', name: 'PostgreSQL Prod', service: 'Database', key: 'postgresql://••••••••••••••••••••••••@db.prod:5432/omniforge', status: 'active', usage: '84K queries/day', lastUsed: '30s ago', icon: '🗄️', color: '#06b6d4' },
    { id: 'k3', name: 'Redis Cache', service: 'Redis', key: 'redis://••••••••••••••••••••••••@cache.prod:6379', status: 'active', usage: '1.2M ops/day', lastUsed: '1s ago', icon: '⚡', color: '#ef4444' },
    { id: 'k4', name: 'AWS S3 Bucket', service: 'AWS', key: 'AKIA••••••••••••••••', status: 'active', usage: '45GB storage', lastUsed: '10m ago', icon: '☁️', color: '#f59e0b' },
    { id: 'k5', name: 'Stripe Payments', service: 'Stripe', key: 'sk_live_••••••••••••••••••••••••••••••••••••••••8f3k', status: 'active', usage: '₹12.4L processed', lastUsed: '1h ago', icon: '💳', color: '#10b981' },
    { id: 'k6', name: 'SendGrid Email', service: 'Email', key: 'SG.••••••••••••••••••••••••••••••••••••••••••••', status: 'warning', usage: '84% limit reached', lastUsed: '45m ago', icon: '📧', color: '#ec4899' },
    { id: 'k7', name: 'Twilio SMS', service: 'SMS', key: 'AC••••••••••••••••••••••••••••••••', status: 'active', usage: '12K SMS sent', lastUsed: '3h ago', icon: '💬', color: '#8b5cf6' },
    { id: 'k8', name: 'GitHub OAuth', service: 'OAuth', key: 'ghp_••••••••••••••••••••••••••••••••••', status: 'active', usage: '28 integrations', lastUsed: '2d ago', icon: '🔗', color: '#475569' },
];

export default function APIVault() {
    const [revealed, setRevealed] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [newKey, setNewKey] = useState({ name: '', service: '', key: '', env: 'production' });
    const [copied, setCopied] = useState(null);

    const toggleReveal = (id) => setRevealed(r => ({ ...r, [id]: !r[id] }));

    const handleCopy = (id, key) => {
        navigator.clipboard.writeText(key).catch(() => { });
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <Header title="API Vault" subtitle="Encrypted API key management with zero-knowledge security" />

            <div className="p-6 space-y-6">
                {/* Security Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-2xl p-5 border border-emerald-500/20"
                    style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.06))' }}
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-500/15 flex-shrink-0">
                            <Shield size={24} className="text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white mb-1">AES-256 Encrypted Vault</h3>
                            <p className="text-xs text-slate-400">
                                All secrets are encrypted at rest using AES-256-GCM. Keys are stored in isolated tenant namespaces with zero-knowledge architecture.
                                Access is governed by RBAC policies and full audit logging.
                            </p>
                        </div>
                        <div className="ml-auto flex flex-col gap-1 flex-shrink-0 text-right">
                            <div className="flex items-center gap-2 justify-end">
                                <div className="status-dot online" />
                                <span className="text-xs text-emerald-400">Vault Secure</span>
                            </div>
                            <span className="text-[10px] text-slate-500">Last audit: 2m ago</span>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: 'Total Secrets', value: VAULT_KEYS.length, icon: Key, color: '#6366f1' },
                        { label: 'Active Keys', value: VAULT_KEYS.filter(k => k.status === 'active').length, icon: CheckCircle2, color: '#10b981' },
                        { label: 'Warnings', value: VAULT_KEYS.filter(k => k.status === 'warning').length, icon: AlertTriangle, color: '#f59e0b' },
                        { label: 'Audit Events', value: '2,847', icon: Activity, color: '#06b6d4' },
                    ].map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="card p-4 flex items-center gap-3"
                        >
                            <div className="p-2.5 rounded-xl" style={{ background: `${s.color}18` }}>
                                <s.icon size={16} style={{ color: s.color }} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">{s.label}</p>
                                <p className="text-xl font-bold text-white text-display">{s.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Key List */}
                <div className="card overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                        <h3 className="text-sm font-semibold text-white">Secrets ({VAULT_KEYS.length})</h3>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="btn-primary flex items-center gap-2 text-xs"
                        >
                            <Plus size={13} /> Add Secret
                        </button>
                    </div>

                    <div className="divide-y divide-white/[0.04]">
                        {VAULT_KEYS.map((k, i) => (
                            <motion.div
                                key={k.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-all group"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                    style={{ background: `${k.color}20` }}
                                >
                                    {k.icon}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-semibold text-white">{k.name}</span>
                                        <span className={`tag text-[9px] py-0 ${k.status === 'active' ? 'tag-success' : 'tag-warning'}`}>
                                            {k.status}
                                        </span>
                                        <span className="tag tag-primary text-[9px] py-0">{k.service}</span>
                                    </div>
                                    <p className="text-xs font-mono text-slate-500 truncate">
                                        {revealed[k.id] ? k.key.replace(/••+/, '····real-key-would-appear-here····') : k.key}
                                    </p>
                                </div>

                                <div className="hidden lg:flex flex-col items-end gap-1 flex-shrink-0">
                                    <span className="text-[10px] text-slate-400">{k.usage}</span>
                                    <span className="text-[10px] text-slate-600">Last: {k.lastUsed}</span>
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => toggleReveal(k.id)}
                                        className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-all"
                                        title={revealed[k.id] ? 'Hide' : 'Reveal'}
                                    >
                                        {revealed[k.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                    <button
                                        onClick={() => handleCopy(k.id, k.key)}
                                        className="p-2 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                                    >
                                        {copied === k.id ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                    </button>
                                    <button className="p-2 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                                        <RefreshCw size={14} />
                                    </button>
                                    <button className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Add Secret Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-strong border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-sm font-bold text-white">Add New Secret</h3>
                                <button onClick={() => setShowAddModal(false)} className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-white/[0.05]">
                                    ✕
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Secret Name</label>
                                    <input value={newKey.name} onChange={e => setNewKey({ ...newKey, name: e.target.value })} placeholder="e.g., Stripe API Key" className="input-field" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Service</label>
                                    <input value={newKey.service} onChange={e => setNewKey({ ...newKey, service: e.target.value })} placeholder="e.g., Stripe, AWS, SendGrid" className="input-field" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Secret Value</label>
                                    <input type="password" value={newKey.key} onChange={e => setNewKey({ ...newKey, key: e.target.value })} placeholder="Paste your secret here" className="input-field" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Environment</label>
                                    <select value={newKey.env} onChange={e => setNewKey({ ...newKey, env: e.target.value })} className="input-field">
                                        <option value="production">Production</option>
                                        <option value="staging">Staging</option>
                                        <option value="development">Development</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
                                    <button className="btn-primary flex-1 text-sm flex items-center justify-center gap-2">
                                        <Lock size={13} /> Save Encrypted
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
