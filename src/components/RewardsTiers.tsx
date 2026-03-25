import { motion } from "motion/react";
import {
  Check,
  ChevronRight,
  Loader2,
  Compass,
  Crown,
  Award,
} from "lucide-react";
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
        color: "from-[#C59B48] to-[#D6AE5A]",
        glowColor: "shadow-[#C59B48]/50",
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
        color: "from-[#C59B48] to-[#D6AE5A]",
        glowColor: "shadow-[#C59B48]/50",
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
        color: "from-[#C59B48] to-[#D6AE5A]",
        glowColor: "shadow-[#C59B48]/50",
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
        color: "from-[#C59B48] to-[#D6AE5A]",
        glowColor: "shadow-[#C59B48]/50",
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
        color: "from-[#C59B48] to-[#D6AE5A]",
        glowColor: "shadow-[#C59B48]/50",
        benefits: ["مكافآت إحالة محسنة", "دعم ذو أولوية", "شارة السفير"],
      },
      {
        name: "راعي مؤسس",
        points: "2K+",
        icon: Award,
        color: "from-[#C59B48] to-[#D6AE5A]",
        glowColor: "shadow-[#C59B48]/50",
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
      iconColor?: string;
      iconBg?: string;
      iconAccent?: string;
    }
  > = {
    Explorer: {
      icon: Compass,
      color: "from-[#C59B48] to-[#D6AE5A]",
      glowColor: "shadow-[#C59B48]/50",
      iconColor: "text-[#C59B48]",
      iconBg: "border-[#C59B48]/60",
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
      color: "from-[#C59B48] to-[#D6AE5A]",
      glowColor: "shadow-[#C59B48]/50",
      iconColor: "text-[#C59B48]",
      iconBg: "border-[#C59B48]/40",
      iconAccent: "text-[#45e3d3]",
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
      color: "from-[#C59B48] to-[#D6AE5A]",
      glowColor: "shadow-[#C59B48]/50",
      iconColor: "text-[#C59B48]",
      iconBg: "border-[#C59B48]/40",
      iconAccent: "text-[#9375b5]",
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
      color: "from-[#C59B48] to-[#D6AE5A]",
      glowColor: "shadow-[#C59B48]/50",
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
      color: "from-[#C59B48] to-[#D6AE5A]",
      glowColor: "shadow-[#C59B48]/50",
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

      // Parse points from API and standardize to en-dash format
      // Convert "0-500", "501-1500" to "0–500", "501–1500" (en-dash)
      let points = apiTier.points
        ? apiTier.points.replace(/\s*pts$/i, "").trim()
        : "";
      
      // Replace hyphens with en-dash for consistency
      points = points.replace(/-/g, "–");

      return {
        name: apiTier.name,
        icon: config.icon,
        points: points,
        color: config.color,
        glowColor: config.glowColor,
        iconColor: config.iconColor || "text-[#C59B48]",
        iconBg: config.iconBg || "border-[#C59B48]/40",
        iconAccent: config.iconAccent,
        benefits: config.benefits,
      };
    })
    .filter((tier): tier is NonNullable<typeof tier> => tier !== null);

  return (
    <section
      className="relative py-12 overflow-hidden w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Subtle background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#C59B48]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-[#45e3d3]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-[#C59B48] animate-spin" />
            <p className="text-white/70 text-sm md:text-base font-body">
              {language === "en"
                ? "Loading your progression tiers..."
                : "جاري تحميل نظام التقدم الخاص بك..."}
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div className="mb-6 text-center">
            <p className="text-xs md:text-sm text-red-400 font-body">
              {language === "en"
                ? "Unable to fetch progression data."
                : "تعذر جلب بيانات التقدم."}
            </p>
          </div>
        )}

        {/* Empty State - No tiers from API */}
        {!isLoading && !isError && tiers.length === 0 && (
          <div className="text-center py-24">
            <p className="text-[#B9BBC6] text-lg font-body">
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
          className="text-center mb-8"
        >
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-semibold px-2 sm:px-0">
            <span className="text-[#F2F2F3] font-heading font-semibold">{t.title.white}</span>
            <span className="text-[#C59B48] font-heading font-semibold">{t.title.gold}</span>
          </h2>
          <p className="text-[#B9BBC6] max-w-4xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl font-body font-normal px-4 sm:px-0">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Horizontal Timeline - Desktop */}
        {tiers.length > 0 && (
          <div className="hidden lg:block max-w-7xl mx-auto w-full overflow-x-hidden">
            {/* Progress Bar Container */}
            <div className="relative mb-8">
              {/* Background Track */}
              <div className="absolute top-20 left-0 right-0 h-1 bg-white/10" />

              {/* Animated Progress Line */}
              <motion.div
                className="absolute top-20 left-0 h-1 bg-gradient-to-r from-[#C59B48] to-[#D6AE5A]"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeOut" }}
              />

              {/* Top Row - First 3 Tiers */}
              <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
                {tiers.slice(0, 3).map((tier, index) => {
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
                        className={`absolute top-20 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br ${tier.color} border-4 border-[#0B0B0D] z-20`}
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

                        {/* Main Card */}
                        <div className="relative bg-[#191922] backdrop-blur-xl rounded-2xl border border-[#2A2A3A] overflow-hidden transition-all duration-300 group-hover:bg-[#222231] group-hover:border-[rgba(197,155,72,0.20)]" style={{ boxShadow: '0 0 0 1px rgba(197,155,72,0), 0 18px 60px rgba(0,0,0,0.55)' }}>
                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: '0 0 0 1px rgba(197,155,72,0.20), 0 18px 60px rgba(0,0,0,0.55)' }} />
                          {/* Top Gradient Bar */}
                          <div
                            className={`h-1.5 bg-gradient-to-r ${tier.color}`}
                          />

                          {/* Card Content */}
                          <div className="p-6">
                            {/* Icon - Accent colors only in icon */}
                            <div className="mb-4 flex justify-center">
                              {tier.name === "Explorer" ? (
                                <div className="w-16 h-16 rounded-xl border-2 border-[#C59B48]/60 flex items-center justify-center bg-transparent">
                                  <Icon className={`w-8 h-8 ${tier.iconColor || 'text-[#C59B48]'}`} />
                                </div>
                              ) : tier.name === "Curator" ? (
                                <div className={`w-16 h-16 rounded-xl border-2 ${tier.iconBg || 'border-[#C59B48]/40'} flex items-center justify-center bg-transparent`}>
                                  <div className="relative">
                                    <Icon className={`w-8 h-8 ${tier.iconColor || 'text-[#C59B48]'}`} />
                                    <Icon className={`w-8 h-8 absolute inset-0 ${tier.iconAccent || 'text-[#45e3d3]'} opacity-40`} />
                                  </div>
                                </div>
                              ) : tier.name === "Patron" ? (
                                <div className={`w-16 h-16 rounded-xl border-2 ${tier.iconBg || 'border-[#C59B48]/40'} flex items-center justify-center bg-transparent`}>
                                  <div className="relative">
                                    <Icon className={`w-8 h-8 ${tier.iconColor || 'text-[#C59B48]'}`} />
                                    <Icon className={`w-8 h-8 absolute inset-0 ${tier.iconAccent || 'text-[#9375b5]'} opacity-40`} />
                                  </div>
                                </div>
                              ) : (
                                <div className={`w-16 h-16 rounded-xl border-2 ${tier.iconBg || 'border-[#C59B48]/40'} flex items-center justify-center bg-transparent`}>
                                  <Icon className={`w-8 h-8 ${tier.iconColor || 'text-[#C59B48]'}`} />
                                </div>
                              )}
                            </div>

                            {/* Tier Name */}
                            <h3 className="text-[#F2F2F3] text-center text-xl mb-2 font-heading font-semibold">
                              {tier.name}
                            </h3>

                            {/* Points */}
                            <div className="text-center mb-6 text-sm text-[#B9BBC6] font-medium font-body">
                              {tier.points} pts
                            </div>

                            {/* Benefits */}
                            <ul className="space-y-2.5">
                              {tier.benefits.slice(0, 4).map((benefit, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-[#B9BBC6] text-xs"
                                >
                                  <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#B9BBC6]" />
                                  <span className="leading-tight font-body font-normal">
                                    {benefit}
                                  </span>
                                </li>
                              ))}
                            </ul>

                            {/* View More */}
                            {tier.benefits.length > 4 && (
                              <button className="mt-4 w-full text-xs text-white/40 hover:text-[#B9BBC6] transition-colors flex items-center justify-center gap-1 font-body">
                                +{tier.benefits.length - 4} more
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>

                      {/* Arrow Connector (except last in row) */}
                      {index < 2 && (
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

              {/* Bottom Row - Last 2 Tiers (Ambassador & Founding Patron) - Centered with same width */}
              {tiers.length > 3 && (
                <div className="flex justify-center items-start gap-6 max-w-5xl mx-auto">
                  {tiers.slice(3).map((tier, index) => {
                    const Icon = tier.icon;
                    const actualIndex = 3 + index;
                    return (
                      <motion.div
                        key={actualIndex}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 + actualIndex * 0.15 }}
                        className="relative"
                        style={{ width: 'calc((100% - 3rem) / 3)' }}
                      >
                        {/* Connector Dot */}
                        <motion.div
                          className={`absolute top-20 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br ${tier.color} border-4 border-[#0B0B0D] z-20`}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: 0.5 + actualIndex * 0.15,
                            type: "spring",
                            stiffness: 200,
                          }}
                        />

                        {/* Card */}
                        <motion.div
                          whileHover={{ y: -8 }}
                          className="relative group"
                        >

                          {/* Main Card */}
                          <div className="relative bg-[#191922] backdrop-blur-xl rounded-2xl border border-[#2A2A3A] overflow-hidden transition-all duration-300 group-hover:bg-[#222231] group-hover:border-[rgba(197,155,72,0.20)]" style={{ boxShadow: '0 0 0 1px rgba(197,155,72,0), 0 18px 60px rgba(0,0,0,0.55)' }}>
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: '0 0 0 1px rgba(197,155,72,0.20), 0 18px 60px rgba(0,0,0,0.55)' }} />
                            {/* Top Gradient Bar */}
                            <div
                              className={`h-1.5 bg-gradient-to-r ${tier.color}`}
                            />

                            {/* Card Content */}
                            <div className="p-6">
                              {/* Icon - Accent colors only in icon */}
                              <div className="mb-4 flex justify-center">
                                {tier.name === "Explorer" ? (
                                  <div className="w-16 h-16 rounded-xl border-2 border-[#C59B48]/60 flex items-center justify-center bg-transparent">
                                    <Icon className={`w-8 h-8 ${tier.iconColor || 'text-[#C59B48]'}`} />
                                  </div>
                                ) : tier.name === "Curator" ? (
                                  <div className={`w-16 h-16 rounded-xl border-2 ${tier.iconBg || 'border-[#C59B48]/40'} flex items-center justify-center bg-transparent`}>
                                    <div className="relative">
                                      <Icon className={`w-8 h-8 ${tier.iconColor || 'text-[#C59B48]'}`} />
                                      <Icon className={`w-8 h-8 absolute inset-0 ${tier.iconAccent || 'text-[#45e3d3]'} opacity-40`} />
                                    </div>
                                  </div>
                                ) : tier.name === "Patron" ? (
                                  <div className={`w-16 h-16 rounded-xl border-2 ${tier.iconBg || 'border-[#C59B48]/40'} flex items-center justify-center bg-transparent`}>
                                    <div className="relative">
                                      <Icon className={`w-8 h-8 ${tier.iconColor || 'text-[#C59B48]'}`} />
                                      <Icon className={`w-8 h-8 absolute inset-0 ${tier.iconAccent || 'text-[#9375b5]'} opacity-40`} />
                                    </div>
                                  </div>
                                ) : (
                                  <div className={`w-16 h-16 rounded-xl border-2 ${tier.iconBg || 'border-[#C59B48]/40'} flex items-center justify-center bg-transparent`}>
                                    <Icon className={`w-8 h-8 ${tier.iconColor || 'text-[#C59B48]'}`} />
                                  </div>
                                )}
                              </div>

                              {/* Tier Name */}
                              <h3 className="text-white text-center text-xl mb-2 font-heading">
                                {tier.name}
                              </h3>

                              {/* Points */}
                              <div className="text-center mb-6 text-sm text-white/80 font-semibold font-body">
                                {tier.points} pts
                              </div>

                              {/* Benefits */}
                              <ul className="space-y-2.5">
                                {tier.benefits.slice(0, 4).map((benefit, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-[#B9BBC6] text-xs"
                                  >
                                    <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#B9BBC6]" />
                                    <span className="leading-tight font-body">
                                      {benefit}
                                    </span>
                                  </li>
                                ))}
                              </ul>

                              {/* View More */}
                              {tier.benefits.length > 4 && (
                                <button className="mt-4 w-full text-xs text-white/40 hover:text-[#B9BBC6] transition-colors flex items-center justify-center gap-1 font-body">
                                  +{tier.benefits.length - 4} more
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>

                        {/* Arrow Connector (except last) */}
                        {index < tiers.slice(3).length - 1 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 + actualIndex * 0.15 }}
                            className="absolute top-20 -right-3 z-10"
                          >
                            <ChevronRight className="w-6 h-6 text-white/20" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vertical Timeline - Mobile/Tablet */}
        {tiers.length > 0 && (
          <div className="lg:hidden max-w-2xl mx-auto w-full px-4 sm:px-0">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10" />
              <motion.div
                className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-[#C59B48] to-[#D6AE5A]"
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
                        className={`w-4 h-4 rounded-full bg-gradient-to-br ${tier.color} border-4 border-[#0B0B0D] shrink-0 mt-8 z-10`}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.3 + index * 0.1,
                          type: "spring",
                        }}
                      />

                      {/* Card */}
                      <div className="flex-1 pb-4 group">

                        {/* Main Card */}
                        <div className="relative bg-[#191922] backdrop-blur-xl rounded-2xl border border-[#2A2A3A] overflow-hidden transition-all duration-300 group-hover:bg-[#222231] group-hover:border-[rgba(197,155,72,0.20)]" style={{ boxShadow: '0 0 0 1px rgba(197,155,72,0), 0 18px 60px rgba(0,0,0,0.55)' }}>
                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: '0 0 0 1px rgba(197,155,72,0.20), 0 18px 60px rgba(0,0,0,0.55)' }} />
                          {/* Top Gradient Bar */}
                          <div
                            className={`h-1 bg-gradient-to-r ${tier.color}`}
                          />

                          {/* Card Content */}
                          <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                              {/* Icon - Accent colors only in icon */}
                              {tier.name === "Explorer" ? (
                                <div className="w-14 h-14 rounded-xl border-2 border-[#C59B48]/60 flex items-center justify-center bg-transparent shrink-0">
                                  <Icon className={`w-7 h-7 ${tier.iconColor || 'text-[#C59B48]'}`} />
                                </div>
                              ) : tier.name === "Curator" ? (
                                <div className={`w-14 h-14 rounded-xl border-2 ${tier.iconBg || 'border-[#C59B48]/40'} flex items-center justify-center bg-transparent shrink-0`}>
                                  <div className="relative">
                                    <Icon className={`w-7 h-7 ${tier.iconColor || 'text-[#C59B48]'}`} />
                                    <Icon className={`w-7 h-7 absolute inset-0 ${tier.iconAccent || 'text-[#45e3d3]'} opacity-40`} />
                                  </div>
                                </div>
                              ) : tier.name === "Patron" ? (
                                <div className={`w-14 h-14 rounded-xl border-2 ${tier.iconBg || 'border-[#C59B48]/40'} flex items-center justify-center bg-transparent shrink-0`}>
                                  <div className="relative">
                                    <Icon className={`w-7 h-7 ${tier.iconColor || 'text-[#C59B48]'}`} />
                                    <Icon className={`w-7 h-7 absolute inset-0 ${tier.iconAccent || 'text-[#9375b5]'} opacity-40`} />
                                  </div>
                                </div>
                              ) : (
                                <div className={`w-14 h-14 rounded-xl border-2 ${tier.iconBg || 'border-[#C59B48]/40'} flex items-center justify-center bg-transparent shrink-0`}>
                                  <Icon className={`w-7 h-7 ${tier.iconColor || 'text-[#C59B48]'}`} />
                                </div>
                              )}

                              <div className="flex-1">
                                {/* Tier Name */}
                                <h3 className="text-white text-xl mb-1 font-heading">
                                  {tier.name}
                                </h3>

                                {/* Points */}
                                <div className="text-sm text-white/80 font-semibold font-body">
                                  {tier.points} pts
                                </div>
                              </div>
                            </div>

                            {/* Benefits */}
                            <ul className="space-y-2">
                              {tier.benefits.map((benefit, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-[#B9BBC6] text-sm"
                                >
                                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#B9BBC6]" />
                                  <span className="font-body">{benefit}</span>
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
          className="text-center mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNavigateToSignUp}
            className="px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-xl bg-[#C59B48] hover:bg-[#D6AE5A] active:bg-[#A98237] text-[#0B0B0D] shadow-xl shadow-[#C59B48]/30 hover:shadow-2xl hover:shadow-[#C59B48]/50 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer text-sm sm:text-base font-body font-medium"
          >
            <span>{t.startJourney}</span>
            <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
