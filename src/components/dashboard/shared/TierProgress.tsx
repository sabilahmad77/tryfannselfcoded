import { useMemo } from "react";
import { useLanguage } from "@/contexts/useLanguage";
import {
  useGetProgressionQuery,
} from "@/services/api/dashboardApi";
import { Award, Compass, Crown, Loader2, Star, Zap } from "lucide-react";
import { motion } from "motion/react";

interface TierProgressProps {
  statsData?: {
    total_points?: number;
    tier_name?: string;
    tier_min_points?: number;
    tier_max_points?: number;
    tier_progress_percentage?: number;
    next_tier_name?: string;
    next_tier_need_points?: number;
    [key: string]: unknown;
  };
  isLoadingStats?: boolean;
}

const content = {
  en: {
    tierProgress: "Tier Progress",
    currentTier: "Current",
    nextTier: "Next",
    pointsToGo: "to go",
    // Tier names will be fetched from API
  },
  ar: {
    tierProgress: "تقدم المستوى",
    currentTier: "الحالي",
    nextTier: "التالي",
    pointsToGo: "متبقية",
    // Tier names will be fetched from API
  },
};

// Dynamic tier configuration - will be built from API data
const getTierConfig = (tierName: string) => {
  const configMap: Record<
    string,
    {
      icon: typeof Compass;
      color: string;
      multiplier: string;
    }
  > = {
    Explorer: {
      icon: Compass,
      color: "from-gray-600 to-gray-500",
      multiplier: "1x",
    },
    Curator: {
      icon: Star,
      color: "from-[#45e3d3] to-[#4de3ed]",
      multiplier: "1x",
    },
    Patron: {
      icon: Star,
      color: "from-[#45e3d3] to-[#4de3ed]",
      multiplier: "1x",
    },
    Ambassador: {
      icon: Crown,
      color: "from-[#C59B48] to-[#D6AE5A]",
      multiplier: "3x",
    },
    "Founding Patron": {
      icon: Award,
      color: "from-[#C59B48] to-[#D6AE5A]",
      multiplier: "5x",
    },
  };

  return (
    configMap[tierName] || {
      icon: Star,
      color: "from-[#45e3d3] to-[#4de3ed]",
      multiplier: "1x",
    }
  );
};

