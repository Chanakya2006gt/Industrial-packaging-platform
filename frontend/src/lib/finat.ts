/**
 * Industrial-packaging-platform — FINAT unwind spec
 *
 * Drop this file at:
 *   frontend/src/lib/finat.ts
 *
 * Then in ConfiguratorPage.tsx:
 *   import { finatStandardsForViewer, rewindDirectionForRfq, DEFAULT_FINAT } from '../../lib/finat';
 *   const finatStandards = finatStandardsForViewer();
 *   // delete the local `const finatStandards = { 1: {...}, ... }` block
 *   // in handleSubmitRfq:
 *   rewind_direction: rewindDirectionForRfq(rollOrSheet, finatDirection),
 *
 * Optional HUD align in FinatReelViewer.tsx:
 *   import { finatWebTelemetry } from '../../../lib/finat';
 *   const { unitAreaCm2, linearMeters, totalM2, estRolls } = finatWebTelemetry({
 *     widthMm, heightMm, quantity,
 *   });
 *
 * Do not import this into calculator.ts. Unwind is a slitter/applicator spec,
 * not a ZMW input. Column remains rfq_inquiries.rewind_direction.
 *
 * Chart (FINAT handbook §2.8 / converter #1–#8):
 *   1–4 wound OUT    5–8 wound IN
 *   1/5 top          2/6 bottom
 *   3/7 right        4/8 left
 */

export type FinatWinding = 'Wound Out' | 'Wound In';
export type FinatLeadEdge = 'top' | 'bottom' | 'right' | 'left';
export type FinatDirection = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Matches FinatReelViewer + StudioMockupViewer props in this repo. */
export interface FinatViewerSpec {
  title: string;
  winding: FinatWinding;
  leadEdge: string;
  rotationDeg: number;
  headDirection: 'right' | 'left' | 'up' | 'down';
  diagramDesc: string;
}

export interface FinatSpec {
  id: FinatDirection;
  title: string;
  winding: FinatWinding;
  leadEdge: FinatLeadEdge;
  leadEdgeLabel: string;
  copyAxis: 'across' | 'with';
  rotationDeg: 0 | 90 | 180 | 270;
  diagramDesc: string;
}

export const FINAT_STANDARDS: Record<FinatDirection, FinatSpec> = {
  1: {
    id: 1,
    title: 'FINAT #1',
    winding: 'Wound Out',
    leadEdge: 'top',
    leadEdgeLabel: 'Top Edge Off First',
    copyAxis: 'across',
    rotationDeg: 0,
    diagramDesc:
      'Labels on OUTSIDE face of web • Top of artwork feeds first into applicator',
  },
  2: {
    id: 2,
    title: 'FINAT #2',
    winding: 'Wound Out',
    leadEdge: 'bottom',
    leadEdgeLabel: 'Bottom Edge Off First',
    copyAxis: 'across',
    rotationDeg: 180,
    diagramDesc:
      'Labels on OUTSIDE face of web • Bottom of artwork feeds first into applicator',
  },
  3: {
    id: 3,
    title: 'FINAT #3',
    winding: 'Wound Out',
    leadEdge: 'right',
    leadEdgeLabel: 'Right Edge Off First',
    copyAxis: 'with',
    rotationDeg: 90,
    diagramDesc:
      'Labels on OUTSIDE face of web • Right side of artwork leads the exit',
  },
  4: {
    id: 4,
    title: 'FINAT #4',
    winding: 'Wound Out',
    leadEdge: 'left',
    leadEdgeLabel: 'Left Edge Off First',
    copyAxis: 'with',
    rotationDeg: 270,
    diagramDesc:
      'Labels on OUTSIDE face of web • Left side of artwork leads the exit',
  },
  5: {
    id: 5,
    title: 'FINAT #5',
    winding: 'Wound In',
    leadEdge: 'top',
    leadEdgeLabel: 'Top Edge Off First',
    copyAxis: 'across',
    rotationDeg: 0,
    diagramDesc: 'Labels on INSIDE face of web • Top of artwork feeds first',
  },
  6: {
    id: 6,
    title: 'FINAT #6',
    winding: 'Wound In',
    leadEdge: 'bottom',
    leadEdgeLabel: 'Bottom Edge Off First',
    copyAxis: 'across',
    rotationDeg: 180,
    diagramDesc: 'Labels on INSIDE face of web • Bottom of artwork feeds first',
  },
  7: {
    id: 7,
    title: 'FINAT #7',
    winding: 'Wound In',
    leadEdge: 'right',
    leadEdgeLabel: 'Right Edge Off First',
    copyAxis: 'with',
    rotationDeg: 90,
    diagramDesc: 'Labels on INSIDE face of web • Right side feeds first',
  },
  8: {
    id: 8,
    title: 'FINAT #8',
    winding: 'Wound In',
    leadEdge: 'left',
    leadEdgeLabel: 'Left Edge Off First',
    copyAxis: 'with',
    rotationDeg: 270,
    diagramDesc: 'Labels on INSIDE face of web • Left side feeds first',
  },
};

