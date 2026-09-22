import express from "express";
import { triageLogBatch } from "./services/jevEngine";
import type { JevScore, JevChoice } from "./types";

const app = express();
app.use(express.json());

app.post("/logs", async (req, res) => {
  const logs: string[] = req.body.logs;
  if (!Array.isArray(logs)) {
    return res.status(400).send({ error: "logs must be an array" });
  }
  try {
    const results = await triageLogBatch(logs);
    const score = (results['Score'] as { type: 'Score'; result: JevScore }).result.blastRadius;
    const securityProb = (results['Choice'] as { type: 'Choice'; result: JevChoice }).result.probability;
    if (score > 4.0 || securityProb > 0.85) {
      // high‑priority short‑circuit
      process.exit(1);
    }
    res.json(results);
  } catch (e: any) {
    console.error(e);
    res.status(500).send({ error: (e as any).message });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`telemetry-triage-hound listening on ${port}`);
});
