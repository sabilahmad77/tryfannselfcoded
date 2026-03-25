import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Hexagon, Users, Palette, Building2, CheckCircle2, Star } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import heroBg from '@/assets/hero-section-bg.jpeg';
import heroMobileBg from '@/assets/hero-section-mobile-bg.jpeg';

interface HeroProps {
  language: 'en' | 'ar';
  onNavigateToSignUp?: () => void;
}

const content = {
  en: {
    badge: "WELCOME TO FANN",
    headline: "The Verified Art Marketplace Starts Here",
    headlineAccent: "Where Verified Art Meets Immersive Technology",
    subheadline: (
      <>
        Founding access to FANN — a verified-only marketplace for physical art with provenance-first records and resale royalties. Join now, complete missions, earn points, and unlock founder perks before launch.
        <br />
        AR/VR experiences are planned for later phases. Today, TryFANN focuses on verification, provenance, and founder rewards.
      </>
    ),
    cta: "Start Your Journey",
    trustTitle: "Trust",
    founderTitle: "Founder Perks",
    trustBullets: [
      "Verified participants",
      "Verified listings at launch",
      "Provenance-first records",
      "Resale royalties"
    ],
    founderPerks: [
      "Founder terms (reduced commission during founding window)",
      "Priority visibility (featured windows, curated spotlights)",
      "Priority onboarding/support",
      "Early access to drops / private previews"
    ],
    stats: [
      { number: "20K+", label: "Early Adopters", icon: Users, gradient: "from-[#C59B48] to-[#D6AE5A]" },
      { number: "2K+", label: "Verified Artists", icon: Palette, gradient: "from-[#45e3d3] to-[#4de3ed]" },
      { number: "1K+", label: "Galleries & Museums", icon: Building2, gradient: "from-[#4de3ed] to-[#45e3d3]" }
    ]
  },
  ar: {
    badge: "مرحبًا بك في FANN",
    headline: "تبدأ سوق الفن الموثق هنا",
    headlineAccent: "حيث يلتقي الفن الموثق بالتكنولوجيا الغامرة",
    subheadline: (
      <>
        الوصول المؤسس إلى FANN — سوق موثق حصريًا للفن المادي مع سجلات المصداقية أولاً وإتاوات إعادة البيع. انضم الآن، أكمل المهام، اربح النقاط، وافتح مزايا المؤسس قبل الإطلاق.
        <br />
        تجارب AR/VR مخطط لها لمراحل لاحقة. اليوم، يركز TryFANN على التحقق والمصداقية ومكافآت المؤسس.
      </>
    ),
    cta: "ابدأ رحلتك",
    trustTitle: "الثقة",
    founderTitle: "مزايا المؤسس",
    trustBullets: [
      "مشاركون موثقون",
      "قوائم موثقة عند الإطلاق",
      "سجلات المصداقية أولاً",
      "إتاوات إعادة البيع"
    ],
    founderPerks: [
      "شروط المؤسس (عمولة مخفضة خلال نافذة التأسيس)",
      "الرؤية ذات الأولوية (نوافذ مميزة، أضواء منسقة)",
      "الإعداد ذو الأولوية / الدعم",
      "الوصول المبكر إلى الإصدارات / المعاينات الخاصة"
    ],
    stats: [
      { number: "+20K", label: "مستخدم مبكر", icon: Users, gradient: "from-[#C59B48] to-[#D6AE5A]" },
      { number: "+2K", label: "فنان موثق", icon: Palette, gradient: "from-[#45e3d3] to-[#4de3ed]" },
      { number: "+1K", label: "معرض ومتحف", icon: Building2, gradient: "from-[#4de3ed] to-[#45e3d3]" }
    ]
  }
};

