import { motion } from "motion/react";
import {
  Wallet,
  TrendingUp,
  Flame,
  Shield,
  Loader2,
  Users,
} from "lucide-react";
import { Progress } from "../../ui/progress";
import { Badge } from "../../ui/badge";
import { useLanguage } from "@/contexts/useLanguage";
import { useGetDashboardStatsQuery, useGetProgressionQuery } from "@/services/api/dashboardApi";
import {
  getCurrentTier,
  getNextTier,
  calculateTierProgress,
  tierNameToKey,
  buildTierThresholds,
  getTierOrder,
} from "@/utils/tierSystem";

const content = {
  en: {
    title: "Point Wallet",
    totalPoints: "Total Points",
    currentTier: "Current Tier",
    nextTier: "Next Tier",
    progress: "Progress to",
    influencePoints: "Influence Points",
    provenancePoints: "Provenance Points",
    followers: "Followers",
    recentActivity: "Recent Activity",
    pointsNeeded: "points needed",
    maxTierReached: "Maximum tier reached!",
    activities: [
      { action: "Profile Completed", points: "+50", type: "provenance" },
      { action: "Referral Joined", points: "+100", type: "influence" },
      { action: "First Login", points: "+25", type: "provenance" },
    ],
    // Tier names will be fetched from API
  },
  ar: {
    title: "محفظة النقاط",
    totalPoints: "إجمالي النقاط",
    currentTier: "المستوى الحالي",
    nextTier: "المستوى التالي",
    progress: "التقدم إلى",
    influencePoints: "نقاط التأثير",
    provenancePoints: "نقاط المصداقية",
    followers: "المتابعون",
    recentActivity: "النشاط الأخير",
    pointsNeeded: "نقطة مطلوبة",
    maxTierReached: "تم الوصول إلى أعلى مستوى!",
    activities: [
      { action: "إكمال الملف الشخصي", points: "+50", type: "provenance" },
      { action: "انضمام إحالة", points: "+100", type: "influence" },
      { action: "تسجيل الدخول الأول", points: "+25", type: "provenance" },
    ],
    // Tier names will be fetched from API
  },
};

