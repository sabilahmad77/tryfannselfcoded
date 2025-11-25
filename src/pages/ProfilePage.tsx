import { motion } from "motion/react";
import {
  Mail,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Crown,
  Edit2,
  Camera,
  Share2,
  Flame,
  Shield,
  Star,
  Briefcase,
  Globe,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/contexts/useLanguage";
import { EditProfile } from "@/components/profile/EditProfile";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const content = {
  en: {
    profile: "Profile",
    editProfile: "Edit Profile",
    share: "Share Profile",
    about: "About",
    activity: "Activity",
    achievementsTab: "Achievements",
    stats: "Stats",
    tier: "Current Tier",
    memberSince: "Member Since",
    location: "Location",
    email: "Email",
    phone: "Phone",
    website: "Website",
    role: "Role",
    bio: "Bio",
    totalPoints: "Total Points",
    influencePoints: "Influence Points",
    provenancePoints: "Provenance Points",
    referrals: "Referrals",
    artworksSaved: "Artworks Saved",
    collectionsCreated: "Collections",
    progressToNext: "Progress to Next Tier",
    pointsNeeded: "points needed",
    recentActivity: [
      { action: "Completed profile setup", date: "2 hours ago", points: "+50" },
      { action: "Referred a new member", date: "1 day ago", points: "+100" },
      { action: "First artwork saved", date: "2 days ago", points: "+25" },
      { action: "Joined FANN", date: "3 days ago", points: "+25" },
    ],
    achievementsList: [
      {
        name: "Early Adopter",
        desc: "Joined during pre-launch",
        icon: Star,
        unlocked: true,
      },
      {
        name: "Social Butterfly",
        desc: "Referred 5+ members",
        icon: Share2,
        unlocked: true,
      },
      {
        name: "Curator Novice",
        desc: "Created first collection",
        icon: Award,
        unlocked: true,
      },
      {
        name: "Art Connoisseur",
        desc: "Saved 50+ artworks",
        icon: Crown,
        unlocked: false,
      },
      {
        name: "Master Curator",
        desc: "Created 10+ collections",
        icon: Briefcase,
        unlocked: false,
      },
      {
        name: "Ambassador",
        desc: "Reached Ambassador tier",
        icon: TrendingUp,
        unlocked: false,
      },
    ],
    tiers: {
      explorer: "Explorer",
      curator: "Curator",
      ambassador: "Ambassador",
      patron: "Founding Patron",
    },
  },
  ar: {
    profile: "الملف الشخصي",
    editProfile: "تعديل الملف",
    share: "مشاركة الملف",
    about: "حول",
    activity: "النشاط",
    achievementsTab: "الإنجازات",
    stats: "الإحصائيات",
    tier: "المستوى الحالي",
    memberSince: "عضو منذ",
    location: "الموقع",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    website: "الموقع الإلكتروني",
    role: "الدور",
    bio: "نبذة",
    totalPoints: "إجمالي النقاط",
    influencePoints: "نقاط التأثير",
    provenancePoints: "نقاط المصداقية",
    referrals: "الإحالات",
    artworksSaved: "الأعمال المحفوظة",
    collectionsCreated: "المجموعات",
    progressToNext: "التقدم للمستوى التالي",
    pointsNeeded: "نقطة مطلوبة",
    recentActivity: [
      { action: "إكمال إعداد الملف الشخصي", date: "منذ ساعتين", points: "+50" },
      { action: "إحالة عضو جديد", date: "منذ يوم", points: "+100" },
      { action: "حفظ أول عمل فني", date: "منذ يومين", points: "+25" },
      { action: "الانضمام إلى FANN", date: "منذ 3 أيام", points: "+25" },
    ],
    achievementsList: [
      {
        name: "المستخدم المبكر",
        desc: "انضم خلال مرحلة ما قبل الإطلاق",
        icon: Star,
        unlocked: true,
      },
      {
        name: "فراشة اجتماعية",
        desc: "أحال أكثر من 5 أعضاء",
        icon: Share2,
        unlocked: true,
      },
      {
        name: "منسق مبتدئ",
        desc: "أنشأ أول مجموعة",
        icon: Award,
        unlocked: true,
      },
      {
        name: "خبير فني",
        desc: "حفظ أكثر من 50 عمل فني",
        icon: Crown,
        unlocked: false,
      },
      {
        name: "منسق محترف",
        desc: "أنشأ أكثر من 10 مجموعات",
        icon: Briefcase,
        unlocked: false,
      },
      {
        name: "سفير",
        desc: "وصل إلى مستوى السفير",
        icon: TrendingUp,
        unlocked: false,
      },
    ],
    tiers: {
      explorer: "مستكشف",
      curator: "منسق",
      ambassador: "سفير",
      patron: "راعي مؤسس",
    },
  },
};

export function ProfilePage() {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const persona = useSelector((state: RootState) => state.auth.persona) as
    | string
    | null;
  const storedUser = useSelector((state: RootState) => state.auth.user);

  // Format date helper
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === "en" ? "en-US" : "ar-SA", {
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Get website URL - handle both string and array formats
  const getWebsite = (website: string[] | string | null | undefined) => {
    if (!website) return "";
    if (Array.isArray(website)) {
      return website.length > 0 ? website[0] : "";
    }
    return website;
  };

  // Use stored user data or fallback to mock data
  const userData = storedUser
    ? {
        name:
          `${storedUser.first_name || ""} ${
            storedUser.last_name || ""
          }`.trim() ||
          storedUser.title ||
          storedUser.email,
        username: storedUser.email.split("@")[0] || "",
        email: storedUser.email,
        phone: storedUser.phone_number || "",
        location: storedUser.location || "",
        website: getWebsite(storedUser.website),
        role: storedUser.role || "",
        bio: storedUser.bio || "",
        memberSince: formatDate(storedUser.date_joined),
        tier: t.tiers.explorer, // You can map points to tier if needed
        totalPoints: parseInt(storedUser.points || "0", 10),
        influencePoints: Math.floor(
          parseInt(storedUser.points || "0", 10) * 0.6
        ), // Mock calculation
        provenancePoints: Math.floor(
          parseInt(storedUser.points || "0", 10) * 0.4
        ), // Mock calculation
        referrals: storedUser.total_referral_clicks || 0,
        artworksSaved: 0, // Not in API response, can be fetched separately
        collections: 0, // Not in API response, can be fetched separately
        // Additional fields for edit profile
        title: storedUser.title || "",
        focus: storedUser.focus || "",
        years_of_experience: storedUser.years_of_experience
          ? String(storedUser.years_of_experience)
          : "",
        instagram_handle: storedUser.instagram_handle || "",
        profile_image: storedUser.profile_image,
      }
    : {
        // Fallback mock data if user is not loaded
        name: "User",
        username: "@user",
        email: "",
        phone: "",
        location: "",
        website: "",
        role: "",
        bio: "",
        memberSince: "",
        tier: t.tiers.explorer,
        totalPoints: 0,
        influencePoints: 0,
        provenancePoints: 0,
        referrals: 0,
        artworksSaved: 0,
        collections: 0,
        title: "",
        focus: "",
        years_of_experience: "",
        instagram_handle: "",
        profile_image: null,
      };

  const nextTierPoints = 500;
  const progress = (userData.totalPoints / nextTierPoints) * 100;
  const pointsNeeded = nextTierPoints - userData.totalPoints;

  return (
    <DashboardLayout currentPage="profile">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 mb-6"
      >
        <div
          className={`flex flex-col md:flex-row gap-6 ${
            isRTL ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Avatar */}
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-[#d4af37]">
              <AvatarImage
                src={userData.profile_image || ""}
                alt={userData.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-[#d4af37] to-[#14b8a6] text-[#0f172a] text-3xl">
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
            <button
              className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-br from-[#d4af37] to-[#14b8a6] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              aria-label={
                language === "en"
                  ? "Change profile picture"
                  : "تغيير صورة الملف الشخصي"
              }
            >
              <Camera className="w-5 h-5 text-[#0f172a]" />
            </button>
          </div>

          {/* Profile Info */}
          <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
            <div
              className={`flex items-start justify-between mb-4 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div>
                <h1 className="text-3xl text-[#fef3c7] mb-1">
                  {userData.name}
                </h1>
                <p className="text-[#cbd5e1] mb-3">
                  {userData.username ? `@${userData.username}` : userData.email}
                </p>
                <Badge className="bg-gradient-to-r from-[#d4af37] to-[#fbbf24] text-[#0f172a] border-0">
                  <Crown className="w-3 h-3 mr-1" />
                  {userData.tier}
                </Badge>
              </div>
              <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Button
                  variant="outline"
                  className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 hover:text-white cursor-pointer"
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  {t.editProfile}
                </Button>
                <Button
                  variant="outline"
                  className="border-[#14b8a6] text-[#14b8a6] hover:bg-[#14b8a6]/10"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <p className="text-[#cbd5e1] mb-4">{userData.bio}</p>

            {/* Quick Stats */}
            <div
              className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <div className="bg-[#1e293b]/50 rounded-lg p-3">
                <p className="text-2xl text-[#d4af37]">
                  {userData.totalPoints}
                </p>
                <p className="text-xs text-[#cbd5e1]">{t.totalPoints}</p>
              </div>
              <div className="bg-[#1e293b]/50 rounded-lg p-3">
                <p className="text-2xl text-[#fef3c7]">{userData.referrals}</p>
                <p className="text-xs text-[#cbd5e1]">{t.referrals}</p>
              </div>
              <div className="bg-[#1e293b]/50 rounded-lg p-3">
                <p className="text-2xl text-[#fef3c7]">
                  {userData.artworksSaved}
                </p>
                <p className="text-xs text-[#cbd5e1]">{t.artworksSaved}</p>
              </div>
              <div className="bg-[#1e293b]/50 rounded-lg p-3">
                <p className="text-2xl text-[#fef3c7]">
                  {userData.collections}
                </p>
                <p className="text-xs text-[#cbd5e1]">{t.collectionsCreated}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div
            className={`flex items-center justify-between mb-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <span className="text-sm text-[#cbd5e1]">
              {t.progressToNext} {t.tiers.curator}
            </span>
            <span className="text-sm text-[#d4af37]">
              {pointsNeeded} {t.pointsNeeded}
            </span>
          </div>
          <Progress value={progress} className="h-3 bg-[#334155]" />
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="about" className="w-full" dir={isRTL ? "rtl" : "ltr"}>
        <TabsList className="glass border border-[#334155] mb-6">
          <TabsTrigger value="about">{t.about}</TabsTrigger>
          <TabsTrigger value="activity">{t.activity}</TabsTrigger>
          <TabsTrigger value="achievements">{t.achievementsTab}</TabsTrigger>
          <TabsTrigger value="stats">{t.stats}</TabsTrigger>
        </TabsList>

        {/* About Tab */}
        <TabsContent value="about">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`flex items-center gap-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="w-12 h-12 bg-[#1e293b] rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-[#d4af37]" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-xs text-[#cbd5e1]">{t.email}</p>
                  <p className="text-[#fef3c7]">{userData.email}</p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="w-12 h-12 bg-[#1e293b] rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-[#14b8a6]" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-xs text-[#cbd5e1]">{t.phone}</p>
                  <p className="text-[#fef3c7]">{userData.phone}</p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="w-12 h-12 bg-[#1e293b] rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#8b5cf6]" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-xs text-[#cbd5e1]">{t.location}</p>
                  <p className="text-[#fef3c7]">{userData.location}</p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="w-12 h-12 bg-[#1e293b] rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-[#0ea5e9]" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-xs text-[#cbd5e1]">{t.website}</p>
                  <p className="text-[#fef3c7]">{userData.website}</p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="w-12 h-12 bg-[#1e293b] rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-[#fbbf24]" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-xs text-[#cbd5e1]">{t.role}</p>
                  <p className="text-[#fef3c7]">{userData.role}</p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div className="w-12 h-12 bg-[#1e293b] rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#ec4899]" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-xs text-[#cbd5e1]">{t.memberSince}</p>
                  <p className="text-[#fef3c7]">{userData.memberSince}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6"
          >
            <div className="space-y-4">
              {t.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 bg-[#1e293b]/50 rounded-lg border border-[#334155] hover:border-[#d4af37]/30 transition-all ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex items-center gap-4 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-[#14b8a6] rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-[#0f172a]" />
                    </div>
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className="text-[#fef3c7]">{activity.action}</p>
                      <p className="text-sm text-[#cbd5e1]">{activity.date}</p>
                    </div>
                  </div>
                  <Badge className="bg-[#14b8a6]/20 text-[#14b8a6] border-[#14b8a6]/30">
                    {activity.points}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.achievementsList.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`p-6 rounded-xl border transition-all ${
                      achievement.unlocked
                        ? "bg-gradient-to-br from-[#d4af37]/20 to-[#14b8a6]/20 border-[#d4af37]/30"
                        : "bg-[#1e293b]/30 border-[#334155] opacity-60"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-3 mb-3 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          achievement.unlocked
                            ? "bg-gradient-to-br from-[#d4af37] to-[#14b8a6]"
                            : "bg-[#334155]"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            achievement.unlocked
                              ? "text-[#0f172a]"
                              : "text-[#475569]"
                          }`}
                        />
                      </div>
                      {achievement.unlocked && (
                        <Badge className="bg-[#14b8a6] text-white border-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <h3
                      className={`text-[#fef3c7] mb-1 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {achievement.name}
                    </h3>
                    <p
                      className={`text-sm text-[#cbd5e1] ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {achievement.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Point Distribution */}
              <div className="bg-[#1e293b]/50 rounded-xl p-6">
                <h3
                  className={`text-xl text-[#fef3c7] mb-4 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {language === "en" ? "Point Distribution" : "توزيع النقاط"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <div
                      className={`flex items-center justify-between mb-2 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Flame className="w-5 h-5 text-[#8b5cf6]" />
                        <span className="text-[#cbd5e1]">
                          {t.influencePoints}
                        </span>
                      </div>
                      <span className="text-[#fef3c7]">
                        {userData.influencePoints}
                      </span>
                    </div>
                    <Progress
                      value={
                        (userData.influencePoints / userData.totalPoints) * 100
                      }
                      className="h-2 bg-[#334155]"
                    />
                  </div>
                  <div>
                    <div
                      className={`flex items-center justify-between mb-2 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Shield className="w-5 h-5 text-[#0ea5e9]" />
                        <span className="text-[#cbd5e1]">
                          {t.provenancePoints}
                        </span>
                      </div>
                      <span className="text-[#fef3c7]">
                        {userData.provenancePoints}
                      </span>
                    </div>
                    <Progress
                      value={
                        (userData.provenancePoints / userData.totalPoints) * 100
                      }
                      className="h-2 bg-[#334155]"
                    />
                  </div>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="bg-[#1e293b]/50 rounded-xl p-6">
                <h3
                  className={`text-xl text-[#fef3c7] mb-4 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {language === "en" ? "Engagement" : "التفاعل"}
                </h3>
                <div className="space-y-4">
                  <div
                    className={`flex items-center justify-between ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span className="text-[#cbd5e1]">{t.referrals}</span>
                    <span className="text-2xl text-[#d4af37]">
                      {userData.referrals}
                    </span>
                  </div>
                  <div
                    className={`flex items-center justify-between ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span className="text-[#cbd5e1]">{t.artworksSaved}</span>
                    <span className="text-2xl text-[#14b8a6]">
                      {userData.artworksSaved}
                    </span>
                  </div>
                  <div
                    className={`flex items-center justify-between ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span className="text-[#cbd5e1]">
                      {t.collectionsCreated}
                    </span>
                    <span className="text-2xl text-[#0ea5e9]">
                      {userData.collections}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <EditProfile
        open={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        language={language}
        initialData={{
          title: userData.title,
          bio: userData.bio,
          website:
            userData.website && !userData.website.startsWith("http")
              ? `https://${userData.website}`
              : userData.website,
          instagram_handle: userData.instagram_handle,
          focus: userData.focus,
          years_of_experience: userData.years_of_experience,
          profile_image: userData.profile_image || null,
          persona: persona || storedUser?.role?.toLowerCase() || "collector",
        }}
      />
    </DashboardLayout>
  );
}
