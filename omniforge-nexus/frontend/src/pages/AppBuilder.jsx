import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Wrench, Plus, Eye, Settings, MoreVertical, Globe,
    Smartphone, Monitor, ArrowRight, Layers, Code2,
    Sparkles, Package, Layout, Palette, Zap, ExternalLink,
    Play, Download, GitBranch, CheckCircle, Clock
} from 'lucide-react';
import Header from '../components/Header';
import useStore from '../store/useStore';

const COMPONENTS = [
    { icon: Layout, label: 'Container', category: 'Layout', color: '#6366f1' },
    { icon: Layers, label: 'Grid', category: 'Layout', color: '#6366f1' },
    { icon: Layout, label: 'Card', category: 'UI', color: '#06b6d4' },
    { icon: Package, label: 'Button', category: 'UI', color: '#10b981' },
    { icon: Package, label: 'Input', category: 'UI', color: '#f59e0b' },
    { icon: Package, label: 'Table', category: 'Data', color: '#8b5cf6' },
    { icon: Package, label: 'Chart', category: 'Data', color: '#ec4899' },
    { icon: Package, label: 'Form', category: 'UI', color: '#f97316' },
    { icon: Package, label: 'Modal', category: 'UI', color: '#ef4444' },
    { icon: Package, label: 'Nav', category: 'Layout', color: '#06b6d4' },
];

const PREVIEW_SCREENS = [
    { label: 'Desktop', icon: Monitor, width: '100%' },
    { label: 'Tablet', icon: Layers, width: '768px' },
    { label: 'Mobile', icon: Smartphone, width: '375px' },
];