export function Hero({ language, onNavigateToSignUp }: HeroProps) {
  const t = content[language];
  const isRTL = language === 'ar';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0B0D] w-full pt-20">
      {/* Abstract Art Background Pattern */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 w-full h-full">
          {/* Desktop Background Image */}
          <ImageWithFallback
            src={heroBg}
            alt="Hero Background"
            className="hidden md:block w-full h-full object-cover object-center opacity-90 md:opacity-90"
            style={{
              minHeight: '100vh',
              minWidth: '100%',
            }}
          />
          {/* Mobile Background Image */}
          <ImageWithFallback
            src={heroMobileBg}
            alt="Hero Mobile Background"
            className="block md:hidden w-full h-full object-cover object-center opacity-90"
            style={{
              minHeight: '100vh',
              minWidth: '100%',
            }}
          />
        </div>
        {/* Lighter Gradient Overlays - Reduced opacity on mobile for better image visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/25 via-transparent to-[#0B0B0D]/35 md:from-[#0B0B0D]/40 md:to-[#0B0B0D]/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D]/15 via-transparent to-[#0B0B0D]/15 md:from-[#0B0B0D]/30 md:to-[#0B0B0D]/30" />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none max-w-full z-0">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-[#C59B48]/20 rounded-full blur-3xl max-w-[calc(100vw+10rem)]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#45e3d3]/20 rounded-full blur-3xl max-w-[calc(100vw+10rem)]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4de3ed]/15 rounded-full blur-3xl max-w-[min(600px,100vw)] max-h-[min(600px,100vh)]"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] z-0" />

      {/* Floating hexagons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <Hexagon className="w-16 h-16 text-[#C59B48]/20" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 w-full max-w-full" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-6xl mx-auto text-center w-full">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 mt-2 border border-[#C59B48]/30"
          >
            <Sparkles className="w-4 h-4 text-[#C59B48]" />
            <span className="text-[#C59B48] tracking-wider text-sm font-body">{t.badge}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.1] font-heading px-2 sm:px-0"
          >
            <span className="block text-[#F2F2F3] leading-[1.1] py-1 break-words font-heading font-semibold">{t.headline}</span>
            <span className="block bg-gradient-to-r from-[#C59B48] via-[#D6AE5A] to-[#C59B48] bg-clip-text text-transparent animate-gradient text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-[1.2] py-1 break-words font-heading font-semibold">
              {t.headlineAccent}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-4 sm:mb-5 text-[#B9BBC6] text-sm sm:text-base md:text-lg leading-relaxed font-body font-normal px-2 sm:px-0 max-w-3xl mx-auto"
          >
            {t.subheadline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-5 sm:mb-6 px-2 sm:px-0"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Button
                size="lg"
                onClick={onNavigateToSignUp}
                className="relative w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 border-0 overflow-hidden group bg-[#C59B48] hover:bg-[#D6AE5A] active:bg-[#A98237] shadow-lg shadow-[#C59B48]/30 hover:shadow-2xl hover:shadow-[#C59B48]/60 transition-all duration-500 cursor-pointer text-sm sm:text-base font-body font-medium"
              >
                <motion.div
                  className="absolute inset-0 bg-primary/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center gap-2 text-[#0B0B0D]">
                  {t.cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
                  }}
                />
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust & Founder Perks Cards - Compact 2-Column Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-5 max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Trust Card - Compact */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-3 sm:p-4 hover:border-white/20 transition-colors"
              >
                <h3 className="text-base sm:text-lg font-semibold text-[#F2F2F3] mb-2 sm:mb-3 font-heading">{t.trustTitle}</h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  {t.trustBullets.map((bullet, index) => (
                    <li
                      key={index}
                      className={`flex items-start gap-2 text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C59B48] shrink-0 mt-0.5" />
                      <span className="text-[#B9BBC6] font-body font-normal break-words">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Founder Perks Card - Compact */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-3 sm:p-4 hover:border-white/20 transition-colors"
              >
                <h3 className="text-base sm:text-lg font-semibold text-[#F2F2F3] mb-2 sm:mb-3 font-heading">{t.founderTitle}</h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  {t.founderPerks.map((perk, index) => (
                    <li
                      key={index}
                      className={`flex items-start gap-2 text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C59B48] shrink-0 mt-0.5" />
                      <span className="text-[#B9BBC6] font-body font-normal break-words text-left">{perk}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Overlay on Background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                    className="relative backdrop-blur-md bg-white/5 rounded-xl border border-white/10 p-4 sm:p-6 text-center"
                  >
                    <div className="flex justify-center mb-2 sm:mb-3">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-white/10 border border-white/20">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#C59B48]" />
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl text-white mb-1 font-heading">
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm text-white/70 font-body">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* 3D AR Preview Card - COMMENTED OUT - AR Preview Card to be removed per new TryFANN positioning */}
        {/* 
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 max-w-5xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.02, rotateX: 5, rotateY: 5 }}
            transition={{ duration: 0.3 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative rounded-3xl overflow-hidden glass border border-amber-500/30 shadow-2xl"
          >
            <div className="aspect-video bg-gradient-to-br from-amber-900/50 via-black to-yellow-900/50 flex items-center justify-center relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/10 to-transparent"
                animate={{ y: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="relative z-10 w-16 h-16 rounded-full glass border-2 border-amber-500 flex items-center justify-center cursor-pointer group"
              >
                <Play className="w-8 h-8 text-amber-400 ml-1 group-hover:text-amber-300 transition-colors" />
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-yellow-500/10 pointer-events-none" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/60 backdrop-blur-xl border-t border-amber-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-white/70 text-sm font-body">AR Experience Ready</span>
                </div>
                <div className="text-[#F2F2F3] text-sm">Click to explore →</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        */}
      </div>
    </section>
  );
}
