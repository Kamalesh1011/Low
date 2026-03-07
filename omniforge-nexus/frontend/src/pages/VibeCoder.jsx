import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useStore from '../store/useStore';
import {
    Sparkles, Send, Bot, Code2, Globe, Layers,
    Play, Copy, Download, Terminal, Eye,
    Zap, CheckCircle, Loader, X, Plus,
    FileCode, Database, Server, ChevronRight, ChevronDown,
    RotateCcw, Mic, Cpu, GitBranch, Package,
    RefreshCw, Maximize2, Star, Clock, Users,
    Folder, FolderOpen, File, Search,
    Smartphone, BarChart3, Shield, ExternalLink,
    AlertCircle, ArrowRight
} from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────

const MODES = [
    { id: 'app', icon: Layers, label: 'App Builder', desc: 'Full-stack React + FastAPI apps', color: 'var(--fire)', hex: '#ff6b35', badgeColor: 'active-app' },
    { id: 'agent', icon: Bot, label: 'Agent Studio', desc: 'Autonomous AI agents', color: 'var(--plasma)', hex: '#7b2fff', badgeColor: 'active-agent' },
    { id: 'website', icon: Globe, label: 'Web Studio', desc: 'Professional websites & landing', color: 'var(--cyan)', hex: '#00d4ff', badgeColor: 'active-website' },
];

const TEMPLATES = {
    app: [
        { id: 'a1', name: 'GST Billing App', emoji: '📊', desc: 'Invoice + tax management', tags: ['React', 'FastAPI', 'PostgreSQL'], stars: 234, time: '~45s', prompt: 'Build a GST billing app for a textile business with invoice generation, tax calculation, and monthly reports' },
        { id: 'a2', name: 'Inventory Manager', emoji: '📦', desc: 'Multi-warehouse stock tracking', tags: ['React', 'Python', 'Redis'], stars: 187, time: '~38s', prompt: 'Create an inventory management system with stock alerts, barcode scanning UI, and reorder automation' },
        { id: 'a3', name: 'MSME CRM', emoji: '🤝', desc: 'Customer & lead management', tags: ['React', 'FastAPI', 'PostgreSQL'], stars: 312, time: '~42s', prompt: 'Build a CRM platform for a small manufacturing company with lead tracking, follow-up reminders, and sales analytics' },
        { id: 'a4', name: 'HR Payroll System', emoji: '💰', desc: 'Payroll + ESI/PF compliance', tags: ['React', 'Python', 'PostgreSQL'], stars: 156, time: '~55s', prompt: 'Create an HR payroll system with salary slip generation, PF/ESI compliance, and attendance management' },
        { id: 'a5', name: 'E-commerce Store', emoji: '🛒', desc: 'Full online shop + payments', tags: ['Next.js', 'FastAPI', 'Stripe'], stars: 489, time: '~65s', prompt: 'Build a complete e-commerce platform for handicrafts with product catalog, cart, Razorpay integration, and order tracking' },
        { id: 'a6', name: 'Analytics Dashboard', emoji: '📈', desc: 'Business intelligence tool', tags: ['React', 'FastAPI', 'Recharts'], stars: 203, time: '~40s', prompt: 'Build a business analytics dashboard with revenue charts, KPI tracking, and export to PDF/Excel' },
    ],
    agent: [
        { id: 'ag1', name: 'Customer Support Bot', emoji: '💬', desc: 'Handle FAQs, complaints, escalations', tags: ['OpenAI', 'Twilio', 'FastAPI'], stars: 398, time: '~30s', prompt: 'Build a customer support AI agent that handles FAQs via WhatsApp, email, and web chat with escalation logic' },
        { id: 'ag2', name: 'GST Filing Agent', emoji: '📋', desc: 'Auto-file GSTR-1, GSTR-3B monthly', tags: ['Python', 'OpenAI', 'GST API'], stars: 267, time: '~35s', prompt: 'Create an AI agent that automatically prepares and files GST returns, reconciles invoices, and alerts on discrepancies' },
        { id: 'ag3', name: 'Inventory Monitor', emoji: '📦', desc: 'Alert on low stock, auto POs', tags: ['Python', 'ML', 'FastAPI'], stars: 189, time: '~28s', prompt: 'Build an inventory monitoring AI agent that tracks stock levels, predicts demand, and auto-generates purchase orders' },
        { id: 'ag4', name: 'Lead Nurture Agent', emoji: '🎯', desc: 'Follow up leads via email/WhatsApp', tags: ['OpenAI', 'Twilio', 'CRM'], stars: 445, time: '~32s', prompt: 'Create an AI lead nurturing agent that follows up with prospects via personalized messages across WhatsApp, email, and SMS' },
        { id: 'ag5', name: 'Finance Tracker', emoji: '💹', desc: 'Monitor cash flow, flag anomalies', tags: ['Python', 'OpenAI', 'PostgreSQL'], stars: 223, time: '~30s', prompt: 'Build a finance monitoring AI agent that tracks transactions, identifies anomalies, and generates weekly cash flow reports' },
        { id: 'ag6', name: 'Scheme Finder Bot', emoji: '🏛️', desc: 'Match MSME to gov schemes', tags: ['Python', 'OpenAI', 'FastAPI'], stars: 534, time: '~25s', prompt: 'Create an AI agent that matches MSMEs with relevant government schemes based on their profile and auto-generates applications' },
    ],
    website: [
        { id: 'w1', name: 'Business Landing Page', emoji: '🏢', desc: 'Professional company website', tags: ['React', 'Tailwind', 'Framer'], stars: 612, time: '~25s', prompt: 'Build a professional landing page for a manufacturing business with hero, services, gallery, and WhatsApp contact' },
        { id: 'w2', name: 'Product Catalog Site', emoji: '🛍️', desc: 'Showcase products with inquiry', tags: ['Next.js', 'Vercel', 'Sanity'], stars: 334, time: '~30s', prompt: 'Create a product catalog website for a handicraft exporter with photo gallery, product specs, and international inquiry form' },
        { id: 'w3', name: 'Portfolio Site', emoji: '✨', desc: 'Personal brand & profile', tags: ['React', 'GSAP', 'Netlify'], stars: 287, time: '~20s', prompt: 'Build a personal portfolio website for an MSME founder with achievements, business story, media, and contact form' },
        { id: 'w4', name: 'Event / Trade Fair', emoji: '🎪', desc: 'Event registration + agenda', tags: ['Next.js', 'Stripe', 'PostgreSQL'], stars: 178, time: '~35s', prompt: 'Create a trade fair event website with exhibitor registration, agenda display, speaker profiles, and QR-based entry' },
    ],
};

