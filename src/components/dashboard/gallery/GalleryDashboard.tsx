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
import { AddArtwork } from "../artist/AddArtwork";
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

  // Handler to navigate to profile completion
  const handleCompleteProfile = () => {
    navigate(ROUTES.PROFILE_COMPLETION);
  };

  // Fetch gallery-specific dashboard stats
  const { data: galleryStatsData } = useGetDashboardStatsGalleryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Get profile_complete from API response
  const profileCompleted = galleryStatsData?.data?.profile_complete ?? false;

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
        profileCompleted={profileCompleted}
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
          <ArtistRoster
            profileCompleted={profileCompleted}
            onCompleteProfile={handleCompleteProfile}
          />
        </motion.div>

        {/* Row 2: Add Artwork + Referral Link Generator (URL Encoder) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AddArtwork
            profileCompleted={profileCompleted}
            onCompleteProfile={handleCompleteProfile}
            userType="Gallery"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <URLEncoder />
        </motion.div>

        {/* Row 3: Watch & Earn + Tier Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <WatchVideos />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <TierProgress />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
