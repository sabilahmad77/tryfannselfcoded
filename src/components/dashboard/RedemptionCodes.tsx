import { useState } from "react";
import { motion } from "motion/react";
import { Gift, Sparkles, Check, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/useLanguage";

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
    },
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
    },
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
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleRedeem = async () => {
    if (!code.trim()) {
      toast.error(t.messages.invalid);
      return;
    }

    setIsRedeeming(true);

    // Simulate API call
    setTimeout(() => {
      const validCodes = ["FANN2024", "EARLYBIRD", "ARTLOVER"];

      if (validCodes.includes(code.toUpperCase())) {
        toast.success(t.messages.success);
        setCode("");
      } else if (t.codes.some((c) => c.code === code.toUpperCase())) {
        toast.error(t.messages.alreadyUsed);
      } else {
        toast.error(t.messages.invalid);
      }

      setIsRedeeming(false);
    }, 1000);
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
            disabled={isRedeeming || !code.trim()}
            className="bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] hover:from-[#ec4899] hover:to-[#8b5cf6] text-white transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {t.redeem}
          </Button>
        </div>
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
        <div className="space-y-2">
          {t.rewards.map((reward, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center justify-between p-3 bg-gradient-to-r from-[#1e293b]/50 to-[#8b5cf6]/10 rounded-lg border border-[#8b5cf6]/30 ${
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
                <span className="text-sm text-[#fef3c7]">{reward.name}</span>
              </div>
              <Badge
                variant="outline"
                className="border-[#d4af37] text-[#d4af37]"
              >
                {reward.points} {t.points}
              </Badge>
            </motion.div>
          ))}
        </div>
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
        {t.codes.length > 0 ? (
          <div className="space-y-2">
            {t.codes.map((item, index) => (
              <motion.div
                key={index}
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
                    <p className="text-sm text-[#fef3c7]">{item.code}</p>
                    <p className="text-xs text-[#cbd5e1]">{item.date}</p>
                  </div>
                </div>
                <span className="text-sm text-[#14b8a6]">{item.reward}</span>
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
