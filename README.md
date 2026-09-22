# jev-triage

A strict TypeScript ESM repository that ingests log streams, evaluates them with Vercel AI Gateway Jev, and triggers high‑priority alerts based on the results.

## Features
- **TypeScript** with strict mode and ESM support.
- **Jev Engine**: Three parallel evaluation heads – `score`, `choice`, and `noul`.
- **Express API**: `/logs` endpoint accepts an array of log strings.
- **Security short‑circuit**: If the score is > 4.0 or the `Security` choice probability > 0.85, the process exits `1` immediately.
- **Mock stream generator**: `src/utils/mockStream.ts` creates 500 normal logs and 50 DB error logs for testing.
- **Production‑ready**: Includes `package.json`, `tsconfig.json`, and a README.

## Setup
```bash
# Install dependencies
npm install

# Set your Vercel Jev API key
export VERCEL_JEV_API_KEY=sk_your_key_here

# Run the dev server (ts-node)
npm run dev

# Or build and run the compiled output
npm run build
node dist/index.js
```

Make sure your environment has `node-fetch`‑compatible resolution (Node 20 or later) and that your network permits outbound HTTPS to `gateway.vercel.ai`.
