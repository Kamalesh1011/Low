import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import useStore from '../store/useStore';

const QUESTIONS = [
    {
        id: 'category',
        question: 'What is your business sector?',
        subtitle: 'Select the primary sector of your MSME',
        options: [
            { value: 'manufacturing', label: 'Manufacturing', emoji: '🏭' },
            { value: 'service', label: 'Service', emoji: '🔧' },
            { value: 'trading', label: 'Trading', emoji: '🛒' },
            { value: 'agriculture', label: 'Agro Processing', emoji: '🌾' },
        ]
    },
    {
        id: 'size',
        question: 'What is your business size?',
        subtitle: 'Based on investment and annual turnover',
        options: [
            { value: 'micro', label: 'Micro (Up to ₹1Cr)', emoji: '🌱' },
            { value: 'small', label: 'Small (Up to ₹10Cr)', emoji: '🌿' },
            { value: 'medium', label: 'Medium (Up to ₹50Cr)', emoji: '🌳' },
        ]
    },
    {
        id: 'need',
        question: 'What support do you need?',
        subtitle: 'Select the primary goal you want to achieve',
        options: [
            { value: 'loan', label: 'Loan / Funding', emoji: '💰' },
            { value: 'subsidy', label: 'Subsidy', emoji: '🎯' },
            { value: 'registration', label: 'Registration', emoji: '📋' },
            { value: 'export', label: 'Export Support', emoji: '🌏' },
        ]
    },
    {
        id: 'group',
        question: 'Any special category?',
        subtitle: 'Select any specific demographic criteria',
        options: [
            { value: 'general', label: 'General', emoji: '👤' },
            { value: 'women', label: 'Women Entrepreneur', emoji: '👩‍💼' },
            { value: 'scst', label: 'SC/ST Entrepreneur', emoji: '⚖️' },
            { value: 'rural', label: 'Rural Area', emoji: '🏡' },
        ]
    },
];

const SCHEME_MAP = {
    'loan-micro': ['PM MUDRA Yojana', 'PMEGP Scheme', 'PM SVANidhi'],
    'loan-small': ['CGTMSE Scheme', 'TReDS Platform', 'Stand-Up India'],
    'loan-medium': ['CGTMSE Scheme', 'TReDS Platform', 'SIDBI Direct Loan'],
    'subsidy-manufacturing': ['PMEGP Scheme', 'ZED Certification', 'CLCSS Scheme'],
    'registration-micro': ['Udyam Registration', 'One District One Product'],
    'loan-women': ['Stand-Up India', 'MUDRA Kishore', 'Mahila Udyam Nidhi'],
    'loan-scst': ['Stand-Up India', 'NSIC Credit Support'],
    'export-small': ['MEIS Scheme', 'ECGC Cover', 'SIDBI Export Finance'],
};

function matchSchemes(answers) {
    const key = `${answers.need}-${answers.group !== 'general' ? answers.group : answers.size}`;
    return SCHEME_MAP[key] || SCHEME_MAP[`${answers.need}-${answers.size}`] || ['PM MUDRA Yojana', 'CGTMSE Scheme', 'Udyam Registration'];
}

