import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ArrowUpRight, Building2, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import Header from '../components/Header';
import useStore from '../store/useStore';

const BANKS = [
    { name: 'State Bank of India', icon: '🏛️', schemes: ['MUDRA', 'SME Loan', 'Startup India'] },
    { name: 'Punjab National Bank', icon: '🏦', schemes: ['MUDRA', 'MSME Loan', 'Stand-Up India'] },
    { name: 'Bank of Baroda', icon: '🏦', schemes: ['MUDRA', 'SME Loan', 'CGTMSE'] },
    { name: 'HDFC Bank', icon: '💳', schemes: ['SME Loan', 'Business Growth', 'Working Capital'] },
    { name: 'SIDBI', icon: '⚡', schemes: ['MSME Loan', 'Imprint Scheme', 'CGTMSE'] },
    { name: 'ICICI Bank', icon: '🌐', schemes: ['SME Loan', 'Working Capital', 'Trade Finance'] },
];

const LOAN_TYPES = [
    { type: 'Term Loan', emoji: '📅', desc: 'Fixed period loan for business expansion', rate: '9%-14%', max: '₹5 Crore' },
    { type: 'Working Capital', emoji: '⚙️', desc: 'Day-to-day operational expenses', rate: '10%-15%', max: '₹2 Crore' },
    { type: 'MUDRA Loan', emoji: '🏦', desc: 'Collateral-free for micro enterprises', rate: '7.5%-12%', max: '₹10 Lakh' },
    { type: 'Export Credit', emoji: '🌏', desc: 'Pre/Post shipment financing for exporters', rate: '7%-11%', max: '₹10 Crore' },
    { type: 'Equipment Finance', emoji: '🔧', desc: 'For purchase of machinery & equipment', rate: '9%-13%', max: '₹3 Crore' },
    { type: 'Invoice Financing', emoji: '📄', desc: 'Against receivables via TReDS platform', rate: '8%-12%', max: 'Unlimited' },
];

const CALC_STEPS = [
    'Udyam Registration', 'Bank Statement (12M)', 'Business Plan', 'Collateral (if any)', 'Apply Online'
];

export default function Loans() {
    const { loanApplications } = useStore();
    const [loanAmount, setLoanAmount] = useState(500000);
    const [tenure, setTenure] = useState(36);
    const [rate, setRate] = useState(10.5);

    const monthlyEMI = ((loanAmount * (rate / 100 / 12) * Math.pow(1 + rate / 100 / 12, tenure)) /
        (Math.pow(1 + rate / 100 / 12, tenure) - 1)).toFixed(0);

    const totalPayable = (monthlyEMI * tenure).toFixed(0);
    const totalInterest = (totalPayable - loanAmount).toFixed(0);

    return (
        <div style={{ flex: 1, overflowY: 'auto' }}>
            <Header
                title="Loans & Finance"
                subtitle="All loan options and EMI calculator for MSME"
            />

            <div className="page-content" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* My Applications */}
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
                            📋 My Applications
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {loanApplications.map(app => (
                                <motion.div key={app.id} whileHover={{ x: 4 }} className="card card-p-sm" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <span style={{ fontSize: 24 }}>{app.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{app.bank}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{app.scheme} · Applied {app.appliedOn}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 14, fontWeight: 800, color: app.color, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{app.amount}</div>
                                        <span className={`badge ${app.status === 'approved' ? 'badge-green' : 'badge-warning'}`} style={{ fontSize: 10 }}>
                                            {app.status === 'approved' ? '✓ Approved' : '⟳ Processing'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Loan Types */}
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
                            💼 Loan Types
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            {LOAN_TYPES.map((loan, i) => (
                                <motion.div
                                    key={loan.type}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    className="card card-p-sm"
                                    style={{ cursor: 'pointer' }}
                                    whileHover={{ y: -3, borderColor: 'rgba(249,115,22,0.3)' }}
                                >
                                    <div style={{ fontSize: 24, marginBottom: 8 }}>{loan.emoji}</div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{loan.type}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10 }}>{loan.desc}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Rate</div>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: '#fb923c' }}>{loan.rate}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Max</div>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{loan.max}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Banks */}
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
                            🏦 Lending Partners
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                            {BANKS.map(bank => (
                                <div key={bank.name} className="card card-p-sm" style={{ textAlign: 'center', cursor: 'pointer' }}>
                                    <div style={{ fontSize: 26, marginBottom: 6 }}>{bank.icon}</div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{bank.name}</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {bank.schemes.map(s => (
                                            <span key={s} className="badge badge-muted" style={{ fontSize: 9, justifyContent: 'center' }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 0 }}>
                    {/* EMI Calculator */}
                    <div className="card card-p" style={{ border: '1px solid rgba(249,115,22,0.2)' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
                            🧮 EMI Calculator
                        </div>

                        {[
                            { label: 'Loan Amount (₹)', val: loanAmount, set: setLoanAmount, min: 10000, max: 10000000, step: 10000 },
                            { label: 'Tenure (months)', val: tenure, set: setTenure, min: 6, max: 120, step: 6 },
                            { label: 'Interest Rate (%)', val: rate, set: setRate, min: 6, max: 20, step: 0.5 },
                        ].map(item => (
                            <div key={item.label} style={{ marginBottom: 14 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.label}</span>
                                    <strong style={{ fontSize: 12, color: 'var(--text-primary)' }}>
                                        {item.label.includes('Amount') ? `₹${item.val.toLocaleString('en-IN')}` : item.val}
                                    </strong>
                                </div>
                                <input
                                    type="range"
                                    min={item.min} max={item.max} step={item.step}
                                    value={item.val}
                                    onChange={e => item.set(Number(e.target.value))}
                                    style={{ width: '100%', accentColor: '#f97316' }}
                                />
                            </div>
                        ))}

                        <div className="divider" />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            {[
                                { l: 'Monthly EMI', v: `₹${Number(monthlyEMI).toLocaleString('en-IN')}`, color: '#f97316' },
                                { l: 'Total Payable', v: `₹${Number(totalPayable).toLocaleString('en-IN')}`, color: 'var(--text-primary)' },
                                { l: 'Total Interest', v: `₹${Number(totalInterest).toLocaleString('en-IN')}`, color: '#f87171' },
                                { l: 'Tenure', v: `${tenure} months`, color: '#818cf8' },
                            ].map(item => (
                                <div key={item.l} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3 }}>{item.l}</div>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: item.color, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{item.v}</div>
                                </div>
                            ))}
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}>
                            Apply Now
                        </button>
                    </div>

                    {/* How to Apply */}
                    <div className="card card-p-sm">
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>📋 How to Apply</div>
                        {CALC_STEPS.map((step, i) => (
                            <div key={step} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0', borderBottom: i < CALC_STEPS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fb923c', flexShrink: 0 }}>{i + 1}</div>
                                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif" }}>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
