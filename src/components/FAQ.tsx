import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import bgImage from "figma:asset/3fa9b9de7e4b1421a708a7c88cd0672cee3504e2.png";
import { useGetProgressionQuery } from "@/services/api/dashboardApi";

interface FAQProps {
  language: "en" | "ar";
  onNavigateToSignUp?: () => void;
}

const content = {
  en: {
    title: { white: "Frequently Asked", gold: " Questions" },
    subtitle: "Everything you need to know about TRYFANN",
    faqs: [
      {
        question: "What is TRYFANN?",
        answer:
          "TRYFANN is a gamified pre-launch funnel for the upcoming FANN art-tech platform. It's designed to identify and engage high-value early adopters—artists, galleries, collectors, and institutional partners—before the main platform launches in 4-6 months.",
      },
      {
        question: "How do I earn points?",
        answer:
          "You can earn Influence Points through referrals and community engagement, and Provenance Points through verified participation like completing KYC, uploading portfolios, sharing AR experiences, and participating in platform tasks and challenges.",
      },
      {
        question: "What are the different tiers?",
        answer: "", // Will be dynamically generated from API
      },
      {
        question: "What rewards can I unlock?",
        answer:
          "Rewards range from early platform access and community badges at the Explorer level, to AR gallery slots, digital certificates of authenticity, VIP event invitations, premium SaaS dashboard access, and even revenue share opportunities at the Founding Patron level.",
      },
      {
        question: "How does the referral system work?",
        answer:
          "Share your unique referral code with friends. When they sign up and complete KYC verification, you both earn points. The more qualified referrals you bring, the higher your point multiplier: 50-200 points per referral depending on your tier.",
      },
      {
        question: "Is KYC verification required?",
        answer:
          "KYC verification is required to unlock most tasks and rewards, and to ensure referral authenticity. We use industry-standard verification powered by SumSub to maintain platform integrity and comply with regional regulations.",
      },
      {
        question: "Is TRYFANN available in Arabic?",
        answer:
          "Yes! TRYFANN is fully bilingual, supporting both English and Arabic throughout the entire platform. Simply toggle the language switcher in the header to switch between languages.",
      },
      {
        question: "When will the main FANN platform launch?",
        answer:
          "The main FANN platform is scheduled to launch in 4-6 months. Early adopters who participate in TRYFANN will receive priority access, exclusive benefits, and premium features when the platform goes live.",
      },
      {
        question: "How is my data protected?",
        answer:
          "We take data protection seriously and comply with GDPR and MENA-specific data regulations. All personal information is encrypted, and KYC data is processed through certified third-party providers. We never share your data without explicit consent.",
      },
      {
        question: "Can I participate from any country?",
        answer:
          "TRYFANN is optimized for the MENA/GCC region but welcomes art enthusiasts globally. Some rewards and features may vary by region based on local regulations. Full details are available in our terms of service.",
      },
    ],
  },
  ar: {
    title: { white: "الأسئلة", gold: " الشائعة" },
    subtitle: "كل ما تحتاج لمعرفته حول TRYFANN",
    faqs: [
      {
        question: "ما هو TRYFANN؟",
        answer:
          "TRYFANN هو مسار ما قبل الإطلاق المُلعَّب لمنصة FANN الفنية التقنية القادمة. تم تصميمه لتحديد وإشراك المتبنين الأوائل ذوي القيمة العالية - الفنانين والمعارض والمقتنين والشركاء المؤسسيين - قبل إطلاق المنصة الرئيسية في 4-6 أشهر.",
      },
      {
        question: "كيف أكسب النقاط؟",
        answer:
          "يمكنك كسب نقاط التأثير من خلال الإحالات والمشاركة المجتمعية، ونقاط المصداقية من خلال المشاركة الموثقة مثل إكمال التحقق من الهوية، وتحميل المحفظة، ومشاركة تجارب الواقع المعزز، والمشاركة في مهام وتحديات المنصة.",
      },
      {
        question: "ما هي المستويات المختلفة؟",
        answer: "", // Will be dynamically generated from API
      },
      {
        question: "ما هي المكافآت التي يمكنني فتحها؟",
        answer:
          "تتراوح المكافآت من الوصول المبكر للمنصة وشارات المجتمع في مستوى المستكشف، إلى مساحات معرض الواقع المعزز، وشهادات الأصالة الرقمية، ودعوات أحداث VIP، والوصول إلى لوحة SaaS المميزة، وحتى فرص حصة الإيرادات في مستوى الراعي المؤسس.",
      },
      {
        question: "كيف يعمل نظام الإحالة؟",
        answer:
          "شارك رمز الإحالة الفريد الخاص بك مع الأصدقاء. عندما يسجلون ويكملون التحقق من الهوية، تكسبون النقاط معًا. كلما زاد عدد الإحالات المؤهلة التي تجلبها، زاد مضاعف النقاط: 50-200 نقطة لكل إحالة اعتمادًا على مستواك.",
      },
      {
        question: "هل التحقق من الهوية مطلوب؟",
        answer:
          "التحقق من الهوية مطلوب لفتح معظم المهام والمكافآت، ولضمان صحة الإحالة. نستخدم التحقق القياسي في الصناعة مدعومًا بـ SumSub للحفاظ على نزاهة المنصة والامتثال للوائح الإقليمية.",
      },
      {
        question: "هل TRYFANN متاح باللغة العربية؟",
        answer:
          "نعم! TRYFANN ثنائي اللغة بالكامل، ويدعم كلاً من الإنجليزية والعربية في جميع أنحاء المنصة بأكملها. ببساطة قم بتبديل مفتاح اللغة في الرأس للتبديل بين اللغات.",
      },
      {
        question: "متى سيتم إطلاق منصة FANN الرئيسية؟",
        answer:
          "من المقرر إطلاق منصة FANN الرئيسية في 4-6 أشهر. سيحصل المتبنون الأوائل الذين يشاركون في TRYFANN على وصول ذي أولوية ومزايا حصرية وميزات مميزة عند تشغيل المنصة.",
      },
      {
        question: "كيف يتم حماية بياناتي؟",
        answer:
          "نأخذ حماية البيانات على محمل الجد ونلتزم بلوائح GDPR ولوائح البيانات الخاصة بمنطقة MENA. يتم تشفير جميع المعلومات الشخصية، وتتم معالجة بيانات التحقق من الهوية من خلال مزودين خارجيين معتمدين. لا نشارك بياناتك أبدًا دون موافقة صريحة.",
      },
      {
        question: "هل يمكنني المشاركة من أي دولة؟",
        answer:
          "تم تحسين TRYFANN لمنطقة MENA/GCC لكنه يرحب بعشاق الفن عالميًا. قد تختلف بعض المكافآت والميزات حسب المنطقة بناءً على اللوائح المحلية. التفاصيل الكاملة متاحة في شروط الخدمة الخاصة بنا.",
      },
    ],
  },
};