export default function AppBuilder() {
    const { generatedApps } = useStore();
    const [activeView, setActiveView] = useState('canvas');
    const [screen, setScreen] = useState('Desktop');
    const [aiDesc, setAiDesc] = useState('');
    const [dragOver, setDragOver] = useState(false);

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header title="App Builder" subtitle="Drag-and-drop visual builder with AI component generation" />

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Component Library */}
                <div className="w-52 flex-shrink-0 border-r border-white/[0.06] bg-[#060b14] overflow-y-auto">
                    <div className="p-3">
                        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-3">Components</p>

                        {/* AI Generate Component */}
                        <div className="mb-4">
                            <textarea
                                value={aiDesc}
                                onChange={e => setAiDesc(e.target.value)}
                                placeholder="Describe a component to generate..."
                                rows={2}
                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg p-2 text-[11px] text-slate-400 resize-none outline-none placeholder:text-slate-700 focus:border-indigo-500/50"
                            />
                            <button className="mt-1.5 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-indigo-500/15 text-indigo-400 text-[11px] font-medium hover:bg-indigo-500/25 transition-all">
                                <Sparkles size={10} /> Generate
                            </button>
                        </div>

                        <div className="space-y-1">
                            {COMPONENTS.map((comp, i) => (
                                <motion.div
                                    key={comp.label}
                                    draggable
                                    whileHover={{ x: 3 }}
                                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/[0.04] cursor-grab active:cursor-grabbing transition-all"
                                >
                                    <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: `${comp.color}20` }}>
                                        <comp.icon size={11} style={{ color: comp.color }} />
                                    </div>
                                    <span className="text-[11px] text-slate-400">{comp.label}</span>
                                    <span className="ml-auto text-[9px] text-slate-700">{comp.category}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Canvas */}
                <div className="flex-1 flex flex-col overflow-hidden bg-[#020408]">
                    {/* Canvas Toolbar */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-[#060b14]">
                        <div className="flex items-center gap-3">
                            {/* View Mode */}
                            <div className="flex items-center gap-1 p-0.5 bg-white/[0.04] border border-white/[0.06] rounded-lg">
                                {['canvas', 'code', 'preview'].map(v => (
                                    <button
                                        key={v}
                                        onClick={() => setActiveView(v)}
                                        className={`px-2.5 py-1 rounded text-[11px] font-medium capitalize transition-all ${activeView === v ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>

                            {/* Screen Size */}
                            <div className="flex items-center gap-1">
                                {PREVIEW_SCREENS.map(s => (
                                    <button
                                        key={s.label}
                                        onClick={() => setScreen(s.label)}
                                        data-tooltip={s.label}
                                        className={`p-1.5 rounded-lg transition-all ${screen === s.label ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-600 hover:text-slate-300'}`}
                                    >
                                        <s.icon size={14} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="btn-ghost text-xs flex items-center gap-1.5">
                                <Eye size={12} /> Preview
                            </button>
                            <button className="btn-ghost text-xs flex items-center gap-1.5">
                                <Code2 size={12} /> Export Code
                            </button>
                            <button className="btn-primary text-xs flex items-center gap-1.5">
                                <Zap size={12} /> Deploy
                            </button>
                        </div>
                    </div>

                    {/* Canvas Area */}
                    {activeView === 'canvas' && (
                        <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
                            <div
                                className={`canvas-drop-zone w-full transition-all ${dragOver ? 'drag-over' : ''}`}
                                style={{ maxWidth: screen === 'Mobile' ? 375 : screen === 'Tablet' ? 768 : '100%' }}
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={() => setDragOver(false)}
                            >
                                {/* Placeholder UI */}
                                <div className="p-6 space-y-4">
                                    {/* Mock Navbar */}
                                    <div className="flex items-center justify-between py-3 px-5 rounded-xl bg-[#0d1526] border border-white/[0.08]">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-indigo-500/30" />
                                            <div className="h-3 w-24 rounded bg-white/[0.08]" />
                                        </div>
                                        <div className="flex gap-2">
                                            {[...Array(4)].map((_, i) => <div key={i} className="h-3 w-14 rounded bg-white/[0.06]" />)}
                                        </div>
                                        <div className="h-8 w-20 rounded-lg bg-indigo-500/30" />
                                    </div>

                                    {/* Mock Hero */}
                                    <div className="py-12 px-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/15 text-center">
                                        <div className="h-6 w-64 rounded bg-white/[0.1] mx-auto mb-3" />
                                        <div className="h-4 w-80 rounded bg-white/[0.06] mx-auto mb-5" />
                                        <div className="flex gap-2 justify-center">
                                            <div className="h-9 w-28 rounded-lg bg-indigo-500/40" />
                                            <div className="h-9 w-28 rounded-lg bg-white/[0.06]" />
                                        </div>
                                    </div>

                                    {/* Mock Cards */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="p-4 rounded-xl bg-[#0d1526] border border-white/[0.06]">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 mb-3" />
                                                <div className="h-3 w-20 rounded bg-white/[0.1] mb-2" />
                                                <div className="h-2 w-full rounded bg-white/[0.05] mb-1" />
                                                <div className="h-2 w-3/4 rounded bg-white/[0.05]" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Drop hint */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                                    <div className="text-center">
                                        <Plus size={32} className="text-indigo-500 mx-auto mb-2" />
                                        <p className="text-xs text-indigo-500">Drag components here</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeView === 'code' && (
                        <div className="flex-1 overflow-auto p-4">
                            <div className="code-block h-full">
                                <div className="text-slate-500 mb-2">// AI-Generated React Component</div>
                                <div><span className="text-pink-400">import</span> <span className="text-cyan-400">React</span> <span className="text-pink-400">from</span> <span className="text-green-400">'react'</span>;</div>
                                <br />
                                <div><span className="text-pink-400">export default function</span> <span className="text-yellow-400">App</span>() {'{'}</div>
                                <div className="ml-4"><span className="text-pink-400">return</span> (</div>
                                <div className="ml-8">&lt;<span className="text-cyan-400">div</span> <span className="text-green-400">className</span>=<span className="text-amber-400">"min-h-screen bg-gray-50"</span>&gt;</div>
                                <div className="ml-12 text-slate-600">{'/* AI-generated UI components */'}</div>
                                <div className="ml-12">&lt;<span className="text-cyan-400">Navbar</span> /&gt;</div>
                                <div className="ml-12">&lt;<span className="text-cyan-400">Hero</span> /&gt;</div>
                                <div className="ml-12">&lt;<span className="text-cyan-400">Features</span> /&gt;</div>
                                <div className="ml-12">&lt;<span className="text-cyan-400">Footer</span> /&gt;</div>
                                <div className="ml-8">&lt;/<span className="text-cyan-400">div</span>&gt;</div>
                                <div className="ml-4">);</div>
                                <div>{'}'}</div>
                            </div>
                        </div>
                    )}

                    {activeView === 'preview' && (
                        <div className="flex-1 flex items-center justify-center bg-slate-950 p-8">
                            <div className="text-center">
                                <Monitor size={40} className="text-slate-700 mx-auto mb-3" />
                                <p className="text-sm text-slate-500">Live preview will render here</p>
                                <p className="text-xs text-slate-700 mt-1">Add components to enable preview</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel - Properties */}
                <div className="w-48 flex-shrink-0 border-l border-white/[0.06] bg-[#060b14] p-3">
                    <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-3">Properties</p>
                    <div className="space-y-3">
                        {[
                            { label: 'Width', value: '100%' },
                            { label: 'Height', value: 'auto' },
                            { label: 'Padding', value: '16px' },
                            { label: 'Background', value: '#ffffff' },
                            { label: 'Border Radius', value: '8px' },
                        ].map(prop => (
                            <div key={prop.label}>
                                <label className="text-[10px] text-slate-600 block mb-1">{prop.label}</label>
                                <input defaultValue={prop.value} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1.5 text-[11px] text-slate-400 outline-none focus:border-indigo-500/50" />
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/[0.06]">
                        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-2">Your Apps</p>
                        {generatedApps.slice(0, 3).map(app => (
                            <div key={app.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.03] cursor-pointer mb-1">
                                <span className="text-sm">{app.icon}</span>
                                <span className="text-[10px] text-slate-400 truncate">{app.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