export function TierProgress({ statsData, isLoadingStats = false }: TierProgressProps) {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";

  const {
    data: progressionData,
    isLoading: isLoadingProgression,
    isError: isErrorProgression,
  } = useGetProgressionQuery();

  const isLoading = isLoadingStats || isLoadingProgression;
  const isError = isErrorProgression;

  // Get tier information directly from dashboard stats API
  const userPoints = statsData?.total_points || 0;
  const currentTierName = statsData?.tier_name || "Explorer";
  const nextTierName = statsData?.next_tier_name || null;
  const progress = statsData?.tier_progress_percentage || 0;
  const pointsNeeded = statsData?.next_tier_need_points || 0;
  const tierMinPoints = statsData?.tier_min_points || 0;
  const tierMaxPoints = statsData?.tier_max_points || null;

  const currentTierConfig = getTierConfig(currentTierName);
  const nextTierConfig = nextTierName ? getTierConfig(nextTierName) : null;

  const CurrentTierIcon = currentTierConfig.icon;
  const NextTierIcon = nextTierConfig?.icon || Crown;

  // Get all tiers from progression API for milestones display
  const progressionTiers = useMemo(
    () => progressionData?.data || [],
    [progressionData?.data]
  );

  // Sort tiers by minimum points (lowest to highest) for display
  const sortedTiers = useMemo(() => {
    if (progressionTiers.length === 0) return [];
    
    // Parse points range from string format (e.g., "3501-7501")
    const parsePoints = (pointsStr: string) => {
      const match = pointsStr.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };

    return [...progressionTiers].sort((a, b) => {
      const aMin = parsePoints(a.points);
      const bMin = parsePoints(b.points);
      return aMin - bMin;
    });
  }, [progressionTiers]);

  // Find current tier index in sorted tiers for milestones display
  const currentTierIndex = useMemo(() => {
    return sortedTiers.findIndex((tier) => tier.name === currentTierName);
  }, [sortedTiers, currentTierName]);

  // Show loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-[#C59B48]/20"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="w-8 h-8 text-[#C59B48] animate-spin" />
          <p className="text-[#8A8EA0]">
            {language === "en"
              ? "Loading tier progress..."
              : "جاري تحميل تقدم المستوى..."}
          </p>
        </div>
      </motion.div>
    );
  }

  // Show error state (but still render with 0 points)
  if (isError && !statsData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-[#C59B48]/20"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-[#8A8EA0]">
            {language === "en"
              ? "Failed to load tier progress. Please try again."
              : "فشل تحميل تقدم المستوى. يرجى المحاولة مرة أخرى."}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border border-[#C59B48]/20"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between mb-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <h2 className="text-2xl text-[#F2F2F3]">{t.tierProgress}</h2>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${currentTierConfig.color}`}
        >
          <Zap className="w-4 h-4 text-[#0B0B0D]" />
          <span className="text-[#0B0B0D]">{currentTierConfig.multiplier}</span>
        </div>
      </div>

      {/* Current & Next Tier */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Current */}
        <div
          className={`bg-gradient-to-br ${currentTierConfig.color} bg-opacity-20 border border-[#C59B48]/40 rounded-xl p-4 relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[#0B0B0D]/60"></div>
          <div className="relative z-10">
            <div
              className={`flex items-center gap-2 mb-2 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <CurrentTierIcon className="w-5 h-5 text-[#C59B48]" />
              <span className="text-xs text-[#F2F2F3]/80">{t.currentTier}</span>
            </div>
            <p className="text-xl text-[#F2F2F3]">{currentTierName}</p>
            <p className="text-sm text-[#F2F2F3]/70 mt-1">{userPoints} pts</p>
          </div>
        </div>

        {/* Next */}
        <div className="bg-[#0B0B0D] border border-[#C59B48]/20 rounded-xl p-4">
          <div
            className={`flex items-center gap-2 mb-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <NextTierIcon className="w-5 h-5 text-[#C59B48]" />
            <span className="text-xs text-[#8A8EA0]">
              {nextTierName ? t.nextTier : t.currentTier}
            </span>
          </div>
          <p className="text-xl text-[#F2F2F3]">
            {nextTierName || currentTierName}
          </p>
          <p className="text-sm text-[#8A8EA0] mt-1">
            {nextTierName
              ? `${pointsNeeded} pts ${t.pointsToGo}`
              : language === "en"
              ? "Maximum tier reached!"
              : "تم الوصول إلى أعلى مستوى!"}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="relative h-3 bg-[#0B0B0D] rounded-full overflow-hidden border border-[#4e4e4e78]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${
              nextTierConfig?.color || currentTierConfig.color
            } rounded-full`}
          />
        </div>
        <div
          className={`flex items-center justify-between mt-2 text-xs text-[#8A8EA0]/60 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <span>{tierMinPoints}</span>
          <span className="text-[#C59B48]">{Math.round(progress)}%</span>
          <span>
            {tierMaxPoints || (nextTierName ? "∞" : "∞")}
          </span>
        </div>
      </div>

      {/* Tier Milestones */}
      {sortedTiers.length > 0 && (
        <div className="flex items-center justify-between gap-2">
          {sortedTiers.map((tier, index) => {
            const tierConfig = getTierConfig(tier.name);
            const TierIcon = tierConfig.icon;
            // Calculate if unlocked based on sorted order
            const isUnlocked = currentTierIndex >= 0 && index <= currentTierIndex;
            const isCurrent = tier.name === currentTierName;

            return (
              <div
                key={tier.id || index}
                className="flex flex-col items-center gap-2 flex-1"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    isCurrent
                      ? `bg-gradient-to-br ${tierConfig.color} glow-gold`
                      : isUnlocked
                      ? "bg-[#0B0B0D] border border-[#C59B48]/30"
                      : "bg-[#0B0B0D] border border-[#4e4e4e78]"
                  }`}
                >
                  <TierIcon
                    className={`w-5 h-5 ${
                      isCurrent
                        ? "text-[#0B0B0D]"
                        : isUnlocked
                        ? "text-[#C59B48]"
                        : "text-[#8A8EA0]"
                    }`}
                  />
                </motion.div>
                <span
                  className={`text-xs text-center ${
                    isUnlocked ? "text-[#8A8EA0]" : "text-[#8A8EA0]"
                  }`}
                >
                  {tier.name}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
