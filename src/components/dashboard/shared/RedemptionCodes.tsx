import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Gift, Sparkles, Check, AlertCircle, Loader2, Plus, Copy } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/useLanguage";
import {
  useGetRedemptionsQuery,
  useUserRedemptionMutation,
  useGenerateRedeemCodeMutation,
  type Redemption,
} from "@/services/api/dashboardApi";
import { formatDateForDisplay } from "@/utils/dateUtils";

const content = {
  en: {
    title: "Redemption Codes",
    description: "Redeem codes for exclusive rewards",
    enterCode: "Enter Code",
    redeem: "Redeem",
    redeemedCodes: "Redeemed Codes",
    availableRewards: "Available Rewards",
    points: "Points",
    status: {
      redeemed: "Redeemed",
      expired: "Expired",
      available: "Available",
    },
    messages: {
      success: "Code redeemed successfully!",
      invalid: "Invalid or expired code",
      alreadyUsed: "Code already used",
      generateSuccess: "Code generated successfully!",
      generateError: "Failed to generate code",
      codeCopied: "Code copied to clipboard!",
    },
    generateCode: "Generate Code",
    generateTitle: "Generate Redemption Code",
    generateDescription: "Create a new redemption code with points",
    codeTitle: "Code Title",
    codePoints: "Points",
    generatedCode: "Generated Code",
    copyCode: "Copy Code",
    noHistory: "No redemption history yet",
    codes: [
      {
        code: "WELCOME50",
        reward: "+50 Points",
        status: "redeemed",
        date: "Nov 20, 2024",
      },
      {
        code: "LAUNCH100",
        reward: "+100 Points",
        status: "redeemed",
        date: "Nov 19, 2024",
      },
    ],
    rewards: [
      { name: "Early Adopter Badge", points: 150 },
      { name: "VIP Preview Access", points: 300 },
      { name: "Curator Toolkit", points: 500 },
    ],
  },
  ar: {
    title: "أكواد الاسترداد",
    description: "استبدل الأكواد للحصول على مكافآت حصرية",
    enterCode: "أدخل الكود",
    redeem: "استبدل",
    redeemedCodes: "الأكواد المستبدلة",
    availableRewards: "المكافآت المتاحة",
    points: "نقاط",
    status: {
      redeemed: "تم الاسترداد",
      expired: "منتهي الصلاحية",
      available: "متاح",
    },
    messages: {
      success: "تم استبدال الكود بنجاح!",
      invalid: "كود غير صالح أو منتهي الصلاحية",
      alreadyUsed: "الكود مستخدم بالفعل",
      generateSuccess: "تم إنشاء الكود بنجاح!",
      generateError: "فشل إنشاء الكود",
      codeCopied: "تم نسخ الكود إلى الحافظة!",
    },
    generateCode: "إنشاء كود",
    generateTitle: "إنشاء كود استرداد",
    generateDescription: "قم بإنشاء كود استرداد جديد مع النقاط",
    codeTitle: "عنوان الكود",
    codePoints: "النقاط",
    generatedCode: "الكود المُنشأ",
    copyCode: "نسخ الكود",
    noHistory: "لا يوجد سجل استرداد حتى الآن",
    codes: [
      {
        code: "WELCOME50",
        reward: "+50 نقطة",
        status: "redeemed",
        date: "20 نوفمبر 2024",
      },
      {
        code: "LAUNCH100",
        reward: "+100 نقطة",
        status: "redeemed",
        date: "19 نوفمبر 2024",
      },
    ],
    rewards: [
      { name: "شارة المستخدم المبكر", points: 150 },
      { name: "وصول معاينة VIP", points: 300 },
      { name: "مجموعة أدوات المنسق", points: 500 },
    ],
  },
};

