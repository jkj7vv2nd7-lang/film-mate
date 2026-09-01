// exposure.ts - Exposure calculation utilities for Film Mate

// Standard f-stop values
export const F_STOPS = [1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32];

// Shutter speed values with labels
export const SHUTTER_SPEEDS = [
  { value: 1 / 8000, label: '1/8000' },
  { value: 1 / 4000, label: '1/4000' },
  { value: 1 / 2000, label: '1/2000' },
  { value: 1 / 1000, label: '1/1000' },
  { value: 1 / 500, label: '1/500' },
  { value: 1 / 250, label: '1/250' },
  { value: 1 / 125, label: '1/125' },
  { value: 1 / 60, label: '1/60' },
  { value: 1 / 30, label: '1/30' },
  { value: 1 / 15, label: '1/15' },
  { value: 1 / 8, label: '1/8' },
  { value: 1 / 4, label: '1/4' },
  { value: 1 / 2, label: '1/2' },
  { value: 1, label: '1s' },
  { value: 2, label: '2s' },
  { value: 4, label: '4s' },
  { value: 8, label: '8s' },
  { value: 15, label: '15s' },
  { value: 30, label: '30s' },
];

// Standard ISO values
export const ISO_VALUES = [25, 50, 100, 200, 400, 800, 1600, 3200];

// Film presets with Japanese names
export const FILM_PRESETS = [
  { name: 'フジ C200', iso: 200 },
  { name: 'コダック Gold 200', iso: 200 },
  { name: 'コダック UltraMax 400', iso: 400 },
  { name: 'コダック Portra 160', iso: 160 },
  { name: 'コダック Portra 400', iso: 400 },
  { name: 'コダック Portra 800', iso: 800 },
  { name: 'コダック Ektar 100', iso: 100 },
  { name: 'コダック T-Max 400', iso: 400 },
  { name: 'フジ Superia 400', iso: 400 },
  { name: 'フジ Pro 400H', iso: 400 },
  { name: 'イリフォード HP5+', iso: 400 },
  { name: 'イリフォード XP2 Super', iso: 400 },
  { name: 'イリフォード Delta 3200', iso: 3200 },
  { name: 'コニカミノルタ VX400', iso: 400 },
  { name: 'フジ Neopan 400', iso: 400 },
];

// Scene presets with Japanese names and emoji icons
export const SCENE_PRESETS = [
  { name: '晴れ（太陽）', ev: 15, icon: '☀' },
  { name: '晴れ（影）', ev: 12, icon: '🌤' },
  { name: '曇り', ev: 10, icon: '☁' },
  { name: '雨', ev: 8, icon: '🌧' },
  { name: '室内（明るい）', ev: 7, icon: '💡' },
  { name: '室内（普通）', ev: 5, icon: '🏠' },
  { name: '夕焼け', ev: 10, icon: '🌅' },
  { name: '夜景（街灯）', ev: 5, icon: '🌃' },
  { name: '夜景', ev: 3, icon: '🌃' },
  { name: '星空', ev: -4, icon: '🌌' },
  { name: '月明かり', ev: -2, icon: '🌙' },
];

/**
 * Calculate Exposure Value (EV)
 * EV = log2(N²/t) - log2(iso/100)
 * Rounded to 1 decimal place
 */
export function calculateEV(
  aperture: number,
  shutterSpeed: number,
  iso: number
): number {
  const ev = Math.log2((aperture * aperture) / shutterSpeed) - Math.log2(iso / 100);
  return Math.round(ev * 10) / 10;
}

/**
 * Calculate exposure pairs for all f-stops given a target EV and ISO
 * For each f-stop, find the nearest standard shutter speed and calculate EV difference
 */
