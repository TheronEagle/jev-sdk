import { triageLogBatch } from '../services/jevEngine.js';
describe('jevEngine', () => {
    it('returns a result object with three keys', async () => {
        const logs = ['INFO 123 test'];
        const result = await triageLogBatch(logs);
        expect(Object.keys(result)).toContain('Score');
        expect(Object.keys(result)).toContain('Choice');
        expect(Object.keys(result)).toContain('Noul');
    });
});
