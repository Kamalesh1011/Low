import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Code2, Play, Save, Download, Copy, Zap, Bot,
    CheckCircle2, AlertCircle, Plus, Terminal, RefreshCw,
    Globe, Lock, ArrowRight, ChevronDown
} from 'lucide-react';
import Header from '../components/Header';

const ENDPOINTS = [
    { method: 'GET', path: '/api/v1/products', desc: 'List all products with pagination', status: 200, authed: true, time: '42ms' },
    { method: 'POST', path: '/api/v1/products', desc: 'Create a new product', status: 201, authed: true, time: '85ms' },
    { method: 'GET', path: '/api/v1/products/{id}', desc: 'Get product by ID', status: 200, authed: true, time: '28ms' },
    { method: 'PUT', path: '/api/v1/products/{id}', desc: 'Update product', status: 200, authed: true, time: '67ms' },
    { method: 'DELETE', path: '/api/v1/products/{id}', desc: 'Delete product', status: 204, authed: true, time: '35ms' },
    { method: 'GET', path: '/api/v1/invoices', desc: 'List GST invoices', status: 200, authed: true, time: '95ms' },
    { method: 'POST', path: '/api/v1/invoices/generate', desc: 'Generate GST invoice PDF', status: 200, authed: true, time: '320ms' },
    { method: 'GET', path: '/api/v1/gst/returns', desc: 'Get GST return summary', status: 200, authed: true, time: '140ms' },
    { method: 'POST', path: '/api/v1/auth/login', desc: 'User authentication', status: 200, authed: false, time: '120ms' },
    { method: 'GET', path: '/api/v1/analytics/summary', desc: 'Business analytics summary', status: 200, authed: true, time: '180ms' },
];

const METHOD_COLORS = {
    GET: '#10b981',
    POST: '#6366f1',
    PUT: '#f59e0b',
    DELETE: '#ef4444',
    PATCH: '#ec4899',
};

const SAMPLE_RESPONSE = `{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_01HXYZ",
        "sku": "TEX-001",
        "name": "Premium Cotton Fabric",
        "price": 250.00,
        "gst_rate": 5.0,
        "stock": 500,
        "category": "Textiles",
        "tenant_id": "ten_01HXYZ",
        "created_at": "2026-02-25T18:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 5432,
      "total_pages": 272
    }
  },
  "meta": {
    "request_id": "req_01HY",
    "response_time_ms": 42
  }
}`;

