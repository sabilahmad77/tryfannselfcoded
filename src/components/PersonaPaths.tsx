import { motion } from "motion/react";
import {
  Palette,
  Building2,
  Diamond,
  Megaphone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface PersonaPathsProps {
  language: "en" | "ar";
  onNavigateToSignUp?: (personaId?: string) => void;
}

const content = {
  en: {
    title: { white: "Choose Your Path", gold: " Tailored Experiences for Every Participant" },
    subtitle: "Whether you're an artist, collector, or curator, FANN offers a personalized journey designed to enhance your art experience. Choose your path and unlock the resources, support, and community that’s perfect for you.",
    personas: [
      {
        id: "artist",
        icon: Palette,
        name: "Artists",
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
        gradient: "from-amber-500 via-yellow-500 to-amber-600",
        accentColor: "#C59B48",
      },
      {
        id: "gallery",
        icon: Building2,
        name: "Galleries & Museums",
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
        gradient: "from-yellow-500 via-amber-500 to-yellow-600",
        accentColor: "#eab308",
      },
      {
        id: "collector",
        icon: Diamond,
        name: "Collectors",
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
        gradient: "from-amber-600 via-yellow-600 to-amber-700",
        accentColor: "#d97706",
      },
      {
        id: "ambassador",
        icon: Megaphone,
        name: "Ambassadors",
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
        gradient: "from-amber-400 via-yellow-400 to-amber-500",
        accentColor: "#fbbf24",
      },
    ],
  },
  ar: {
    title: { white: "اختر مسارك", gold: " تجارب مخصصة لكل مشارك" },
    subtitle: "سواء كنت فنانًا أو جامعًا أو منسقًا، تقدم FANN رحلة مخصصة مصممة لتعزيز تجربة الفن الخاصة بك. اختر مسارك وافتح الموارد والدعم والمجتمع المثالي لك.",
    personas: [
      {
        id: "artist",
        icon: Palette,
        name: "الفنانون",
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
        gradient: "from-amber-500 via-yellow-500 to-amber-600",
        accentColor: "#C59B48",
      },
      {
        id: "gallery",
        icon: Building2,
        name: "المعارض والمتاحف",
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
        gradient: "from-yellow-500 via-amber-500 to-yellow-600",
        accentColor: "#eab308",
      },
      {
        id: "collector",
        icon: Diamond,
        name: "المقتنون",
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
        gradient: "from-amber-600 via-yellow-600 to-amber-700",
        accentColor: "#d97706",
      },
      {
        id: "ambassador",
        icon: Megaphone,
        name: "السفراء",
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
        gradient: "from-amber-400 via-yellow-400 to-amber-500",
        accentColor: "#fbbf24",
      },
    ],
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export function PersonaPaths({
  language,
  onNavigateToSignUp,
}: PersonaPathsProps) {
  const t = content[language];
  const isRTL = language === "ar";
  
  // Order personas for 2x2 grid: Artist, Gallery (top row), Collector, Ambassador (bottom row)
  const orderedPersonas = [
    t.personas.find(p => p.id === "artist"),
    t.personas.find(p => p.id === "gallery"),
    t.personas.find(p => p.id === "collector"),
    t.personas.find(p => p.id === "ambassador"),
  ].filter(Boolean) as typeof t.personas;

  return (
    <section
      className="relative py-12 overflow-hidden w-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Subtle background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-[#C59B48]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-[#C59B48]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          <h2 className="mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl font-heading font-semibold">
            <span className="text-[#F2F2F3] font-heading font-semibold">{t.title.white}</span>
            <span className="text-[#C59B48] font-heading font-semibold">{t.title.gold}</span>
          </h2>
          <p className="text-[#B9BBC6] max-w-4xl mx-auto text-base sm:text-lg px-4 font-body font-normal">
            {t.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {orderedPersonas.map((persona) => {
            const Icon = persona.icon;
            return (
              <motion.div
                key={persona.id}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="group relative"
              >
                {/* Main Card Container */}
                <div className="relative h-full rounded-3xl overflow-hidden">

                  {/* Card Content */}
                  <div 
                    className="relative bg-[#191922] rounded-3xl overflow-hidden h-full border border-[#2A2A3A] group/card transition-all duration-300"
                    style={{ 
                      boxShadow: '0 0 0 1px rgba(197,155,72,0), 0 18px 60px rgba(0,0,0,0.55)'
                    }}
                  >
                    {/* Hover Glow Effect */}
                    <div 
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" 
                      style={{ boxShadow: '0 0 0 1px rgba(197,155,72,0.20), 0 18px 60px rgba(0,0,0,0.55)' }} 
                    />

                    {/* Main Content */}
                    <div className="relative z-10 p-4 sm:p-5 md:p-6 flex flex-col h-full">
                      {/* Icon and Name - Center */}
                      <div className="flex flex-col items-center mb-3 sm:mb-4">
                        <motion.div
                          className="relative inline-block mb-3 sm:mb-4"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Outer Glow Ring */}
                          <motion.div
                            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${persona.gradient} blur-xl`}
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

                          {/* Icon Container */}
                          <div
                            className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${persona.gradient} flex items-center justify-center shadow-2xl border border-white/20`}
                          >
                            <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                          </div>
                        </motion.div>

                        {/* Name */}
                        <h3 className="text-[#F2F2F3] text-lg sm:text-xl md:text-2xl font-heading font-semibold text-center">
                          {persona.name}
                        </h3>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-[#2A2A3A] mb-3 sm:mb-4" />

                      {/* Two Column Layout: Benefits Left, Earn Points By Right */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 flex-1">
                        {/* Left Column - Founder Benefits */}
                        <div className="min-w-0">
                          <h4 className="text-[#F2F2F3] text-xs sm:text-sm font-medium mb-2 sm:mb-3 font-body">
                            {language === "en" ? "Founder Benefits" : "فوائد المؤسس"}
                          </h4>
                          <ul className="space-y-1.5 sm:space-y-2">
                            {persona.benefits.map((benefit, idx) => {
                              const benefitText = benefit.split(" — ")[0];
                              const capitalizedText = benefitText.charAt(0).toUpperCase() + benefitText.slice(1);
                              return (
                                <li
                                  key={idx}
                                  className="flex items-start gap-1.5 sm:gap-2"
                                >
                                  <CheckCircle2
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5 text-[#C59B48]"
                                  />
                                  <span className="text-[#B9BBC6] text-xs leading-relaxed font-body font-normal break-words">
                                    {capitalizedText}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {/* Right Column - How to Earn Points */}
                        <div className="min-w-0">
                          <h4 className="text-[#F2F2F3] text-xs sm:text-sm font-medium mb-2 sm:mb-3 font-body">
                            {language === "en" ? "How to Earn Points" : "كيفية كسب النقاط"}
                          </h4>
                          <ul className="space-y-1.5 sm:space-y-2">
                            {persona.earnPointsBy.map((item, idx) => {
                              const capitalizedText = item.charAt(0).toUpperCase() + item.slice(1);
                              return (
                                <li
                                  key={idx}
                                  className="flex items-start gap-1.5 sm:gap-2"
                                >
                                  <div
                                    className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 bg-[#C59B48]"
                                  />
                                  <span className="text-[#B9BBC6] text-xs leading-relaxed font-body font-normal break-words">
                                    {capitalizedText}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToSignUp?.(persona.id);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative w-full group/btn overflow-hidden rounded-lg sm:rounded-xl cursor-pointer"
                      >
                        {/* Button Background */}
                        <div
                          className="absolute inset-0 bg-[#C59B48] group-hover/btn:bg-[#D6AE5A] transition-colors"
                        />

                        {/* Shimmer Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />

                        {/* Button Content */}
                        <div className="relative px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3.5 flex items-center justify-center gap-2">
                          <span className="text-[#0B0B0D] text-xs sm:text-sm md:text-base font-body font-medium text-center">
                            {persona.cta}
                          </span>
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 text-[#0B0B0D] ${isRTL ? 'rotate-180' : ''}`} />
                          </motion.div>
                        </div>
                      </motion.button>

                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
