import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { ArtistRoster } from "./ArtistRoster";
import { TierProgress } from "../shared/TierProgress";
import { PointWallet } from "../shared/PointWallet";
import { DashboardLayout } from "../shared/DashboardLayout";
import { DashboardWelcome } from "../shared/DashboardWelcome";
import { useLanguage } from "@/contexts/useLanguage";
import type { RootState } from "@/store/store";
import { useGetDashboardStatsGalleryQuery } from "@/services/api/dashboardApi";

const content = {
  en: {
    welcome: "Welcome back",
    subtitle: "Manage your gallery and curate exceptional exhibitions",
    roles: {
      artist: "Artist",
      collector: "Collector",
      gallery: "Gallery",
      ambassador: "Ambassador",
    },
  },
  ar: {
    welcome: "مرحباً بعودتك",
    subtitle: "إدارة معرضك وتنسيق المعارض الاستثنائية",
    roles: {
      artist: "فنان",
      collector: "جامع",
      gallery: "معرض",
      ambassador: "سفير",
    },
  },
};

export function GalleryDashboard() {
  const { language } = useLanguage();
  const t = content[language];
  const storedUser = useSelector((state: RootState) => state.auth.user);
  const persona = useSelector((state: RootState) => state.auth.persona);

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

  // Get user role for display
  const displayRoleRaw =
    storedUser?.role?.toLowerCase() || persona?.toLowerCase() || "gallery";
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
    : "gallery";
  const roleLabel = t.roles[displayRole] || t.roles.gallery;

  return (
    <DashboardLayout currentPage="dashboard">
      {/* Welcome Section */}
      <DashboardWelcome
        userName={galleryName}
        subtitle={t.subtitle}
        roleLabel={roleLabel}
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

        {/* Row 2: Tier Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <TierProgress />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
