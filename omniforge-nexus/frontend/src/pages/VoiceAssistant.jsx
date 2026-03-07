import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Globe, RefreshCw, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import useStore from '../store/useStore';

const LANGUAGES = [
    { code: 'en-IN', label: 'English', name: 'English (India)', flag: '🇮🇳' },
    { code: 'hi-IN', label: 'हिंदी', name: 'Hindi', flag: '🇮🇳' },
    { code: 'mr-IN', label: 'मराठी', name: 'Marathi', flag: '🇮🇳' },
    { code: 'ta-IN', label: 'தமிழ்', name: 'Tamil', flag: '🇮🇳' },
    { code: 'te-IN', label: 'తెలుగు', name: 'Telugu', flag: '🇮🇳' },
    { code: 'gu-IN', label: 'ગુજરાતી', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'bn-IN', label: 'বাংলা', name: 'Bengali', flag: '🇮🇳' },
    { code: 'kn-IN', label: 'ಕನ್ನಡ', name: 'Kannada', flag: '🇮🇳' },
    { code: 'pa-IN', label: 'ਪੰਜਾਬੀ', name: 'Punjabi', flag: '🇮🇳' },
    { code: 'ml-IN', label: 'മലയാളം', name: 'Malayalam', flag: '🇮🇳' },
    { code: 'or-IN', label: 'ଓଡ଼ିଆ', name: 'Odia', flag: '🇮🇳' },
    { code: 'as-IN', label: 'অসমীয়া', name: 'Assamese', flag: '🇮🇳' },
    { code: 'ur-IN', label: 'اردو', name: 'Urdu', flag: '🇮🇳' },
];

const SAMPLE_QUERIES = [
    { text: 'How to apply for MUDRA loan?', lang: 'en-IN' },
    { text: 'What are the benefits of Udyam registration?', lang: 'en-IN' },
    { text: 'What is the eligibility for PMEGP scheme?', lang: 'en-IN' },
    { text: 'When to file GST returns?', lang: 'en-IN' },
];

const RESPONSES = {
    'MUDRA': `MUDRA Loan Apply करने के लिए:\n\n1️⃣ **Shishu**: ₹50,000 तक - कोई guarantee नहीं\n2️⃣ **Kishore**: ₹50K-5L - small business के लिए\n3️⃣ **Tarun**: ₹5L-10L - established business\n\n📌 Apply करें: mudra.org.in या नजदीकी SBI/PNB/BOB branch में\n\n✅ Documents: Udyam Certificate, Aadhaar, Pan, Business proof`,
    'Udyam': `Udyam Registration के फायदे:\n\n✅ MSME loans पर preferential rates\n✅ Government tenders में preference\n✅ Tax rebates और subsidies\n✅ CGTMSE collateral-free guarantee\n✅ Club Membership और grants access\n\n🔗 Register: udyamregistration.gov.in (free & paperless)`,
    'PMEGP': `PMEGP Scheme Eligibility:\n\n👤 Age: 18 वर्ष से अधिक\n📚 Education: 8th pass (manufacturing के लिए)\n💰 Subsidy: General 15-25%, SC/ST/Women 25-35%\n🏭 Max Project: Manufacturing ₹50L, Services ₹20L\n\n⚠️ Note: पहले से running business apply नहीं कर सकते`,
    'GST': `GST Return Deadlines:\n\n📅 GSTR-1: 11th हर महीने (sales)\n📅 GSTR-3B: 20th हर महीने (summary)\n📅 GSTR-9: 31 December (annual)\n\n💡 Quarterly Scheme: ₹5 Crore से कम turnover वाले QRMP scheme में enroll हों`,
};

function getResponse(query) {
    for (const [key, response] of Object.entries(RESPONSES)) {
        if (query.toLowerCase().includes(key.toLowerCase()) || query.includes(key)) {
            return response;
        }
    }
    return `I understand your question. For more info on MSME schemes:\n\n🔹 msme.gov.in - Government Schemes\n🔹 udyamregistration.gov.in - Udyam Registration\n🔹 mudra.org.in - MUDRA Loans\n🔹 standupmitra.in - Stand-Up India\n\nAsk if you have any specific query! 🙏`;
}

