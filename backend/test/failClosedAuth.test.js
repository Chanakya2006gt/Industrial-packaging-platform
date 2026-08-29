import { describe, it } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import app from '../src/server.js';

describe('🔒 Fail-Closed Authentication Middleware Tests', () => {
  it('should return 401 when Authorization header is completely missing', async () => {
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;

    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/estimator/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ widthMm: 80, heightMm: 120, quantity: 5000 })
      });
      assert.strictEqual(res.status, 401);
      const json = await res.json();
      assert.ok(json.error.includes('Missing Bearer token'));
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('should return 401 when Bearer token is malformed', async () => {
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;

    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/estimator/calculate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '
        },
        body: JSON.stringify({ widthMm: 80, heightMm: 120, quantity: 5000 })
      });
      assert.strictEqual(res.status, 401);
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });
});
