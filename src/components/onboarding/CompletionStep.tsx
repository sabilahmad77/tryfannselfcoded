import { motion } from "motion/react";
import {
  Sparkles,
  Trophy,
  Gift,
  Users,
  CheckCircle,
  ArrowRight,
  Crown,
  Zap,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/paths";
import type { OnboardingData } from "./OnboardingFlow";

interface CompletionStepProps {
  language: "en" | "ar";
  onNext: (data: Record<string, unknown>) => void;
  data: OnboardingData;
}

export function CompletionStep({ language, data }: CompletionStepProps) {
  const navigate = useNavigate();
  const isRTL = language === "ar";
  
  // Get persona from data
  const persona = (data?.persona as string)?.toLowerCase() || "artist";
  const isArtist = persona === "artist";
  const isCollector = persona === "collector";
  const isGallery = persona === "gallery";
  const isAmbassador = persona === "ambassador";

  const t = {
    en: {
      title: "Welcome to FANN! 🎉",
      subtitle: "Your account is ready",
      congratulations: "Congratulations!",
      summary: {
        title: "Here's what you earned",
        items: [
          {
            icon: Trophy,
            label: "Welcome Bonus",
            value: "+500 points",
            color: "text-amber-400",
          },
          {
            icon: Crown,
            label: "Starting Tier",
            value: "Explorer",
            color: "text-yellow-400",
          },
          {
            icon: Gift,
            label: "Persona Bonus",
            value: "+750 points",
            color: "text-orange-400",
          },
        ],
      },
      nextSteps: {
        title: "Your Next Steps",
        steps: [
          {
            icon: Sparkles,
            title: "Complete Your Profile",
            desc: "Add more details to earn extra points",
            points: "+200 pts",
          },
          {
            icon: Users,
            title: "Invite Friends",
            desc: "Share your referral code and grow the community",
            points: "+250 pts per referral",
          },
          {
            icon: Star,
            title: "Explore the Platform",
            desc: "Discover artworks, artists, and galleries",
            points: "+100 pts",
          },
          {
            icon: Zap,
            title: "Engage Daily",
            desc: "Stay active to climb the leaderboard",
            points: "+50 pts daily",
          },
        ],
      },
      stats: {
        title: "You're Now Part of",
        artist: {
          stat1: "1,247 Artists",
          stat2: "3,456 Artworks",
          stat3: "856 Collectors",
        },
        collector: {
          stat1: "856 Collectors",
          stat2: "3,456 Artworks",
          stat3: "1,247 Artists",
        },
        gallery: {
          stat1: "234 Galleries",
          stat2: "1,247 Artists",
          stat3: "3,456 Artworks",
        },
        ambassador: {
          stat1: "156 Ambassadors",
          stat2: "1,247 Community",
          stat3: "2,500+ Referrals",
        },
      },
      achievements: {
        title: "Achievements Unlocked",
        list: ["Early Adopter", "Profile Pioneer", "Community Builder"],
      },
      cta: "Enter FANN Platform",
      explore: "Start Exploring",
    },
    ar: {
      title: "مرحباً بك في FANN! 🎉",
      subtitle: "حسابك جاهز",
      congratulations: "تهانينا!",
      summary: {
        title: "هذا ما حصلت عليه",
        items: [
          {
            icon: Trophy,
            label: "مكافأة الترحيب",
            value: "+500 نقطة",
            color: "text-amber-400",
          },
          {
            icon: Crown,
            label: "المستوى البدائي",
            value: "مستكشف",
            color: "text-yellow-400",
          },
          {
            icon: Gift,
            label: "مكافأة الشخصية",
            value: "+750 نقطة",
            color: "text-orange-400",
          },
        ],
      },
      nextSteps: {
        title: "خطواتك التالية",
        steps: [
          {
            icon: Sparkles,
            title: "أكمل ملفك الشخصي",
            desc: "أضف المزيد من التفاصيل لتحصل على نقاط إضافية",
            points: "+200 نقطة",
          },
          {
            icon: Users,
            title: "ادعُ الأصدقاء",
            desc: "شارك كود الإحالة الخاص بك ونمِّ المجتمع",
            points: "+250 نقطة لكل إحالة",
          },
          {
            icon: Star,
            title: "استكشف المنصة",
            desc: "اكتشف الأعمال الفنية والفنانين والمعارض",
            points: "+100 نقطة",
          },
          {
            icon: Zap,
            title: "تفاعل يومياً",
            desc: "ابقَ نشطاً لتتسلق لوحة المتصدرين",
            points: "+50 نقطة يومياً",
          },
        ],
      },
      stats: {
        title: "أنت الآن جزء من",
        artist: {
          stat1: "1,247 فنان",
          stat2: "3,456 عمل فني",
          stat3: "856 جامع",
        },
        collector: {
          stat1: "856 جامع",
          stat2: "3,456 عمل فني",
          stat3: "1,247 فنان",
        },
        gallery: {
          stat1: "234 معرض",
          stat2: "1,247 فنان",
          stat3: "3,456 عمل فني",
        },
        ambassador: {
          stat1: "156 سفير",
          stat2: "1,247 مجتمع",
          stat3: "2,500+ إحالة",
        },
      },
      achievements: {
        title: "الإنجازات المفتوحة",
        list: ["المتبني المبكر", "رائد الملف الشخصي", "باني المجتمع"],
      },
      cta: "ادخل منصة FANN",
      explore: "ابدأ الاستكشاف",
    },
  };

  const content = t[language];
  
  // Get role-specific stats
  const roleStats = 
    (isArtist && content.stats.artist) ||
    (isCollector && content.stats.collector) ||
    (isGallery && content.stats.gallery) ||
    (isAmbassador && content.stats.ambassador) ||
    content.stats.artist; // Default to artist

  const handleComplete = () => {
    // Navigate to dashboard page
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="glass border border-white/10 rounded-3xl p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Celebration Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          {/* Animated Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="relative w-32 h-32 mx-auto mb-6"
          >
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity },
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 blur-xl"
            />
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/50 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-amber-400" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl text-white mb-4"
          >
            {content.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/70 text-lg"
          >
            {content.subtitle}
          </motion.p>
        </motion.div>

        {/* Earned Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-2xl text-white mb-6 text-center">
            {content.summary.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {content.summary.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-xl glass border border-white/10 hover:border-amber-500/30 transition-all text-center"
                >
                  <Icon className={`w-8 h-8 ${item.color} mx-auto mb-3`} />
                  <div className="text-sm text-[#B9BBC6] mb-2">{item.label}</div>
                  <div className="text-white">{item.value}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-10 p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30"
        >
          <h3 className="text-xl text-white mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            {content.achievements.title}
          </h3>
          <div className="flex flex-wrap gap-3">
            {content.achievements.list.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-amber-400" />
                <span className="text-white text-sm">{achievement}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mb-10"
        >
          <h2 className="text-2xl text-white mb-6 text-center">
            {content.nextSteps.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {content.nextSteps.steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                  className="p-6 rounded-xl glass border border-white/10 hover:border-amber-500/30 transition-all group cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <Icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white">{step.title}</h3>
                        <span className="text-amber-400 text-xs shrink-0 ml-2">
                          {step.points}
                        </span>
                      </div>
                      <p className="text-[#B9BBC6] text-sm">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9 }}
          className="mb-10 p-6 rounded-xl glass border border-white/10"
        >
          <h3 className="text-xl text-white mb-4 text-center">
            {content.stats.title}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl text-amber-400 mb-1">
                {roleStats.stat1.split(" ")[0]}
              </div>
              <div className="text-xs text-[#B9BBC6]">
                {roleStats.stat1.split(" ").slice(1).join(" ")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-amber-400 mb-1">
                {roleStats.stat2.split(" ")[0]}
              </div>
              <div className="text-xs text-[#B9BBC6]">
                {roleStats.stat2.split(" ").slice(1).join(" ")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-amber-400 mb-1">
                {roleStats.stat3.split(" ")[0]}
              </div>
              <div className="text-xs text-[#B9BBC6]">
                {roleStats.stat3.split(" ").slice(1).join(" ")}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0 }}
        >
          <Button
            onClick={handleComplete}
            className="w-full h-16 shadow-lg shadow-primary/50 transition-all group relative overflow-hidden text-lg cursor-pointer"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Sparkles className="w-6 h-6" />
              {content.cta}
              <ArrowRight
                className={`w-6 h-6 group-hover:translate-x-1 transition-transform ${
                  isRTL ? "rotate-180" : ""
                }`}
              />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </Button>
        </motion.div>

        {/* Confetti Effect (visual indicator) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-400 rounded-full"
              initial={{
                top: "50%",
                left: "50%",
                opacity: 1,
                scale: 0,
              }}
              animate={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0,
                scale: 1,
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
