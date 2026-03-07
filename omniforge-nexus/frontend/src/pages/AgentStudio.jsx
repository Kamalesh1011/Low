import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot, Plus, Play, Pause, Settings, MoreVertical, Cpu,
    Zap, Activity, MessageSquare, Network, Star, Code2,
    GitBranch, ArrowRight, ChevronDown, AlertCircle, CheckCircle2,
    Trash2, Copy, BarChart3, Clock
} from 'lucide-react';
import Header from '../components/Header';
import useStore from '../store/useStore';
import { ReactFlow, Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const AGENT_TYPES = [
    { type: 'Planner', icon: '🧠', color: '#6366f1', desc: 'Plans and decomposes tasks' },
    { type: 'Architect', icon: '🏗️', color: '#8b5cf6', desc: 'Designs system architecture' },
    { type: 'Builder', icon: '⚙️', color: '#06b6d4', desc: 'Generates full-stack code' },
    { type: 'Validator', icon: '✅', color: '#10b981', desc: 'Validates and tests code' },
    { type: 'Tester', icon: '🧪', color: '#f59e0b', desc: 'Runs automated test suites' },
    { type: 'Optimizer', icon: '🚀', color: '#ef4444', desc: 'Optimizes performance' },
    { type: 'Monitor', icon: '📊', color: '#ec4899', desc: 'Monitors in production' },
    { type: 'Deployer', icon: '🐳', color: '#f97316', desc: 'Handles deployment pipeline' },
];

const MODELS = ['gpt-4o', 'claude-3.5-sonnet', 'deepseek-r1', 'gemini-pro-1.5', 'llama-3.1-8b', 'mixtral-8x7b'];

const initialNodes = [
    { id: '1', type: 'default', position: { x: 100, y: 100 }, data: { label: '🧠 PlannerBot' }, style: { background: '#1a2744', border: '1px solid #6366f1', borderRadius: 12, color: '#e2e8f0', fontSize: 12, padding: 10 } },
    { id: '2', type: 'default', position: { x: 300, y: 60 }, data: { label: '🏗️ ArchitectAI' }, style: { background: '#1a2744', border: '1px solid #8b5cf6', borderRadius: 12, color: '#e2e8f0', fontSize: 12, padding: 10 } },
    { id: '3', type: 'default', position: { x: 300, y: 160 }, data: { label: '⚙️ BuilderBot' }, style: { background: '#1a2744', border: '1px solid #06b6d4', borderRadius: 12, color: '#e2e8f0', fontSize: 12, padding: 10 } },
    { id: '4', type: 'default', position: { x: 500, y: 100 }, data: { label: '✅ ValidatorX' }, style: { background: '#1a2744', border: '1px solid #10b981', borderRadius: 12, color: '#e2e8f0', fontSize: 12, padding: 10 } },
    { id: '5', type: 'default', position: { x: 700, y: 100 }, data: { label: '🚀 OptimizerAI' }, style: { background: '#1a2744', border: '1px solid #ef4444', borderRadius: 12, color: '#e2e8f0', fontSize: 12, padding: 10 } },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#6366f1' } },
    { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#6366f1' } },
    { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#8b5cf6' } },
    { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#06b6d4' } },
    { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#10b981' } },
];

export default function AgentStudio() {
    const { agents } = useStore();
    const [activeTab, setActiveTab] = useState('agents');
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newAgent, setNewAgent] = useState({ name: '', type: 'Builder', model: 'gpt-4o', instructions: '' });

    const onConnect = (params) => setEdges(eds => addEdge({ ...params, animated: true, style: { stroke: '#6366f1' } }, eds));

    return (
        <div className="flex-1 overflow-y-auto">
            <Header title="Agent Studio" subtitle="Create, orchestrate, and monitor multi-agent AI systems" />

            <div className="p-6 space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: 'Total Agents', value: agents.length, icon: Bot, color: '#6366f1' },
                        { label: 'Active Now', value: agents.filter(a => a.status === 'active').length, icon: Activity, color: '#10b981' },
                        { label: 'Tasks Today', value: '1,622', icon: Zap, color: '#f59e0b' },
                        { label: 'Avg Success', value: '98.3%', icon: CheckCircle2, color: '#06b6d4' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="card p-4 flex items-center gap-3"
                        >
                            <div className="p-2.5 rounded-xl" style={{ background: `${stat.color}18` }}>
                                <stat.icon size={16} style={{ color: stat.color }} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">{stat.label}</p>
                                <p className="text-xl font-bold text-white text-display">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
                    {['agents', 'orchestration', 'create'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${activeTab === tab
                                ? 'bg-indigo-500 text-white'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {tab === 'orchestration' ? 'Orchestration Flow' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Agents Grid */}
                {activeTab === 'agents' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {agents.map((agent, i) => (
                            <motion.div
                                key={agent.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="card p-5 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border"
                                            style={{ background: `${agent.color}18`, borderColor: `${agent.color}30` }}
                                        >
                                            {agent.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                                            <span className="text-[10px] text-slate-500">{agent.type}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`status-dot ${agent.status === 'active' ? 'online' : 'offline'}`} />
                                        <button className="text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                                            <MoreVertical size={14} />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{agent.description}</p>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-white/[0.02] rounded-lg p-2.5 border border-white/[0.04]">
                                        <p className="text-[10px] text-slate-600">Tasks Completed</p>
                                        <p className="text-sm font-bold text-white">{agent.tasks}</p>
                                    </div>
                                    <div className="bg-white/[0.02] rounded-lg p-2.5 border border-white/[0.04]">
                                        <p className="text-[10px] text-slate-600">Success Rate</p>
                                        <p className="text-sm font-bold" style={{ color: agent.color }}>{agent.successRate}%</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                        <Cpu size={9} />
                                        <span>{agent.model}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                                            <Settings size={13} />
                                        </button>
                                        <button
                                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                                            style={{
                                                background: agent.status === 'active' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                                                color: agent.status === 'active' ? '#f87171' : '#34d399',
                                            }}
                                        >
                                            {agent.status === 'active' ? <><Pause size={10} /> Pause</> : <><Play size={10} /> Start</>}
                                        </button>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="mt-3 progress-bar">
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: `${agent.successRate}%`, background: `linear-gradient(90deg, ${agent.color}, ${agent.color}80)` }}
                                    />
                                </div>
                            </motion.div>
                        ))}

                        {/* Add Agent Card */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setActiveTab('create')}
                            className="card p-5 flex flex-col items-center justify-center gap-3 border-dashed border-indigo-500/30 hover:border-indigo-500/60 text-center min-h-48 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
                                <Plus size={20} className="text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-300">Create New Agent</p>
                                <p className="text-xs text-slate-600 mt-1">Configure a custom AI agent</p>
                            </div>
                        </motion.button>
                    </div>
                )}

                {/* Orchestration Flow */}
                {activeTab === 'orchestration' && (
                    <div className="rounded-2xl overflow-hidden border border-white/[0.08]" style={{ height: 500 }}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            fitView
                        >
                            <Background color="#1a2744" gap={20} />
                            <Controls />
                            <MiniMap nodeColor={() => '#4f46e5'} maskColor="rgba(2,4,8,0.8)" />
                        </ReactFlow>
                    </div>
                )}

                {/* Create Agent */}
                {activeTab === 'create' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl space-y-6"
                    >
                        <div className="card p-6">
                            <h3 className="text-sm font-semibold text-white mb-5">Create New Agent</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-400 mb-2 block">Agent Name</label>
                                    <input
                                        value={newAgent.name}
                                        onChange={e => setNewAgent({ ...newAgent, name: e.target.value })}
                                        placeholder="e.g., InventoryWatcher"
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-400 mb-2 block">Agent Type</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {AGENT_TYPES.map(at => (
                                            <button
                                                key={at.type}
                                                onClick={() => setNewAgent({ ...newAgent, type: at.type })}
                                                className={`p-3 rounded-xl border text-center transition-all ${newAgent.type === at.type
                                                    ? 'border-indigo-500/60 bg-indigo-500/10'
                                                    : 'border-white/[0.06] hover:border-white/10 bg-white/[0.02]'
                                                    }`}
                                            >
                                                <div className="text-xl mb-1">{at.icon}</div>
                                                <div className="text-[10px] font-medium text-slate-300">{at.type}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-400 mb-2 block">AI Model</label>
                                    <select
                                        value={newAgent.model}
                                        onChange={e => setNewAgent({ ...newAgent, model: e.target.value })}
                                        className="input-field"
                                    >
                                        {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-slate-400 mb-2 block">System Instructions</label>
                                    <textarea
                                        value={newAgent.instructions}
                                        onChange={e => setNewAgent({ ...newAgent, instructions: e.target.value })}
                                        rows={4}
                                        placeholder="Describe what this agent should do, its expertise, constraints, and output format..."
                                        className="input-field resize-none"
                                    />
                                </div>

                                <button className="btn-primary w-full flex items-center justify-center gap-2">
                                    <Bot size={14} /> Create Agent
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
