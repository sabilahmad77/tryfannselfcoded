import { motion } from "motion/react";
import { useState } from "react";
import {
  Palette,
  Building2,
  Diamond,
  Megaphone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import bgImage from "figma:asset/18b1d776f4ce826bfa3453d71d5a597f3dc3dd2b.png";
import { PersonaDetailsModal } from "./PersonaDetailsModal";

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
        gradient: "from-amber-500 via-yellow-500 to-amber-600",
        accentColor: "#ffcc33",
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
        gradient: "from-amber-400 via-yellow-400 to-amber-500",
        accentColor: "#fbbf24",
      },
    ],
    cta: "Start Your Journey",
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
        gradient: "from-amber-500 via-yellow-500 to-amber-600",
        accentColor: "#ffcc33",
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
        gradient: "from-amber-400 via-yellow-400 to-amber-500",
        accentColor: "#fbbf24",
      },
    ],
    cta: "ابدأ رحلتك",
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
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  return (
    <section
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-[#0F021C]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Abstract Art Background Pattern */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={bgImage}
          alt="Abstract Art Pattern"
          className="w-full h-full object-cover opacity-80"
          style={{ transform: "scaleY(-1)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F021C]/40 via-transparent to-[#0F021C]/40" />
      </div>

      {/* Background gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-[#ffcc33]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-[#fbbf24]/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl font-heading">
            <span className="text-white">{t.title.white}</span>
            <span className="text-[#ffcc33]">{t.title.gold}</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base sm:text-lg px-4 font-body">
            {t.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto"
        >
          {t.personas.map((persona, index) => {
            const Icon = persona.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -12,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="group relative cursor-pointer"
                onClick={() => setSelectedPersona(persona.id)}
              >
                {/* Main Card Container */}
                <div className="relative h-full rounded-3xl overflow-hidden">
                  {/* Animated Border Gradient */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl p-0.5"
                    style={{
                      background: `linear-gradient(135deg, ${persona.accentColor}40, transparent, ${persona.accentColor}40)`,
                    }}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="w-full h-full rounded-3xl bg-[#0F021C]" />
                  </motion.div>

                  {/* Card Content */}
                  <div className="relative backdrop-blur-2xl bg-gradient-to-br from-[#1a1a2e]/95 via-[#16213e]/90 to-[#0f1624]/95 rounded-3xl overflow-hidden h-full">
                    {/* Glass Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent" />

                    {/* Scan Line Effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      initial={{ backgroundPosition: "0% 0%" }}
                      whileHover={{
                        backgroundPosition: ["0% 0%", "0% 100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        background: `linear-gradient(180deg, transparent 0%, ${persona.accentColor}15 50%, transparent 100%)`,
                        backgroundSize: "100% 50px",
                      }}
                    />

                    {/* Main Content */}
                    <div className="relative z-10 p-6 sm:p-7 md:p-8 flex flex-col h-full">
                      {/* Icon Section */}
                      <div className="mb-5 sm:mb-6">
                        <motion.div
                          className="relative inline-block"
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
                            className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${persona.gradient} flex items-center justify-center shadow-2xl border border-white/20`}
                          >
                            <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />

                            {/* Inner Shimmer */}
                            <motion.div
                              className="absolute inset-0 bg-white rounded-xl sm:rounded-2xl"
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
                      </div>

                      {/* Title Section */}
                      <div className="mb-5 sm:mb-6">
                        <h3 className="text-white text-xl sm:text-2xl mb-1.5 sm:mb-2 font-heading">
                          {persona.name}
                        </h3>
                      </div>

                      {/* Divider */}
                      <div
                        className={`h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-5 sm:mb-6`}
                      />

                      {/* Benefits List */}
                      <div className="grow mb-5 sm:mb-6">
                        <ul className="space-y-2.5 sm:space-y-3">
                          {persona.benefits.map((benefit, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-2.5 sm:gap-3"
                            >
                              <CheckCircle2
                                className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5`}
                                style={{ color: persona.accentColor }}
                              />
                              <span className="text-white/70 text-sm leading-relaxed font-body">
                                {benefit.split(" — ")[0]}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
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
                          className={`absolute inset-0 bg-gradient-to-r ${persona.gradient} opacity-100 group-hover/btn:opacity-100 transition-opacity`}
                        />

                        {/* Shimmer Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />

                        {/* Button Content */}
                        <div className="relative px-5 py-3 sm:px-6 sm:py-3.5 flex items-center justify-center gap-2">
                          <span className="text-white text-sm sm:text-base font-body">
                            {t.cta}
                          </span>
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </motion.div>
                        </div>
                      </motion.button>

                      {/* Bottom Corner Accent */}
                      <motion.div
                        className={`absolute -bottom-12 sm:-bottom-16 -right-12 sm:-right-16 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br ${persona.gradient} opacity-15 blur-3xl`}
                        animate={{
                          scale: [1, 1.3, 1],
                          rotate: [0, 90, 0],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Persona Details Modal */}
      <PersonaDetailsModal
        isOpen={selectedPersona !== null}
        onClose={() => setSelectedPersona(null)}
        personaId={selectedPersona || undefined}
        language={language}
        onNavigateToSignUp={onNavigateToSignUp}
      />
    </section>
  );
}
