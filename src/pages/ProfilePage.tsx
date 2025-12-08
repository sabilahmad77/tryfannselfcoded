import { DashboardLayout } from "@/components/dashboard/shared/DashboardLayout";
import { EditKYC } from "@/components/profile/EditKYC";
import { EditProfile } from "@/components/profile/EditProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/useLanguage";
import { ROUTES } from "@/routes/paths";
import { useGetUserDetailsQuery } from "@/services/api/authApi";
import {
  useGetDashboardStatsQuery,
  useGetProgressionQuery,
} from "@/services/api/dashboardApi";
import { setUser, type UserProfileData } from "@/store/authSlice";
import { selectSubmittedData } from "@/store/onboardingSlice";
import type { RootState } from "@/store/store";
import { getTierInfo } from "@/utils/tierSystem";
import {
  Award,
  Briefcase,
  Calendar,
  Crown,
  Edit2,
  FileText,
  Flame,
  Globe,
  Hash,
  Mail,
  MapPin,
  Phone,
  Share2,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

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
    followers: "Followers",
    artworksSaved: "Artworks Saved",
    collectionsCreated: "Collections",
    progressToNext: "Progress to Next Tier",
    pointsNeeded: "points needed",
    kyc: "KYC Verification",
    kycStatus: "Verification Status",
    idNumber: "ID Number",
    dateOfBirth: "Date of Birth",
    nationality: "Nationality",
    postalCode: "Postal Code",
    documents: "Documents",
    idDocument: "Government ID",
    proofOfAddress: "Proof of Address",
    verified: "Verified",
    pending: "Pending",
    notSubmitted: "Not Submitted",
    editKYC: "Edit KYC",
    addKYC: "Add KYC Information",
    kycNotSubmitted: "KYC verification not completed",
    kycNotSubmittedDesc:
      "Complete your identity verification to enable full platform access",
    recentActivity: [
      { action: "Completed profile setup", points: "+50" },
      { action: "Referred a new member", points: "+100" },
      { action: "First artwork saved", points: "+25" },
      { action: "Joined FANN", points: "+25" },
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
    followers: "المتابعين",
    artworksSaved: "الأعمال المحفوظة",
    collectionsCreated: "المجموعات",
    progressToNext: "التقدم للمستوى التالي",
    pointsNeeded: "نقطة مطلوبة",
    kyc: "التحقق من الهوية",
    kycStatus: "حالة التحقق",
    idNumber: "رقم الهوية",
    dateOfBirth: "تاريخ الميلاد",
    nationality: "الجنسية",
    postalCode: "الرمز البريدي",
    documents: "المستندات",
    idDocument: "هوية حكومية",
    proofOfAddress: "إثبات العنوان",
    verified: "تم التحقق",
    pending: "قيد الانتظار",
    notSubmitted: "لم يتم الإرسال",
    editKYC: "تعديل التحقق من الهوية",
    addKYC: "إضافة معلومات التحقق من الهوية",
    kycNotSubmitted: "لم يتم إكمال التحقق من الهوية",
    kycNotSubmittedDesc: "أكمل التحقق من هويتك لتمكين الوصول الكامل إلى المنصة",
    recentActivity: [
      { action: "إكمال إعداد الملف الشخصي", points: "+50" },
      { action: "إحالة عضو جديد", points: "+100" },
      { action: "حفظ أول عمل فني", points: "+25" },
      { action: "الانضمام إلى FANN", points: "+25" },
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
  const dispatch = useDispatch();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditKYCOpen, setIsEditKYCOpen] = useState(false);
  const persona = useSelector((state: RootState) => state.auth.persona) as
    | string
    | null;
  const storedUser = useSelector((state: RootState) => state.auth.user);

  // Fetch user details from API
  const { data: userDetailsData } = useGetUserDetailsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Update Redux store with user and KYC data from API response
  useEffect(() => {
    if (userDetailsData) {
      // Handle the API response structure: { success, status_code, message, data: { user, kyc_verification, ... } }
      // RTK Query might return the raw response or transformed data, so check both structures
      const responseData = userDetailsData as {
        success?: boolean;
        status_code?: number;
        message?: unknown;
        data?: {
          user?: UserProfileData;
          kyc_verification?: {
            id?: number;
            id_number?: string;
            dob?: string;
            nationality?: string;
            city?: string;
            postal_code?: string;
            gov_issued_id?: string | null;
            proof_address?: string | null;
          };
          [key: string]: unknown;
        };
        // Fallback: if data is User directly
        id?: number;
        email?: string;
        [key: string]: unknown;
      };

      // Check if response has the wrapped structure with data.user
      if (responseData.data?.user) {
        const userData = responseData.data.user;
        const kycVerification = responseData.data.kyc_verification;

        // Merge KYC data into user object if it exists
        const updatedUser: UserProfileData = {
          ...userData,
          // Add KYC fields to user object (using type assertion since they're not in the interface)
          ...({
            kyc_id_number: kycVerification?.id_number,
            kyc_dob: kycVerification?.dob,
            kyc_nationality: kycVerification?.nationality,
            kyc_city: kycVerification?.city,
            kyc_postal_code: kycVerification?.postal_code,
            kyc_gov_issued_id: kycVerification?.gov_issued_id || null,
            kyc_proof_address: kycVerification?.proof_address || null,
          } as Partial<UserProfileData>),
        };

        dispatch(setUser(updatedUser));
      }
      // Note: If response doesn't match wrapped structure, it might be transformed by RTK Query
      // In that case, userDetailsData should already be the User object directly
    }
  }, [userDetailsData, dispatch]);

  // Get KYC data from user object first, fallback to onboarding slice for backward compatibility
  const kycDataFromUser = storedUser
    ? ({
        id_number: (storedUser as { kyc_id_number?: string }).kyc_id_number,
        dob: (storedUser as { kyc_dob?: string }).kyc_dob,
        nationality: (storedUser as { kyc_nationality?: string })
          .kyc_nationality,
        city: (storedUser as { kyc_city?: string }).kyc_city,
        postal_code: (storedUser as { kyc_postal_code?: string })
          .kyc_postal_code,
        gov_issued_id: (storedUser as { kyc_gov_issued_id?: string | null })
          .kyc_gov_issued_id,
        proof_address: (storedUser as { kyc_proof_address?: string | null })
          .kyc_proof_address,
      } as {
        id_number?: string;
        dob?: string;
        nationality?: string;
        city?: string;
        postal_code?: string;
        gov_issued_id?: string | null;
        proof_address?: string | null;
      })
    : undefined;
  const kycDataFromOnboarding = useSelector((state: RootState) =>
    selectSubmittedData(state, "kyc")
  ) as
    | {
        id_number?: string;
        dob?: string;
        nationality?: string;
        city?: string;
        postal_code?: string;
        gov_issued_id?: string;
        proof_address?: string;
      }
    | undefined;
  // Use KYC data from user object if available, otherwise fallback to onboarding data
  const kycData =
    kycDataFromUser && (kycDataFromUser.id_number || kycDataFromUser.dob)
      ? kycDataFromUser
      : kycDataFromOnboarding;

  // Fetch dashboard stats from API (must be called before any conditional returns)
  const { data: dashboardStatsData } = useGetDashboardStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Fetch progression data for tier calculation
  const { data: progressionData } = useGetProgressionQuery();

  // Calculate progression tiers (must be before conditional returns)
  const progressionTiers = useMemo(
    () => progressionData?.data || [],
    [progressionData?.data]
  );

  // Calculate total points for tier calculation (before conditional returns)
  const totalPoints =
    dashboardStatsData?.data?.total_points ??
    parseInt(storedUser?.points || "0", 10) ??
    0;

  // Calculate tier information using shared utility (before conditional returns)
  const tierInfo =
    progressionTiers.length > 0
      ? getTierInfo(totalPoints, progressionTiers)
      : null;
  const currentTierName = tierInfo
    ? t.tiers[tierInfo.currentTier as keyof typeof t.tiers]
    : t.tiers.explorer;
  const nextTierName = tierInfo?.nextTier
    ? t.tiers[tierInfo.nextTier as keyof typeof t.tiers]
    : null;
  const progress = tierInfo?.progress ?? 0;
  const pointsNeeded = tierInfo?.pointsNeeded ?? 0;

  // Redirect if profile visibility is disabled
  // This prevents users from accessing the profile page even by manual URL navigation
  if (storedUser?.profile_visibility === false) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

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

  // Get profile image URL - handle null, relative paths, and full URLs
  const getProfileImageUrl = (
    profileImage: string | null | undefined
  ): string | undefined => {
    // Return undefined if profile image is null/empty to trigger Avatar fallback
    if (!profileImage || profileImage.trim() === "") {
      return undefined;
    }

    // If it's already a full URL (starts with http:// or https://), return as is
    if (
      profileImage.startsWith("http://") ||
      profileImage.startsWith("https://")
    ) {
      return profileImage;
    }

    // Get base URL and remove /api suffix if present
    const BASE_URL =
      import.meta.env.VITE_API_BASE_URL ||
      "https://apifann.globaltechserivce.com/api";
    const baseWithoutApi = BASE_URL.replace(/\/api$/, "");

    // If it's a relative path (starts with /), prepend base URL without /api
    if (profileImage.startsWith("/")) {
      return `${baseWithoutApi}${profileImage}`;
    }

    // Otherwise, treat as relative path and prepend base URL with /
    return `${baseWithoutApi}/${profileImage}`;
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
        totalPoints,
        influencePoints:
          dashboardStatsData?.data?.influence_points ??
          Math.floor(parseInt(storedUser.points || "0", 10) * 0.6),
        provenancePoints:
          dashboardStatsData?.data?.provenance_points ??
          Math.floor(parseInt(storedUser.points || "0", 10) * 0.4),
        referrals:
          dashboardStatsData?.data?.referral_count ??
          storedUser.total_referral_clicks ??
          0,
        followers: dashboardStatsData?.data?.user_followers ?? 0,
        artworksSaved: dashboardStatsData?.data?.artwork_count ?? 0,
        collections: dashboardStatsData?.data?.collection_count ?? 0,
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
        totalPoints: 0,
        influencePoints: 0,
        provenancePoints: 0,
        referrals: 0,
        followers: 0,
        artworksSaved: 0,
        collections: 0,
        title: "",
        focus: "",
        years_of_experience: "",
        instagram_handle: "",
        profile_image: null,
      };

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
                src={getProfileImageUrl(userData.profile_image)}
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
                  {currentTierName}
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
              </div>
            </div>

            <p className="text-[#cbd5e1] mb-4">{userData.bio}</p>

            {/* Quick Stats */}
            <div
              className={`grid grid-cols-2 md:grid-cols-5 gap-4 ${
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
                <p className="text-2xl text-[#fef3c7]">{userData.followers}</p>
                <p className="text-xs text-[#cbd5e1]">{t.followers}</p>
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
          {nextTierName ? (
            <>
              <div
                className={`flex items-center justify-between mb-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <span className="text-sm text-[#cbd5e1]">
                  {t.progressToNext} {nextTierName}
                </span>
                <span className="text-sm text-[#d4af37]">
                  {pointsNeeded} {t.pointsNeeded}
                </span>
              </div>
              <Progress value={progress} className="h-3 bg-[#334155]" />
            </>
          ) : (
            <>
              <div
                className={`flex items-center justify-between mb-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <span className="text-sm text-[#cbd5e1]">
                  {language === "en"
                    ? "Maximum tier reached!"
                    : "تم الوصول إلى أعلى مستوى!"}
                </span>
                <span className="text-sm text-[#d4af37]">100%</span>
              </div>
              <Progress value={100} className="h-3 bg-[#334155]" />
            </>
          )}
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
              {/* Email - only show if show_email is true */}
              {storedUser?.show_email === true && (
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
              )}

              {/* Phone - only show if show_phone is true */}
              {storedUser?.show_phone === true && (
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
              )}

              {/* Location - only show if show_location is true */}
              {storedUser?.show_location === true && (
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
              )}

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

            {/* KYC Verification Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 pt-8 border-t border-[#334155]"
            >
              <div
                className={`flex items-center justify-between mb-6 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex items-center gap-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-12 h-12 bg-[#1e293b] rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#14b8a6]" />
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <h3 className="text-lg text-[#fef3c7]">{t.kyc}</h3>
                    <p className="text-xs text-[#cbd5e1]">
                      {kycData ? t.kycStatus : t.kycNotSubmitted}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#14b8a6] text-[#14b8a6] hover:bg-[#14b8a6]/10 hover:text-white"
                  onClick={() => setIsEditKYCOpen(true)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  {kycData ? t.editKYC : t.addKYC}
                </Button>
              </div>

              {!kycData ? (
                /* Empty State - No KYC Data */
                <div className="p-6 rounded-xl bg-[#1e293b]/30 border border-[#334155]">
                  <div
                    className={`flex flex-col items-center justify-center text-center ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <div className="w-16 h-16 mb-4 rounded-full bg-[#14b8a6]/10 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-[#14b8a6]" />
                    </div>
                    <h4 className="text-lg text-[#fef3c7] mb-2">
                      {t.kycNotSubmitted}
                    </h4>
                    <p className="text-sm text-[#cbd5e1] mb-4 max-w-md">
                      {t.kycNotSubmittedDesc}
                    </p>
                    <Button
                      variant="outline"
                      className="border-[#14b8a6] text-[#14b8a6] hover:bg-[#14b8a6]/10 hover:text-white"
                      onClick={() => setIsEditKYCOpen(true)}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      {t.addKYC}
                    </Button>
                  </div>
                </div>
              ) : (
                /* KYC Data Display */
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ID Number */}
                    {kycData.id_number && (
                      <div
                        className={`flex items-center gap-3 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="w-12 h-12 bg-[#1e293b] rounded-xl flex items-center justify-center">
                          <Hash className="w-6 h-6 text-[#d4af37]" />
                        </div>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className="text-xs text-[#cbd5e1]">{t.idNumber}</p>
                          <p className="text-[#fef3c7]">
                            {kycData.id_number.substring(0, 4)}****
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Date of Birth */}
                    {kycData.dob && (
                      <div
                        className={`flex items-center gap-3 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="w-12 h-12 bg-[#1e293b] rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-[#ec4899]" />
                        </div>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className="text-xs text-[#cbd5e1]">
                            {t.dateOfBirth}
                          </p>
                          <p className="text-[#fef3c7]">
                            {(() => {
                              try {
                                const date = new Date(kycData.dob);
                                if (isNaN(date.getTime())) {
                                  return kycData.dob;
                                }
                                return date.toLocaleDateString(
                                  language === "en" ? "en-US" : "ar-SA",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                );
                              } catch {
                                return kycData.dob;
                              }
                            })()}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Nationality */}
                    {kycData.nationality && (
                      <div
                        className={`flex items-center gap-3 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="w-12 h-12 bg-[#1e293b] rounded-xl flex items-center justify-center">
                          <Globe className="w-6 h-6 text-[#0ea5e9]" />
                        </div>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className="text-xs text-[#cbd5e1]">
                            {t.nationality}
                          </p>
                          <p className="text-[#fef3c7]">
                            {kycData.nationality}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Postal Code */}
                    {kycData.postal_code && (
                      <div
                        className={`flex items-center gap-3 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div className="w-12 h-12 bg-[#1e293b] rounded-xl flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-[#8b5cf6]" />
                        </div>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className="text-xs text-[#cbd5e1]">
                            {t.postalCode}
                          </p>
                          <p className="text-[#fef3c7]">
                            {kycData.postal_code}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Documents Status */}
                  {(kycData.gov_issued_id || kycData.proof_address) && (
                    <div className="mt-6 pt-6 border-t border-[#334155]">
                      <h4
                        className={`text-sm text-[#cbd5e1] mb-4 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {t.documents}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {kycData.gov_issued_id && (
                          <div
                            className={`flex items-center gap-3 p-4 bg-[#1e293b]/50 rounded-lg ${
                              isRTL ? "flex-row-reverse" : ""
                            }`}
                          >
                            <div className="w-10 h-10 bg-[#1e293b] rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-[#14b8a6]" />
                            </div>
                            <div className={isRTL ? "text-right" : "text-left"}>
                              <p className="text-xs text-[#cbd5e1]">
                                {t.idDocument}
                              </p>
                              <p className="text-sm text-[#fef3c7]">
                                {typeof kycData.gov_issued_id === "string"
                                  ? kycData.gov_issued_id
                                  : t.verified}
                              </p>
                            </div>
                          </div>
                        )}
                        {kycData.proof_address && (
                          <div
                            className={`flex items-center gap-3 p-4 bg-[#1e293b]/50 rounded-lg ${
                              isRTL ? "flex-row-reverse" : ""
                            }`}
                          >
                            <div className="w-10 h-10 bg-[#1e293b] rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-[#14b8a6]" />
                            </div>
                            <div className={isRTL ? "text-right" : "text-left"}>
                              <p className="text-xs text-[#cbd5e1]">
                                {t.proofOfAddress}
                              </p>
                              <p className="text-sm text-[#fef3c7]">
                                {typeof kycData.proof_address === "string"
                                  ? kycData.proof_address
                                  : t.verified}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
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
          profile_image: userData.profile_image
            ? getProfileImageUrl(userData.profile_image) || null
            : null,
          location: userData.location,
          phone_number: userData.phone,
          persona: persona || storedUser?.role?.toLowerCase() || "collector",
        }}
      />

      {/* Edit KYC Dialog */}
      <EditKYC
        open={isEditKYCOpen}
        onClose={() => setIsEditKYCOpen(false)}
        language={language}
        initialData={
          kycData
            ? {
                id_number: kycData.id_number,
                dob: kycData.dob,
                nationality: kycData.nationality,
                city: kycData.city,
                postal_code: kycData.postal_code,
                gov_issued_id:
                  typeof kycData.gov_issued_id === "string"
                    ? kycData.gov_issued_id
                    : kycData.gov_issued_id || null,
                proof_address:
                  typeof kycData.proof_address === "string"
                    ? kycData.proof_address
                    : kycData.proof_address || null,
              }
            : undefined
        }
      />
    </DashboardLayout>
  );
}
