# jev-sdk

A strict TypeScript ESM SDK for real-time log triage using **Vercel AI Gateway Jev**. Ingest log streams, evaluate them with three parallel AI evaluation heads, and trigger high-priority alerts automatically.

[![CI](https://github.com/TheronEagle/jev-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/TheronEagle/jev-sdk/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/jev-sdk)](https://www.npmjs.com/package/jev-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://theroneagle.github.io/jev-sdk)
[![Tests](https://img.shields.io/badge/Tests-12%20passing-green)](tests/)

## 🚀 Why jev-sdk?

| Problem | Solution |
|---------|----------|
| **Alert fatigue** from thousands of logs | AI-powered triage scores blast radius 1–5 |
| **Wrong team gets paged** | Auto-routes to Infra, Core-API, Frontend, or Security |
| **Missing novel anomalies** | Noul head detects unique, never-before-seen patterns |
| **Slow incident response** | Sub-400ms evaluation with instant short-circuit |

## ✨ Features

- **Three parallel Jev heads** — Score (blast radius), Choice (owning team), Noul (anomaly detection)
- **Express API** — `/api/triage` endpoint for batch log evaluation
- **Security short-circuit** — Exits immediately if Score > 4.0 or Security probability > 0.85
- **Mock stream generator** — 500 normal + 50 DB error logs for testing
- **Interactive demo** — [Live at GitHub Pages](https://theroneagle.github.io/jev-sdk) with mock & real API modes
- **Comprehensive tests** — 12 passing tests covering all triage logic
- **TypeScript + ESM** — Strict mode, full type safety

## 📦 Quick Start

```bash
# Install
npm install jev-sdk
# or from source:
git clone https://github.com/TheronEagle/jev-sdk.git
cd jev-sdk && npm install

# Configure
export VERCEL_JEV_API_KEY=your_jev_key_here

# Run the triage server
npm run dev
# Server starts on http://localhost:3000

# Or run the demo backend (CORS-enabled for browser)
npm run demo-server
# Demo backend on http://localhost:3001
```

## 🎮 Try the Demo

Visit **https://theroneagle.github.io/jev-sdk/** — no API key needed!

1. Click **"Security Breach Attempt"** or **"DB Connection Storm"**
2. Hit **"Triage Batch"** — see instant results in Mock Mode
3. Switch to **"Real API Mode"**, paste your key, test against live Jev

## 📡 API Usage

### POST `/api/triage`

```bash
curl -X POST http://localhost:3001/api/triage \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VERCEL_JEV_API_KEY" \
  -d '{"logs": [
    "ERROR 2024-01-15T10:31:00Z [database] Connection timeout to replica-3",
    "ERROR 2024-01-15T10:31:05Z [database] All replicas unreachable"
  ]}'
```

**Response:**
```json
{
  "Score": { "type": "Score", "result": { "blastRadius": 4.5, "confidence": 0.85 } },
  "Choice": { "type": "Choice", "result": { "team": "Core-API", "probability": 0.78 } },
  "Noul": { "type": "Noul", "result": { "unique": false, "description": "Matches known pattern" } }
}
```

### Short-circuit behavior

If `blastRadius > 4.0` OR `team === "Security" && probability > 0.85`:
- Server exits with code `1` (main server) or returns `{ shortCircuited: true }` (demo server)
- Integrate with your alerting: PagerDuty, Opsgenie, Slack, etc.

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Log Stream │────▶│  jev-sdk     │────▶│  3 Jev Heads    │
│  (stdin/    │     │  (Express)   │     │  1. Score       │
│   HTTP/     │     │  /api/triage │     │  2. Choice      │
│   file)     │     │              │     │  3. Noul        │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                    ┌──────────────────────────────┘
                    ▼
           ┌──────────────────┐
           │ Short-circuit?   │
           │ Score>4.0 OR     │
           │ Security>0.85    │
           └────────┬─────────┘
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
    Exit(1) /           Continue / Alert
    Alert ops           Normal flow
```

## 🧪 Testing

```bash
# Run all tests
npm test

# With coverage
npm test -- --coverage
```

**Test coverage:** 12 tests covering Score, Choice, Noul heads + short-circuit logic.

## 🌐 Live Demo

**[https://theroneagle.github.io/jev-sdk/](https://theroneagle.github.io/jev-sdk/)**

Features:
- **Mock mode** — instant simulated responses
- **Real API mode** — your key, live Jev calls
- **5 scenarios** — Normal, DB Storm, Security, Mixed, Anomaly
- **Summary cards** — blast radius, team, confidence, Noul
- **Tabs** — Details, Annotated Logs, Raw JSON

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork & branch: `git checkout -b feat/amazing-feature`
2. Add tests for new logic
3. Run `npm test && npm run lint`
4. Open PR with clear description

## 📄 License

MIT — use freely in personal or commercial projects.

---

**Built with ❤️ for developers drowning in logs.**  
Star ⭐ the repo if it saves you an on-call wake-up!