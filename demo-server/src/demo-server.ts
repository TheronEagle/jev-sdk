import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "jev-sdk-demo-server" });
});

// Proxy endpoint to Vercel AI Gateway Jev
app.post("/api/triage", async (req, res) => {
  const logs: string[] = req.body.logs;
  const apiKey = req.headers.authorization?.replace("Bearer ", "");

  if (!Array.isArray(logs)) {
    return res.status(400).json({ error: "logs must be an array" });
  }
  if (!apiKey) {
    return res.status(401).json({ error: "Authorization header required" });
  }

  try {
    const response = await fetch("https://gateway.vercel.ai/api/triage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({ logs })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: `Jev API error: ${err}` });
    }

    const results = await response.json();
    
    // Check for short-circuit
    const score = results.Score?.result?.blastRadius ?? 0;
    const securityProb = results.Choice?.result?.probability ?? 0;
    const isSecurity = results.Choice?.result?.team === "Security";
    
    if (score > 4.0 || (isSecurity && securityProb > 0.85)) {
      return res.json({ ...results, shortCircuited: true });
    }
    
    res.json(results);
  } catch (error) {
    console.error("Triage error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Internal error" });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`jev-sdk demo server running on port ${port}`);
});