import fetch from 'node-fetch';
const JEV_API_URL = 'https://gateway.vercel.ai/api/';
const JEV_API_KEY = process.env.VERCEL_JEV_API_KEY;
async function postJev(endpoint, payload) {
    const res = await fetch(JEV_API_URL + endpoint, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${JEV_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs: payload }),
    });
    if (!res.ok)
        throw new Error(`Jev request failed ${res.status}`);
    return (await res.json());
}
export async function triageLogBatch(logs) {
    const [scoreRes, choiceRes, noulRes] = await Promise.all([
        postJev('score', logs),
        postJev('choice', logs),
        postJev('noul', logs),
    ]);
    const results = {};
    results[scoreRes.type] = { type: 'Score', result: scoreRes.result };
    results[choiceRes.type] = { type: 'Choice', result: choiceRes.result };
    try {
        results[noulRes.type] = { type: 'Noul', result: noulRes.result };
    }
    catch {
        results[noulRes.type] = { type: 'Noul', result: { unique: false, description: '' } };
    }
    return results;
}
//# sourceMappingURL=jevEngine.js.map