import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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

// â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MODES = [
    { id: 'swarm', icon: Cpu, label: 'Swarm Engine', desc: 'World-Class Multi-Agent Swarm', color: '#10b981', hex: '#10b981', badgeColor: 'active-swarm' },
    { id: 'app', icon: Layers, label: 'App Builder', desc: 'Full-stack React + FastAPI apps', color: 'var(--fire)', hex: '#ff6b35', badgeColor: 'active-app' },
    { id: 'agent', icon: Bot, label: 'Agent Studio', desc: 'Autonomous AI agents', color: 'var(--plasma)', hex: '#7b2fff', badgeColor: 'active-agent' },
    { id: 'website', icon: Globe, label: 'Web Studio', desc: 'Professional websites & landing', color: 'var(--cyan)', hex: '#00d4ff', badgeColor: 'active-website' },
];

const TEMPLATES = {
    app: [
        { id: 'a1', name: 'GST Billing App', emoji: 'ðŸ“Š', desc: 'Invoice + tax management', tags: ['React', 'FastAPI', 'PostgreSQL'], stars: 234, time: '~45s', prompt: 'Build a GST billing app for a textile business with invoice generation, tax calculation, and monthly reports' },
        { id: 'a2', name: 'Inventory Manager', emoji: 'ðŸ“¦', desc: 'Multi-warehouse stock tracking', tags: ['React', 'Python', 'Redis'], stars: 187, time: '~38s', prompt: 'Create an inventory management system with stock alerts, barcode scanning UI, and reorder automation' },
        { id: 'a3', name: 'MSME CRM', emoji: 'ðŸ¤', desc: 'Customer & lead management', tags: ['React', 'FastAPI', 'PostgreSQL'], stars: 312, time: '~42s', prompt: 'Build a CRM platform for a small manufacturing company with lead tracking, follow-up reminders, and sales analytics' },
        { id: 'a4', name: 'HR Payroll System', emoji: 'ðŸ’°', desc: 'Payroll + ESI/PF compliance', tags: ['React', 'Python', 'PostgreSQL'], stars: 156, time: '~55s', prompt: 'Create an HR payroll system with salary slip generation, PF/ESI compliance, and attendance management' },
        { id: 'a5', name: 'E-commerce Store', emoji: 'ðŸ›’', desc: 'Full online shop + payments', tags: ['Next.js', 'FastAPI', 'Stripe'], stars: 489, time: '~65s', prompt: 'Build a complete e-commerce platform for handicrafts with product catalog, cart, Razorpay integration, and order tracking' },
        { id: 'a6', name: 'Analytics Dashboard', emoji: 'ðŸ“ˆ', desc: 'Business intelligence tool', tags: ['React', 'FastAPI', 'Recharts'], stars: 203, time: '~40s', prompt: 'Build a business analytics dashboard with revenue charts, KPI tracking, and export to PDF/Excel' },
        { id: 'a7', name: 'Agriculture Supply Chain', emoji: 'ðŸšœ', desc: 'Farm-to-fork tracking', tags: ['React', 'Python', 'GIS'], stars: 145, time: '~50s', prompt: 'Build a supply chain app for agriculture with crop harvesting logs, transport tracking, and direct-to-consumer sales portal' },
        { id: 'a8', name: 'Textile Order Manager', emoji: 'ðŸ§¶', desc: 'Design to delivery workflow', tags: ['React', 'FastAPI', 'PostgreSQL'], stars: 220, time: '~45s', prompt: 'Create a textile order management system with design upload, dye house tracking, and automated shipping labels' },
        { id: 'a9', name: 'Food Cloud Kitchen', emoji: 'ðŸ³', desc: 'Multi-brand kitchen manager', tags: ['React', 'Python', 'WebSockets'], stars: 310, time: '~55s', prompt: 'Build a cloud kitchen manager with Swiggy/Zomato order sync, real-time KDS (Kitchen Display System), and inventory auto-deduction' },
    ],
    agent: [
        { id: 'ag1', name: 'Customer Support Bot', emoji: 'ðŸ’¬', desc: 'Handle FAQs, complaints, escalations', tags: ['OpenAI', 'Twilio', 'FastAPI'], stars: 398, time: '~30s', prompt: 'Build a customer support AI agent that handles FAQs via WhatsApp, email, and web chat with escalation logic' },
        { id: 'ag2', name: 'GST Filing Agent', emoji: 'ðŸ“‹', desc: 'Auto-file GSTR-1, GSTR-3B monthly', tags: ['Python', 'OpenAI', 'GST API'], stars: 267, time: '~35s', prompt: 'Create an AI agent that automatically prepares and files GST returns, reconciles invoices, and alerts on discrepancies' },
        { id: 'ag3', name: 'Inventory Monitor', emoji: 'ðŸ“¦', desc: 'Alert on low stock, auto POs', tags: ['Python', 'ML', 'FastAPI'], stars: 189, time: '~28s', prompt: 'Build an inventory monitoring AI agent that tracks stock levels, predicts demand, and auto-generates purchase orders' },
        { id: 'ag4', name: 'Lead Nurture Agent', emoji: 'ðŸŽ¯', desc: 'Follow up leads via email/WhatsApp', tags: ['OpenAI', 'Twilio', 'CRM'], stars: 445, time: '~32s', prompt: 'Create an AI lead nurturing agent that follows up with prospects via personalized messages across WhatsApp, email, and SMS' },
        { id: 'ag5', name: 'Finance Tracker', emoji: 'ðŸ’¹', desc: 'Monitor cash flow, flag anomalies', tags: ['Python', 'OpenAI', 'PostgreSQL'], stars: 223, time: '~30s', prompt: 'Build a finance monitoring AI agent that tracks transactions, identifies anomalies, and generates weekly cash flow reports' },
        { id: 'ag6', name: 'Scheme Finder Bot', emoji: 'ðŸ›ï¸', desc: 'Match MSME to gov schemes', tags: ['Python', 'OpenAI', 'FastAPI'], stars: 534, time: '~25s', prompt: 'Create an AI agent that matches MSMEs with relevant government schemes based on their profile and auto-generates applications' },
        { id: 'ag7', name: 'Tax Compliance Auditor', emoji: 'âš–ï¸', desc: 'Scan bills for tax leaks', tags: ['Vision AI', 'Python', 'GST'], stars: 278, time: '~40s', prompt: 'Build an AI agent that scans purchase invoices using OCR and identifies missing GST credits or tax discrepancies' },
        { id: 'ag8', name: 'Market Sentiment Agent', emoji: 'ðŸ“Š', desc: 'Trend analysis for local markets', tags: ['Scrapy', 'NLP', 'FastAPI'], stars: 195, time: '~35s', prompt: 'Create an AI agent that monitors social media and local news for textile market trends and competitor pricing shifts' },
        { id: 'ag9', name: 'Auto-Booking Agent', emoji: 'ðŸ“¦', desc: 'AI Logistics & Courier booking', tags: ['Python', 'Delhivery API', 'LLM'], stars: 312, time: '~30s', prompt: 'Create an AI agent that automatically chooses the cheapest courier for an order and books the pickup via API' },
    ],
    website: [
        { id: 'w1', name: 'Business Landing Page', emoji: 'ðŸ¢', desc: 'Professional company website', tags: ['React', 'Tailwind', 'Framer'], stars: 612, time: '~25s', prompt: 'Build a professional landing page for a manufacturing business with hero, services, gallery, and WhatsApp contact' },
        { id: 'w2', name: 'Product Catalog Site', emoji: 'ðŸ›ï¸', desc: 'Showcase products with inquiry', tags: ['Next.js', 'Vercel', 'Sanity'], stars: 334, time: '~30s', prompt: 'Create a product catalog website for a handicraft exporter with photo gallery, product specs, and international inquiry form' },
        { id: 'w3', name: 'Portfolio Site', emoji: 'âœ¨', desc: 'Personal brand & profile', tags: ['React', 'GSAP', 'Netlify'], stars: 287, time: '~20s', prompt: 'Build a personal portfolio website for an MSME founder with achievements, business story, media, and contact form' },
        { id: 'w4', name: 'Event / Trade Fair', emoji: 'ðŸŽª', desc: 'Event registration + agenda', tags: ['Next.js', 'Stripe', 'PostgreSQL'], stars: 178, time: '~35s', prompt: 'Create a trade fair event website with exhibitor registration, agenda display, speaker profiles, and QR-based entry' },
    ],
};

