import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MyCollection } from "./MyCollection";
import { MarketInsights } from "./MarketInsights";
import { TierProgress } from "../shared/TierProgress";
import { PointWallet } from "../shared/PointWallet";
import { CompleteProfile } from "../shared/CompleteProfile";
import { DashboardLayout } from "../shared/DashboardLayout";
import { DashboardWelcome } from "../shared/DashboardWelcome";
import { useLanguage } from "@/contexts/useLanguage";
import { ROUTES } from "@/routes/paths";
import type { RootState } from "@/store/store";

const content = {
  en: {
    welcome: "Welcome back",
    subtitle: "Discover and acquire authenticated artwork for your collection",
  },
  ar: {
    welcome: "مرحباً بعودتك",
    subtitle: "اكتشف واقتن الأعمال الفنية الموثقة لمجموعتك",
  },
};

export function CollectorDashboard() {
  const { language } = useLanguage();
  const t = content[language];
  const navigate = useNavigate();
  const storedUser = useSelector((state: RootState) => state.auth.user);

  // Get profile completion status from Redux
  const profileCompleted = useSelector(
    (state: RootState) => state.auth.profileCompleted
  );

  // Handler to navigate to profile completion
  const handleCompleteProfile = () => {
    navigate(ROUTES.PROFILE_COMPLETION);
  };

  // Get user name from stored data
  const collectorName = storedUser
    ? `${storedUser.first_name || ""} ${storedUser.last_name || ""}`.trim() ||
      storedUser.title ||
      storedUser.email ||
      "Art Collector"
    : "Art Collector";

  return (
    <DashboardLayout currentPage="dashboard">
      {/* Welcome Section */}
      <DashboardWelcome
        userName={collectorName}
        subtitle={t.subtitle}
      />

      {/* Complete Profile Section */}
      <CompleteProfile
        profileCompleted={profileCompleted ?? false}
        onCompleteProfile={handleCompleteProfile}
      />

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Point Wallet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <PointWallet />
        </motion.div>

        {/* My Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MyCollection />
        </motion.div>

        {/* Market Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <MarketInsights />
        </motion.div>

        {/* Tier Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <TierProgress />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

