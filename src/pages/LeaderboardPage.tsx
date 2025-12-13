import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Crown,
  Medal,
  Trophy,
  Sparkles,
  Palette,
  Building2,
  User,
  Award,
  Calendar,
  Zap,
  Loader2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/shared/DashboardLayout";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useLanguage } from "@/contexts/useLanguage";
import {
  useGetLeaderboardQuery,
  useGetUserLeaderboardQuery,
  useFollowUserMutation,
} from "@/services/api/dashboardApi";
import type {
  LeaderboardEntry,
  LeaderboardQueryParams,
} from "@/services/api/dashboardApi";
import type { RootState } from "@/store/store";
import { ROUTES } from "@/routes/paths";
import bgImage from "figma:asset/18b1d776f4ce826bfa3453d71d5a597f3dc3dd2b.png";

type TimeFilter = "allTime" | "thisMonth" | "thisWeek";
type PersonaFilter = "all" | "artist" | "gallery" | "collector" | "ambassador";

const content = {
  en: {
    title: "Global Leaderboard",
    subtitle:
      "Discover the top art pioneers and visionaries shaping the future of the art world",
    filterBy: "Filter By",
    timePeriod: "Time Period",
    userType: "User Type",
    timePeriods: {
      allTime: "All Time",
      thisMonth: "This Month",
      thisWeek: "This Week",
    },
    personas: {
      all: "All Users",
      artist: "Artists",
      gallery: "Galleries",
      collector: "Collectors",
      ambassador: "Ambassadors",
    },
    columns: ["Rank", "User", "Points", "Tier", ""],
    follow: "Follow",
    following: "Following",
    stats: {
      totalParticipants: "Total Participants",
      topTier: "Founding Patrons",
      avgPoints: "Average Points",
    },
    yourRank: "Your Current Rank",
    notRanked: "Not ranked yet",
    loading: "Loading leaderboard...",
    error: "Unable to load leaderboard. Showing sample data.",
    noData: "No leaderboard data available yet.",
    pagination: {
      showing: "Showing",
      to: "to",
      of: "of",
      results: "results",
      previous: "Previous",
      next: "Next",
    },
  },
  ar: {
    title: "لوحة المتصدرين العالمية",
    subtitle: "اكتشف رواد الفن والمبدعين الذين يشكلون مستقبل عالم الفن",
    filterBy: "تصفية حسب",
    timePeriod: "الفترة الزمنية",
    userType: "نوع المستخدم",
    timePeriods: {
      allTime: "كل الأوقات",
      thisMonth: "هذا الشهر",
      thisWeek: "هذا الأسبوع",
    },
    personas: {
      all: "جميع المستخدمين",
      artist: "الفنانون",
      gallery: "المعارض",
      collector: "الجامعون",
      ambassador: "السفيراء",
    },
    columns: ["الترتيب", "المستخدم", "النقاط", "المستوى", ""],
    follow: "متابعة",
    following: "متابع",
    stats: {
      totalParticipants: "إجمالي المشاركين",
      topTier: "الرعاة المؤسسون",
      avgPoints: "متوسط النقاط",
    },
    yourRank: "ترتيبك الحالي",
    notRanked: "غير مصنف بعد",
    loading: "جاري تحميل لوحة المتصدرين...",
    error: "تعذر تحميل لوحة المتصدرين. يتم عرض بيانات تجريبية.",
    noData: "لا توجد بيانات للوحة المتصدرين حتى الآن.",
    pagination: {
      showing: "عرض",
      to: "إلى",
      of: "من",
      results: "نتائج",
      previous: "السابق",
      next: "التالي",
    },
  },
};

