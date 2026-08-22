# Recon Platform

A professional cybersecurity reconnaissance platform designed for **CTFs, labs, authorized penetration testing, and bug-bounty targets where authorization exists**.

![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/python-3.11+-blue)
![Node](https://img.shields.io/badge/node-20+-green)
![Docker](https://img.shields.io/badge/docker-compose-v2-blue)

## ⚠️ Authorized Use Only

This tool is designed for:
- CTF environments
- Personal labs
- Authorized penetration tests
- Systems where you have explicit written permission

**Never use this tool against targets you do not own or have explicit authorization to test.**

---

## Features

- **Passive Reconnaissance** — WHOIS, DNS, Certificate Transparency, subdomain discovery
- **Active Reconnaissance** — Port scanning, service enumeration, web probing
- **DNS Intelligence** — Full DNS record analysis with security checks
- **Subdomain Discovery** — Multi-source passive subdomain enumeration
- **Port Scanner** — TCP port scanning with service detection
- **Web Reconnaissance** — HTTP probing, technology detection, endpoint discovery
- **OSINT Module** — Domain, email, and username intelligence gathering
- **Attack Surface Map** — Interactive visualization of all discovered assets
- **Findings Engine** — Evidence-based severity assessment
- **Report Generation** — Professional recon reports (PDF, HTML, JSON, CSV, Markdown)
- **Live Terminal** — Real-time scan output via WebSockets
- **CTF Mode** — Dedicated workflow for capture-the-flag exercises

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Tailwind CSS, Recharts |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | PostgreSQL 16 |
| Task Queue | Redis + Celery |
| Deployment | Docker Compose |

---

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Ports 3000, 5432, 6379, 8000 available

### 1. Clone and configure

```bash
cd recon-platform
cp .env.example .env
```

### 2. Start the application

```bash
docker compose up --build
```

### 3. Access the application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs
- **API Documentation**: http://localhost:8000/docs (Swagger UI)

### 4. Create your first account

Visit the frontend and register, or use the API:

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"admin123"}'
```

---

## Project Structure

```
recon-platform/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   └── types/         # TypeScript type definitions
│   ├── nginx.conf         # Nginx configuration
│   └── Dockerfile         # Frontend build
├── backend/               # FastAPI backend application
│   ├── app/
│   │   ├── api/           # API route handlers
│   │   ├── models/        # SQLAlchemy database models
│   │   ├── schemas/       # Pydantic request/response schemas
│   │   ├── services/      # Business logic and scan pipeline
│   │   ├── scanners/      # Tool adapter implementations
│   │   ├── passive/       # Passive recon modules
│   │   ├── active/        # Active recon modules
│   │   ├── osint/         # OSINT search modules
│   │   ├── workers/       # Celery task definitions
│   │   └── utils/         # Auth, helpers
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile         # Backend build
├── database/
│   └── seed.sql           # Demo data
├── wordlists/             # Brute-force wordlists
├── docker-compose.yml     # Full stack orchestration
├── .env.example           # Environment template
└── README.md              # This file
```

---

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_HOST` | PostgreSQL host | `postgres` |
| `POSTGRES_PORT` | PostgreSQL port | `5432` |
| `POSTGRES_DB` | Database name | `recon_platform` |
| `POSTGRES_USER` | Database user | `recon_user` |
| `POSTGRES_PASSWORD` | Database password | `change_me_in_production` |
| `REDIS_HOST` | Redis host | `redis` |
| `SECRET_KEY` | JWT signing key | `change_me_to_a_random_secret_key_in_production` |
| `MAX_CONCURRENT_SCANS` | Max parallel scans | `5` |
| `MAX_REQUESTS_PER_SECOND` | Rate limit | `50` |
| `SCAN_TIMEOUT` | Scan timeout (seconds) | `300` |

### API Provider Configuration

Configure API keys in Settings → API Providers or via environment variables:

- **Shodan** — `SHODAN_API_KEY` — Internet-connected device search
- **Censys** — `CENSYS_API_KEY` — Certificate and host intelligence
- **VirusTotal** — `VIRUSTOTAL_API_KEY` — URL/domain reputation
- **SecurityTrails** — `SECURITYTRAILS_API_KEY` — DNS intelligence

---

## Usage Guide

### Creating a Project

1. Navigate to **Targets** page
2. Click **Add Target** or use **Bulk Import**
3. Enter domains, IPs, CIDRs, or URLs

### Running Passive Reconnaissance

1. Go to **Passive Recon**
2. Enter a target domain
3. Click **Start Passive Recon**
4. View WHOIS, DNS, and Certificate Transparency results

### Running Active Reconnaissance

1. Go to **Active Recon**
2. Select a target from the dropdown
3. Choose a scan profile (Quick, Standard, Deep)
4. **Confirm authorization** when prompted
5. Click **Launch Scan**

### Viewing Results

- **Subdomains** — All discovered subdomains with status
- **DNS Intel** — Full DNS record table with security checks
- **Port Scanner** — Open ports with service info
- **Web Recon** — Web services with technology detection
- **Technology** — Detected software and versions
- **Findings** — Prioritized discoveries with evidence
- **Attack Surface** — Interactive asset tree

### Generating Reports

1. Go to **Reports**
2. Click **Generate Report**
3. Select project, title, and format
4. Download when ready

---

## API Reference

### Authentication

```bash
# Register
POST /api/auth/register
{"username": "...", "email": "...", "password": "..."}

# Login
POST /api/auth/login
{"username": "...", "password": "..."}
# Returns: {"access_token": "...", "token_type": "bearer"}
```

### Projects

```bash
GET    /api/projects
POST   /api/projects
GET    /api/projects/{id}
PUT    /api/projects/{id}
DELETE /api/projects/{id}
```

### Targets

```bash
GET    /api/targets?project_id=...
POST   /api/targets?project_id=...
POST   /api/targets/bulk
POST   /api/targets/{id}/confirm-scope
```

### Scans

```bash
GET    /api/scans
POST   /api/scans
GET    /api/scans/{id}
POST   /api/scans/{id}/cancel
GET    /api/scans/{id}/logs
WS     /ws/scans/{scan_id}           # WebSocket for live updates
```

### Assets

```bash
GET /api/dns?domain=...&record_type=A
GET /api/subdomains?hostname=...
GET /api/ports?host=...
GET /api/services?service_type=http
GET /api/technologies?technology_name=nginx
GET /api/urls?domain=...
GET /api/findings?severity=high&status=open
GET /api/stats
```

### Reports

```bash
GET  /api/reports
POST /api/reports
GET  /api/reports/{id}/download
```

---

## Tool Adapter Architecture

The platform uses a pluggable adapter pattern for reconnaissance tools:

```python
class BaseScanner(ABC):
    def validate(target, options) -> bool
    async def start(target, options) -> None
    async def status() -> dict
    async def cancel() -> None
    def parse(raw_output) -> list
    def normalize(parsed_data) -> list
```

Built-in adapters:
- `NmapScanner` — Port scanning and service detection
- `DNSScanner` — DNS record enumeration
- `WebScanner` — HTTP service probing
- `PortScanner` — TCP connect port scanning

### Adding a New Adapter

1. Create a new file in `backend/app/scanners/`
2. Inherit from `BaseScanner`
3. Implement all required methods
4. Register in `backend/app/scanners/__init__.py`

---

## Safety Controls

- **Scope Confirmation** — Active scans require explicit authorization confirmation
- **Rate Limiting** — Configurable max requests per second
- **Concurrent Limits** — Max concurrent scan workers
- **Command Validation** — No arbitrary shell execution from frontend
- **Input Sanitization** — All user inputs validated before processing
- **Audit Logging** — All scan operations logged with timestamps

---

## Troubleshooting

### Common Issues

**Docker won't start:**
```bash
docker compose down -v
docker compose up --build
```

**Database connection errors:**
```bash
docker compose logs postgres
```

**Worker not processing tasks:**
```bash
docker compose logs worker
```

**Frontend can't reach backend:**
- Check `nginx.conf` proxy settings
- Ensure backend is running on port 8000

### Logs

```bash
# Backend logs
docker compose logs backend

# Worker logs
docker compose logs worker

# Database logs
docker compose logs postgres
```

---

## Development

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Security Considerations

- Store API keys securely (never in frontend code)
- Use HTTPS in production
- Change default database passwords
- Rotate JWT signing keys regularly
- Enable authentication for all API access
- Monitor scan logs for unexpected activity

---

## License

MIT License — See LICENSE file for details.

---

**Built for security professionals who operate ethically and within legal boundaries.**
# recon-tool
