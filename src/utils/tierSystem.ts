/**
 * Tier System Utility
 * Dynamic tier calculation logic based on API progression data
 */

import type { ProgressionTier } from "@/services/api/dashboardApi";

// Parse points string from API (e.g., "5K+ pts", "2K-5K pts", "0-500 pts")
export function parsePointsRange(pointsStr: string): { min: number; max: number } {
  const cleaned = pointsStr.replace(/\s*pts$/i, "").trim();
  
  // Handle ranges like "2K-5K" or "0-500"
  if (cleaned.includes("-")) {
    const [minStr, maxStr] = cleaned.split("-").map(s => s.trim());
    return {
      min: parsePointValue(minStr),
      max: parsePointValue(maxStr),
    };
  }
  
  // Handle single values with + like "5K+"
  if (cleaned.endsWith("+")) {
    const minStr = cleaned.slice(0, -1).trim();
    return {
      min: parsePointValue(minStr),
      max: Infinity,
    };
  }
  
  // Fallback: treat as single value
  const value = parsePointValue(cleaned);
  return { min: value, max: value };
}

// Parse point value (e.g., "5K" -> 5000, "2K" -> 2000, "500" -> 500)
function parsePointValue(value: string): number {
  const cleaned = value.trim().toUpperCase();
  if (cleaned.endsWith("K")) {
    const num = parseFloat(cleaned.slice(0, -1));
    return Math.round(num * 1000);
  }
  return parseInt(cleaned, 10) || 0;
}

// Map tier name to tier key
export function tierNameToKey(tierName: string): string {
  const nameMap: Record<string, string> = {
    "Explorer": "explorer",
    "Curator": "curator",
    "Ambassador": "ambassador",
    "Founding Patron": "patron",
  };
  return nameMap[tierName] || tierName.toLowerCase().replace(/\s+/g, "_");
}

// Build tier thresholds from API progression data
export function buildTierThresholds(progressionTiers: ProgressionTier[]): Record<string, { min: number; max: number }> {
  const thresholds: Record<string, { min: number; max: number }> = {};
  
  // Sort tiers by points (ascending)
  const sortedTiers = [...progressionTiers].sort((a, b) => {
    const aRange = parsePointsRange(a.points);
    const bRange = parsePointsRange(b.points);
    return aRange.min - bRange.min;
  });
  
  sortedTiers.forEach((tier, index) => {
    const range = parsePointsRange(tier.points);
    const tierKey = tierNameToKey(tier.name);
    
    // Set max based on next tier's min, or Infinity for last tier
    if (index < sortedTiers.length - 1) {
      const nextRange = parsePointsRange(sortedTiers[index + 1].points);
      thresholds[tierKey] = {
        min: range.min,
        max: nextRange.min - 1,
      };
    } else {
      thresholds[tierKey] = {
        min: range.min,
        max: Infinity,
      };
    }
  });
  
  return thresholds;
}

// Get tier order from API data
export function getTierOrder(progressionTiers: ProgressionTier[]): string[] {
  const sortedTiers = [...progressionTiers].sort((a, b) => {
    const aRange = parsePointsRange(a.points);
    const bRange = parsePointsRange(b.points);
    return aRange.min - bRange.min;
  });
  
  return sortedTiers.map(tier => tierNameToKey(tier.name));
}

export type TierKey = string;

/**
 * Determine the current tier based on total points and dynamic thresholds
 */
export function getCurrentTier(
  points: number,
  tierThresholds: Record<string, { min: number; max: number }>
): TierKey {
  // Sort tiers by min points (descending) to check highest tier first
  const sortedTiers = Object.entries(tierThresholds).sort(
    (a, b) => b[1].min - a[1].min
  );
  
  for (const [tierKey, threshold] of sortedTiers) {
    if (points >= threshold.min) {
      return tierKey;
    }
  }
  
  // Fallback to first tier if no match
  return sortedTiers[sortedTiers.length - 1]?.[0] || "explorer";
}

/**
 * Get the next tier in progression
 * Returns null if already at max tier
 */
export function getNextTier(
  currentTier: TierKey,
  tierOrder: string[]
): TierKey | null {
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
  nextTier: TierKey | null,
  tierThresholds: Record<string, { min: number; max: number }>
) {
  const currentThreshold = tierThresholds[currentTier];
  if (!currentThreshold) {
    return {
      progress: 0,
      pointsNeeded: 0,
      currentTierMin: 0,
      currentTierMax: Infinity,
      nextTierMin: null,
    };
  }

  if (!nextTier) {
    // User is at max tier
    return {
      progress: 100,
      pointsNeeded: 0,
      currentTierMin: currentThreshold.min,
      currentTierMax: currentThreshold.max,
      nextTierMin: null,
    };
  }

  const nextThreshold = tierThresholds[nextTier];
  if (!nextThreshold) {
    return {
      progress: 100,
      pointsNeeded: 0,
      currentTierMin: currentThreshold.min,
      currentTierMax: currentThreshold.max,
      nextTierMin: null,
    };
  }

  const currentTierMin = currentThreshold.min;
  const currentTierMax = currentThreshold.max === Infinity 
    ? currentTierMin + 1000 // Fallback range for Infinity
    : currentThreshold.max;
  const nextTierMin = nextThreshold.min;

  // Calculate progress within current tier range
  const tierRange = currentTierMax - currentTierMin;
  const pointsInTier = points - currentTierMin;
  const progress = tierRange > 0
    ? Math.min(100, Math.max(0, (pointsInTier / tierRange) * 100))
    : 100;
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
 * Get tier information for a given point value using dynamic tier data
 * Returns current tier, next tier, and progress data
 */
export function getTierInfo(
  points: number,
  progressionTiers: ProgressionTier[]
) {
  const tierThresholds = buildTierThresholds(progressionTiers);
  const tierOrder = getTierOrder(progressionTiers);
  const currentTier = getCurrentTier(points, tierThresholds);
  const nextTier = getNextTier(currentTier, tierOrder);
  const progress = calculateTierProgress(points, currentTier, nextTier, tierThresholds);

  return {
    currentTier,
    nextTier,
    tierThresholds,
    tierOrder,
    ...progress,
  };
}
