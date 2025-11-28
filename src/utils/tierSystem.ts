/**
 * Tier System Utility
 * Centralized tier calculation logic for the point system
 *
 * Tier thresholds:
 * - Explorer: 0 - 500 points
 * - Curator: 500 - 2,000 points
 * - Ambassador: 2,000 - 5,000 points
 * - Founding Patron: 5,000+ points
 */

// Tier thresholds based on the system
export const TIER_THRESHOLDS = {
  explorer: { min: 0, max: 500 },
  curator: { min: 500, max: 2000 },
  ambassador: { min: 2000, max: 5000 },
  patron: { min: 5000, max: Infinity },
} as const;

export type TierKey = keyof typeof TIER_THRESHOLDS;

/**
 * Determine the current tier based on total points
 */
export function getCurrentTier(points: number): TierKey {
  if (points >= TIER_THRESHOLDS.patron.min) return "patron";
  if (points >= TIER_THRESHOLDS.ambassador.min) return "ambassador";
  if (points >= TIER_THRESHOLDS.curator.min) return "curator";
  return "explorer";
}

/**
 * Get the next tier in progression
 * Returns null if already at max tier
 */
export function getNextTier(currentTier: TierKey): TierKey | null {
  const tierOrder: TierKey[] = ["explorer", "curator", "ambassador", "patron"];
  const currentIndex = tierOrder.indexOf(currentTier);
  return currentIndex < tierOrder.length - 1
    ? tierOrder[currentIndex + 1]
    : null;
}

/**
 * Calculate progress within current tier and points needed for next tier
 */
export function calculateTierProgress(
  points: number,
  currentTier: TierKey,
  nextTier: TierKey | null
) {
  if (!nextTier) {
    // User is at max tier (Founding Patron)
    return {
      progress: 100,
      pointsNeeded: 0,
      currentTierMin: TIER_THRESHOLDS[currentTier].min,
      currentTierMax: TIER_THRESHOLDS[currentTier].max,
      nextTierMin: null,
    };
  }

  const currentTierMin = TIER_THRESHOLDS[currentTier].min;
  const currentTierMax = TIER_THRESHOLDS[currentTier].max;
  const nextTierMin = TIER_THRESHOLDS[nextTier].min;

  // Calculate progress within current tier range
  const tierRange = currentTierMax - currentTierMin;
  const pointsInTier = points - currentTierMin;
  const progress = Math.min(100, Math.max(0, (pointsInTier / tierRange) * 100));
  const pointsNeeded = Math.max(0, nextTierMin - points);

  return {
    progress,
    pointsNeeded,
    currentTierMin,
    currentTierMax,
    nextTierMin,
  };
}

/**
 * Get tier information for a given point value
 * Returns current tier, next tier, and progress data
 */
export function getTierInfo(points: number) {
  const currentTier = getCurrentTier(points);
  const nextTier = getNextTier(currentTier);
  const progress = calculateTierProgress(points, currentTier, nextTier);

  return {
    currentTier,
    nextTier,
    ...progress,
  };
}
