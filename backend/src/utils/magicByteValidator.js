/**
 * Binary Magic-Byte File Inspection (Strict Fail-Closed)
 * Validates uploaded CAD dielines, vector artwork, and PDF files against real file signatures.
 */

export const ALLOWED_SIGNATURES = [
  // PDF: %PDF (25 50 44 46)
  { extension: 'pdf', mime: 'application/pdf', bytes: [0x25, 0x50, 0x44, 0x46] },
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  { extension: 'png', mime: 'image/png', bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
  // JPEG: FF D8 FF
  { extension: 'jpg', mime: 'image/jpeg', bytes: [0xFF, 0xD8, 0xFF] },
  { extension: 'jpeg', mime: 'image/jpeg', bytes: [0xFF, 0xD8, 0xFF] },
  // ZIP (for CAD archives): PK (50 4B 03 04)
  { extension: 'zip', mime: 'application/zip', bytes: [0x50, 0x4B, 0x03, 0x04] },
  // PostScript / AI / EPS: %! (25 21)
  { extension: 'ai', mime: 'application/postscript', bytes: [0x25, 0x21] },
  { extension: 'eps', mime: 'application/postscript', bytes: [0x25, 0x21] }
];

export function validateMagicBytes(buffer, expectedType) {
  if (!buffer || buffer.length < 2) {
    return false;
  }

  const match = ALLOWED_SIGNATURES.find(rule => rule.extension === expectedType.toLowerCase());
  if (!match) {
    // Fail-closed
    return false;
  }

  for (let i = 0; i < match.bytes.length; i++) {
    if (buffer[i] !== match.bytes[i]) {
      return false;
    }
  }

  return true;
}
