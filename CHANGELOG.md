# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-09-23

### Added
- Initial release of jev-sdk
- Three parallel Jev evaluation heads: Score, Choice, Noul
- Express API with `/api/triage` endpoint
- Security short-circuit (Score > 4.0 or Security > 0.85)
- Mock stream generator (500 normal + 50 DB error logs)
- Interactive demo site with 3 modes (mock, local, remote)
- Comprehensive test suite (16 tests)
- Performance benchmarks
- CORS-enabled demo server for browser integration
- Vercel-deployable demo server
- CI/CD pipeline with GitHub Actions
- GitHub Pages deployment

### Security
- Input validation on all API endpoints
- CORS configuration for demo server
- Secure API key handling

## [Unreleased]

### Planned
- WebSocket streaming support
- Kafka/Kinesis transport adapters
- PagerDuty/Opsgenie/Slack integrations
- Real-time dashboard
- Additional Jev heads (latency, cost, compliance)
- TypeScript definitions for npm package