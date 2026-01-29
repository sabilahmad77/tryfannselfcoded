import { useLanguage } from "@/contexts/useLanguage";
import {
  useGetRedemptionsQuery,
  // useGetMyRedeemListQuery,
  useUserRedemptionMutation,
  // useGenerateRedeemCodeMutation,
  type Redemption,
} from "@/services/api/dashboardApi";
import { formatDateForDisplay } from "@/utils/dateUtils";
import {
  AlertCircle,
  Check,
  Gift,
  Loader2,
  Sparkles
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

const content = {
  en: {
    title: "Redemption Codes",
    description: "Redeem codes for exclusive rewards",
    enterCode: "Enter Code",
    redeem: "Redeem",
    redeemedCodes: "Redeemed Codes",
    myRedeemList: "My Redeem List",
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
    myRedeemList: "قائمة الاسترداد الخاصة بي",
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
  // const [showGenerateForm, setShowGenerateForm] = useState(false);
  // const [generateTitle, setGenerateTitle] = useState("");
  // const [generatePoints, setGeneratePoints] = useState("");
  // const [generatedCode, setGeneratedCode] = useState<Redemption | null>(null);

  // Fetch available redemptions from API
  const {
    data: redemptionsData,
    isLoading: isLoadingRedemptions,
  } = useGetRedemptionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Fetch my redeem list from API
  // const {
  //   data: myRedeemListData,
  //   isLoading: isLoadingMyRedeemList,
  //   isError: isMyRedeemListError,
  // } = useGetMyRedeemListQuery(undefined, {
  //   refetchOnMountOrArgChange: true,
  // });

  // User redemption mutation
  const [userRedemption, { isLoading: isRedeeming }] =
    useUserRedemptionMutation();

  // Generate redeem code mutation
  // const [generateRedeemCode, { isLoading: isGenerating }] =
  //   useGenerateRedeemCodeMutation();

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
  // const availableRedemptions = useMemo(() => {
  //   return allRedemptions.filter(
  //     (r) => r.is_completed === false || r.is_completed === undefined
  //   );
  // }, [allRedemptions]);

  // Filter available redemptions based on search code input
  // const filteredAvailableRedemptions = useMemo(() => {
  //   if (!code.trim()) {
  //     return availableRedemptions;
  //   }
  //   const searchTerm = code.trim().toUpperCase();
  //   return availableRedemptions.filter(
  //     (r) =>
  //       r.code?.toUpperCase().includes(searchTerm) ||
  //       r.title?.toUpperCase().includes(searchTerm)
  //   );
  // }, [availableRedemptions, code]);

  // Filter redeemed codes (is_completed === true)
  const redeemedCodes = useMemo(() => {
    return allRedemptions.filter((r) => r.is_completed === true);
  }, [allRedemptions]);

  // Parse my redeem list from API response
  // const myRedeemList = useMemo(() => {
  //   if (!myRedeemListData?.data) return [];

  //   // Handle both array and single object responses
  //   const data = myRedeemListData.data;
  //   if (Array.isArray(data)) {
  //     return data;
  //   }
  //   // If single object, wrap in array
  //   return [data as Redemption];
  // }, [myRedeemListData]);

  // Handle clicking on available reward to populate code field
  // const handleRewardClick = (redemptionCode: string) => {
  //   setCode(redemptionCode.toUpperCase());
  // };

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

  // const handleGenerateCode = async () => {
  //   if (!generateTitle.trim()) {
  //     toast.error(
  //       language === "en"
  //         ? "Please enter a code title"
  //         : "يرجى إدخال عنوان الكود"
  //     );
  //     return;
  //   }

  //   const points = parseInt(generatePoints, 10);
  //   if (!generatePoints.trim() || isNaN(points) || points <= 0) {
  //     toast.error(
  //       language === "en"
  //         ? "Please enter valid points"
  //         : "يرجى إدخال نقاط صالحة"
  //     );
  //     return;
  //   }

  //   try {
  //     const result = await generateRedeemCode({
  //       title: generateTitle.trim(),
  //       points: points,
  //     }).unwrap();

  //     if (result.success && result.data) {
  //       toast.success(t.messages.generateSuccess);
  //       setGeneratedCode(result.data);
  //       setGenerateTitle("");
  //       setGeneratePoints("");
  //       setShowGenerateForm(false);
  //       // Auto-populate the code field with the generated code
  //       if (result.data.code) {
  //         setCode(result.data.code.toUpperCase());
  //       }
  //     } else {
  //       const errorMessage =
  //         typeof result.message === "string"
  //           ? result.message
  //           : t.messages.generateError;
  //       toast.error(errorMessage);
  //     }
  //   } catch (error: unknown) {
  //     console.error("Error generating code:", error);
  //     if (error && typeof error === "object" && "data" in error) {
  //       const errorData = error.data as {
  //         message?: string;
  //         detail?: string;
  //         [key: string]: unknown;
  //       };
  //       const errorMessage =
  //         errorData?.message ||
  //         errorData?.detail ||
  //         (typeof errorData === "string"
  //           ? errorData
  //           : t.messages.generateError);
  //       toast.error(errorMessage);
  //     } else {
  //       toast.error(t.messages.generateError);
  //     }
  //   }
  // };

  // const handleCopyCode = async (codeToCopy: string) => {
  //   try {
  //     await navigator.clipboard.writeText(codeToCopy);
  //     toast.success(t.messages.codeCopied);
  //   } catch (error) {
  //     console.error("Failed to copy code:", error);
  //     toast.error(language === "en" ? "Failed to copy code" : "فشل نسخ الكود");
  //   }
  // };

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      {/* Header */}
      <div
        className={`flex items-center gap-3 mb-4 ${isRTL ? "flex-row-reverse" : ""
          }`}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-[#9375b5] to-[#fface3] rounded-xl flex items-center justify-center">
          <Gift className="w-6 h-6 text-white" />
        </div>
        <div className={isRTL ? "text-right" : "text-left"}>
          <h2 className="text-2xl text-[#ffffff]">{t.title}</h2>
          <p className="text-sm text-[#808c99]">{t.description}</p>
        </div>
      </div>

      {/* Code Input */}
      <div className="mb-6">
        <label
          className={`text-sm text-[#808c99] mb-2 block ${isRTL ? "text-right" : "text-left"
            }`}
        >
          {t.enterCode}
        </label>
        <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="XXXXXX"
            className="flex-1 bg-[#0B0B0D] border-[#4e4e4e78] text-[#ffffff] placeholder:text-[#808c99] focus:border-[#9375b5] uppercase"
            onKeyPress={(e) => e.key === "Enter" && handleRedeem()}
          />
          <Button
            onClick={handleRedeem}
            disabled={isRedeeming || !code.trim() || isLoadingRedemptions}
            className={`hover:shadow-lg hover:shadow-primary/50 transition-all duration-200 disabled:opacity-50 disabled:hover:shadow-none ${isRedeeming || !code.trim() || isLoadingRedemptions
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

      {/* Generate Code Section - COMMENTED OUT */}
      {/* <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3
            className={`text-sm text-[#808c99] ${
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
            className={`border-[#9375b5] text-[#9375b5] hover:bg-[#9375b5]/20 hover:border-[#7a5f9a] hover:text-[#7a5f9a] transition-all duration-200 cursor-pointer ${
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
            className="bg-[#1D112A]/50 rounded-lg p-4 border border-[#9375b5]/30 space-y-4"
          >
            <p className="text-xs text-[#808c99] mb-3">
              {t.generateDescription}
            </p>
            <div className="space-y-3">
              <div>
                <label
                  className={`text-xs text-[#808c99] mb-2 block ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t.codeTitle}
                </label>
                <Input
                  value={generateTitle}
                  onChange={(e) => setGenerateTitle(e.target.value)}
                  placeholder={
                    language === "en" ? "Enter code title" : "أدخل عنوان الكود"
                  }
                  className="bg-[#0B0B0D] border-[#4e4e4e78] text-[#ffffff] placeholder:text-[#808c99] focus:border-[#9375b5]"
                />
              </div>
              <div>
                <label
                  className={`text-xs text-[#808c99] mb-2 block ${
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
                  className="bg-[#0B0B0D] border-[#4e4e4e78] text-[#ffffff] placeholder:text-[#808c99] focus:border-[#9375b5]"
                  min="1"
                />
              </div>
              <Button
                onClick={handleGenerateCode}
                disabled={
                  isGenerating ||
                  !generateTitle.trim() ||
                  !generatePoints.trim()
                }
                className={`w-full bg-gradient-to-r from-[#9375b5] to-[#fface3] hover:from-[#fface3] hover:to-[#9375b5] hover:shadow-lg hover:shadow-[#9375b5]/50 text-white transition-all duration-200 disabled:opacity-50 disabled:hover:shadow-none ${
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

        {generatedCode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-gradient-to-r from-[#9375b5]/20 to-[#fface3]/20 rounded-lg p-4 border border-[#9375b5]/50"
          >
            <div
              className={`flex items-center justify-between ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div className={isRTL ? "text-right" : "text-left"}>
                <p className="text-xs text-[#808c99] mb-1">{t.generatedCode}</p>
                <p className="text-lg font-bold text-[#ffffff]">
                  {generatedCode.code}
                </p>
                <p className="text-sm text-[#808c99] mt-1">
                  {generatedCode.title} - {generatedCode.points} {t.points}
                </p>
              </div>
              <Button
                onClick={() => handleCopyCode(generatedCode.code || "")}
                variant="outline"
                size="sm"
                className="border-[#9375b5] text-[#9375b5] hover:bg-[#9375b5]/20 hover:border-[#7a5f9a] hover:text-[#7a5f9a] hover:scale-110 transition-all duration-200 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div> */}

      {/* My Redeem List - COMMENTED OUT */}
      {/* <div className="mb-6">
        <h3
          className={`text-sm text-[#808c99] mb-3 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t.myRedeemList}
        </h3>
        {isLoadingMyRedeemList ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#9375b5] animate-spin" />
          </div>
        ) : isMyRedeemListError ? (
          <div className="flex flex-col items-center justify-center py-8 text-[#808c99]">
            <AlertCircle className="w-12 h-12 mb-2 text-[#ff6b6b]" />
            <p className="text-sm">
              {language === "en"
                ? "Failed to load my redeem list"
                : "فشل تحميل قائمة الاسترداد"}
            </p>
          </div>
        ) : myRedeemList.length > 0 ? (
          <div className="space-y-2">
            {myRedeemList.map((redemption, index) => (
              <motion.div
                key={redemption.id || index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-[#9375b5]/20 to-[#fface3]/20 rounded-lg p-4 border border-[#9375b5]/50"
              >
                <div
                  className={`flex items-center justify-between ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <p className="text-xs text-[#808c99] mb-1">
                      {redemption.title || redemption.code}
                    </p>
                    <p className="text-lg font-bold text-[#ffffff]">
                      {redemption.code}
                    </p>
                    <p className="text-sm text-[#808c99] mt-1">
                      {redemption.points} {t.points} •{" "}
                      {formatDateForDisplay(
                        redemption.updated_at || redemption.created_at || "",
                        language
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleCopyCode(redemption.code || "")}
                      variant="outline"
                      size="sm"
                      className="border-[#9375b5] text-[#9375b5] hover:bg-[#9375b5]/20 hover:border-[#7a5f9a] hover:text-[#7a5f9a] hover:scale-110 transition-all duration-200 cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <div className="w-10 h-10 bg-[#45e3d3]/30 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#45e3d3]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-[#808c99]">
            <AlertCircle className="w-12 h-12 mb-2" />
            <p className="text-sm">
              {language === "en"
                ? "No redeemed codes yet"
                : "لا توجد أكواد مستبدلة بعد"}
            </p>
          </div>
        )}
      </div> */}

      {/* Available Rewards - COMMENTED OUT */}
      {/* <div className="mb-6">
        <div
          className={`flex items-center justify-between mb-3 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <h3
            className={`text-sm text-[#808c99] ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t.availableRewards}
          </h3>
          {code.trim() && (
            <span className="text-xs text-[#9375b5]">
              {filteredAvailableRedemptions.length}{" "}
              {language === "en" ? "found" : "تم العثور عليها"}
            </span>
          )}
        </div>
        {isLoadingRedemptions ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#9375b5] animate-spin" />
          </div>
        ) : isRedemptionsError ? (
          <div className="flex flex-col items-center justify-center py-8 text-[#808c99]">
            <AlertCircle className="w-12 h-12 mb-2 text-[#ff6b6b]" />
            <p className="text-sm">
              {language === "en"
                ? "Failed to load available rewards"
                : "فشل تحميل المكافآت المتاحة"}
            </p>
          </div>
        ) : filteredAvailableRedemptions.length > 0 ? (
          <div className="space-y-2">
            {filteredAvailableRedemptions.map((redemption, index) => (
              <motion.div
                key={redemption.id || index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleRewardClick(redemption.code || "")}
                className="bg-gradient-to-r from-[#9375b5]/20 to-[#fface3]/20 rounded-lg p-4 border border-[#9375b5]/50 cursor-pointer hover:border-[#9375b5]/80 hover:shadow-lg hover:shadow-[#9375b5]/30 transition-all duration-200"
              >
                <div
                  className={`flex items-center justify-between ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <p className="text-xs text-[#808c99] mb-1">
                      {redemption.title || redemption.code}
                    </p>
                    <p className="text-lg font-bold text-[#ffffff]">
                      {redemption.code}
                    </p>
                    <p className="text-sm text-[#808c99] mt-1">
                      {redemption.points} {t.points}
                    </p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyCode(redemption.code || "");
                    }}
                    variant="outline"
                    size="sm"
                    className="border-[#9375b5] text-[#9375b5] hover:bg-[#9375b5]/20 hover:border-[#7a5f9a] hover:text-[#7a5f9a] hover:scale-110 transition-all duration-200 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : code.trim() ? (
          <div className="flex flex-col items-center justify-center py-8 text-[#808c99]">
            <AlertCircle className="w-12 h-12 mb-2" />
            <p className="text-sm">
              {language === "en"
                ? "No rewards found matching your search"
                : "لم يتم العثور على مكافآت تطابق البحث"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-[#808c99]">
            <AlertCircle className="w-12 h-12 mb-2" />
            <p className="text-sm">
              {language === "en"
                ? "No available rewards"
                : "لا توجد مكافآت متاحة"}
            </p>
          </div>
        )}
      </div> */}

      {/* Redeemed Codes History */}
      <div className="flex-1">
        <h3
          className={`text-sm text-[#808c99] mb-3 ${isRTL ? "text-right" : "text-left"
            }`}
        >
          {t.redeemedCodes}
        </h3>
        {isLoadingRedemptions ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#9375b5] animate-spin" />
          </div>
        ) : redeemedCodes.length > 0 ? (
          <div className="space-y-2">
            {redeemedCodes.map((redemption, index) => (
              <motion.div
                key={redemption.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 bg-[#0B0B0D] rounded-lg border border-[#4e4e4e78] ${isRTL ? "flex-row-reverse" : ""
                  }`}
              >
                <div
                  className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""
                    }`}
                >
                  <div className="w-8 h-8 bg-[#45e3d3]/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#45e3d3]" />
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <p className="text-sm text-[#ffffff]">
                      {redemption.code || redemption.title}
                    </p>
                    <p className="text-xs text-[#808c99]">
                      {formatDateForDisplay(
                        redemption.updated_at || redemption.created_at || "",
                        language
                      )}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-[#45e3d3]">
                  +{redemption.points} {t.points}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-[#808c99]">
            <AlertCircle className="w-12 h-12 mb-2" />
            <p className="text-sm">{t.noHistory}</p>
          </div>
        )}
      </div>
    </div>
  );
}
