import { describe, it, expect } from '@jest/globals';

// Mock the Jev engine for testing
async function mockTriageLogBatch(logs) {
  const hasDbError = logs.some(l => /database|db|connection/i.test(l));
  const hasSecurity = logs.some(l => /security|breach|attack|unauthorized|injection/i.test(l));
  const hasAnomaly = logs.some(l => /anomaly|unique|never seen|strange/i.test(l));
  const errorCount = logs.filter(l => /error|fail|exception/i.test(l)).length;
  const warnCount = logs.filter(l => /warn/i.test(l)).length;
  
  let blastRadius = 1;
  let confidence = 0.5;
  if (hasSecurity) { blastRadius = 5; confidence = 0.95; }
  else if (hasDbError && errorCount > 3) { blastRadius = 4.5; confidence = 0.85; }
  else if (errorCount > 0) { blastRadius = 3 + Math.min(errorCount * 0.3, 1.5); confidence = 0.7; }
  else if (warnCount > 0) { blastRadius = 2; confidence = 0.6; }
  else { blastRadius = 1; confidence = 0.9; }
  
  let team = 'Infra';
  let prob = 0.6;
  if (hasSecurity) { team = 'Security'; prob = 0.92; }
  else if (hasDbError) { team = 'Core-API'; prob = 0.78; }
  else if (logs.some(l => /frontend|ui|browser|css|js/i.test(l))) { team = 'Frontend'; prob = 0.72; }
  
  const unique = hasAnomaly || (hasSecurity && Math.random() > 0.5);
  
  return {
    Score: { type: 'Score', result: { blastRadius: Math.min(5, blastRadius), confidence } },
    Choice: { type: 'Choice', result: { team, probability: prob } },
    Noul: { type: 'Noul', result: { unique, description: unique ? 'Pattern not seen in last 30 days' : 'Matches known pattern' } }
  };
}

describe('jev-sdk triage logic', () => {
  describe('Score head', () => {
    it('returns low blast radius for normal logs', async () => {
      const logs = ['INFO Request processed', 'INFO Health check passed'];
      const result = await mockTriageLogBatch(logs);
      expect(result.Score.result.blastRadius).toBeLessThanOrEqual(2);
    });

    it('returns high blast radius for security events', async () => {
      const logs = ['ERROR SQL injection attempt', 'CRITICAL Unauthorized access'];
      const result = await mockTriageLogBatch(logs);
      expect(result.Score.result.blastRadius).toBe(5);
    });

    it('returns elevated blast radius for DB errors', async () => {
      const logs = [
        'ERROR Connection timeout to replica-1',
        'ERROR Connection timeout to replica-2',
        'ERROR Connection timeout to replica-3',
        'ERROR All replicas unreachable'
      ];
      const result = await mockTriageLogBatch(logs);
      expect(result.Score.result.blastRadius).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Choice head', () => {
    it('assigns Security team for security events', async () => {
      const logs = ['ERROR Security breach detected'];
      const result = await mockTriageLogBatch(logs);
      expect(result.Choice.result.team).toBe('Security');
      expect(result.Choice.result.probability).toBeGreaterThan(0.85);
    });

    it('assigns Core-API team for DB errors', async () => {
      const logs = ['ERROR Database connection failed'];
      const result = await mockTriageLogBatch(logs);
      expect(result.Choice.result.team).toBe('Core-API');
    });

    it('assigns Frontend team for UI logs', async () => {
      const logs = ['WARN Frontend render slow', 'ERROR JS exception in browser'];
      const result = await mockTriageLogBatch(logs);
      expect(result.Choice.result.team).toBe('Frontend');
    });

    it('defaults to Infra for unknown logs', async () => {
      const logs = ['INFO Unknown service started'];
      const result = await mockTriageLogBatch(logs);
      expect(result.Choice.result.team).toBe('Infra');
    });
  });

  describe('Noul head', () => {
    it('detects unique anomalies', async () => {
      const logs = ['WARN Anomaly: never seen pattern'];
      const result = await mockTriageLogBatch(logs);
      expect(result.Noul.result.unique).toBe(true);
    });

    it('recognizes known patterns', async () => {
      const logs = ['INFO Normal operation'];
      const result = await mockTriageLogBatch(logs);
      expect(result.Noul.result.unique).toBe(false);
    });
  });

  describe('Short-circuit logic', () => {
    it('triggers on score > 4.0', async () => {
      const logs = ['ERROR Security breach', 'CRITICAL Attack detected'];
      const result = await mockTriageLogBatch(logs);
      const shouldExit = result.Score.result.blastRadius > 4.0 || 
                         (result.Choice.result.team === 'Security' && result.Choice.result.probability > 0.85);
      expect(shouldExit).toBe(true);
    });

    it('triggers on security probability > 0.85', async () => {
      const logs = ['ERROR Security breach attempt'];
      const result = await mockTriageLogBatch(logs);
      const shouldExit = result.Score.result.blastRadius > 4.0 || 
                         (result.Choice.result.team === 'Security' && result.Choice.result.probability > 0.85);
      expect(shouldExit).toBe(true);
    });

    it('does not trigger for normal operations', async () => {
      const logs = ['INFO Request processed', 'INFO Health check'];
      const result = await mockTriageLogBatch(logs);
      const shouldExit = result.Score.result.blastRadius > 4.0 || 
                         (result.Choice.result.team === 'Security' && result.Choice.result.probability > 0.85);
      expect(shouldExit).toBe(false);
    });
  });
});