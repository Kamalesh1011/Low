import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3, TrendingUp, Activity, Zap, Clock, Users,
    Globe, Server, Cpu, Database, AlertTriangle, CheckCircle2,
    Download, Calendar, RefreshCw, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import Header from '../components/Header';

const apiCallsData = [
    { day: 'Mon', calls: 142000, errors: 280 },
    { day: 'Tue', calls: 198000, errors: 156 },
    { day: 'Wed', calls: 245000, errors: 392 },
    { day: 'Thu', calls: 187000, errors: 210 },
    { day: 'Fri', calls: 312000, errors: 445 },
    { day: 'Sat', calls: 268000, errors: 189 },
    { day: 'Sun', calls: 156000, errors: 98 },
];

const buildTimeData = [
    { hour: '00', time: 42 }, { hour: '04', time: 38 }, { hour: '08', time: 55 },
    { hour: '12', time: 48 }, { hour: '16', time: 44 }, { hour: '20', time: 41 },
    { hour: '23', time: 39 },
];

const modelUsage = [
    { name: 'GPT-4o', value: 38, color: '#10a37f' },
    { name: 'Claude 3.5', value: 28, color: '#d97706' },
    { name: 'DeepSeek R1', value: 18, color: '#6366f1' },
    { name: 'Gemini 1.5', value: 10, color: '#4285f4' },
    { name: 'Others', value: 6, color: '#475569' },
];

const deploymentRegions = [
    { region: 'Mumbai (AP)', builds: 89, pct: 35 },
    { region: 'Singapore', builds: 54, pct: 21 },
    { region: 'US East', builds: 48, pct: 19 },
    { region: 'EU West', builds: 38, pct: 15 },
    { region: 'Others', builds: 26, pct: 10 },
];

