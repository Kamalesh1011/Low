import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Puzzle, Search, Star, Download, ArrowUpRight, Zap,
    Shield, Package, Code2, Globe, Database, Bot,
    Filter, TrendingUp, CheckCircle2, Plus
} from 'lucide-react';
import Header from '../components/Header';

const PLUGINS = [
    { id: 'p01', name: 'GST India Suite', icon: '📊', category: 'Finance', rating: 4.9, downloads: '12.4K', desc: 'Complete GST filing, returns, e-invoice, and compliance toolkit', price: 'Free', verified: true, color: '#6366f1' },
    { id: 'p02', name: 'WhatsApp Business', icon: '💬', category: 'Communication', rating: 4.8, downloads: '28.1K', desc: 'Send invoices, alerts, and reports via WhatsApp Business API', price: '₹999/mo', verified: true, color: '#25d366' },
    { id: 'p03', name: 'Tally Sync', icon: '🔄', category: 'Accounting', rating: 4.7, downloads: '9.2K', desc: 'Bidirectional sync with Tally Prime for accounting data', price: '₹1,499/mo', verified: true, color: '#f59e0b' },
    { id: 'p04', name: 'IndiaMART Connector', icon: '🛒', category: 'E-commerce', rating: 4.6, downloads: '6.8K', desc: 'Sync leads, products, and orders from IndiaMART', price: '₹799/mo', verified: false, color: '#ef4444' },
    { id: 'p05', name: 'Razorpay Payments', icon: '💳', category: 'Payments', rating: 4.9, downloads: '34.2K', desc: 'Accept payments, subscriptions, and manage refunds', price: 'Free', verified: true, color: '#3395ff' },
    { id: 'p06', name: 'Shiprocket Logistics', icon: '🚚', category: 'Logistics', rating: 4.5, downloads: '8.7K', desc: 'Multi-carrier shipping, tracking, and COD management', price: '₹599/mo', verified: true, color: '#f97316' },
    { id: 'p07', name: 'Zoho CRM Bridge', icon: '🤝', category: 'CRM', rating: 4.4, downloads: '5.1K', desc: 'Sync contacts, deals, and activities with Zoho CRM', price: '₹1,299/mo', verified: false, color: '#ec4899' },
    { id: 'p08', name: 'OpenAI GPT Agent', icon: '🤖', category: 'AI', rating: 4.9, downloads: '42.8K', desc: 'Embed GPT-4o powered chatbots and assistants in your apps', price: 'Free', verified: true, color: '#10a37f' },
    { id: 'p09', name: 'Aadhaar eKYC', icon: '🪪', category: 'Compliance', rating: 4.6, downloads: '3.4K', desc: 'Aadhaar-based eKYC for customer verification', price: '₹2,999/mo', verified: true, color: '#f59e0b' },
    { id: 'p10', name: 'AWS Deployment', icon: '☁️', category: 'DevOps', rating: 4.8, downloads: '19.6K', desc: 'One-click deploy to AWS ECS, EC2, or Lambda', price: 'Free', verified: true, color: '#f97316' },
    { id: 'p11', name: 'Prometheus Monitor', icon: '📈', category: 'Observability', rating: 4.7, downloads: '11.3K', desc: 'Auto-instrument apps with Prometheus + Grafana dashboards', price: 'Free', verified: true, color: '#e6522c' },
    { id: 'p12', name: 'ONDC Integration', icon: '🌐', category: 'E-commerce', rating: 4.5, downloads: '2.8K', desc: 'List products and accept orders on India\'s ONDC network', price: '₹1,999/mo', verified: false, color: '#6366f1' },
];

const CATEGORIES = ['All', 'Finance', 'AI', 'Payments', 'Communication', 'E-commerce', 'DevOps', 'Logistics', 'CRM', 'Compliance', 'Observability', 'Accounting'];

export default function Marketplace() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [installed, setInstalled] = useState(new Set(['p01', 'p05', 'p08', 'p10']));

    const filtered = PLUGINS.filter(p => {
        const matchCat = category === 'All' || p.category === category;
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const toggleInstall = (id) => {
        setInstalled(s => {
            const n = new Set(s);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <Header title="Plugin Marketplace" subtitle="Extend OmniForge with 200+ integrations and plugins" />

            <div className="p-6 space-y-6">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-2xl p-6"
                    style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.08))', border: '1px solid rgba(139,92,246,0.2)' }}
                >
                    <div className="absolute inset-0 grid-pattern opacity-20" />
                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                        <div>
                            <div className="tag tag-primary mb-3 inline-flex"><Puzzle size={10} /> 200+ Plugins Available</div>
                            <h2 className="text-2xl font-bold text-white text-display mb-2">
                                Extend with <span className="gradient-text">Powerful Plugins</span>
                            </h2>
                            <p className="text-sm text-slate-400">Connect payment gateways, logistics, CRMs, compliance tools, and AI models. Install in one click, configure with AI.</p>
                        </div>
                        <div className="flex items-center gap-3 lg:justify-end">
                            {[
                                { label: 'Total Plugins', value: '200+', color: '#6366f1' },
                                { label: 'Installed', value: installed.size, color: '#10b981' },
                                { label: 'Free Plugins', value: '84', color: '#f59e0b' },
                            ].map(s => (
                                <div key={s.label} className="text-center p-3 glass rounded-xl">
                                    <div className="text-2xl font-bold text-display" style={{ color: s.color }}>{s.value}</div>
                                    <div className="text-[10px] text-slate-500">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Search */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plugins..." className="input-field pl-9" />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${category === cat ? 'bg-indigo-500 text-white' : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] border border-white/[0.06]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Plugin Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((p, i) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.04 }}
                            className="card p-5 group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl border"
                                    style={{ background: `${p.color}18`, borderColor: `${p.color}30` }}
                                >
                                    {p.icon}
                                </div>
                                {p.verified && (
                                    <div className="flex items-center gap-1 text-[9px] text-emerald-400">
                                        <CheckCircle2 size={9} /> Verified
                                    </div>
                                )}
                            </div>

                            <h3 className="text-sm font-bold text-white mb-1">{p.name}</h3>
                            <span className="tag tag-primary text-[9px] mb-2 inline-flex">{p.category}</span>
                            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">{p.desc}</p>

                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                    <Star size={9} className="text-amber-400" />
                                    <span className="text-amber-400 font-medium">{p.rating}</span>
                                    <span>• {p.downloads} downloads</span>
                                </div>
                                <span className={`text-[10px] font-semibold ${p.price === 'Free' ? 'text-emerald-400' : 'text-slate-300'}`}>
                                    {p.price}
                                </span>
                            </div>

                            <button
                                onClick={() => toggleInstall(p.id)}
                                className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${installed.has(p.id)
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                                        : 'btn-primary'
                                    }`}
                            >
                                {installed.has(p.id) ? '✓ Installed' : 'Install Plugin'}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
