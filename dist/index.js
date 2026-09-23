import express from 'express';
import { triageLogBatch } from './services/jevEngine.js';
const app = express();
app.use(express.json());
app.post('/logs', async (req, res) => {
    const logs = req.body.logs;
    if (!Array.isArray(logs)) {
        return res.status(400).send({ error: 'logs must be an array' });
    }
    try {
        const results = await triageLogBatch(logs);
        const score = results['Score'].result.blastRadius;
        const securityProb = results['Choice'].result
            .probability;
        if (score > 4.0 || securityProb > 0.85) {
            // high‑priority short‑circuit
            process.exit(1);
        }
        res.json(results);
    }
    catch (e) {
        console.error(e);
        res.status(500).send({ error: e instanceof Error ? e.message : String(e) });
    }
});
const port = 3000;
app.listen(port, () => {
    console.log(`telemetry-triage-hound listening on ${port}`);
});
//# sourceMappingURL=index.js.map