const BUILD_PHASES = [
    { phase: 'Planning', icon: 'ðŸ§ ', color: '#8b5cf6', steps: ['Analyzing requirementsâ€¦', 'Defining architectureâ€¦', 'Planning DB schemaâ€¦', 'Setting up projectâ€¦'] },
    { phase: 'Backend', icon: 'âš™ï¸', color: '#f97316', steps: ['Generating FastAPI routesâ€¦', 'Creating Pydantic modelsâ€¦', 'Setting up PostgreSQLâ€¦', 'Adding JWT authâ€¦', 'Writing testsâ€¦'] },
    { phase: 'Frontend', icon: 'ðŸŽ¨', color: '#3b82f6', steps: ['Building React componentsâ€¦', 'Creating UI layoutsâ€¦', 'Adding state managementâ€¦', 'Connecting APIsâ€¦', 'Adding animationsâ€¦'] },
    { phase: 'Testing', icon: 'ðŸ§ª', color: '#10b981', steps: ['Running unit testsâ€¦', 'Integration testingâ€¦', 'Validating API schemasâ€¦', 'Performance benchmarkâ€¦'] },
    { phase: 'Deploy', icon: 'ðŸš€', color: '#f59e0b', steps: ['Containerizing Dockerâ€¦', 'Setting up CI/CDâ€¦', 'Configuring Nginxâ€¦', 'Finalizing deploymentâ€¦'] },
];

