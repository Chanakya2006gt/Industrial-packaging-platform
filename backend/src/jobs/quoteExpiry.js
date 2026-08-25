/**
 * 30-Day Quote Expiry Sweep Job
 * Automatically marks issued quotes older than 30 days as EXPIRED to protect plant margins against raw material paper/foil price changes.
 */

import { secureLogger } from '../utils/bootGuards.js';

export async function runQuoteExpirySweep(supabaseClient) {
  secureLogger.info('Running 30-day quote expiry sweep');

  if (!supabaseClient) {
    return { expiredCount: 0 };
  }

  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: expiredQuotes, error } = await supabaseClient
      .from('rfq_inquiries')
      .update({ status: 'expired' })
      .eq('status', 'quoted')
      .lt('updated_at', thirtyDaysAgo)
      .select('id, reference_no');

    if (error) {
      secureLogger.error('Quote expiry sweep error', { error: error.message });
      return { expiredCount: 0 };
    }

    const expiredCount = expiredQuotes?.length || 0;
    if (expiredCount > 0) {
      secureLogger.info(`Expired ${expiredCount} stale quote(s) (> 30 days old)`);
    }

    return { expiredCount };
  } catch (err) {
    secureLogger.error('Quote expiry sweep failed', { error: err.message });
    return { expiredCount: 0 };
  }
}
