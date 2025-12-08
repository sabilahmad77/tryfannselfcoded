import { useState } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  Users,
  Heart,
  Share2,
  Trophy,
  Instagram,
  Video,
  Youtube,
  Twitter,
  Target,
  BarChart3,
  ArrowUpRight,
  UserPlus,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { DashboardLayout } from "../shared/DashboardLayout";
import { DashboardWelcome } from "../shared/DashboardWelcome";
import { TierProgress } from "../shared/TierProgress";
import { useLanguage } from "@/contexts/useLanguage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";
import { ROUTES } from "@/routes/paths";
import {
  useGetDashboardStatsAmbassadorQuery,
  useGenerateReferralCodeQuery,
} from "@/services/api/dashboardApi";

const content = {
  en: {
    welcome: "Welcome back",
    subtitle: "Track your performance and grow your influence",
    roles: {
      artist: "Artist",
      collector: "Collector",
      gallery: "Gallery",
      ambassador: "Ambassador",
    },
    stats: {
      totalReach: "Total Reach",
      engagement: "Engagement Rate",
      conversions: "Conversions",
      totalReferrals: "Total Referrals",
      followers: "Followers",
    },
    socialMetrics: {
      title: "Social Media Performance",
      lastUpdated: "Last updated 2 hours ago",
      engagement: "Engagement",
      posts: "Posts",
    },
    referrals: {
      title: "Referral Stats",
      total: "Total Referrals",
      active: "Active",
      thisWeek: "This Week",
      inviteFriends: "Invite Friends",
      linkCopied: "Link Copied!",
      rewards: "Rewards Points",
    },
    leaderboard: {
      title: "Leaderboard Position",
      rank: "Your Rank",
      viewFull: "View Full Leaderboard",
    },
  },
  ar: {
    welcome: "مرحباً بعودتك",
    subtitle: "تتبع أدائك وزد تأثيرك",
    roles: {
      artist: "فنان",
      collector: "جامع",
      gallery: "معرض",
      ambassador: "سفير",
    },
    stats: {
      totalReach: "إجمالي الوصول",
      engagement: "معدل التفاعل",
      conversions: "التحويلات",
      totalReferrals: "إجمالي الإحالات",
      followers: "المتابعون",
    },
    socialMetrics: {
      title: "أداء وسائل التواصل",
      lastUpdated: "آخر تحديث منذ ساعتين",
      engagement: "التفاعل",
      posts: "المنشورات",
    },
    referrals: {
      title: "إحصائيات الإحالة",
      total: "إجمالي الإحالات",
      active: "نشط",
      thisWeek: "هذا الأسبوع",
      inviteFriends: "دعوة الأصدقاء",
      linkCopied: "تم نسخ الرابط!",
      rewards: "نقاط المكافأة",
    },
    leaderboard: {
      title: "موقعك في لوحة المتصدرين",
      rank: "ترتيبك",
      viewFull: "عرض لوحة المتصدرين الكاملة",
    },
  },
};

