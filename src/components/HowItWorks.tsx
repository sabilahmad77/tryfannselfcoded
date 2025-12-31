import { motion } from 'motion/react';
import { UserPlus, Trophy, Award, Zap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import bgImage from 'figma:asset/3fa9b9de7e4b1421a708a7c88cd0672cee3504e2.png';

interface HowItWorksProps {
  language: 'en' | 'ar';
  onNavigateToSignUp?: () => void;
}

const content = {
  en: {
    title: { white: "How It Works", gold: " A Simple, Seamless Experience for All" },
    subtitle: "At FANN, we believe in making the art world more accessible, transparent, and rewarding for everyone. Here’s how you can get started.",
    steps: [
      {
        icon: UserPlus,
        title: "Sign Up & Verify",
        description: (
          <>
            Create your account and complete KYC verification. This step secures your identity and ensures a trustworthy platform experience. Once verified, you&apos;re part of our <span className="font-bold text-white">exclusive early access</span> phase and can work towards unlocking whitelist status.
          </>
        )
      },
      {
        icon: Zap,
        title: "Engage & Participate",
        description: "Join art challenges, share your vision, and earn Influence and Provenance Points. Each interaction helps you level up, gain visibility, and unlock rewards."
      },
      {
        icon: Trophy,
        title: "Climb the Ranks",
        description: (
          <>
            Earn points and climb from <span className="font-bold text-white">Explorer</span> to <span className="font-bold text-white">Founding Patron</span> by completing tasks and contributing to the community. Each milestone brings you closer to exclusive benefits.
          </>
        )
      },
      {
        icon: Award,
        title: "Unlock Rewards",
        description: (
          <>
            Enjoy exclusive access to AR galleries, limited edition artworks, VIP support, and personalized features as you ascend through the ranks.
            <br />
            It&apos;s that simple. Start your journey today and unlock a world of art that is authenticated, immersive, and rewarding.
          </>
        )
      }
    ]
  },
  ar: {
    title: { white: "كيف يعمل", gold: " تجربة بسيطة وسلسة للجميع" },
    subtitle: "في FANN، نؤمن بجعل عالم الفن أكثر سهولة وشفافية ومكافأة للجميع. إليك كيف يمكنك البدء.",
    steps: [
      {
        icon: UserPlus,
        title: "التسجيل والتحقق",
        description: (
          <>
            أنشئ حسابك وأكمل التحقق من الهوية (KYC). هذه الخطوة تؤمن هويتك وتضمن تجربة منصة موثوقة. بمجرد التحقق، أنت جزء من مرحلة <span className="font-bold text-white">الوصول المبكر الحصري</span> ويمكنك العمل نحو فتح حالة القائمة البيضاء.
          </>
        )
      },
      {
        icon: Zap,
        title: "شارك وكن نشطاً",
        description: "انضم إلى تحديات الفن، شارك رؤيتك، واكسب نقاط التأثير والمصداقية. كل تفاعل يساعدك على الارتقاء، واكتساب الرؤية، وفتح المكافآت."
      },
      {
        icon: Trophy,
        title: "تسلق الرتب",
        description: (
          <>
            اكسب النقاط وتسلق من <span className="font-bold text-white">مستكشف</span> إلى <span className="font-bold text-white">راعي مؤسس</span> من خلال إكمال المهام والمساهمة في المجتمع. كل معلم يقربك من الفوائد الحصرية.
          </>
        )
      },
      {
        icon: Award,
        title: "افتح المكافآت",
        description: (
          <>
            استمتع بالوصول الحصري إلى معارض الواقع المعزز والأعمال الفنية المحدودة ودعم VIP والميزات المخصصة أثناء صعودك في الرتب.
            <br />
            الأمر بهذه البساطة. ابدأ رحلتك اليوم وافتح عالماً من الفن الأصيل والغامر والمجزِي.
          </>
        )
      }
    ]
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export function HowItWorks({ language }: HowItWorksProps) {
  const t = content[language];
  const isRTL = language === 'ar';

  return (
    <section className="relative py-32 overflow-hidden bg-[#0F021C]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Abstract Art Background Pattern */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={bgImage}
          alt="Abstract Art Pattern"
          className="w-full h-full object-cover opacity-80"
          style={{ transform: 'scaleX(-1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F021C]/35 via-transparent to-[#0F021C]/45" />
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ffcc33]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#45e3d3]/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="mb-4 text-4xl md:text-5xl">
            <span className="text-white">{t.title.white}</span>
            <span className="text-[#ffcc33]">{t.title.gold}</span>
          </h2>
          <p className="text-[#ffffff]/60 max-w-2xl mx-auto text-lg">
            {t.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto px-4 sm:px-0"
        >
          {t.steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -12,
                  transition: { duration: 0.3 }
                }}
                className="relative group"
              >
                {/* Connector Line (hidden on mobile and last item) */}
                {index < t.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-[60%] w-[80%] h-px">
                    <div className="w-full h-full bg-gradient-to-r from-[#ffcc33]/60 via-[#ffcc33]/40 to-transparent" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#ffcc33] via-[#ffb54d] to-transparent"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: index * 0.3 }}
                    />
                  </div>
                )}

                <div className="relative backdrop-blur-2xl bg-gradient-to-br from-[#1a1a2e]/95 via-[#16213e]/90 to-[#0f1624]/95 rounded-3xl overflow-hidden h-full border border-[#ffcc33]/20 hover:border-[#ffcc33]/60 transition-all duration-500">
                  {/* Glass Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />

                  {/* Scan Line Effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    initial={{ backgroundPosition: '0% 0%' }}
                    whileHover={{
                      backgroundPosition: ['0% 0%', '0% 100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      background: 'linear-gradient(to bottom, transparent 0%, rgba(255, 204, 51, 0.1) 50%, transparent 100%)',
                      backgroundSize: '100% 200%'
                    }}
                  />

                  {/* Top Gradient Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ffcc33] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Step Number Badge */}
                  <motion.div
                    className="absolute -top-4 -left-4 w-16 h-16 group-hover:scale-110 transition-all duration-500"
                    whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Outer Glow Ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffcc33] to-[#ffb54d] blur-lg"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Rotating Border Ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'conic-gradient(from 0deg, #ffcc33, #ffb54d, #45e3d3, #ffcc33)',
                        padding: '3px',
                      }}
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <div className="w-full h-full rounded-full bg-[#0f1624]" />
                    </motion.div>

                    {/* Main Badge */}
                    <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-[#ffcc33] via-[#ffb54d] to-[#e6b800] flex items-center justify-center shadow-2xl border border-[#ffffff]/30">
                      {/* Inner Glass Effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent" />

                      {/* Number */}
                      <span className="relative z-10 text-[#0F021C] text-2xl drop-shadow-lg" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {index + 1}
                      </span>

                      {/* Sparkle Effect */}
                      <motion.div
                        className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white"
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                      />
                    </div>
                  </motion.div>

                  <div className="relative z-10 p-8 pt-10">
                    {/* Icon Container */}
                    <div className="relative mb-6 flex justify-center">
                      <motion.div
                        className="relative w-24 h-24"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Outer Glow Ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffcc33]/30 to-[#45e3d3]/30 blur-xl group-hover:blur-2xl transition-all duration-500" />

                        {/* Main Circle */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffcc33]/20 via-[#1a1a2e]/80 to-[#45e3d3]/20 border-2 border-[#ffcc33]/40 group-hover:border-[#ffcc33]/80 transition-all duration-500 flex items-center justify-center backdrop-blur-xl">
                          <Icon className="w-12 h-12 text-[#ffcc33] relative z-10 drop-shadow-[0_0_10px_rgba(255,204,51,0.5)]" />
                        </div>

                        {/* Animated Ring */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-[#ffcc33]/0 group-hover:border-[#ffcc33]/60"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-white mb-3 text-xl">{step.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Glow Line */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ffcc33] to-transparent"
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileHover={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