export function LeaderboardPage() {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";
  const location = useLocation();
  const navigate = useNavigate();
  const [follows, setFollows] = useState<Set<string>>(new Set());
  const [loadingUserId, setLoadingUserId] = useState<number | null>(null);

  // Mock follower counts - will be replaced with API data after login
  const followerCounts: Record<string, number> = {
    "@sarahm": 245,
    "@mchen": 189,
    "@laylaart": 167,
    "@jrodriguez": 142,
    "@fatimak": 231,
    "@alexart": 98,
    "@dubaimodern": 134,
    "@omark": 87,
    "@sofiaart": 156,
    "@ahmeds": 73,
  };

  // Follow user mutation
  const [followUser] = useFollowUserMutation();

  const toggleFollow = async (userId: number, username: string) => {
    if (!isAuthenticated || !userId) return;

    // Check if already following from API data (is_follow field)
    const apiEntry = apiEntries.find(
      (entry: LeaderboardEntry) => entry.id === userId
    );
    const isFollowingFromApi = apiEntry?.is_follow === true;

    // If already following, don't make API call
    if (isFollowingFromApi) {
      return;
    }

    const isCurrentlyFollowing = follows.has(username);

    // Set loading state for this specific user
    setLoadingUserId(userId);

    try {
      // Optimistic update
      setFollows((prev) => {
        const newFollows = new Set(prev);
        if (isCurrentlyFollowing) {
          newFollows.delete(username);
        } else {
          newFollows.add(username);
        }
        return newFollows;
      });

      // Call API
      await followUser({ follow_to: userId }).unwrap();

      // Manually refetch leaderboard to get updated is_follow status
      if (isAuthenticated) {
        refetchUserLeaderboard();
      }
    } catch (error) {
      // Revert optimistic update on error
      setFollows((prev) => {
        const newFollows = new Set(prev);
        if (isCurrentlyFollowing) {
          newFollows.add(username);
        } else {
          newFollows.delete(username);
        }
        return newFollows;
      });
      console.error("Failed to toggle follow status:", error);
    } finally {
      // Clear loading state
      setLoadingUserId(null);
    }
  };

  const isFollowing = (username: string) => follows.has(username);
  const getFollowerCount = (username: string) => followerCounts[username] || 0;

  // Check authentication status
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // Check if user came from homepage
  const fromHomepage =
    (location.state as { fromHomepage?: boolean })?.fromHomepage ?? false;

  // Determine if we should show dashboard layout
  // Show dashboard layout only if: authenticated AND not from homepage
  const showDashboardLayout = isAuthenticated && !fromHomepage;

  const [timeFilter, setTimeFilter] = useState<TimeFilter>("allTime");
  const [personaFilter, setPersonaFilter] = useState<PersonaFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [timeFilter, personaFilter]);

  // Map UI filter to API filter
  const mapTimeFilterToApi = (
    filter: TimeFilter
  ): "week" | "month" | "allTime" => {
    if (filter === "thisWeek") return "week";
    if (filter === "thisMonth") return "month";
    return "allTime";
  };

  // Map persona filter to API role (only for authenticated users)
  // API expects capitalized role names (e.g., "Gallery", "Artist", "Collector", "Ambassador")
  const mapPersonaToRole = (
    persona: PersonaFilter
  ): "Artist" | "Gallery" | "Collector" | "Ambassador" | undefined => {
    if (persona === "all") return undefined;
    // Capitalize first letter to match API expectations
    return (persona.charAt(0).toUpperCase() + persona.slice(1)) as
      | "Artist"
      | "Gallery"
      | "Collector"
      | "Ambassador";
  };

  // Prepare query parameters
  // Role filter is handled by API for both authenticated and non-authenticated users
  const queryParams: LeaderboardQueryParams = {
    filter: mapTimeFilterToApi(timeFilter),
    page: currentPage,
    page_size: itemsPerPage,
    ...(personaFilter !== "all" && { role: mapPersonaToRole(personaFilter) }),
  };

  // Use different APIs based on authentication status
  const {
    data: publicLeaderboardData,
    isLoading: isLoadingPublic,
    isError: isErrorPublic,
  } = useGetLeaderboardQuery(isAuthenticated ? undefined : queryParams, {
    skip: isAuthenticated, // Skip if authenticated
  });

  const {
    data: userLeaderboardData,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    refetch: refetchUserLeaderboard,
  } = useGetUserLeaderboardQuery(isAuthenticated ? queryParams : undefined, {
    skip: !isAuthenticated, // Skip if not authenticated
  });

  const isLoading = isAuthenticated ? isLoadingUser : isLoadingPublic;
  const isError = isAuthenticated ? isErrorUser : isErrorPublic;

  // Get API entries based on authentication
  // For authenticated users: response.data.data (nested)
  // For public users: response.data (direct array)
  const apiEntries = useMemo(() => {
    return isAuthenticated
      ? userLeaderboardData?.data?.data || []
      : publicLeaderboardData?.data || [];
  }, [
    isAuthenticated,
    userLeaderboardData?.data?.data,
    publicLeaderboardData?.data,
  ]);

  // Initialize and sync follows from API data (is_follow field)
  // Use the same username generation logic as in mapApiDataToLeaders
  useEffect(() => {
    if (isAuthenticated && apiEntries && apiEntries.length > 0) {
      // Build follows set from API data using the same username logic
      const apiFollows = new Set<string>();
      apiEntries.forEach((entry: LeaderboardEntry) => {
        // Use the same username generation logic as mapApiDataToLeaders
        const username =
          entry.username || `@${entry.email?.split("@")[0] || "user"}`;
        if (entry.is_follow && username) {
          apiFollows.add(username);
        }
      });

      // Update follows state to match API data
      // This ensures the UI stays in sync with the server state after refetch
      setFollows((prevFollows) => {
        // Check if there's a difference to avoid unnecessary re-renders
        const prevArray = Array.from(prevFollows).sort();
        const apiArray = Array.from(apiFollows).sort();
        if (
          prevArray.length !== apiArray.length ||
          prevArray.some((val, idx) => val !== apiArray[idx])
        ) {
          return apiFollows;
        }
        return prevFollows;
      });
    }
  }, [isAuthenticated, apiEntries]);

  // Get user's rank and points from API
  // For authenticated users, data is nested: response.data.data.your_rank
  // For public users, there's no your_rank field
  const yourRank = isAuthenticated
    ? userLeaderboardData?.data?.your_rank
    : null;

  const userEntry = apiEntries.find(
    (entry: LeaderboardEntry) => entry.rank === yourRank
  );
  const yourPoints =
    userEntry?.points && typeof userEntry.points === "string"
      ? parseInt(userEntry.points, 10)
      : null;

  // Map API data to component format
  const mapApiDataToLeaders = (entries: LeaderboardEntry[]) => {
    return entries.map((entry) => ({
      id: entry.id, // Include id for follow API
      rank: entry.rank || 0,
      name:
        `${entry.first_name || ""} ${entry.last_name || ""}`.trim() ||
        entry.email ||
        "Unknown",
      username: entry.username || `@${entry.email?.split("@")[0] || "user"}`,
      points: entry.points ? parseInt(entry.points, 10) : 0,
      tier: entry.tier || "Explorer",
      avatar:
        entry.profile_image ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${
          entry.first_name || entry.email || entry.id
        }`,
      type: entry.tier || "Collector", // Default type based on tier or use a field from API if available
      is_follow: entry.is_follow || false,
    }));
  };

  // Get leaders from API data (server-side filtering and pagination handled by API)
  // For authenticated users: response.data.data (nested)
  // For public users: response.data (direct array)
  const filteredLeaders =
    apiEntries && Array.isArray(apiEntries) && apiEntries.length > 0
      ? mapApiDataToLeaders(apiEntries)
      : [];

  // All filtering (including role/persona) is handled by the API
  const personaFilteredLeaders = filteredLeaders;

  // Use API pagination data if available, otherwise calculate from results
  // For authenticated users: response.data.data.total_count
  // For public users: response.data.total_count
  const totalCount = isAuthenticated
    ? userLeaderboardData?.data?.total_count ?? filteredLeaders.length
    : publicLeaderboardData?.total_count ?? filteredLeaders.length;

  const totalPages = isAuthenticated
    ? userLeaderboardData?.data?.all_page ??
      Math.ceil(totalCount / itemsPerPage)
    : publicLeaderboardData?.all_page ?? Math.ceil(totalCount / itemsPerPage);

  const currentLeaders = personaFilteredLeaders;

  // Calculate stats based on filtered time period
  // For authenticated users, use API stats if available
  const topTierCount =
    isAuthenticated &&
    userLeaderboardData?.data?.total_founding_patron !== undefined
      ? userLeaderboardData.data.total_founding_patron
      : filteredLeaders.filter(
          (l) => l.tier.includes("Founding") || l.tier.includes("مؤسس")
        ).length;

  const avgPoints =
    isAuthenticated && userLeaderboardData?.data?.average_points !== undefined
      ? Math.round(userLeaderboardData.data.average_points)
      : filteredLeaders.length > 0
      ? Math.round(
          filteredLeaders.reduce((sum, l) => sum + l.points, 0) /
            filteredLeaders.length
        )
      : 0;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Crown className="w-6 h-6 text-amber-400" />
          </motion.div>
        );
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="text-white/60">#{rank}</span>;
    }
  };

  const getTierColor = (tier: string) => {
    if (tier.includes("Founding") || tier.includes("مؤسس"))
      return "border-amber-500/50 text-amber-400 bg-amber-500/10";
    if (tier.includes("Ambassador") || tier.includes("سفير"))
      return "border-orange-500/50 text-orange-400 bg-orange-500/10";
    if (tier.includes("Curator") || tier.includes("منسق"))
      return "border-yellow-500/50 text-yellow-400 bg-yellow-500/10";
    return "border-blue-500/50 text-blue-400 bg-blue-500/10";
  };

  const getPersonaIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("artist") || lowerType.includes("فنان"))
      return <Palette className="w-4 h-4" />;
    if (lowerType.includes("gallery") || lowerType.includes("معرض"))
      return <Building2 className="w-4 h-4" />;
    if (lowerType.includes("collector") || lowerType.includes("جامع"))
      return <User className="w-4 h-4" />;
    return <User className="w-4 h-4" />;
  };

  const getPersonaBadgeColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("artist") || lowerType.includes("فنان"))
      return "border-purple-500/50 text-purple-400 bg-purple-500/10";
    if (lowerType.includes("gallery") || lowerType.includes("معرض"))
      return "border-teal-500/50 text-teal-400 bg-teal-500/10";
    if (lowerType.includes("collector") || lowerType.includes("جامع"))
      return "border-pink-500/50 text-pink-400 bg-pink-500/10";
    if (lowerType.includes("ambassador") || lowerType.includes("سفير"))
      return "border-orange-500/50 text-orange-400 bg-orange-500/10";
    return "border-white/20 text-white/60 bg-white/5";
  };

  // Content to be rendered (same for both cases)
  const leaderboardContent = (
    <>
      {/* Back Button - Only show when accessed from homepage */}
      {fromHomepage && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-4">
          <motion.button
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05, x: isRTL ? 5 : -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(ROUTES.HOME)}
            className={`flex items-center gap-2 glass px-6 py-3 rounded-full border border-[#ffcc33]/30 text-white hover:border-[#ffcc33]/50 transition-all cursor-pointer ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <ArrowLeft className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
            <span>
              {language === "en" ? "Back to Home" : "العودة للرئيسية"}
            </span>
          </motion.button>
        </div>
      )}

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}
      >
        <div
          className={`flex items-center gap-4 mb-4 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#ffcc33] to-[#45e3d3] rounded-xl flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6 text-[#0F021C]" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl">
              <span className="text-[#ffffff]">{t.title}</span>
            </h1>
            <p className="text-[#808c99] text-lg mt-1">{t.subtitle}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {/* Total Participants */}
        <div className="glass rounded-2xl p-6">
          <div
            className={`flex items-center justify-between mb-4 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#ffcc33] to-[#45e3d3] rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-[#0F021C]" />
            </div>
          </div>
          <motion.div
            key={`total-${totalCount}`}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl mb-2 bg-gradient-to-r from-[#ffcc33] via-[#ffb54d] to-[#ffcc33] bg-clip-text text-transparent"
          >
            {totalCount}
          </motion.div>
          <div className="text-[#808c99]">{t.stats.totalParticipants}</div>
        </div>

        {/* Top Tier */}
        <div className="glass rounded-2xl p-6">
          <div
            className={`flex items-center justify-between mb-4 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#ffcc33] to-[#45e3d3] rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-[#0F021C]" />
            </div>
          </div>
          <motion.div
            key={`tier-${topTierCount}`}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl mb-2 bg-gradient-to-r from-[#ffcc33] via-[#ffb54d] to-[#ffcc33] bg-clip-text text-transparent"
          >
            {topTierCount}
          </motion.div>
          <div className="text-[#808c99]">{t.stats.topTier}</div>
        </div>

        {/* Average Points */}
        <div className="glass rounded-2xl p-6">
          <div
            className={`flex items-center justify-between mb-4 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#ffcc33] to-[#45e3d3] rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#0F021C]" />
            </div>
          </div>
          <motion.div
            key={`avg-${avgPoints}`}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl mb-2 bg-gradient-to-r from-[#ffcc33] via-[#ffb54d] to-[#ffcc33] bg-clip-text text-transparent"
          >
            {avgPoints.toLocaleString()}
          </motion.div>
          <div className="text-[#808c99]">{t.stats.avgPoints}</div>
        </div>
      </motion.div>

      {/* Your Rank Card - Only show for authenticated users */}
      {isAuthenticated && yourRank !== null && yourRank !== undefined && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#1D112A]/80 via-[#1D112A]/70 to-[#0F021C]/80 border-2 border-[#ffcc33]/50 relative overflow-hidden shadow-xl shadow-[#ffcc33]/20"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#ffcc33]/15 via-[#45e3d3]/15 to-[#ffcc33]/15"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Zap className="w-6 h-6 text-yellow-400" />
              <span className="text-white text-lg">{t.yourRank}</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-orange-400 text-xl">#{yourRank}</span>
              {yourPoints !== null && (
                <>
                  <span className="text-white/60">•</span>
                  <span className="text-white text-lg">
                    {yourPoints.toLocaleString()} points
                  </span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Time Period Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        {/* All Time */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setTimeFilter("allTime")}
          className={`relative p-6 rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer ${
            timeFilter === "allTime"
              ? "bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-amber-600/20 border-2 border-amber-500"
              : "glass border border-white/10 hover:border-amber-500/30"
          }`}
        >
          {timeFilter === "allTime" && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-600/20"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          <div
            className={`relative z-10 flex items-start gap-4 ${
              isRTL ? "flex-row-reverse text-right" : "text-left"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                timeFilter === "allTime"
                  ? "bg-gradient-to-br from-amber-500 to-yellow-600"
                  : "bg-white/5"
              }`}
            >
              <Trophy
                className={`w-6 h-6 ${
                  timeFilter === "allTime" ? "text-black" : "text-amber-400"
                }`}
              />
            </div>
            <div className="flex-1">
              <div
                className={`text-lg mb-1 ${
                  timeFilter === "allTime" ? "text-amber-400" : "text-white/80"
                }`}
              >
                {t.timePeriods.allTime}
              </div>
              <div className="text-sm text-white/60">
                {language === "en" ? "Complete Rankings" : "التصنيف الكامل"}
              </div>
            </div>
            {timeFilter === "allTime" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4"
              >
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
              </motion.div>
            )}
          </div>
        </motion.button>

        {/* This Month */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setTimeFilter("thisMonth")}
          className={`relative p-6 rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer ${
            timeFilter === "thisMonth"
              ? "bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-amber-600/20 border-2 border-amber-500"
              : "glass border border-white/10 hover:border-amber-500/30"
          }`}
        >
          {timeFilter === "thisMonth" && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-600/20"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          <div
            className={`relative z-10 flex items-start gap-4 ${
              isRTL ? "flex-row-reverse text-right" : "text-left"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                timeFilter === "thisMonth"
                  ? "bg-gradient-to-br from-amber-500 to-yellow-600"
                  : "bg-white/5"
              }`}
            >
              <Calendar
                className={`w-6 h-6 ${
                  timeFilter === "thisMonth" ? "text-black" : "text-teal-400"
                }`}
              />
            </div>
            <div className="flex-1">
              <div
                className={`text-lg mb-1 ${
                  timeFilter === "thisMonth"
                    ? "text-amber-400"
                    : "text-white/80"
                }`}
              >
                {t.timePeriods.thisMonth}
              </div>
              <div className="text-sm text-white/60">
                {language === "en" ? "Monthly Leaders" : "قادة الشهر"}
              </div>
            </div>
            {timeFilter === "thisMonth" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4"
              >
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
              </motion.div>
            )}
          </div>
        </motion.button>

        {/* This Week */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setTimeFilter("thisWeek")}
          className={`relative p-6 rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer ${
            timeFilter === "thisWeek"
              ? "bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-amber-600/20 border-2 border-amber-500"
              : "glass border border-white/10 hover:border-amber-500/30"
          }`}
        >
          {timeFilter === "thisWeek" && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-600/20"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          <div
            className={`relative z-10 flex items-start gap-4 ${
              isRTL ? "flex-row-reverse text-right" : "text-left"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                timeFilter === "thisWeek"
                  ? "bg-gradient-to-br from-amber-500 to-yellow-600"
                  : "bg-white/5"
              }`}
            >
              <Zap
                className={`w-6 h-6 ${
                  timeFilter === "thisWeek" ? "text-black" : "text-purple-400"
                }`}
              />
            </div>
            <div className="flex-1">
              <div
                className={`text-lg mb-1 ${
                  timeFilter === "thisWeek" ? "text-amber-400" : "text-white/80"
                }`}
              >
                {t.timePeriods.thisWeek}
              </div>
              <div className="text-sm text-white/60">
                {language === "en" ? "Hot This Week" : "الأكثر نشاطاً"}
              </div>
            </div>
            {timeFilter === "thisWeek" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4"
              >
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
              </motion.div>
            )}
          </div>
        </motion.button>
      </motion.div>

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass rounded-2xl overflow-hidden"
      >
        {/* User Type Filter - Inside Table */}
        <div className="bg-white/5 border-b border-white/10 p-6">
          <div
            className={`flex flex-wrap items-center gap-3 ${
              isRTL ? "flex-row-reverse justify-end" : "justify-start"
            }`}
          >
            <span className="text-[#808c99] text-sm">{t.userType}:</span>
            {(Object.keys(t.personas) as PersonaFilter[]).map((persona) => (
              <motion.button
                key={persona}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPersonaFilter(persona)}
                className={`px-4 py-1.5 rounded-full text-sm transition-all duration-300 cursor-pointer ${
                  personaFilter === persona
                    ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black"
                    : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-amber-500/50"
                }`}
              >
                {t.personas[persona]}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Loading & Error States */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-[#ffcc33] animate-spin" />
            <span className="text-white/70">{t.loading}</span>
          </div>
        )}

        {!isLoading && isError && (
          <div className="flex items-center justify-center py-10">
            <span className="text-red-400 text-sm">{t.error}</span>
          </div>
        )}

        {!isLoading && !isError && personaFilteredLeaders.length === 0 && (
          <div className="flex items-center justify-center py-10">
            <span className="text-white/60 text-sm">{t.noData}</span>
          </div>
        )}

        {/* Mobile View */}
        {!isLoading && !isError && personaFilteredLeaders.length > 0 && (
          <div className="block lg:hidden p-6 space-y-3">
            {currentLeaders.map((leader, index) => (
              <motion.div
                key={`${timeFilter}-${personaFilter}-${leader.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#ffcc33]/30 transition-all"
              >
                <div
                  className={`flex items-center gap-4 mb-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex items-center justify-center w-12 shrink-0">
                    {getRankIcon(leader.rank)}
                  </div>
                  <Avatar className="w-12 h-12 border-2 border-[#ffcc33]/50">
                    <AvatarImage src={leader.avatar} alt={leader.name} />
                    <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}
                  >
                    <div className="text-white">{leader.name}</div>
                    <div className="text-white/60 text-sm flex items-center gap-2">
                      {leader.username}
                      {isAuthenticated && (
                        <>
                          <span className="text-white/40">•</span>
                          <span className="text-white/60">
                            {getFollowerCount(leader.username)} followers
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Follow Button - Only show when authenticated */}
                  {isAuthenticated && leader.id && (
                    <Button
                      size="sm"
                      onClick={() => toggleFollow(leader.id, leader.username)}
                      disabled={loadingUserId === leader.id || leader.is_follow}
                      variant={isFollowing(leader.username) || leader.is_follow ? "outline" : "default"}
                      className="shrink-0 cursor-pointer"
                    >
                      {loadingUserId === leader.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          {language === "en" ? "Loading..." : "جاري التحميل..."}
                        </>
                      ) : isFollowing(leader.username) || leader.is_follow ? (
                        <>
                          <UserCheck className="w-4 h-4 mr-1" />
                          {t.following}
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-1" />
                          {t.follow}
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <div
                  className={`flex items-center justify-between gap-2 flex-wrap ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Badge
                    variant="outline"
                    className={`${getPersonaBadgeColor(
                      leader.type
                    )} border text-xs`}
                  >
                    <span
                      className={`flex items-center gap-1 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      {getPersonaIcon(leader.type)}
                      {leader.type}
                    </span>
                  </Badge>
                  <div className="text-transparent bg-gradient-to-r from-[#ffcc33] to-[#45e3d3] bg-clip-text">
                    {leader.points.toLocaleString()}
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getTierColor(leader.tier)}`}
                  >
                    {leader.tier}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Desktop View */}
        {!isLoading && !isError && personaFilteredLeaders.length > 0 && (
          <div className="hidden lg:block">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-gradient-to-br from-[#1D112A]/95 via-[#1D112A]/95 to-[#0F021C]/95 backdrop-blur-sm">
                <tr className="bg-white/5 border-b border-white/10">
                  {t.columns.map((column, index) => (
                    <th
                      key={index}
                      className={`px-6 py-4 text-[#808c99] ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {column}
                    </th>
                  ))}
                  {isAuthenticated && (
                    <th
                      className={`px-6 py-4 text-[#808c99] ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {/* Follow column header - empty */}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentLeaders.map((leader, index) => (
                  <motion.tr
                    key={`${timeFilter}-${personaFilter}-${leader.name}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    whileHover={{
                      backgroundColor: "rgba(255, 204, 51, 0.05)",
                    }}
                    className="border-b border-white/5 last:border-0 transition-colors"
                  >
                    {/* Rank */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center w-12">
                        {getRankIcon(leader.rank)}
                      </div>
                    </td>

                    {/* User */}
                    <td className="px-6 py-4">
                      <div
                        className={`flex items-center gap-4 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Avatar className="w-10 h-10 border-2 border-[#ffcc33]/50">
                          <AvatarImage src={leader.avatar} alt={leader.name} />
                          <AvatarFallback>
                            {leader.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <div className="text-[#ffffff]">{leader.name}</div>
                          <div className="text-[#808c99] text-sm flex items-center gap-2">
                            {leader.username}
                            {isAuthenticated && (
                              <>
                                <span className="text-white/40">•</span>
                                <span className="text-white/60">
                                  {getFollowerCount(leader.username)} followers
                                </span>
                              </>
                            )}
                            <Badge
                              variant="outline"
                              className={`${getPersonaBadgeColor(
                                leader.type
                              )} border text-xs`}
                            >
                              <span
                                className={`flex items-center gap-1 ${
                                  isRTL ? "flex-row-reverse" : ""
                                }`}
                              >
                                {getPersonaIcon(leader.type)}
                                {leader.type}
                              </span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Points */}
                    <td className="px-6 py-4">
                      <span className="text-transparent bg-gradient-to-r from-[#ffcc33] to-[#45e3d3] bg-clip-text text-lg">
                        {leader.points.toLocaleString()}
                      </span>
                    </td>

                    {/* Tier */}
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={getTierColor(leader.tier)}
                      >
                        {leader.tier}
                      </Badge>
                    </td>

                    {/* Follow Button - Only show when authenticated */}
                    {isAuthenticated && leader.id && (
                      <td className="px-6 py-4">
                        <Button
                          size="sm"
                          onClick={() =>
                            toggleFollow(leader.id, leader.username)
                          }
                          disabled={
                            loadingUserId === leader.id || leader.is_follow
                          }
                          variant={isFollowing(leader.username) || leader.is_follow ? "outline" : "default"}
                          className="cursor-pointer"
                        >
                          {loadingUserId === leader.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              {language === "en"
                                ? "Loading..."
                                : "جاري التحميل..."}
                            </>
                          ) : isFollowing(leader.username) ||
                            leader.is_follow ? (
                            <>
                              <UserCheck className="w-4 h-4 mr-1" />
                              {t.following}
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-1" />
                              {t.follow}
                            </>
                          )}
                        </Button>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {!isLoading && !isError && personaFilteredLeaders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-full border border-[#ffcc33]/50 text-white/60 hover:text-white hover:border-[#ffcc33]/30 transition-all ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            } ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <ChevronLeft className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
          </motion.button>
          <div
            className={`mx-4 text-[#808c99] ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t.pagination.showing}{" "}
            {currentPage * itemsPerPage - itemsPerPage + 1} {t.pagination.to}{" "}
            {Math.min(currentPage * itemsPerPage, totalCount)} {t.pagination.of}{" "}
            {totalCount} {t.pagination.results}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-full border border-[#ffcc33]/50 text-white/60 hover:text-white hover:border-[#ffcc33]/30 transition-all ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            } ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <ChevronRight className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
          </motion.button>
        </motion.div>
      )}

      {/* Bottom Spacing */}
      <div className="h-20" />
    </>
  );

  // Conditionally render with or without DashboardLayout
  if (!showDashboardLayout) {
    // Render without dashboard layout (public access or from homepage)
    return (
      <div
        className="min-h-screen bg-[#0F021C] relative"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={bgImage}
            alt="Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F021C]/90 via-[#0F021C]/95 to-[#0F021C]" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen">
          <div
            className="container mx-auto px-4 pt-20 lg:pt-12 pb-12"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {leaderboardContent}
          </div>
        </div>
      </div>
    );
  }

  // Render with dashboard layout (authenticated user from dashboard)
  return (
    <DashboardLayout currentPage="leaderboard">
      {leaderboardContent}
    </DashboardLayout>
  );
}