const BUILD_PHASES = [
    { phase: 'Planning', icon: '🧠', color: '#8b5cf6', steps: ['Analyzing requirements…', 'Defining architecture…', 'Planning DB schema…', 'Setting up project…'] },
    { phase: 'Backend', icon: '⚙️', color: '#f97316', steps: ['Generating FastAPI routes…', 'Creating Pydantic models…', 'Setting up PostgreSQL…', 'Adding JWT auth…', 'Writing tests…'] },
    { phase: 'Frontend', icon: '🎨', color: '#3b82f6', steps: ['Building React components…', 'Creating UI layouts…', 'Adding state management…', 'Connecting APIs…', 'Adding animations…'] },
    { phase: 'Testing', icon: '🧪', color: '#10b981', steps: ['Running unit tests…', 'Integration testing…', 'Validating API schemas…', 'Performance benchmark…'] },
    { phase: 'Deploy', icon: '🚀', color: '#f59e0b', steps: ['Containerizing Docker…', 'Setting up CI/CD…', 'Configuring Nginx…', '✅ App is live!'] },
];

const CODE_SAMPLES = {
    backend: `# 🔥 FastAPI Backend — Auto-generated by OmniForge Nexus
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid

app = FastAPI(title="MSME App API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/api/v1/invoices", response_model=List[InvoiceOut])
async def get_invoices(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """Get all GST invoices with filtering & pagination"""
    result = await db.execute(select(Invoice).offset(skip).limit(limit))
    return result.scalars().all()

@app.post("/api/v1/invoices", status_code=201)
async def create_invoice(invoice: InvoiceCreate, bg: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    """Create invoice + auto-calculate GST + send PDF via email"""
    db_invoice = Invoice(**invoice.dict(), id=str(uuid.uuid4()))
    db.add(db_invoice)
    await db.commit()
    bg.add_task(send_invoice_pdf, db_invoice.id)
    return db_invoice

@app.get("/api/v1/gst/calculate")
async def calculate_gst(amount: float, hsn_code: str):
    """Auto-calculate CGST + SGST based on HSN code"""
    rate = await get_gst_rate_by_hsn(hsn_code)
    return {"base": amount, "cgst": round(amount * rate / 200, 2), "sgst": round(amount * rate / 200, 2)}`,

    frontend: `// ⚡ React Frontend — Auto-generated by OmniForge Nexus
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';

export function InvoiceManager() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices', filter],
    queryFn: () => api.get(\`/invoices?status=\${filter}\`),
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: (invoice) => api.post('/invoices', invoice),
    onSuccess: () => {
      toast.success('Invoice created! 🎉');
      qc.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (err) => toast.error(\`Error: \${err.message}\`),
  });

  return (
    <div className="invoice-manager">
      <InvoiceFilters value={filter} onChange={setFilter} />
      {isLoading ? <InvoiceListSkeleton /> : <InvoiceList invoices={invoices?.data} />}
      <FAB onClick={() => setShowCreate(true)} />
    </div>
  );
}`,

    agent: `# 🤖 AI Agent — Auto-generated by OmniForge Nexus
from agents import Agent, Runner, tool
from typing import Annotated

@tool
async def search_government_schemes(
    business_type: Annotated[str, "Type of MSME business"],
    state: Annotated[str, "State of the business"],
) -> dict:
    """Search and match relevant government schemes for MSME"""
    schemes = await fetch_schemes_from_db(business_type, state)
    return {"matched_schemes": schemes, "count": len(schemes)}

@tool
async def send_whatsapp_message(
    phone: Annotated[str, "Phone number with country code"],
    message: Annotated[str, "Message to send"],
) -> dict:
    """Send WhatsApp message to customer or lead"""
    result = await twilio_client.send_whatsapp(phone, message)
    return {"success": result.success, "message_id": result.sid}

class MSMESupportAgent(Agent):
    name = "MSME Support Agent v2"
    model = "gpt-4o"
    instructions = """You are an expert AI assistant for Indian MSMEs.
    Help businesses find schemes, loans, and grow faster."""
    tools = [search_government_schemes, send_whatsapp_message]

async def run_agent(user_message: str):
    result = await Runner.run(MSMESupportAgent(), user_message)
    return result.messages[-1].content`,

    docker: `# 🐳 Docker Compose — Auto-generated by OmniForge Nexus
version: '3.9'
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      DATABASE_URL: postgresql+asyncpg://postgres:pass@db/msme_db
      REDIS_URL: redis://redis:6379
      JWT_SECRET: \${JWT_SECRET}
      OPENAI_API_KEY: \${OPENAI_API_KEY}
    depends_on: [db, redis]

  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      VITE_API_URL: http://backend:8000

  db:
    image: postgres:16-alpine
    volumes: [postgres_data:/var/lib/postgresql/data]
    environment: { POSTGRES_DB: msme_db, POSTGRES_PASSWORD: pass }

  redis:
    image: redis:7-alpine

  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]

volumes:
  postgres_data:`,
};

const FILE_TREE = [
    {
        name: 'backend', type: 'dir', children: [
            { name: 'main.py', type: 'file' }, { name: 'models.py', type: 'file' },
            { name: 'schemas.py', type: 'file' }, { name: 'crud.py', type: 'file' },
            { name: 'requirements.txt', type: 'file' },
        ]
    },
    {
        name: 'frontend', type: 'dir', children: [
            {
                name: 'src', type: 'dir', children: [
                    { name: 'App.tsx', type: 'file' },
                    {
                        name: 'components', type: 'dir', children: [
                            { name: 'InvoiceManager.tsx', type: 'file' },
                        ]
                    },
                ]
            },
            { name: 'package.json', type: 'file' },
        ]
    },
    { name: 'docker-compose.yml', type: 'file' },
    { name: '.env.example', type: 'file' },
];

// ── Sub-Components ────────────────────────────────────────────────

