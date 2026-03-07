import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import AIConsole from '../components/AIConsole';
import useStore from '../store/useStore';

export default function AIBuilder() {
    const { generatedApps, templates } = useStore();
    return (
        <div className="flex-1 overflow-y-auto">
            <Header title="AI Builder" subtitle="Describe anything — get a production-ready app in seconds" />
            <div className="p-6 space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl p-8 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(236,72,153,0.08))', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <div className="absolute inset-0 grid-pattern opacity-20" />
                    <div className="relative">
                        <div className="inline-flex items-center gap-2 tag tag-primary mb-4"><Sparkles size={10} /> Powered by Multi-Agent AI</div>
                        <h2 className="text-4xl font-bold text-white text-display mb-3">Build Anything with <span className="gradient-text">Natural Language</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Type what you want to build. OmniForge autonomously generates frontend, backend, database, APIs, tests, and deployment — in under 60 seconds.</p>
                    </div>
                </motion.div>
                <AIConsole />
                <div>
                    <h3 className="text-sm font-semibold text-white mb-4">Quick Start — Click to Build</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {templates.slice(0, 8).map(t => (
                            <div key={t.id} className="card p-4 cursor-pointer hover:border-indigo-500/30" onClick={() => useStore.getState().setBuildPrompt(`Build ${t.name}: ${t.desc}`)}>
                                <div className="text-2xl mb-2">{t.icon}</div>
                                <p className="text-xs font-semibold text-white">{t.name}</p>
                                <p className="text-[10px] text-slate-500 mt-1">{t.desc}</p>
                                <div className="flex items-center gap-1 mt-2 text-[10px] text-amber-400"><Zap size={9} /> {t.time}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