export default function SchemeFinder() {
    const { schemes } = useStore();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState(null);

    const handleOption = (questionId, value) => {
        const newAnswers = { ...answers, [questionId]: value };
        setAnswers(newAnswers);

        if (step < QUESTIONS.length - 1) {
            setTimeout(() => setStep(step + 1), 300);
        } else {
            const matched = matchSchemes(newAnswers);
            const matchedSchemes = schemes.filter(s => matched.includes(s.name)).concat(
                schemes.slice(0, 3 - Math.min(3, matched.length))
            ).slice(0, 4);
            setResults(matchedSchemes.length > 0 ? matchedSchemes : schemes.slice(0, 3));
        }
    };

    const reset = () => { setStep(0); setAnswers({}); setResults(null); };

    const progress = ((step) / QUESTIONS.length) * 100;

    return (
        <div style={{ flex: 1, overflowY: 'auto' }}>
            <Header
                title="Scheme Finder"
                subtitle="Answer a few questions to find the right scheme for you"
            />

            <div className="page-content" style={{ maxWidth: 760, margin: '0 auto' }}>
                {!results ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {/* Progress */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Step {step + 1} of {QUESTIONS.length}</span>
                                <span style={{ fontSize: 12, color: '#fb923c', fontWeight: 600 }}>{Math.round(progress)}%</span>
                            </div>
                            <div className="progress-track">
                                <motion.div
                                    className="progress-fill"
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.4 }}
                                />
                            </div>
                            {/* Step Dots */}
                            <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'center' }}>
                                {QUESTIONS.map((_, i) => (
                                    <div key={i} style={{
                                        width: i === step ? 24 : 8, height: 8,
                                        borderRadius: 4,
                                        background: i <= step ? '#f97316' : 'rgba(255,255,255,0.1)',
                                        transition: 'all 0.3s',
                                    }} />
                                ))}
                            </div>
                        </div>

                        {/* Question */}
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            style={{ textAlign: 'center' }}
                        >
                            <h2 style={{
                                fontSize: 24, fontWeight: 800, color: 'var(--text-primary)',
                                fontFamily: "'Inter', sans-serif", marginBottom: 6
                            }}>
                                {QUESTIONS[step].question}
                            </h2>
                            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>
                                {QUESTIONS[step].subtitle}
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: QUESTIONS[step].options.length === 3 ? '1fr 1fr 1fr' : '1fr 1fr', gap: 12, maxWidth: 640, margin: '0 auto' }}>
                                {QUESTIONS[step].options.map((opt, i) => (
                                    <motion.button
                                        key={opt.value}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.07 }}
                                        whileHover={{ scale: 1.03, y: -3 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleOption(QUESTIONS[step].id, opt.value)}
                                        style={{
                                            padding: '20px 16px',
                                            background: 'rgba(255,255,255,0.04)',
                                            border: `1px solid ${answers[QUESTIONS[step].id] === opt.value ? 'rgba(249,115,22,0.5)' : 'rgba(255,255,255,0.08)'}`,
                                            borderRadius: 16,
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            transition: 'all 0.2s',
                                            background: answers[QUESTIONS[step].id] === opt.value ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.03)',
                                        }}
                                    >
                                        <div style={{ fontSize: 32, marginBottom: 8 }}>{opt.emoji}</div>
                                        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{opt.label}</div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {step > 0 && (
                            <div style={{ textAlign: 'center' }}>
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="btn btn-ghost"
                                    style={{ fontSize: 12 }}
                                >
                                    ← Go Back
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ textAlign: 'center', marginBottom: 28 }}>
                            <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
                            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
                                Recommended Schemes
                            </h2>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>Recommended schemes based on your profile</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                            {results.map((scheme, i) => (
                                <motion.div
                                    key={scheme.id}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="card card-p"
                                    style={{ display: 'flex', gap: 16, alignItems: 'center', border: i === 0 ? '1px solid rgba(249,115,22,0.3)' : undefined }}
                                >
                                    <div style={{ fontSize: 36 }}>{scheme.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{scheme.name}</h3>
                                            {i === 0 && <span className="badge badge-saffron" style={{ fontSize: 9 }}>Best Match</span>}
                                        </div>
                                        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{scheme.description}</p>
                                        <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                                            <span style={{ fontSize: 11, color: '#fb923c', fontWeight: 600 }}>{scheme.maxAmount}</span>
                                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{scheme.interestRate}</span>
                                        </div>
                                    </div>
                                    <a
                                        href={scheme.applyUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-primary"
                                        style={{ fontSize: 12, padding: '9px 16px', flexShrink: 0 }}
                                    >
                                        Apply <ArrowRight size={11} />
                                    </a>
                                </motion.div>
                            ))}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <button onClick={reset} className="btn btn-secondary" style={{ fontSize: 13 }}>
                                🔄 Search Again
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
