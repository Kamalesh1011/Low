import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Send, X, Loader2, CheckCircle2, Rocket,
    Copy, Download, ExternalLink, ChevronDown, Cpu, Zap
} from 'lucide-react';
import useStore from '../store/useStore';

const PROMPTS = [
    'Build a multi-branch textile ERP with GST billing and AI demand forecasting',
    'Create a restaurant POS system with kitchen display and online ordering',
    'Build a smart CRM with email automation and AI lead scoring',
    'Create an HR payroll system with ESI, PF compliance and leave management',
    'Build a warehouse management system with barcode scanning and RFID',
    'Create a loan readiness dashboard with credit scoring and risk analysis',
];

const MODELS = [
    { id: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI', color: '#10a37f' },
    { id: 'claude-3.5-sonnet', label: 'Claude 3.5', provider: 'Anthropic', color: '#d97706' },
    { id: 'deepseek-r1', label: 'DeepSeek R1', provider: 'DeepSeek', color: '#6366f1' },
    { id: 'gemini-pro-1.5', label: 'Gemini 1.5', provider: 'Google', color: '#4285f4' },
];

export default function AIConsole({ onBuildComplete }) {
    const { buildPrompt, setBuildPrompt, buildStatus, buildProgress, buildLogs, startBuild, currentJob } = useStore();
    const [selectedModel, setSelectedModel] = useState(MODELS[0]);
    const [showModelPicker, setShowModelPicker] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const logsRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (logsRef.current) {
            logsRef.current.scrollTop = logsRef.current.scrollHeight;
        }
    }, [buildLogs]);

    const isBuilding = ['generating', 'building', 'testing', 'deploying'].includes(buildStatus);

    const handleSubmit = async () => {
        if (!buildPrompt.trim() || isBuilding) return;
        await startBuild(buildPrompt);
        onBuildComplete?.();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
    };

    const statusLabel = {
        idle: 'Ready to build',
        generating: 'AI Planning...',
        building: 'Building...',
        testing: 'Testing...',
        deploying: 'Deploying...',
        done: 'Complete!',
        error: 'Error occurred',
    }[buildStatus] || 'Ready';

    const statusColor = {
        idle: '#64748b',
        generating: '#6366f1',
        building: '#06b6d4',
        testing: '#f59e0b',
        deploying: '#ec4899',
        done: '#10b981',
        error: '#ef4444',
    }[buildStatus] || '#64748b';

    return (
        <div className="glass-strong rounded-2xl overflow-hidden border border-white/10">
            {/* Console Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#060b14]" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-white">OmniForge AI Console</div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="status-dot online" />
                            <span className="text-[10px] text-emerald-400">Multi-agent system active</span>
                        </div>
                    </div>
                </div>

                {/* Model Selector */}
                <div className="relative">
                    <button
                        onClick={() => setShowModelPicker(!showModelPicker)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-xs font-medium text-slate-300 hover:bg-white/[0.05] transition-all"
                    >
                        <div className="w-2 h-2 rounded-full" style={{ background: selectedModel.color }} />
                        {selectedModel.label}
                        <ChevronDown size={12} className="text-slate-500" />
                    </button>
                    <AnimatePresence>
                        {showModelPicker && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute right-0 top-full mt-2 w-52 glass-strong rounded-xl border border-white/10 overflow-hidden z-50"
                            >
                                {MODELS.map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => { setSelectedModel(m); setShowModelPicker(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.05] transition-colors text-left"
                                    >
                                        <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                                        <div>
                                            <div className="text-xs font-medium text-slate-200">{m.label}</div>
                                            <div className="text-[10px] text-slate-500">{m.provider}</div>
                                        </div>
                                        {selectedModel.id === m.id && <CheckCircle2 size={12} className="ml-auto text-indigo-400" />}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-5">
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        value={buildPrompt}
                        onChange={e => setBuildPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder="Describe what you want to build... e.g., 'Build a multi-branch textile ERP with GST billing and AI demand forecasting'"
                        rows={3}
                        className="w-full bg-[#020408] border border-white/[0.08] focus:border-indigo-500/50 rounded-xl p-4 pr-16 text-sm text-slate-200 resize-none outline-none placeholder:text-slate-600 transition-all focus:bg-indigo-500/[0.02] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)]"
                    />
                    <motion.button
                        onClick={handleSubmit}
                        disabled={!buildPrompt.trim() || isBuilding}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute right-3 bottom-3 w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none transition-all neon-primary"
                    >
                        {isBuilding ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
                    </motion.button>
                </div>

                {/* Suggestions */}
                <AnimatePresence>
                    {showSuggestions && !buildPrompt && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="mt-3 space-y-1"
                        >
                            <p className="text-[10px] text-slate-600 mb-2 uppercase tracking-wider">Example prompts:</p>
                            {PROMPTS.slice(0, 3).map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => setBuildPrompt(p)}
                                    className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] rounded-lg transition-all flex items-center gap-2"
                                >
                                    <Zap size={10} className="text-indigo-400 flex-shrink-0" />
                                    {p}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-between mt-3">
                    <p className="text-[10px] text-slate-600">Press Ctrl+Enter to build • Shift+Enter for new line</p>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                        <span className="text-[10px]" style={{ color: statusColor }}>{statusLabel}</span>
                    </div>
                </div>
            </div>

            {/* Build Progress */}
            <AnimatePresence>
                {buildStatus !== 'idle' && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/[0.06] overflow-hidden"
                    >
                        {/* Progress Bar */}
                        <div className="px-5 py-3 border-b border-white/[0.04]">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Cpu size={12} className="text-indigo-400" />
                                    <span className="text-xs font-medium text-slate-300">Build Progress</span>
                                </div>
                                <span className="text-xs font-bold" style={{ color: statusColor }}>
                                    {buildProgress}%
                                </span>
                            </div>
                            <div className="progress-bar">
                                <motion.div
                                    className="progress-bar-fill"
                                    animate={{ width: `${buildProgress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                        {/* Logs */}
                        <div
                            ref={logsRef}
                            className="h-44 overflow-y-auto px-5 py-3 bg-[#020408] scrollbar-thin"
                        >
                            {buildLogs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="console-line"
                                >
                                    <span className="text-slate-600">[{log.time}]</span>
                                    {' '}
                                    <span className="text-emerald-400">{log.message}</span>
                                </motion.div>
                            ))}
                            {isBuilding && (
                                <div className="console-line text-slate-500">
                                    Processing<span className="console-cursor" />
                                </div>
                            )}
                        </div>

                        {/* Done State */}
                        {buildStatus === 'done' && currentJob && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="px-5 py-4 bg-emerald-500/5 border-t border-emerald-500/20"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                        <span className="text-sm font-semibold text-white">Application Ready!</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
                                            <Copy size={12} /> Clone
                                        </button>
                                        <button className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
                                            <Rocket size={12} /> Open App
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-emerald-400/70">
                                    🌐 Live at: {currentJob.url}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
