import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateMagicBytes } from '../src/utils/magicByteValidator.js';

test('validateMagicBytes correctly verifies genuine PDF files', () => {
  const validPdf = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x37]);
  assert.equal(validateMagicBytes(validPdf, 'pdf'), true);
});

test('validateMagicBytes rejects invalid or disguised executable files', () => {
  const invalidBuffer = Buffer.from([0x4D, 0x5A, 0x90, 0x00]); // DOS / Windows PE header
  assert.equal(validateMagicBytes(invalidBuffer, 'pdf'), false);
  assert.equal(validateMagicBytes(invalidBuffer, 'png'), false);
});

test('validateMagicBytes validates genuine PNG and ZIP signatures', () => {
  const validPng = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const validZip = Buffer.from([0x50, 0x4B, 0x03, 0x04]);

  assert.equal(validateMagicBytes(validPng, 'png'), true);
  assert.equal(validateMagicBytes(validZip, 'zip'), true);
});
