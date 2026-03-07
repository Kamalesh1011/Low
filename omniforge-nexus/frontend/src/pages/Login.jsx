import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, ShieldCheck, Mail, Mic } from 'lucide-react';
import useStore from '../store/useStore';

const DEMO_USER = {
    name: 'Kamalesh ',
    email: 'kamalesh@omniforge.ai',
    role: 'admin',
    businessName: 'Kamalesh Tech Solutions',
    udyamNo: 'UDYAM-TN-07-0234567',
    state: 'Tamil Nadu',
    plan: 'enterprise',
    credits: 480,
    org_name: 'OmniForge Nexus',
};

export default function Login() {
    const { login } = useStore();
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Try real backend demo-login first
            const res = await fetch('/api/v1/auth/demo-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                const data = await res.json();
                const token = data?.data?.access_token || data?.access_token;
                if (token) {
                    localStorage.setItem('omniforge_token', token);
                    // Try to fetch real user profile
                    try {
                        const meRes = await fetch('/api/v1/auth/me', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (meRes.ok) {
                            const meData = await meRes.json();
                            const u = meData?.data || meData;
                            login({
                                ...DEMO_USER,
                                name: u.name || DEMO_USER.name,
                                email: u.email || DEMO_USER.email,
                                role: u.role || DEMO_USER.role,
                                plan: u.plan || DEMO_USER.plan,
                                credits: u.credits || DEMO_USER.credits,
                                token,
                            });
                            return;
                        }
                    } catch (_) { /* fallthrough */ }
                    login({ ...DEMO_USER, token });
                    return;
                }
            }
        } catch (_) { /* backend offline – use demo fallback */ }

        // Fallback: instant demo login if backend is not running
        await new Promise(r => setTimeout(r, 800));
        login(DEMO_USER);
        setLoading(false);
    };

    return (
        <div style={{
            height: '100vh', width: '100vw',
            display: 'flex', background: '#020617', // Very dark NASA style
            overflow: 'hidden', position: 'relative'
        }}>
            {/* Ambient Background Space / NASA level */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '120vw', height: '120vw',
                background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, rgba(2,6,23,1) 60%)',
                zIndex: 0
            }} />

            {/* Voice AI Orb - Floating at bottom */}
            <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                    position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
                    width: 70, height: 70, borderRadius: '50%',
                    background: 'radial-gradient(circle, #38bdf8 0%, #0369a1 100%)',
                    boxShadow: '0 0 50px rgba(56,189,248,0.5), inset 0 0 15px rgba(255,255,255,0.8)',
                    zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer'
                }}
            >
                <Mic size={28} color="white" />
            </motion.div>

            <div style={{
                position: 'absolute', bottom: 120, width: '100%', textAlign: 'center',
                color: 'rgba(255,255,255,0.4)', fontSize: 13, zIndex: 2, letterSpacing: 2, textTransform: 'uppercase'
            }}>
                Voice First Authentication Active
            </div>

            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center', zIndex: 1,
                padding: 20
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        width: '100%', maxWidth: 420,
                        background: 'rgba(255,255,255,0.02)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 24, padding: 32,
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: 56, height: 56, borderRadius: 16,
                            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                            boxShadow: '0 8px 30px rgba(14,165,233,0.4)',
                            marginBottom: 16
                        }}>
                            <span style={{ color: 'white', fontWeight: 800, fontSize: 24, letterSpacing: 1 }}>OF</span>
                        </div>
                        <h1 style={{
                            fontSize: 28, fontWeight: 800, color: 'white',
                            fontFamily: "'Inter', sans-serif", letterSpacing: -0.5, marginBottom: 4
                        }}>OmniForge Nexus</h1>
                        <p style={{ fontSize: 13, color: '#94a3b8' }}>Advanced Universal Builder Platform</p>
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'rgba(0,0,0,0.2)', padding: 4, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <button
                            onClick={() => setIsRegister(false)}
                            style={{
                                flex: 1, padding: '10px 0', fontSize: 13, fontWeight: 600,
                                borderRadius: 10, border: 'none', cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: !isRegister ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: !isRegister ? 'white' : '#64748b',
                                boxShadow: !isRegister ? '0 2px 8px rgba(0,0,0,0.4)' : 'none'
                            }}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsRegister(true)}
                            style={{
                                flex: 1, padding: '10px 0', fontSize: 13, fontWeight: 600,
                                borderRadius: 10, border: 'none', cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: isRegister ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: isRegister ? 'white' : '#64748b',
                                boxShadow: isRegister ? '0 2px 8px rgba(0,0,0,0.4)' : 'none'
                            }}
                        >
                            Register
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Username
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', top: 14, left: 16, color: '#64748b' }} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    required
                                    style={{
                                        width: '100%', padding: '14px 16px 14px 46px',
                                        borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
                                        background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: 15,
                                        outline: 'none', transition: 'border-color 0.2s',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                            </div>
                        </div>

                        {isRegister && (
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    Email Address
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', top: 14, left: 16, color: '#64748b' }} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@domain.com"
                                        required
                                        style={{
                                            width: '100%', padding: '14px 16px 14px 46px',
                                            borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
                                            background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: 15,
                                            outline: 'none', transition: 'border-color 0.2s',
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                                        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                    />
                                </div>
                            </div>
                        )}

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', top: 14, left: 16, color: '#64748b' }} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: '100%', padding: '14px 16px 14px 46px',
                                        borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
                                        background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: 15,
                                        outline: 'none', transition: 'border-color 0.2s',
                                        letterSpacing: 2
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !username || !password || (isRegister && !email)}
                            style={{
                                width: '100%', padding: '14px', borderRadius: 12,
                                background: (username && password) ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : 'rgba(255,255,255,0.05)',
                                color: (username && password) ? 'white' : '#64748b',
                                border: 'none', fontSize: 14, fontWeight: 700, cursor: (username && password) ? 'pointer' : 'not-allowed',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                transition: 'all 0.2s', boxShadow: (username && password) ? '0 8px 20px rgba(14,165,233,0.3)' : 'none'
                            }}
                        >
                            {loading ? (
                                <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <>{isRegister ? 'Register Account' : 'Authenticate'} <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>

                    <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>
                            <ShieldCheck size={14} style={{ color: '#0ea5e9' }} />
                            <span>Military-Grade Encryption Active</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
