import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Workflow, Play, Pause, Plus, Zap, GitBranch, Clock,
    CheckCircle2, AlertCircle, Settings, MoreVertical,
    Database, Mail, MessageSquare, Globe, Webhook, Bot,
    ArrowRight, Filter, RefreshCw, Search, Activity
} from 'lucide-react';
import { ReactFlow, Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Header from '../components/Header';
import useStore from '../store/useStore';

const NODE_TYPES_PALETTE = [
    { type: 'trigger', label: 'Trigger', icon: Zap, color: '#f59e0b', desc: 'Starts the workflow' },
    { type: 'ai_agent', label: 'AI Agent', icon: Bot, color: '#6366f1', desc: 'Run an AI agent' },
    { type: 'database', label: 'Database', icon: Database, color: '#06b6d4', desc: 'Read/write data' },
    { type: 'api_call', label: 'API Call', icon: Globe, color: '#10b981', desc: 'HTTP request' },
    { type: 'email', label: 'Email', icon: Mail, color: '#8b5cf6', desc: 'Send email' },
    { type: 'webhook', label: 'Webhook', icon: Webhook, color: '#f97316', desc: 'Receive webhook' },
    { type: 'filter', label: 'Filter', icon: Filter, color: '#ec4899', desc: 'Conditional logic' },
    { type: 'transform', label: 'Transform', icon: RefreshCw, color: '#ef4444', desc: 'Transform data' },
];

const wfNodes = [
    { id: 'n1', position: { x: 50, y: 180 }, data: { label: '⚡ Schedule: Daily 9AM' }, style: { background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 10, color: '#fbbf24', fontSize: 11, padding: '8px 14px' } },
    { id: 'n2', position: { x: 280, y: 120 }, data: { label: '🗄️ Fetch Inventory Data' }, style: { background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.4)', borderRadius: 10, color: '#22d3ee', fontSize: 11, padding: '8px 14px' } },
    { id: 'n3', position: { x: 280, y: 240 }, data: { label: '🤖 AI: Analyze Stock Levels' }, style: { background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 10, color: '#818cf8', fontSize: 11, padding: '8px 14px' } },
    { id: 'n4', position: { x: 510, y: 180 }, data: { label: '🔍 Filter: Low Stock?' }, style: { background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.4)', borderRadius: 10, color: '#f472b6', fontSize: 11, padding: '8px 14px' } },
    { id: 'n5', position: { x: 740, y: 120 }, data: { label: '📧 Send Reorder Alert' }, style: { background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: 10, color: '#a78bfa', fontSize: 11, padding: '8px 14px' } },
    { id: 'n6', position: { x: 740, y: 240 }, data: { label: '📊 Update Dashboard' }, style: { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 10, color: '#34d399', fontSize: 11, padding: '8px 14px' } },
];

const wfEdges = [
    { id: 'e1', source: 'n1', target: 'n2', animated: true, style: { stroke: '#f59e0b60' } },
    { id: 'e2', source: 'n1', target: 'n3', animated: true, style: { stroke: '#f59e0b60' } },
    { id: 'e3', source: 'n2', target: 'n4', animated: true, style: { stroke: '#06b6d460' } },
    { id: 'e4', source: 'n3', target: 'n4', animated: true, style: { stroke: '#6366f160' } },
    { id: 'e5', source: 'n4', target: 'n5', animated: true, label: 'Yes', style: { stroke: '#10b98160' } },
    { id: 'e6', source: 'n4', target: 'n6', animated: true, label: 'Always', style: { stroke: '#ec489960' } },
];

export default function Workflows() {
    const { workflows } = useStore();
    const [activeTab, setActiveTab] = useState('list');
    const [nodes, setNodes, onNodesChange] = useNodesState(wfNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(wfEdges);
    const onConnect = useCallback((params) => setEdges(eds => addEdge({ ...params, animated: true }, eds)), []);

    return (
        <div className="flex-1 overflow-y-auto">
            <Header title="Workflow Engine" subtitle="Intelligent automation — n8n-style but fully AI-native" />

            <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: 'Active Workflows', value: '28', icon: Workflow, color: '#6366f1' },
                        { label: 'Runs Today', value: '1,284', icon: Play, color: '#10b981' },
                        { label: 'Success Rate', value: '99.4%', icon: CheckCircle2, color: '#06b6d4' },
                        { label: 'Avg Execution', value: '2.3s', icon: Clock, color: '#f59e0b' },
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

                {/* Tabs */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
                        {['list', 'canvas'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${activeTab === tab ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                {tab === 'canvas' ? 'Visual Canvas' : 'Workflows'}
                            </button>
                        ))}
                    </div>
                    <button className="btn-primary flex items-center gap-2 text-xs">
                        <Plus size={13} /> New Workflow
                    </button>
                </div>

                {/* Workflow List */}
                {activeTab === 'list' && (
                    <div className="space-y-3">
                        {workflows.map((wf, i) => (
                            <motion.div
                                key={wf.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="card p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl ${wf.status === 'active' ? 'bg-emerald-500/10' : 'bg-slate-700/20'}`}>
                                            <Workflow size={18} className={wf.status === 'active' ? 'text-emerald-400' : 'text-slate-500'} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-semibold text-white">{wf.name}</h3>
                                                <span className={`tag text-[9px] ${wf.status === 'active' ? 'tag-success' : 'tag-warning'}`}>
                                                    {wf.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1">
                                                <span className="text-[10px] text-slate-500">
                                                    <span className="text-white font-medium">{wf.runs}</span> total runs
                                                </span>
                                                <span className="text-[10px] text-slate-500">Last: {wf.lastRun}</span>
                                                <span className="text-[10px] text-slate-500">
                                                    <span className="text-indigo-400 font-medium">{wf.nodeCount}</span> nodes
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setActiveTab('canvas')}
                                            className="btn-ghost text-xs flex items-center gap-1.5"
                                        >
                                            <GitBranch size={12} /> Edit Canvas
                                        </button>
                                        <button
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${wf.status === 'active'
                                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                                }`}
                                        >
                                            {wf.status === 'active' ? <><Pause size={11} /> Pause</> : <><Play size={11} /> Resume</>}
                                        </button>
                                        <button className="p-1.5 text-slate-600 hover:text-slate-400">
                                            <MoreVertical size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Mini progress */}
                                <div className="mt-3 progress-bar">
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: wf.status === 'active' ? '100%' : '60%' }}
                                    />
                                </div>
                            </motion.div>
                        ))}

                        {/* Node Palette */}
                        <div className="card p-5">
                            <h3 className="text-sm font-semibold text-white mb-4">Available Node Types</h3>
                            <div className="grid grid-cols-4 gap-3">
                                {NODE_TYPES_PALETTE.map(nt => (
                                    <div
                                        key={nt.type}
                                        className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-indigo-500/30 hover:bg-white/[0.04] cursor-grab transition-all"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <nt.icon size={13} style={{ color: nt.color }} />
                                            <span className="text-xs font-medium text-slate-300">{nt.label}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-600">{nt.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Visual Canvas */}
                {activeTab === 'canvas' && (
                    <div>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {NODE_TYPES_PALETTE.map(nt => (
                                <div
                                    key={nt.type}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/[0.06] bg-white/[0.02] cursor-grab text-xs text-slate-400 hover:text-slate-200 hover:border-indigo-500/30 transition-all"
                                >
                                    <nt.icon size={11} style={{ color: nt.color }} />
                                    {nt.label}
                                </div>
                            ))}
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 480 }}>
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                fitView
                            >
                                <Background color="#1a2744" gap={24} />
                                <Controls />
                                <MiniMap nodeColor={() => '#4f46e5'} maskColor="rgba(2,4,8,0.85)" />
                            </ReactFlow>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
