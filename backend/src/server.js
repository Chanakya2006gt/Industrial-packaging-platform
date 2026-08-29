/**
 * Industrial Packaging Platform API Entry Point
 * Express HTTP API with JWT Token Auth, CORS allowlist, Helmet CSP, multi-tier rate limiting, and CPQ endpoints.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import { assertRequiredEnv, secureLogger } from './utils/bootGuards.js';
import { calculatePackagingEstimate, DEFAULT_RATES } from './domain/estimating/calculator.js';
import { sanitizeCsvCell, generateSanitizedCsv } from './utils/csvSanitizer.js';
import { validateMagicBytes } from './utils/magicByteValidator.js';

assertRequiredEnv();

const app = express();
const PORT = process.env.PORT || 5001;

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// 1. Security Headers with Helmet & CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.supabase.co", "https://*.vercel.app"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// 2. Multi-Tier Distributed Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit exceeded for sensitive operation, please retry later.' }
});

app.use(globalLimiter);

// 3. CORS Allowlist Setup
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS origin not allowed by platform security policy.'));
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// 4. Fail-Closed Staff Authentication Middleware
export async function requireStaffAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Missing Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Invalid token format.' });
  }

  // Fail closed if Supabase is unconfigured in production or strict mode
  if (!supabase) {
    if (process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEV_BYPASS === 'true') {
      req.user = { id: 'dev-user', role: 'sales' };
      req.profile = { role: 'sales', is_active: true };
      return next();
    }
    return res.status(500).json({ error: 'Authentication service unavailable.' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired session token.' });
    }

    // Verify user profile role and active status
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    if (profileErr || !profile || profile.is_active === false) {
      return res.status(403).json({ error: 'Staff account inactive or profile not found.' });
    }

    req.user = user;
    req.profile = profile;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token verification failed.' });
  }
}

// 5. Public Health & Metadata Endpoints
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    service: 'packaging-platform-api',
    status: 'healthy',
    facility: '1000 Industrial Parkway, Westgate Logistics Park, Metro City',
    schedule: '24/7 continuous shift production'
  });
});

app.get('/api/rates', (req, res) => {
  res.json({ success: true, rates: DEFAULT_RATES });
});

// 6. Staff-Protected Packaging Estimating CPQ API Endpoint
app.post('/api/estimator/calculate', strictLimiter, requireStaffAuth, (req, res) => {
  try {
    const input = req.body;
    if (!input || !input.widthMm || !input.heightMm || !input.quantity) {
      return res.status(400).json({ error: 'Missing required packaging dimensions or quantity.' });
    }

    const estimate = calculatePackagingEstimate(input);
    return res.json({ success: true, estimate });
  } catch (err) {
    secureLogger.error('Calculation API error', { error: err.message });
    return res.status(500).json({ error: 'Calculation engine error' });
  }
});

// 7. Staff-Protected CSV Export Endpoint
app.post('/api/export/csv', strictLimiter, requireStaffAuth, (req, res) => {
  try {
    const { headers, rows, filename = 'sales_export.csv' } = req.body;
    if (!headers || !rows) {
      return res.status(400).json({ error: 'Headers and rows are required.' });
    }

    const csvContent = generateSanitizedCsv(headers, rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}"`);
    return res.send(csvContent);
  } catch (err) {
    return res.status(500).json({ error: 'CSV export generation error' });
  }
});

// 8. Server-Side Magic-Byte File Validation Endpoint
app.post('/api/upload/validate', strictLimiter, requireStaffAuth, (req, res) => {
  try {
    const { base64Data, expectedType } = req.body;
    if (!base64Data || !expectedType) {
      return res.status(400).json({ error: 'base64Data and expectedType are required.' });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const isValid = validateMagicBytes(buffer, expectedType);

    return res.json({ valid: isValid });
  } catch (err) {
    return res.status(500).json({ error: 'Validation process error' });
  }
});

import { fileURLToPath } from 'url';

// Export app for integration and unit testing
export default app;

// Start Server if executed directly
const isDirectEntry = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectEntry && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    secureLogger.info(`🏭 Industrial Packaging API active on port ${PORT}`);
  });
}
