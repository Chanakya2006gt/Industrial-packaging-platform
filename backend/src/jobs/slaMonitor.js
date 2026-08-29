/**
 * Background SLA Monitor Job
 * Checks pending client RFQs and alerts estimators if an inquiry has waited > 3 hours without a quote.
 */

import { secureLogger } from '../utils/bootGuards.js';

export async function runSlaMonitor(supabaseClient) {
  secureLogger.info('Running 3-hour SLA monitor sweep');
  
  if (!supabaseClient) {
    return { checkedCount: 0, alertCount: 0 };
  }

  try {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    
    const { data: overdueRfqs, error } = await supabaseClient
      .from('rfq_inquiries')
      .select('id, reference_no, company_name, created_at')
      .eq('status', 'pending')
      .lt('created_at', threeHoursAgo);

    if (error) {
      secureLogger.error('SLA monitor query error', { error: error.message });
      return { checkedCount: 0, alertCount: 0 };
    }

    const alertCount = overdueRfqs?.length || 0;
    if (alertCount > 0) {
      const references = overdueRfqs.map((r) => r.reference_no);
      secureLogger.warn(`[SLA ALERT] ${alertCount} RFQ(s) approaching 3-hour turnaround deadline!`, {
        references
      });

      // Dispatch webhook if SLA_WEBHOOK_URL is configured
      const webhookUrl = process.env.SLA_WEBHOOK_URL;
      if (webhookUrl && typeof fetch !== 'undefined') {
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              alert: 'SLA_TURNAROUND_BREACH_WARNING',
              thresholdHours: 3,
              timestamp: new Date().toISOString(),
              count: alertCount,
              overdueRfqs: overdueRfqs.map(r => ({ ref: r.reference_no, company: r.company_name, submitted: r.created_at }))
            })
          });
          secureLogger.info('Dispatched SLA alert to configured webhook URL');
        } catch (whErr) {
          secureLogger.error('Failed to post SLA alert webhook', { error: whErr.message });
        }
      }
    }

    return { checkedCount: alertCount, alertCount };
  } catch (err) {
    secureLogger.error('SLA monitor failed', { error: err.message });
    return { checkedCount: 0, alertCount: 0 };
  }
}