const systemHealth = [
    { metric: 'CPU', value: 42, color: '#6366f1' },
    { metric: 'Memory', value: 68, color: '#06b6d4' },
    { metric: 'Storage', value: 31, color: '#10b981' },
    { metric: 'Network', value: 55, color: '#f59e0b' },
    { metric: 'Cache Hit', value: 94, color: '#ec4899' },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div className="glass-strong border border-white/10 rounded-xl px-4 py-3 text-xs shadow-xl">
                <p className="text-slate-400 mb-2 font-medium">{label}</p>
                {payload.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
                        <span className="text-slate-300">{p.name}: </span>
                        <span className="font-bold text-white">{typeof p.value === 'number' && p.value > 1000 ? `${(p.value / 1000).toFixed(1)}K` : p.value}{p.name === 'time' ? 's' : ''}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const MetricCard = ({ label, value, change, positive, icon: Icon, color, sub }) => (
    <div className="card p-5">
        <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-xl" style={{ background: `${color}15` }}>
                <Icon size={16} style={{ color }} />
            </div>
            <div className={`flex items-center gap-1 text-[11px] font-medium ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {change}
            </div>
        </div>
        <p className="text-2xl font-bold text-white text-display">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
        {sub && <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>}
    </div>
);

export default function Analytics() {
    const [timeRange, setTimeRange] = useState('7d');

    return (
        <div className="flex-1 overflow-y-auto">
            <Header title="Analytics & Observability" subtitle="Real-time platform metrics, performance, and cost insights" />

            <div className="p-6 space-y-6">
                {/* Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {['24h', '7d', '30d', '90d'].map(r => (
                            <button
                                key={r}
                                onClick={() => setTimeRange(r)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${timeRange === r ? 'bg-indigo-500 text-white' : 'btn-ghost'
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="btn-ghost text-xs flex items-center gap-1.5">
                            <RefreshCw size={12} /> Refresh
                        </button>
                        <button className="btn-secondary text-xs flex items-center gap-1.5">
                            <Download size={12} /> Export Report
                        </button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { label: 'Total API Calls', value: '2.41M', change: '+18%', positive: true, icon: Zap, color: '#6366f1', sub: 'vs last week' },
                        { label: 'Apps Generated', value: '156', change: '+12', positive: true, icon: Activity, color: '#10b981', sub: 'this month' },
                        { label: 'Avg Build Time', value: '45s', change: '-5s', positive: true, icon: Clock, color: '#06b6d4', sub: 'faster than last week' },
                        { label: 'Active Users', value: '1,284', change: '+8%', positive: true, icon: Users, color: '#f59e0b', sub: 'daily active' },
                        { label: 'Error Rate', value: '0.12%', change: '-0.03%', positive: true, icon: AlertTriangle, color: '#ef4444', sub: 'below SLA threshold' },
                        { label: 'SLA Uptime', value: '99.98%', change: '+0.01%', positive: true, icon: CheckCircle2, color: '#ec4899', sub: 'last 30 days' },
                    ].map((m, i) => (
                        <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <MetricCard {...m} />
                        </motion.div>
                    ))}
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* API Calls Chart */}
                    <div className="lg:col-span-2 card p-5">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-sm font-semibold text-white">API Traffic</h3>
                                <p className="text-xs text-slate-500">Calls & errors over the last 7 days</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={apiCallsData} barGap={4}>
                                <defs>
                                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.4} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="calls" name="API Calls" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="errors" name="Errors" fill="rgba(239,68,68,0.6)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* AI Model Usage */}
                    <div className="card p-5">
                        <h3 className="text-sm font-semibold text-white mb-5">Model Distribution</h3>
                        <ResponsiveContainer width="100%" height={150}>
                            <PieChart>
                                <Pie data={modelUsage} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                                    {modelUsage.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2 mt-4">
                            {modelUsage.map(m => (
                                <div key={m.name} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.color }} />
                                    <span className="text-xs text-slate-400 flex-1">{m.name}</span>
                                    <div className="w-16 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: m.color }} />
                                    </div>
                                    <span className="text-[10px] text-slate-500 w-8 text-right">{m.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Build Time Trend */}
                    <div className="card p-5">
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-white">Build Time Trend</h3>
                            <p className="text-xs text-slate-500">Average app generation time (seconds)</p>
                        </div>
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={buildTimeData}>
                                <defs>
                                    <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="hour" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}:00`} />
                                <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} domain={[30, 65]} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="time" name="time" stroke="#06b6d4" fill="url(#timeGrad)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Deployment Regions */}
                    <div className="card p-5">
                        <h3 className="text-sm font-semibold text-white mb-4">App Deployments by Region</h3>
                        <div className="space-y-3">
                            {deploymentRegions.map((r, i) => (
                                <div key={r.region} className="flex items-center gap-3">
                                    <span className="text-xs text-slate-400 w-28 flex-shrink-0">{r.region}</span>
                                    <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${r.pct}%` }}
                                            transition={{ delay: i * 0.1, duration: 0.6 }}
                                            className="h-full rounded-full"
                                            style={{
                                                background: `linear-gradient(90deg, #6366f1, #ec4899)`
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 w-20 justify-end">
                                        <span className="text-xs font-medium text-white">{r.builds}</span>
                                        <span className="text-[10px] text-slate-600">({r.pct}%)</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* System Health */}
                        <div className="mt-5 pt-4 border-t border-white/[0.06]">
                            <h4 className="text-xs font-semibold text-slate-400 mb-3">System Health</h4>
                            <div className="grid grid-cols-5 gap-2">
                                {systemHealth.map(s => (
                                    <div key={s.metric} className="text-center">
                                        <div className="relative w-10 h-10 mx-auto mb-1">
                                            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                                                <circle cx="18" cy="18" r="15" stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none" />
                                                <circle
                                                    cx="18" cy="18" r="15"
                                                    stroke={s.color}
                                                    strokeWidth="3"
                                                    fill="none"
                                                    strokeDasharray={`${s.value * 0.942} 100`}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-[8px] font-bold" style={{ color: s.color }}>{s.value}%</span>
                                            </div>
                                        </div>
                                        <p className="text-[9px] text-slate-600">{s.metric}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