export default function APIStudio() {
    const [selected, setSelected] = useState(ENDPOINTS[0]);
    const [activeTab, setActiveTab] = useState('response');
    const [testBody, setTestBody] = useState('{\n  "name": "New Product",\n  "price": 1500,\n  "gst_rate": 18\n}');
    const [generating, setGenerating] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');

    const handleGenerate = async () => {
        if (!aiPrompt.trim()) return;
        setGenerating(true);
        await new Promise(r => setTimeout(r, 1500));
        setGenerating(false);
        setAiPrompt('');
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <Header title="API Studio" subtitle="AI-generated OpenAPI-compliant REST APIs with live testing" />

            <div className="p-6 space-y-6">
                {/* AI API Generator */}
                <div className="card p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10">
                            <Bot size={16} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">AI API Generator</h3>
                            <p className="text-xs text-slate-500">Describe your API in plain English — get OpenAPI 3.0 spec + FastAPI code instantly</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <input
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                            placeholder='e.g., "Create a REST API for multi-tenant GST invoice management with authentication"'
                            className="input-field flex-1"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={generating || !aiPrompt}
                            className="btn-primary flex items-center gap-2 text-sm px-5 flex-shrink-0"
                        >
                            {generating ? (
                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
                            ) : (
                                <><Zap size={14} /> Generate API</>
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Endpoint List */}
                    <div className="lg:col-span-2 card overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                            <span className="text-xs font-semibold text-slate-400">Endpoints ({ENDPOINTS.length})</span>
                            <button className="text-indigo-400 hover:text-indigo-300">
                                <Plus size={14} />
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-96">
                            {ENDPOINTS.map((ep, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelected(ep)}
                                    className={`w-full flex items-start gap-3 px-4 py-3 border-b border-white/[0.04] text-left hover:bg-white/[0.03] transition-all ${selected.path === ep.path && selected.method === ep.method ? 'bg-indigo-500/10' : ''}`}
                                >
                                    <span
                                        className="text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0 font-mono mt-0.5"
                                        style={{ background: `${METHOD_COLORS[ep.method]}20`, color: METHOD_COLORS[ep.method] }}
                                    >
                                        {ep.method}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-xs font-mono text-slate-300 truncate">{ep.path}</p>
                                        <p className="text-[10px] text-slate-600 truncate">{ep.desc}</p>
                                    </div>
                                    {ep.authed && <Lock size={10} className="text-slate-600 mt-1 flex-shrink-0" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* API Tester */}
                    <div className="lg:col-span-3 card overflow-hidden">
                        {selected && (
                            <>
                                <div className="px-5 py-4 border-b border-white/[0.06]">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold px-2.5 py-0.5 rounded font-mono" style={{ background: `${METHOD_COLORS[selected.method]}20`, color: METHOD_COLORS[selected.method] }}>
                                                {selected.method}
                                            </span>
                                            <span className="text-sm font-mono text-slate-300">{selected.path}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {selected.authed && (
                                                <span className="flex items-center gap-1 text-[10px] text-amber-400">
                                                    <Lock size={9} /> Auth Required
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500">{selected.desc}</p>
                                </div>

                                {/* Request Body */}
                                {['POST', 'PUT', 'PATCH'].includes(selected.method) && (
                                    <div className="px-5 py-4 border-b border-white/[0.06]">
                                        <p className="text-xs font-semibold text-slate-400 mb-2">Request Body</p>
                                        <textarea
                                            value={testBody}
                                            onChange={e => setTestBody(e.target.value)}
                                            rows={5}
                                            className="w-full bg-[#020408] border border-white/[0.08] rounded-lg p-3 text-xs font-mono text-slate-300 resize-none outline-none focus:border-indigo-500/50"
                                        />
                                    </div>
                                )}

                                {/* Send Button */}
                                <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button className="btn-primary flex items-center gap-2 text-xs py-2">
                                            <Play size={12} /> Send Request
                                        </button>
                                        <button className="btn-ghost text-xs">
                                            <RefreshCw size={12} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs">
                                        <span className="text-emerald-400 font-medium">● {selected.status}</span>
                                        <span className="text-slate-500">{selected.time}</span>
                                    </div>
                                </div>

                                {/* Response Tabs */}
                                <div className="flex border-b border-white/[0.06]">
                                    {['response', 'schema', 'code'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-4 py-2 text-xs capitalize border-b-2 transition-all ${activeTab === tab ? 'text-indigo-400 border-indigo-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Response Body */}
                                <div className="overflow-x-auto max-h-64">
                                    {activeTab === 'response' && (
                                        <pre className="p-4 text-[11px] font-mono text-slate-300 leading-relaxed">
                                            {SAMPLE_RESPONSE.split('\n').map((line, i) => {
                                                let color = '#94a3b8';
                                                if (line.includes('"') && line.includes(':')) color = '#22d3ee';
                                                if (line.match(/:\s*"[^"]+"/)) { }
                                                return <div key={i} style={{ color }}>{line}</div>;
                                            })}
                                        </pre>
                                    )}
                                    {activeTab === 'schema' && (
                                        <div className="p-4 text-xs text-slate-400">
                                            <p className="font-semibold text-slate-300 mb-2">Response Schema (JSON Schema)</p>
                                            <div className="code-block text-[11px]">
                                                <span className="text-indigo-400">openapi</span>: <span className="text-green-400">'3.0.0'</span><br />
                                                <span className="text-indigo-400">paths</span>:<br />
                                                {'  '}<span className="text-cyan-400">{selected.path}</span>:<br />
                                                {'    '}<span className="text-pink-400">{selected.method.toLowerCase()}</span>:<br />
                                                {'      '}<span className="text-amber-400">summary</span>: {selected.desc}<br />
                                                {'      '}<span className="text-amber-400">responses</span>:<br />
                                                {'        '}<span className="text-green-400">'200'</span>: description: Success
                                            </div>
                                        </div>
                                    )}
                                    {activeTab === 'code' && (
                                        <div className="p-4">
                                            <div className="code-block text-[11px]">
                                                <span className="text-slate-500"># Python (requests)</span><br />
                                                <span className="text-pink-400">import</span> <span className="text-cyan-400">requests</span><br /><br />
                                                <span className="text-green-400">url</span> = <span className="text-amber-400">"https://api.omniforge.ai{selected.path}"</span><br />
                                                <span className="text-green-400">headers</span> = {'{'}<span className="text-amber-400">"Authorization"</span>: <span className="text-amber-400">"Bearer YOUR_TOKEN"</span>{'}'}<br /><br />
                                                <span className="text-green-400">resp</span> = requests.<span className="text-cyan-400">{selected.method.toLowerCase()}</span>(url, headers=headers)<br />
                                                <span className="text-cyan-400">print</span>(resp.json())
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
