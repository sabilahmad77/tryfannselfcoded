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
import { CompleteProfile } from "../shared/CompleteProfile";
import { PointWallet } from "../shared/PointWallet";
import { TierProgress } from "../shared/TierProgress";
import { URLEncoder } from "../shared/URLEncoder";
import { WatchVideos } from "../shared/WatchVideos";
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

  // Handler to navigate to profile completion
  const handleCompleteProfile = () => {
    navigate(ROUTES.PROFILE_COMPLETION);
  };

  // Get user name from stored data
  const userName = storedUser
    ? `${storedUser.first_name || ""} ${storedUser.last_name || ""}`.trim() ||
    storedUser.title ||
    storedUser.email ||
    "Ambassador"
    : "Ambassador";

  const [referralLinkCopied, setReferralLinkCopied] = useState(false);

  // Fetch API data
  const { data: ambassadorStatsData, isLoading: isLoadingAmbassadorStats } =
    useGetDashboardStatsAmbassadorQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  // Get profile_complete from API response
  const profileCompleted = ambassadorStatsData?.data?.profile_complete ?? false;

  const { data: referralCodeData } = useGenerateReferralCodeQuery();

  // Extract data from API response
  const apiData = ambassadorStatsData?.data || {};

  const totalReferrals = apiData.referral_count || 0;
  const activeReferrals = apiData.active_referral_count || 0;
  const totalReach = apiData.total_reach || 0;
  const engagementRate = apiData.engagement_rate || 0;
  const conversions = apiData.conversation || 0; // Note: API uses "conversation" not "conversions"
  const rewardsPoints = apiData.rewards_point || 0; // Note: API uses singular "rewards_point"
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
      bgClass: "bg-gradient-to-br from-[#8134af] via-[#dd2a7b] via-[#f58529] to-[#feda75]",
      iconColor: "text-white",
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
      bgClass: "bg-[#000000]",
      iconColor: "text-white",
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
      bgClass: "bg-[#FF0000]",
      iconColor: "text-white",
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
      bgClass: "bg-[#1DA1F2]",
      iconColor: "text-white",
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
      />

      {/* Complete Profile Section */}
      <CompleteProfile
        profileCompleted={profileCompleted ?? false}
        onCompleteProfile={handleCompleteProfile}
      />

      {/* Key Stats (Top Stats) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <Card className="glass border-[#ffcc33]/20 p-6 bg-gradient-to-br from-[#1D112A]/80 to-[#0F021C]/80">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <p className="text-[#808c99] text-sm">{t.stats.totalReach}</p>
              {isLoadingAmbassadorStats ? (
                <Loader2 className="w-5 h-5 text-[#ffcc33] animate-spin mt-1" />
              ) : (
                <p className="text-2xl text-[#ffffff]">
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

        <Card className="glass border-[#ffcc33]/20 p-6 bg-gradient-to-br from-[#1D112A]/80 to-[#0F021C]/80">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-[#808c99] text-sm">{t.stats.engagement}</p>
              {isLoadingAmbassadorStats ? (
                <Loader2 className="w-5 h-5 text-[#ffcc33] animate-spin mt-1" />
              ) : (
                <p className="text-2xl text-[#ffffff]">
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

        <Card className="glass border-[#ffcc33]/20 p-6 bg-gradient-to-br from-[#1D112A]/80 to-[#0F021C]/80">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-[#808c99] text-sm">{t.stats.conversions}</p>
              {isLoadingAmbassadorStats ? (
                <Loader2 className="w-5 h-5 text-[#ffcc33] animate-spin mt-1" />
              ) : (
                <p className="text-2xl text-[#ffffff]">{conversions || 0}</p>
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

        <Card className="glass border-[#ffcc33]/20 p-6 bg-gradient-to-br from-[#1D112A]/80 to-[#0F021C]/80">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-[#808c99] text-sm">{t.stats.totalReferrals}</p>
              {isLoadingAmbassadorStats ? (
                <Loader2 className="w-5 h-5 text-[#ffcc33] animate-spin mt-1" />
              ) : (
                <p className="text-2xl text-[#ffffff]">{totalReferrals}</p>
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

      {/* Point Wallet & Referral Link Generator (URL Encoder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PointWallet />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <URLEncoder />
        </motion.div>
      </div>

      {/* Watch & Earn + Social Media Performance in one row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Watch & Earn */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <WatchVideos />
        </motion.div>

        {/* Social Media Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="glass border-[#ffcc33]/20 p-6 bg-gradient-to-br from-[#1D112A]/80 to-[#0F021C]/80 h-full">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              <h3 className="text-2xl text-[#ffffff]">{t.socialMetrics.title}</h3>
              <span className="ml-auto text-[#808c99] text-sm">
                {t.socialMetrics.lastUpdated}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {socialStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.platform}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="p-5 rounded-lg glass border border-[#ffcc33]/10 hover:border-[#ffcc33]/30 transition-all bg-gradient-to-br from-[#0F021C]/50 to-[#1D112A]/50"
                  >
                    {/* Header Row */}
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#ffcc33]/10">
                      <div
                        className={`w-12 h-12 rounded-xl ${stat.bgClass} flex items-center justify-center`}
                      >
                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[#ffffff] text-lg">
                          {stat.platform}
                        </h4>
                        <p className="text-[#808c99] text-xs">
                          {stat.followers}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-green-400 text-sm px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                        <TrendingUp className="w-3 h-3" />
                        <span>{stat.trend}</span>
                      </div>
                    </div>

                    {/* Metrics Grid - Tile Layout */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-[#0F021C]/80 border border-[#ffcc33]/10 text-center">
                        <p className="text-[#808c99] text-xs mb-1">Followers</p>
                        <p className="text-[#ffffff]">{stat.followers}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-[#0F021C]/80 border border-[#ffcc33]/10 text-center">
                        <p className="text-[#808c99] text-xs mb-1">
                          {t.socialMetrics.engagement}
                        </p>
                        <p className="text-[#ffffff]">{stat.engagement}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-[#0F021C]/80 border border-[#ffcc33]/10 text-center">
                        <p className="text-[#808c99] text-xs mb-1">
                          {t.socialMetrics.posts}
                        </p>
                        <p className="text-[#ffffff]">{stat.posts}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Tier Progress & Referral Stats */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Tier Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <TierProgress />
        </motion.div>

        {/* Referral Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="glass border-[#ffcc33]/20 p-6 bg-gradient-to-br from-[#1D112A]/80 to-[#0F021C]/80 h-full">
            {/* Header */}
            <div
              className={`flex items-center gap-2 mb-6 ${isRTL ? "flex-row-reverse" : ""
                }`}
            >
              <Share2 className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl text-[#ffffff]">{t.referrals.title}</h2>
            </div>

            <div className="space-y-4">
              {isLoadingAmbassadorStats ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-[#ffcc33] animate-spin" />
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <p className="text-[#808c99] text-sm mb-1">
                      {t.referrals.total}
                    </p>
                    <p className="text-4xl text-[#ffffff] mb-2">
                      {totalReferrals}
                    </p>
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+5 {t.referrals.thisWeek}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-[#0f021c] border border-[#ffcc33]/10">
                      <p className="text-[#808c99] text-xs mb-1">
                        {t.referrals.active}
                      </p>
                      <p className="text-2xl text-[#ffffff]">
                        {activeReferrals || totalReferrals}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#0f021c] border border-[#ffcc33]/10">
                      <p className="text-[#808c99] text-xs mb-1">
                        {t.referrals.rewards}
                      </p>
                      <p className="text-2xl text-primary">
                        {rewardsPoints >= 1000
                          ? `${(rewardsPoints / 1000).toFixed(0)}K`
                          : rewardsPoints}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <Button
                className="w-full cursor-pointer"
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

      {/* Leaderboard Position */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Card className="glass border-[#ffcc33]/30 p-6 bg-gradient-to-br from-[#ffcc33]/10 via-amber-500/10 to-[#1D112A]/80 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffcc33]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/10 rounded-full blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#ffcc33]/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-[#ffcc33]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm text-[#ffffff]">
                    {t.leaderboard.title}
                  </h3>
                  <p className="text-xs text-[#808c99]">
                    {language === "en"
                      ? `out of ${totalAmbassadors} ambassadors`
                      : `من أصل ${totalAmbassadors} سفير`}
                  </p>
                </div>
              </div>

              {isLoadingAmbassadorStats ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-[#ffcc33] animate-spin" />
                </div>
              ) : (
                <>
                  <div className="text-center py-6 rounded-xl bg-gradient-to-br from-[#ffcc33]/20 to-amber-500/20 border border-[#ffcc33]/40 backdrop-blur-sm mb-4">
                    <p className="text-[#808c99] text-xs mb-2">
                      {t.leaderboard.rank}
                    </p>
                    <motion.div
                      className="relative inline-block"
                      initial={{ rotate: -10, scale: 0.5 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: 0.55, type: "spring" }}
                    >
                      <p className="text-7xl text-transparent bg-gradient-to-r from-[#ffcc33] via-yellow-400 to-[#ffcc33] bg-clip-text">
                        {userRank ? `#${userRank}` : "—"}
                      </p>
                      {userRank && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#ffcc33] rounded-full flex items-center justify-center">
                          <Trophy className="w-3 h-3 text-[#0F021C]" />
                        </div>
                      )}
                    </motion.div>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <ArrowUpRight className="w-4 h-4 text-green-400" />
                      <p className="text-green-400 text-xs">
                        +3 positions this week
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate(ROUTES.LEADERBOARD)}
                    className="w-full bg-gradient-to-r from-[#ffcc33] to-amber-500 hover:from-[#ffcc33]/90 hover:to-amber-600 text-[#0F021C] shadow-lg shadow-[#ffcc33]/20 cursor-pointer"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    {t.leaderboard.viewFull}
                  </Button>
                </>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
