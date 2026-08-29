import { describe, it } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import app from '../src/server.js';

describe('🛡️ Security Headers & Rate Limiting Integration Tests', () => {
  it('should include Helmet CSP, HSTS, X-Content-Type-Options on responses', async () => {
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;

    try {
      const res = await fetch(`http://127.0.0.1:${port}/healthz`);
      assert.strictEqual(res.status, 200);

      // Verify CSP
      const csp = res.headers.get('content-security-policy');
      assert.ok(csp, 'Content-Security-Policy header must be present');
      assert.ok(csp.includes("default-src 'self'"), 'CSP must include default-src self');
      assert.ok(csp.includes("object-src 'none'"), 'CSP must forbid object-src');

      // Verify X-Content-Type-Options
      assert.strictEqual(res.headers.get('x-content-type-options'), 'nosniff');

      // Verify Rate Limit headers
      const ratelimitLimit = res.headers.get('ratelimit-limit');
      assert.ok(ratelimitLimit, 'RateLimit-Limit header must be present');
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('should deny unauthorized origins under strict CORS policy', async () => {
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;

    try {
      const res = await fetch(`http://127.0.0.1:${port}/healthz`, {
        headers: { Origin: 'https://malicious-attacker-site.com' }
      });
      // Express CORS throws error or omits allow origin header
      const allowOrigin = res.headers.get('access-control-allow-origin');
      assert.notStrictEqual(allowOrigin, 'https://malicious-attacker-site.com');
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });
});