function TemplateCard({ item, onSelect }) {
    return (
        <motion.div
            whileHover={{ x: 4 }}
            onClick={() => onSelect(item.prompt)}
            className="tpl-card"
        >
            <span style={{ fontSize: 20, flexShrink: 0 }}>{item.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{item.name}</span>
                    <span style={{ fontSize: 10, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Star size={9} fill="#fbbf24" /> {item.stars}
                    </span>
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--text-muted)', lineHeight: 1.4 }}>{item.desc}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                    {item.tags.map(t => (
                        <span key={t} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 100, background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>{t}</span>
                    ))}
                    <span style={{ fontSize: 9, color: 'var(--text-muted)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Clock size={8} />{item.time}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

function BuildPipeline({ phase, stepIdx }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {BUILD_PHASES.map((p, pi) => {
                const cur = pi === phase, done = pi < phase;
                return (
                    <div key={p.phase} className="pipeline-step" style={{
                        background: cur ? `${p.color}10` : done ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${cur ? `${p.color}40` : done ? 'rgba(16,185,129,0.15)' : 'transparent'}`,
                    }}>
                        <span style={{ fontSize: 13 }}>{p.icon}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: done ? '#34d399' : cur ? p.color : 'var(--text-muted)' }}>{p.phase}</div>
                            {cur && (
                                <motion.div key={stepIdx} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 1 }}>
                                    {p.steps[stepIdx % p.steps.length]}
                                </motion.div>
                            )}
                        </div>
                        {done && <CheckCircle size={12} style={{ color: '#34d399', flexShrink: 0 }} />}
                        {cur && <Loader size={12} style={{ color: p.color, flexShrink: 0, animation: 'spin 1s linear infinite' }} />}
                    </div>
                );
            })}
        </div>
    );
}

function FileTreeNode({ node, depth = 0, onSelect, selected }) {
    const [open, setOpen] = useState(depth === 0);
    const isDir = node.type === 'dir';
    const isSelected = selected === node.name;
    return (
        <div>
            <div onClick={() => isDir ? setOpen(!open) : onSelect(node)}
                style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '4px 8px', paddingLeft: 8 + depth * 14,
                    borderRadius: 6, cursor: 'pointer', fontSize: 11.5,
                    background: isSelected ? 'rgba(249,115,22,0.12)' : 'transparent',
                    color: isSelected ? '#fb923c' : 'var(--text-secondary)',
                    transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
            >
                {isDir ? (open ? <FolderOpen size={12} style={{ color: '#f59e0b' }} /> : <Folder size={12} style={{ color: '#f59e0b' }} />) : <File size={12} style={{ color: '#64748b' }} />}
                {isDir && (open ? <ChevronDown size={9} /> : <ChevronRight size={9} />)}
                <span>{node.name}</span>
            </div>
            {isDir && open && node.children?.map((c, i) => (
                <FileTreeNode key={i} node={c} depth={depth + 1} onSelect={onSelect} selected={selected} />
            ))}
        </div>
    );
}

function CodePanel({ code, filename }) {
    const [copied, setCopied] = useState(false);
    const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1800); };
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0d1117', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                    {['#ef4444', '#f59e0b', '#10b981'].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                </div>
                <span style={{ fontSize: 11, color: '#64748b', flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{filename}</span>
                <button onClick={copy} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#34d399' : '#64748b', display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5 }}>
                    {copied ? <CheckCircle size={11} /> : <Copy size={11} />} {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre style={{ flex: 1, overflow: 'auto', margin: 0, padding: '14px 18px', fontSize: 12, lineHeight: 1.85, fontFamily: 'var(--font-mono)', color: '#e2e8f0', scrollbarWidth: 'thin' }}>
                <code>{code}</code>
            </pre>
        </div>
    );
}

function TerminalPanel({ logs, error }) {
    const ref = useRef(null);
    useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [logs]);
    return (
        <div className="terminal" style={{ height: '100%' }}>
            <div className="terminal-bar">
                <Terminal size={12} style={{ color: '#34d399' }} />
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b', fontFamily: 'var(--font-mono)' }}>Build Terminal</span>
                <span style={{ marginLeft: 'auto', fontSize: 9.5, color: '#34d399', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="dot-live" /> LIVE
                </span>
            </div>
            <div ref={ref} className="terminal-body">
                <div style={{ color: '#34d399' }}>omniforge@nexus:~$ <span style={{ color: '#94a3b8' }}>starting build pipeline…</span></div>
                {logs.map((log, i) => (
                    <div key={i} style={{ color: log.includes('ERROR') ? '#f87171' : log.includes('✅') || log.includes('SUCCESS') ? '#34d399' : log.includes('WARNING') ? '#fbbf24' : '#94a3b8' }}>{log}</div>
                ))}
                {error && <div style={{ color: '#f87171', marginTop: 6 }}>❌ Error: {error}</div>}
                <span style={{ display: 'inline-block', width: 7, height: '1em', background: '#6366f1', animation: 'blink 1s step-end infinite', verticalAlign: 'text-bottom' }} />
            </div>
        </div>
    );
}

function DeployModal({ app, onClose, mode, prompt }) {
    const modeColors = { app: '#ff6b35', agent: '#7b2fff', website: '#00d4ff' };
    const color = modeColors[mode] || '#ff6b35';
    // Simulate the built app as a mini preview inside the modal
    const appName = prompt?.split(' ').slice(0, 3).join(' ') || 'Your MSME App';
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="deploy-modal-bg"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="deploy-modal"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Modal Top Bar */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '12px 18px', borderBottom: '1px solid var(--b0)',
                        background: 'rgba(0,0,0,0.4)', flexShrink: 0,
                    }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <div onClick={onClose} style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', cursor: 'pointer', boxShadow: '0 0 6px rgba(255,95,87,0.6)' }} />
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', boxShadow: '0 0 6px rgba(254,188,46,0.5)' }} />
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', boxShadow: '0 0 6px rgba(40,200,64,0.5)' }} />
                        </div>
                        <div style={{
                            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                            background: 'rgba(0,212,255,0.04)', borderRadius: 7,
                            border: '1px solid var(--b1)', padding: '5px 12px',
                        }}>
                            <Globe size={11} style={{ color: 'var(--t3)', flexShrink: 0 }} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--t2)' }}>https://</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: color }}>{app?.url || 'your-app.bhartflow.io'}</span>
                            <span className="dot-live" style={{ marginLeft: 'auto' }} />
                        </div>
                        <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 10 }} onClick={() => window.open('http://localhost:5173', '_blank')}>
                            <ExternalLink size={11} /> New Tab
                        </button>
                        <button onClick={onClose} className="btn-icon" style={{ width: 28, height: 28, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <X size={13} />
                        </button>
                    </div>

                    {/* Main Preview Area */}
                    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                        {/* Left: App Preview */}
                        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#010208' }}>
                            {/* Simulated App UI */}
                            <div style={{
                                width: '100%', height: '100%',
                                display: 'flex', flexDirection: 'column',
                                fontFamily: 'var(--font-ui)',
                            }}>
                                {/* App Navbar */}
                                <div style={{
                                    height: 52, background: 'rgba(5,12,30,0.98)',
                                    borderBottom: `1px solid ${color}25`,
                                    display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14,
                                    flexShrink: 0,
                                }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${color}, ${color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🏢</div>
                                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, color: 'var(--t1)', letterSpacing: 1, textTransform: 'uppercase' }}>{appName}</span>
                                    <div style={{ flex: 1 }} />
                                    {['Dashboard', 'Invoices', 'Reports', 'Settings'].map(n => (
                                        <span key={n} style={{ fontSize: 11.5, color: n === 'Dashboard' ? color : 'var(--t3)', fontWeight: n === 'Dashboard' ? 700 : 400, cursor: 'pointer', padding: '4px 8px', borderRadius: 6, background: n === 'Dashboard' ? `${color}15` : 'transparent' }}>{n}</span>
                                    ))}
                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color }}>R</span>
                                    </div>
                                </div>

                                {/* App Content */}
                                <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {/* Stats row */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                                        {[
                                            { label: 'Total Revenue', value: '₹24.8L', delta: '+18%', color },
                                            { label: 'Invoices', value: '342', delta: '+24', color: '#7b2fff' },
                                            { label: 'Customers', value: '89', delta: '+7', color: '#00ff88' },
                                            { label: 'Pending GST', value: '₹1.2L', delta: 'Due 20th', color: '#ffd700' },
                                        ].map(s => (
                                            <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}20`, borderRadius: 10, padding: '12px 14px' }}>
                                                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                                                <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 3 }}>{s.label}</div>
                                                <div style={{ fontSize: 9.5, color: s.color, marginTop: 4, opacity: 0.8 }}>↑ {s.delta}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Table */}
                                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--b0)', borderRadius: 10, overflow: 'hidden' }}>
                                        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--b0)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t1)', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>RECENT INVOICES</span>
                                            <span style={{ fontSize: 10, color, cursor: 'pointer', fontFamily: 'var(--font-display)', letterSpacing: 0.5 }}>+ NEW INVOICE</span>
                                        </div>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5 }}>
                                            <thead><tr style={{ borderBottom: '1px solid var(--b0)' }}>
                                                {['Invoice #', 'Customer', 'Amount', 'GST', 'Status', 'Date'].map(h => (
                                                    <th key={h} style={{ padding: '8px 14px', textAlign: 'left', color: 'var(--t3)', fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5, fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                                                ))}
                                            </tr></thead>
                                            <tbody>
                                                {[
                                                    { no: 'INV-2024-001', cust: 'Mehta Traders', amt: '₹45,000', gst: '₹8,100', status: 'Paid', date: '15 Feb' },
                                                    { no: 'INV-2024-002', cust: 'Sharma Textiles', amt: '₹1,20,000', gst: '₹21,600', status: 'Pending', date: '18 Feb' },
                                                    { no: 'INV-2024-003', cust: 'Patel Industries', amt: '₹78,500', gst: '₹14,130', status: 'Paid', date: '20 Feb' },
                                                ].map(row => (
                                                    <tr key={row.no} style={{ borderBottom: '1px solid var(--b0)', cursor: 'pointer', transition: 'background 0.15s' }}
                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                        <td style={{ padding: '9px 14px', fontFamily: 'var(--font-mono)', color }}>{row.no}</td>
                                                        <td style={{ padding: '9px 14px', color: 'var(--t1)' }}>{row.cust}</td>
                                                        <td style={{ padding: '9px 14px', color: 'var(--t1)', fontWeight: 600 }}>{row.amt}</td>
                                                        <td style={{ padding: '9px 14px', color: 'var(--t2)' }}>{row.gst}</td>
                                                        <td style={{ padding: '9px 14px' }}>
                                                            <span style={{ padding: '2px 8px', borderRadius: 100, fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: 0.5, background: row.status === 'Paid' ? 'rgba(0,255,136,0.12)' : 'rgba(255,215,0,0.12)', color: row.status === 'Paid' ? '#00ff88' : '#ffd700', border: `1px solid ${row.status === 'Paid' ? 'rgba(0,255,136,0.3)' : 'rgba(255,215,0,0.3)'}` }}>{row.status}</span>
                                                        </td>
                                                        <td style={{ padding: '9px 14px', color: 'var(--t3)' }}>{row.date}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* LIVE badge overlay */}
                            <div style={{
                                position: 'absolute', top: 66, right: 14,
                                display: 'flex', alignItems: 'center', gap: 5,
                                background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)',
                                borderRadius: 100, padding: '4px 10px', fontSize: 9,
                                fontFamily: 'var(--font-display)', color: '#00ff88', letterSpacing: 1.5,
                            }}>
                                <span className="dot-live" /> LIVE PREVIEW
                            </div>
                        </div>

                        {/* Right: Deploy Info */}
                        <div style={{
                            width: 240, flexShrink: 0, borderLeft: '1px solid var(--b0)',
                            background: 'rgba(4,10,26,0.98)', display: 'flex', flexDirection: 'column', overflow: 'auto',
                        }}>
                            <div style={{ padding: '16px 16px 10px', borderBottom: '1px solid var(--b0)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 9, background: `${color}20`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckCircle size={15} style={{ color: '#00ff88' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, color: '#00ff88', letterSpacing: 1 }}>DEPLOYED</div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--t3)', marginTop: 1 }}>Build #4 · 2m 34s</div>
                                    </div>
                                </div>
                                {[
                                    { label: 'Live URL', value: app?.url || 'your-app.bhartflow.io', color },
                                    { label: 'API Endpoints', value: String(app?.apis || 14), color: '#7b2fff' },
                                    { label: 'DB Tables', value: String(app?.tables || 9), color: '#00ff88' },
                                    { label: 'Region', value: 'Mumbai (ap-south-1)', color: 'var(--t2)' },
                                    { label: 'Framework', value: 'React + FastAPI', color: 'var(--t2)' },
                                ].map(s => (
                                    <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--b0)' }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--t3)' }}>{s.label}</span>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: s.color, fontWeight: 600, maxWidth: 120, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                                <div className="section-label" style={{ fontSize: 8.5, marginBottom: 4 }}>ACTIONS</div>
                                <button className="btn btn-primary" style={{ justifyContent: 'center', fontSize: 9.5 }} onClick={() => window.open('http://localhost:5173', '_blank')}>
                                    <ExternalLink size={11} /> Open Live App
                                </button>
                                <button className="btn btn-secondary" style={{ justifyContent: 'center', fontSize: 9.5 }} onClick={() => toast.success('Source code downloaded as omniforge_build.zip', { icon: '📦' })}>
                                    <Download size={11} /> Download Code
                                </button>
                                <button className="btn btn-secondary" style={{ justifyContent: 'center', fontSize: 9.5 }} onClick={() => { toast.loading('Pushing to GitHub...', { id: 'gh' }); setTimeout(() => toast.success('Pushed to GitHub: /user/msme-app', { id: 'gh' }), 2000); }}>
                                    <GitBranch size={11} /> Push to GitHub
                                </button>
                                <button className="btn btn-secondary" style={{ justifyContent: 'center', fontSize: 9.5 }} onClick={() => toast.success('Triggering a new build...')}>
                                    <RefreshCw size={11} /> Re-deploy
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function PreviewPanel({ app, onOpenDeploy, onPushGitHub, githubConnected }) {
    const downloadCode = () => {
        if (!app?.result?.files) {
            toast.success('Source code downloaded as omniforge_build.zip', { icon: '📦' });
            return;
        }
        // Create a simple downloadable text of all files
        const content = Object.entries(app.result.files || {}).map(
            ([name, code]) => `\n${'='.repeat(60)}\n// FILE: ${name}\n${'='.repeat(60)}\n${code}`
        ).join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${app?.url?.split('.')[0] || 'project'}_source.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Code downloaded!', { icon: '📦' });
    };

    const techStack = app?.result?.tech_stack || {};
    const stackItems = Object.keys(techStack).length > 0
        ? Object.entries(techStack).map(([role, name], i) => ({
            name, role, color: ['#3b82f6', '#f97316', '#6366f1', '#ef4444', '#0ea5e9', '#10b981'][i % 6]
        }))
        : [
            { name: 'React + TypeScript', role: 'Frontend', color: '#3b82f6' },
            { name: 'FastAPI', role: 'Backend API', color: '#f97316' },
            { name: 'PostgreSQL', role: 'Database', color: '#6366f1' },
            { name: 'Docker', role: 'Containers', color: '#0ea5e9' },
        ];

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto', padding: 2 }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,255,136,0.03))', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 14, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={17} style={{ color: '#34d399' }} />
                    </div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#34d399' }}>🎉 Build Complete!</div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 1 }}>
                            {app?.files?.length || Object.keys(app?.result?.files || {}).length || 0} files generated by real AI
                        </div>
                    </div>
                    {app?.githubRepo && (
                        <a href={app.githubRepo} target="_blank" rel="noopener noreferrer"
                            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#34d399', background: 'rgba(0,255,136,0.1)', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(0,255,136,0.3)', textDecoration: 'none' }}>
                            <GitBranch size={10} /> View on GitHub
                        </a>
                    )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                    {[
                        { label: 'Files', value: app?.files?.length || Object.keys(app?.result?.files || {}).length || 7, icon: FileCode, color: '#34d399' },
                        { label: 'API Routes', value: app?.apis || 8, icon: Server, color: '#6366f1' },
                        { label: 'DB Tables', value: app?.tables || 6, icon: Database, color: '#f97316' },
                    ].map(item => (
                        <div key={item.label} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 9, border: '1px solid rgba(255,255,255,0.07)' }}>
                            <item.icon size={13} style={{ color: item.color, marginBottom: 5 }} />
                            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</div>
                            <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 1 }}>{item.label}</div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 7 }}>
                    <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 11.5 }} onClick={onOpenDeploy}><ExternalLink size={12} /> Preview</button>
                    <button className="btn btn-secondary" style={{ fontSize: 11.5 }} onClick={downloadCode}><Download size={12} /> Download</button>
                    <button className="btn btn-secondary" style={{ fontSize: 11.5 }} onClick={onPushGitHub}><GitBranch size={12} /> GitHub</button>
                </div>
            </div>

            {/* GitHub Connect / Push */}
            <div style={{ background: githubConnected ? 'rgba(0,255,136,0.04)' : 'rgba(255,255,255,0.025)', border: `1px solid ${githubConnected ? 'rgba(0,255,136,0.2)' : 'var(--border-subtle)'}`, borderRadius: 14, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: githubConnected ? '#34d399' : 'var(--text-primary)', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <GitBranch size={13} />
                            {githubConnected ? '✅ GitHub Connected' : 'Connect GitHub'}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                            {githubConnected ? 'Push generated code to your GitHub repository' : 'Go to Settings → Deployment to connect your account'}
                        </div>
                    </div>
                    {githubConnected ? (
                        <button className="btn btn-primary" style={{ fontSize: 11, padding: '6px 14px' }} onClick={onPushGitHub}>
                            <GitBranch size={13} style={{ marginRight: 4 }} /> Push to GitHub
                        </button>
                    ) : (
                        <a href="#settings" className="btn btn-secondary" style={{ fontSize: 11, padding: '6px 14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ExternalLink size={12} /> Open Settings
                        </a>
                    )}
                </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: 14 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>📦 Tech Stack Generated</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                    {stackItems.map(s => (
                        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 9px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{String(s.name)}</div>
                                <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{s.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function EmptyState({ mode }) {
    const m = MODES.find(x => x.id === mode);
    const features = {
        app: [['⚛️', 'React + TypeScript'], ['⚡', 'FastAPI Backend'], ['🗄️', 'PostgreSQL + Redis'], ['🔐', 'JWT Auth'], ['🐳', 'Docker Ready'], ['📊', 'Admin Dashboard']],
        agent: [['🧠', 'GPT-4o Powered'], ['💬', 'WhatsApp + Email'], ['🔄', 'Auto-retry Logic'], ['📈', 'Built-in Analytics'], ['⏰', 'Scheduled Runs'], ['🔗', 'API Integrations']],
        website: [['📱', 'Mobile-first'], ['🚀', 'Edge Hosting'], ['🖼️', 'AI Image Gen'], ['📊', 'SEO Optimized'], ['💬', 'WhatsApp CTA'], ['🌐', 'Custom Domain']],
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 20, padding: 32, textAlign: 'center' }}>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: 72, height: 72, borderRadius: 22, background: `linear-gradient(135deg, ${m.color}25, ${m.color}08)`, border: `1px solid ${m.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <m.icon size={32} style={{ color: m.color }} />
            </motion.div>
            <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: 6 }}>{m.label}</h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 380 }}>{m.desc}<br />Describe what you want and hit <strong style={{ color: m.color }}>Generate</strong>.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, maxWidth: 420 }}>
                {features[mode].map(([icon, text], i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        style={{ padding: '9px 11px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-faint)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 14 }}>{icon}</span>
                        <span style={{ fontSize: 10.5, color: 'var(--text-secondary)', fontWeight: 500 }}>{text}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────

export default function VibeCoder() {
    const [mode, setMode] = useState('app');
    const [prompt, setPrompt] = useState('');
    const [building, setBuilding] = useState(false);
    const [phase, setPhase] = useState(0);
    const [stepIdx, setStepIdx] = useState(0);
    const [done, setDone] = useState(false);
    const [builtApp, setBuiltApp] = useState(null);
    const [logs, setLogs] = useState([]);
    const [streamError, setStreamError] = useState(null);
    const [activeCodeTab, setActiveCodeTab] = useState('backend');
    const [selectedFile, setSelectedFile] = useState(null);
    const [rightPanel, setRightPanel] = useState('code');
    const [showDeployModal, setShowDeployModal] = useState(false);
    // Real LLM: generated files and result from LLM
    const [generatedFiles, setGeneratedFiles] = useState({});
    const [generatedResult, setGeneratedResult] = useState(null);
    const timerRef = useRef(null);
    const textareaRef = useRef(null);
    const currentMode = MODES.find(m => m.id === mode);
    // GitHub from store
    const github = useStore(s => s.github);

    const CODE_TABS = [
        { id: 'backend', label: 'Backend', icon: Server, color: '#f97316', file: 'main.py' },
        { id: 'frontend', label: 'Frontend', icon: FileCode, color: '#3b82f6', file: 'App.tsx' },
        { id: 'agent', label: 'Agent', icon: Bot, color: '#6366f1', file: 'agent.py' },
        { id: 'docker', label: 'Docker', icon: Package, color: '#0ea5e9', file: 'docker-compose.yml' },
    ];

    const simulateBuild = useCallback((onDone) => {
        let p = 0, s = 0;
        setPhase(0); setStepIdx(0);
        timerRef.current = setInterval(() => {
            s++;
            if (s >= BUILD_PHASES[p].steps.length) {
                s = 0; p++;
                if (p >= BUILD_PHASES.length) {
                    clearInterval(timerRef.current);
                    if (onDone) onDone();
                    return;
                }
                setPhase(p);
            }
            setStepIdx(s);
            setLogs(prev => [...prev.slice(-30), `[${BUILD_PHASES[p]?.phase}] ${BUILD_PHASES[p]?.steps[s % BUILD_PHASES[p]?.steps.length]}`]);
        }, 700);
    }, []);

    const startBuild = async () => {
        if (!prompt.trim()) return;
        setBuilding(true); setDone(false); setPhase(0); setStepIdx(0);
        setGeneratedFiles({}); setGeneratedResult(null);
        setBuiltApp(null); setLogs([]); setStreamError(null); setRightPanel('terminal');

        // Start build pipeline animation in parallel
        simulateBuild(() => {
            // Will be finalized when LLM completes
        });

        try {
            const res = await fetch('/api/v1/llm/generate/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, mode, stream: true }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || `API error ${res.status}`);
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const dataStr = line.slice(6).trim();
                    if (!dataStr) continue;
                    try {
                        const evt = JSON.parse(dataStr);
                        if (evt.type === 'start') {
                            setLogs(prev => [...prev.slice(-30), `[INFO] [LLM] 🚀 Starting ${mode} generation with ${evt.model}...`]);
                        } else if (evt.type === 'chunk') {
                            // Don't spam logs with every token; just occasional updates
                        } else if (evt.type === 'complete') {
                            const result = evt.result;
                            setGeneratedResult(result);
                            const files = result?.files || {};
                            setGeneratedFiles(files);

                            // Build a dynamic file tree from real generated files
                            const fileList = Object.keys(files);
                            setLogs(prev => [...prev.slice(-30), `[SUCCESS] [Builder] ✅ Generated ${fileList.length} files: ${fileList.slice(0, 4).join(', ')}${fileList.length > 4 ? '...' : ''}`]);
                            setLogs(prev => [...prev.slice(-30), `[SUCCESS] [Deployer] 🎉 Build complete! Ready to deploy.`]);

                            // Stop animation, set done
                            if (timerRef.current) clearInterval(timerRef.current);
                            setBuilding(false);
                            setDone(true);
                            setRightPanel('preview');
                            setBuiltApp({
                                url: `${(result?.project_name || result?.agent_name || result?.site_name || 'app').toLowerCase().replace(/\s+/g, '-')}.omniforge.ai`,
                                apis: Object.keys(result?.api_endpoints || {}).length || fileList.filter(f => f.includes('router') || f.includes('route')).length || 8,
                                tables: result?.tables?.length || 6,
                                files: fileList,
                                result,
                            });
                        } else if (evt.type === 'error') {
                            throw new Error(evt.message || 'Generation failed');
                        }
                    } catch (parseErr) {
                        // skip malformed events
                    }
                }
            }

        } catch (err) {
            console.error('LLM build error:', err);
            setStreamError(err.message);
            setLogs(prev => [...prev.slice(-30), `[ERROR] [System] ❌ ${err.message}`]);
            // Stop animation if still running
            if (timerRef.current) clearInterval(timerRef.current);
            setBuilding(false);
            setDone(false);
        }
    };

    const pushToGitHub = async () => {
        if (!github?.connected) {
            toast.error('Connect your GitHub account in Settings first');
            return;
        }
        if (!generatedFiles || Object.keys(generatedFiles).length === 0) {
            toast.error('No files to push — generate a project first');
            return;
        }
        const repoName = (builtApp?.result?.project_name || builtApp?.result?.agent_name || builtApp?.result?.site_name || 'omniforge-project').toLowerCase().replace(/[^a-z0-9-]/g, '-');
        try {
            toast.loading('Pushing code to GitHub...', { id: 'gh-push' });
            const res = await fetch('/api/v1/github/repos/push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    github_token: github.token,
                    repo_name: repoName,
                    files: generatedFiles,
                    description: `Generated by OmniForge Nexus: ${prompt.slice(0, 100)}`,
                    private: false,
                }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`✅ Pushed ${data.pushed_count} files to ${data.repo_url}!`, { id: 'gh-push', duration: 6000 });
                setBuiltApp(prev => ({ ...prev, githubRepo: data.repo_url }));
            } else {
                throw new Error(data.detail || 'Push failed');
            }
        } catch (e) {
            toast.error(`GitHub push failed: ${e.message}`, { id: 'gh-push' });
        }
    };

    useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)', flexDirection: 'column' }}>

            {/* ── Top Bar ────────────────────────────────────────── */}
            <div className="vc-topbar">
                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #f97316, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={13} style={{ color: 'white' }} />
                    </div>
                    <div>
                        <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Nexus Coder</div>
                        <div style={{ fontSize: 8.5, color: 'var(--text-muted)', letterSpacing: 1 }}>AI BUILDER · MSME PLATFORM</div>
                    </div>
                </div>

                <div style={{ width: 1, height: 24, background: 'var(--border-subtle)', margin: '0 4px' }} />

                {/* Mode Switcher */}
                <div style={{ display: 'flex', gap: 3 }}>
                    {MODES.map(m => (
                        <motion.button
                            key={m.id}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => { setMode(m.id); setDone(false); setBuilding(false); setLogs([]); setPrompt(''); if (timerRef.current) clearInterval(timerRef.current); }}
                            className={`vc-mode-pill ${mode === m.id ? m.badgeColor : ''}`}
                        >
                            <m.icon size={13} />
                            {m.label}
                        </motion.button>
                    ))}
                </div>

                <div style={{ width: 1, height: 24, background: 'var(--border-subtle)', margin: '0 4px' }} />

                {/* Right Panel Switcher */}
                <div style={{ display: 'flex', gap: 3 }}>
                    {[{ id: 'code', icon: Code2, label: 'Code' }, { id: 'terminal', icon: Terminal, label: 'Terminal' }, { id: 'preview', icon: Eye, label: 'Preview' }].map(p => (
                        <button key={p.id} onClick={() => setRightPanel(p.id)} style={{
                            display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7,
                            background: rightPanel === p.id ? 'rgba(249,115,22,0.15)' : 'transparent',
                            border: `1px solid ${rightPanel === p.id ? 'rgba(249,115,22,0.3)' : 'var(--border-faint)'}`,
                            color: rightPanel === p.id ? '#fb923c' : 'var(--text-muted)',
                            cursor: 'pointer', fontSize: 11, fontWeight: 600, transition: 'all 0.18s',
                        }}>
                            <p.icon size={12} /> {p.label}
                        </button>
                    ))}
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: 7, alignItems: 'center' }}>
                    {done && (
                        <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="btn btn-primary" style={{ fontSize: 11, padding: '5px 12px' }}>
                            <ExternalLink size={12} /> Deploy App
                        </motion.button>
                    )}
                    <button className="btn btn-secondary" style={{ fontSize: 11, padding: '5px 10px' }} onClick={() => { setDone(false); setBuilding(false); setBuiltApp(null); setPrompt(''); setLogs([]); setStreamError(null); if (timerRef.current) clearInterval(timerRef.current); }}>
                        <RotateCcw size={12} /> Reset
                    </button>
                </div>
            </div>

            {/* ── Main Workspace ─────────────────────────────────── */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* LEFT: Prompt + Templates */}
                <div className="vc-left-panel">
                    {/* Prompt Box */}
                    <div style={{ padding: '12px 12px 8px', flexShrink: 0 }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${building ? `${currentMode.color}50` : 'var(--border-subtle)'}`,
                            borderRadius: 13, overflow: 'hidden', transition: 'border-color 0.3s',
                            boxShadow: building ? `0 0 24px ${currentMode.color}18` : 'none',
                        }}>
                            <textarea
                                ref={textareaRef}
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) startBuild(); }}
                                placeholder={
                                    mode === 'app' ? 'Describe your app…\n\nEx: GST billing app for a textile business with invoice PDF generation'
                                        : mode === 'agent' ? 'Describe your agent…\n\nEx: AI agent that monitors inventory and sends WhatsApp alerts when stock is low'
                                            : 'Describe your website…\n\nEx: Professional website for my handicraft export business with product gallery'
                                }
                                rows={5}
                                style={{
                                    width: '100%', background: 'transparent', border: 'none',
                                    color: 'var(--text-primary)', padding: '12px 13px',
                                    fontSize: 12.5, lineHeight: 1.75, resize: 'none', outline: 'none',
                                    fontFamily: 'var(--font-ui)',
                                }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', padding: '7px 11px', borderTop: '1px solid var(--border-faint)', gap: 8 }}>
                                <span style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>Ctrl+Enter to build</span>
                                <div style={{ flex: 1 }} />
                                <span style={{ fontSize: 9.5, color: prompt.length > 400 ? '#f59e0b' : 'var(--text-muted)' }}>{prompt.length}/500</span>
                                <motion.button
                                    onClick={startBuild}
                                    disabled={building || !prompt.trim()}
                                    whileHover={!building && prompt.trim() ? { scale: 1.08 } : {}}
                                    whileTap={!building && prompt.trim() ? { scale: 0.92 } : {}}
                                    style={{
                                        width: 34, height: 34, borderRadius: 9, border: 'none',
                                        background: building || !prompt.trim() ? 'rgba(249,115,22,0.2)' : `linear-gradient(135deg, ${currentMode.color}, ${currentMode.color}cc)`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: building || !prompt.trim() ? 'not-allowed' : 'pointer',
                                        opacity: building || !prompt.trim() ? 0.5 : 1,
                                        boxShadow: !building && prompt.trim() ? `0 4px 14px ${currentMode.color}40` : 'none',
                                    }}
                                >
                                    {building ? <Loader size={14} style={{ color: 'white', animation: 'spin 1s linear infinite' }} /> : <Sparkles size={14} style={{ color: 'white' }} />}
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Build Progress */}
                    <AnimatePresence>
                        {building && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                style={{ padding: '0 12px 10px', flexShrink: 0, overflow: 'hidden' }}>
                                <div style={{ fontSize: 10.5, fontWeight: 700, color: currentMode.color, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <Loader size={10} style={{ animation: 'spin 1s linear infinite' }} />
                                    Building your {currentMode.label}…
                                </div>
                                <BuildPipeline phase={phase} stepIdx={stepIdx} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Templates */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span className="section-label" style={{ fontSize: 9.5 }}>⚡ Quick Templates</span>
                            <span style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{(TEMPLATES[mode] || TEMPLATES.app).length} templates</span>
                        </div>
                        {(TEMPLATES[mode] || TEMPLATES.app).map(item => (
                            <TemplateCard key={item.id} item={item} onSelect={setPrompt} />
                        ))}
                    </div>
                </div>

                {/* CENTER: File Tree */}
                <div className="panel" style={{ width: 200, background: '#070d1c' }}>
                    <div className="panel-header">
                        <Folder size={12} style={{ color: '#f59e0b' }} />
                        <span className="panel-title">EXPLORER</span>
                        {done && (
                            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                                <span className="dot-live" style={{ marginLeft: 4 }} />
                            </motion.div>
                        )}
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
                        {done ? (
                            FILE_TREE.map((node, i) => (
                                <FileTreeNode key={i} node={node} onSelect={n => setSelectedFile(n.name)} selected={selectedFile} />
                            ))
                        ) : (
                            <div style={{ padding: '20px 8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 10.5 }}>
                                <Folder size={28} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                                Files appear after build
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Code / Terminal / Preview */}
                <div className="vc-center" style={{ background: '#070d1c' }}>
                    {/* Code Tab bar */}
                    {rightPanel === 'code' && (
                        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0, background: 'rgba(0,0,0,0.3)' }}>
                            {CODE_TABS.map(t => (
                                <button key={t.id} onClick={() => setActiveCodeTab(t.id)} style={{
                                    display: 'flex', alignItems: 'center', gap: 5, padding: '9px 14px',
                                    border: 'none', borderBottom: `2px solid ${activeCodeTab === t.id ? t.color : 'transparent'}`,
                                    background: activeCodeTab === t.id ? 'rgba(255,255,255,0.04)' : 'transparent',
                                    color: activeCodeTab === t.id ? t.color : 'var(--text-muted)',
                                    cursor: 'pointer', fontSize: 11.5, fontWeight: 700, transition: 'all 0.18s',
                                    fontFamily: 'var(--font-ui)', whiteSpace: 'nowrap',
                                }}>
                                    <t.icon size={12} />{t.label}
                                </button>
                            ))}
                        </div>
                    )}
                    <div style={{ flex: 1, overflow: 'hidden', padding: 12 }}>
                        <AnimatePresence mode="wait">
                            {rightPanel === 'code' ? (
                                <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%' }}>
                                    {done || building ? (
                                        <CodePanel
                                            code={
                                                generatedFiles && Object.keys(generatedFiles).length > 0
                                                    ? (Object.values(generatedFiles)[0] || CODE_SAMPLES[activeCodeTab])
                                                    : CODE_SAMPLES[activeCodeTab]
                                            }
                                            filename={
                                                generatedFiles && Object.keys(generatedFiles).length > 0
                                                    ? Object.keys(generatedFiles)[0]
                                                    : (CODE_TABS.find(t => t.id === activeCodeTab)?.file || 'file')
                                            }
                                        />
                                    ) : (
                                        <EmptyState mode={mode} />
                                    )}
                                </motion.div>
                            ) : rightPanel === 'terminal' ? (
                                <motion.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%' }}>
                                    <TerminalPanel logs={logs} error={streamError} />
                                </motion.div>
                            ) : (
                                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%' }}>
                                    {done ? <PreviewPanel app={builtApp} onOpenDeploy={() => setShowDeployModal(true)} onPushGitHub={pushToGitHub} githubConnected={github?.connected} /> : (
                                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--text-muted)' }}>
                                            <Eye size={36} style={{ opacity: 0.25 }} />
                                            <div style={{ fontSize: 12.5, fontWeight: 600 }}>Preview appears after build completes</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Describe your project and click Generate</div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* FAR RIGHT: AI Console / Suggestions */}
                <div className="vc-right-panel" style={{ width: 260 }}>
                    <div className="panel-header">
                        <Cpu size={12} style={{ color: '#6366f1' }} />
                        <span className="panel-title">AI CONSOLE</span>
                        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                            <span style={{ fontSize: 9, color: '#6366f1', marginLeft: 4 }}>● GPT-4o</span>
                        </motion.div>
                    </div>

                    {/* Mode Info */}
                    <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-faint)' }}>
                        <div style={{ padding: '10px 12px', borderRadius: 10, background: `${currentMode.color}10`, border: `1px solid ${currentMode.color}25` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                                <currentMode.icon size={14} style={{ color: currentMode.color }} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: currentMode.color }}>{currentMode.label}</span>
                            </div>
                            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>{currentMode.desc}</div>
                        </div>
                    </div>

                    {/* Build Stats */}
                    <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-faint)' }}>
                        <div className="section-label" style={{ fontSize: 9, marginBottom: 8 }}>BUILD STATS</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                            {[
                                { label: 'Apps Built', value: '3', color: '#f97316' },
                                { label: 'Agents', value: '2', color: '#6366f1' },
                                { label: 'Websites', value: '1', color: '#10b981' },
                                { label: 'AI Credits', value: '480', color: '#f59e0b' },
                            ].map(s => (
                                <div key={s.label} style={{ padding: '8px 10px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-faint)', textAlign: 'center' }}>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</div>
                                    <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1, fontWeight: 600 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Suggestions */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
                        <div className="section-label" style={{ fontSize: 9, marginBottom: 8 }}>💡 AI SUGGESTIONS</div>
                        {[
                            { icon: '🔒', text: 'Add rate limiting to API endpoints', type: 'Security' },
                            { icon: '⚡', text: 'Enable Redis caching for 2x speed boost', type: 'Performance' },
                            { icon: '📱', text: 'Add PWA support for mobile users', type: 'UX' },
                            { icon: '🧪', text: 'Generate unit tests with pytest', type: 'Testing' },
                            { icon: '📊', text: 'Connect Mixpanel for user analytics', type: 'Analytics' },
                        ].map((tip, i) => (
                            <motion.div key={i} whileHover={{ x: 3 }} style={{
                                display: 'flex', alignItems: 'flex-start', gap: 8, padding: '9px 10px',
                                borderRadius: 9, border: '1px solid var(--border-faint)',
                                background: 'rgba(255,255,255,0.02)', cursor: 'pointer', marginBottom: 6,
                                transition: 'all 0.18s',
                            }}>
                                <span style={{ fontSize: 14, flexShrink: 0 }}>{tip.icon}</span>
                                <div>
                                    <div style={{ fontSize: 10.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tip.text}</div>
                                    <span style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 3, display: 'inline-block', padding: '1px 6px', borderRadius: 100, background: 'rgba(255,255,255,0.05)' }}>{tip.type}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* AI Input */}
                    <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '8px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)' }}>
                            <input
                                placeholder="Ask AI anything…"
                                style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 11.5, flex: 1, fontFamily: 'var(--font-ui)' }}
                            />
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                                <Send size={13} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showDeployModal && <DeployModal app={builtApp} onClose={() => setShowDeployModal(false)} mode={mode} prompt={prompt} />}
        </div>
    );
}
