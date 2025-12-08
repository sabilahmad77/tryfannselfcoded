import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useLanguage } from "@/contexts/useLanguage";
import {
  useGetDashboardStatsQuery,
  useGetDashboardStatsAmbassadorQuery,
  useGetProgressionQuery,
} from "@/services/api/dashboardApi";
import { getTierInfo, tierNameToKey, parsePointsRange } from "@/utils/tierSystem";
import { Award, Compass, Crown, Loader2, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { RootState } from "@/store/store";

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
    Ambassador: {
      icon: Crown,
      color: "from-orange-600 to-amber-600",
      multiplier: "3x",
    },
    "Founding Patron": {
      icon: Award,
      color: "from-amber-600 to-yellow-600",
      multiplier: "5x",
    },
  };

  return (
    configMap[tierName] || {
      icon: Star,
      color: "from-blue-400 to-cyan-500",
      multiplier: "1x",
    }
  );
};

export function TierProgress() {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";

  // Get user role from Redux store
  const storedUser = useSelector((state: RootState) => state.auth.user);
  const persona = useSelector((state: RootState) => state.auth.persona);
  const userRole = storedUser?.role?.toLowerCase() || persona?.toLowerCase() || "";
  const isAmbassador = userRole === "ambassador";

  // Fetch dashboard stats based on user role
  // For ambassador: use dashboard_stats_ambassador
  // For others: use dashboard_stats
  const {
    data: statsData,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useGetDashboardStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: isAmbassador, // Skip for ambassador role
  });

  const {
    data: ambassadorStatsData,
    isLoading: isLoadingAmbassadorStats,
    isError: isErrorAmbassadorStats,
  } = useGetDashboardStatsAmbassadorQuery(undefined, {
    skip: !isAmbassador, // Only fetch for ambassador role
  });

  const {
    data: progressionData,
    isLoading: isLoadingProgression,
    isError: isErrorProgression,
  } = useGetProgressionQuery();

  const isLoading = isAmbassador
    ? isLoadingAmbassadorStats || isLoadingProgression
    : isLoadingStats || isLoadingProgression;
  const isError = isAmbassador
    ? isErrorAmbassadorStats || isErrorProgression
    : isErrorStats || isErrorProgression;

  // Get user points from appropriate API based on role
  const userPoints = isAmbassador
    ? ambassadorStatsData?.data?.total_points || 0
    : statsData?.data?.total_points || 0;

  // Get tier information using dynamic tier system
  const progressionTiers = progressionData?.data || [];
  const tierInfo =
    progressionTiers.length > 0
      ? getTierInfo(userPoints, progressionTiers)
      : null;

  // Get tier names from API data
  const getTierNameFromKey = (tierKey: string): string => {
    const tier = progressionTiers.find(
      (t) => tierNameToKey(t.name) === tierKey
    );
    return tier?.name || tierKey;
  };

  const currentTierKey = tierInfo?.currentTier || "explorer";
  const nextTierKey = tierInfo?.nextTier ?? null;
  const progress = tierInfo?.progress ?? 0;
  const pointsNeeded = tierInfo?.pointsNeeded ?? 0;

  const currentTierName =
    progressionTiers.length > 0
      ? getTierNameFromKey(currentTierKey)
      : "Explorer";
  const nextTierName =
    progressionTiers.length > 0 && nextTierKey
      ? getTierNameFromKey(nextTierKey)
      : null;

  const currentTierConfig = getTierConfig(currentTierName);
  const nextTierConfig = nextTierName ? getTierConfig(nextTierName) : null;

  const CurrentTierIcon = currentTierConfig.icon;
  const NextTierIcon = nextTierConfig?.icon || Crown;

  // Get all tiers from API data
  const allTierKeys = tierInfo?.tierOrder || [];
  const currentTierIndex = allTierKeys.indexOf(currentTierKey);

  // Sort tiers by minimum points (lowest to highest) for display
  const sortedTiers = useMemo(() => {
    return [...progressionTiers].sort((a, b) => {
      const aRange = parsePointsRange(a.points);
      const bRange = parsePointsRange(b.points);
      return aRange.min - bRange.min;
    });
  }, [progressionTiers]);

  // Show loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-[#d4af37]/20"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
          <p className="text-[#cbd5e1]">
            {language === "en"
              ? "Loading tier progress..."
              : "جاري تحميل تقدم المستوى..."}
          </p>
        </div>
      </motion.div>
    );
  }

  // Show error state (but still render with 0 points)
  const hasData = isAmbassador ? ambassadorStatsData : statsData;
  if (isError && !hasData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-[#d4af37]/20"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-[#cbd5e1]">
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
      className="glass rounded-2xl p-6 border border-[#d4af37]/20"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between mb-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <h2 className="text-2xl text-[#fef3c7]">{t.tierProgress}</h2>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${currentTierConfig.color}`}
        >
          <Zap className="w-4 h-4 text-[#0f172a]" />
          <span className="text-[#0f172a]">{currentTierConfig.multiplier}</span>
        </div>
      </div>

      {/* Current & Next Tier */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Current */}
        <div
          className={`bg-gradient-to-br ${currentTierConfig.color} bg-opacity-20 border border-[#d4af37]/40 rounded-xl p-4`}
        >
          <div
            className={`flex items-center gap-2 mb-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <CurrentTierIcon className="w-5 h-5 text-[#d4af37]" />
            <span className="text-xs text-[#cbd5e1]">{t.currentTier}</span>
          </div>
          <p className="text-xl text-[#fef3c7]">{currentTierName}</p>
          <p className="text-sm text-[#cbd5e1] mt-1">{userPoints} pts</p>
        </div>

        {/* Next */}
        <div className="bg-[#1e293b]/50 border border-[#334155] rounded-xl p-4">
          <div
            className={`flex items-center gap-2 mb-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <NextTierIcon className="w-5 h-5 text-[#14b8a6]" />
            <span className="text-xs text-[#cbd5e1]">
              {nextTierName ? t.nextTier : t.currentTier}
            </span>
          </div>
          <p className="text-xl text-[#fef3c7]">
            {nextTierName || currentTierName}
          </p>
          <p className="text-sm text-[#cbd5e1] mt-1">
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
        <div className="relative h-3 bg-[#1e293b] rounded-full overflow-hidden border border-[#334155]">
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
          className={`flex items-center justify-between mt-2 text-xs text-[#cbd5e1]/60 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <span>{tierInfo?.currentTierMin || 0}</span>
          <span className="text-[#d4af37]">{Math.round(progress)}%</span>
          <span>
            {tierInfo?.nextTierMin || tierInfo?.currentTierMax || "∞"}
          </span>
        </div>
      </div>

      {/* Tier Milestones */}
      {sortedTiers.length > 0 && (
        <div className="flex items-center justify-between gap-2">
          {sortedTiers.map((tier, index) => {
            const tierKey = tierNameToKey(tier.name);
            const tierConfig = getTierConfig(tier.name);
            const TierIcon = tierConfig.icon;
            // Calculate if unlocked based on sorted order
            const isUnlocked = index <= currentTierIndex;
            const isCurrent = tierKey === currentTierKey;

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
                      ? "bg-[#1e293b] border border-[#d4af37]/30"
                      : "bg-[#1e293b]/30 border border-[#334155]"
                  }`}
                >
                  <TierIcon
                    className={`w-5 h-5 ${
                      isCurrent
                        ? "text-[#0f172a]"
                        : isUnlocked
                        ? "text-[#d4af37]"
                        : "text-[#475569]"
                    }`}
                  />
                </motion.div>
                <span
                  className={`text-xs text-center ${
                    isUnlocked ? "text-[#cbd5e1]" : "text-[#475569]"
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
