import { motion } from 'motion/react';
import { Flame, Shield, TrendingUp, Sparkles } from 'lucide-react';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import bgImage from 'figma:asset/c85d96c5ec679934a6c95c18a6db9da4a5b2bc2d.png';

interface PointSystemProps {
  language: 'en' | 'ar';
  onNavigateToSignUp?: () => void;
}

const content = {
  en: {
    title: { white: "Your", gold: " Progression System" },
    subtitle: "Earn points, unlock tiers, and gain exclusive benefits",
    pointTypes: [
      {
        icon: Flame,
        name: "Influence Points",
        description: "Earned through referrals and community engagement",
        color: "purple"
      },
      {
        icon: Shield,
        name: "Provenance Points",
        description: "Awarded for verified participation and authentication",
        color: "cyan"
      }
    ],
    tiers: [
      {
        name: "Explorer",
        points: "0 - 500",
        color: "gray"
      },
      {
        name: "Curator",
        points: "500 - 2,000",
        color: "blue"
      },
      {
        name: "Ambassador",
        points: "2,000 - 5,000",
        color: "purple"
      },
      {
        name: "Founding Patron",
        points: "5,000+",
        color: "gold"
      }
    ],
    currentTier: "You're on your way to",
    nextTier: "Curator status"
  },
  ar: {
    title: { white: "نظام التقدم", gold: " الخاص بك" },
    subtitle: "اكسب النقاط، وافتح المستويات، واحصل على مزايا حصرية",
    pointTypes: [
      {
        icon: Flame,
        name: "نقاط التأثير",
        description: "تكتسب من خلال الإحالات والمشاركة المجتمعية",
        color: "purple"
      },
      {
        icon: Shield,
        name: "نقاط المصداقية",
        description: "تمنح للمشاركة الموثقة والمصادقة",
        color: "cyan"
      }
    ],
    tiers: [
      {
        name: "مستكشف",
        points: "0 - 500",
        color: "gray"
      },
      {
        name: "منسق",
        points: "500 - 2,000",
        color: "blue"
      },
      {
        name: "سفير",
        points: "2,000 - 5,000",
        color: "purple"
      },
      {
        name: "راعي مؤسس",
        points: "5,000+",
        color: "gold"
      }
    ],
    currentTier: "أنت في طريقك إلى",
    nextTier: "مرتبة المنسق"
  }
};

const colorMap = {
  purple: { gradient: 'from-[#ffcc33] to-[#ffb54d]', glow: 'shadow-[#ffcc33]/50', text: 'text-[#ffcc33]' },
  cyan: { gradient: 'from-[#ffcc33] to-[#ffb54d]', glow: 'shadow-[#ffcc33]/50', text: 'text-[#ffcc33]' },
  gray: { gradient: 'from-gray-600 to-gray-500', glow: 'shadow-gray-500/50', text: 'text-white/60' },
  blue: { gradient: 'from-[#ffcc33] to-[#ffb54d]', glow: 'shadow-[#ffcc33]/50', text: 'text-[#ffcc33]' },
  gold: { gradient: 'from-[#ffcc33] to-[#ffb54d]', glow: 'shadow-[#ffcc33]/50', text: 'text-[#ffcc33]' }
};

export function PointSystem({ language }: PointSystemProps) {
  const t = content[language];
  const isRTL = language === 'ar';

  return (
    <section className="relative py-32 overflow-hidden bg-[#0F021C]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Abstract Art Background Pattern */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={bgImage}
          alt="Abstract Art Pattern"
          className="w-full h-full object-cover opacity-75"
          style={{ transform: 'rotate(180deg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F021C]/45 via-transparent to-[#0F021C]/50" />
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ffcc33]/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
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
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Point Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-20"
        >
          {t.pointTypes.map((type, index) => {
            const Icon = type.icon;
            const colors = colorMap[type.color as keyof typeof colorMap];
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative p-8 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#1D112A]/70 via-[#1D112A]/60 to-[#0F021C]/70 border border-[#ffcc33]/40 hover:border-[#ffcc33]/80 transition-all duration-300 group overflow-hidden"
              >
                {/* Gradient Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffcc33]/10 via-transparent to-[#45e3d3]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Holographic Shimmer */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
                
                <div className="flex items-start gap-4 relative z-10">
                  <motion.div 
                    className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shrink-0 overflow-hidden shadow-xl ${colors.glow} border border-white/20`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-8 h-8 text-white relative z-10 drop-shadow-lg" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"
                      initial={{ opacity: 0, scale: 0 }}
                      whileHover={{ opacity: 1, scale: 1.5 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-white mb-2">{type.name}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tier Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-5xl mx-auto"
        >
          <div className="p-10 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-[#1D112A]/80 via-[#1D112A]/70 to-[#0F021C]/80 border-2 border-[#ffcc33]/50 shadow-2xl shadow-[#ffcc33]/20 relative overflow-hidden">
            {/* Gradient Border Pulse */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#ffcc33]/20 via-[#45e3d3]/20 to-[#ffcc33]/20 opacity-50" />
            
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#ffcc33]/10 via-[#45e3d3]/10 to-[#ffcc33]/10"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: '200% 200%' }}
            />

            {/* Current Progress Banner */}
            <div className="relative z-10 text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-orange-400" />
                <p className="text-white/70 text-lg">
                  {t.currentTier} <span className="text-transparent bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text">{t.nextTier}</span>
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
                <span className="text-white text-2xl">350 / 500 Points</span>
              </div>
              <div className="relative">
                <Progress value={70} className="h-3 bg-[#0f021c] border border-orange-500/30" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 opacity-50 blur-md"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </div>
            </div>

            {/* Tier Cards */}
            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
              {t.tiers.map((tier, index) => {
                const colors = colorMap[tier.color as keyof typeof colorMap];
                const isActive = index === 0;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="relative"
                  >
                    <div className={`p-6 rounded-2xl glass border transition-all duration-300 cursor-pointer ${
                      isActive ? 'border-orange-500 shadow-lg shadow-orange-500/50' : 'border-white/10 hover:border-orange-500/50'
                    }`}>
                      {/* Tier Icon */}
                      <motion.div 
                        className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-br ${colors.gradient} relative overflow-hidden`}
                        animate={isActive ? {
                          boxShadow: [
                            '0 0 20px rgba(168, 85, 247, 0.5)',
                            '0 0 40px rgba(168, 85, 247, 0.8)',
                            '0 0 20px rgba(168, 85, 247, 0.5)',
                          ]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm" />
                      </motion.div>

                      {/* Tier Name */}
                      <h4 className="text-white text-center mb-2">{tier.name}</h4>
                      <p className={`text-center text-sm ${colors.text}`}>{tier.points}</p>

                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs shadow-lg"
                        >
                          Active
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
