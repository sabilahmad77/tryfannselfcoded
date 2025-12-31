import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import bgImage from "figma:asset/3fa9b9de7e4b1421a708a7c88cd0672cee3504e2.png";

interface FAQProps {
  language: "en" | "ar";
  onNavigateToSignUp?: () => void;
}

const content = {
  en: {
    title: { white: "Frequently Asked", gold: " Questions" },
    subtitle: "Everything you need to know about FANN",
    faqs: [
      {
        question: "What is FANN?",
        answer:
          "FANN is a digital ecosystem that merges authenticated art with immersive technology like AR, offering a unique platform for artists, galleries, and collectors to connect and engage.",
      },
      {
        question: "Why FANN?",
        answer: {
          intro: "FANN isn't just a platform; it's a movement. Combining artistic integrity with digital innovation, FANN gives you a premium art experience designed to empower, connect, and elevate. Here's why you'll love being part of this ecosystem:",
          benefits: [
            {
              title: "Authenticate & Elevate:",
              description: "Experience verified, authentic art that stands the test of time, powered by blockchain for trusted provenance.",
            },
            {
              title: "Immersive AR Galleries:",
              description: "Showcase your art like never before augmented reality brings your pieces to life in any space, anywhere.",
            },
            {
              title: "Global Art Community:",
              description: "Connect with art lovers, collectors, and influencers from all over the world. Share, discover, and engage in real-time.",
            },
            {
              title: "Exclusive Rewards:",
              description: "Progress through our tiered rewards system and unlock exclusive perks from early access to new art collections to VIP support.",
            },
          ],
        },
      },
      {
        question: "How do I earn points?",
        answer:
          "Earn Influence Points for referrals and community engagement, and Provenance Points for verified activities like completing KYC, uploading portfolios, and participating in challenges.",
      },
      {
        question: "What are the tiers and rewards?",
        answer:
          "Progress through 5 tiers, each offering greater benefits, from exclusive previews to VIP support, culminating in lifetime perks as a Founding Patron.",
      },
    ],
  },
  ar: {
    title: { white: "الأسئلة", gold: " الشائعة" },
    subtitle: "كل ما تحتاج لمعرفته حول FANN",
    faqs: [
      {
        question: "ما هو FANN؟",
        answer:
          "FANN هو نظام بيئي رقمي يدمج الفن الأصيل مع التكنولوجيا الغامرة مثل الواقع المعزز، مما يوفر منصة فريدة للفنانين والمعارض والجامعين للتواصل والتفاعل.",
      },
      {
        question: "لماذا FANN؟",
        answer: {
          intro: "FANN ليست مجرد منصة؛ إنها حركة. بدمج النزاهة الفنية مع الابتكار الرقمي، تمنحك FANN تجربة فنية مميزة مصممة لتمكينك وربطك ورفعك. إليك لماذا ستحب أن تكون جزءًا من هذا النظام البيئي:",
          benefits: [
            {
              title: "المصادقة والارتقاء:",
              description: "اختبر فنًا موثقًا وأصيلًا يثبت أمام اختبار الزمن، مدعومًا بتقنية البلوك تشين لضمان المصداقية الموثوقة.",
            },
            {
              title: "معارض الواقع المعزز الغامرة:",
              description: "اعرض فنك كما لم يحدث من قبل - يجلب الواقع المعزز قطعك الفنية إلى الحياة في أي مساحة، في أي مكان.",
            },
            {
              title: "مجتمع الفن العالمي:",
              description: "تواصل مع عشاق الفن والجامعين والمؤثرين من جميع أنحاء العالم. شارك واكتشف وتفاعل في الوقت الفعلي.",
            },
            {
              title: "مكافآت حصرية:",
              description: "تقدم عبر نظام المكافآت المتدرج لدينا وافتح امتيازات حصرية من الوصول المبكر إلى مجموعات الفن الجديدة إلى دعم VIP.",
            },
          ],
        },
      },
      {
        question: "كيف أكسب النقاط؟",
        answer:
          "اكسب نقاط التأثير للإحالات والمشاركة المجتمعية، ونقاط المصداقية للأنشطة الموثقة مثل إكمال التحقق من الهوية، وتحميل المحافظ، والمشاركة في التحديات.",
      },
      {
        question: "ما هي المستويات والمكافآت؟",
        answer:
          "تقدم عبر 5 مستويات، كل مستوى يقدم فوائد أكبر، من المعاينات الحصرية إلى دعم VIP، وتنتهي بامتيازات مدى الحياة كراعي مؤسس.",
      },
    ],
  },
};

export function FAQ({ language }: FAQProps) {
  const t = content[language];
  const isRTL = language === "ar";
  const faqs = t.faqs;

  return (
    <section
      className="relative py-32 overflow-hidden bg-[#0F021C]"
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F021C]/50 via-transparent to-[#0F021C]/55" />
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#ffcc33]/12 rounded-full blur-3xl" />
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
            <span className="text-[#ffcc33]">{t.title.gold}</span>
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
                    {typeof faq.answer === "string" ? (
                      <p>{faq.answer}</p>
                    ) : (
                      <div className="space-y-4">
                        <p className="mb-4">{faq.answer.intro}</p>
                        <ul className="space-y-3 list-none">
                          {faq.answer.benefits.map((benefit: { title: string; description: string }, idx: number) => (
                            <li key={idx} className="flex flex-col gap-1">
                              <span className="font-semibold text-white/90">
                                {benefit.title}
                              </span>
                              <span className="text-white/60 pl-4">
                                {benefit.description}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