export function AmbassadorDashboard() {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";
  const navigate = useNavigate();
  const storedUser = useSelector((state: RootState) => state.auth.user);
  const persona = useSelector((state: RootState) => state.auth.persona);

  // Get user name from stored data
  const userName = storedUser
    ? `${storedUser.first_name || ""} ${storedUser.last_name || ""}`.trim() ||
      storedUser.title ||
      storedUser.email ||
      "Ambassador"
    : "Ambassador";

  // Get user role for display
  const displayRoleRaw =
    storedUser?.role?.toLowerCase() || persona?.toLowerCase() || "ambassador";
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
    : "ambassador";
  const roleLabel = t.roles[displayRole] || t.roles.ambassador;

  const [referralLinkCopied, setReferralLinkCopied] = useState(false);

  // Fetch API data
  const { data: ambassadorStatsData, isLoading: isLoadingAmbassadorStats } =
    useGetDashboardStatsAmbassadorQuery();

  const { data: referralCodeData } = useGenerateReferralCodeQuery();

  // Extract data from API response
  const apiData = ambassadorStatsData?.data || {};

  const totalReferrals = apiData.referral_count || 0;
  const activeReferrals = apiData.active_referral_count || 0;
  const totalReach = apiData.total_reach || 0;
  const engagementRate = apiData.engagement_rate || 0;
  const conversions = apiData.conversation || 0; // Note: API uses "conversation" not "conversions"
  const rewardsPoints = apiData.rewards_point || 0; // Note: API uses singular "rewards_point"
  const followerCount = apiData.fann_platform_follower || 0;
  const userRank = apiData.your_rank ?? null;
  const totalAmbassadors = apiData.rank_out_of ?? 0;

  // Get referral link from referralCodeData API or fallback
  const referralLink =
    referralCodeData?.data?.referral_link ||
    (storedUser?.referral_code
      ? `https://tryfann.com/ref/${storedUser.referral_code}`
      : "https://tryfann.com");

  // Handle copying referral link
  const handleCopyReferralLink = () => {
    // Fallback method for clipboard copy
    const textArea = document.createElement("textarea");
    textArea.value = referralLink;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      setReferralLinkCopied(true);
      setTimeout(() => setReferralLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }

    document.body.removeChild(textArea);
  };

  // Build social media data from API
  const socialStatsData = apiData.social_stats;
  const socialStats = [
    {
      platform: "Instagram",
      icon: Instagram,
      color: "pink",
      followers: socialStatsData?.instagram_follower || "N/A",
      engagement: socialStatsData?.instagram_engagement
        ? `${socialStatsData.instagram_engagement}%`
        : "—",
      posts: socialStatsData?.instagram_post || 0,
      trend: "+12%", // Mock trend data
    },
    {
      platform: "TikTok",
      icon: Video,
      color: "cyan",
      followers: socialStatsData?.tiktok_follower || "N/A",
      engagement: socialStatsData?.tiktok_engagement
        ? `${socialStatsData.tiktok_engagement}%`
        : "—",
      posts: socialStatsData?.tiktok_post || 0,
      trend: "+24%", // Mock trend data
    },
    {
      platform: "YouTube",
      icon: Youtube,
      color: "red",
      followers: socialStatsData?.youtube_subscriber || "N/A",
      engagement: socialStatsData?.youtube_engagement
        ? `${socialStatsData.youtube_engagement}%`
        : "—",
      posts: socialStatsData?.youtube_post || 0,
      trend: "+8%", // Mock trend data
    },
    {
      platform: "Twitter",
      icon: Twitter,
      color: "blue",
      followers: socialStatsData?.twitter_follower || "N/A",
      engagement: socialStatsData?.twitter_engagement
        ? `${socialStatsData.twitter_engagement}%`
        : "—",
      posts: socialStatsData?.twitter_post || 0,
      trend: "+5%", // Mock trend data
    },
  ].filter((stat) => {
    // Show platform if it has followers data (not null/N/A) or has posts
    const hasFollowers = stat.followers && stat.followers !== "N/A";
    const hasPosts = stat.posts > 0;
    return hasFollowers || hasPosts;
  }); // Only show platforms with data

  return (
    <DashboardLayout currentPage="dashboard">
      {/* Welcome Section */}
      <DashboardWelcome
        userName={userName}
        subtitle={t.subtitle}
        roleLabel={roleLabel}
      />

      {/* Key Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <Card className="glass border-[#d4af37]/20 p-6 bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <p className="text-[#cbd5e1] text-sm">{t.stats.totalReach}</p>
              {isLoadingAmbassadorStats ? (
                <Loader2 className="w-5 h-5 text-[#d4af37] animate-spin mt-1" />
              ) : (
                <p className="text-2xl text-[#fef3c7]">
                  {totalReach >= 1000
                    ? `${(totalReach / 1000).toFixed(1)}K`
                    : totalReach.toFixed(1)}
                </p>
              )}
            </div>
          </div>
          {!isLoadingAmbassadorStats && (
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>+18%</span>
            </div>
          )}
        </Card>

        <Card className="glass border-[#d4af37]/20 p-6 bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-[#cbd5e1] text-sm">{t.stats.engagement}</p>
              {isLoadingAmbassadorStats ? (
                <Loader2 className="w-5 h-5 text-[#d4af37] animate-spin mt-1" />
              ) : (
                <p className="text-2xl text-[#fef3c7]">
                  {engagementRate > 0
                    ? `${engagementRate.toFixed(1)}%`
                    : "4.8%"}
                </p>
              )}
            </div>
          </div>
          {!isLoadingAmbassadorStats && (
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>+0.6%</span>
            </div>
          )}
        </Card>

        <Card className="glass border-[#d4af37]/20 p-6 bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-[#cbd5e1] text-sm">{t.stats.conversions}</p>
              {isLoadingAmbassadorStats ? (
                <Loader2 className="w-5 h-5 text-[#d4af37] animate-spin mt-1" />
              ) : (
                <p className="text-2xl text-[#fef3c7]">{conversions || 0}</p>
              )}
            </div>
          </div>
          {!isLoadingAmbassadorStats && (
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>+23%</span>
            </div>
          )}
        </Card>

        <Card className="glass border-[#d4af37]/20 p-6 bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-[#cbd5e1] text-sm">{t.stats.totalReferrals}</p>
              {isLoadingAmbassadorStats ? (
                <Loader2 className="w-5 h-5 text-[#d4af37] animate-spin mt-1" />
              ) : (
                <p className="text-2xl text-[#fef3c7]">{totalReferrals}</p>
              )}
            </div>
          </div>
          {!isLoadingAmbassadorStats && (
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>+5 {t.referrals.thisWeek}</span>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Tier Progress & Referral Stats Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Tier Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TierProgress />
        </motion.div>

        {/* Referral Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-[#d4af37]/20 p-6 bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 h-full">
            {/* Header */}
            <div
              className={`flex items-center gap-2 mb-6 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Share2 className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl text-[#fef3c7]">{t.referrals.title}</h2>
            </div>

            <div className="space-y-4">
              {isLoadingAmbassadorStats ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-[#d4af37] animate-spin" />
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <p className="text-[#cbd5e1] text-sm mb-1">
                      {t.referrals.total}
                    </p>
                    <p className="text-4xl text-[#fef3c7] mb-2">
                      {totalReferrals}
                    </p>
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+5 {t.referrals.thisWeek}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg glass border border-[#d4af37]/10">
                      <p className="text-[#cbd5e1] text-xs mb-1">
                        {t.referrals.active}
                      </p>
                      <p className="text-2xl text-[#fef3c7]">
                        {activeReferrals || totalReferrals}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg glass border border-[#d4af37]/10">
                      <p className="text-[#cbd5e1] text-xs mb-1">
                        {t.referrals.rewards}
                      </p>
                      <p className="text-2xl text-amber-400">
                        {rewardsPoints >= 1000
                          ? `${(rewardsPoints / 1000).toFixed(0)}K`
                          : rewardsPoints}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white cursor-pointer"
                onClick={handleCopyReferralLink}
              >
                {referralLinkCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {t.referrals.linkCopied}
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    {t.referrals.inviteFriends}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Social Media Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl text-[#fef3c7] flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
                {t.socialMetrics.title}
              </h2>
              <span className="text-[#64748b] text-sm">
                {t.socialMetrics.lastUpdated}
              </span>
            </div>

            <Card className="glass border-[#d4af37]/20 p-6 bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80">
              <div className="space-y-4">
                {socialStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.platform}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-lg glass border border-[#d4af37]/10 hover:border-[#d4af37]/20 transition-all"
                    >
                      <div
                        className={`w-12 h-12 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center shrink-0`}
                      >
                        <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-[#fef3c7] text-sm mb-1">
                            {stat.platform}
                          </p>
                          <p className="text-[#cbd5e1] text-xs">
                            {stat.followers}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#cbd5e1] text-xs mb-1">
                            {t.socialMetrics.engagement}
                          </p>
                          <p className="text-[#fef3c7] text-sm">
                            {stat.engagement}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#cbd5e1] text-xs mb-1">
                            {t.socialMetrics.posts}
                          </p>
                          <p className="text-[#fef3c7] text-sm">{stat.posts}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-green-400 text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>{stat.trend}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Followers Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="glass border-[#d4af37]/20 p-6 bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="text-lg text-[#fef3c7]">{t.stats.followers}</h3>
              </div>
              {isLoadingAmbassadorStats ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-[#d4af37] animate-spin" />
                </div>
              ) : (
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30">
                  <p className="text-5xl text-pink-400 mb-2">{followerCount}</p>
                  <p className="text-[#cbd5e1] text-sm">FANN Platform</p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Leaderboard Position */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl text-[#fef3c7] flex items-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-amber-400" />
              {t.leaderboard.title}
            </h2>

            <Card className="glass border-[#d4af37]/20 p-6 bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80">
              <div className="space-y-4">
                {isLoadingAmbassadorStats ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#d4af37] animate-spin" />
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-center">
                    <p className="text-[#cbd5e1] text-sm mb-1">
                      {t.leaderboard.rank}
                    </p>
                    <p className="text-5xl text-amber-400 mb-2">
                      {userRank ? `#${userRank}` : "—"}
                    </p>
                    <p className="text-[#cbd5e1] text-xs">
                      {language === "en"
                        ? `out of ${totalAmbassadors} ambassadors`
                        : `من أصل ${totalAmbassadors} سفير`}
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => navigate(ROUTES.LEADERBOARD)}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#d4af37] text-[#0a0612] cursor-pointer"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  {t.leaderboard.viewFull}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
