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
          <span className="text-[#fef3c7]">{t.welcome}, </span>
          <span className="bg-gradient-to-r from-[#d4af37] via-[#fbbf24] to-[#d4af37] bg-clip-text text-transparent animate-gradient">
            {userName}
          </span>
        </h1>
        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#14b8a6]/20 to-[#0ea5e9]/20 border border-[#14b8a6]/30 text-[#14b8a6] text-sm font-medium">
          {roleLabel}
        </span>
      </div>
      <p className="text-[#cbd5e1] text-lg">{subtitle}</p>
    </motion.div>
  );
}

