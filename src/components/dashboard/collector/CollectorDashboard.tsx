import { useLanguage } from "@/contexts/useLanguage";
import { ROUTES } from "@/routes/paths";
import { useGetDashboardStatsQuery } from "@/services/api/dashboardApi";
import type { RootState } from "@/store/store";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CompleteProfile } from "../shared/CompleteProfile";
import { DashboardLayout } from "../shared/DashboardLayout";
import { DashboardWelcome } from "../shared/DashboardWelcome";
import { PointWallet } from "../shared/PointWallet";
import { TierProgress } from "../shared/TierProgress";
import { URLEncoder } from "../shared/URLEncoder";
import { WatchVideos } from "../shared/WatchVideos";
import { MyCollection } from "./MyCollection";
import { MarketInsights } from "./MarketInsights";

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

  // Fetch dashboard stats to get profile_complete from API
  const { data: dashboardStatsData } = useGetDashboardStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Get profile_complete from API response
  const profileCompleted = dashboardStatsData?.data?.profile_complete ?? false;

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
        profileCompleted={profileCompleted}
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

        {/* Referral Link Generator (URL Encoder) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <URLEncoder />
        </motion.div>

        {/* Watch & Earn Videos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <WatchVideos />
        </motion.div>

        {/* Tier Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <TierProgress />
        </motion.div>

        {/* Market Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <MarketInsights />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

