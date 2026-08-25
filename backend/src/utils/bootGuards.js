/**
 * Fail-Closed Production Boot Guards & Structured Secure Logger
 */

export function assertRequiredEnv() {
  const isProd = process.env.NODE_ENV === 'production';
  const requiredInProd = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  if (isProd) {
    const missing = requiredInProd.filter(key => !process.env[key]);
    if (missing.length > 0) {
      console.error(`[FATAL BOOT GUARD] Missing required production environment variables: ${missing.join(', ')}`);
      process.exit(1);
    }
  }
}

export const secureLogger = {
  info: (msg, meta) => {
    console.log(JSON.stringify({ level: 'info', time: new Date().toISOString(), msg, ...sanitizeMeta(meta) }));
  },
  warn: (msg, meta) => {
    console.warn(JSON.stringify({ level: 'warn', time: new Date().toISOString(), msg, ...sanitizeMeta(meta) }));
  },
  error: (msg, meta) => {
    console.error(JSON.stringify({ level: 'error', time: new Date().toISOString(), msg, ...sanitizeMeta(meta) }));
  }
};

const SENSITIVE_KEYS = ['password', 'secret', 'key', 'token', 'authorization', 'cookie'];

function sanitizeMeta(meta) {
  if (!meta || typeof meta !== 'object') return {};
  const cleaned = {};
  for (const [k, v] of Object.entries(meta)) {
    if (SENSITIVE_KEYS.some(sk => k.toLowerCase().includes(sk))) {
      cleaned[k] = '[REDACTED]';
    } else {
      cleaned[k] = v;
    }
  }
  return cleaned;
}
