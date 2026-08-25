import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculatePackagingEstimate, DEFAULT_RATES } from '../src/domain/estimating/calculator.js';

test('calculatePackagingEstimate calculates accurate flexo roll label parameters', () => {
  const result = calculatePackagingEstimate({
    category: 'flexo_labels',
    substrate: 'polypropylene_white',
    widthMm: 85,
    heightMm: 120,
    quantity: 50000,
    marginPercent: 25
  });

  assert.equal(result.singleLabelAreaCm2, 102.0);
  assert.equal(result.numberOfRolls, 20);
  assert.equal(result.linearMeters, 6150);
  assert.equal(result.ctpPlatesCount, 6);
  assert.ok(result.totalSqMeters > 0);
  assert.ok(result.materialCostZMW > 0);
  assert.ok(result.pressRunHours > 0);
  assert.ok(result.netPriceZMW > result.subtotalBaseCostZMW);
  assert.ok(result.finalGrossPriceZMW > result.netPriceZMW);
  assert.ok(result.unitPriceZMW > 0);
});

test('calculatePackagingEstimate respects waived tooling fee', () => {
  const normal = calculatePackagingEstimate({
    category: 'flexo_labels',
    substrate: 'polypropylene_white',
    widthMm: 50,
    heightMm: 50,
    quantity: 10000,
    waiveTooling: false
  });

  const waived = calculatePackagingEstimate({
    category: 'flexo_labels',
    substrate: 'polypropylene_white',
    widthMm: 50,
    heightMm: 50,
    quantity: 10000,
    waiveTooling: true
  });

  assert.equal(waived.toolingCostZMW, 0);
  assert.ok(normal.toolingCostZMW > 0);
  assert.ok(waived.finalGrossPriceZMW < normal.finalGrossPriceZMW);
});

test('calculatePackagingEstimate supports custom substrate rates', () => {
  const standard = calculatePackagingEstimate({
    category: 'flexo_labels',
    substrate: 'polypropylene_white',
    widthMm: 100,
    heightMm: 100,
    quantity: 20000
  });

  const discounted = calculatePackagingEstimate({
    category: 'flexo_labels',
    substrate: 'polypropylene_white',
    widthMm: 100,
    heightMm: 100,
    quantity: 20000
  }, { polypropylene_white: 5.00 });

  assert.ok(discounted.materialCostZMW < standard.materialCostZMW);
});
