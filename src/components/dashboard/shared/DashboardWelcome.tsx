import { motion } from "motion/react";
import { useLanguage } from "@/contexts/useLanguage";

interface DashboardWelcomeProps {
  userName: string;
  subtitle: string;
  roleLabel: string;
}

const content = {
  en: {
    welcome: "Welcome back",
  },
  ar: {
    welcome: "مرحباً بعودتك",
  },
};

export function DashboardWelcome({
  userName,
  subtitle,
  roleLabel,
}: DashboardWelcomeProps) {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}
    >
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <h1 className="text-4xl md:text-5xl">
          <span className="text-[#ffffff]">{t.welcome}, </span>
          <span className="bg-gradient-to-r from-[#ffcc33] via-[#fbbf24] to-[#ffcc33] bg-clip-text text-transparent animate-gradient">
            {userName}
          </span>
        </h1>
        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#45e3d3]/20 to-[#0ea5e9]/20 border border-[#45e3d3]/30 text-[#45e3d3] text-sm font-medium">
          {roleLabel}
        </span>
      </div>
      <p className="text-[#808c99] text-lg">{subtitle}</p>
    </motion.div>
  );
}

