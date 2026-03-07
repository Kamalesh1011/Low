import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Database, Plus, Table, Key, Link, Edit3, Trash2, Eye,
    Download, Upload, Zap, Code2, CheckCircle2, ChevronRight,
    GitBranch, Sparkles, MoreVertical, Search
} from 'lucide-react';
import Header from '../components/Header';

const SAMPLE_TABLES = [
    {
        name: 'users',
        color: '#6366f1',
        rowCount: '12,845',
        columns: [
            { name: 'id', type: 'UUID', pk: true, nullable: false },
            { name: 'email', type: 'VARCHAR(255)', pk: false, nullable: false, unique: true },
            { name: 'name', type: 'VARCHAR(100)', pk: false, nullable: false },
            { name: 'role', type: 'ENUM(admin,user,viewer)', pk: false, nullable: false },
            { name: 'tenant_id', type: 'UUID', pk: false, nullable: false, fk: 'tenants.id' },
            { name: 'created_at', type: 'TIMESTAMP', pk: false, nullable: false },
            { name: 'is_active', type: 'BOOLEAN', pk: false, nullable: false },
        ]
    },
    {
        name: 'products',
        color: '#06b6d4',
        rowCount: '5,432',
        columns: [
            { name: 'id', type: 'UUID', pk: true, nullable: false },
            { name: 'sku', type: 'VARCHAR(50)', pk: false, nullable: false, unique: true },
            { name: 'name', type: 'VARCHAR(200)', pk: false, nullable: false },
            { name: 'price', type: 'DECIMAL(10,2)', pk: false, nullable: false },
            { name: 'gst_rate', type: 'DECIMAL(4,2)', pk: false, nullable: true },
            { name: 'stock', type: 'INTEGER', pk: false, nullable: false },
            { name: 'category_id', type: 'UUID', pk: false, nullable: true, fk: 'categories.id' },
            { name: 'tenant_id', type: 'UUID', pk: false, nullable: false, fk: 'tenants.id' },
        ]
    },
    {
        name: 'invoices',
        color: '#10b981',
        rowCount: '89,124',
        columns: [
            { name: 'id', type: 'UUID', pk: true, nullable: false },
            { name: 'invoice_number', type: 'VARCHAR(30)', pk: false, nullable: false, unique: true },
            { name: 'customer_id', type: 'UUID', pk: false, nullable: false, fk: 'customers.id' },
            { name: 'total_amount', type: 'DECIMAL(14,2)', pk: false, nullable: false },
            { name: 'gst_amount', type: 'DECIMAL(12,2)', pk: false, nullable: false },
            { name: 'status', type: "ENUM('draft','sent','paid','overdue')", pk: false, nullable: false },
            { name: 'due_date', type: 'DATE', pk: false, nullable: true },
            { name: 'created_at', type: 'TIMESTAMP', pk: false, nullable: false },
        ]
    },
    {
        name: 'agents',
        color: '#8b5cf6',
        rowCount: '42',
        columns: [
            { name: 'id', type: 'UUID', pk: true, nullable: false },
            { name: 'name', type: 'VARCHAR(100)', pk: false, nullable: false },
            { name: 'type', type: 'VARCHAR(50)', pk: false, nullable: false },
            { name: 'model', type: 'VARCHAR(100)', pk: false, nullable: false },
            { name: 'config', type: 'JSONB', pk: false, nullable: true },
            { name: 'is_active', type: 'BOOLEAN', pk: false, nullable: false },
        ]
    },
];

const TypePill = ({ type }) => {
    let color = '#475569';
    if (type.includes('UUID')) color = '#6366f1';
    else if (type.includes('VARCHAR') || type.includes('TEXT')) color = '#06b6d4';
    else if (type.includes('INTEGER') || type.includes('DECIMAL') || type.includes('FLOAT')) color = '#10b981';
    else if (type.includes('BOOLEAN')) color = '#f59e0b';
    else if (type.includes('TIMESTAMP') || type.includes('DATE')) color = '#ec4899';
    else if (type.includes('JSONB') || type.includes('JSON')) color = '#8b5cf6';
    else if (type.includes('ENUM')) color = '#f97316';

    return (
        <span
            className="text-[10px] font-mono px-2 py-0.5 rounded"
            style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
        >
            {type.length > 22 ? type.slice(0, 22) + '…' : type}
        </span>
    );
};

