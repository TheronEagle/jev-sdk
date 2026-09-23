import { randomUUID } from 'node:crypto';
export async function generateMockLogs() {
    const logs = [];
    for (let i = 0; i < 500; i++) {
        logs.push(`INFO ${Date.now()} [${randomUUID()}] Operation successful`);
    }
    for (let i = 0; i < 50; i++) {
        logs.push(`ERROR ${Date.now()} [${randomUUID()}] DB connection failed`);
    }
    return logs;
}
