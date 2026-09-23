import express from "express";
import cors from "cors";
import { triageLogBatch } from "./services/jevEngine.js";
const app = express();
app.use(cors());
app.use(express.json());
app.post("/api/triage", async (req, res) => {
    const logs = req.body.logs;
    if (!Array.isArray(logs)) {
        return res.status(400).json({ error: "logs must be an array" });
    }
    try {
        const results = await triageLogBatch(logs);
        const score = results["Score"].result.blastRadius;
        const securityProb = results["Choice"].result.probability;
        if (score > 4.0 || securityProb > 0.85) {
            // high-priority short-circuit
            return res.json({ ...results, shortCircuited: true });
        }
        res.json(results);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
});
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`jev-sdk demo backend listening on ${port}`);
});
//# sourceMappingURL=demo-server.js.map