export function PointWallet() {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";

  // Fetch dashboard stats and progression data from API
  const {
    data: statsData,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useGetDashboardStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: progressionData,
    isLoading: isLoadingProgression,
    isError: isErrorProgression,
  } = useGetProgressionQuery();

  const isLoading = isLoadingStats || isLoadingProgression;
  const isError = isErrorStats || isErrorProgression;

  // Use API data or fallback to default values
  const totalPoints = statsData?.data?.total_points || 0;
  const influencePoints = statsData?.data?.influence_points || 0;
  const provenancePoints = statsData?.data?.provenance_points || 0;
  const followerCount = statsData?.data?.user_followers || 0;

  // Get tier information using dynamic tier system
  const progressionTiers = progressionData?.data || [];
  
  // Get tier display names from API data
  const getTierNameFromKey = (tierKey: string): string => {
    const tier = progressionTiers.find(t => tierNameToKey(t.name) === tierKey);
    return tier?.name || tierKey;
  };

  // Calculate current tier based on total points with dynamic thresholds
  const tierThresholds = progressionTiers.length > 0
    ? buildTierThresholds(progressionTiers)
    : {};
  const tierOrder = progressionTiers.length > 0
    ? getTierOrder(progressionTiers)
    : [];
  
  const currentTierKey = progressionTiers.length > 0
    ? getCurrentTier(totalPoints, tierThresholds)
    : "explorer";
  const nextTierKey = progressionTiers.length > 0
    ? getNextTier(currentTierKey, tierOrder)
    : null;
  
  const tierProgress = progressionTiers.length > 0
    ? calculateTierProgress(totalPoints, currentTierKey, nextTierKey, tierThresholds)
    : { progress: 0, pointsNeeded: 0 };

  // Get tier display names
  const currentTier = getTierNameFromKey(currentTierKey);
  const nextTier = nextTierKey ? getTierNameFromKey(nextTierKey) : null;
  const progress = tierProgress.progress;
  const pointsNeeded = tierProgress.pointsNeeded;

  // Build activities from API data
  const activities = [
    {
      action: language === "en" ? "Profile Completed" : "إكمال الملف الشخصي",
      points: `+${statsData?.data?.profile_completed || 0}`,
      type: "provenance" as const,
    },
    {
      action: language === "en" ? "Referral Joined" : "انضمام إحالة",
      points: `+${statsData?.data?.referral_joined || 0}`,
      type: "influence" as const,
    },
    {
      action: language === "en" ? "First Login" : "تسجيل الدخول الأول",
      points: `+${statsData?.data?.first_login || 0}`,
      type: "provenance" as const,
    },
  ].filter((activity) => {
    // Only show activities with points > 0
    const points = parseInt(activity.points.replace("+", ""));
    return points > 0;
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-6 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
          <p className="text-[#cbd5e1]">
            {language === "en" ? "Loading points..." : "جاري تحميل النقاط..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error state (but still render with 0 points)
  if (isError && !statsData) {
    return (
      <div className="glass rounded-2xl p-6 h-full">
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-[#cbd5e1]">
            {language === "en"
              ? "Failed to load points. Please try again."
              : "فشل تحميل النقاط. يرجى المحاولة مرة أخرى."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 h-full">
      {/* Header */}
      <div
        className={`flex items-center justify-between mb-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className={`flex items-center gap-3 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#14b8a6] rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-[#0f172a]" />
          </div>
          <h2 className="text-2xl text-[#fef3c7]">{t.title}</h2>
        </div>
        <Badge className="bg-gradient-to-r from-[#d4af37] to-[#fbbf24] text-[#0f172a] border-0">
          {currentTier}
        </Badge>
      </div>

      {/* Total Points Display */}
      <motion.div
        className="relative overflow-hidden rounded-xl p-6 mb-6"
        style={{
          background: "linear-gradient(135deg, #d4af37 0%, #14b8a6 100%)",
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-xl" />
        </div>
        <div className={`relative z-10 ${isRTL ? "text-right" : "text-left"}`}>
          <p className="text-[#0f172a] opacity-80 mb-2">{t.totalPoints}</p>
          <p className="text-5xl text-[#0f172a]">
            {totalPoints.toLocaleString()}
          </p>
          {nextTier ? (
            <div
              className={`flex items-center gap-2 mt-3 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <TrendingUp className="w-4 h-4 text-[#0f172a]" />
              <span className="text-sm text-[#0f172a]">
                {pointsNeeded} {t.pointsNeeded}
              </span>
            </div>
          ) : (
            <div
              className={`flex items-center gap-2 mt-3 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <TrendingUp className="w-4 h-4 text-[#0f172a]" />
              <span className="text-sm text-[#0f172a]">{t.maxTierReached}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Progress to Next Tier */}
      {nextTier ? (
        <div className="mb-6">
          <div
            className={`flex items-center justify-between mb-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <span className="text-sm text-[#cbd5e1]">
              {t.progress} {nextTier}
            </span>
            <span className="text-sm text-[#d4af37]">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-[#334155]" />
        </div>
      ) : (
        <div className="mb-6">
          <div
            className={`flex items-center justify-between mb-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <span className="text-sm text-[#cbd5e1]">{t.maxTierReached}</span>
            <span className="text-sm text-[#d4af37]">100%</span>
          </div>
          <Progress value={100} className="h-2 bg-[#334155]" />
        </div>
      )}

      {/* Point Types */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-[#8b5cf6]/20 to-[#8b5cf6]/5 rounded-xl p-4 border border-[#8b5cf6]/30"
        >
          <div
            className={`flex items-center gap-2 mb-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Flame className="w-5 h-5 text-[#8b5cf6]" />
            <span className="text-xs text-[#cbd5e1]">{t.influencePoints}</span>
          </div>
          <p className="text-2xl text-[#fef3c7]">{influencePoints}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-[#0ea5e9]/20 to-[#0ea5e9]/5 rounded-xl p-4 border border-[#0ea5e9]/30"
        >
          <div
            className={`flex items-center gap-2 mb-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Shield className="w-5 h-5 text-[#0ea5e9]" />
            <span className="text-xs text-[#cbd5e1]">{t.provenancePoints}</span>
          </div>
          <p className="text-2xl text-[#fef3c7]">{provenancePoints}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-[#ec4899]/20 to-[#ec4899]/5 rounded-xl p-4 border border-[#ec4899]/30"
        >
          <div
            className={`flex items-center gap-2 mb-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Users className="w-5 h-5 text-[#ec4899]" />
            <span className="text-xs text-[#cbd5e1]">{t.followers}</span>
          </div>
          <p className="text-2xl text-[#fef3c7]">{followerCount}</p>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3
          className={`text-sm text-[#cbd5e1] mb-3 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t.recentActivity}
        </h3>
        <div className="space-y-2">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 bg-[#1e293b]/50 rounded-lg border border-[#334155] hover:border-[#d4af37]/30 transition-all ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex items-center gap-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === "influence"
                        ? "bg-[#8b5cf6]/20 text-[#8b5cf6]"
                        : "bg-[#0ea5e9]/20 text-[#0ea5e9]"
                    }`}
                  >
                    {activity.type === "influence" ? (
                      <Flame className="w-4 h-4" />
                    ) : (
                      <Shield className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-sm text-[#fef3c7]">
                    {activity.action}
                  </span>
                </div>
                <span className="text-sm text-[#14b8a6]">
                  {activity.points}
                </span>
              </motion.div>
            ))
          ) : (
            <p
              className={`text-sm text-[#cbd5e1] text-center py-4 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {language === "en" ? "No recent activity" : "لا يوجد نشاط حديث"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
