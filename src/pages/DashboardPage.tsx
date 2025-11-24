import { useState } from "react";
import { motion } from "motion/react";
import { PointWallet } from "@/components/dashboard/PointWallet";
import { URLEncoder } from "@/components/dashboard/URLEncoder";
import { RedemptionCodes } from "@/components/dashboard/RedemptionCodes";
import { WatchVideos } from "@/components/dashboard/WatchVideos";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/contexts/useLanguage";

const content = {
  en: {
    welcome: "Welcome back",
    subtitle: "Manage your art journey and track your progress",
  },
  ar: {
    welcome: "مرحباً بعودتك",
    subtitle: "إدارة رحلتك الفنية وتتبع تقدمك",
  },
};

export function DashboardPage() {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";
  const [userName] = useState("Art Enthusiast");

  return (
    <DashboardLayout currentPage="dashboard">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}
      >
        <h1 className="text-4xl md:text-5xl mb-2">
          <span className="text-[#fef3c7]">{t.welcome}, </span>
          <span className="bg-gradient-to-r from-[#d4af37] via-[#fbbf24] to-[#d4af37] bg-clip-text text-transparent animate-gradient">
            {userName}
          </span>
        </h1>
        <p className="text-[#cbd5e1] text-lg">{t.subtitle}</p>
      </motion.div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Point Wallet - Takes full width on mobile, half on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <PointWallet />
        </motion.div>

        {/* URL Encoder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <URLEncoder />
        </motion.div>

        {/* Redemption Codes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <RedemptionCodes />
        </motion.div>

        {/* Watch Videos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <WatchVideos />
        </motion.div>
      </div>

      {/* Placeholder for Additional Widgets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="glass rounded-2xl p-6 border-2 border-dashed border-[#d4af37]/30"
      >
        <div className="flex items-center justify-center h-32 text-[#cbd5e1]">
          <p className={isRTL ? "text-right" : "text-left"}>
            {language === "en"
              ? "Space reserved for additional widgets"
              : "مساحة محجوزة لإضافة ويدجت إضافية"}
          </p>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
