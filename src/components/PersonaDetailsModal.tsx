import { motion } from "motion/react";
import {
  Palette,
  Building2,
  Diamond,
  Megaphone,
  ArrowRight,
  CheckCircle2,
  X,
} from "lucide-react";
import { CustomModal } from "./ui/CustomModal";
import { useLanguage } from "@/contexts/useLanguage";
import { Button } from "./ui/button";

interface PersonaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  personaId?: string;
  language: "en" | "ar";
  onNavigateToSignUp?: (personaId?: string) => void;
}

const personaDetails = {
  en: {
    artist: {
      headline: "Build a Career, Not Just a Sale",
      sub: "Founding artists secure early advantage before the marketplace opens.",
      benefits: [
        "Verified artist status — identity protection + collector confidence",
        "Royalties beyond the first sale — resale-ready economics",
        "Founding visibility — priority placement, featured windows, curated spotlights",
        "Founder terms — reduced commission during the founding window",
        "Priority support — onboarding + handling that respects artists",
      ],
      earnPointsBy: [
        "verify profile",
        "complete portfolio",
        "add artwork details",
        "refer collectors",
        "missions/events",
        "community participation",
      ],
      cta: "Start as a Founding Artist",
      microcopy: "Join → complete 3 missions → unlock your first tier.",
      gradient: "from-amber-500 via-yellow-500 to-amber-600",
      accentColor: "#C59B48",
      icon: Palette,
      name: "Artists",
    },
    gallery: {
      headline: "Inventory Meets Provenance",
      sub: "Digital order for real art — without losing curatorial control.",
      benefits: [
        "Inventory sync + digital cataloging — clean records per piece",
        "One-click publishing — no duplicate workflows",
        "Shared royalty model — artist-first, gallery-aligned",
        "Early partner benefits — lower commissions, priority listings, dedicated onboarding",
        "Ranked visibility — reputation-based, not pay-to-play",
      ],
      earnPointsBy: [
        "verify gallery",
        "upload catalog",
        "invite artists",
        "curation programs",
        "maintain trust signals",
      ],
      cta: "Join as Founding Gallery / Museum",
      microcopy: undefined,
      gradient: "from-yellow-500 via-amber-500 to-yellow-600",
      accentColor: "#eab308",
      icon: Building2,
      name: "Galleries & Museums",
    },
    collector: {
      headline: "Buy with Confidence. Collect with Certainty.",
      sub: "Collecting should feel inspiring — not uncertain.",
      benefits: [
        "Verified art only at launch — no exceptions",
        "Provenance-first records — protects authenticity and value",
        "Tiered access + private drops — VIP previews, early access",
        "Protected logistics — insured shipping programs (phase rollout)",
        "Founder advantages — lower fees, priority access, bonus rewards",
      ],
      earnPointsBy: [
        "complete profile",
        "preferences",
        "referrals",
        "previews/events",
        "verified purchases (launch)",
      ],
      cta: "Become a Founding Collector",
      microcopy: undefined,
      gradient: "from-amber-600 via-yellow-600 to-amber-700",
      accentColor: "#d97706",
      icon: Diamond,
      name: "Collectors",
    },
    ambassador: {
      headline: "Earn Status by Building the Ecosystem",
      sub: "We reward the people who bring serious artists, collectors, and galleries early.",
      benefits: [
        "Referral rewards — points + programs by tier",
        "Leaderboard recognition — weekly/monthly/all-time",
        "Exclusive access — drops, VIP previews, partner perks",
        "Events & invitations — curated experiences for top ranks",
        "Real monetization — tier-based programs announced in phases",
      ],
      earnPointsBy: [
        "invite verified members",
        "activate referrals",
        "missions",
        "community leadership",
        "events",
      ],
      cta: "Become an Ambassador",
      microcopy: "Copy your code → invite 3 → unlock your next tier faster.",
      gradient: "from-amber-400 via-yellow-400 to-amber-500",
      accentColor: "#fbbf24",
      icon: Megaphone,
      name: "Ambassadors",
    },
  },
  ar: {
    artist: {
      headline: "ابنِ مسيرة مهنية، وليس مجرد بيع",
      sub: "الفنانون المؤسسون يضمنون ميزة مبكرة قبل فتح السوق.",
      benefits: [
        "حالة فنان موثق — حماية الهوية + ثقة المقتنين",
        "إتاوات تتجاوز البيع الأول — اقتصاديات جاهزة لإعادة البيع",
        "الظهور المؤسس — وضع أولوية، نوافذ مميزة، أضواء منسقة",
        "شروط المؤسس — عمولة مخفضة خلال النافذة المؤسسة",
        "دعم ذو أولوية — إعداد + معاملة تحترم الفنانين",
      ],
      earnPointsBy: [
        "التحقق من الملف الشخصي",
        "إكمال المحفظة",
        "إضافة تفاصيل العمل الفني",
        "إحالة المقتنين",
        "المهام/الأحداث",
        "المشاركة المجتمعية",
      ],
      cta: "ابدأ كفنان مؤسس",
      microcopy: "انضم → أكمل 3 مهام → افتح مستواك الأول.",
      gradient: "from-amber-500 via-yellow-500 to-amber-600",
      accentColor: "#C59B48",
      icon: Palette,
      name: "الفنانون",
    },
    gallery: {
      headline: "المخزون يلتقي بالمصداقية",
      sub: "نظام رقمي للفن الحقيقي — دون فقدان السيطرة التنسيقية.",
      benefits: [
        "مزامنة المخزون + الفهرسة الرقمية — سجلات نظيفة لكل قطعة",
        "نشر بنقرة واحدة — لا تدفقات عمل مكررة",
        "نموذج إتاوات مشترك — الفنان أولاً، متوافق مع المعرض",
        "فوائد الشريك المبكر — عمولات أقل، قوائم أولوية، إعداد مخصص",
        "ظهور مصنف — قائم على السمعة، وليس الدفع مقابل اللعب",
      ],
      earnPointsBy: [
        "التحقق من المعرض",
        "رفع الكتالوج",
        "دعوة الفنانين",
        "برامج التنسيق",
        "الحفاظ على إشارات الثقة",
      ],
      cta: "انضم كمعرض/متحف مؤسس",
      microcopy: undefined,
      gradient: "from-yellow-500 via-amber-500 to-yellow-600",
      accentColor: "#eab308",
      icon: Building2,
      name: "المعارض والمتاحف",
    },
    collector: {
      headline: "اشتر بثقة. اجمع بيقين.",
      sub: "الاقتناء يجب أن يشعر بالإلهام — وليس بالشك.",
      benefits: [
        "فن موثق فقط عند الإطلاق — لا استثناءات",
        "سجلات المصداقية أولاً — تحمي الأصالة والقيمة",
        "وصول متدرج + إصدارات خاصة — معاينات VIP، وصول مبكر",
        "لوجستيات محمية — برامج شحن مؤمنة (طرح تدريجي)",
        "مزايا المؤسس — رسوم أقل، وصول ذو أولوية، مكافآت إضافية",
      ],
      earnPointsBy: [
        "إكمال الملف الشخصي",
        "التفضيلات",
        "الإحالات",
        "المعاينات/الأحداث",
        "المشتريات الموثقة (الإطلاق)",
      ],
      cta: "كن مقتنياً مؤسساً",
      microcopy: undefined,
      gradient: "from-amber-600 via-yellow-600 to-amber-700",
      accentColor: "#d97706",
      icon: Diamond,
      name: "المقتنون",
    },
    ambassador: {
      headline: "اكسب المكانة ببناء النظام البيئي",
      sub: "نكافئ الأشخاص الذين يجلبون فنانين ومقتنين ومعارض جادين مبكراً.",
      benefits: [
        "مكافآت الإحالة — نقاط + برامج حسب المستوى",
        "اعتراف لوحة المتصدرين — أسبوعي/شهري/طوال الوقت",
        "وصول حصري — إصدارات، معاينات VIP، مزايا الشريك",
        "الأحداث والدعوات — تجارب منسقة للرتب العليا",
        "تحقيق الربح الحقيقي — برامج قائمة على المستوى تُعلن على مراحل",
      ],
      earnPointsBy: [
        "دعوة أعضاء موثقين",
        "تفعيل الإحالات",
        "المهام",
        "القيادة المجتمعية",
        "الأحداث",
      ],
      cta: "كن سفيراً",
      microcopy: "انسخ رمزك → ادعُ 3 → افتح مستواك التالي أسرع.",
      gradient: "from-amber-400 via-yellow-400 to-amber-500",
      accentColor: "#fbbf24",
      icon: Megaphone,
      name: "السفراء",
    },
  },
};

