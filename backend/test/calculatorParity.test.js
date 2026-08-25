import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculatePackagingEstimate, DEFAULT_RATES } from '../src/domain/estimating/calculator.js';

// Fixed Test Fixture Inputs
const FIXTURES = [
  {
    name: 'Standard Flexo 50k Roll Labels',
    input: {
      category: 'flexo_labels',
      substrate: 'polypropylene_white',
      widthMm: 85,
      heightMm: 120,
      quantity: 50000,
      marginPercent: 25,
      embellishments: ['uv_varnish'],
      waiveTooling: false
    }
  },
  {
    name: 'VIP High-Volume 500k Labels with Cold Foil and Waived Tooling',
    input: {
      category: 'flexo_labels',
      substrate: 'polypropylene_silver',
      widthMm: 100,
      heightMm: 150,
      quantity: 500000,
      marginPercent: 18,
      embellishments: ['uv_varnish', 'cold_foil_gold'],
      waiveTooling: true
    }
  },
  {
    name: 'Offset Packaging 100k Medicine Cartons',
    input: {
      category: 'offset_packaging',
      substrate: 'fbb_carton',
      widthMm: 60,
      heightMm: 140,
      quantity: 100000,
      marginPercent: 30,
      embellishments: ['uv_varnish'],
      waiveTooling: false
    }
  }
];

test('Calculator Parity Fixture: All fixtures produce deterministic mathematical outputs', () => {
  for (const fixture of FIXTURES) {
    const output = calculatePackagingEstimate(fixture.input);

    assert.ok(output.singleLabelAreaCm2 > 0, `${fixture.name}: invalid area`);
    assert.ok(output.totalSqMeters > 0, `${fixture.name}: invalid sq meters`);
    assert.ok(output.linearMeters > 0, `${fixture.name}: invalid linear meters`);
    assert.ok(output.materialCostZMW > 0, `${fixture.name}: invalid material cost`);
    assert.ok(output.pressRunHours > 0, `${fixture.name}: invalid press run hours`);
    assert.ok(output.finalGrossPriceZMW > output.netPriceZMW, `${fixture.name}: VAT must be positive`);
    assert.equal(output.finalGrossPriceZMW, Number((output.netPriceZMW + output.vatZMW).toFixed(2)), `${fixture.name}: Gross must equal Net + VAT`);
    assert.equal(output.unitPriceZMW, Number((output.finalGrossPriceZMW / fixture.input.quantity).toFixed(4)), `${fixture.name}: Unit price must equal Gross / Qty`);
  }
});
