import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Schemes from './pages/Schemes';
import Community from './pages/Community';
import VoiceAssistant from './pages/VoiceAssistant';
import Scraper from './pages/Scraper';
import Loans from './pages/Loans';
import SchemeFinder from './pages/SchemeFinder';
import VibeCoder from './pages/VibeCoder';
import AgentBuilder from './pages/AgentBuilder';
import AppBuilder from './pages/AppBuilder';
import Login from './pages/Login';
import MyBusiness from './pages/MyBusiness';
import MyApps from './pages/MyApps';
import KnowledgeBase from './pages/KnowledgeBase';
import ExpertConnect from './pages/ExpertConnect';
import ComplianceCenter from './pages/ComplianceCenter';
import Marketplace from './pages/Marketplace';
import Settings from './pages/Settings';
import Header from './components/Header';
import useStore from './store/useStore';
import { Mic } from 'lucide-react';

const PlaceholderPage = ({ title, emoji, subtitle }) => (
  <div style={{ flex: 1, overflowY: 'auto' }}>
    <Header title={title} subtitle={subtitle} />
    <div className="page-content">
      <div className="empty-state">
        <div className="empty-icon">{emoji}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 340, lineHeight: 1.7 }}>{subtitle}</div>
        <div style={{ marginTop: 14 }}>
          <span className="badge badge-saffron">🚧 Coming Soon</span>
        </div>
      </div>
    </div>
  </div>
);

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.2 }}
    style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
  >
    {children}
  </motion.div>
);

function App() {
  const { isAuthenticated } = useStore();

  if (!isAuthenticated) return <Login />;

  return (
    <Router>
      <div className="app-container" style={{ position: 'relative' }}>
        <Sidebar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
              <Route path="/schemes" element={<PageWrapper><Schemes /></PageWrapper>} />
              <Route path="/community" element={<PageWrapper><Community /></PageWrapper>} />
              <Route path="/voice" element={<PageWrapper><VoiceAssistant /></PageWrapper>} />
              <Route path="/scraper" element={<PageWrapper><Scraper /></PageWrapper>} />
              <Route path="/loans" element={<PageWrapper><Loans /></PageWrapper>} />
              <Route path="/finder" element={<PageWrapper><SchemeFinder /></PageWrapper>} />
              <Route path="/vibe" element={<PageWrapper><VibeCoder /></PageWrapper>} />
              <Route path="/builder" element={<PageWrapper><AppBuilder /></PageWrapper>} />
              <Route path="/agents" element={<PageWrapper><AgentBuilder /></PageWrapper>} />
              <Route path="/business" element={<PageWrapper><MyBusiness /></PageWrapper>} />
              <Route path="/apps" element={<PageWrapper><MyApps /></PageWrapper>} />
              <Route path="/knowledge" element={<PageWrapper><KnowledgeBase /></PageWrapper>} />
              <Route path="/experts" element={<PageWrapper><ExpertConnect /></PageWrapper>} />
              <Route path="/compliance" element={<PageWrapper><ComplianceCenter /></PageWrapper>} />
              <Route path="/marketplace" element={<PageWrapper><Marketplace /></PageWrapper>} />
              <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Global Voice Orb — NASA style */}
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.92 }}
          style={{
            position: 'fixed', bottom: 28, right: 28,
            width: 54, height: 54, borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #38bdf8 0%, #0369a1 60%, #0c4a6e 100%)',
            boxShadow: '0 0 0 2px rgba(14,165,233,0.3), 0 0 40px rgba(14,165,233,0.4), inset 0 0 15px rgba(255,255,255,0.15)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={() => window.location.href = '/voice'}
        >
          <Mic size={22} color="white" />
        </motion.div>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0a1228',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            fontSize: 12.5,
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#0a1228' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0a1228' } },
        }}
      />
    </Router>
  );
}

export default App;
