import { useLanguage } from "@/contexts/useLanguage";
import { useGetDashboardStatsGalleryQuery } from "@/services/api/dashboardApi";
import type { RootState } from "@/store/store";
import { setProfileCompleted } from "@/store/authSlice";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
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
  const dispatch = useDispatch();
  const storedUser = useSelector((state: RootState) => state.auth.user);

  // Handler to navigate to profile completion
  const handleCompleteProfile = () => {
    navigate(ROUTES.PROFILE_COMPLETION);
  };

  // Read from Redux store first (immediate, no API wait)
  const reduxProfileCompleted = useSelector((state: RootState) => state.auth.profileCompleted);

  // Fetch gallery-specific dashboard stats
  const { data: galleryStatsData, refetch: refetchGalleryStats } = useGetDashboardStatsGalleryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Get profile_complete from API response
  const apiProfileCompleted = galleryStatsData?.data?.profile_complete ?? false;

  // Use Redux store first, fallback to API if Redux is null
  // This ensures immediate display without waiting for API
  const profileCompleted = reduxProfileCompleted ?? apiProfileCompleted;

  // Sync Redux store when API response comes back with updated value
  useEffect(() => {
    if (galleryStatsData?.data?.profile_complete !== undefined) {
      const apiValue = galleryStatsData.data.profile_complete;
      // Only update if different from current Redux value
      if (reduxProfileCompleted !== apiValue) {
        dispatch(setProfileCompleted(apiValue));
      }
    }
  }, [galleryStatsData?.data?.profile_complete, reduxProfileCompleted, dispatch]);

  // Get user name from stored data - prevent duplication
  const galleryName = storedUser
    ? (() => {
        // Prioritize organization_name for galleries (check for non-empty string)
        if (storedUser.organization_name?.trim()) {
          return storedUser.organization_name.trim();
        }
        // Fallback to first_name + last_name (only if organization_name is not set)
        const fullName = `${storedUser.first_name || ""} ${storedUser.last_name || ""}`.trim();
        if (fullName) {
          return fullName;
        }
        // Further fallbacks
        return storedUser.title?.trim() || storedUser.email?.trim() || "Art Gallery";
      })()
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
          <PointWallet 
            statsData={galleryStatsData?.data}
            isLoadingStats={!galleryStatsData}
          />
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
            onRefetchStats={refetchGalleryStats}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <URLEncoder
            profileCompleted={profileCompleted}
            statsData={galleryStatsData?.data}
            isLoadingStats={!galleryStatsData}
            onRefetchStats={refetchGalleryStats}
          />
        </motion.div>

        {/* Row 3: Watch & Earn + Tier Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <WatchVideos onRefetchStats={refetchGalleryStats} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <TierProgress 
            statsData={galleryStatsData?.data}
            isLoadingStats={!galleryStatsData}
          />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
