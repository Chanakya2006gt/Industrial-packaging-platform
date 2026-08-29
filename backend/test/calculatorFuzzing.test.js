import { describe, it } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { calculatePackagingEstimate, DEFAULT_RATES } from '../src/domain/estimating/calculator.js';

describe('🧮 CPQ Calculator Property-Based Fuzzing (1,000 Runs)', () => {
  it('should maintain mathematical invariants across 1,000 random packaging inputs', () => {
    const validSubstrates = Object.keys(DEFAULT_RATES);
    const validCategories = ['flexo_labels', 'offset_packaging', 'commercial_print'];

    fc.assert(
      fc.property(
        fc.constantFrom(...validCategories),
        fc.constantFrom(...validSubstrates),
        fc.integer({ min: 10, max: 2000 }), // width mm
        fc.integer({ min: 10, max: 2000 }), // height mm
        fc.integer({ min: 100, max: 1000000 }), // quantity
        fc.integer({ min: 5, max: 80 }), // margin percent
        fc.boolean(), // waiveTooling
        fc.array(fc.constantFrom('uv_varnish', 'hot_foil_gold', 'embossing', 'matte_lamination'), { maxLength: 3 }),
        (category, substrate, widthMm, heightMm, quantity, marginPercent, waiveTooling, embellishments) => {
          const result = calculatePackagingEstimate({
            category,
            substrate,
            widthMm,
            heightMm,
            quantity,
            marginPercent,
            waiveTooling,
            embellishments
          });

          // Invariant 1: All prices and costs must be finite, non-negative numbers
          assert.ok(Number.isFinite(result.totalSqMeters) && result.totalSqMeters > 0, 'totalSqMeters must be positive');
          assert.ok(Number.isFinite(result.materialCostZMW) && result.materialCostZMW >= 0, 'materialCost must be >= 0');
          assert.ok(Number.isFinite(result.pressCostZMW) && result.pressCostZMW >= 0, 'pressCost must be >= 0');
          assert.ok(Number.isFinite(result.netPriceZMW) && result.netPriceZMW > 0, 'netPrice must be positive');
          assert.ok(Number.isFinite(result.vatZMW) && result.vatZMW >= 0, 'vat must be >= 0');
          assert.ok(Number.isFinite(result.finalGrossPriceZMW) && result.finalGrossPriceZMW > 0, 'finalGrossPrice must be positive');
          assert.ok(Number.isFinite(result.unitPriceZMW) && result.unitPriceZMW > 0, 'unitPrice must be positive');

          // Invariant 2: Waiving tooling must set toolingCost to 0
          if (waiveTooling) {
            assert.strictEqual(result.toolingCostZMW, 0, 'waived tooling must be 0');
          }

          // Invariant 3: Gross price must equal Net price + VAT (within precision tolerance)
          const expectedGross = Math.round(result.netPriceZMW + result.vatZMW);
          assert.ok(Math.abs(result.finalGrossPriceZMW - expectedGross) <= 1, 'Gross price must equal net + vat');

          // Invariant 4: Unit price must equal finalGrossPrice / quantity (within precision)
          const expectedUnit = result.finalGrossPriceZMW / quantity;
          assert.ok(Math.abs(result.unitPriceZMW - expectedUnit) < 0.01, 'Unit price must equal gross / quantity');
        }
      ),
      { numRuns: 1000 }
    );
  });
});
