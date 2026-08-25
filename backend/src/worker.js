/**
 * Render Background Worker Entry Point
 * Runs continuous 15-minute background maintenance loop for PrintFast Zambia.
 */

import { assertRequiredEnv, secureLogger } from './utils/bootGuards.js';
import { runSlaMonitor } from './jobs/slaMonitor.js';
import { runQuoteExpirySweep } from './jobs/quoteExpiry.js';
import { createClient } from '@supabase/supabase-js';

assertRequiredEnv();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const INTERVAL_MS = Number(process.env.WORKER_INTERVAL_MS) || 15 * 60 * 1000; // 15 minutes default

secureLogger.info('🚀 PrintFast Zambia Background Worker Initialized', { intervalMinutes: INTERVAL_MS / 60000 });

async function runWorkerCycle() {
  secureLogger.info('⚡ Starting worker cycle execution');
  const startTime = Date.now();

  try {
    await runSlaMonitor(supabase);
    await runQuoteExpirySweep(supabase);
  } catch (err) {
    secureLogger.error('Worker cycle execution error', { error: err.message });
  }

  const durationMs = Date.now() - startTime;
  secureLogger.info('✓ Worker cycle completed', { durationMs });
}

// Initial immediate run on startup
runWorkerCycle();

// Continuous scheduling
const intervalId = setInterval(runWorkerCycle, INTERVAL_MS);

// Graceful termination handling
process.on('SIGTERM', () => {
  secureLogger.info('Worker received SIGTERM, stopping scheduled loops...');
  clearInterval(intervalId);
  process.exit(0);
});

process.on('SIGINT', () => {
  secureLogger.info('Worker received SIGINT, stopping scheduled loops...');
  clearInterval(intervalId);
  process.exit(0);
});
