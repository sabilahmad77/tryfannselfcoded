import { motion } from 'motion/react';
import { UserPlus, Trophy, Award, Zap } from 'lucide-react';

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
        subtitle: "Get verified access",
        description: "Create your account and complete KYC verification. Unlock early access and join the trusted community."
      },
      {
        icon: Zap,
        title: "Engage & Participate",
        subtitle: "Start earning points",
        description: "Join missions, share insights, and engage with the community. Each action earns points and builds your founder status."
      },
      {
        icon: Trophy,
        title: "Climb the Ranks",
        subtitle: "Level up your tier",
        description: "Accumulate points to move up through the rank system. Higher tiers unlock stronger perks and priority benefits."
      },
      {
        icon: Award,
        title: "Unlock Rewards",
        subtitle: "Claim exclusive perks",
        description: "Redeem rewards, access private drops, and founder advantages. Enjoy verified-only experiences as FANN expands."
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
        subtitle: "احصل على وصول موثق",
        description: "أنشئ حسابك وأكمل التحقق من الهوية (KYC). افتح الوصول المبكر وانضم إلى المجتمع الموثوق."
      },
      {
        icon: Zap,
        title: "شارك وكن نشطاً",
        subtitle: "ابدأ في كسب النقاط",
        description: "انضم إلى المهام، شارك رؤيتك، وتفاعل مع المجتمع. كل إجراء يكسب نقاطاً ويبني حالة المؤسس الخاصة بك."
      },
      {
        icon: Trophy,
        title: "تسلق الرتب",
        subtitle: "ارتقِ بمستواك",
        description: "اجمع النقاط للانتقال إلى أعلى في نظام الرتب. المستويات الأعلى تفتح مزايا أقوى وامتيازات ذات أولوية."
      },
      {
        icon: Award,
        title: "افتح المكافآت",
        subtitle: "احصل على امتيازات حصرية",
        description: "استبدل المكافآت، وصول إلى الإصدارات الخاصة، ومزايا المؤسس. استمتع بتجارب موثقة فقط مع توسع FANN."
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
    <section className="relative py-16 overflow-hidden w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Subtle background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C59B48]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#45e3d3]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-semibold px-2 sm:px-0">
            <span className="text-[#F2F2F3] font-heading font-semibold">{t.title.white}</span>
            <span className="text-[#C59B48] font-heading font-semibold">{t.title.gold}</span>
          </h2>
          <p className="text-[#B9BBC6] max-w-4xl mx-auto text-sm sm:text-base md:text-lg font-body font-normal px-4 sm:px-0">
            {t.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto w-full px-4 sm:px-0"
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
                    <div className="w-full h-full bg-gradient-to-r from-[#C59B48]/60 via-[#C59B48]/40 to-transparent" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#C59B48] via-[#D6AE5A] to-transparent"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: index * 0.3 }}
                    />
                  </div>
                )}

                <div 
                  className="relative bg-[#191922] rounded-3xl overflow-hidden h-full border border-[#2A2A3A] hover:border-[rgba(197,155,72,0.22)] transition-all duration-500 group/card"
                  style={{ 
                    boxShadow: '0 0 0 1px rgba(197,155,72,0), 0 18px 60px rgba(0,0,0,0.55)'
                  }}
                >
                  {/* Hover Glow Effect */}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" 
                    style={{ boxShadow: '0 0 0 1px rgba(197,155,72,0.20), 0 18px 60px rgba(0,0,0,0.55)' }} 
                  />


                  {/* Top Gradient Bar - Removed for cleaner design */}

                  {/* Step Number Badge */}
                  <motion.div
                    className="absolute -top-4 -left-4 w-16 h-16 group-hover:scale-110 transition-all duration-500"
                    whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Outer Glow Ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C59B48] to-[#D6AE5A] blur-lg"
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
                        background: 'conic-gradient(from 0deg, #C59B48, #D6AE5A, #45e3d3, #C59B48)',
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
                    <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-[#C59B48] via-[#D6AE5A] to-[#A98237] flex items-center justify-center shadow-2xl border border-[#F2F2F3]/30">
                      {/* Inner Glass Effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent" />

                      {/* Number */}
                      <span className="relative z-10 text-[#0B0B0D] text-2xl drop-shadow-lg" style={{ fontVariantNumeric: 'tabular-nums' }}>
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

                  <div className="relative z-10 p-5 sm:p-6 md:p-8 pt-8 sm:pt-9 md:pt-10">
                    {/* Icon Container */}
                    <div className="relative mb-4 sm:mb-6 flex justify-center">
                      <motion.div
                        className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Outer Glow Ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C59B48]/30 to-[#45e3d3]/30 blur-xl group-hover:blur-2xl transition-all duration-500" />

                        {/* Main Circle */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C59B48]/20 via-[#1a1a2e]/80 to-[#45e3d3]/20 border-2 border-[#C59B48]/40 group-hover:border-[#C59B48]/80 transition-all duration-500 flex items-center justify-center backdrop-blur-xl">
                          <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#C59B48] relative z-10 drop-shadow-[0_0_10px_rgba(255,204,51,0.5)]" />
                        </div>

                        {/* Animated Ring */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-[#C59B48]/0 group-hover:border-[#C59B48]/60"
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
                      <h3 className="text-[#F2F2F3] mb-1 sm:mb-2 text-base sm:text-lg md:text-xl font-heading font-semibold">{step.title}</h3>
                      {step.subtitle && (
                        <p className="text-[#C59B48] mb-2 sm:mb-3 text-xs sm:text-sm font-medium font-body">
                          {step.subtitle}
                        </p>
                      )}
                      <p className="text-[#B9BBC6] text-xs sm:text-sm leading-relaxed font-body font-normal">
                        {step.description}
                      </p>
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
