import { AmbassadorDashboard } from "@/components/dashboard/ambassador/AmbassadorDashboard";
import { AddArtwork } from "@/components/dashboard/artist/AddArtwork";
import { CollectorDashboard } from "@/components/dashboard/collector/CollectorDashboard";
import { GalleryDashboard } from "@/components/dashboard/gallery/GalleryDashboard";
import { CompleteProfile } from "@/components/dashboard/shared/CompleteProfile";
import { DashboardLayout } from "@/components/dashboard/shared/DashboardLayout";
import { DashboardWelcome } from "@/components/dashboard/shared/DashboardWelcome";
import { PointWallet } from "@/components/dashboard/shared/PointWallet";
import { TierProgress } from "@/components/dashboard/shared/TierProgress";
import { URLEncoder } from "@/components/dashboard/shared/URLEncoder";
import { WatchVideos } from "@/components/dashboard/shared/WatchVideos";
import { useLanguage } from "@/contexts/useLanguage";
import { ROUTES } from "@/routes/paths";
import { useGetDashboardStatsQuery } from "@/services/api/dashboardApi";
import type { RootState } from "@/store/store";
import { setProfileCompleted } from "@/store/authSlice";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const content = {
  en: {
    welcome: "Welcome back",
    subtitles: {
      artist: "Manage your art journey and track your progress",
      collector:
        "Discover and acquire authenticated artwork for your collection",
      gallery: "Manage your gallery and curate exceptional exhibitions",
      ambassador: "Track your performance and grow your influence",
    },
    roles: {
      artist: "Artist",
      collector: "Collector",
      gallery: "Gallery",
      ambassador: "Ambassador",
    },
  },
  ar: {
    welcome: "مرحباً بعودتك",
    subtitles: {
      artist: "إدارة رحلتك الفنية وتتبع تقدمك",
      collector: "اكتشف واقتن الأعمال الفنية الموثقة لمجموعتك",
      gallery: "إدارة معرضك وتنسيق المعارض الاستثنائية",
      ambassador: "تتبع أدائك وزد تأثيرك",
    },
    roles: {
      artist: "فنان",
      collector: "جامع",
      gallery: "معرض",
      ambassador: "سفير",
    },
  },
};

export function DashboardPage() {
  const { language } = useLanguage();
  const t = content[language];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storedUser = useSelector((state: RootState) => state.auth.user);

  // Get user role/persona - check role field first, then persona
  const userRole = storedUser?.role?.toLowerCase() || null;
  const persona = useSelector((state: RootState) => state.auth.persona);

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

  // Determine which dashboard to show based on role
  // Role can be: "artist", "gallery", "collector" (case-insensitive)
  const role = userRole || persona?.toLowerCase() || "artist";

  // Render role-based dashboard
  if (role === "collector") {
    return <CollectorDashboard />;
  }

  if (role === "gallery") {
    return <GalleryDashboard />;
  }

  if (role === "ambassador") {
    return <AmbassadorDashboard />;
  }

  // Default to Artist Dashboard (existing implementation)
  // Get user name from stored data
  const userName = storedUser
    ? `${storedUser.first_name || ""} ${storedUser.last_name || ""}`.trim() ||
    storedUser.title ||
    storedUser.email ||
    "User"
    : "User";

  // Get user role for display - prioritize storedUser.role, then persona, then default
  // Normalize role to match our content keys (lowercase)
  const displayRoleRaw =
    storedUser?.role?.toLowerCase() || persona?.toLowerCase() || "artist";

  // Validate and map role to our supported roles
  const validRoles: Array<"artist" | "collector" | "gallery" | "ambassador"> = [
    "artist",
    "collector",
    "gallery",
    "ambassador",
  ];
  const displayRole = validRoles.includes(
    displayRoleRaw as "artist" | "collector" | "gallery" | "ambassador"
  )
    ? (displayRoleRaw as "artist" | "collector" | "gallery" | "ambassador")
    : "artist";

  // Get role-based subtitle
  const subtitleKey = displayRole;
  const subtitle = t.subtitles[subtitleKey] || t.subtitles.artist;

  // Handler to navigate to profile completion
  const handleCompleteProfile = () => {
    // Navigate to profile completion page
    navigate(ROUTES.PROFILE_COMPLETION);
  };

  return (
    <DashboardLayout currentPage="dashboard">
      {/* Welcome Section */}
      <DashboardWelcome
        userName={userName}
        subtitle={subtitle}
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

        {/* Referral Link Generator (URL Encoder) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <WatchVideos />
        </motion.div>

        {/* My Artworks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AddArtwork
            profileCompleted={profileCompleted}
            onCompleteProfile={handleCompleteProfile}
          />
        </motion.div>

        {/* Tier Progress - Full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="lg:col-span-2"
        >
          <TierProgress 
            statsData={dashboardStatsData?.data}
            isLoadingStats={!dashboardStatsData}
          />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