export function FAQ({ language }: FAQProps) {
  const t = content[language];
  const isRTL = language === "ar";

  // Fetch progression data from API
  const { data: progressionData } = useGetProgressionQuery();

  // Build tier answer dynamically from API data
  const buildTierAnswer = (lang: "en" | "ar"): string => {
    const apiTiers = progressionData?.data || [];

    if (apiTiers.length === 0) {
      // Fallback if no API data
      return lang === "en"
        ? "We have multiple tiers that unlock increasingly valuable rewards and platform privileges as you progress."
        : "لدينا مستويات متعددة تفتح مكافآت وامتيازات منصة ذات قيمة متزايدة مع تقدمك.";
    }

    // Sort tiers by predefined order
    const orderedNames = ["Explorer", "Ambassador", "Founding Patron"];
    const sortedTiers = [...apiTiers].sort(
      (a, b) =>
        orderedNames.indexOf(a?.name ?? "") -
        orderedNames.indexOf(b?.name ?? "")
    );

    // Build tier list string
    const tierList = sortedTiers
      .map((tier) => {
        const points = tier.points
          ? tier.points.replace(/\s*pts$/i, "").trim()
          : "";

        if (lang === "en") {
          return `${tier.name} (${points})`;
        } else {
          // Arabic tier name mapping
          const tierNameMap: Record<string, string> = {
            Explorer: "مستكشف",
            Ambassador: "سفير",
            "Founding Patron": "راعي مؤسس",
          };
          const arabicName = tierNameMap[tier.name] || tier.name;
          return `${arabicName} (${points})`;
        }
      })
      .join(lang === "en" ? ", " : "، ");

    const tierCount = sortedTiers.length;
    const prefix =
      lang === "en"
        ? `We have ${tierCount} tier${tierCount > 1 ? "s" : ""}: `
        : `لدينا ${tierCount} مستوى${tierCount > 1 ? "ات" : ""}: `;

    const suffix =
      lang === "en"
        ? ". Each tier unlocks increasingly valuable rewards and platform privileges."
        : ". كل مستوى يفتح مكافآت وامتيازات منصة ذات قيمة متزايدة.";

    return prefix + tierList + suffix;
  };

  // Update FAQ answers with dynamic tier information
  const faqs = t.faqs.map((faq, index) => {
    // Update the "What are the different tiers?" question (index 2)
    if (index === 2) {
      return {
        ...faq,
        answer: buildTierAnswer(language),
      };
    }
    return faq;
  });

  return (
    <section
      className="relative py-32 overflow-hidden bg-[#0a0612]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Abstract Art Background Pattern */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={bgImage}
          alt="Abstract Art Pattern"
          className="w-full h-full object-cover opacity-65"
          style={{ transform: "rotate(180deg) scale(1.1)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/50 via-transparent to-[#0f172a]/55" />
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#d4af37]/12 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4">
            <span className="text-white">{t.title.white}</span>
            <span className="text-[#d4af37]">{t.title.gold}</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            {t.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="rounded-2xl glass border border-orange-500/30 px-6 hover:border-orange-500/60 transition-all overflow-hidden group"
                >
                  <AccordionTrigger className="text-white hover:text-amber-400 text-left py-6 no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/60 leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
