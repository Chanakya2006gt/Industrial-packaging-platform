/**
 * Client-Side Binary Magic-Byte File Validator (Strict Fail-Closed)
 * Inspects binary headers of uploaded CAD dielines, vector PDFs, PNGs, and ZIP archives.
 */

export const ALLOWED_SIGNATURES: { ext: string; mime: string; bytes: number[] }[] = [
  // PDF: %PDF (25 50 44 46)
  { ext: 'pdf', mime: 'application/pdf', bytes: [0x25, 0x50, 0x44, 0x46] },
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  { ext: 'png', mime: 'image/png', bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
  // JPEG: FF D8 FF
  { ext: 'jpg', mime: 'image/jpeg', bytes: [0xFF, 0xD8, 0xFF] },
  { ext: 'jpeg', mime: 'image/jpeg', bytes: [0xFF, 0xD8, 0xFF] },
  // ZIP: PK (50 4B 03 04)
  { ext: 'zip', mime: 'application/zip', bytes: [0x50, 0x4B, 0x03, 0x04] },
  // AI / EPS PostScript: %! (25 21)
  { ext: 'ai', mime: 'application/postscript', bytes: [0x25, 0x21] },
  { ext: 'eps', mime: 'application/postscript', bytes: [0x25, 0x21] }
];

export async function validateClientFileMagicBytes(file: File): Promise<{ valid: boolean; reason?: string }> {
  if (!file) return { valid: false, reason: 'No file provided' };

  // 25MB max size limit
  if (file.size > 25 * 1024 * 1024) {
    return { valid: false, reason: 'File exceeds 25MB maximum upload limit.' };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  // SVG XML text header inspection
  if (ext === 'svg') {
    try {
      const text = await file.slice(0, 100).text();
      if (text.includes('<svg') || text.includes('<?xml')) {
        return { valid: true };
      }
      return { valid: false, reason: 'Invalid SVG file. Missing XML or SVG markup header.' };
    } catch {
      return { valid: false, reason: 'Unable to inspect SVG header.' };
    }
  }

  const expected = ALLOWED_SIGNATURES.find(s => s.ext === ext);
  if (!expected) {
    // Fail closed: Unknown extension
    return { valid: false, reason: `Unsupported file extension .${ext}. Allowed types: .pdf, .ai, .eps, .svg, .png, .jpg, .zip` };
  }

  try {
    const buffer = await file.slice(0, 8).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    for (let i = 0; i < expected.bytes.length; i++) {
      if (bytes[i] !== expected.bytes[i]) {
        return { valid: false, reason: `File header mismatch. The file content does not match genuine .${ext.toUpperCase()} binary signature.` };
      }
    }

    return { valid: true };
  } catch (err: any) {
    return { valid: false, reason: `Inspection failed: ${err.message}` };
  }
}
