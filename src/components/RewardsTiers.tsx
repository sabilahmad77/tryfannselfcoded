import { motion } from "motion/react";
import { Check, Star, Gem, Trophy, Sparkles, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import bgImage from "figma:asset/3fa9b9de7e4b1421a708a7c88cd0672cee3504e2.png";

interface RewardsTiersProps {
  language: "en" | "ar";
  onNavigateToSignUp?: () => void;
}

const content = {
  en: {
    title: { white: "Your Progression", gold: " System" },
    subtitle: "Climb the ladder and unlock powerful rewards at every milestone",
    viewRewards: "View Rewards",
    tiers: [
      {
        name: "Explorer",
        icon: Star,
        points: "0-500",
        color: "from-blue-400 to-cyan-500",
        borderColor: "border-blue-400/50",
        bgGlow: "bg-blue-400/10",
        rewards: [
          "Platform early access",
          "Community badge",
          "Basic referral rewards",
          "Newsletter updates",
        ],
      },
      {
        name: "Curator",
        icon: Gem,
        points: "500-2K",
        color: "from-purple-400 to-pink-500",
        borderColor: "border-purple-400/50",
        bgGlow: "bg-purple-400/10",
        rewards: [
          "Digital certificate of authenticity",
          "Exclusive webinars",
          "Enhanced referral bonuses",
          "Priority support",
          "Curator badge",
        ],
      },
      {
        name: "Ambassador",
        icon: Trophy,
        points: "2K-5K",
        color: "from-orange-400 to-red-500",
        borderColor: "border-orange-400/50",
        bgGlow: "bg-orange-400/10",
        rewards: [
          "AR gallery slot reservation",
          "Ambassador badge & recognition",
          "VIP event invitations",
          "Premium referral tier",
          "Beta feature access",
          "Personalized onboarding",
        ],
      },
      {
        name: "Founding Patron",
        icon: Sparkles,
        points: "5K+",
        color: "from-[#d4af37] to-[#fbbf24]",
        borderColor: "border-[#d4af37]/50",
        bgGlow: "bg-[#d4af37]/10",
        rewards: [
          "Lifetime premium access",
          "SaaS dashboard beta access",
          "Founding Patron badge",
          "Direct team connection",
          "Co-creation opportunities",
          "Exclusive physical rewards",
          "Revenue share opportunities",
        ],
      },
    ],
  },
  ar: {
    title: { white: "نظام التقدم", gold: " الخاص بك" },
    subtitle: "تسلق السلم وافتح مكافآت قوية في كل معلم",
    viewRewards: "عرض المكافآت",
    tiers: [
      {
        name: "مستكشف",
        icon: Star,
        points: "0-500",
        color: "from-blue-400 to-cyan-500",
        borderColor: "border-blue-400/50",
        bgGlow: "bg-blue-400/10",
        rewards: [
          "الوصول المبكر للمنصة",
          "شارة المجتمع",
          "مكافآت الإحالة الأساسية",
          "تحديثات النشرة الإخبارية",
        ],
      },
      {
        name: "منسق",
        icon: Gem,
        points: "500-2K",
        color: "from-purple-400 to-pink-500",
        borderColor: "border-purple-400/50",
        bgGlow: "bg-purple-400/10",
        rewards: [
          "شهادة أصالة رقمية",
          "ندوات حصرية عبر الإنترنت",
          "مكافآت إحالة محسنة",
          "دعم ذو أولوية",
          "شارة المنسق",
        ],
      },
      {
        name: "سفير",
        icon: Trophy,
        points: "2K-5K",
        color: "from-orange-400 to-red-500",
        borderColor: "border-orange-400/50",
        bgGlow: "bg-orange-400/10",
        rewards: [
          "حجز مساحة معرض الواقع المعزز",
          "شارة واعتراف بالسفير",
          "دعوات لأحداث VIP",
          "مستوى إحالة مميز",
          "الوصول لميزات تجريبية",
          "تأهيل مخصص",
        ],
      },
      {
        name: "راعي مؤسس",
        icon: Sparkles,
        points: "5K+",
        color: "from-[#d4af37] to-[#fbbf24]",
        borderColor: "border-[#d4af37]/50",
        bgGlow: "bg-[#d4af37]/10",
        rewards: [
          "وصول مميز مدى الحياة",
          "الوصول التجريبي لوحة SaaS",
          "شارة الراعي المؤسس",
          "اتصال مباشر بالفريق",
          "فرص المشاركة في الإنشاء",
          "مكافآت مادية حصرية",
          "فرص حصة الإيرادات",
        ],
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

  return (
    <section
      className="relative py-32 overflow-hidden bg-[#0a0612]"
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0612] via-[#0a0612]/95 to-[#0a0612]" />
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#d4af37]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-[#14b8a6]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
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
            <span className="text-[#d4af37]">{t.title.gold}</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg md:text-xl">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Horizontal Timeline - Desktop */}
        <div className="hidden lg:block max-w-7xl mx-auto">
          {/* Progress Bar Container */}
          <div className="relative mb-32">
            {/* Background Track */}
            <div className="absolute top-20 left-0 right-0 h-1 bg-white/10" />

            {/* Animated Progress Line */}
            <motion.div
              className="absolute top-20 left-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 via-orange-400 to-[#d4af37]"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeOut" }}
            />

            {/* Tier Cards */}
            <div className="grid grid-cols-4 gap-6">
              {t.tiers.map((tier, index) => {
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
                      className={`absolute top-20 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br ${tier.color} border-4 border-[#0a0612] z-20`}
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
                            className={`text-center mb-6 text-sm bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            {tier.points} pts
                          </div>

                          {/* Rewards */}
                          <ul className="space-y-2.5">
                            {tier.rewards.slice(0, 4).map((reward, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-white/60 text-xs"
                              >
                                <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#14b8a6]" />
                                <span className="leading-tight">{reward}</span>
                              </li>
                            ))}
                          </ul>

                          {/* View More */}
                          {tier.rewards.length > 4 && (
                            <button className="mt-4 w-full text-xs text-white/40 hover:text-white/60 transition-colors flex items-center justify-center gap-1">
                              +{tier.rewards.length - 4} more
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Arrow Connector (except last) */}
                    {index < t.tiers.length - 1 && (
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

        {/* Vertical Timeline - Mobile/Tablet */}
        <div className="lg:hidden max-w-2xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10" />
            <motion.div
              className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 via-orange-400 to-[#d4af37]"
              initial={{ height: "0%" }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeOut" }}
            />

            {/* Tier Cards */}
            <div className="space-y-8">
              {t.tiers.map((tier, index) => {
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
                      className={`w-4 h-4 rounded-full bg-gradient-to-br ${tier.color} border-4 border-[#0a0612] shrink-0 mt-8 z-10`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
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
                        <div className={`h-1 bg-gradient-to-r ${tier.color}`} />

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
                                className={`text-sm bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}
                                style={{
                                  fontWeight: 600,
                                }}
                              >
                                {tier.points} pts
                              </div>
                            </div>
                          </div>

                          {/* Rewards */}
                          <ul className="space-y-2">
                            {tier.rewards.map((reward, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-white/60 text-sm"
                              >
                                <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#14b8a6]" />
                                <span>{reward}</span>
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
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#fbbf24] text-[#0f172a] shadow-xl shadow-[#d4af37]/30 hover:shadow-2xl hover:shadow-[#d4af37]/50 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start Your Journey</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
