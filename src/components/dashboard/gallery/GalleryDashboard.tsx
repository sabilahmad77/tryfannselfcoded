import { useLanguage } from "@/contexts/useLanguage";
import { useGetDashboardStatsGalleryQuery } from "@/services/api/dashboardApi";
import type { RootState } from "@/store/store";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../shared/DashboardLayout";
import { DashboardWelcome } from "../shared/DashboardWelcome";
import { CompleteProfile } from "../shared/CompleteProfile";
import { PointWallet } from "../shared/PointWallet";
import { TierProgress } from "../shared/TierProgress";
import { URLEncoder } from "../shared/URLEncoder";
import { WatchVideos } from "../shared/WatchVideos";
import { ArtistRoster } from "./ArtistRoster";
import { ROUTES } from "@/routes/paths";

const content = {
  en: {
    welcome: "Welcome back",
    subtitle: "Manage your gallery and curate exceptional exhibitions",
  },
  ar: {
    welcome: "مرحباً بعودتك",
    subtitle: "إدارة معرضك وتنسيق المعارض الاستثنائية",
  },
};

export function GalleryDashboard() {
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

  // Fetch gallery-specific dashboard stats (for future use)
  const { data: _galleryStatsData, isLoading: _isLoadingStats } =
    useGetDashboardStatsGalleryQuery();

  // Get user name from stored data
  const galleryName = storedUser
    ? storedUser.organization_name ||
    `${storedUser.first_name || ""} ${storedUser.last_name || ""}`.trim() ||
    storedUser.title ||
    storedUser.email ||
    "Art Gallery"
    : "Art Gallery";


  return (
    <DashboardLayout currentPage="dashboard">
      {/* Welcome Section */}
      <DashboardWelcome
        userName={galleryName}
        subtitle={t.subtitle}
      />

      {/* Complete Profile Section */}
      <CompleteProfile
        profileCompleted={profileCompleted ?? false}
        onCompleteProfile={handleCompleteProfile}
      />

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Row 1: Point Wallet + Artist Roster */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <PointWallet />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ArtistRoster />
        </motion.div>

        {/* Row 2: Referral Link Generator (URL Encoder) + Watch & Earn */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <URLEncoder />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <WatchVideos />
        </motion.div>

        {/* Row 3: Tier Progress (same width as other cards) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <TierProgress />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
