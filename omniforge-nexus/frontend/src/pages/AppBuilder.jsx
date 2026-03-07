import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Plus, Eye, Settings, Monitor, Smartphone, Layers, Code2,
    Sparkles, Package, Layout, Zap, ExternalLink, Trash2,
    Type, Image as ImageIcon, Hash, ArrowUpRight, Activity,
    CreditCard, Menu, PanelLeft, CheckSquare, Circle, ClipboardList,
    BarChart, Table as TableIcon, Grid as GridIcon, Tag, Minus,
    Calendar, Bell, Search, User, LogOut, ChevronRight,
    Play, Pause, Download, Share2, Filter, MoreHorizontal
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import useStore from '../store/useStore';

const COMPONENTS = [
    // ── Layout ──────────────────────────────────────────────
    { type: 'Container', icon: Layout, label: 'Container', category: 'Layout', color: '#6366f1', defaultProps: { background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' } },
    { type: 'Grid', icon: GridIcon, label: 'Grid', category: 'Layout', color: '#8b5cf6', defaultProps: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', width: '100%' } },
    { type: 'Card', icon: CreditCard, label: 'Card', category: 'Layout', color: '#ec4899', defaultProps: { background: '#18181b', padding: '20px', borderRadius: '16px', border: '1px solid #27272a', width: '100%', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } },
    { type: 'Form', icon: ClipboardList, label: 'Form', category: 'Layout', color: '#f59e0b', defaultProps: { display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', padding: '20px' } },
    { type: 'Hero', icon: Sparkles, label: 'Hero Section', category: 'Layout', color: '#f59e0b', defaultProps: { padding: '80px 40px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '24px', textAlign: 'center', width: '100%', marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } },

    // ── UI Elements ─────────────────────────────────────────
    { type: 'Text', icon: Type, label: 'Text', category: 'UI', color: '#06b6d4', defaultProps: { content: 'Heading Text', fontSize: '24px', color: '#ffffff', fontWeight: '700', marginBottom: '10px' } },
    { type: 'Paragraph', icon: AlignLeftIcon, label: 'Paragraph', category: 'UI', color: '#0ea5e9', defaultProps: { content: 'This is a real paragraph of text in your low-code app.', fontSize: '14px', color: '#a1a1aa', fontWeight: '400', marginBottom: '16px' } },
    { type: 'Button', icon: Package, label: 'Button', category: 'UI', color: '#10b981', defaultProps: { content: 'Click Me', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#ffffff', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', width: 'auto', border: 'none', cursor: 'pointer' } },
    { type: 'Input', icon: Hash, label: 'Input', category: 'UI', color: '#f59e0b', defaultProps: { placeholder: 'Type here...', padding: '12px 16px', border: '1px solid #3f3f46', borderRadius: '8px', background: '#18181b', color: '#fff', width: '100%', marginBottom: '10px' } },
    { type: 'Image', icon: ImageIcon, label: 'Image', category: 'UI', color: '#ec4899', defaultProps: { src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&q=80', width: '100%', height: '200px', borderRadius: '14px', objectFit: 'cover', marginBottom: '16px' } },
    { type: 'Badge', icon: Tag, label: 'Badge', category: 'UI', color: '#10b981', defaultProps: { content: 'New', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '800', width: 'fit-content' } },
    { type: 'Divider', icon: Minus, label: 'Divider', category: 'UI', color: '#71717a', defaultProps: { height: '1px', background: 'rgba(255,255,255,0.1)', width: '100%', margin: '20px 0' } },
    { type: 'Checkbox', icon: CheckSquare, label: 'Checkbox', category: 'UI', color: '#6366f1', defaultProps: { checked: true, label: 'Agree to terms', color: '#6366f1' } },

    // ── Advanced ────────────────────────────────────────────
    { type: 'Navbar', icon: Menu, label: 'Navbar', category: 'Advanced', color: '#f97316', defaultProps: { background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '15px 25px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
    { type: 'Sidebar', icon: PanelLeft, label: 'Sidebar', category: 'Advanced', color: '#3b82f6', defaultProps: { background: '#09090b', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '20px', width: '240px', height: '100vh' } },
    { type: 'Chart', icon: BarChart, label: 'Chart', category: 'Advanced', color: '#8b5cf6', defaultProps: { type: 'bar', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '20px', height: '250px' } },
    { type: 'Table', icon: TableIcon, label: 'Table', category: 'Advanced', color: '#10b981', defaultProps: { background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', columns: 3, rows: 4, width: '100%' } },
    { type: 'Footer', icon: Minus, label: 'Footer', category: 'Advanced', color: '#71717a', defaultProps: { background: '#09090b', padding: '40px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', width: '100%', marginTop: 'auto', display: 'flex', justifyContent: 'space-between' } },
];

function AlignLeftIcon(props) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"></line><line x1="15" y1="12" x2="3" y2="12"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>;
}

const PREVIEW_SCREENS = [
    { label: 'Desktop', icon: Monitor, width: '100%' },
    { label: 'Tablet', icon: Layers, width: '768px' },
    { label: 'Mobile', icon: Smartphone, width: '375px' },
];

export default function AppBuilder() {
    const { builtProjects: generatedApps = [] } = useStore();
    const [activeView, setActiveView] = useState('canvas');
    const [screen, setScreen] = useState('Desktop');
    const [aiDesc, setAiDesc] = useState('');
    const [codeTab, setCodeTab] = useState('frontend');
    const [dragOver, setDragOver] = useState(false);

    // Low-Code Builder State
    const [components, setComponents] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [draggedType, setDraggedType] = useState(null);

    const handleDragStart = (e, type) => {
        setDraggedType(type);
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (!draggedType) return;

        const compDef = COMPONENTS.find(c => c.type === draggedType);
        if (compDef) {
            const newComp = {
                id: `comp_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                type: compDef.type,
                props: { ...compDef.defaultProps }
            };
            setComponents([...components, newComp]);
            setSelectedId(newComp.id);
        }
        setDraggedType(null);
    };

    const updateComponent = (id, key, value) => {
        setComponents(components.map(c =>
            c.id === id ? { ...c, props: { ...c.props, [key]: value } } : c
        ));
    };

    const deleteComponent = (id) => {
        setComponents(components.filter(c => c.id !== id));
        if (selectedId === id) setSelectedId(null);
    };

    const generateBackendCode = () => {
        return `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Generated API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    name: str

@app.get("/")
def read_root():
    return {"message": "Welcome to your generated backend API!"}

@app.get("/api/data")
def get_data():
    return {"status": "success", "items": [{"id": 1, "name": "Test Item"}]}

@app.post("/api/data")
def create_data(item: Item):
    return {"status": "created", "data": item.model_dump()}
`;
    };

    const downloadFullStack = async () => {
        const loadToast = toast.loading('Bundling React + FastAPI App...');
        try {
            const payload = {
                project_name: "omniforge_generated_app",
                files: {
                    "frontend/src/App.jsx": generateCode(),
                    "frontend/package.json": `{
  "name": "frontend",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`,
                    "backend/main.py": generateBackendCode(),
                    "backend/requirements.txt": "fastapi\\nuvicorn\\npydantic\\n"
                }
            };

            const response = await fetch('/api/v1/builds/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "omniforge_fullstack_app.zip";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            toast.success('Downloaded Full Stack Source Code!', { id: loadToast });
        } catch (e) {
            console.error(e);
            toast.error('Failed to download', { id: loadToast });
        }
    };

    const generateCode = () => {
        let jsx = `import React from 'react';\n\nexport default function MyGeneratedApp() {\n  return (\n    <div className="app-canvas" style={{ minHeight: '100vh', background: '#0a0a0a', padding: '24px', fontFamily: 'sans-serif', color: '#fff' }}>\n      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>\n`;
        components.forEach(c => {
            const p = c.props;
            let styleStr = Object.keys(p)
                .filter(k => !['content', 'src', 'placeholder', 'label', 'checked', 'columns', 'rows'].includes(k))
                .map(k => `${k}: '${p[k]}'`)
                .join(', ');

            if (c.type === 'Container' || c.type === 'Card' || c.type === 'Grid' || c.type === 'Hero' || c.type === 'Footer') {
                jsx += `        <div style={{ ${styleStr}, position: 'relative' }}>\n          {/* Children would go here */}\n          <div style={{ padding: '20px', textAlign: 'center', opacity: 0.3 }}>{/* ${c.type} Block */}</div>\n        </div>\n`;
            } else if (c.type === 'Text' || c.type === 'Paragraph') {
                jsx += `        <div style={{ ${styleStr} }}>${p.content}</div>\n`;
            } else if (c.type === 'Button') {
                jsx += `        <button style={{ ${styleStr}, cursor: 'pointer' }}>${p.content}</button>\n`;
            } else if (c.type === 'Input') {
                jsx += `        <input placeholder="${p.placeholder}" style={{ ${styleStr}, outline: 'none' }} />\n`;
            } else if (c.type === 'Image') {
                jsx += `        <img src="${p.src}" style={{ ${styleStr} }} alt="generated" />\n`;
            } else if (c.type === 'Badge') {
                jsx += `        <span style={{ ${styleStr} }}>${p.content}</span>\n`;
            } else if (c.type === 'Navbar') {
                jsx += `        <nav style={{ ${styleStr} }}>{/* Navbar Content */}</nav>\n`;
            } else if (c.type === 'Chart') {
                jsx += `        <div style={{ ${styleStr} }}>{/* Chart Visualization */}</div>\n`;
            } else if (c.type === 'Table') {
                jsx += `        <div style={{ ${styleStr} }}>{/* Table Grid Component */}</div>\n`;
            } else if (c.type === 'Checkbox') {
                jsx += `        <div style={{ ${styleStr}, display: 'flex', alignItems: 'center', gap: '8px' }}>\n          <input type="checkbox" checked={${p.checked}} readOnly />\n          <label>${p.label}</label>\n        </div>\n`;
            }
        });
        jsx += `      </div>\n    </div>\n  );\n}\n`;
        return jsx;
    };

    const RenderComponent = ({ comp, isPreview }) => {
        const p = comp.props;
        const style = {};
        Object.keys(p).forEach(k => {
            if (!['content', 'src', 'placeholder'].includes(k)) style[k] = p[k];
        });

        let el = null;
        if (['Container', 'Card', 'Grid', 'Hero', 'Footer', 'Form'].includes(comp.type)) {
            el = (
                <div style={{ minHeight: 40, ...style, position: 'relative' }}>
                    {comp.type === 'Hero' && (
                        <div style={{ padding: '0 0 20px' }}>
                            <div style={{ fontSize: 42, fontWeight: 900, color: 'white', marginBottom: 15 }}>Ignite Your Vision</div>
                            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto 30px' }}>The worlds most powerful AI-native platform for MSMEs. Build, deploy, and scale in seconds.</div>
                            <div style={{ display: 'flex', gap: 15, justifyContent: 'center' }}>
                                <div style={{ padding: '12px 24px', background: 'white', color: 'black', borderRadius: 10, fontWeight: 700, fontSize: 14 }}>Get Started</div>
                                <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.08)', color: 'white', borderRadius: 10, fontWeight: 700, fontSize: 14, border: '1px solid rgba(255,255,255,0.1)' }}>Watch Demo</div>
                            </div>
                        </div>
                    )}
                    {comp.type === 'Footer' && (
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', opacity: 0.8 }}>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 800, color: 'white', marginBottom: 10 }}>OmniForge Nexus</div>
                                <div style={{ fontSize: 11, color: '#71717a' }}>© 2026 Quantum MSME Solutions</div>
                            </div>
                            <div style={{ display: 'flex', gap: 30 }}>
                                {['Product', 'Resources', 'Company'].map(group => (
                                    <div key={group}>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: 'white', marginBottom: 8, textTransform: 'uppercase' }}>{group}</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                            {[1, 2].map(i => <div key={i} style={{ fontSize: 11, color: '#71717a' }}>Link {i}</div>)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {components.filter(c => c.parentId === comp.id).map(child => (
                        <RenderComponent key={child.id} comp={child} isPreview={isPreview} />
                    ))}
                    {!isPreview && components.filter(c => c.parentId === comp.id).length === 0 && !['Hero', 'Footer'].includes(comp.type) && (
                        <div className="flex items-center justify-center h-20 border border-white/5 bg-white/5 rounded-lg border-dashed">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">{comp.type} Dropzone</span>
                        </div>
                    )}
                </div>
            );
        } else if (comp.type === 'Text' || comp.type === 'Paragraph') {
            el = <div style={style}>{p.content}</div>;
        } else if (comp.type === 'Button') {
            el = <button style={{ ...style, cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.content}</button>;
        } else if (comp.type === 'Input') {
            el = <input placeholder={p.placeholder} style={{ ...style, outline: 'none', appearance: 'none' }} disabled={!isPreview} />;
        } else if (comp.type === 'Image') {
            el = <img src={p.src} style={{ ...style, display: 'block' }} alt="content" />;
        } else if (comp.type === 'Badge') {
            el = <span style={style}>{p.content}</span>;
        } else if (comp.type === 'Divider') {
            el = <div style={style}></div>;
        } else if (comp.type === 'Checkbox') {
            el = (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, ...style }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, background: p.checked ? p.color : 'transparent', border: `2px solid ${p.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {p.checked && <CheckSquare size={12} color="white" />}
                    </div>
                    <span style={{ fontSize: 13, color: 'inherit' }}>{p.label}</span>
                </div>
            );
        } else if (comp.type === 'Navbar') {
            el = (
                <div style={style}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 6, background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={12} color="white" /></div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>Nexus App</span>
                    </div>
                    <div style={{ display: 'flex', gap: 15 }}>
                        {['Features', 'Marketplace', 'Docs'].map(item => (
                            <span key={item} style={{ fontSize: 11, color: '#a1a1aa', fontWeight: 600 }}>{item}</span>
                        ))}
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                </div>
            );
        } else if (comp.type === 'Chart') {
            el = (
                <div style={style}>
                    <div style={{ display: 'flex', alignItems: 'end', gap: 8, height: '100%', padding: '20px 0' }}>
                        {[60, 40, 90, 70, 50, 85].map((h, i) => (
                            <div key={i} style={{ flex: 1, height: `${h}%`, background: 'rgba(99,102,241,0.6)', borderRadius: '4px 4px 0 0' }}></div>
                        ))}
                    </div>
                </div>
            );
        } else if (comp.type === 'Table') {
            el = (
                <div style={style}>
                    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 10, marginBottom: 10 }}>
                        {[1, 2, 3].map(i => <div key={i} style={{ flex: 1, fontSize: 11, fontWeight: 700, color: '#a1a1aa' }}>Header {i}</div>)}
                    </div>
                    {[1, 2, 3].map(row => (
                        <div key={row} style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            {[1, 2, 3].map(col => <div key={col} style={{ flex: 1, fontSize: 11, color: 'white' }}>Data {row}-{col}</div>)}
                        </div>
                    ))}
                </div>
            );
        }

        if (isPreview) return <div style={{ display: 'flex', flexDirection: 'column' }}>{el}</div>;

        const isSelected = selectedId === comp.id;
        return (
            <div
                onClick={(e) => { e.stopPropagation(); setSelectedId(comp.id); }}
                style={{
                    position: 'relative',
                    marginBottom: 10,
                    outline: isSelected ? '2px solid #6366f1' : '1px dashed transparent',
                    outlineOffset: Math.random() > 0.5 ? 2 : 2, // Force re-render slightly
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    opacity: 1
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.outline = '1px dashed rgba(255,255,255,0.3)'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.outline = '1px dashed transparent'; }}
            >
                {isSelected && (
                    <div style={{ position: 'absolute', top: -20, left: 0, background: '#6366f1', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'center', gap: 6, zIndex: 10 }}>
                        <span>{comp.type}</span>
                        <Trash2 size={10} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); deleteComponent(comp.id); }} />
                    </div>
                )}
                {el}
            </div>
        );
    };

    const selectedComponent = components.find(c => c.id === selectedId);

    // Exclude certain props from auto-generation in the property panel
    const propFields = selectedComponent ? Object.keys(selectedComponent.props) : [];

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header title="Nexus Low-Code Builder" subtitle="A real drag-and-drop workspace that creates actual React code" />

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Component Library */}
                <div className="w-56 flex-shrink-0 border-r border-white/[0.06] bg-[#060b14] overflow-y-auto">
                    <div className="p-4">
                        <div className="space-y-6">
                            {['Layout', 'UI', 'Advanced'].map(cat => (
                                <div key={cat}>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">{cat}</p>
                                    <div className="space-y-1.5">
                                        {COMPONENTS.filter(c => c.category === cat).map((comp) => (
                                            <motion.div
                                                key={comp.label}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, comp.type)}
                                                whileHover={{ x: 3, backgroundColor: 'rgba(255,255,255,0.06)' }}
                                                className="flex items-center gap-3 p-2.5 rounded-xl cursor-grab active:cursor-grabbing transition-all border border-transparent hover:border-white/[0.05]"
                                            >
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ background: `${comp.color}15`, boxShadow: `inset 0 0 0 1px ${comp.color}30` }}>
                                                    <comp.icon size={13} style={{ color: comp.color }} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-semibold text-slate-300">{comp.label}</div>
                                                </div>
                                                <div className="ml-auto opacity-30">
                                                    <Plus size={14} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* AI Generate Prompt Placeholder */}
                        <div className="mt-8 pt-6 border-t border-white/[0.06]">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">AI Generate</p>
                            <textarea
                                value={aiDesc}
                                onChange={e => setAiDesc(e.target.value)}
                                placeholder="Describe a section to auto-build..."
                                rows={2}
                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-2.5 text-xs text-slate-300 resize-none outline-none placeholder:text-slate-600 focus:border-indigo-500/50"
                            />
                            <button className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-500/15 text-indigo-400 text-xs font-semibold hover:bg-indigo-500/25 transition-all outline-none">
                                <Sparkles size={12} /> Auto Build Section
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Canvas */}
                <div className="flex-1 flex flex-col overflow-hidden bg-[#020408]">
                    {/* Canvas Toolbar */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-[#060b14]">
                        <div className="flex items-center gap-4">
                            {/* View Mode */}
                            <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/[0.06] rounded-xl">
                                {['canvas', 'code', 'preview'].map(v => (
                                    <button
                                        key={v}
                                        onClick={() => setActiveView(v)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all outline-none ${activeView === v ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>

                            {/* Screen Size */}
                            <div className="flex items-center gap-1 pl-4 border-l border-white/[0.06]">
                                {PREVIEW_SCREENS.map(s => (
                                    <button
                                        key={s.label}
                                        onClick={() => setScreen(s.label)}
                                        data-tooltip={s.label}
                                        className={`p-2 rounded-lg transition-all outline-none ${screen === s.label ? 'text-indigo-400 bg-indigo-500/15' : 'text-slate-600 hover:text-slate-300 hover:bg-white/[0.02]'}`}
                                    >
                                        <s.icon size={15} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-all outline-none flex items-center gap-2" onClick={() => setComponents([])}>
                                <Trash2 size={13} /> Clear
                            </button>
                            <button onClick={downloadFullStack} className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-white text-black hover:bg-slate-200 transition-all outline-none flex items-center gap-2">
                                <Zap size={13} /> Download Full Stack App
                            </button>
                        </div>
                    </div>

                    {/* Canvas Area */}
                    {activeView === 'canvas' && (
                        <div
                            className="flex-1 overflow-auto p-8 flex items-start justify-center"
                            onClick={() => setSelectedId(null)}
                        >
                            <div
                                className={`w-full transition-all duration-300 min-h-[500px] border-2 border-dashed ${dragOver ? 'border-indigo-500 bg-indigo-500/5 shadow-[0_0_30px_rgba(99,102,241,0.15)]' : 'border-white/[0.05] bg-black/20'} rounded-2xl p-6 relative`}
                                style={{ maxWidth: screen === 'Mobile' ? 375 : screen === 'Tablet' ? 768 : '100%', outline: '1px solid rgba(255,255,255,0.02)', outlineOffset: 12 }}
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                            >
                                {components.length === 0 ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40">
                                        <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 border border-indigo-500/30">
                                            <Plus size={24} className="text-indigo-400" />
                                        </div>
                                        <h3 className="text-sm font-bold text-white mb-1">REAL DRAG & DROP</h3>
                                        <p className="text-xs text-slate-400">Drag components from the left panel to build your app</p>
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-col">
                                        {components.map(comp => <RenderComponent key={comp.id} comp={comp} isPreview={false} />)}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeView === 'code' && (
                        <div className="flex-1 overflow-auto p-6 bg-[#0d1117]">
                            <div className="h-full rounded-xl border border-white/[0.08] overflow-hidden flex flex-col bg-[#010409]">
                                <div className="px-4 py-3 border-b border-white/[0.08] bg-[#0d1117] flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setCodeTab('frontend')} className={`flex items-center gap-2 text-xs font-mono transition-all outline-none ${codeTab === 'frontend' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
                                            <Code2 size={14} /> frontend/App.jsx
                                        </button>
                                        <div className="w-[1px] h-4 bg-white/[0.1]"></div>
                                        <button onClick={() => setCodeTab('backend')} className={`flex items-center gap-2 text-xs font-mono transition-all outline-none ${codeTab === 'backend' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}>
                                            <Code2 size={14} /> backend/main.py
                                        </button>
                                    </div>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Live Generated</span>
                                </div>
                                <pre className="p-6 text-[13px] leading-extralight font-mono text-slate-300 overflow-auto flex-1">
                                    <code>{codeTab === 'frontend' ? generateCode() : generateBackendCode()}</code>
                                </pre>
                            </div>
                        </div>
                    )}

                    {activeView === 'preview' && (
                        <div className="flex-1 flex items-start justify-center p-8 overflow-auto">
                            <div
                                className="bg-[#0a0a0a] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/[0.05] overflow-hidden"
                                style={{ width: screen === 'Mobile' ? 375 : screen === 'Tablet' ? 768 : '100%', minHeight: '600px', display: 'flex', flexDirection: 'column' }}
                            >
                                {/* Preview browser bar */}
                                <div className="h-10 bg-[#171717] border-b border-white/[0.05] flex items-center px-4 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                    </div>
                                    <div className="mx-auto bg-black/40 rounded-md px-24 py-1 text-[10px] text-slate-500 border border-white/[0.05] font-mono">
                                        localhost:3000
                                    </div>
                                </div>
                                <div className="p-6 flex-1 relative font-sans">
                                    {components.length === 0 && (
                                        <div className="text-center text-slate-500 mt-20 text-sm">Nothing to preview yet. Add some components!</div>
                                    )}
                                    <div className="flex flex-col">
                                        {components.map(comp => <RenderComponent key={comp.id} comp={comp} isPreview={true} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel - Properties */}
                <div className="w-64 flex-shrink-0 border-l border-white/[0.06] bg-[#060b14] p-4 overflow-y-auto">
                    {selectedId && selectedComponent ? (
                        <>
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/[0.06]">
                                <Settings size={14} className="text-indigo-400" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Properties</span>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg py-2 px-3 text-xs text-indigo-300 font-semibold mb-4 text-center">
                                    {selectedComponent.type} Element
                                </div>

                                {propFields.map(key => (
                                    <div key={key}>
                                        <label className="text-[10px] text-slate-400 font-medium block mb-1.5 font-mono capitalize tracking-wide">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                        {key === 'content' || key === 'src' ? (
                                            <textarea
                                                value={selectedComponent.props[key]}
                                                onChange={(e) => updateComponent(selectedId, key, e.target.value)}
                                                className="w-full bg-black/40 border border-white/[0.1] rounded-lg px-2.5 py-2 text-[12px] text-white outline-none focus:border-indigo-500 transition-all font-sans resize-none"
                                                rows={2}
                                            />
                                        ) : (
                                            <div className="relative">
                                                <input
                                                    value={selectedComponent.props[key]}
                                                    onChange={(e) => updateComponent(selectedId, key, e.target.value)}
                                                    className="w-full bg-black/40 border border-white/[0.1] rounded-lg px-2.5 py-2 text-[12px] text-white outline-none focus:border-indigo-500 transition-all font-mono"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col h-full">
                            {/* Your Deployed Apps */}
                            <div className="mb-1">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Your Apps</span>
                                    <Link
                                        to="/apps"
                                        className="flex items-center gap-1 text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        View All <ArrowUpRight size={10} />
                                    </Link>
                                </div>

                                {generatedApps.length > 0 ? (
                                    <div className="space-y-2">
                                        {generatedApps.slice(0, 4).map(app => (
                                            <Link key={app.id} to="/apps" style={{ textDecoration: 'none' }}>
                                                <motion.div
                                                    whileHover={{ x: 3 }}
                                                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] cursor-pointer transition-all mb-2"
                                                >
                                                    <span className="text-base flex-shrink-0">{app.icon}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[11px] font-semibold text-slate-300 truncate">{app.name || app.prompt?.slice(0, 20) || 'AI App'}</div>
                                                        <div className="text-[9px] text-slate-600 mt-0.5">Deployed</div>
                                                    </div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                                </motion.div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    /* Default sample apps when store is empty */
                                    <div className="space-y-2">
                                        {[
                                            { name: 'MUDRA Loan Tracker', icon: '💰', color: '#10b981', status: 'running' },
                                            { name: 'GST Filing Assistant', icon: '🏛️', color: '#6366f1', status: 'running' },
                                            { name: 'WhatsApp Sales Bot', icon: '💬', color: '#f97316', status: 'running' },
                                            { name: 'Inventory Manager', icon: '📦', color: '#f59e0b', status: 'paused' },
                                        ].map((app, i) => (
                                            <Link key={i} to="/apps" style={{ textDecoration: 'none' }}>
                                                <motion.div
                                                    whileHover={{ x: 3 }}
                                                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] cursor-pointer transition-all mb-2"
                                                >
                                                    <span className="text-sm flex-shrink-0">{app.icon}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[11px] font-semibold text-slate-300 truncate">{app.name}</div>
                                                        <div className="text-[9px] mt-0.5" style={{ color: app.status === 'running' ? '#10b981' : '#f59e0b' }}>
                                                            {app.status === 'running' ? '● Running' : '◌ Paused'}
                                                        </div>
                                                    </div>
                                                    <ExternalLink size={10} className="text-slate-600 flex-shrink-0" />
                                                </motion.div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* View All Apps CTA */}
                            <Link to="/apps" style={{ textDecoration: 'none' }} className="mt-auto">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all cursor-pointer"
                                >
                                    <Activity size={12} className="text-cyan-400" />
                                    <span className="text-xs font-semibold text-cyan-400">View Deployed Apps</span>
                                    <ArrowUpRight size={11} className="text-cyan-400" />
                                </motion.div>
                            </Link>

                            <div className="mt-4 pt-4 border-t border-white/[0.05] opacity-40 text-center">
                                <Settings size={20} className="mx-auto mb-2 text-slate-600" />
                                <p className="text-[10px] text-slate-500 leading-relaxed">Select a canvas component to edit its properties</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