export const DEFAULT_FINAT: FinatDirection = 1;

/** Do not auto-apply. Current pages default to 1; changing this rewrites RFQ meaning. */
export const PLANT_DEFAULT_MACHINE_FINAT: FinatDirection = 4;

export function isFinatDirection(n: unknown): n is FinatDirection {
  return typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= 8;
}

export function getFinatSpec(n: number | null | undefined): FinatSpec {
  if (isFinatDirection(n)) return FINAT_STANDARDS[n];
  return FINAT_STANDARDS[DEFAULT_FINAT];
}

/**
 * Value for supabase.from('rfq_inquiries').insert rewind_direction.
 * Sheets / cartons / commercial_print store null. Rolls keep 1–8.
 */
export function rewindDirectionForRfq(
  rollOrSheet: 'roll' | 'sheet',
  finatDirection: number
): FinatDirection | null {
  if (rollOrSheet !== 'roll') return null;
  return isFinatDirection(finatDirection) ? finatDirection : DEFAULT_FINAT;
}

/**
 * HUD numbers only. Matches calculator.ts web gap (3 mm) and
 * labels-per-roll (2500). Replaces the 2000/roll hardcode in FinatReelViewer.
 */
export function finatWebTelemetry(opts: {
  widthMm: number;
  heightMm: number;
  quantity: number;
  gapMm?: number;
  labelsPerRoll?: number;
}) {
  const gapMm = opts.gapMm ?? 3;
  const labelsPerRoll = opts.labelsPerRoll ?? 2500;
  const unitAreaCm2 = Number(((opts.widthMm * opts.heightMm) / 100).toFixed(1));
  const linearMeters = Math.round((opts.quantity * (opts.heightMm + gapMm)) / 1000);
  const totalM2 = Number(
    ((opts.quantity * opts.widthMm * (opts.heightMm + gapMm)) / 1_000_000).toFixed(1)
  );
  const estRolls = Math.max(1, Math.ceil(opts.quantity / labelsPerRoll));
  return { unitAreaCm2, linearMeters, totalM2, estRolls, gapMm, labelsPerRoll };
}

/** Drop-in replacement for the inline table in ConfiguratorPage.tsx. */
export function finatStandardsForViewer(): Record<number, FinatViewerSpec> {
  const out: Record<number, FinatViewerSpec> = {};
  (Object.values(FINAT_STANDARDS) as FinatSpec[]).forEach((s) => {
    out[s.id] = {
      title: s.title,
      winding: s.winding,
      leadEdge: s.leadEdgeLabel,
      rotationDeg: s.rotationDeg,
      headDirection:
        s.leadEdge === 'top'
          ? 'right'
          : s.leadEdge === 'bottom'
            ? 'left'
            : s.leadEdge === 'right'
              ? 'down'
              : 'up',
      diagramDesc: s.diagramDesc,
    };
  });
  return out;
}
