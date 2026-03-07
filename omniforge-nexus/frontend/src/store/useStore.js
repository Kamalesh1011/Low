import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
    persist(
        (set, get) => ({
            // ─── Auth State ───
            user: null,
            isAuthenticated: false,

            // ─── UI State ───
            sidebarCollapsed: false,
            activeModule: 'dashboard',
            language: 'en',
            activeWorkspace: 'Default Home',
            notifications: [
                { id: 1, type: 'success', message: 'Nexus Engine v2.0 Deployed: 100+ New Features Live!', time: 'Now', read: false },
                { id: 2, type: 'info', message: 'New Marketplace Component: Advanced Data Grid available.', time: '5m ago', read: false },
            ],

            // ─── GitHub Integration ───
            github: {
                connected: false,
                token: '',
                user: null,  // { login, name, email, avatar_url, public_repos, profile_url }
                repos: [],
                lastVerified: null,
            },

            // ─── OpenRouter API Key ───
            openrouterKey: '',  // User's own key (optional override)

            // ─── AI Agents (user-created in Agent Studio) ───
            agents: [],
            agentRuns: [], // History of agent runs

            // ─── VibeCoder: Built Apps / Agents / Websites ───
            builtProjects: [],
            generatedApps: [],

            // ─── Marketplace ───
            marketplace: {
                components: [
                    { id: 'mc1', name: 'GST Billing Grid', author: 'Nexus Team', rating: 4.9, icon: '🏛️', price: 'Free' },
                    { id: 'mc2', name: 'WhatsApp Sales Agent', author: 'AI Devs', rating: 4.8, icon: '💬', price: '$29' },
                    { id: 'mc3', name: 'Inventory Sync Tool', author: 'Nexus Team', rating: 4.7, icon: '📦', price: 'Free' },
                    { id: 'mc4', name: 'Payment Link Gen', author: 'Nexus Team', rating: 4.9, icon: '💳', price: 'Free' },
                ],
                trending: ['Inventory', 'GST', 'WhatsApp'],
            },

            // ─── Analytics ───
            platformMetrics: {
                totalRequests: 12450,
                activeUsers: 842,
                avgResponseTime: '12ms',
                uptime: '99.98%',
                buildsToday: 142,
            },

            // ─── Themes ───
            theme: 'dark', // dark | light | cyber

            templates: [
                { id: 't1', name: 'CRM Dashboard', desc: 'Customer relation management with analytics', icon: '📊', time: '45s' },
                { id: 't2', name: 'E-commerce Store', desc: 'Modern shopping experience with cart', icon: '🛍️', time: '60s' },
                { id: 't3', name: 'AI Chat Agent', desc: 'Conversational agent for customer support', icon: '🤖', time: '30s' },
                { id: 't4', name: 'Portfolio Site', desc: 'Beautiful showcase for your work', icon: '✨', time: '40s' },
                { id: 't5', name: 'SaaS Landing Page', desc: 'Convert visitors into users', icon: '🚀', time: '50s' },
                { id: 't6', name: 'Inventory App', desc: 'Track stock and manage orders', icon: '📦', time: '55s' },
            ],

            // ─── MSME Schemes Data (real scheme info) ───
            schemes: [
                {
                    id: 'sch_001',
                    name: 'PM MUDRA Yojana',
                    ministry: 'Ministry of Finance',
                    category: 'Loan',
                    maxAmount: '₹10 Lakh',
                    interestRate: '7.5% - 12%',
                    eligibility: 'Non-farm entrepreneurs',
                    deadline: 'Ongoing',
                    status: 'active',
                    color: '#10b981',
                    icon: '🏦',
                    tags: ['Micro', 'Small', 'Manufacturing', 'Service'],
                    description: 'Collateral-free loans up to ₹10 lakh for small businesses under Shishu, Kishore & Tarun categories.',
                    applyUrl: 'https://www.mudra.org.in',
                    scraped: '2026-02-27',
                },
                {
                    id: 'sch_002',
                    name: 'CGTMSE Scheme',
                    ministry: 'MSME Ministry',
                    category: 'Guarantee',
                    maxAmount: '₹5 Crore',
                    interestRate: 'Market Rate',
                    eligibility: 'Micro & Small Enterprises',
                    deadline: 'Ongoing',
                    status: 'active',
                    color: '#6366f1',
                    icon: '🛡️',
                    tags: ['Manufacturing', 'Service', 'Small', 'Guarantee'],
                    description: 'Credit guarantee cover for collateral-free loans to MSEs from scheduled commercial banks.',
                    applyUrl: 'https://www.cgtmse.in',
                    scraped: '2026-02-27',
                },
                {
                    id: 'sch_003',
                    name: 'PMEGP Scheme',
                    ministry: 'KVIC / MSME',
                    category: 'Subsidy',
                    maxAmount: '₹50 Lakh',
                    interestRate: '0% (Subsidy)',
                    eligibility: 'Age 18+, 8th pass',
                    deadline: 'Ongoing',
                    status: 'active',
                    color: '#f59e0b',
                    icon: '🎯',
                    tags: ['Manufacturing', 'Service', 'New Enterprise'],
                    description: '15-35% government subsidy for setting up new enterprises in manufacturing & service sectors.',
                    applyUrl: 'https://www.kviconline.gov.in/pmegpeportal',
                    scraped: '2026-02-27',
                },
                {
                    id: 'sch_004',
                    name: 'Stand-Up India',
                    ministry: 'Ministry of Finance',
                    category: 'Loan',
                    maxAmount: '₹1 Crore',
                    interestRate: 'Base Rate + 3%',
                    eligibility: 'SC/ST/Women entrepreneurs',
                    deadline: 'Ongoing',
                    status: 'active',
                    color: '#ec4899',
                    icon: '🌟',
                    tags: ['SC/ST', 'Women', 'Greenfield'],
                    description: 'Bank loans between ₹10 lakh and ₹1 crore for SC/ST and women entrepreneurs for greenfield projects.',
                    applyUrl: 'https://www.standupmitra.in',
                    scraped: '2026-02-27',
                },
                {
                    id: 'sch_005',
                    name: 'Udyam Registration',
                    ministry: 'MSME Ministry',
                    category: 'Registration',
                    maxAmount: 'Free',
                    interestRate: 'N/A',
                    eligibility: 'All MSMEs',
                    deadline: 'Ongoing',
                    status: 'active',
                    color: '#06b6d4',
                    icon: '📋',
                    tags: ['Registration', 'All MSMEs'],
                    description: 'Free online registration for MSME enterprises to get Udyam Certificate and avail benefits.',
                    applyUrl: 'https://udyamregistration.gov.in',
                    scraped: '2026-02-27',
                },
                {
                    id: 'sch_006',
                    name: 'TReDS Platform',
                    ministry: 'RBI / MSME',
                    category: 'Finance',
                    maxAmount: 'Unlimited',
                    interestRate: 'As per market',
                    eligibility: 'MSMEs with receivables',
                    deadline: 'Ongoing',
                    status: 'active',
                    color: '#8b5cf6',
                    icon: '💫',
                    tags: ['Invoice', 'Finance', 'Working Capital'],
                    description: 'Trade Receivables Discounting System for MSMEs to get early payment against invoices from large buyers.',
                    applyUrl: 'https://rxil.in',
                    scraped: '2026-02-27',
                },
            ],

            // ─── Community Posts ───
            communityPosts: [
                {
                    id: 'post_001',
                    author: 'Priya Patel',
                    avatar: '👩‍💼',
                    business: 'Patel Sarees, Surat',
                    time: '1h ago',
                    category: 'Loan',
                    title: 'Got my MUDRA Loan! ₹5 Lakhs - how I applied',
                    body: 'I applied for a MUDRA Kishore loan through SBI and got approved in 15 days. I wanted to share my process...',
                    likes: 48,
                    replies: 12,
                    saved: false,
                    tags: ['MUDRA', 'Loan', 'Success Story'],
                    language: 'en',
                },
                {
                    id: 'post_002',
                    author: 'Suresh Kumar',
                    avatar: '👨‍🔧',
                    business: 'Kumar Engineering Works, Pune',
                    time: '3h ago',
                    category: 'GST',
                    title: 'GST ITC Reconciliation - Common Mistakes MSMEs make',
                    body: 'Been in manufacturing for 3 years. The biggest problem with GST is ITC mismatch. Today I will go over 5 common mistakes...',
                    likes: 92,
                    replies: 34,
                    saved: true,
                    tags: ['GST', 'ITC', 'Tax'],
                    language: 'en',
                },
                {
                    id: 'post_003',
                    author: 'Kavitha Reddy',
                    avatar: '👩‍💻',
                    business: 'Reddy Tech Solutions, Hyderabad',
                    time: '6h ago',
                    category: 'Scheme',
                    title: '₹25 Lakh subsidy from PMEGP Scheme? The Truth',
                    body: 'A lot of people share wrong information about PMEGP. In this post, let me clear the actual eligibility and process...',
                    likes: 156,
                    replies: 67,
                    saved: false,
                    tags: ['PMEGP', 'Subsidy', 'Fact Check'],
                    language: 'en',
                },
            ],

            // ─── Loan Applications ───
            loanApplications: [
                { id: 'la_001', icon: '🏦', bank: 'State Bank of India', scheme: 'MUDRA Kishore', amount: '₹5 Lakh', status: 'approved' },
                { id: 'la_002', icon: '🏛️', bank: 'Bank of Baroda', scheme: 'CGTMSE Covered', amount: '₹12 Lakh', status: 'processing' },
                { id: 'la_003', icon: '💳', bank: 'SIDBI eFunds', scheme: 'Stand-Up India', amount: '₹25 Lakh', status: 'processing' },
            ],

            // ─── Scraper State ───
            scraperStatus: 'idle',
            scraperResults: [],
            lastScraped: null,

            // ─── Actions ───
            setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),
            setActiveModule: (module) => set({ activeModule: module }),
            setLanguage: (lang) => set({ language: lang }),

            // Auth
            login: (userData) => set({
                isAuthenticated: true,
                user: {
                    name: 'Kamalesh Arumugam',
                    email: 'kamalesh@omniforge.ai',
                    role: 'admin',
                    businessName: 'Kamalesh Tech Solutions',
                    udyamNo: 'UDYAM-TN-07-0234567',
                    state: 'Tamil Nadu',
                    plan: 'enterprise',
                    credits: 480,
                    org_name: 'OmniForge Nexus',
                    ...(userData || {}),
                }
            }),
            logout: () => set({ isAuthenticated: false, user: null }),

            markAllRead: () => set(state => ({
                notifications: state.notifications.map(n => ({ ...n, read: true })),
            })),

            toggleSavePost: (postId) => set(state => ({
                communityPosts: state.communityPosts.map(p =>
                    p.id === postId ? { ...p, saved: !p.saved } : p
                ),
            })),

            likePost: (postId) => set(state => ({
                communityPosts: state.communityPosts.map(p =>
                    p.id === postId ? { ...p, likes: p.likes + 1 } : p
                ),
            })),

            // ─── GitHub Actions ───
            setGitHubToken: async (token) => {
                if (!token) {
                    set({ github: { connected: false, token: '', user: null, repos: [], lastVerified: null } });
                    return { success: false };
                }
                try {
                    const res = await fetch('/api/v1/github/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token }),
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                        set({
                            github: {
                                connected: true,
                                token,
                                user: data.user,
                                repos: data.recent_repos || [],
                                lastVerified: new Date().toISOString(),
                            }
                        });
                        return { success: true, user: data.user };
                    } else {
                        set({ github: { connected: false, token: '', user: null, repos: [], lastVerified: null } });
                        return { success: false, error: data.detail || 'Invalid token' };
                    }
                } catch (e) {
                    return { success: false, error: e.message };
                }
            },

            disconnectGitHub: () => set({
                github: { connected: false, token: '', user: null, repos: [], lastVerified: null }
            }),

            refreshGitHubRepos: async () => {
                const { github } = get();
                if (!github.connected || !github.token) return;
                try {
                    const res = await fetch(`/api/v1/github/repos?token=${github.token}`);
                    const data = await res.json();
                    if (data.success) {
                        set(state => ({ github: { ...state.github, repos: data.repos } }));
                    }
                } catch (e) {
                    console.error('Failed to refresh repos:', e);
                }
            },

            // ─── Agent Actions ───
            createAgent: (agentData) => set(state => ({
                agents: [
                    ...state.agents,
                    {
                        id: `agent_${Date.now()}`,
                        ...agentData,
                        status: 'idle',
                        tasks: 0,
                        successRate: 0,
                        createdAt: new Date().toISOString(),
                        lastRun: null,
                    }
                ]
            })),

            updateAgent: (agentId, updates) => set(state => ({
                agents: state.agents.map(a => a.id === agentId ? { ...a, ...updates } : a)
            })),

            deleteAgent: (agentId) => set(state => ({
                agents: state.agents.filter(a => a.id !== agentId)
            })),

            runAgent: async (agentId, message) => {
                const { agents } = get();
                const agent = agents.find(a => a.id === agentId);
                if (!agent) return { success: false, error: 'Agent not found' };

                // Set agent to active
                set(state => ({
                    agents: state.agents.map(a =>
                        a.id === agentId ? { ...a, status: 'active' } : a
                    )
                }));

                const runId = `run_${Date.now()}`;
                const startTime = Date.now();

                try {
                    const res = await fetch('/api/v1/llm/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            messages: [
                                { role: 'system', content: agent.instructions || `You are ${agent.name}, an AI agent.` },
                                { role: 'user', content: message },
                            ],
                            model: agent.model ? `${agent.model}` : undefined,
                            agent_type: agent.type?.toLowerCase(),
                            temperature: 0.7,
                        }),
                    });

                    const data = await res.json();
                    const elapsed = Date.now() - startTime;

                    if (res.ok && data.success) {
                        set(state => ({
                            agents: state.agents.map(a =>
                                a.id === agentId ? {
                                    ...a,
                                    status: 'idle',
                                    tasks: a.tasks + 1,
                                    successRate: Math.min(100, Math.round(((a.successRate * a.tasks) + 100) / (a.tasks + 1))),
                                    lastRun: new Date().toISOString(),
                                } : a
                            ),
                            agentRuns: [
                                {
                                    id: runId,
                                    agentId,
                                    agentName: agent.name,
                                    message,
                                    response: data.content,
                                    model: data.model,
                                    tokens: data.tokens,
                                    elapsed,
                                    status: 'success',
                                    createdAt: new Date().toISOString(),
                                },
                                ...state.agentRuns.slice(0, 49),
                            ]
                        }));
                        return { success: true, content: data.content, model: data.model, tokens: data.tokens };
                    } else {
                        throw new Error(data.detail || 'Agent run failed');
                    }
                } catch (e) {
                    set(state => ({
                        agents: state.agents.map(a =>
                            a.id === agentId ? { ...a, status: 'error', lastError: e.message } : a
                        ),
                        agentRuns: [
                            {
                                id: runId,
                                agentId,
                                agentName: agent.name,
                                message,
                                response: null,
                                error: e.message,
                                status: 'error',
                                createdAt: new Date().toISOString(),
                            },
                            ...state.agentRuns.slice(0, 49),
                        ]
                    }));
                    return { success: false, error: e.message };
                }
            },

            // ─── VibeCoder Actions ───
            saveBuiltProject: (project) => set(state => ({
                builtProjects: [
                    {
                        id: `proj_${Date.now()}`,
                        ...project,
                        createdAt: new Date().toISOString(),
                    },
                    ...state.builtProjects.slice(0, 19), // Keep last 20
                ],
                generatedApps: [
                    {
                        id: `proj_${Date.now()}`,
                        ...project,
                        createdAt: new Date().toISOString(),
                    },
                    ...state.builtProjects.slice(0, 19),
                ]
            })),

            updateProjectGitHub: (projectId, repoInfo) => set(state => ({
                builtProjects: state.builtProjects.map(p =>
                    p.id === projectId ? { ...p, githubRepo: repoInfo, pushedAt: new Date().toISOString() } : p
                )
            })),

            // ─── Scraper ───
            runScraper: async () => {
                set({ scraperStatus: 'scraping', scraperResults: [] });
                await new Promise(r => setTimeout(r, 3000));
                set(() => ({
                    scraperStatus: 'done',
                    lastScraped: new Date().toLocaleString('en-IN'),
                    scraperResults: [
                        { source: 'msme.gov.in', schemes: 12, loans: 8, status: 'ok' },
                        { source: 'sidbi.in', schemes: 6, loans: 15, status: 'ok' },
                        { source: 'mudra.org.in', schemes: 3, loans: 22, status: 'ok' },
                        { source: 'standupmitra.in', schemes: 5, loans: 9, status: 'ok' },
                    ],
                }));
            },
        }),
        {
            name: 'omniforge-store',
            partialState: (state) => ({
                // Only persist these keys
                github: state.github,
                openrouterKey: state.openrouterKey,
                agents: state.agents,
                agentRuns: state.agentRuns,
                builtProjects: state.builtProjects,
                generatedApps: state.generatedApps,
                loanApplications: state.loanApplications,
                language: state.language,
                sidebarCollapsed: state.sidebarCollapsed,
                isAuthenticated: state.isAuthenticated,
                user: state.user,
            }),
        }
    )
);

export default useStore;
