import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runSlaMonitor } from '../src/jobs/slaMonitor.js';
import { runQuoteExpirySweep } from '../src/jobs/quoteExpiry.js';

test('runSlaMonitor handles null client gracefully without throwing', async () => {
  const result = await runSlaMonitor(null);
  assert.equal(result.checkedCount, 0);
  assert.equal(result.alertCount, 0);
});

test('runQuoteExpirySweep handles null client gracefully without throwing', async () => {
  const result = await runQuoteExpirySweep(null);
  assert.equal(result.expiredCount, 0);
});
