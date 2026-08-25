/**
 * CSV / Formula Injection Sanitizer
 * Defends spreadsheets (Excel, Google Sheets, LibreOffice) against DDE formula execution.
 * Any cell starting with =, +, -, @, TAB, or CR is prefixed with a single quote (').
 */

const DANGEROUS_PREFIXES = ['=', '+', '-', '@', '\t', '\r'];

export function sanitizeCsvCell(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const str = String(value).trim();
  if (str.length === 0) {
    return '';
  }

  const firstChar = str.charAt(0);
  if (DANGEROUS_PREFIXES.includes(firstChar)) {
    return `'${str}`;
  }

  return str;
}

export function generateSanitizedCsv(headers, rows) {
  const sanitizedHeaders = headers.map(h => `"${sanitizeCsvCell(h).replace(/"/g, '""')}"`).join(',');
  const sanitizedRows = rows.map(row => 
    row.map(cell => `"${sanitizeCsvCell(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');

  return `${sanitizedHeaders}\n${sanitizedRows}`;
}