export function RedemptionCodes() {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";
  const [code, setCode] = useState("");
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [generateTitle, setGenerateTitle] = useState("");
  const [generatePoints, setGeneratePoints] = useState("");
  const [generatedCode, setGeneratedCode] = useState<Redemption | null>(null);

  // Fetch available redemptions from API
  const {
    data: redemptionsData,
    isLoading: isLoadingRedemptions,
    isError: isRedemptionsError,
  } = useGetRedemptionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // User redemption mutation
  const [userRedemption, { isLoading: isRedeeming }] =
    useUserRedemptionMutation();

  // Generate redeem code mutation
  const [generateRedeemCode, { isLoading: isGenerating }] =
    useGenerateRedeemCodeMutation();

  // Parse redemptions from API response
  const allRedemptions = useMemo(() => {
    if (!redemptionsData?.data) return [];

    // Handle both array and single object responses
    const data = redemptionsData.data;
    if (Array.isArray(data)) {
      return data;
    }
    // If single object, wrap in array
    return [data as Redemption];
  }, [redemptionsData]);

  // Filter available redemptions (is_completed === false)
  const availableRedemptions = useMemo(() => {
    return allRedemptions.filter(
      (r) => r.is_completed === false || r.is_completed === undefined
    );
  }, [allRedemptions]);

  // Filter redeemed codes (is_completed === true)
  const redeemedCodes = useMemo(() => {
    return allRedemptions.filter((r) => r.is_completed === true);
  }, [allRedemptions]);

  // Handle clicking on available reward to populate code field
  const handleRewardClick = (redemptionCode: string) => {
    setCode(redemptionCode.toUpperCase());
  };


  const handleRedeem = async () => {
    if (!code.trim()) {
      toast.error(t.messages.invalid);
      return;
    }

    try {
      // Find redemption by code (case-insensitive) - check all redemptions
      const redemption = allRedemptions.find(
        (r) => r.code?.toUpperCase() === code.toUpperCase()
      );

      if (!redemption) {
        toast.error(t.messages.invalid);
        return;
      }

      // Check if already redeemed
      if (redemption.is_completed === true) {
        toast.error(t.messages.alreadyUsed);
        return;
      }

      // Call API to redeem
      const result = await userRedemption({
        redeem_id: redemption.id,
      }).unwrap();

      if (result.success) {
        toast.success(t.messages.success);
        setCode("");
        // Redemptions will be automatically refetched via RTK Query tag invalidation
        // Dashboard stats will also be updated via User tag invalidation
      } else {
        // Handle API error messages
        const errorMessage =
          typeof result.message === "string"
            ? result.message
            : t.messages.invalid;
        toast.error(errorMessage);
      }
    } catch (error: unknown) {
      console.error("Error redeeming code:", error);
      // Handle different error types
      if (error && typeof error === "object" && "data" in error) {
        const errorData = error.data as {
          message?: string;
          detail?: string;
          [key: string]: unknown;
        };
        const errorMessage =
          errorData?.message ||
          errorData?.detail ||
          (typeof errorData === "string" ? errorData : t.messages.invalid);
        toast.error(errorMessage);
      } else {
        toast.error(t.messages.invalid);
      }
    }
  };

  const handleGenerateCode = async () => {
    if (!generateTitle.trim()) {
      toast.error(
        language === "en"
          ? "Please enter a code title"
          : "يرجى إدخال عنوان الكود"
      );
      return;
    }

    const points = parseInt(generatePoints, 10);
    if (!generatePoints.trim() || isNaN(points) || points <= 0) {
      toast.error(
        language === "en"
          ? "Please enter valid points"
          : "يرجى إدخال نقاط صالحة"
      );
      return;
    }

    try {
      const result = await generateRedeemCode({
        title: generateTitle.trim(),
        points: points,
      }).unwrap();

      if (result.success && result.data) {
        toast.success(t.messages.generateSuccess);
        setGeneratedCode(result.data);
        setGenerateTitle("");
        setGeneratePoints("");
        setShowGenerateForm(false);
        // Auto-populate the code field with the generated code
        if (result.data.code) {
          setCode(result.data.code.toUpperCase());
        }
      } else {
        const errorMessage =
          typeof result.message === "string"
            ? result.message
            : t.messages.generateError;
        toast.error(errorMessage);
      }
    } catch (error: unknown) {
      console.error("Error generating code:", error);
      if (error && typeof error === "object" && "data" in error) {
        const errorData = error.data as {
          message?: string;
          detail?: string;
          [key: string]: unknown;
        };
        const errorMessage =
          errorData?.message ||
          errorData?.detail ||
          (typeof errorData === "string" ? errorData : t.messages.generateError);
        toast.error(errorMessage);
      } else {
        toast.error(t.messages.generateError);
      }
    }
  };

  const handleCopyCode = async (codeToCopy: string) => {
    try {
      await navigator.clipboard.writeText(codeToCopy);
      toast.success(t.messages.codeCopied);
    } catch (error) {
      console.error("Failed to copy code:", error);
      toast.error(
        language === "en" ? "Failed to copy code" : "فشل نسخ الكود"
      );
    }
  };

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      {/* Header */}
      <div
        className={`flex items-center gap-3 mb-4 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-[#8b5cf6] to-[#ec4899] rounded-xl flex items-center justify-center">
          <Gift className="w-6 h-6 text-white" />
        </div>
        <div className={isRTL ? "text-right" : "text-left"}>
          <h2 className="text-2xl text-[#fef3c7]">{t.title}</h2>
          <p className="text-sm text-[#cbd5e1]">{t.description}</p>
        </div>
      </div>

      {/* Code Input */}
      <div className="mb-6">
        <label
          className={`text-sm text-[#cbd5e1] mb-2 block ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t.enterCode}
        </label>
        <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="XXXXXX"
            className="flex-1 bg-[#1e293b] border-[#334155] text-[#fef3c7] placeholder:text-[#475569] focus:border-[#8b5cf6] uppercase"
            onKeyPress={(e) => e.key === "Enter" && handleRedeem()}
          />
          <Button
            onClick={handleRedeem}
            disabled={isRedeeming || !code.trim() || isLoadingRedemptions}
            className={`bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:from-[#ec4899] hover:to-[#8b5cf6] hover:shadow-lg hover:shadow-[#8b5cf6]/50 text-white transition-all duration-200 disabled:opacity-50 disabled:hover:shadow-none ${
              isRedeeming || !code.trim() || isLoadingRedemptions
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {isRedeeming ? (
              <Loader2
                className={`w-4 h-4 animate-spin ${isRTL ? "ml-2" : "mr-2"}`}
              />
            ) : (
              <Sparkles className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            )}
            {t.redeem}
          </Button>
        </div>
      </div>

      {/* Generate Code Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3
            className={`text-sm text-[#cbd5e1] ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t.generateTitle}
          </h3>
          <Button
            onClick={() => {
              setShowGenerateForm(!showGenerateForm);
              if (showGenerateForm) {
                setGeneratedCode(null);
              }
            }}
            variant="outline"
            size="sm"
            className={`border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6]/20 hover:border-[#7c3aed] hover:text-[#7c3aed] transition-all duration-200 cursor-pointer ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Plus className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {showGenerateForm
              ? language === "en"
                ? "Cancel"
                : "إلغاء"
              : t.generateCode}
          </Button>
        </div>

        {showGenerateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#1e293b]/50 rounded-lg p-4 border border-[#8b5cf6]/30 space-y-4"
          >
            <p className="text-xs text-[#cbd5e1] mb-3">
              {t.generateDescription}
            </p>
            <div className="space-y-3">
              <div>
                <label
                  className={`text-xs text-[#cbd5e1] mb-2 block ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t.codeTitle}
                </label>
                <Input
                  value={generateTitle}
                  onChange={(e) => setGenerateTitle(e.target.value)}
                  placeholder={
                    language === "en"
                      ? "Enter code title"
                      : "أدخل عنوان الكود"
                  }
                  className="bg-[#1e293b] border-[#334155] text-[#fef3c7] placeholder:text-[#475569] focus:border-[#8b5cf6]"
                />
              </div>
              <div>
                <label
                  className={`text-xs text-[#cbd5e1] mb-2 block ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t.codePoints}
                </label>
                <Input
                  type="number"
                  value={generatePoints}
                  onChange={(e) => setGeneratePoints(e.target.value)}
                  placeholder={
                    language === "en" ? "Enter points" : "أدخل النقاط"
                  }
                  className="bg-[#1e293b] border-[#334155] text-[#fef3c7] placeholder:text-[#475569] focus:border-[#8b5cf6]"
                  min="1"
                />
              </div>
              <Button
                onClick={handleGenerateCode}
                disabled={isGenerating || !generateTitle.trim() || !generatePoints.trim()}
                className={`w-full bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:from-[#ec4899] hover:to-[#8b5cf6] hover:shadow-lg hover:shadow-[#8b5cf6]/50 text-white transition-all duration-200 disabled:opacity-50 disabled:hover:shadow-none ${
                  isGenerating ||
                  !generateTitle.trim() ||
                  !generatePoints.trim()
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {isGenerating ? (
                  <Loader2
                    className={`w-4 h-4 animate-spin ${
                      isRTL ? "ml-2" : "mr-2"
                    }`}
                  />
                ) : (
                  <Plus className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                )}
                {t.generateCode}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Display Generated Code */}
        {generatedCode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-gradient-to-r from-[#8b5cf6]/20 to-[#ec4899]/20 rounded-lg p-4 border border-[#8b5cf6]/50"
          >
            <div
              className={`flex items-center justify-between ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div className={isRTL ? "text-right" : "text-left"}>
                <p className="text-xs text-[#cbd5e1] mb-1">
                  {t.generatedCode}
                </p>
                <p className="text-lg font-bold text-[#fef3c7]">
                  {generatedCode.code}
                </p>
                <p className="text-sm text-[#cbd5e1] mt-1">
                  {generatedCode.title} - {generatedCode.points} {t.points}
                </p>
              </div>
              <Button
                onClick={() => handleCopyCode(generatedCode.code || "")}
                variant="outline"
                size="sm"
                className="border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6]/20 hover:border-[#7c3aed] hover:text-[#7c3aed] hover:scale-110 transition-all duration-200 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Available Rewards */}
      <div className="mb-6">
        <h3
          className={`text-sm text-[#cbd5e1] mb-3 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t.availableRewards}
        </h3>
        {isLoadingRedemptions ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#8b5cf6] animate-spin" />
          </div>
        ) : isRedemptionsError ? (
          <div className="flex flex-col items-center justify-center py-8 text-[#475569]">
            <AlertCircle className="w-12 h-12 mb-2 text-[#ef4444]" />
            <p className="text-sm">
              {language === "en"
                ? "Failed to load available rewards"
                : "فشل تحميل المكافآت المتاحة"}
            </p>
          </div>
        ) : availableRedemptions.length > 0 ? (
          <div className="space-y-2">
            {availableRedemptions.map((redemption, index) => (
              <motion.div
                key={redemption.id || index}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleRewardClick(redemption.code || "")}
                className={`flex items-center justify-between p-3 bg-gradient-to-r from-[#1e293b]/50 to-[#8b5cf6]/10 rounded-lg border border-[#8b5cf6]/30 cursor-pointer hover:border-[#8b5cf6]/60 transition-colors ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex items-center gap-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-8 h-8 bg-[#8b5cf6]/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
                  </div>
                  <span className="text-sm text-[#fef3c7]">
                    {redemption.title || redemption.code}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="border-[#d4af37] text-[#d4af37]"
                >
                  {redemption.points} {t.points}
                </Badge>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-[#475569]">
            <AlertCircle className="w-12 h-12 mb-2" />
            <p className="text-sm">
              {language === "en"
                ? "No available rewards"
                : "لا توجد مكافآت متاحة"}
            </p>
          </div>
        )}
      </div>

      {/* Redeemed Codes History */}
      <div className="flex-1">
        <h3
          className={`text-sm text-[#cbd5e1] mb-3 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t.redeemedCodes}
        </h3>
        {isLoadingRedemptions ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#8b5cf6] animate-spin" />
          </div>
        ) : redeemedCodes.length > 0 ? (
          <div className="space-y-2">
            {redeemedCodes.map((redemption, index) => (
              <motion.div
                key={redemption.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 bg-[#1e293b]/30 rounded-lg border border-[#334155] ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex items-center gap-3 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-8 h-8 bg-[#14b8a6]/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#14b8a6]" />
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <p className="text-sm text-[#fef3c7]">
                      {redemption.code || redemption.title}
                    </p>
                    <p className="text-xs text-[#cbd5e1]">
                      {formatDateForDisplay(
                        redemption.updated_at || redemption.created_at || "",
                        language
                      )}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-[#14b8a6]">
                  +{redemption.points} {t.points}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-[#475569]">
            <AlertCircle className="w-12 h-12 mb-2" />
            <p className="text-sm">{t.noHistory}</p>
          </div>
        )}
      </div>
    </div>
  );
}
