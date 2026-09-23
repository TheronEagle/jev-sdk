# Contributing to jev-sdk

Thank you for your interest in improving **jev-sdk**! This document outlines the workflow for contributing code, tests, docs, and ideas.

## 🚀 Quick Start for Contributors

```bash
# 1. Fork the repo on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/jev-sdk.git
cd jev-sdk

# 3. Install deps
npm install

# 4. Create a feature branch
git checkout -b feat/your-feature-name

# 5. Make changes, add tests, run checks
npm test && npm run lint

# 6. Push
git push origin feat/your-feature-name
```

## 📋 Development Workflow

### Branch Naming
- `feat/` — new features
- `fix/` — bug fixes
- `docs/` — documentation updates
- `refactor/` — code restructuring
- `test/` — adding/improving tests
- `chore/` — maintenance, deps, CI

### Commit Messages
Use conventional commits:
```
feat: add real-time WebSocket streaming
fix: handle empty log arrays in triage
docs: update README with demo-server usage
test: add coverage for Noul head edge cases
```

### Pre-Push Checklist
- [ ] `npm test` passes (12 tests)
- [ ] `npm run lint` passes (0 errors)
- [ ] `npm run build` compiles without errors
- [ ] New logic has corresponding tests
- [ ] Docs updated if API changed

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode for development
npm test -- --watch

# Coverage report
npm test -- --coverage
```

**Test structure:**
- `tests/triage.test.js` — core triage logic (Score, Choice, Noul, short-circuit)
- Add new tests in `tests/` following the same pattern
- Mock the Jev engine for deterministic tests

## 📝 Code Style

- **TypeScript** strict mode, ESM
- **Prettier** for formatting (`npm run format`)
- **ESLint** for linting (`npm run lint`)
- 2-space indent, single quotes, trailing commas

## 🎯 Priority Areas for Contributions

1. **More Jev heads** — latency, cost, compliance scoring
2. **Transport adapters** — Kafka, Kinesis, file tail, syslog
3. **Alert integrations** — PagerDuty, Opsgenie, Slack, Discord webhooks
4. **Dashboard** — real-time triage visualization
5. **Performance** — benchmark, optimize sub-400ms target
6. **Documentation** — API reference, guides, examples

## 🐛 Reporting Bugs

Use the GitHub issue template. Include:
- Clear reproduction steps
- Expected vs actual behavior
- Environment (Node version, OS)
- Relevant logs/error messages

## 💡 Feature Requests

Use the feature request template. Describe:
- The problem you're solving
- Proposed solution
- Alternatives considered
- Willingness to implement

## 🔐 Security

Report security vulnerabilities privately via GitHub Security Advisories or email the maintainers. Do NOT open public issues for security bugs.

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Questions?** Open a discussion or ping the maintainers. We're happy to help!