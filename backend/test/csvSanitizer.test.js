import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeCsvCell, generateSanitizedCsv } from '../src/utils/csvSanitizer.js';

test('sanitizeCsvCell prefixes dangerous formula symbols with a single quote', () => {
  assert.equal(sanitizeCsvCell('=SUM(A1:B10)'), "'=SUM(A1:B10)");
  assert.equal(sanitizeCsvCell('+cmd|/c calc'), "'+cmd|/c calc");
  assert.equal(sanitizeCsvCell('-12345'), "'-12345");
  assert.equal(sanitizeCsvCell('@someMacro'), "'@someMacro");
});

test('sanitizeCsvCell leaves safe standard values untouched', () => {
  assert.equal(sanitizeCsvCell('Apex Bottlers Inc'), 'Apex Bottlers Inc');
  assert.equal(sanitizeCsvCell('Converting Facility'), 'Converting Facility');
  assert.equal(sanitizeCsvCell(''), '');
  assert.equal(sanitizeCsvCell(null), '');
});

test('generateSanitizedCsv generates compliant multi-row CSV payload', () => {
  const headers = ['Company', 'Contact', 'FormulaTest'];
  const rows = [
    ['Apex Beverages', 'David Vance', '=1+1'],
    ['Metro Pharma', 'Sarah Jenkins', 'Normal Text']
  ];

  const csv = generateSanitizedCsv(headers, rows);
  assert.ok(csv.includes('"Company","Contact","FormulaTest"'));
  assert.ok(csv.includes('"\'=1+1"'));
  assert.ok(csv.includes('"Normal Text"'));
});
