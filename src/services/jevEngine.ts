import fetch from 'node-fetch';
import type { JevResponse, JevScore, JevChoice, JevNoul } from '../types.ts';

const JEV_API_URL = 'https://gateway.vercel.ai/api/';
const JEV_API_KEY = process.env.VERCEL_JEV_API_KEY as string;

async function postJev<T extends JevResponse>(endpoint: string, payload: string[]): Promise<T> {
  const res = await fetch(JEV_API_URL + endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${JEV_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ logs: payload }),
  });
  if (!res.ok) throw new Error(`Jev request failed ${res.status}`);
  return (await res.json()) as T;
}

export async function triageLogBatch(logs: string[]) {
  const [scoreRes, choiceRes, noulRes] = await Promise.all([
    postJev<JevResponse & { type: 'Score'; result: JevScore }>('score', logs),
    postJev<JevResponse & { type: 'Choice'; result: JevChoice }>('choice', logs),
    postJev<JevResponse & { type: 'Noul'; result: JevNoul }>('noul', logs),
  ]);

  const results: Record<string, JevResponse> = {};
  results[scoreRes.type] = { type: 'Score', result: scoreRes.result };
  results[choiceRes.type] = { type: 'Choice', result: choiceRes.result };

  try {
    results[noulRes.type] = { type: 'Noul', result: noulRes.result };
  } catch {
    results[noulRes.type] = { type: 'Noul', result: { unique: false, description: '' } };
  }
  return results;
}
