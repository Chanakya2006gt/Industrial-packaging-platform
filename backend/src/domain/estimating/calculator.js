/**
 * Core Packaging Mathematical Estimating Engine
 * Calibrated for Heidelberg Speedmaster 6C & 8-Colour UV Flexo Lines
 */

// Default Material Rates (ZMW per square meter)
export const DEFAULT_RATES = {
  polypropylene_white: { pricePerSqm: 12.50, name: 'White Gloss BOPP 60μm' },
  polypropylene_clear: { pricePerSqm: 14.20, name: 'Crystal Clear BOPP' },
  polypropylene_silver: { pricePerSqm: 18.00, name: 'Silver Metallized BOPP' },
  fasson_semi_gloss: { pricePerSqm: 8.50, name: 'Fasson Semi-Gloss Paper' },
  fbb_carton: { pricePerSqm: 9.80, name: 'Folding Boxboard FBB 350gsm' },
  solid_bleached_board: { pricePerSqm: 15.00, name: 'Solid Bleached Board SBB' },
};

export const CTP_PLATE_COST_ZMW = 350; // ZMW per laser CTP plate
export const ROTARY_DIE_COST_ZMW = 1800; // ZMW one-time custom die tooling
export const FLEXO_HOURLY_RATE_ZMW = 1200; // ZMW per machine operating hour
export const OFFSET_HOURLY_RATE_ZMW = 1500; // ZMW per Heidelberg machine hour
export const ZRA_VAT_RATE = 0.16; // 16% Zambia Revenue Authority VAT

export function calculatePackagingEstimate(input, customRates) {
  const {
    category,
    substrate,
    widthMm,
    heightMm,
    quantity,
    marginPercent = 25,
    embellishments = [],
    waiveTooling = false
  } = input;

  // 1. Physical Area Calculations
  const singleLabelAreaCm2 = Number(((widthMm * heightMm) / 100).toFixed(2));
  const webGapMm = 3;
  const linearMeters = Math.round((quantity * (heightMm + webGapMm)) / 1000);
  const totalSqMeters = Number(((quantity * widthMm * (heightMm + webGapMm)) / 1000000).toFixed(2));
  const numberOfRolls = Math.max(1, Math.ceil(quantity / 2500));

  // 2. Raw Material Cost
  const ratePerSqm = customRates?.[substrate] ?? DEFAULT_RATES[substrate]?.pricePerSqm ?? 12.50;
  const materialCostZMW = Number((totalSqMeters * ratePerSqm).toFixed(2));

  // 3. Pre-Press & Tooling Setup
  const ctpPlatesCount = category === 'flexo_labels' ? 6 : category === 'offset_packaging' ? 6 : 4;
  const plateCostZMW = ctpPlatesCount * CTP_PLATE_COST_ZMW;
  const toolingCostZMW = waiveTooling ? 0 : (category === 'flexo_labels' ? ROTARY_DIE_COST_ZMW : 1200);

  // 4. Press Machine Operating Time & Labor
  let pressRunHours = 0;
  let pressCostZMW = 0;
  if (category === 'flexo_labels') {
    const runningMinutes = (linearMeters / 100) + 45;
    pressRunHours = Number((runningMinutes / 60).toFixed(2));
    pressCostZMW = Number((pressRunHours * FLEXO_HOURLY_RATE_ZMW).toFixed(2));
  } else {
    const sheetsCount = Math.ceil(quantity / 4);
    const runningMinutes = (sheetsCount / (8000 / 60)) + 60;
    pressRunHours = Number((runningMinutes / 60).toFixed(2));
    pressCostZMW = Number((pressRunHours * OFFSET_HOURLY_RATE_ZMW).toFixed(2));
  }

  // 5. Inks & Inline Embellishment
  let embellishmentRate = 0.005;
  if (embellishments.includes('cold_foil_gold') || embellishments.includes('cold_foil_silver')) {
    embellishmentRate += 0.025;
  }
  if (embellishments.includes('uv_varnish')) {
    embellishmentRate += 0.008;
  }
  const inkAndFinishingCostZMW = Number((quantity * embellishmentRate).toFixed(2));

  // 6. Subtotals, Margins, and Taxes
  const subtotalBaseCostZMW = Number((materialCostZMW + plateCostZMW + toolingCostZMW + pressCostZMW + inkAndFinishingCostZMW).toFixed(2));
  const marginFraction = marginPercent / 100;
  const marginAmountZMW = Number((subtotalBaseCostZMW * marginFraction).toFixed(2));
  const netPriceZMW = Number((subtotalBaseCostZMW + marginAmountZMW).toFixed(2));
  const vatZMW = Number((netPriceZMW * ZRA_VAT_RATE).toFixed(2));
  const finalGrossPriceZMW = Number((netPriceZMW + vatZMW).toFixed(2));
  const unitPriceZMW = Number((finalGrossPriceZMW / quantity).toFixed(4));

  return {
    singleLabelAreaCm2,
    totalSqMeters,
    linearMeters,
    numberOfRolls,
    materialCostZMW,
    ctpPlatesCount,
    plateCostZMW,
    toolingCostZMW,
    pressRunHours,
    pressCostZMW,
    inkAndFinishingCostZMW,
    subtotalBaseCostZMW,
    marginAmountZMW,
    netPriceZMW,
    vatZMW,
    finalGrossPriceZMW,
    unitPriceZMW
  };
}
