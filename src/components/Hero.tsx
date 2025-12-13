import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Play, Hexagon, Users, Palette, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import bgImage from 'figma:asset/18b1d776f4ce826bfa3453d71d5a597f3dc3dd2b.png';

interface HeroProps {
  language: 'en' | 'ar';
  onNavigateToSignUp?: () => void;
}

const content = {
  en: {
    badge: "EXCLUSIVE ART MARKETPLACE",
    headline: "Enter the Future",
    headlineAccent: "of Authenticated Art",
    subheadline: "Join the revolution where verified fine art meets digital innovation. Connect, compete, and curate in the premier art ecosystem for MENA/GCC.",
    cta: "Launch Your Journey",
    watchDemo: "View AR Experience",
    stats: [
      { number: "20K+", label: "Early Adopters", icon: Users, gradient: "from-[#ffcc33] to-[#fbbf24]" },
      { number: "2K+", label: "Verified Artists", icon: Palette, gradient: "from-[#45e3d3] to-[#4de3ed]" },
      { number: "1K+", label: "Galleries & Museums", icon: Building2, gradient: "from-[#4de3ed] to-[#45e3d3]" }
    ]
  },
  ar: {
    badge: "سوق فني حصري",
    headline: "ادخل المستقبل",
    headlineAccent: "للفن الموثق",
    subheadline: "انضم إلى الثورة حيث يلتقي الفن الراقي الموثق بالابتكار الرقمي. تواصل وتنافس وانسق في النظام الفني الرائد لمنطقة الشرق الأوسط وشمال أفريقيا ودول الخليج.",
    cta: "ابدأ رحلتك",
    watchDemo: "شاهد تجربة الواقع المعزز",
    stats: [
      { number: "+20K", label: "مستخدم مبكر", icon: Users, gradient: "from-[#ffcc33] to-[#fbbf24]" },
      { number: "+2K", label: "فنان موثق", icon: Palette, gradient: "from-[#45e3d3] to-[#4de3ed]" },
      { number: "+1K", label: "معرض ومتحف", icon: Building2, gradient: "from-[#4de3ed] to-[#45e3d3]" }
    ]
  }
};

export function Hero({ language, onNavigateToSignUp }: HeroProps) {
  const t = content[language];
  const isRTL = language === 'ar';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0F021C]">
      {/* Abstract Art Background Pattern */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={bgImage}
          alt="Abstract Art Pattern"
          className="w-full h-full object-cover opacity-90"
        />
        {/* Lighter Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F021C]/40 via-transparent to-[#0F021C]/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F021C]/30 via-transparent to-[#0F021C]/30" />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-[#ffcc33]/20 rounded-full blur-3xl"
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
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#45e3d3]/20 rounded-full blur-3xl"
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
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4de3ed]/15 rounded-full blur-3xl"
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
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Floating hexagons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
            <Hexagon className="w-16 h-16 text-[#ffcc33]/20" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 mt-12 border border-[#ffcc33]/30"
          >
            <Sparkles className="w-4 h-4 text-[#ffcc33]" />
            <span className="text-[#ffcc33] tracking-wider text-sm">{t.badge}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 text-5xl md:text-7xl"
          >
            <span className="block text-[#ffffff]">{t.headline}</span>
            <span className="block bg-gradient-to-r from-[#ffcc33] via-[#fbbf24] to-[#ffcc33] bg-clip-text text-transparent animate-gradient">
              {t.headlineAccent}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 text-[#ffffff]/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            {t.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                onClick={onNavigateToSignUp}
                className="relative px-8 py-6 bg-gradient-to-r from-[#ffcc33] via-[#fbbf24] to-[#ffcc33] text-[#0F021C] border-0 overflow-hidden group shadow-lg shadow-[#ffcc33]/30 hover:shadow-2xl hover:shadow-[#ffcc33]/60 transition-all duration-500 glow-gold btn-glow cursor-pointer"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#fbbf24] via-[#ffcc33] to-[#fbbf24]"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center gap-2">
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
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                className="relative px-8 py-6 glass border-2 border-[#45e3d3]/40 text-[#ffffff] hover:border-[#45e3d3] hover:bg-[#45e3d3]/10 backdrop-blur-xl overflow-hidden group transition-all duration-300"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#45e3d3]/0 via-[#45e3d3]/20 to-[#45e3d3]/0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.8 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  {t.watchDemo}
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto"
          >
            {t.stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  {/* Card */}
                  <div className="relative h-full rounded-2xl overflow-hidden">
                    {/* Frosted glass background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-white/8 to-white/4 backdrop-blur-2xl" />
                    
                    {/* Gradient background - each card gets unique gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500`} />
                    
                    {/* Diagonal stripes pattern */}
                    <div 
                      className="absolute inset-0 opacity-[0.04]"
                      style={{
                        backgroundImage: `repeating-linear-gradient(
                          45deg,
                          transparent,
                          transparent 20px,
                          rgba(255,255,255,0.1) 20px,
                          rgba(255,255,255,0.1) 40px
                        )`
                      }}
                    />
                    
                    {/* Border */}
                    <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-white/30 transition-colors duration-500" />
                    
                    {/* Top gradient accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-60`} />
                    
                    {/* Content */}
                    <div className="relative p-6 flex flex-col h-full">
                      {/* Icon */}
                      <div className="mb-4">
                        <div className="inline-flex p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/15 group-hover:border-white/30 transition-all duration-300">
                          <Icon className="w-6 h-6 text-[#ffffff]" />
                        </div>
                      </div>
                      
                      {/* Number */}
                      <div className="text-4xl text-[#ffffff] mb-2">
                        {stat.number}
                      </div>
                      
                      {/* Label */}
                      <div className="text-sm text-[#ffffff]/70">
                        {stat.label}
                      </div>
                    </div>

                    {/* Floating orb decoration */}
                    <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-[0.15] blur-3xl rounded-full group-hover:opacity-[0.25] transition-opacity duration-500`} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* 3D AR Preview Card */}
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
              {/* Animated scan lines */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/10 to-transparent"
                animate={{ y: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Play button */}
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="relative z-10 w-16 h-16 rounded-full glass border-2 border-amber-500 flex items-center justify-center cursor-pointer group"
              >
                <Play className="w-8 h-8 text-amber-400 ml-1 group-hover:text-amber-300 transition-colors" />
              </motion.div>

              {/* Holographic effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-yellow-500/10 pointer-events-none" />
            </div>

            {/* Bottom info bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/60 backdrop-blur-xl border-t border-amber-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-white/70 text-sm">AR Experience Ready</span>
                </div>
                <div className="text-white/60 text-sm">Click to explore →</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
