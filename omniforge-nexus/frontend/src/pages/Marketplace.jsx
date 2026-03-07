import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Download, Search, Filter, Zap, Layout, Bot, Server, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import useStore from '../store/useStore';
import { toast } from 'react-hot-toast';

export default function Marketplace() {
    const { marketplace } = useStore();
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState('all');

    const filtered = marketplace.components.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) &&
        (tab === 'all' || (tab === 'free' && c.price === 'Free') || (tab === 'premium' && c.price !== 'Free'))
    );

    const install = (name) => {
        toast.promise(
            new Promise(r => setTimeout(r, 1500)),
            {
                loading: `Installing ${name}...`,
                success: `${name} added to your library!`,
                error: 'Installation failed',
            }
        );
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <Header title="Nexus Marketplace" subtitle="Supercharge your apps with community-built blocks and agents" />

            <div className="p-6 space-y-8">
                {/* Hero Section */}
                <div className="relative rounded-3xl p-10 overflow-hidden border border-indigo-500/20" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.05))' }}>
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShoppingBag size={120} />
                    </div>
                    <div className="relative max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6">
                            <Zap size={12} /> New Quantum Blocks
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">Everything you need to <span className="gradient-text">Scale Faster</span>.</h1>
                        <p className="text-slate-400 text-lg mb-8">Browse hundreds of verified UI kits, backend routers, AI personas, and security modules built for the OmniForge ecosystem.</p>

                        <div className="flex items-center gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500 transition-all font-sans"
                                    placeholder="Search components, agents, or templates..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-secondary py-4 px-6 rounded-2xl">
                                <Filter size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                    {['all', 'free', 'premium', 'ui', 'agents', 'security'].map(t => (
                        <motion.button
                            key={t}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setTab(t)}
                            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative overflow-hidden ${tab === t
                                    ? 'text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                                    : 'bg-white/5 text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/10'
                                }`}
                        >
                            {tab === t && (
                                <motion.div
                                    layoutId="marketTab"
                                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"
                                    style={{ zIndex: -1 }}
                                />
                            )}
                            {t}
                        </motion.button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filtered.map((item) => (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="group relative bg-[#090e1a] border border-white/5 rounded-3xl p-6 hover:border-indigo-500/40 transition-all shadow-2xl"
                            style={{ background: 'linear-gradient(135deg, rgba(24,24,27,0.4), rgba(9,9,11,0.6))', backdropFilter: 'blur(10px)' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                            <div className="flex items-start justify-between mb-6 relative">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-3xl shadow-inner">
                                    {item.icon}
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                        <Star size={12} fill="currentColor" /> {item.rating}
                                    </div>
                                    <div className="text-[9px] text-slate-400 mt-2 uppercase tracking-[0.15em] font-extrabold opacity-70">{item.price}</div>
                                </div>
                            </div>

                            <h3 className="text-white font-bold text-lg mb-1 group-hover:text-indigo-400 transition-colors">{item.name}</h3>
                            <p className="text-slate-500 text-xs mb-6 font-medium italic">by {item.author}</p>

                            <div className="flex items-center gap-2 relative">
                                <button
                                    className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 hover:translate-y-[-1px]"
                                    onClick={() => install(item.name)}
                                >
                                    <Download size={14} /> Install Now
                                </button>
                                <button className="w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:border-white/20 transition-all group/btn">
                                    <Zap size={14} className="group-hover/btn:text-amber-400 group-hover/btn:scale-110 transition-all" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trending Tags */}
                <div className="border-t border-white/5 pt-8">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Trending Search</h4>
                    <div className="flex flex-wrap gap-2">
                        {marketplace.trending.map(tag => (
                            <span key={tag} className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] text-slate-400 font-bold hover:border-indigo-500/30 cursor-pointer transition-all">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
