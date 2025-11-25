import { useState } from "react";
import { motion } from "motion/react";
import {
  Link2,
  Copy,
  Share2,
  Check,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/useLanguage";
import {
  useGetDashboardStatsQuery,
  useLazyGenerateReferralCodeQuery,
} from "@/services/api/dashboardApi";

const content = {
  en: {
    title: "Referral Link Generator",
    description: "Share your unique link and earn rewards",
    yourLink: "Your Referral Link",
    generate: "Generate New Link",
    copy: "Copy Link",
    copied: "Copied!",
    shareOn: "Share On",
    stats: {
      clicks: "Total Clicks",
      conversions: "Conversions",
      pending: "Pending",
    },
    copySuccess: "Link copied to clipboard!",
    shareSuccess: "Opening share dialog...",
  },
  ar: {
    title: "منشئ روابط الإحالة",
    description: "شارك رابطك الفريد واكسب المكافآت",
    yourLink: "رابط الإحالة الخاص بك",
    generate: "إنشاء رابط جديد",
    copy: "نسخ الرابط",
    copied: "تم النسخ!",
    shareOn: "شارك على",
    stats: {
      clicks: "إجمالي النقرات",
      conversions: "التحويلات",
      pending: "قيد الانتظار",
    },
    copySuccess: "تم نسخ الرابط!",
    shareSuccess: "فتح نافذة المشاركة...",
  },
};

export function URLEncoder() {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";
  const [copied, setCopied] = useState(false);

  // Fetch dashboard stats from API
  const {
    data: statsData,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useGetDashboardStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Lazy query for generating referral code
  const [generateReferralCode, { isLoading: isGenerating }] =
    useLazyGenerateReferralCodeQuery();

  // Use API data or fallback to empty
  const referralLink = statsData?.data?.referral_link || "";
  const stats = {
    clicks: statsData?.data?.total_referral_clicks || 0,
    conversions: statsData?.data?.conversation || 0,
    pending: statsData?.data?.pending || 0,
  };

  // Handle generate new referral code
  const handleGenerate = async () => {
    try {
      const result = await generateReferralCode().unwrap();
      if (result.success && result.data) {
        toast.success(
          language === "en"
            ? "Referral code generated successfully!"
            : "تم إنشاء رمز الإحالة بنجاح!"
        );
        // Refetch stats to get updated referral link
        refetchStats();
      }
    } catch (error) {
      console.error("Error generating referral code:", error);
      toast.error(
        language === "en"
          ? "Failed to generate referral code"
          : "فشل إنشاء رمز الإحالة"
      );
    }
  };

  const handleCopy = () => {
    if (!referralLink) {
      toast.error(
        language === "en"
          ? "No referral link available"
          : "لا يوجد رابط إحالة متاح"
      );
      return;
    }
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success(t.copySuccess);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(referralLink);
    const shareUrls: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=Join me on FANN!`,
      email: `mailto:?subject=Join FANN&body=Use my referral link: ${referralLink}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank");
      toast.success(t.shareSuccess);
    }
  };

  // Show loading state
  if (isLoadingStats) {
    return (
      <div className="glass rounded-2xl p-6 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#14b8a6] animate-spin" />
          <p className="text-[#cbd5e1]">
            {language === "en"
              ? "Loading referral data..."
              : "جاري تحميل بيانات الإحالة..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 h-full">
      {/* Header */}
      <div
        className={`flex items-center gap-3 mb-4 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-[#14b8a6] to-[#0ea5e9] rounded-xl flex items-center justify-center">
          <Link2 className="w-6 h-6 text-[#0f172a]" />
        </div>
        <div className={isRTL ? "text-right" : "text-left"}>
          <h2 className="text-2xl text-[#fef3c7]">{t.title}</h2>
          <p className="text-sm text-[#cbd5e1]">{t.description}</p>
        </div>
      </div>

      {/* Referral Link Input */}
      <div className="mb-6">
        <div
          className={`flex items-center justify-between mb-2 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <label
            className={`text-sm text-[#cbd5e1] block ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t.yourLink}
          </label>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="sm"
            variant="outline"
            className="text-xs border-[#14b8a6] text-[#14b8a6] hover:bg-[#14b8a6]/10"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                {language === "en" ? "Generating..." : "جاري الإنشاء..."}
              </>
            ) : (
              t.generate
            )}
          </Button>
        </div>
        <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Input
            value={referralLink}
            readOnly
            placeholder={
              language === "en"
                ? "No referral link yet"
                : "لا يوجد رابط إحالة بعد"
            }
            className="flex-1 bg-[#1e293b] border-[#334155] text-[#fef3c7] focus:border-[#d4af37]"
          />
          <Button
            onClick={handleCopy}
            disabled={!referralLink}
            className="bg-gradient-to-r from-[#d4af37] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#d4af37] text-[#0f172a] transition-all disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                {t.copied}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                {t.copy}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-[#0ea5e9]/20 to-[#0ea5e9]/5 rounded-xl p-4 border border-[#0ea5e9]/30 text-center"
        >
          <p className="text-2xl text-[#fef3c7] mb-1">{stats.clicks}</p>
          <p className="text-xs text-[#cbd5e1]">{t.stats.clicks}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-[#14b8a6]/20 to-[#14b8a6]/5 rounded-xl p-4 border border-[#14b8a6]/30 text-center"
        >
          <p className="text-2xl text-[#fef3c7] mb-1">{stats.conversions}</p>
          <p className="text-xs text-[#cbd5e1]">{t.stats.conversions}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-[#fbbf24]/20 to-[#fbbf24]/5 rounded-xl p-4 border border-[#fbbf24]/30 text-center"
        >
          <p className="text-2xl text-[#fef3c7] mb-1">{stats.pending}</p>
          <p className="text-xs text-[#cbd5e1]">{t.stats.pending}</p>
        </motion.div>
      </div>

      {/* Share Buttons */}
      <div className={isRTL ? "text-right" : "text-left"}>
        <p className="text-sm text-[#cbd5e1] mb-3">{t.shareOn}</p>
        <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare("facebook")}
            className="w-12 h-12 bg-gradient-to-br from-[#1877f2] to-[#0c63d4] rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-[#1877f2]/50 transition-all"
          >
            <Facebook className="w-6 h-6 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare("twitter")}
            className="w-12 h-12 bg-gradient-to-br from-[#1da1f2] to-[#0c85d0] rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-[#1da1f2]/50 transition-all"
          >
            <Twitter className="w-6 h-6 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-gradient-to-br from-[#e4405f] to-[#c13584] rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-[#e4405f]/50 transition-all"
          >
            <Instagram className="w-6 h-6 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare("email")}
            className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#14b8a6] rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-[#d4af37]/50 transition-all"
          >
            <Mail className="w-6 h-6 text-[#0f172a]" />
          </motion.button>
        </div>
      </div>

      {/* QR Code Placeholder */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="mt-6 p-4 bg-white rounded-xl flex items-center justify-center"
      >
        <div className="w-32 h-32 bg-gradient-to-br from-[#d4af37] to-[#14b8a6] rounded-lg flex items-center justify-center">
          <Share2 className="w-16 h-16 text-white opacity-30" />
        </div>
      </motion.div>
      <p className="text-xs text-[#cbd5e1] text-center mt-2">
        {language === "en"
          ? "QR Code for easy sharing"
          : "رمز QR للمشاركة السهلة"}
      </p>
    </div>
  );
}