export function calculateExposurePairs(
  targetEV: number,
  iso: number
): Array<{
  fStop: number;
  shutterSpeed: number;
  shutterLabel: string;
  evDiff: number;
}> {
  return F_STOPS.map((fStop) => {
    // Ideal shutter speed for this f-stop at target EV and ISO
    // EV = log2(N²/t) - log2(iso/100)
    // EV + log2(iso/100) = log2(N²/t)
    // 2^(EV + log2(iso/100)) = N²/t
    // t = N² / 2^(EV + log2(iso/100))
    const idealShutter = (fStop * fStop) / Math.pow(2, targetEV + Math.log2(iso / 100));

    // Find nearest standard shutter speed
    let nearestIndex = 0;
    let minDiff = Infinity;
    for (let i = 0; i < SHUTTER_SPEEDS.length; i++) {
      const ratio = SHUTTER_SPEEDS[i].value / idealShutter;
      const diff = Math.abs(Math.log2(ratio));
      if (diff < minDiff) {
        minDiff = diff;
        nearestIndex = i;
      }
    }

    const shutter = SHUTTER_SPEEDS[nearestIndex];
    const actualEV = calculateEV(fStop, shutter.value, iso);
    const evDiff = Math.round((actualEV - targetEV) * 10) / 10;

    return {
      fStop,
      shutterSpeed: shutter.value,
      shutterLabel: shutter.label,
      evDiff,
    };
  });
}

/**
 * Calculate Depth of Field
 * Standard DOF formula with default circle of confusion = 0.03mm
 * Returns distances in meters
 */
export function calculateDepthOfField(
  focalLength: number, // mm
  aperture: number, // f-number
  distance: number, // meters
  coc: number = 0.03 // mm, circle of confusion
): { near: number; far: number; dof: number; hyperfocal: number } {
  // Convert distance to mm for calculation
  const d = distance * 1000;
  const f = focalLength;
  const N = aperture;
  const c = coc;

  // Hyperfocal distance in mm
  const H = (f * f) / (N * c) + f;
  const hyperfocal = H / 1000; // convert back to meters

  // Near distance of acceptable sharpness in mm
  const Dn = (d * (H - f)) / (H + d - 2 * f);
  // Far distance of acceptable sharpness in mm
  const Df = (d * (H - f)) / (H - d);

  // Convert back to meters
  const near = Math.max(0, Dn / 1000);
  // If Df is negative or very large, subject is beyond hyperfocal
  const far = Df > 0 ? Df / 1000 : Infinity;
  const dof = far === Infinity ? Infinity : Math.max(0, far - near);

  return {
    near: Math.round(near * 1000) / 1000,
    far: far === Infinity ? Infinity : Math.round(far * 1000) / 1000,
    dof: dof === Infinity ? Infinity : Math.round(dof * 1000) / 1000,
    hyperfocal: Math.round(hyperfocal * 1000) / 1000,
  };
}

/**
 * Map a luminance sensor value (0-255) to an EV range (-6 to 16)
 * Linear mapping from sensor range to EV range
 */
export function luminanceToEV(sensorValue: number): number {
  const clamped = Math.max(0, Math.min(255, sensorValue));
  const evMin = -6;
  const evMax = 16;
  // Linear interpolation
  const ev = evMin + (clamped / 255) * (evMax - evMin);
  return Math.round(ev * 10) / 10;
}

// Standard fraction denominators for shutter speed display
const STANDARD_FRACTIONS = [8000, 4000, 2000, 1000, 500, 250, 125, 60, 30, 15, 8, 4, 2];

/**
 * Format a shutter speed value as a human-readable label.
 * For fractions, uses 35% tolerance to match standard values.
 */
export function formatShutterLabel(seconds: number): string {
  if (seconds >= 1) {
    return seconds === 1 ? '1s' : `${seconds}s`;
  }

  // For fractional seconds, try to match a standard denominator
  for (const denom of STANDARD_FRACTIONS) {
    const ideal = 1 / denom;
    const tolerance = ideal * 0.35;
    if (Math.abs(seconds - ideal) <= tolerance) {
      return `1/${denom}`;
    }
  }

  // Fallback: display as a decimal
  return `${Math.round(seconds * 1000) / 1000}s`;
}
