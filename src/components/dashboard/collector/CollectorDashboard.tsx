import { useLanguage } from "@/contexts/useLanguage";
import { ROUTES } from "@/routes/paths";
import { useGetDashboardStatsQuery } from "@/services/api/dashboardApi";
import type { RootState } from "@/store/store";
import { setProfileCompleted } from "@/store/authSlice";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CompleteProfile } from "../shared/CompleteProfile";
import { DashboardLayout } from "../shared/DashboardLayout";
import { DashboardWelcome } from "../shared/DashboardWelcome";
import { PointWallet } from "../shared/PointWallet";
import { TierProgress } from "../shared/TierProgress";
import { URLEncoder } from "../shared/URLEncoder";
import { WatchVideos } from "../shared/WatchVideos";
import { AddArtwork } from "../artist/AddArtwork";
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
  const dispatch = useDispatch();
  const storedUser = useSelector((state: RootState) => state.auth.user);

  // Read from Redux store first (immediate, no API wait)
  const reduxProfileCompleted = useSelector((state: RootState) => state.auth.profileCompleted);

  // Fetch dashboard stats to get profile_complete from API
  const { data: dashboardStatsData, refetch: refetchDashboardStats } = useGetDashboardStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Get profile_complete from API response
  const apiProfileCompleted = dashboardStatsData?.data?.profile_complete ?? false;

  // Use Redux store first, fallback to API if Redux is null
  // This ensures immediate display without waiting for API
  const profileCompleted = reduxProfileCompleted ?? apiProfileCompleted;

  // Sync Redux store when API response comes back with updated value
  useEffect(() => {
    if (dashboardStatsData?.data?.profile_complete !== undefined) {
      const apiValue = dashboardStatsData.data.profile_complete;
      // Only update if different from current Redux value
      if (reduxProfileCompleted !== apiValue) {
        dispatch(setProfileCompleted(apiValue));
      }
    }
  }, [dashboardStatsData?.data?.profile_complete, reduxProfileCompleted, dispatch]);

  // Handler to navigate to profile completion
  const handleCompleteProfile = () => {
    navigate(ROUTES.PROFILE_COMPLETION);
  };

  // Get user name from stored data
  const collectorName = storedUser
    ? (() => {
        // Use first_name + last_name
        const fullName = `${storedUser.first_name || ""} ${storedUser.last_name || ""}`.trim();
        if (fullName) {
          return fullName;
        }
        // Fallbacks
        return storedUser.title?.trim() || storedUser.email?.trim() || "Art Collector";
      })()
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
          <PointWallet 
            statsData={dashboardStatsData?.data}
            isLoadingStats={!dashboardStatsData}
          />
        </motion.div>

        {/* My Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MyCollection
            profileCompleted={profileCompleted}
            onCompleteProfile={handleCompleteProfile}
            statsData={dashboardStatsData?.data}
            onRefetchStats={refetchDashboardStats}
          />
        </motion.div>

        {/* Add Artwork */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AddArtwork
            profileCompleted={profileCompleted}
            onCompleteProfile={handleCompleteProfile}
            userType="Collector"
            onRefetchStats={refetchDashboardStats}
          />
        </motion.div>

        {/* Referral Link Generator (URL Encoder) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <URLEncoder
            profileCompleted={profileCompleted}
            statsData={dashboardStatsData?.data}
            isLoadingStats={!dashboardStatsData}
            onRefetchStats={refetchDashboardStats}
          />
        </motion.div>

        {/* Watch & Earn Videos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <WatchVideos onRefetchStats={refetchDashboardStats} />
        </motion.div>

        {/* Tier Progress and Market Insights - Stacked in one column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col gap-6"
        >
          {/* Tier Progress */}
          <TierProgress 
            statsData={dashboardStatsData?.data}
            isLoadingStats={!dashboardStatsData}
          />

          {/* Market Insights */}
          <MarketInsights 
            statsData={dashboardStatsData?.data}
            isLoadingStats={!dashboardStatsData}
          />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

