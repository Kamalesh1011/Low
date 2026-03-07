import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Globe, Plus, Eye, Settings, ExternalLink, Zap, Sparkles,
    Layout, Palette, Code2, Search, Monitor, Smartphone,
    CheckCircle2, ArrowRight, Star, Clock
} from 'lucide-react';
import Header from '../components/Header';

const WEBSITE_TEMPLATES = [
    { id: 'w1', name: 'SaaS Landing', preview: '🚀', desc: 'Modern SaaS product landing page', color: '#6366f1', popular: true },
    { id: 'w2', name: 'Business Portfolio', preview: '💼', desc: 'Professional business showcase', color: '#06b6d4', popular: false },
    { id: 'w3', name: 'E-commerce Store', preview: '🛒', desc: 'Full-featured online store', color: '#10b981', popular: true },
    { id: 'w4', name: 'Blog & Content', preview: '✍️', desc: 'SEO-optimized blog platform', color: '#f59e0b', popular: false },
    { id: 'w5', name: 'Restaurant', preview: '🍽️', desc: 'Menu, reservations, ordering', color: '#ec4899', popular: false },
    { id: 'w6', name: 'Agency', preview: '🎨', desc: 'Creative agency showcase', color: '#8b5cf6', popular: true },
];

const PUBLISHED_SITES = [
    { name: 'omniforge.ai', status: 'live', visits: '12.4K/mo', ssl: true, color: '#6366f1' },
    { name: 'textilegst.in', status: 'live', visits: '4.2K/mo', ssl: true, color: '#10b981' },
    { name: 'payrollhub.in', status: 'building', visits: '—', ssl: false, color: '#f59e0b' },
];

export default function WebsiteBuilder() {
    const [aiPrompt, setAiPrompt] = useState('');
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!aiPrompt.trim()) return;
        setGenerating(true);
        await new Promise(r => setTimeout(r, 2000));
        setGenerating(false);
        setAiPrompt('');
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <Header title="Website Builder" subtitle="SEO-ready, responsive websites — deploy to cloud in one click" />

            <div className="p-6 space-y-6">
                {/* AI Web Generator */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6"
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10">
                            <Sparkles size={20} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">AI Website Generator</h3>
                            <p className="text-xs text-slate-500">Describe your website and get a fully responsive, SEO-optimized site in seconds</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <input
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                            placeholder='e.g., "A modern SaaS landing page for a textile ERP with pricing, features, and contact form"'
                            className="input-field flex-1"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={generating || !aiPrompt}
                            className="btn-primary flex items-center gap-2 text-sm px-6 flex-shrink-0"
                        >
                            {generating
                                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Building...</>
                                : <><Globe size={14} /> Generate Website</>
                            }
                        </button>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-[10px] text-slate-600">
                        <span className="flex items-center gap-1"><CheckCircle2 size={9} className="text-emerald-400" /> Mobile Responsive</span>
                        <span className="flex items-center gap-1"><CheckCircle2 size={9} className="text-emerald-400" /> SEO Optimized</span>
                        <span className="flex items-center gap-1"><CheckCircle2 size={9} className="text-emerald-400" /> SSL Included</span>
                        <span className="flex items-center gap-1"><CheckCircle2 size={9} className="text-emerald-400" /> CDN Deployed</span>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Templates */}
                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-semibold text-white mb-4">Website Templates</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {WEBSITE_TEMPLATES.map((t, i) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.06 }}
                                    className="card p-4 cursor-pointer hover:border-indigo-500/30 group"
                                >
                                    <div
                                        className="w-full h-24 rounded-xl flex items-center justify-center text-4xl mb-3 border"
                                        style={{ background: `${t.color}12`, borderColor: `${t.color}20` }}
                                    >
                                        {t.preview}
                                    </div>
                                    <h4 className="text-xs font-bold text-white mb-1">{t.name}</h4>
                                    <p className="text-[10px] text-slate-500 mb-3">{t.desc}</p>
                                    <button
                                        className="w-full text-[11px] py-1.5 rounded-lg font-medium transition-all"
                                        style={{ background: `${t.color}20`, color: t.color }}
                                    >
                                        Use Template
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Published Sites */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4">Published Sites</h3>
                        <div className="space-y-3">
                            {PUBLISHED_SITES.map((site, i) => (
                                <div key={site.name} className="card p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                                            <Globe size={14} className="text-slate-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-white">{site.name}</p>
                                            <p className="text-[10px] text-slate-500">{site.visits} visits</p>
                                        </div>
                                        <span className={`tag text-[9px] ${site.status === 'live' ? 'tag-success' : 'tag-warning'}`}>
                                            {site.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {site.ssl && (
                                            <span className="text-[9px] text-emerald-400 flex items-center gap-0.5">
                                                <CheckCircle2 size={8} /> SSL
                                            </span>
                                        )}
                                        <button className="ml-auto text-[10px] text-indigo-400 flex items-center gap-1 hover:text-indigo-300">
                                            <ExternalLink size={10} /> Visit
                                        </button>
                                        <button className="text-[10px] text-slate-500 hover:text-slate-300">
                                            <Settings size={10} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-indigo-500/30 text-xs text-indigo-400 hover:bg-indigo-500/5 transition-all">
                                <Plus size={12} /> Deploy New Site
                            </button>
                        </div>

                        {/* SEO Features */}
                        <div className="card p-4 mt-4">
                            <h4 className="text-xs font-semibold text-white mb-3">Included Features</h4>
                            {[
                                'Auto-generated meta tags',
                                'Sitemap & robots.txt',
                                'Core Web Vitals optimized',
                                'Schema.org markup',
                                'Open Graph + Twitter Cards',
                                'Lighthouse score: 95+',
                            ].map(f => (
                                <div key={f} className="flex items-center gap-2 py-1">
                                    <CheckCircle2 size={10} className="text-emerald-400 flex-shrink-0" />
                                    <span className="text-[11px] text-slate-400">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
