import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { PointWallet } from "@/components/dashboard/shared/PointWallet";
import { URLEncoder } from "@/components/dashboard/shared/URLEncoder";
import { RedemptionCodes } from "@/components/dashboard/shared/RedemptionCodes";
import { WatchVideos } from "@/components/dashboard/shared/WatchVideos";
import { CollectorDashboard } from "@/components/dashboard/collector/CollectorDashboard";
import { GalleryDashboard } from "@/components/dashboard/gallery/GalleryDashboard";
import { AmbassadorDashboard } from "@/components/dashboard/ambassador/AmbassadorDashboard";
import { DashboardLayout } from "@/components/dashboard/shared/DashboardLayout";
import { DashboardWelcome } from "@/components/dashboard/shared/DashboardWelcome";
import { useLanguage } from "@/contexts/useLanguage";
import type { RootState } from "@/store/store";

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
  const storedUser = useSelector((state: RootState) => state.auth.user);

  // Get user role/persona - check role field first, then persona
  const userRole = storedUser?.role?.toLowerCase() || null;
  const persona = useSelector((state: RootState) => state.auth.persona);

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

  return (
    <DashboardLayout currentPage="dashboard">
      {/* Welcome Section */}
      <DashboardWelcome
        userName={userName}
        subtitle={subtitle}
      />

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Point Wallet - Takes full width on mobile, half on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <PointWallet />
        </motion.div>

        {/* URL Encoder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <URLEncoder />
        </motion.div>

        {/* Redemption Codes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <RedemptionCodes />
        </motion.div>

        {/* Watch Videos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <WatchVideos />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