export function PersonaDetailsModal({
  isOpen,
  onClose,
  personaId,
  language,
  onNavigateToSignUp,
}: PersonaDetailsModalProps) {
  const { language: contextLanguage } = useLanguage();
  const isRTL = (language || contextLanguage) === "ar";
  const lang = language || contextLanguage;

  if (!personaId) return null;

  const personaData = personaDetails[lang]?.[personaId as keyof typeof personaDetails.en];
  if (!personaData) return null;

  const Icon = personaData.icon;

  const handleGetStarted = () => {
    onNavigateToSignUp?.(personaId);
    onClose();
  };

  const customHeader = (
    <div className="relative p-6 border-b border-[#4e4e4e78]">
      <div
        className={`flex items-center gap-4 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <motion.div
          className="relative inline-block"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${personaData.gradient} blur-xl`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div
            className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${personaData.gradient} flex items-center justify-center shadow-2xl border border-white/20`}
          >
            <Icon className="w-7 h-7 text-white" />
            <motion.div
              className="absolute inset-0 bg-white rounded-2xl"
              animate={{
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>
        <h2
          className={`text-2xl text-[#ffffff] flex-1 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {personaData.name}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-[#808c99] hover:text-[#ffffff] hover:bg-[#1D112A] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );

  const footer = (
    <div className={`w-full ${isRTL ? "text-right" : "text-left"}`}>
      <motion.button
        onClick={handleGetStarted}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative w-full group/btn overflow-hidden rounded-xl cursor-pointer"
      >
        <div
          className={`absolute inset-0 bg-gradient-to-r ${personaData.gradient} opacity-100 group-hover/btn:opacity-100 transition-opacity`}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
        <div className="relative px-6 py-3.5 flex items-center justify-center gap-2">
          <span className="text-white text-base font-medium">
            {personaData.cta}
          </span>
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </motion.div>
        </div>
      </motion.button>
    </div>
  );

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      header={customHeader}
      footer={footer}
      size="xl"
      maxHeight="max-h-[90vh]"
      showCloseButton={false}
      contentClassName="p-6 bg-[#1D112A]"
      className="border border-[#4e4e4e78]"
    >
      <div className="space-y-6">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={isRTL ? "text-right" : "text-left"}
        >
          <h3 className="text-3xl sm:text-4xl text-white font-bold mb-3">
            {personaData.headline}
          </h3>
          <p className="text-white/60 text-base sm:text-lg">
            {personaData.sub}
          </p>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={isRTL ? "text-right" : "text-left"}
        >
          <h4 className="text-lg text-white font-semibold mb-4">
            {language === "en" ? "Guarantees/Benefits" : "الضمانات/الفوائد"}
          </h4>
          <ul className="space-y-3">
            {personaData.benefits.map((benefit, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className={`flex items-start gap-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <CheckCircle2
                  className="w-5 h-5 shrink-0 mt-0.5"
                  style={{ color: personaData.accentColor }}
                />
                <span className="text-white/70 text-sm leading-relaxed">
                  {benefit}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Earn Points By Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={isRTL ? "text-right" : "text-left"}
        >
          <h4 className="text-lg text-white font-semibold mb-4">
            {language === "en" ? "Earn points by:" : "اكسب النقاط من خلال:"}
          </h4>
          <ul className="space-y-2.5">
            {personaData.earnPointsBy.map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * idx + 0.3 }}
                className={`flex items-center gap-2.5 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: personaData.accentColor }}
                />
                <span className="text-white/60 text-sm">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Microcopy */}
        {personaData.microcopy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className={`pt-4 border-t border-[#4e4e4e78] ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <p className="text-white/50 text-xs sm:text-sm italic">
              {personaData.microcopy}
            </p>
          </motion.div>
        )}
      </div>
    </CustomModal>
  );
}