export default function VoiceAssistant() {
    const { language } = useStore();
    const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hello! 🙏 I am the OmniForge AI Assistant. You can ask me about MSME schemes, loans, GST, and business in any language.', time: new Date().toLocaleTimeString() }
    ]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speakEnabled, setSpeakEnabled] = useState(true);
    const recognitionRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const speak = (text) => {
        if (!speakEnabled || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const clean = text.replace(/[*#🔹✅📅💰👤📚⚠️1️⃣2️⃣3️⃣]/g, '').replace(/\n/g, '. ');
        const utt = new SpeechSynthesisUtterance(clean);
        utt.lang = selectedLang.code;
        utt.rate = 0.9;
        utt.onstart = () => setIsSpeaking(true);
        utt.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utt);
    };

    const sendQuery = (query) => {
        if (!query.trim()) return;
        const userMsg = { role: 'user', text: query, time: new Date().toLocaleTimeString() };
        setMessages(prev => [...prev, userMsg]);
        setTranscript('');

        setTimeout(() => {
            const response = getResponse(query);
            const assistantMsg = { role: 'assistant', text: response, time: new Date().toLocaleTimeString() };
            setMessages(prev => [...prev, assistantMsg]);
            speak(response);
        }, 800);
    };

    const toggleListening = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert('Your browser does not support Speech Recognition. Please use Chrome.');
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = selectedLang.code;
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            const result = event.results[event.results.length - 1];
            const t = result[0].transcript;
            setTranscript(t);
            if (result.isFinal) {
                sendQuery(t);
                setIsListening(false);
            }
        };

        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    };

    const formatResponse = (text) => {
        return text.split('\n').map((line, i) => (
            <div key={i} style={{ lineHeight: 1.8, fontSize: 13.5 }}>
                {line.startsWith('**') ? (
                    <strong style={{ color: 'var(--text-primary)' }}>{line.replace(/\*\*/g, '')}</strong>
                ) : line}
            </div>
        ));
    };

    return (
        <div style={{ flex: 1, overflowY: 'auto' }}>
            <Header
                title="Voice Assistant"
                subtitle="Get MSME information in your preferred language"
            />

            <div className="page-content" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, alignItems: 'start' }}>
                {/* Language Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="card card-p">
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Globe size={14} style={{ color: '#0ea5e9' }} />
                            Select Language
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => setSelectedLang(lang)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        padding: '9px 12px', borderRadius: 10,
                                        background: selectedLang.code === lang.code ? 'rgba(249,115,22,0.12)' : 'transparent',
                                        border: `1px solid ${selectedLang.code === lang.code ? 'rgba(249,115,22,0.3)' : 'transparent'}`,
                                        cursor: 'pointer',
                                        color: selectedLang.code === lang.code ? '#fb923c' : 'var(--text-secondary)',
                                        fontSize: 13,
                                        fontWeight: selectedLang.code === lang.code ? 600 : 400,
                                        transition: 'all 0.18s',
                                        width: '100%',
                                        textAlign: 'left',
                                    }}
                                >
                                    <span style={{ width: 20 }}>{lang.flag}</span>
                                    <div>
                                        <div>{lang.label}</div>
                                        <div style={{ fontSize: 10, opacity: 0.7 }}>{lang.name}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sample Queries */}
                    <div className="card card-p-sm">
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10 }}>💡 Sample Questions</div>
                        {SAMPLE_QUERIES.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => sendQuery(q.text)}
                                style={{
                                    display: 'block', width: '100%', textAlign: 'left',
                                    padding: '8px 10px', borderRadius: 8, marginBottom: 4,
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                                    fontSize: 11.5, color: 'var(--text-secondary)',
                                    cursor: 'pointer', lineHeight: 1.5,
                                    fontFamily: "'Noto Sans Devanagari', sans-serif",
                                    transition: 'all 0.18s',
                                }}
                            >
                                "{q.text}"
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Panel */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)' }}>
                    {/* Header */}
                    <div style={{
                        padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)',
                        display: 'flex', alignItems: 'center', gap: 10
                    }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 16,
                        }}>🤖</div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>OmniForge Voice AI</div>
                            <div style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span className="dot-online" style={{ width: 6, height: 6 }} />
                                Online · {selectedLang.label} mode
                                {isSpeaking && <span style={{ color: '#0ea5e9' }}>· Speaking...</span>}
                            </div>
                        </div>
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                            <button
                                onClick={() => { window.speechSynthesis?.cancel(); setSpeakEnabled(!speakEnabled); }}
                                className="btn-icon btn"
                                style={{ background: speakEnabled ? 'rgba(249,115,22,0.12)' : undefined, borderColor: speakEnabled ? 'rgba(249,115,22,0.3)' : undefined }}
                            >
                                {speakEnabled ? <Volume2 size={14} style={{ color: '#fb923c' }} /> : <VolumeX size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                            >
                                {msg.role === 'assistant' && (
                                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>🤖</div>
                                )}
                                <div style={{
                                    maxWidth: '72%',
                                    padding: '12px 16px',
                                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                    background: msg.role === 'user' ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${msg.role === 'user' ? 'rgba(249,115,22,0.25)' : 'rgba(255,255,255,0.08)'}`,
                                    color: 'var(--text-primary)',
                                    fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif",
                                }}>
                                    {msg.role === 'assistant' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{formatResponse(msg.text)}</div>
                                    ) : (
                                        <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>{msg.text}</div>
                                    )}
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, textAlign: 'right' }}>{msg.time}</div>
                                </div>
                                {msg.role === 'user' && (
                                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>R</div>
                                )}
                            </motion.div>
                        ))}
                        {isListening && (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                                🎤 Listening... {transcript}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 10, alignItems: 'center' }}>
                        <button
                            onClick={toggleListening}
                            className="voice-btn"
                            style={{ background: isListening ? 'linear-gradient(135deg,#ef4444,#f97316)' : undefined }}
                        >
                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>
                        <input
                            className="input"
                            placeholder="Type here or press the mic button..."
                            value={transcript}
                            onChange={e => setTranscript(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendQuery(transcript)}
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                        <button
                            onClick={() => sendQuery(transcript)}
                            className="btn btn-primary"
                            style={{ padding: '10px 16px', flexShrink: 0 }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
