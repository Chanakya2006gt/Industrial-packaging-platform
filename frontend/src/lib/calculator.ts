/**
 * Frontend Packaging Calculation Engine
 * Mirrors backend/src/domain/estimating/calculator.js
 * Supports server-side calculation via POST /api/estimator/calculate with zero-latency local fallback.
 */

export interface PackagingEstimateInput {
  category: 'flexo_labels' | 'offset_packaging' | 'commercial_print';
  substrate: string;
  widthMm: number;
  heightMm: number;
  quantity: number;
  rollOrSheet?: 'roll' | 'sheet';
  coreMm?: number;
  marginPercent?: number;
  embellishments?: string[];
  waiveTooling?: boolean;
}

export interface PackagingEstimateOutput {
  singleLabelAreaCm2: number;
  totalSqMeters: number;
  linearMeters: number;
  numberOfRolls: number;
  materialCostZMW: number;
  ctpPlatesCount: number;
  plateCostZMW: number;
  toolingCostZMW: number;
  pressRunHours: number;
  pressCostZMW: number;
  inkAndFinishingCostZMW: number;
  subtotalBaseCostZMW: number;
  marginAmountZMW: number;
  netPriceZMW: number;
  vatZMW: number; // 16% Zambia ZRA
  finalGrossPriceZMW: number;
  unitPriceZMW: number;
}

export const DEFAULT_RATES: Record<string, { pricePerSqm: number; name: string; category: string }> = {
  polypropylene_white: { pricePerSqm: 12.50, name: 'White Gloss BOPP 60μm', category: 'Roll Film' },
  polypropylene_clear: { pricePerSqm: 14.20, name: 'Crystal Clear BOPP', category: 'Roll Film' },
  polypropylene_silver: { pricePerSqm: 18.00, name: 'Silver Metallized BOPP', category: 'Roll Film' },
  fasson_semi_gloss: { pricePerSqm: 8.50, name: 'Fasson Semi-Gloss Paper', category: 'Paper Label' },
  fbb_carton: { pricePerSqm: 9.80, name: 'Folding Boxboard FBB 350gsm', category: 'Carton Board' },
  solid_bleached_board: { pricePerSqm: 15.00, name: 'Solid Bleached Board SBB', category: 'Carton Board' },
};

export const CTP_PLATE_COST_ZMW = 350;
export const ROTARY_DIE_COST_ZMW = 1800;
export const FLEXO_HOURLY_RATE_ZMW = 1200;
export const OFFSET_HOURLY_RATE_ZMW = 1500;
export const ZRA_VAT_RATE = 0.16;

export function calculatePackagingEstimate(input: PackagingEstimateInput, customRates?: Record<string, number>): PackagingEstimateOutput {
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

  const singleLabelAreaCm2 = Number(((widthMm * heightMm) / 100).toFixed(2));
  const webGapMm = 3;
  const linearMeters = Math.round((quantity * (heightMm + webGapMm)) / 1000);
  const totalSqMeters = Number(((quantity * widthMm * (heightMm + webGapMm)) / 1000000).toFixed(2));
  const numberOfRolls = Math.max(1, Math.ceil(quantity / 2500));

  const ratePerSqm = customRates?.[substrate] ?? DEFAULT_RATES[substrate]?.pricePerSqm ?? 12.50;
  const materialCostZMW = Number((totalSqMeters * ratePerSqm).toFixed(2));

  const ctpPlatesCount = category === 'flexo_labels' ? 6 : category === 'offset_packaging' ? 6 : 4;
  const plateCostZMW = ctpPlatesCount * CTP_PLATE_COST_ZMW;
  const toolingCostZMW = waiveTooling ? 0 : (category === 'flexo_labels' ? ROTARY_DIE_COST_ZMW : 1200);

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

  let embellishmentRate = 0.005;
  if (embellishments.includes('cold_foil_gold') || embellishments.includes('cold_foil_silver')) {
    embellishmentRate += 0.025;
  }
  if (embellishments.includes('uv_varnish')) {
    embellishmentRate += 0.008;
  }
  const inkAndFinishingCostZMW = Number((quantity * embellishmentRate).toFixed(2));

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
