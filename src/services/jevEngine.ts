import fetch from "node-fetch";
import type { JevResponse, JevNoul } from "./types";

const JEV_API_URL = 'https://gateway.vercel.ai/api/';
const JEV_API_KEY = process.env.VERCEL_JEV_API_KEY as string;

async function postJev(endpoint: string, payload: string[]) {
  const res = await fetch(JEV_API_URL + endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${JEV_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ logs: payload }),
  });
  if (!res.ok) throw new Error(`Jev request failed ${res.status}`);
  return (await res.json()) as any;
}

export async function triageLogBatch(logs: string[]) {
  const [scoreRes, choiceRes, noulRes] = await Promise.all([
    postJev('score', logs),
    postJev('choice', logs),
    postJev('noul', logs),
  ]);

  const results: Record<string, JevResponse> = {};
  results[scoreRes.type] = { type: 'Score', result: scoreRes.result };
  results[choiceRes.type] = { type: 'Choice', result: choiceRes.result };

  try {
    const noul = noulRes.result as JevNoul;
    results[noulRes.type] = { type: 'Noul', result: noul };
  } catch {
    results[noulRes.type] = { type: 'Noul', result: { unique: false, description: '' } };
  }
  return results;
}
