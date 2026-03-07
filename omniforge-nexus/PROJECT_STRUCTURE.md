# OmniForge Nexus Project Structure

```text
omniforge-nexus/
├── frontend/                          # React + Tailwind CSS + Framer Motion
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx            # Collapsible animated sidebar
│   │   │   ├── Header.jsx             # Top bar with notifications, credits
│   │   │   └── AIConsole.jsx          # Central AI build console
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # Main dashboard with stats & charts
│   │   │   ├── VibeCoder.jsx          # Dedicated AI build page
│   │   │   ├── AgentBuilder.jsx       # Multi-agent creation + ReactFlow canvas
│   │   │   ├── AppBuilder.jsx         # Visual drag-and-drop app builder
│   │   │   ├── SchemeFinder.jsx       # Scheme matcher
│   │   │   ├── Schemes.jsx            # Government Schemes catalogue
│   │   │   ├── VoiceAssistant.jsx     # Voice AI integration
│   │   │   ├── Login.jsx              # Access page
│   │   │   └── Scraper.jsx            # Live data scraper
│   │   ├── store/
│   │   │   └── useStore.js            # Zustand global state
│   │   ├── App.jsx                    # Router + page transitions
│   │   ├── main.jsx                   # React entry point
│   │   └── index.css                  # Premium design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                           # Python FastAPI Microservices
│   ├── services/
│   │   ├── gateway/                   # API Gateway (FastAPI)
│   │   │   ├── main.py
│   │   │   ├── middleware.py          # Auth, CORS, Rate limiting
│   │   │   └── router.py
│   │   ├── agent_service/             # Multi-agent orchestration
│   │   │   ├── main.py
│   │   │   ├── agents/
│   │   │   │   ├── planner.py         # Task planning agent
│   │   │   │   ├── architect.py       # System design agent
│   │   │   │   ├── builder.py         # Code generation agent
│   │   │   │   ├── validator.py       # Quality validation agent
│   │   │   │   ├── tester.py          # Test generation agent
│   │   │   │   └── optimizer.py       # Performance optimization agent
│   │   │   ├── orchestrator.py        # Agent pipeline orchestrator
│   │   │   └── memory.py              # Agent memory & state
│   │   ├── build_service/             # AI application generator
│   │   │   ├── main.py
│   │   │   ├── generators/
│   │   │   │   ├── schema_gen.py      # Database schema generation
│   │   │   │   ├── api_gen.py         # REST API generation
│   │   │   │   ├── ui_gen.py          # React UI generation
│   │   │   │   ├── workflow_gen.py    # Workflow automation gen
│   │   │   │   └── deploy_gen.py      # Docker/K8s manifest gen
│   │   │   └── templates/             # 20 MSME templates
│   │   ├── auth_service/              # JWT + RBAC authentication
│   │   │   ├── main.py
│   │   │   ├── jwt_handler.py
│   │   │   ├── rbac.py
│   │   │   └── multi_tenant.py
│   │   ├── vault_service/             # AES-256 secret management
│   │   │   ├── main.py
│   │   │   └── encryption.py
│   │   └── workflow_service/          # Event-driven workflow engine
│   │       ├── main.py
│   │       ├── kafka_consumer.py
│   │       └── celery_tasks.py
│   ├── shared/
│   │   ├── database.py                # PostgreSQL + SQLAlchemy
│   │   ├── redis_client.py            # Redis caching
│   │   ├── kafka_client.py            # Kafka event streaming
│   │   ├── openrouter.py              # OpenRouter LLM client
│   │   └── models/                    # Shared Pydantic models
│   ├── migrations/                    # Alembic database migrations
│   └── requirements.txt
│
├── infrastructure/                    # DevOps & Deployment
│   ├── docker/
│   │   ├── docker-compose.yml         # Local dev environment
│   │   └── docker-compose.prod.yml   # Production config
│   ├── kubernetes/
│   │   ├── namespace.yaml
│   │   ├── deployments/
│   │   │   ├── gateway.yaml
│   │   │   ├── agent-service.yaml
│   │   │   ├── build-service.yaml
│   │   │   └── workflow-service.yaml
│   │   ├── services/
│   │   ├── ingress.yaml               # Nginx ingress with SSL
│   │   └── hpa.yaml                   # Horizontal Pod Autoscaler
│   ├── terraform/                     # IaC for AWS/GCP/Azure
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── monitoring/
│   │   ├── prometheus/
│   │   │   └── prometheus.yml
│   │   └── grafana/
│   │       └── dashboards/
│   └── ci-cd/
│       ├── .github/workflows/
│       │   ├── build.yml
│       │   ├── test.yml
│       │   └── deploy.yml
│       └── Jenkinsfile
│
└── docs/
    ├── architecture.md                # System architecture overview
    ├── api-reference.md               # OpenAPI specification
    ├── deployment.md                  # Deployment guide
    └── scalability.md                 # Scalability plan
```