const CODE_SAMPLES = {
    backend: `# ðŸ”¥ FastAPI Backend â€” Auto-generated by OmniForge Nexus
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

    frontend: `// âš¡ React Frontend â€” Auto-generated by OmniForge Nexus
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
      toast.success('Invoice created! ðŸŽ‰');
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

    agent: `# ðŸ¤– AI Agent â€” Auto-generated by OmniForge Nexus
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

    docker: `# ðŸ³ Docker Compose â€” Auto-generated by OmniForge Nexus
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

// â”€â”€ Sub-Components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
                <div style={{ color: '#34d399' }}>omniforge@nexus:~$ <span style={{ color: '#94a3b8' }}>starting build pipelineâ€¦</span></div>
                {logs.map((log, i) => (
                    <div key={i} style={{ color: log.includes('ERROR') ? '#f87171' : log.includes('âœ…') || log.includes('SUCCESS') ? '#34d399' : log.includes('WARNING') ? '#fbbf24' : '#94a3b8' }}>{log}</div>
                ))}
                {error && <div style={{ color: '#f87171', marginTop: 6 }}>âŒ Error: {error}</div>}
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
                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${color}, ${color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                                        {mode === 'agent' ? 'ðŸ¤–' : mode === 'website' ? 'ðŸŒ' : 'ðŸ¢'}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, color: 'var(--t1)', letterSpacing: 1, textTransform: 'uppercase' }}>{appName}</span>
                                        <span style={{ fontSize: 9, color: '#00ff88', fontWeight: 600 }}>â— RUNNING V1.0.0</span>
                                    </div>
                                    <div style={{ flex: 1 }} />
                                    {['Dashboard', 'Analytics', 'System', 'Logs'].map(n => (
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
                                            { label: 'Total API Calls', value: '1,280', delta: '+18%', color },
                                            { label: 'Active Tasks', value: String(app?.apis || 8), delta: '+2', color: '#7b2fff' },
                                            { label: 'DB Latency', value: '14ms', delta: 'Fast', color: '#00ff88' },
                                            { label: 'Uptime', value: '99.9%', delta: 'Live', color: '#ffd700' },
                                        ].map(s => (
                                            <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}20`, borderRadius: 10, padding: '12px 14px' }}>
                                                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                                                <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 3 }}>{s.label}</div>
                                                <div style={{ fontSize: 9.5, color: s.color, marginTop: 4, opacity: 0.8 }}>â†‘ {s.delta}</div>
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
                                                    { no: 'INV-2024-001', cust: 'Mehta Traders', amt: 'â‚¹45,000', gst: 'â‚¹8,100', status: 'Paid', date: '15 Feb' },
                                                    { no: 'INV-2024-002', cust: 'Sharma Textiles', amt: 'â‚¹1,20,000', gst: 'â‚¹21,600', status: 'Pending', date: '18 Feb' },
                                                    { no: 'INV-2024-003', cust: 'Patel Industries', amt: 'â‚¹78,500', gst: 'â‚¹14,130', status: 'Paid', date: '20 Feb' },
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
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--t3)', marginTop: 1 }}>Build #4 Â· 2m 34s</div>
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
                                <button className="btn btn-secondary" style={{ justifyContent: 'center', fontSize: 9.5 }} onClick={() => toast.success('Source code downloaded as omniforge_build.zip', { icon: 'ðŸ“¦' })}>
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

function PreviewPanel({ app, onOpenDeploy, onPushGitHub, githubConnected, mode }) {
    const navigate = useNavigate();
    const { github, setGitHubToken } = useStore();
    const [viewType, setViewType] = useState('ui'); // ui | logs | raw
    const [showQuickConnect, setShowQuickConnect] = useState(false);
    const [quickToken, setQuickToken] = useState('');
    const [connecting, setConnecting] = useState(false);

    const handleQuickConnect = async () => {
        if (!quickToken.trim()) return;
        setConnecting(true);
        const result = await setGitHubToken(quickToken.trim());
        setConnecting(false);
        if (result.success) {
            toast.success('GitHub connected!');
            setShowQuickConnect(false);
        } else {
            toast.error(result.error || 'Failed to connect');
        }
    };

    // Website Live Preview (Real-time iframe)
    const getWebsiteSource = () => {
        if (mode !== 'website' || !app?.result?.files) return null;
        const html = app.result.files['index.html'] || '';
        const css = app.result.files['styles/main.css'] || '';
        const js = app.result.files['js/main.js'] || '';

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>${css}</style>
            </head>
            <body style="margin:0; padding:0; background:#f4f7fb; font-family: sans-serif;">
                ${html}
                <script>${js}</script>
            </body>
            </html>
        `;
    };

    const downloadCode = async () => {
        const filesToDownload = app?.result?.files || {};
        if (!filesToDownload || Object.keys(filesToDownload).length === 0) {
            toast.error('No files generated yet');
            return;
        }

        const loadToast = toast.loading('Bundling project as ZIP...');
        try {
            const payload = {
                project_name: app?.url?.split('.')[0] || 'omniforge_project',
                files: filesToDownload
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
            a.download = `${payload.project_name}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            toast.success('Downloaded Full Stack ZIP!', { id: loadToast });
        } catch (e) {
            console.error(e);
            toast.error('Failed to download project', { id: loadToast });
        }
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
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#34d399' }}>ðŸŽ‰ Build Complete!</div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 1 }}>
                            {app?.files?.length || Object.keys(app?.result?.files || {}).length || 0} files generated by real AI
                        </div>
                    </div>
                    {app?.githubRepo && (
                        <a href={app.githubRepo} target="_blank" rel="noopener noreferrer"
                            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(52,211,153,0.3)', textDecoration: 'none', fontWeight: 700 }}>
                            <GitBranch size={12} /> View on GitHub
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
                    <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 11.5 }} onClick={onOpenDeploy}><ExternalLink size={12} /> Open Demo</button>
                    <button className="btn btn-secondary" style={{ fontSize: 11.5 }} onClick={downloadCode}><Download size={12} /> Download</button>
                </div>
            </div>

            {/* Real-time Content Preview */}
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="dot-live" />
                        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: 1 }}>REAL-TIME {mode?.toUpperCase()} PREVIEW</span>
                    </div>
                </div>
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                    {mode === 'website' ? (
                        <iframe
                            srcDoc={getWebsiteSource()}
                            style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
                            title="Live Preview"
                        />
                    ) : mode === 'agent' ? (
                        <AgentSimulator agent={app} />
                    ) : (
                        <AppSimulator app={app} />
                    )}
                </div>

                {/* Live Output Log at bottom of preview */}
                <div style={{ height: 100, background: 'rgba(0,0,0,0.8)', borderTop: '1px solid var(--border-subtle)', padding: 10, fontFamily: 'var(--font-mono)', fontSize: 9, overflowY: 'auto', color: '#00ff88' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>RUNTIME LOGS (STDOUT)</div>
                    <div>[SYSTEM] Initializing container runtime...</div>
                    <div style={{ color: '#fb923c' }}>[BACKEND] Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)</div>
                    <div>[DB] Connected to PostgreSQL on port 5432</div>
                    <div>[FRONTEND] VITE v5.0.0 ready in 452ms</div>
                    <div style={{ opacity: 0.5 }}>[INFO] Incoming request: GET /api/v1/health</div>
                    <div style={{ opacity: 0.5 }}>[INFO] Incoming request: GET /api/v1/data</div>
                </div>
            </div>

            {/* GitHub Connect / Push */}
            <div style={{ background: githubConnected ? 'rgba(0,255,136,0.04)' : 'rgba(255,255,255,0.025)', border: `1px solid ${githubConnected ? 'rgba(0,255,136,0.2)' : 'var(--border-subtle)'}`, borderRadius: 14, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: githubConnected ? '#34d399' : 'var(--text-primary)', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <GitBranch size={13} />
                            {githubConnected ? 'âœ… GitHub Connected' : 'Connect GitHub'}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {githubConnected ? `Push generated code to @${github?.user?.login}'s repository` : 'Connect your account to enable one-click deployments'}
                        </div>

                        {!githubConnected && showQuickConnect && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                                <input
                                    type="password"
                                    placeholder="Paste GitHub PAT..."
                                    value={quickToken}
                                    onChange={(e) => setQuickToken(e.target.value)}
                                    className="input-field"
                                    style={{ flex: 1, fontSize: 11, padding: '4px 10px', height: 32, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                />
                                <button
                                    onClick={handleQuickConnect}
                                    disabled={connecting || !quickToken}
                                    className="btn btn-primary"
                                    style={{ height: 32, fontSize: 10, padding: '0 12px' }}
                                >
                                    {connecting ? '...' : 'Connect'}
                                </button>
                                <button onClick={() => setShowQuickConnect(false)} className="btn btn-secondary" style={{ height: 32, width: 32, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
                            </motion.div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        {githubConnected ? (
                            <button className="btn btn-primary" style={{ fontSize: 11, padding: '6px 14px' }} onClick={() => onPushGitHub()}>
                                <GitBranch size={13} style={{ marginRight: 4 }} /> Push to GitHub
                            </button>
                        ) : (
                            <>
                                {!showQuickConnect && (
                                    <button
                                        className="btn btn-primary"
                                        style={{ fontSize: 11, padding: '6px 14px' }}
                                        onClick={() => setShowQuickConnect(true)}
                                    >
                                        <Zap size={12} /> Quick Connect
                                    </button>
                                )}
                                <button
                                    className="btn btn-secondary"
                                    style={{ fontSize: 11, padding: '6px 14px' }}
                                    onClick={() => navigate('/settings?tab=deployment')}
                                >
                                    <Settings size={12} /> Config
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: 14 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>ðŸ“¦ Tech Stack Generated</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                    {stackItems.map(s => (
                        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 9px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{String(s.name)}</div>
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
        app: [['âš›ï¸', 'React + TypeScript'], ['âš¡', 'FastAPI Backend'], ['ðŸ—„ï¸', 'PostgreSQL + Redis'], ['ðŸ”', 'JWT Auth'], ['ðŸ³', 'Docker Ready'], ['ðŸ“Š', 'Admin Dashboard']],
        agent: [['ðŸ§ ', 'GPT-4o Powered'], ['ðŸ’¬', 'WhatsApp + Email'], ['ðŸ”„', 'Auto-retry Logic'], ['ðŸ“ˆ', 'Built-in Analytics'], ['â°', 'Scheduled Runs'], ['ðŸ”—', 'API Integrations']],
        website: [['ðŸ“±', 'Mobile-first'], ['ðŸš€', 'Edge Hosting'], ['ðŸ–¼ï¸', 'AI Image Gen'], ['ðŸ“Š', 'SEO Optimized'], ['ðŸ’¬', 'WhatsApp CTA'], ['ðŸŒ', 'Custom Domain']],
        swarm: [['ðŸ', 'Swarm Coordination'], ['ðŸ§ ', 'Multi-Agent Logic'], ['âš¡', 'Real-time Sync'], ['ðŸ”„', 'Task Delegation'], ['ðŸš€', 'Auto-Scaling'], ['ðŸ›¡ï¸', 'Secure Sandbox']],
    };
    const activeFeatures = features[mode] || features.app;
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
                {activeFeatures.map(([icon, text], i) => (
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

// â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    const [streamingText, setStreamingText] = useState('');
    const timerRef = useRef(null);
    const textareaRef = useRef(null);
    const currentMode = MODES.find(m => m.id === mode);
    // GitHub and save from store
    const { github, saveBuiltProject } = useStore();
    const navigate = useNavigate();

    const CODE_TABS = [
        { id: 'backend', label: 'Backend', icon: Server, color: '#f97316', file: 'main.py' },
        { id: 'frontend', label: 'Frontend', icon: FileCode, color: '#3b82f6', file: 'App.tsx' },
        { id: 'agent', label: 'Agent', icon: Bot, color: '#6366f1', file: 'agent.py' },
        { id: 'docker', label: 'Docker', icon: Package, color: '#0ea5e9', file: 'docker-compose.yml' },
    ];

    const cycleSubsteps = useCallback((p) => {
        if (timerRef.current) clearInterval(timerRef.current);
        let s = 0;
        timerRef.current = setInterval(() => {
            s++;
            setStepIdx(s % BUILD_PHASES[p].steps.length);
        }, 800);
    }, []);

    const startBuild = async () => {
        if (!prompt.trim()) return;
        setBuilding(true); setDone(false); setPhase(0); setStepIdx(0);
        setGeneratedFiles({}); setGeneratedResult(null); setStreamingText('');
        setBuiltApp(null); setLogs([]); setStreamError(null); setRightPanel('terminal');

        // Start cycling initial phase (Planning)
        setPhase(0);
        cycleSubsteps(0);

        try {
            const endpoint = mode === 'swarm' ? '/api/v1/multiagent/swarm' : '/api/v1/llm/generate/stream';
            const res = await fetch(endpoint, {
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
                            setLogs(prev => [...prev.slice(-30), `[INFO] [System] ${evt.message || 'ðŸš€ Initializing Swarm Engine...'}`]);
                        } else if (evt.type === 'agent_start') {
                            const agentPhases = { 'Architect': 0, 'Backend': 1, 'Frontend': 2, 'QA': 3, 'Deploy': 4 };
                            const newPhase = agentPhases[evt.agent] ?? -1;
                            if (newPhase !== -1) {
                                setPhase(newPhase);
                                cycleSubsteps(newPhase);
                            }
                            setLogs(prev => [...prev.slice(-30), `[INFO] [Agent] ðŸ¤– ${evt.agent} (${evt.model}) starting...`]);
                            setLogs(prev => [...prev.slice(-30), `[${evt.agent}] ${evt.status}`]);
                        } else if (evt.type === 'agent_complete') {
                            setLogs(prev => [...prev.slice(-30), `[SUCCESS] [Agent] âœ… ${evt.agent} logic complete.`]);
                        } else if (evt.type === 'chunk') {
                            const content = evt.content || '';
                            setStreamingText(prev => prev + content);
                            if (Math.random() > 0.95) {
                                setLogs(prev => [...prev.slice(-30), `[STREAM] ${content.slice(0, 5)}...`]);
                            }
                        } else if (evt.type === 'complete') {
                            const result = evt.result;
                            setGeneratedResult(result);
                            const files = result?.files || {};
                            setGeneratedFiles(files);

                            const fileList = Object.keys(files);
                            setLogs(prev => [...prev.slice(-30), `[SUCCESS] [Builder] âœ… Synthesized ${fileList.length} files.`]);

                            if (timerRef.current) clearInterval(timerRef.current);
                            setBuilding(false);
                            setDone(true);
                            setPhase(4); setStepIdx(3);
                            setRightPanel('preview');

                            const generatedAppData = {
                                url: `${(result?.project_name || result?.agent_name || result?.site_name || 'app').toLowerCase().replace(/\s+/g, '-')}.omniforge.ai`,
                                apis: Object.keys(result?.api_endpoints || {}).length || fileList.length || 8,
                                tables: result?.tables?.length || 6,
                                files: fileList,
                                result,
                            };
                            setBuiltApp(generatedAppData);

                            if (fileList.length > 0) {
                                setSelectedFile(fileList[0]);
                                if (rightPanel !== 'preview') setRightPanel('code');
                            }

                            saveBuiltProject({
                                id: Date.now().toString(),
                                mode: mode,
                                prompt: prompt,
                                files: fileList,
                                githubRepo: null,
                                name: result?.project_name || result?.agent_name || result?.site_name || 'AI Project'
                            });

                            if (github?.connected) {
                                setLogs(prev => [...prev.slice(-30), `[INFO] [Turbo] âš¡ Auto-Deploying to GitHub...`]);
                                pushToGitHub(files);
                            }
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
            setLogs(prev => [...prev.slice(-30), `[ERROR] [System] âŒ ${err.message}`]);
            // Stop animation if still running
            if (timerRef.current) clearInterval(timerRef.current);
            setBuilding(false);
            setDone(false);
        }
    };

    const pushToGitHub = async (filesOverride = null) => {
        const filesToPush = filesOverride || generatedFiles;
        if (!github?.connected) {
            toast.error('Connect your GitHub account in Settings first');
            return;
        }
        if (!filesToPush || Object.keys(filesToPush).length === 0) {
            toast.error('No files to push â€” generate a project first');
            return;
        }
        const repoName = (builtApp?.result?.project_name || builtApp?.result?.agent_name || builtApp?.result?.site_name || 'omniforge-project').toLowerCase().replace(/[^a-z0-9-]/g, '-');

        setLogs(prev => [...prev, `[INFO] [Turbo] ðŸŒ Committing ${Object.keys(filesToPush).length} files via Git Data Tree API...`]);
        setLogs(prev => [...prev, `[INFO] [Turbo] ðŸš„ Atomically syncing to main branch...`]);

        const deployId = toast.loading(`Turbo-Sync: Building Git Tree...`);
        try {
            const res = await fetch('/api/v1/github/repos/push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    github_token: github.token,
                    username: github.user?.login,
                    repo_name: repoName,
                    files: filesToPush,
                    description: `ðŸš€ Turbo-Deploy: ${prompt.slice(0, 50)}`,
                    private: false,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setLogs(prev => [...prev, `[SUCCESS] [Turbo] âœ… Sync Complete! Commit [${data.commit_sha}]`]);
                setLogs(prev => [...prev, `[SUCCESS] [Turbo] ðŸŒ Live Repository: ${data.repo_url}`]);
                toast.success(`ðŸš€ Turbo-Deployed Successfully!`, { id: deployId, duration: 4000 });
                setBuiltApp(prev => ({ ...prev, githubRepo: data.repo_url }));
                setRightPanel('preview');
            } else {
                throw new Error(data.detail || 'Push failed');
            }
        } catch (e) {
            setLogs(prev => [...prev, `[ERROR] [GitHub] âŒ Deployment failed: ${e.message}`]);
            toast.error(`GitHub push failed: ${e.message}`, { id: deployId });
        }
    };

    useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)', flexDirection: 'column' }}>

            {/* â”€â”€ Top Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="vc-topbar">
                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #f97316, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={13} style={{ color: 'white' }} />
                    </div>
                    <div>
                        <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Nexus Coder</div>
                        <div style={{ fontSize: 8.5, color: 'var(--text-muted)', letterSpacing: 1 }}>AI BUILDER Â· MSME PLATFORM</div>
                    </div>
                </div>

                <div style={{ width: 1, height: 24, background: 'var(--border-subtle)', margin: '0 4px' }} />

                {/* Mode Switcher */}
                <div style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.03)', padding: 4, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                    {MODES.map(m => (
                        <motion.button
                            key={m.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => { setMode(m.id); setDone(false); setBuilding(false); setLogs([]); setPrompt(''); if (timerRef.current) clearInterval(timerRef.current); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 9,
                                border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                background: mode === m.id ? `linear-gradient(135deg, ${m.hex}, ${m.hex}cc)` : 'transparent',
                                color: mode === m.id ? 'white' : 'var(--text-muted)',
                                boxShadow: mode === m.id ? `0 4px 15px ${m.hex}40` : 'none',
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            <m.icon size={13} />
                            {m.label}
                            {mode === m.id && (
                                <motion.div layoutId="mode-glow" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', animation: 'sweep 2s linear infinite' }} />
                            )}
                        </motion.button>
                    ))}
                </div>

                <div style={{ width: 1, height: 24, background: 'var(--border-subtle)', margin: '0 4px' }} />

                {/* Right Panel Switcher */}
                <div style={{ display: 'flex', gap: 6, background: 'rgba(0,0,0,0.2)', padding: 4, borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)' }}>
                    {[{ id: 'code', icon: Code2, label: 'Code' }, { id: 'terminal', icon: Terminal, label: 'Terminal' }, { id: 'preview', icon: Eye, label: 'Preview' }].map(p => (
                        <button key={p.id} onClick={() => setRightPanel(p.id)} style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 9,
                            background: rightPanel === p.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                            border: '1px solid ' + (rightPanel === p.id ? 'rgba(255,255,255,0.1)' : 'transparent'),
                            color: rightPanel === p.id ? '#fff' : 'rgba(255,255,255,0.4)',
                            cursor: 'pointer', fontSize: 10.5, fontWeight: 800, transition: 'all 0.2s',
                            letterSpacing: '0.5px', textTransform: 'uppercase'
                        }}>
                            <p.icon size={12} style={{ color: rightPanel === p.id ? '#fb923c' : 'inherit' }} /> {p.label}
                        </button>
                    ))}
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: 7, alignItems: 'center' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
                        background: github?.connected ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-subtle)', borderRadius: 7, cursor: 'pointer'
                    }} onClick={() => navigate('/settings')}>
                        <GitBranch size={12} style={{ color: github?.connected ? '#10b981' : 'var(--text-muted)' }} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: github?.connected ? '#10b981' : 'var(--text-muted)' }}>
                            {github?.connected ? 'GITHUB LINKED' : 'GIT DISCONNECTED'}
                        </span>
                    </div>
                    {done && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="btn btn-primary"
                            style={{ fontSize: 11, padding: '5px 12px' }}
                            onClick={pushToGitHub}
                        >
                            <ExternalLink size={12} /> Live Deploy
                        </motion.button>
                    )}
                    <button className="btn btn-secondary" style={{ fontSize: 11, padding: '5px 10px' }} onClick={() => {
                        setDone(false); setBuilding(false); setBuiltApp(null); setPrompt(''); setLogs([]);
                        setStreamError(null); setGeneratedFiles({}); setGeneratedResult(null);
                        if (timerRef.current) clearInterval(timerRef.current);
                    }}>
                        <RotateCcw size={12} /> Reset
                    </button>
                </div>
            </div>

            {/* â”€â”€ Main Workspace â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
                                    mode === 'app' ? 'Describe your appâ€¦\n\nEx: GST billing app for a textile business with invoice PDF generation'
                                        : mode === 'agent' ? 'Describe your agentâ€¦\n\nEx: AI agent that monitors inventory and sends WhatsApp alerts when stock is low'
                                            : mode === 'swarm' ? 'Describe a complex world-class projectâ€¦\n\nEx: A multi-tenant ERP system for manufacturing with AI planning agents and supply chain tracking'
                                                : 'Describe your websiteâ€¦\n\nEx: Professional website for my handicraft export business with product gallery'
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
                                style={{ padding: '0 12px 14px', flexShrink: 0, overflow: 'hidden' }}>
                                <div style={{ fontSize: 10, fontWeight: 900, color: currentMode.color, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: currentMode.color, boxShadow: `0 0 8px ${currentMode.color}` }} />
                                    Synthesizing {currentMode.label}
                                </div>
                                <BuildPipeline phase={phase} stepIdx={stepIdx} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Templates */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <span style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase' }}>âš¡ Recommended </span>
                            <span style={{ fontSize: 9, background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 20, color: 'var(--text-faint)' }}>{(TEMPLATES[mode] || TEMPLATES.app).length}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {(TEMPLATES[mode] || TEMPLATES.app).map(item => (
                                <TemplateCard key={item.id} item={item} onSelect={setPrompt} active={prompt === item.prompt} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* CENTER: File Tree */}
                <div style={{ width: 220, borderRight: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FolderOpen size={13} style={{ color: '#f59e0b' }} />
                        </div>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: '#eef2ff', letterSpacing: 1.2, textTransform: 'uppercase' }}>Workspace</span>
                        {done && (
                            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ marginLeft: 'auto' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
                            </motion.div>
                        )}
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                        {Object.keys(generatedFiles).length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {Object.keys(generatedFiles).map((file, i) => (
                                    <FileTreeNode key={i} node={{ name: file, type: 'file' }} onSelect={n => setSelectedFile(n.name)} selected={selectedFile} />
                                ))}
                            </div>
                        ) : building ? (
                            <div style={{ padding: '30px 10px', textAlign: 'center' }}>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ margin: '0 auto 12px', width: 24, height: 24, borderRadius: '50%', border: `2px solid ${currentMode.color}40`, borderTopColor: currentMode.color }} />
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Synthesizing Project...</div>
                            </div>
                        ) : (
                            <div style={{ padding: '40px 10px', textAlign: 'center', opacity: 0.4 }}>
                                <Folder size={32} style={{ margin: '0 auto 10px', color: 'var(--text-muted)' }} />
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>No files yet</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Code / Terminal / Preview */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#02040a' }}>
                    {/* Code Tab bar */}
                    {rightPanel === 'code' && (
                        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0, background: 'rgba(0,0,0,0.4)', padding: '0 4px' }}>
                            {CODE_TABS.map(t => (
                                <button key={t.id} onClick={() => setActiveCodeTab(t.id)} style={{
                                    display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px',
                                    border: 'none', borderBottom: `2px solid ${activeCodeTab === t.id ? t.color : 'transparent'}`,
                                    background: activeCodeTab === t.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                                    color: activeCodeTab === t.id ? t.color : 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer', fontSize: 11, fontWeight: 800, transition: 'all 0.2s',
                                    fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.5px'
                                }}>
                                    <t.icon size={12} />{t.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {rightPanel === 'terminal' && (
                        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,0,0,0.3)' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fb923c', boxShadow: '0 0 8px #fb923c' }} />
                            <div style={{ fontSize: 10, fontWeight: 900, color: '#eef2ff', letterSpacing: 1.5, textTransform: 'uppercase' }}>Build Execution Runtime</div>
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600 }}>STREAMING LIVE</span>
                                <span className="dot-live" style={{ width: 6, height: 6 }} />
                            </div>
                        </div>
                    )}

                    {rightPanel === 'preview' && (
                        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,0,0,0.3)' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
                            <div style={{ fontSize: 10, fontWeight: 900, color: '#eef2ff', letterSpacing: 1.5, textTransform: 'uppercase' }}>Live Deployment Preview</div>
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ fontSize: 9, color: '#34d399', fontWeight: 700, background: 'rgba(52,211,153,0.1)', padding: '2px 8px', borderRadius: 100 }}>REAL-TIME SYNC</div>
                            </div>
                        </div>
                    )}

                    <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                        <AnimatePresence mode="wait">
                            {rightPanel === 'code' ? (
                                <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%', padding: 12 }}>
                                    {building && streamingText ? (
                                        <div style={{ height: '100%', position: 'relative' }}>
                                            <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.2)', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(99,102,241,0.3)' }}>
                                                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1' }} />
                                                <span style={{ fontSize: 9, fontWeight: 900, color: '#6366f1', letterSpacing: 1 }}>RAW STREAM</span>
                                            </div>
                                            <CodePanel
                                                code={streamingText + ' â–ˆ'}
                                                filename="stream_buffer.json"
                                            />
                                        </div>
                                    ) : done || building ? (
                                        <CodePanel
                                            code={
                                                selectedFile && generatedFiles[selectedFile]
                                                    ? generatedFiles[selectedFile]
                                                    : (generatedFiles && Object.keys(generatedFiles).length > 0
                                                        ? Object.values(generatedFiles)[0]
                                                        : CODE_SAMPLES[activeCodeTab])
                                            }
                                            filename={selectedFile || (CODE_TABS.find(t => t.id === activeCodeTab)?.file || 'file')}
                                        />
                                    ) : (
                                        <EmptyState mode={mode} />
                                    )}
                                </motion.div>
                            ) : rightPanel === 'terminal' ? (
                                <motion.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%', padding: 12 }}>
                                    <TerminalPanel logs={logs} error={streamError} />
                                </motion.div>
                            ) : (
                                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%', padding: 12 }}>
                                    {done ? <PreviewPanel app={builtApp} onOpenDeploy={() => setShowDeployModal(true)} onPushGitHub={pushToGitHub} githubConnected={github?.connected} mode={mode} /> : streamError ? (
                                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: '#ef4444', textAlign: 'center', padding: 20 }}>
                                            <AlertCircle size={36} />
                                            <div style={{ fontSize: 14, fontWeight: 700 }}>Build Failed</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 300 }}>{streamError}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 8 }}>
                                                Check your OpenRouter API Key in <code>backend/.env</code> or your account credits.
                                            </div>
                                            <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={startBuild}>Retry Build</button>
                                        </div>
                                    ) : (
                                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, color: 'var(--text-muted)' }}>
                                            <div style={{ position: 'relative' }}>
                                                <Eye size={44} style={{ opacity: 0.1 }} />
                                                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <div style={{ width: 40, height: 40, border: '1px solid var(--cyan)', borderRadius: '50%', opacity: 0.3 }} />
                                                </motion.div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>Awaiting Generation</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>Describe your vision to see it come to life.</div>
                                            </div>
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
                            <span style={{ fontSize: 9, color: '#f97316', marginLeft: 4 }}>â— Claude 3.5 Sonnet</span>
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
                        <div className="section-label" style={{ fontSize: 9, marginBottom: 8 }}>ðŸ’¡ AI SUGGESTIONS</div>
                        {(generatedResult?.suggestions || [
                            { icon: 'ðŸ”’', text: 'Add rate limiting to API endpoints', type: 'Security' },
                            { icon: 'âš¡', text: 'Enable Redis caching for 2x speed boost', type: 'Performance' },
                            { icon: 'ðŸ“±', text: 'Add PWA support for mobile users', type: 'UX' },
                            { icon: 'ðŸ§ª', text: 'Generate unit tests with pytest', type: 'Testing' },
                            { icon: 'ðŸ“Š', text: 'Connect Mixpanel for user analytics', type: 'Analytics' },
                        ]).slice(0, 5).map((tip, i) => (
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
                                placeholder="Ask AI anythingâ€¦"
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

function AppSimulator({ app }) {
    const color = '#3b82f6';
    const result = app?.result || {};
    const appName = result?.project_name || 'AI Application';
    const features = result?.features || ['Database Management', 'Auth Integration', 'API Routing'];
    const techItems = result?.tech_stack ? Object.entries(result.tech_stack) : [['frontend', 'React'], ['backend', 'FastAPI']];

    return (
        <div style={{ height: '100%', background: '#0a1122', display: 'flex', flexDirection: 'column', color: '#eef2ff' }}>
            <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${color}, #2563eb)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, boxShadow: `0 4px 12px ${color}30` }}>ðŸ¢</div>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>{appName}</div>
                    <div style={{ fontSize: 9, color: '#34d399', fontWeight: 700, marginTop: 2 }}>PRODUCTION READY â€¢ v1.0.0</div>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.3)' }}>API STATUS</span>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                </div>
            </div>
            <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                    {techItems.map(([key, value]) => (
                        <div key={key} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                            <div style={{ fontSize: 13, fontWeight: 900, color: '#6366f1', textTransform: 'uppercase' }}>{value}</div>
                            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', marginTop: 4, fontWeight: 700, letterSpacing: 0.5 }}>{key}</div>
                        </div>
                    ))}
                </div>

                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        INTEGRATED FEATURES
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {features.slice(0, 6).map((f, i) => (
                            <div key={i} style={{ padding: '10px 12px', background: 'rgba(16,185,129,0.03)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Check size={10} style={{ color: '#10b981' }} />
                                <span style={{ fontSize: 11, color: '#eef2ff', fontWeight: 500 }}>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.015)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>LIVE API MONITOR</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>REAL-TIME TRAFFIC</div>
                    </div>
                    {[
                        { method: 'GET', path: '/api/v1/data', time: '14ms', status: 200 },
                        { method: 'POST', path: '/api/v1/auth', time: '42ms', status: 201 },
                        { method: 'GET', path: '/api/v1/health', time: '8ms', status: 200 },
                    ].map((entry, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                            <div style={{ fontSize: 9, fontWeight: 900, color: entry.method === 'POST' ? '#f59e0b' : '#10b981', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: 4, width: 40, textAlign: 'center' }}>{entry.method}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-mono)', flex: 1 }}>{entry.path}</div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{entry.time}</div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#10b981' }}>{entry.status}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AgentSimulator({ agent }) {
    const color = '#8b5cf6';
    const result = agent?.result || {};
    const agentName = result?.agent_name || 'AI Assistant';
    const capabilities = result?.capabilities || ['Natural Language Processing', 'Tool Execution', 'Context Management'];

    return (
        <div style={{ height: '100%', background: '#0a0f1d', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: `linear-gradient(135deg, ${color}, #7c3aed)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, boxShadow: `0 4px 10px ${color}30` }}>ðŸ¤–</div>
                <div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: 'white' }}>{agentName}</div>
                    <div style={{ fontSize: 8.5, color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase' }}>Autonomous Engine</div>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                    <div style={{ fontSize: 9, color: '#10b981', fontWeight: 800 }}>ACTIVE</div>
                </div>
            </div>
            <div style={{ flex: 1, padding: 18, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.04)', padding: '12px 16px', borderRadius: '18px 18px 18px 4px', maxWidth: '85%', fontSize: 12, lineHeight: 1.6, color: '#eef2ff', border: '1px solid rgba(255,255,255,0.05)' }}>
                    Greetings. I am **{agentName}**. My neural weights have been initialized for your specific task description.
                    I have verified my core capabilities and I am ready to operate.
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '4px 0' }}>
                    {capabilities.map((cap, i) => (
                        <div key={i} style={{ fontSize: 9, fontWeight: 800, color: color, background: `${color}15`, padding: '4px 10px', borderRadius: 100, border: `1px solid ${color}30` }}>
                            âš¡ {cap.toUpperCase()}
                        </div>
                    ))}
                </div>

                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.04)', padding: '12px 16px', borderRadius: '18px 18px 18px 4px', maxWidth: '85%', fontSize: 12, color: 'white', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #10b981', borderTopColor: 'transparent', animation: 'spin 1.5s linear infinite' }} />
                        <span style={{ fontSize: 10, fontWeight: 900, color: '#10b981', letterSpacing: 0.5 }}>ORCHESTRATING TOOLS...</span>
                    </div>
                    Successfully hooked into system environment. Monitoring 14 distinct data streams. Zero anomalies detected in current cycle.
                </div>
            </div>
            <div style={{ padding: 14, borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 14px', color: 'rgba(255,255,255,0.2)', fontSize: 12.5, fontWeight: 500 }}>
                        Issue command to agent...
                    </div>
                    <div style={{ width: 38, height: 38, borderRadius: 12, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'not-allowed' }}>
                        <Send size={16} />
                    </div>
                </div>
            </div>
        </div>
    );
}