export default function SchemaDesigner() {
    const [selectedTable, setSelectedTable] = useState(SAMPLE_TABLES[0]);
    const [aiPrompt, setAiPrompt] = useState('');
    const [generating, setGenerating] = useState(false);

    const handleGenerateSchema = async () => {
        if (!aiPrompt.trim()) return;
        setGenerating(true);
        await new Promise(r => setTimeout(r, 2000));
        setGenerating(false);
        setAiPrompt('');
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <Header title="Schema Designer" subtitle="AI-generated database schemas, migrations, and visual ERD" />

            <div className="p-6 space-y-6">
                {/* AI Schema Generator */}
                <div className="card p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10">
                            <Sparkles size={16} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">AI Schema Generator</h3>
                            <p className="text-xs text-slate-500">Describe your data model and AI generates optimized PostgreSQL schema</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <input
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                            placeholder='e.g., "Multi-tenant GST billing with products, invoices, customers, and line items"'
                            className="input-field flex-1"
                        />
                        <button
                            onClick={handleGenerateSchema}
                            disabled={generating || !aiPrompt}
                            className="btn-primary flex items-center gap-2 text-sm px-5 flex-shrink-0"
                        >
                            {generating ? (
                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
                            ) : (
                                <><Zap size={14} /> Generate</>
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Table List */}
                    <div className="card p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-400">Tables ({SAMPLE_TABLES.length})</span>
                            <button className="p-1 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                                <Plus size={13} />
                            </button>
                        </div>
                        <div className="space-y-1">
                            {SAMPLE_TABLES.map(t => (
                                <button
                                    key={t.name}
                                    onClick={() => setSelectedTable(t)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${selectedTable?.name === t.name
                                            ? 'bg-indigo-500/15 border border-indigo-500/30'
                                            : 'hover:bg-white/[0.03]'
                                        }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2 h-2 rounded-sm" style={{ background: t.color }} />
                                        <span className="text-xs font-mono" style={{ color: selectedTable?.name === t.name ? '#818cf8' : '#94a3b8' }}>
                                            {t.name}
                                        </span>
                                    </div>
                                    <span className="text-[9px] text-slate-600">{t.columns.length} cols</span>
                                </button>
                            ))}
                        </div>
                        <button className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-indigo-500/30 text-[11px] text-indigo-400 hover:bg-indigo-500/5 transition-all">
                            <Plus size={11} /> Add Table
                        </button>
                    </div>

                    {/* Column Details */}
                    <div className="lg:col-span-3 card p-5">
                        {selectedTable && (
                            <>
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ background: `${selectedTable.color}20` }}
                                        >
                                            <Table size={14} style={{ color: selectedTable.color }} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white font-mono">{selectedTable.name}</h3>
                                            <span className="text-[10px] text-slate-500">{selectedTable.rowCount} rows</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="btn-ghost text-xs flex items-center gap-1.5">
                                            <Code2 size={12} /> View SQL
                                        </button>
                                        <button className="btn-ghost text-xs flex items-center gap-1.5">
                                            <Download size={12} /> Export
                                        </button>
                                        <button className="btn-primary text-xs flex items-center gap-1.5">
                                            <Plus size={12} /> Add Column
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/[0.06]">
                                                {['Column', 'Type', 'Constraints', 'Foreign Key', 'Actions'].map(h => (
                                                    <th key={h} className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider pb-3 pr-4">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedTable.columns.map((col, i) => (
                                                <motion.tr
                                                    key={col.name}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.04 }}
                                                    className="border-b border-white/[0.03] hover:bg-white/[0.02] group"
                                                >
                                                    <td className="py-3 pr-4">
                                                        <div className="flex items-center gap-2">
                                                            {col.pk && <Key size={10} className="text-amber-400" />}
                                                            <span className="text-xs font-mono text-slate-200">{col.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        <TypePill type={col.type} />
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        <div className="flex items-center gap-1">
                                                            {col.pk && <span className="tag tag-warning text-[9px] py-0">PK</span>}
                                                            {col.unique && <span className="tag tag-primary text-[9px] py-0">UNIQUE</span>}
                                                            {!col.nullable && !col.pk && <span className="tag tag-cyber text-[9px] py-0">NOT NULL</span>}
                                                            {col.nullable && <span className="tag text-[9px] py-0 bg-slate-700/50 text-slate-500 border-slate-600/30">NULL</span>}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        {col.fk ? (
                                                            <div className="flex items-center gap-1 text-indigo-400 text-[10px]">
                                                                <Link size={9} />
                                                                <span className="font-mono">{col.fk}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-700 text-[10px]">—</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button className="p-1 text-slate-600 hover:text-indigo-400 transition-colors">
                                                                <Edit3 size={12} />
                                                            </button>
                                                            <button className="p-1 text-slate-600 hover:text-red-400 transition-colors">
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Generated SQL */}
                                <div className="mt-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-slate-500">Generated Migration SQL</span>
                                        <button className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                            <Download size={10} /> Export Migration
                                        </button>
                                    </div>
                                    <div className="code-block text-[11px]">
                                        <span className="text-pink-400">CREATE TABLE</span>{' '}
                                        <span className="text-cyan-400">{selectedTable.name}</span> (<br />
                                        {selectedTable.columns.map((col, i) => (
                                            <span key={col.name} className="block ml-4">
                                                <span className="text-green-400">{col.name}</span>{' '}
                                                <span className="text-amber-400">{col.type}</span>
                                                {col.pk && <span className="text-pink-400"> PRIMARY KEY</span>}
                                                {!col.nullable && <span className="text-blue-400"> NOT NULL</span>}
                                                {col.unique && <span className="text-blue-400"> UNIQUE</span>}
                                                {col.fk && <span className="text-slate-500"> REFERENCES {col.fk}</span>}
                                                {i < selectedTable.columns.length - 1 ? ',' : ''}
                                            </span>
                                        ))}
                                        );
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
