import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Users, Key, Eye, AlertTriangle, CheckCircle2, Clock, Activity, Globe } from 'lucide-react';
import Header from '../components/Header';

const AUDIT_LOGS = [
    { event: 'User Login', user: 'rahul@omniforge.ai', ip: '103.84.12.5', time: '2m ago', status: 'success' },
    { event: 'API Key Created', user: 'admin@omniforge.ai', ip: '103.84.12.5', time: '15m ago', status: 'success' },
    { event: 'App Deployed', user: 'rahul@omniforge.ai', ip: '103.84.12.5', time: '1h ago', status: 'success' },
    { event: 'Failed Login Attempt', user: 'unknown', ip: '45.155.201.3', time: '2h ago', status: 'failed' },
    { event: 'Schema Modified', user: 'rahul@omniforge.ai', ip: '103.84.12.5', time: '3h ago', status: 'success' },
];

const SECURITY_CHECKS = [
    { label: 'JWT Token Expiry', status: 'pass', detail: '15 min access, 7d refresh' },
    { label: 'RBAC Policies', status: 'pass', detail: 'Admin, Developer, Viewer roles' },
    { label: 'Rate Limiting', status: 'pass', detail: '1000 req/min per tenant' },
    { label: 'Input Validation', status: 'pass', detail: 'Pydantic schemas on all endpoints' },
    { label: 'SQL Injection Prevention', status: 'pass', detail: 'ORM-based queries only' },
    { label: 'CORS Policy', status: 'pass', detail: 'Allowlist-based origins' },
    { label: 'Secret Rotation', status: 'warn', detail: 'SendGrid key rotation overdue' },
    { label: 'HTTPS Enforcement', status: 'pass', detail: 'TLS 1.3 on all endpoints' },
];

export default function Security() {
    const [tab, setTab] = useState('overview');
    return (
        <div className="flex-1 overflow-y-auto">
            <Header title="Security Center" subtitle="Zero-trust security, RBAC, audit logs, and compliance monitoring" />
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: 'Security Score', value: '94/100', icon: Shield, color: '#10b981' },
                        { label: 'Active Sessions', value: '3', icon: Users, color: '#6366f1' },
                        { label: 'Audit Events (24h)', value: '1,284', icon: Activity, color: '#06b6d4' },
                        { label: 'Threats Blocked', value: '47', icon: AlertTriangle, color: '#f59e0b' },
                    ].map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card p-4 flex items-center gap-3">
                            <div className="p-2.5 rounded-xl" style={{ background: `${s.color}18` }}><s.icon size={16} style={{ color: s.color }} /></div>
                            <div><p className="text-xs text-slate-500">{s.label}</p><p className="text-xl font-bold text-white text-display">{s.value}</p></div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Security Checks */}
                    <div className="card p-5">
                        <h3 className="text-sm font-semibold text-white mb-4">Security Checks</h3>
                        <div className="space-y-2">
                            {SECURITY_CHECKS.map(check => (
                                <div key={check.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                    {check.status === 'pass'
                                        ? <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                                        : <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
                                    }
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-white">{check.label}</p>
                                        <p className="text-[10px] text-slate-500">{check.detail}</p>
                                    </div>
                                    <span className={`tag text-[9px] py-0 ${check.status === 'pass' ? 'tag-success' : 'tag-warning'}`}>
                                        {check.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Audit Logs */}
                    <div className="card p-5">
                        <h3 className="text-sm font-semibold text-white mb-4">Audit Logs</h3>
                        <div className="space-y-2">
                            {AUDIT_LOGS.map((log, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${log.status === 'success' ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
                                        {log.status === 'success' ? <CheckCircle2 size={11} className="text-emerald-400" /> : <AlertTriangle size={11} className="text-red-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-white">{log.event}</p>
                                        <p className="text-[10px] text-slate-500">{log.user} • {log.ip}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-600 flex-shrink-0">{log.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
