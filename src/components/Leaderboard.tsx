import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { Medal, Crown, Zap, Loader2, UserPlus, UserCheck, Palette, Building2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  useGetLeaderboardQuery,
  type LeaderboardEntry,
  type LeaderboardQueryParams,
} from "@/services/api/dashboardApi";
import type { RootState } from "@/store/store";

type TimeFilter = "allTime" | "thisMonth" | "thisWeek";

interface LeaderboardProps {
  language: "en" | "ar";
  onNavigateToSignUp?: () => void;
  onViewFullLeaderboard?: () => void;
}

const content = {
  en: {
    title: { white: "Global Leaderboard", gold: " Compete, Celebrate, and Connect" },
    subtitle: "Track your progress and see how you compare to other art pioneers. Our global leaderboard recognizes top artists, curators, and collectors based on their engagement and contributions. Compete for top spots and gain recognition on a global scale.",
    tabs: ["All Time", "This Month", "This Week"],
    columns: ["Rank", "User", "Role", "Tier", "Points"],
    viewAll: "View Full Leaderboard",
    yourRank: "Your Current Rank",
    leaders: [
      {
        rank: 1,
        name: "Sarah Al-Mansouri",
        username: "@sarahm",
        points: 8450,
        tier: "Founding Patron",
        role: "Artist",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      {
        rank: 2,
        name: "Michael Chen",
        username: "@mchen",
        points: 7230,
        tier: "Founding Patron",
        role: "Collector",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      },
      {
        rank: 3,
        name: "Layla Hassan",
        username: "@laylaart",
        points: 6890,
        tier: "Founding Patron",
        role: "Artist",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Layla",
      },
      {
        rank: 4,
        name: "James Rodriguez",
        username: "@jrodriguez",
        points: 5420,
        tier: "Founding Patron",
        role: "Gallery",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      },
      {
        rank: 5,
        name: "Fatima Al-Khalifa",
        username: "@fatimak",
        points: 4980,
        tier: "Ambassador",
        role: "Ambassador",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
      },
    ],
  },
  ar: {
    title: { white: "لوحة المتصدرين العالمية", gold: " تنافس واحتفل وتواصل" },
    subtitle: "تتبع تقدمك وشاهد كيف تقارن نفسك برواد الفن الآخرين. تعترف لوحة المتصدرين العالمية بأفضل الفنانين والمنسقين والجامعين بناءً على تفاعلهم ومساهماتهم. تنافس للحصول على المراكز الأولى واحصل على الاعتراف على نطاق عالمي.",
    tabs: ["كل الأوقات", "هذا الشهر", "هذا الأسبوع"],
    columns: ["الترتيب", "المستخدم", "الدور", "المستوى", "النقاط"],
    viewAll: "عرض لوحة المتصدرين الكاملة",
    yourRank: "ترتيبك الحالي",
    leaders: [
      {
        rank: 1,
        name: "سارة المنصوري",
        username: "@sarahm",
        points: 8450,
        tier: "راعي مؤسس",
        role: "فنانة",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      {
        rank: 2,
        name: "مايكل تشين",
        username: "@mchen",
        points: 7230,
        tier: "راعي مؤسس",
        role: "جامع",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      },
      {
        rank: 3,
        name: "ليلى حسن",
        username: "@laylaart",
        points: 6890,
        tier: "راعي مؤسس",
        role: "فنانة",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Layla",
      },
      {
        rank: 4,
        name: "جيمس رودريغيز",
        username: "@jrodriguez",
        points: 5420,
        tier: "راعي مؤسس",
        role: "معرض",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      },
      {
        rank: 5,
        name: "فاطمة الخليفة",
        username: "@fatimak",
        points: 4980,
        tier: "سفير",
        role: "سفير",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
      },
    ],
  },
};

export function Leaderboard({
  language,
  onViewFullLeaderboard,
}: LeaderboardProps) {
  const t = content[language];
  const isRTL = language === "ar";
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("allTime");
  const [follows, setFollows] = useState<Set<string>>(new Set());

  // Mock follower counts - will be replaced with API data after login
  const followerCounts: Record<string, number> = {
    "@sarahm": 245,
    "@mchen": 189,
    "@laylaart": 167,
    "@jrodriguez": 142,
    "@fatimak": 231,
  };

  const toggleFollow = (username: string) => {
    setFollows((prev) => {
      const newFollows = new Set(prev);
      if (newFollows.has(username)) {
        newFollows.delete(username);
      } else {
        newFollows.add(username);
      }
      return newFollows;
    });
  };

  const isFollowing = (username: string) => follows.has(username);
  const getFollowerCount = (username: string) => followerCounts[username] || 0;

  // Check authentication status
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // Map UI filter to API filter
  const mapTimeFilterToApi = (
    filter: TimeFilter
  ): "week" | "month" | "allTime" => {
    if (filter === "thisWeek") return "week";
    if (filter === "thisMonth") return "month";
    return "allTime";
  };

  // Prepare query parameters
  const queryParams: LeaderboardQueryParams = {
    filter: mapTimeFilterToApi(timeFilter),
    page: 1,
    page_size: 5, // Only show top 5
  };

  // Fetch leaderboard data from API with filter
  const {
    data: leaderboardData,
    isLoading,
    isError,
  } = useGetLeaderboardQuery(queryParams);

  // Map API data to component format
  // Always show top 5 records
  type EntryWithRoleHints = LeaderboardEntry & {
    role?: string | null;
    role_name?: string | null;
    user_type?: string | null;
    persona?: string | null;
  };

  const mapApiDataToLeaders = (apiEntries: LeaderboardEntry[]) => {
    return apiEntries.slice(0, 5).map((entry) => {
      const withHints = entry as EntryWithRoleHints;
      const rawRole =
        withHints.role ||
        withHints.role_name ||
        withHints.user_type ||
        withHints.persona ||
        "";

      const role =
        typeof rawRole === "string" && rawRole.trim().length > 0
          ? rawRole
          : "Collector";

      return {
        rank: entry.rank || 0,
        name:
          `${entry.first_name || ""} ${entry.last_name || ""}`.trim() ||
          entry.email ||
          "Unknown",
        username: entry.username || `@${entry.email?.split("@")[0] || "user"}`,
        points: entry.points ? parseInt(entry.points, 10) : 0,
        tier: entry.tier || "Explorer",
        role,
        avatar:
          entry.profile_image ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.first_name || entry.email || entry.id
          }`,
      };
    });
  };

  // Public leaderboard doesn't have your_rank field
  // Only authenticated users can see their rank (via user_leaderboard endpoint)
  const yourRank: number | null = null;
  const yourPoints: number | null = null;

  // Prefer API data; fall back to static content if API is unavailable or empty
  // API response structure: { data: LeaderboardEntry[], ... }
  const leaders =
    leaderboardData?.data &&
      Array.isArray(leaderboardData.data) &&
      leaderboardData.data.length > 0
      ? mapApiDataToLeaders(leaderboardData.data)
      : t.leaders;

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
        return <Medal className="w-6 h-6 text-[#B9BBC6]" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="text-[#B9BBC6]">#{rank}</span>;
    }
  };

  const getTierColor = (tier: string) => {
    if (tier.includes("Founding") || tier.includes("مؤسس"))
      return "border-amber-500/50 text-amber-400 bg-amber-500/10";
    if (tier.includes("Ambassador") || tier.includes("سفير"))
      return "border-orange-500/50 text-orange-400 bg-orange-500/10";
    if (tier.includes("Curator") || tier.includes("منسق"))
      return "border-yellow-500/50 text-yellow-400 bg-yellow-500/10";
    return "border-white/10 text-[#B9BBC6] bg-white/5";
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
    return "border-white/20 text-[#B9BBC6] bg-white/5";
  };

  return (
    <section
      className="relative py-16 overflow-hidden w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Subtle background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#C59B48]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#45e3d3]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 font-heading font-semibold px-2 sm:px-0">
            <span className="text-[#F2F2F3] font-heading font-semibold">{t.title.white}</span>
            <span className="text-[#C59B48] font-heading font-semibold">{t.title.gold}</span>
          </h2>
          <p className="text-[#B9BBC6] max-w-4xl mx-auto text-sm sm:text-base md:text-lg font-body font-normal px-4 sm:px-0">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 flex-wrap px-2 sm:px-0"
          >
            {t.tabs.map((tab, index) => {
              const filterValue: TimeFilter =
                index === 0
                  ? "allTime"
                  : index === 1
                    ? "thisMonth"
                    : "thisWeek";
              const isActive = timeFilter === filterValue;
              return (
                <motion.button
                  key={index}
                  onClick={() => setTimeFilter(filterValue)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full transition-all duration-300 text-xs sm:text-sm md:text-base ${isActive
                      ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black shadow-lg shadow-amber-500/50"
                      : "glass border border-white/10 text-[#B9BBC6] hover:text-white hover:border-amber-500/50"
                    }`}
                >
                  {tab}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Your Rank Card - Only show for authenticated users */}
          {isAuthenticated && yourRank !== null && yourRank !== undefined && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8 p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#191922]/80 via-[#191922]/70 to-[#0B0B0D]/80 border-2 border-[#C59B48]/50 relative overflow-hidden shadow-xl shadow-[#C59B48]/20"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#C59B48]/15 via-[#45e3d3]/15 to-[#C59B48]/15"
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
                  {yourRank !== null && yourRank !== undefined ? (
                    <>
                      <span className="text-orange-400 text-xl">
                        #{yourRank}
                      </span>
                      {yourPoints !== null && yourPoints !== undefined ? (
                        <>
                          <span className="text-[#B9BBC6]">•</span>
                          <span className="text-white text-lg">
                            {(yourPoints as number).toLocaleString()} points
                          </span>
                        </>
                      ) : null}
                    </>
                  ) : (
                    <span className="text-[#B9BBC6] text-lg">
                      {language === "en" ? "Not ranked yet" : "غير مصنف بعد"}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Leaderboard Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="rounded-3xl bg-[#191922] border border-[#2A2A3A] overflow-hidden shadow-2xl w-full"
          >
            {/* Loading & Error States */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-[#C59B48] animate-spin" />
                <span className="text-white/70">
                  {language === "en"
                    ? "Loading leaderboard..."
                    : "جاري تحميل لوحة المتصدرين..."}
                </span>
              </div>
            )}

            {!isLoading && isError && (
              <div className="flex items-center justify-center py-10">
                <span className="text-red-400 text-sm">
                  {language === "en"
                    ? "Unable to load leaderboard. Showing sample data."
                    : "تعذر تحميل لوحة المتصدرين. يتم عرض بيانات تجريبية."}
                </span>
              </div>
            )}

            {!isLoading && !leaders.length && (
              <div className="flex items-center justify-center py-10">
                <span className="text-[#B9BBC6] text-sm">
                  {language === "en"
                    ? "No leaderboard data available yet."
                    : "لا توجد بيانات للوحة المتصدرين حتى الآن."}
                </span>
              </div>
            )}

            {/* Mobile View */}
            {!isLoading && leaders.length > 0 && (
              <div className="block lg:hidden">
                {leaders.map((leader, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{
                      backgroundColor: "rgba(255, 204, 51, 0.08)",
                      scale: 1.01,
                    }}
                    className="p-4 sm:p-6 border-b border-[#C59B48]/10 last:border-0 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-8 sm:w-10 md:w-12 shrink-0">
                        {getRankIcon(leader.rank ?? index + 1)}
                      </div>

                      {/* Avatar & Info */}
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border-2 border-orange-500/50 shrink-0">
                        <AvatarImage src={leader.avatar} alt={leader.name} />
                        <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="text-white truncate text-sm sm:text-base">{leader.name}</div>
                        <div className="text-[#B9BBC6] text-xs sm:text-sm flex items-center gap-1 sm:gap-2 flex-wrap">
                          <span className="truncate">{leader.username}</span>
                          {isAuthenticated && (
                            <>
                              <span className="text-white/40">•</span>
                              <span className="text-[#B9BBC6]">
                                {getFollowerCount(leader.username)} followers
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right shrink-0">
                        <div className="text-transparent bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-sm sm:text-base">
                          {leader.points.toLocaleString()}
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs mt-1 sm:mt-2 ${getTierColor(
                            leader.tier
                          )}`}
                        >
                          {leader.tier}
                        </Badge>
                      </div>

                      {/* Follow Button - Only show when authenticated */}
                      {isAuthenticated && (
                        <Button
                          size="sm"
                          onClick={() => toggleFollow(leader.username)}
                          className={`shrink-0 text-xs sm:text-sm ${isFollowing(leader.username)
                              ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                              : "bg-gradient-to-r from-[#45e3d3] to-[#4de3ed] hover:from-[#3bc4b5] hover:to-[#3bc4b5] text-white"
                            }`}
                        >
                          {isFollowing(leader.username) ? (
                            <>
                              <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="hidden sm:inline">{language === "en" ? "Following" : "متابع"}</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="hidden sm:inline">{language === "en" ? "Follow" : "متابعة"}</span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Desktop View */}
            {!isLoading && leaders.length > 0 && (
              <div className="hidden lg:block overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      {t.columns.map((column, index) => (
                        <th
                          key={index}
                          className="px-8 py-5 text-left text-[#B9BBC6] text-sm"
                        >
                          {column}
                        </th>
                      ))}
                      {isAuthenticated && (
                        <th className="px-8 py-5 text-left text-[#B9BBC6] text-sm">
                          {/* Follow column header - empty for now */}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {leaders.map((leader, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{
                          backgroundColor: "rgba(168, 85, 247, 0.05)",
                        }}
                        className="border-b border-white/10 last:border-0 transition-colors"
                      >
                        {/* Rank */}
                        <td className="px-8 py-5">
                          <div className="flex items-center justify-center w-12">
                            {getRankIcon(leader.rank ?? index + 1)}
                          </div>
                        </td>

                        {/* User */}
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12 border-2 border-orange-500/50">
                              <AvatarImage
                                src={leader.avatar}
                                alt={leader.name}
                              />
                              <AvatarFallback>
                                {leader.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-white">{leader.name}</div>
                              <div className="text-[#B9BBC6] text-sm flex items-center gap-2">
                                {leader.username}
                                {isAuthenticated && (
                                  <>
                                    <span className="text-white/40">•</span>
                                    <span className="text-[#B9BBC6]">
                                      {getFollowerCount(leader.username)}{" "}
                                      followers
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-8 py-5">
                          <Badge
                            variant="outline"
                            className={`${getPersonaBadgeColor(
                              leader.role || "Collector"
                            )} border text-xs`}
                          >
                            <span className="flex items-center gap-1">
                              {getPersonaIcon(leader.role || "Collector")}
                              {leader.role || "Collector"}
                            </span>
                          </Badge>
                        </td>

                        {/* Tier */}
                        <td className="px-8 py-5">
                          <Badge
                            variant="outline"
                            className={getTierColor(leader.tier)}
                          >
                            {leader.tier}
                          </Badge>
                        </td>

                        {/* Points */}
                        <td className="px-8 py-5">
                          <span className="text-transparent bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-lg">
                            {leader.points.toLocaleString()}
                          </span>
                        </td>

                        {/* Follow Button - Only show when authenticated */}
                        {isAuthenticated && (
                          <td className="px-8 py-5">
                            <Button
                              size="sm"
                              onClick={() => toggleFollow(leader.username)}
                              className={`${isFollowing(leader.username)
                                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                                  : "bg-gradient-to-r from-[#45e3d3] to-[#4de3ed] hover:from-[#3bc4b5] hover:to-[#3bc4b5] text-white"
                                }`}
                            >
                              {isFollowing(leader.username) ? (
                                <>
                                  <UserCheck className="w-4 h-4 mr-1" />
                                  {language === "en" ? "Following" : "متابع"}
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-4 h-4 mr-1" />
                                  {language === "en" ? "Follow" : "متابعة"}
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

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewFullLeaderboard}
              className="text-transparent bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text hover:from-orange-300 hover:to-amber-300 transition-all cursor-pointer"
            >
              {t.viewAll} →
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
