import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Star, Clock, ArrowRight, Zap, Code2,
    Database, Globe, Cpu, CheckCircle2, Heart, Download,
    TrendingUp, Package, Plus, ChevronRight, Sparkles
} from 'lucide-react';
import Header from '../components/Header';
import useStore from '../store/useStore';

const CATEGORIES = ['All', 'ERP', 'Inventory', 'CRM', 'HR', 'Retail', 'Finance', 'Manufacturing', 'SaaS', 'Logistics', 'Analytics', 'E-commerce', 'F&B', 'Service', 'Trade', 'Supply Chain'];

export default function Templates() {
    const { templates, startBuild, setBuildPrompt } = useStore();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [hoveredId, setHoveredId] = useState(null);

    const filtered = templates.filter(t => {
        const matchesCat = category === 'All' || t.category === category;
        const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const handleUse = (t) => {
        setBuildPrompt(`Build ${t.name}: ${t.desc}`);
        startBuild(`Build ${t.name}: ${t.desc}`);
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <Header title="Template Library" subtitle="20 MSME-ready production templates — deploy in seconds" />

            <div className="p-6">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-2xl p-8 mb-6 text-center"
                    style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(236,72,153,0.08) 100%)',
                        border: '1px solid rgba(99,102,241,0.2)'
                    }}
                >
                    <div className="absolute inset-0 grid-pattern opacity-30" />
                    <div className="relative">
                        <div className="inline-flex items-center gap-2 tag tag-primary mb-4">
                            <Package size={12} /> 20 Production-Ready Templates
                        </div>
                        <h2 className="text-3xl font-bold text-white text-display mb-3">
                            Start with a <span className="gradient-text">Battle-Tested Template</span>
                        </h2>
                        <p className="text-slate-400 text-sm max-w-xl mx-auto">
                            Each template includes full-stack implementation, database schema, API contracts,
                            Docker deployment, and AI-powered business logic — ready in under 60 seconds.
                        </p>
                    </div>
                </motion.div>

                {/* Filters */}
                <div className="flex items-center gap-3 mb-5 flex-wrap">
                    <div className="relative flex-1 min-w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search templates..."
                            className="input-field pl-9"
                        />
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${category === cat
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200 border border-white/[0.06]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((t, i) => (
                            <motion.div
                                key={t.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.03 }}
                                onMouseEnter={() => setHoveredId(t.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className="card p-5 cursor-pointer group relative overflow-hidden"
                                style={{
                                    borderColor: hoveredId === t.id ? `${t.color}40` : undefined,
                                }}
                            >
                                {/* Background glow */}
                                {hoveredId === t.id && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 rounded-2xl pointer-events-none"
                                        style={{ background: `radial-gradient(circle at 30% 30%, ${t.color}10 0%, transparent 70%)` }}
                                    />
                                )}

                                {/* Popular Badge */}
                                {t.popular && (
                                    <div className="absolute top-3 right-3">
                                        <span className="tag tag-warning text-[9px] py-0.5">
                                            <Star size={8} /> Popular
                                        </span>
                                    </div>
                                )}

                                <div className="relative">
                                    {/* Icon */}
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 border"
                                        style={{
                                            background: `${t.color}18`,
                                            borderColor: `${t.color}30`,
                                        }}
                                    >
                                        {t.icon}
                                    </div>

                                    {/* Info */}
                                    <div className="mb-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-sm font-bold text-white">{t.name}</h3>
                                        </div>
                                        <span className="tag inline-flex" style={{ background: `${t.color}15`, color: t.color, borderColor: `${t.color}30`, fontSize: '9px' }}>
                                            {t.category}
                                        </span>
                                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{t.desc}</p>
                                    </div>

                                    {/* Tech Stack */}
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {t.tech.map(tech => (
                                            <span key={tech} className="text-[9px] bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded text-slate-500">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                            <Zap size={9} className="text-amber-400" />
                                            <span>Ready in <span className="text-amber-400 font-semibold">{t.time}</span></span>
                                        </div>
                                        <motion.button
                                            onClick={() => handleUse(t)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-all"
                                            style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}bb)` }}
                                        >
                                            <Sparkles size={10} /> Use
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20 text-slate-600">
                        <Package size={40} className="mx-auto mb-3 opacity-30" />
                        <p>No templates found for "{search}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}
