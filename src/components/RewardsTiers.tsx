import { motion } from "motion/react";
import {
  Check,
  ChevronRight,
  Loader2,
  Compass,
  Crown,
  Award,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import bgImage from "figma:asset/3fa9b9de7e4b1421a708a7c88cd0672cee3504e2.png";
import { useGetProgressionQuery } from "@/services/api/dashboardApi";

interface RewardsTiersProps {
  language: "en" | "ar";
  onNavigateToSignUp?: () => void;
}

const content = {
  en: {
    title: { white: "Your Progression System", gold: " Unlock Exclusive Benefits and Rewards" },
    subtitle: "The more you engage, the more you're rewarded. Our tiered system is designed to recognize and celebrate your participation.",
    viewRewards: "View Rewards",
    startJourney: "Start Your Journey",
    tiers: [
      {
        name: "Explorer",
        icon: Compass,
        points: "0-500",
        color: "from-gray-600 to-gray-500",
        glowColor: "shadow-gray-500/50",
        benefits: [
          "Platform access at launch",
          "Community membership",
          "Basic features",
        ],
      },
      {
        name: "Ambassador",
        points: "500-2K",
        icon: Crown,
        color: "from-[#ffcc33] to-[#ffb54d]",
        glowColor: "shadow-[#ffcc33]/50",
        benefits: [
          "Enhanced referral bonuses",
          "Priority support",
          "Ambassador badge",
        ],
      },
      {
        name: "Founding Patron",
        points: "2K+",
        icon: Award,
        color: "from-[#ffcc33] to-[#ffb54d]",
        glowColor: "shadow-[#ffcc33]/50",
        benefits: [
          "Lifetime benefits",
          "Executive access",
          "Special recognition",
        ],
      },
    ],
  },
  ar: {
    title: { white: "نظام التقدم الخاص بك", gold: " افتح الفوائد والمكافآت الحصرية" },
    subtitle: "كلما تفاعلت أكثر، كلما حصلت على مكافآت أكثر. نظامنا المتدرج مصمم للاعتراف بمساهمتك والاحتفال بها.",
    viewRewards: "عرض المكافآت",
    startJourney: "ابدأ رحلتك",
    tiers: [
      {
        name: "مستكشف",
        icon: Compass,
        points: "0-500",
        color: "from-gray-600 to-gray-500",
        glowColor: "shadow-gray-500/50",
        benefits: [
          "الوصول إلى المنصة عند إطلاقها",
          "عضوية في المجتمع",
          "الميزات الأساسية",
        ],
      },
      {
        name: "سفير",
        points: "500-2K",
        icon: Crown,
        color: "from-[#ffcc33] to-[#ffb54d]",
        glowColor: "shadow-[#ffcc33]/50",
        benefits: ["مكافآت إحالة محسنة", "دعم ذو أولوية", "شارة السفير"],
      },
      {
        name: "راعي مؤسس",
        points: "2K+",
        icon: Award,
        color: "from-[#ffcc33] to-[#ffb54d]",
        glowColor: "shadow-[#ffcc33]/50",
        benefits: ["فوائد مدى الحياة", "وصول تنفيذي", "اعتراف خاص"],
      },
    ],
  },
};

export function RewardsTiers({
  language,
  onNavigateToSignUp,
}: RewardsTiersProps) {
  const t = content[language];
  const isRTL = language === "ar";

  // Fetch progression data from API
  const {
    data: progressionData,
    isLoading,
    isError,
  } = useGetProgressionQuery();

  // Tier visual configuration mapping (for icons, colors, benefits)
  const tierConfigMap: Record<
    string,
    {
      icon: typeof Compass;
      color: string;
      glowColor: string;
      benefits: string[];
    }
  > = {
    Explorer: {
      icon: Compass,
      color: "from-gray-600 to-gray-500",
      glowColor: "shadow-gray-500/50",
      benefits:
        language === "en"
          ? [
              "Platform access at launch",
              "Community membership",
              "Basic features",
            ]
          : [
              "الوصول إلى المنصة عند إطلاقها",
              "عضوية في المجتمع",
              "الميزات الأساسية",
            ],
    },
    Curator: {
      icon: Crown,
      color: "from-sky-500 to-cyan-400",
      glowColor: "shadow-sky-400/50",
      benefits:
        language === "en"
          ? [
              "Enhanced curation tools",
              "Priority listing",
              "Curator badge",
            ]
          : [
              "أدوات تنسيق محسّنة",
              "قائمة الأولويات",
              "شارة المنسق",
            ],
    },
    Patron: {
      icon: Crown,
      color: "from-purple-500 to-violet-500",
      glowColor: "shadow-purple-500/50",
      benefits:
        language === "en"
          ? [
              "Exclusive previews",
              "VIP support",
              "Patron privileges",
            ]
          : [
              "معاينات حصرية",
              "دعم VIP",
              "امتيازات الراعي",
            ],
    },
    Ambassador: {
      icon: Crown,
      color: "from-orange-600 to-amber-600",
      glowColor: "shadow-orange-500/50",
      benefits:
        language === "en"
          ? [
              "Enhanced referral bonuses",
              "Priority support",
              "Ambassador badge",
            ]
          : ["مكافآت إحالة محسنة", "دعم ذو أولوية", "شارة السفير"],
    },
    "Founding Patron": {
      icon: Award,
      color: "from-amber-600 to-yellow-600",
      glowColor: "shadow-amber-500/50",
      benefits:
        language === "en"
          ? ["Lifetime benefits", "Executive access", "Special recognition"]
          : ["فوائد مدى الحياة", "وصول تنفيذي", "اعتراف خاص"],
    },
  };

  // Map API data to display tiers (only show what API returns)
  const apiTiers = progressionData?.data || [];
  // Order tiers from entry-level to highest, matching backend names:
  // Explorer -> Curator -> Patron -> Ambassador -> Founding Patron
  const orderedNames = [
    "Explorer",
    "Curator",
    "Patron",
    "Ambassador",
    "Founding Patron",
  ];

  // Sort API tiers by predefined order
  const sortedApiTiers =
    Array.isArray(apiTiers) && apiTiers.length
      ? [...apiTiers].sort(
          (a, b) =>
            orderedNames.indexOf(a?.name ?? "") -
            orderedNames.indexOf(b?.name ?? "")
        )
      : [];

  // Build tiers from API data only
  const tiers = sortedApiTiers
    .map((apiTier) => {
      const config = tierConfigMap[apiTier.name];
      if (!config) return null; // Skip if tier name not found in config

      // Parse points from API (e.g., "5K+ pts" -> "5K+", "2K-5K pts" -> "2K-5K")
      const points = apiTier.points
        ? apiTier.points.replace(/\s*pts$/i, "").trim()
        : "";

      return {
        name: apiTier.name,
        icon: config.icon,
        points: points,
        color: config.color,
        glowColor: config.glowColor,
        benefits: config.benefits,
      };
    })
    .filter((tier): tier is NonNullable<typeof tier> => tier !== null);

  return (
    <section
      className="relative py-32 overflow-hidden bg-[#0F021C]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Abstract Art Background Pattern */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={bgImage}
          alt="Abstract Art Pattern"
          className="w-full h-full object-cover opacity-70"
          style={{ transform: "scale(1.15)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F021C] via-[#0F021C]/95 to-[#0F021C]" />
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#ffcc33]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-[#45e3d3]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-[#ffcc33] animate-spin" />
            <p className="text-white/70 text-sm md:text-base">
              {language === "en"
                ? "Loading your progression tiers..."
                : "جاري تحميل نظام التقدم الخاص بك..."}
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div className="mb-6 text-center">
            <p className="text-xs md:text-sm text-red-400">
              {language === "en"
                ? "Unable to fetch progression data."
                : "تعذر جلب بيانات التقدم."}
            </p>
          </div>
        )}

        {/* Empty State - No tiers from API */}
        {!isLoading && !isError && tiers.length === 0 && (
          <div className="text-center py-24">
            <p className="text-white/60 text-lg">
              {language === "en"
                ? "No progression tiers available."
                : "لا توجد مراحل تقدم متاحة."}
            </p>
          </div>
        )}
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="mb-4 text-4xl md:text-5xl lg:text-6xl">
            <span className="text-white">{t.title.white}</span>
            <span className="text-[#ffcc33]">{t.title.gold}</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg md:text-xl">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Horizontal Timeline - Desktop */}
        {tiers.length > 0 && (
          <div className="hidden lg:block max-w-7xl mx-auto">
            {/* Progress Bar Container */}
            <div className="relative mb-32">
              {/* Background Track */}
              <div className="absolute top-20 left-0 right-0 h-1 bg-white/10" />

              {/* Animated Progress Line */}
              <motion.div
                className="absolute top-20 left-0 h-1 bg-gradient-to-r from-blue-400 via-orange-400 to-[#ffcc33]"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeOut" }}
              />

              {/* Tier Cards */}
              <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
                {tiers.map((tier, index) => {
                  const Icon = tier.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                      className="relative"
                    >
                      {/* Connector Dot */}
                      <motion.div
                        className={`absolute top-20 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br ${tier.color} border-4 border-[#0F021C] z-20`}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.5 + index * 0.15,
                          type: "spring",
                          stiffness: 200,
                        }}
                      />

                      {/* Card */}
                      <motion.div
                        whileHover={{ y: -8 }}
                        className="relative group"
                      >
                        {/* Glow Effect */}
                        <div
                          className={`absolute -inset-0.5 bg-gradient-to-br ${tier.color} rounded-2xl opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500`}
                        />

                        {/* Main Card */}
                        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                          {/* Top Gradient Bar */}
                          <div
                            className={`h-1.5 bg-gradient-to-r ${tier.color}`}
                          />

                          {/* Card Content */}
                          <div className="p-6">
                            {/* Icon */}
                            <div className="mb-4 flex justify-center">
                              <div
                                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center shadow-lg`}
                              >
                                <Icon className="w-8 h-8 text-white" />
                              </div>
                            </div>

                            {/* Tier Name */}
                            <h3 className="text-white text-center text-xl mb-2">
                              {tier.name}
                            </h3>

                            {/* Points */}
                            <div
                              className={`text-center mb-6 text-sm bg-gradient-to-r ${tier.color} bg-clip-text text-transparent font-semibold`}
                            >
                              {tier.points} pts
                            </div>

                            {/* Benefits */}
                            <ul className="space-y-2.5">
                              {tier.benefits.slice(0, 4).map((benefit, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-white/60 text-xs"
                                >
                                  <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#45e3d3]" />
                                  <span className="leading-tight">
                                    {benefit}
                                  </span>
                                </li>
                              ))}
                            </ul>

                            {/* View More */}
                            {tier.benefits.length > 4 && (
                              <button className="mt-4 w-full text-xs text-white/40 hover:text-white/60 transition-colors flex items-center justify-center gap-1">
                                +{tier.benefits.length - 4} more
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>

                      {/* Arrow Connector (except last) */}
                      {index < tiers.length - 1 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.8 + index * 0.15 }}
                          className="absolute top-20 -right-3 z-10"
                        >
                          <ChevronRight className="w-6 h-6 text-white/20" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Vertical Timeline - Mobile/Tablet */}
        {tiers.length > 0 && (
          <div className="lg:hidden max-w-2xl mx-auto">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10" />
              <motion.div
                className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-blue-400 via-orange-400 to-[#ffcc33]"
                initial={{ height: "0%" }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeOut" }}
              />

              {/* Tier Cards */}
              <div className="space-y-8">
                {tiers.map((tier, index) => {
                  const Icon = tier.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative flex gap-6"
                    >
                      {/* Connector Dot */}
                      <motion.div
                        className={`w-4 h-4 rounded-full bg-gradient-to-br ${tier.color} border-4 border-[#0F021C] shrink-0 mt-8 z-10`}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.3 + index * 0.1,
                          type: "spring",
                        }}
                      />

                      {/* Card */}
                      <div className="flex-1 pb-4">
                        {/* Glow Effect */}
                        <div
                          className={`absolute -inset-0.5 bg-gradient-to-br ${tier.color} rounded-2xl opacity-20 blur-lg`}
                        />

                        {/* Main Card */}
                        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                          {/* Top Gradient Bar */}
                          <div
                            className={`h-1 bg-gradient-to-r ${tier.color}`}
                          />

                          {/* Card Content */}
                          <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                              {/* Icon */}
                              <div
                                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center shadow-lg shrink-0`}
                              >
                                <Icon className="w-7 h-7 text-white" />
                              </div>

                              <div className="flex-1">
                                {/* Tier Name */}
                                <h3 className="text-white text-xl mb-1">
                                  {tier.name}
                                </h3>

                                {/* Points */}
                                <div
                                  className={`text-sm bg-gradient-to-r ${tier.color} bg-clip-text text-transparent font-semibold`}
                                >
                                  {tier.points} pts
                                </div>
                              </div>
                            </div>

                            {/* Benefits */}
                            <ul className="space-y-2">
                              {tier.benefits.map((benefit, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-white/60 text-sm"
                                >
                                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#45e3d3]" />
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNavigateToSignUp}
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#ffcc33] to-[#ffb54d] text-[#0F021C] shadow-xl shadow-[#ffcc33]/30 hover:shadow-2xl hover:shadow-[#ffcc33]/50 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>{t.startJourney}</span>
            <ChevronRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
