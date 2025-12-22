import { DashboardLayout } from "@/components/dashboard/shared/DashboardLayout";
import { EditKYC } from "@/components/profile/EditKYC";
import { EditProfile } from "@/components/profile/EditProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImagePreviewList } from "@/components/ui/image-preview-list";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/useLanguage";
import { ROUTES } from "@/routes/paths";
import { useGetUserDetailsQuery } from "@/services/api/authApi";
import {
  useGetDashboardStatsQuery,
  useGetDashboardStatsGalleryQuery,
  useGetDashboardStatsAmbassadorQuery,
  useGetProgressionQuery,
} from "@/services/api/dashboardApi";
import { setUser, type UserProfileData } from "@/store/authSlice";
import { selectSubmittedData } from "@/store/onboardingSlice";
import type { RootState } from "@/store/store";
import {
  getFullImageUrl,
  normalizeToPreviewItems,
} from "@/utils/filePreviewHelpers";
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
  IdCard,
  Mail,
  MapPin,
  Phone,
  Share2,
  Shield,
  Star,
  TrendingUp
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
    kycCity: "City",
    kycStreetAddress: "Street Address",
    kycIdType: "ID Type",
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
    kycCity: "المدينة",
    kycStreetAddress: "عنوان الشارع",
    kycIdType: "نوع الهوية",
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
            street_address?: string;
            id_type?: string;
            gov_issued_id?: string | null; // Legacy single file
            gov_issued_id_front?: string | null; // Front of ID
            gov_issued_id_back?: string | null; // Back of ID
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
        // Combine front and back into array for storage, or use legacy single file
        let govIdUrls: string | string[] | null = null;
        if (kycVerification?.gov_issued_id_front || kycVerification?.gov_issued_id_back) {
          const urls: string[] = [];
          if (kycVerification.gov_issued_id_front) urls.push(kycVerification.gov_issued_id_front);
          if (kycVerification.gov_issued_id_back) urls.push(kycVerification.gov_issued_id_back);
          govIdUrls = urls.length === 1 ? urls[0] : urls;
        } else if (kycVerification?.gov_issued_id) {
          govIdUrls = kycVerification.gov_issued_id;
        }

        const updatedUser: UserProfileData = {
          ...userData,
          // Add KYC fields to user object (using type assertion since they're not in the interface)
          ...({
            kyc_id_number: kycVerification?.id_number,
            kyc_dob: kycVerification?.dob,
            kyc_nationality: kycVerification?.nationality,
            kyc_city: kycVerification?.city,
            kyc_postal_code: kycVerification?.postal_code,
            kyc_street_address: kycVerification?.street_address,
            kyc_id_type: kycVerification?.id_type,
            kyc_gov_issued_id: govIdUrls,
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
      street_address: (storedUser as { kyc_street_address?: string })
        .kyc_street_address,
      id_type: (storedUser as { kyc_id_type?: string }).kyc_id_type,
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
      street_address?: string;
      id_type?: string;
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
      street_address?: string;
      id_type?: string;
      gov_issued_id?: string;
      proof_address?: string;
    }
    | undefined;
  // Use KYC data from user object if available, otherwise fallback to onboarding data
  const kycData =
    kycDataFromUser && (kycDataFromUser.id_number || kycDataFromUser.dob)
      ? kycDataFromUser
      : kycDataFromOnboarding;

  // Determine user role for API calls (must be before API calls)
  const userRole = storedUser?.role?.toLowerCase() || persona?.toLowerCase() || "";
  const isCollector = userRole === "collector";
  const isAmbassador = userRole === "ambassador";
  const isGallery = userRole === "gallery";

  // Fetch dashboard stats from API based on role (must be called before any conditional returns)
  const { data: dashboardStatsData } = useGetDashboardStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: isGallery || isAmbassador, // Skip if Gallery or Ambassador
  });

  const { data: dashboardStatsGalleryData } = useGetDashboardStatsGalleryQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !isGallery, // Only call for Gallery
  });

  const { data: dashboardStatsAmbassadorData } = useGetDashboardStatsAmbassadorQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !isAmbassador, // Only call for Ambassador
  });

  // Map dashboard stats data based on role
  const mappedDashboardStats = useMemo(() => {
    if (isGallery && dashboardStatsGalleryData?.data) {
      // Map Gallery stats
      return {
        total_points: dashboardStatsGalleryData.data.total_points ?? 0,
        influence_points: dashboardStatsGalleryData.data.influence_points ?? 0,
        provenance_points: dashboardStatsGalleryData.data.provenance_points ?? 0,
        referral_count: dashboardStatsGalleryData.data.referral_count ?? 0,
        user_followers: dashboardStatsGalleryData.data.user_followers ?? 0,
        artwork_count: 0, // Gallery doesn't have artwork_count
        collection_count: 0, // Gallery doesn't have collection_count
      };
    }
    if (isAmbassador && dashboardStatsAmbassadorData?.data) {
      // Map Ambassador stats
      return {
        total_points: dashboardStatsAmbassadorData.data.total_points ?? 0,
        influence_points: dashboardStatsAmbassadorData.data.influence_points ?? 0,
        provenance_points: dashboardStatsAmbassadorData.data.provenance_points ?? 0,
        referral_count: dashboardStatsAmbassadorData.data.referral_count ?? 0,
        user_followers: dashboardStatsAmbassadorData.data.user_followers ?? 0,
        artwork_count: dashboardStatsAmbassadorData.data.artwork_count ?? 0,
        collection_count: dashboardStatsAmbassadorData.data.collection_count ?? 0,
      };
    }
    // Default stats (Collector/Artist)
    if (dashboardStatsData?.data) {
      return {
        total_points: dashboardStatsData.data.total_points ?? 0,
        influence_points: dashboardStatsData.data.influence_points ?? 0,
        provenance_points: dashboardStatsData.data.provenance_points ?? 0,
        referral_count: dashboardStatsData.data.referral_count ?? 0,
        user_followers: dashboardStatsData.data.user_followers ?? 0,
        artwork_count: dashboardStatsData.data.artwork_count ?? 0,
        collection_count: dashboardStatsData.data.collection_count ?? 0,
      };
    }
    return null;
  }, [
    isGallery,
    isAmbassador,
    dashboardStatsGalleryData,
    dashboardStatsAmbassadorData,
    dashboardStatsData,
  ]);

  // Fetch progression data for tier calculation
  const { data: progressionData } = useGetProgressionQuery();

  // Calculate progression tiers (must be before conditional returns)
  const progressionTiers = useMemo(
    () => progressionData?.data || [],
    [progressionData?.data]
  );

  // Calculate total points for tier calculation (before conditional returns)
  const totalPoints =
    mappedDashboardStats?.total_points ??
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
      "https://api.fann.art/api";
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
        `${storedUser.first_name || ""} ${storedUser.last_name || ""
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
        mappedDashboardStats?.influence_points ??
        Math.floor(parseInt(storedUser.points || "0", 10) * 0.6),
      provenancePoints:
        mappedDashboardStats?.provenance_points ??
        Math.floor(parseInt(storedUser.points || "0", 10) * 0.4),
      referrals:
        mappedDashboardStats?.referral_count ??
        storedUser.total_referral_clicks ??
        0,
      followers: mappedDashboardStats?.user_followers ?? 0,
      artworksSaved: mappedDashboardStats?.artwork_count ?? 0,
      collections: mappedDashboardStats?.collection_count ?? 0,
      // Additional fields for edit profile
      title: storedUser.title || "",
      focus: storedUser.focus || "",
      years_of_experience: storedUser.years_of_experience
        ? String(storedUser.years_of_experience)
        : "",
      instagram_handle: storedUser.instagram_handle || "",
      profile_image: storedUser.profile_image,
      // Persona-based fields
      price_range: storedUser.price_range ?? "",
      preferred_commission_rate: storedUser.preferred_commission_rate ?? "",
      shipping_preference: storedUser.shipping_preference ?? "",
      studio_address: storedUser.studio_address ?? "",
      education: storedUser.education ?? "",
      award_artist: storedUser.award_artist ?? "",
      artist_statement: storedUser.artist_statement ?? "",
      organization_email: storedUser.organization_email ?? "",
      organization_main_contact_name:
        storedUser.organization_main_contact_name ?? "",
      organization_name: storedUser.organization_name ?? "",
      organization_type: storedUser.organization_type ?? "",
      founded_year: storedUser.founded_year ?? "",
      exhibition_count:
        storedUser.exhibition_count !== undefined &&
          storedUser.exhibition_count !== null
          ? String(storedUser.exhibition_count)
          : "",
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
          className={`flex flex-col md:flex-row gap-6 ${isRTL ? "md:flex-row-reverse" : ""
            }`}
        >
          {/* Avatar */}
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-[#ffcc33]">
              <AvatarImage
                src={getProfileImageUrl(userData.profile_image)}
                alt={userData.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-[#ffcc33] to-[#45e3d3] text-[#0F021C] text-3xl">
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
              className={`flex items-start justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""
                }`}
            >
              <div>
                <h1 className="text-3xl text-[#ffffff] mb-1">
                  {userData.name}
                </h1>
                <p className="text-[#808c99] mb-3">
                  {userData.username ? `@${userData.username}` : userData.email}
                </p>
                <Badge className="bg-gradient-to-r from-[#ffcc33] to-[#ffb54d] text-[#0F021C] border-0 flex items-center gap-1">
                  <Crown className={`w-3 h-3 ${isRTL ? "ml-1" : "mr-1"}`} />
                  <span className="text-xs font-semibold opacity-80">{t.tier}: {currentTierName}</span>
                </Badge>
              </div>
              <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  {t.editProfile}
                </Button>
              </div>
            </div>

            <p className="text-[#808c99] mb-4">{userData.bio}</p>

            {/* Quick Stats */}
            <div
              className={`grid grid-cols-2 ${isAmbassador ? "md:grid-cols-3" : isCollector ? "md:grid-cols-5" : "md:grid-cols-4"} gap-4 ${isRTL ? "text-right" : "text-left"
                }`}
            >
              <div className="bg-[#0f021c] border border-primary/20 rounded-lg p-3">
                <p className="text-2xl text-[#ffcc33]">
                  {userData.totalPoints}
                </p>
                <p className="text-xs text-[#808c99]">{t.totalPoints}</p>
              </div>
              <div className="bg-[#0f021c] border border-primary/20 rounded-lg p-3">
                <p className="text-2xl text-[#ffffff]">{userData.followers}</p>
                <p className="text-xs text-[#808c99]">{t.followers}</p>
              </div>
              <div className="bg-[#0f021c] border border-primary/20 rounded-lg p-3">
                <p className="text-2xl text-[#ffffff]">{userData.referrals}</p>
                <p className="text-xs text-[#808c99]">{t.referrals}</p>
              </div>
              {!isAmbassador && (
                <div className="bg-[#0f021c] border border-primary/20 rounded-lg p-3">
                  <p className="text-2xl text-[#ffffff]">
                    {userData.artworksSaved}
                  </p>
                  <p className="text-xs text-[#808c99]">{t.artworksSaved}</p>
                </div>
              )}
              {isCollector && (
                <div className="bg-[#0f021c] border border-primary/20 rounded-lg p-3">
                  <p className="text-2xl text-[#ffffff]">
                    {userData.collections}
                  </p>
                  <p className="text-xs text-[#808c99]">{t.collectionsCreated}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          {nextTierName ? (
            <>
              <div
                className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""
                  }`}
              >
                <span className="text-sm text-[#808c99]">
                  {t.progressToNext} {nextTierName}
                </span>
                <span className="text-sm text-[#ffcc33]">
                  {pointsNeeded} {t.pointsNeeded}
                </span>
              </div>
              <Progress value={progress} className="h-3 bg-[#0f021c]" />
            </>
          ) : (
            <>
              <div
                className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""
                  }`}
              >
                <span className="text-sm text-[#808c99]">
                  {language === "en"
                    ? "Maximum tier reached!"
                    : "تم الوصول إلى أعلى مستوى!"}
                </span>
                <span className="text-sm text-[#ffcc33]">100%</span>
              </div>
              <Progress value={100} className="h-3 bg-[#0f021c]" />
            </>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="about" className="w-full" dir={isRTL ? "rtl" : "ltr"}>
        <TabsList className="glass border border-[#4e4e4e78] mb-6">
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
                  className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""
                    }`}
                >
                  <div className="w-12 h-12 bg-[#1D112A] border border-[#ffcc33]/30 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#ffcc33]" />
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <p className="text-xs text-[#808c99]">{t.email}</p>
                    <p className="text-[#ffffff]">{userData.email}</p>
                  </div>
                </div>
              )}

              {/* Phone - only show if show_phone is true */}
              {storedUser?.show_phone === true && (
                <div
                  className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""
                    }`}
                >
                  <div className="w-12 h-12 bg-[#1D112A] border border-[#45e3d3]/30 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[#45e3d3]" />
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <p className="text-xs text-[#808c99]">{t.phone}</p>
                    <p className="text-[#ffffff]">{userData.phone}</p>
                  </div>
                </div>
              )}

              {/* Location - only show if show_location is true */}
              {storedUser?.show_location === true && (
                <div
                  className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""
                    }`}
                >
                  <div className="w-12 h-12 bg-[#1D112A] border border-[#9375b5]/30 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#9375b5]" />
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <p className="text-xs text-[#808c99]">{t.location}</p>
                    <p className="text-[#ffffff]">{userData.location}</p>
                  </div>
                </div>
              )}

              <div
                className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""
                  }`}
              >
                <div className="w-12 h-12 bg-[#1D112A] border border-[#0ea5e9]/30 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-[#0ea5e9]" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-xs text-[#808c99]">{t.website}</p>
                  <p className="text-[#ffffff]">{userData.website}</p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""
                  }`}
              >
                <div className="w-12 h-12 bg-[#1D112A] border border-[#ffb54d]/30 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-[#ffb54d]" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-xs text-[#808c99]">{t.role}</p>
                  <p className="text-[#ffffff]">{userData.role}</p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""
                  }`}
              >
                <div className="w-12 h-12 bg-[#1D112A] border border-[#fface3]/30 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#fface3]" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-xs text-[#808c99]">{t.memberSince}</p>
                  <p className="text-[#ffffff]">{userData.memberSince}</p>
                </div>
              </div>
            </div>

            {/* KYC Verification Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 pt-8 border-t border-[#4e4e4e78]"
            >
              <div
                className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""
                  }`}
              >
                <div
                  className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""
                    }`}
                >
                  <div className="w-12 h-12 bg-[#1D112A] border border-[#45e3d3]/30 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#45e3d3]" />
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <h3 className="text-lg text-[#ffffff]">{t.kyc}</h3>
                    <p className="text-xs text-[#808c99]">
                      {kycData ? t.kycStatus : t.kycNotSubmitted}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditKYCOpen(true)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  {kycData ? t.editKYC : t.addKYC}
                </Button>
              </div>

              {!kycData ? (
                /* Empty State - No KYC Data */
                <div className="p-6 rounded-xl bg-[#0f021c] border border-[#4e4e4e78]">
                  <div
                    className={`flex flex-col items-center justify-center text-center ${isRTL ? "text-right" : "text-left"
                      }`}
                  >
                    <div className="w-16 h-16 mb-4 rounded-full bg-[#45e3d3]/10 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-[#45e3d3]" />
                    </div>
                    <h4 className="text-lg text-[#ffffff] mb-2">
                      {t.kycNotSubmitted}
                    </h4>
                    <p className="text-sm text-[#808c99] mb-4 max-w-md">
                      {t.kycNotSubmittedDesc}
                    </p>
                    <Button
                      variant="outline"
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
                        className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""
                          }`}
                      >
                        <div className="w-12 h-12 bg-[#1D112A] border border-[#ffcc33]/30 rounded-xl flex items-center justify-center">
                          <Hash className="w-6 h-6 text-[#ffcc33]" />
                        </div>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className="text-xs text-[#808c99]">{t.idNumber}</p>
                          <p className="text-[#ffffff]">
                            {kycData.id_number.substring(0, 4)}****
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Date of Birth */}
                    {kycData.dob && (
                      <div
                        className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""
                          }`}
                      >
                        <div className="w-12 h-12 bg-[#1D112A] border border-[#fface3]/30 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-[#fface3]" />
                        </div>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className="text-xs text-[#808c99]">
                            {t.dateOfBirth}
                          </p>
                          <p className="text-[#ffffff]">
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
                        className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""
                          }`}
                      >
                        <div className="w-12 h-12 bg-[#1D112A] border border-[#0ea5e9]/30 rounded-xl flex items-center justify-center">
                          <Globe className="w-6 h-6 text-[#0ea5e9]" />
                        </div>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className="text-xs text-[#808c99]">
                            {t.nationality}
                          </p>
                          <p className="text-[#ffffff]">
                            {kycData.nationality}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* City */}
                    {kycData.city && (
                      <div
                        className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""
                          }`}
                      >
                        <div className="w-12 h-12 bg-[#1D112A] border border-[#0ea5e9]/30 rounded-xl flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-[#0ea5e9]" />
                        </div>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className="text-xs text-[#808c99]">
                            {t.kycCity}
                          </p>
                          <p className="text-[#ffffff]">
                            {kycData.city}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Postal Code */}
                    {kycData.postal_code && (
                      <div
                        className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""
                          }`}
                      >
                        <div className="w-12 h-12 bg-[#1D112A] border border-[#9375b5]/30 rounded-xl flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-[#9375b5]" />
                        </div>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className="text-xs text-[#808c99]">
                            {t.postalCode}
                          </p>
                          <p className="text-[#ffffff]">
                            {kycData.postal_code}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Street Address */}
                    {kycData.street_address && (
                      <div
                        className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""
                          }`}
                      >
                        <div className="w-12 h-12 bg-[#1D112A] border border-[#9375b5]/30 rounded-xl flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-[#9375b5]" />
                        </div>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className="text-xs text-[#808c99]">
                            {t.kycStreetAddress}
                          </p>
                          <p className="text-[#ffffff]">
                            {kycData.street_address}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* ID Type */}
                    {kycData.id_type && (
                      <div
                        className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""
                          }`}
                      >
                        <div className="w-12 h-12 bg-[#1D112A] border border-[#ffcc33]/30 rounded-xl flex items-center justify-center">
                          <IdCard className="w-6 h-6 text-[#ffcc33]" />
                        </div>
                        <div className={isRTL ? "text-right" : "text-left"}>
                          <p className="text-xs text-[#808c99]">
                            {t.kycIdType}
                          </p>
                          <p className="text-[#ffffff]">
                            {kycData.id_type}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Documents Status */}
                  {(kycData.gov_issued_id || kycData.proof_address) && (
                    <div className="mt-6 pt-6 border-t border-[#4e4e4e78]">
                      <h4
                        className={`text-sm text-[#808c99] mb-4 ${isRTL ? "text-right" : "text-left"
                          }`}
                      >
                        {t.documents}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Government ID Documents */}
                        {kycData.gov_issued_id && (
                          <div>
                            <p className={`text-xs text-[#808c99] mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                              {t.idDocument}
                            </p>
                            {(() => {
                              // Normalize to array
                              const idUrls = Array.isArray(kycData.gov_issued_id)
                                ? kycData.gov_issued_id
                                : [kycData.gov_issued_id];
                              const fullUrls = idUrls
                                .filter((url): url is string => typeof url === "string" && !!url)
                                .map((url) => getFullImageUrl(url))
                                .filter((url): url is string => !!url);

                              if (fullUrls.length > 0) {
                                const previews = normalizeToPreviewItems(fullUrls, ["Front", "Back"]);
                                return (
                                  <ImagePreviewList
                                    items={previews}
                                    layout="row"
                                    size="md"
                                    showNames={true}
                                    itemLabels={["Front", "Back"]}
                                    isRTL={isRTL}
                                  />
                                );
                              }
                              return (
                                <div className={`flex items-center gap-3 p-4 bg-[#0f021c] rounded-lg ${isRTL ? "flex-row-reverse" : ""}`}>
                                  <div className="w-10 h-10 bg-[#1D112A] border border-[#45e3d3]/30 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-[#45e3d3]" />
                                  </div>
                                  <div className={isRTL ? "text-right" : "text-left"}>
                                    <p className="text-sm text-[#ffffff]">{t.verified}</p>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                        {/* Proof of Address */}
                        {kycData.proof_address && (
                          <div>
                            <p className={`text-xs text-[#808c99] mb-2 ${isRTL ? "text-right" : "text-left"}`}>
                              {t.proofOfAddress}
                            </p>
                            {(() => {
                              if (typeof kycData.proof_address === "string") {
                                const fullUrl = getFullImageUrl(kycData.proof_address);
                                if (fullUrl) {
                                  const previews = normalizeToPreviewItems(fullUrl);
                                  return (
                                    <ImagePreviewList
                                      items={previews}
                                      size="md"
                                      showNames={true}
                                      isRTL={isRTL}
                                    />
                                  );
                                }
                              }
                              return (
                                <div className={`flex items-center gap-3 p-4 bg-[#0f021c] rounded-lg ${isRTL ? "flex-row-reverse" : ""}`}>
                                  <div className="w-10 h-10 bg-[#1D112A] border border-[#45e3d3]/30 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-[#45e3d3]" />
                                  </div>
                                  <div className={isRTL ? "text-right" : "text-left"}>
                                    <p className="text-sm text-[#ffffff]">{t.verified}</p>
                                  </div>
                                </div>
                              );
                            })()}
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
                  className={`flex items-center justify-between p-4 bg-[#0f021c] rounded-lg border border-[#4e4e4e78] hover:border-[#ffcc33]/30 transition-all ${isRTL ? "flex-row-reverse" : ""
                    }`}
                >
                  <div
                    className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""
                      }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#ffcc33] to-[#45e3d3] rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-[#0F021C]" />
                    </div>
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <p className="text-[#ffffff]">{activity.action}</p>
                    </div>
                  </div>
                  <Badge className="bg-[#45e3d3]/20 text-[#45e3d3] border-[#45e3d3]/30">
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
                    className={`p-6 rounded-xl border transition-all ${achievement.unlocked
                      ? "bg-gradient-to-br from-[#ffcc33]/20 to-[#45e3d3]/20 border-[#ffcc33]/30"
                      : "bg-[#0f021c] border-[#4e4e4e78] opacity-60"
                      }`}
                  >
                    <div
                      className={`flex items-center gap-3 mb-3 ${isRTL ? "flex-row-reverse" : ""
                        }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${achievement.unlocked
                          ? "bg-gradient-to-br from-[#ffcc33] to-[#45e3d3]"
                          : "bg-[#4e4e4e78]"
                          }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${achievement.unlocked
                            ? "text-[#0F021C]"
                            : "text-[#808c99]"
                            }`}
                        />
                      </div>
                      {achievement.unlocked && (
                        <Badge className="bg-[#45e3d3] text-white border-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <h3
                      className={`text-[#ffffff] mb-1 ${isRTL ? "text-right" : "text-left"
                        }`}
                    >
                      {achievement.name}
                    </h3>
                    <p
                      className={`text-sm text-[#808c99] ${isRTL ? "text-right" : "text-left"
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
              <div className="bg-[#0f021c] border border-primary/20 rounded-xl p-6">
                <h3
                  className={`text-xl text-[#ffffff] mb-4 ${isRTL ? "text-right" : "text-left"
                    }`}
                >
                  {language === "en" ? "Point Distribution" : "توزيع النقاط"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <div
                      className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""
                        }`}
                    >
                      <div
                        className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""
                          }`}
                      >
                        <Flame className="w-5 h-5 text-[#9375b5]" />
                        <span className="text-[#808c99]">
                          {t.influencePoints}
                        </span>
                      </div>
                      <span className="text-[#ffffff]">
                        {userData.influencePoints}
                      </span>
                    </div>
                    <Progress
                      value={
                        (userData.influencePoints / userData.totalPoints) * 100
                      }
                      className="h-2 bg-[#0f021c]"
                    />
                  </div>
                  <div>
                    <div
                      className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""
                        }`}
                    >
                      <div
                        className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""
                          }`}
                      >
                        <Shield className="w-5 h-5 text-[#0ea5e9]" />
                        <span className="text-[#808c99]">
                          {t.provenancePoints}
                        </span>
                      </div>
                      <span className="text-[#ffffff]">
                        {userData.provenancePoints}
                      </span>
                    </div>
                    <Progress
                      value={
                        (userData.provenancePoints / userData.totalPoints) * 100
                      }
                      className="h-2 bg-[#0f021c]"
                    />
                  </div>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="bg-[#0f021c] border border-primary/20 rounded-xl p-6">
                <h3
                  className={`text-xl text-[#ffffff] mb-4 ${isRTL ? "text-right" : "text-left"
                    }`}
                >
                  {language === "en" ? "Engagement" : "التفاعل"}
                </h3>
                <div className="space-y-4">
                  <div
                    className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""
                      }`}
                  >
                    <span className="text-[#808c99]">{t.referrals}</span>
                    <span className="text-2xl text-[#ffcc33]">
                      {userData.referrals}
                    </span>
                  </div>
                  {!isAmbassador && (
                    <div
                      className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""
                        }`}
                    >
                      <span className="text-[#808c99]">{t.artworksSaved}</span>
                      <span className="text-2xl text-[#45e3d3]">
                        {userData.artworksSaved}
                      </span>
                    </div>
                  )}
                  {isCollector && (
                    <div
                      className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""
                        }`}
                    >
                      <span className="text-[#808c99]">
                        {t.collectionsCreated}
                      </span>
                      <span className="text-2xl text-[#0ea5e9]">
                        {userData.collections}
                      </span>
                    </div>
                  )}
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
          price_range: userData.price_range,
          preferred_commission_rate: userData.preferred_commission_rate,
          shipping_preference: userData.shipping_preference,
          studio_address: userData.studio_address,
          education: userData.education,
          award_artist: userData.award_artist,
          artist_statement: userData.artist_statement,
          organization_email: userData.organization_email,
          organization_main_contact_name:
            userData.organization_main_contact_name,
          organization_name: userData.organization_name,
          organization_type: userData.organization_type,
          founded_year: userData.founded_year,
          exhibition_count: userData.exhibition_count,
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
              street_address: kycData.street_address,
              id_type: kycData.id_type,
              // Support both single string and array of strings for gov_issued_id
              gov_issued_id: kycData.gov_issued_id
                ? (Array.isArray(kycData.gov_issued_id)
                  ? kycData.gov_issued_id
                  : [kycData.gov_issued_id])
                : null,
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
