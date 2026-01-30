import { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Copy, Check, Users, Sparkles, Twitter, Instagram, Linkedin, Video, Award, Zap, Trophy, Target, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
// import fannLogo from 'figma:asset/3b0b3b085f063d168ed55b6b769b2fbf5143db61.png';

interface ReferralModuleProps {
  language: 'en' | 'ar';
  onNavigateToSignUp?: () => void;
}

const content = {
  en: {
    badge: "Referral Rewards",
    title: { white: "Referral Rewards", gold: " Your Network is Your Net Worth" },
    subtitle: "As an integral part of FANN, your influence matters. Share FANN with your network and earn rewards every time someone you refer joins and participates.",
    codeCard: {
      label: "Your Unique Code",
      action: "Copy & Share",
      copied: "Copied!"
    },
    quickStats: {
      title: "Your Impact"
    },
    stats: [
      { label: "Total Referred", value: "12", sublabel: "+3 this week", icon: Users, gradient: "from-yellow-500 to-amber-500" },
      { label: "Points Earned", value: "1,200", sublabel: "All time", icon: Sparkles, gradient: "from-orange-500 to-amber-500" },
      { label: "Success Rate", value: "67%", sublabel: "8 verified", icon: Trophy, gradient: "from-amber-500 to-orange-500" }
    ],
    process: {
      title: "The Referral Journey",
      steps: [
        { icon: Share2, title: "Share", desc: "Send your code" },
        { icon: Users, title: "Join", desc: "Friend signs up" },
        { icon: Sparkles, title: "Earn", desc: "Get rewards" }
      ]
    },
    earnings: {
      title: "Your Earning Power",
      current: { label: "Current Rate", value: "150", unit: "pts/referral" },
      tiers: [
        { min: 1, max: 5, rate: 100, active: false },
        { min: 6, max: 15, rate: 150, active: true },
        { min: 16, max: 30, rate: 200, active: false },
        { min: 31, max: null, rate: 250, active: false }
      ],
      next: { label: "Next Unlock", value: "3", unit: "referrals away" }
    },
    milestones: {
      title: "Milestone Rewards",
      current: 12,
      items: [
        { target: 5, reward: 500, label: "Bronze", unlocked: true },
        { target: 15, reward: 1500, label: "Silver", unlocked: false },
        { target: 30, reward: 3000, label: "Gold", unlocked: false },
        { target: 50, reward: 5000, label: "Platinum", unlocked: false }
      ]
    },
    shareSection: {
      title: "Share Now",
      platforms: ["Twitter", "Instagram", "LinkedIn", "TikTok"]
    }
  },
  ar: {
    badge: "مكاف��ت الإحالة",
    title: { white: "مكافآت الإحالة", gold: " شبكتك هي ثروتك" },
    subtitle: "كجزء لا يتجزأ من FANN، تأثيرك مهم. شارك FANN مع شبكتك واكسب مكافآت في كل مرة ينضم فيها شخص أحلته ويشارك.",
    codeCard: {
      label: "رمزك الفريد",
      action: "نسخ ومشاركة",
      copied: "تم النسخ!"
    },
    quickStats: {
      title: "تأثيرك"
    },
    stats: [
      { label: "إجمالي الإحالات", value: "12", sublabel: "+3 هذا الأسبوع", icon: Users, gradient: "from-yellow-500 to-amber-500" },
      { label: "النقاط المكتسبة", value: "1,200", sublabel: "طوال الوقت", icon: Sparkles, gradient: "from-orange-500 to-amber-500" },
      { label: "معدل النجاح", value: "67%", sublabel: "8 موثق", icon: Trophy, gradient: "from-amber-500 to-orange-500" }
    ],
    process: {
      title: "رحلة الإحالة",
      steps: [
        { icon: Share2, title: "شارك", desc: "أرسل رمزك" },
        { icon: Users, title: "انضم", desc: "صديق يسجل" },
        { icon: Sparkles, title: "اربح", desc: "احصل على مكافآت" }
      ]
    },
    earnings: {
      title: "قوة الربح",
      current: { label: "المعدل الحالي", value: "150", unit: "نقطة/إحالة" },
      tiers: [
        { min: 1, max: 5, rate: 100, active: false },
        { min: 6, max: 15, rate: 150, active: true },
        { min: 16, max: 30, rate: 200, active: false },
        { min: 31, max: null, rate: 250, active: false }
      ],
      next: { label: "الفتح التالي", value: "3", unit: "إحالات متبقية" }
    },
    milestones: {
      title: "مكافآت المعالم",
      current: 12,
      items: [
        { target: 5, reward: 500, label: "برونزي", unlocked: true },
        { target: 15, reward: 1500, label: "فضي", unlocked: false },
        { target: 30, reward: 3000, label: "ذهبي", unlocked: false },
        { target: 50, reward: 5000, label: "بلاتيني", unlocked: false }
      ]
    },
    shareSection: {
      title: "شارك الآن",
      platforms: ["تويتر", "إنستغرام", "لينكد إن", "تيك توك"]
    }
  }
};

export function ReferralModule({ language }: ReferralModuleProps) {
  const t = content[language];
  const isRTL = language === 'ar';
  const [copied, setCopied] = useState(false);
  const referralCode = "FANN-ART-2K25";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success(t.codeCard.copied);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleShare = (platform: string) => {
    const text = `Join FANN with code: ${referralCode}`;
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      instagram: `https://www.instagram.com/`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`,
      tiktok: `https://www.tiktok.com/`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank');
  };

  return (
    <section className="relative py-16 overflow-hidden w-full" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Subtle background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#C59B48]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-[#C59B48]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl w-full">
        {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
          {/* <motion.div
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass mb-6 border border-amber-500/30"
            animate={{
              boxShadow: ['0 0 20px rgba(234, 179, 8, 0.3)', '0 0 40px rgba(234, 179, 8, 0.5)', '0 0 20px rgba(234, 179, 8, 0.3)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img src={fannLogo} alt="FANN" className="h-5 w-auto" />
            <span className="text-amber-300 text-sm">{t.badge}</span>
          </motion.div> */}
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl max-w-3xl mx-auto font-heading font-semibold px-2 sm:px-0">
            <span className="text-[#F2F2F3] font-heading font-semibold">{t.title.white}</span>
            <span className="text-[#C59B48] font-heading font-semibold">{t.title.gold}</span>
          </h2>
          <p className="text-[#B9BBC6] max-w-4xl mx-auto text-sm sm:text-base md:text-lg font-body font-normal px-4 sm:px-0">{t.subtitle}</p>
        </motion.div>

        {/* Featured Code Card - Minimal Modern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="p-4 sm:p-6 md:p-8 lg:p-12 rounded-2xl bg-[#191922] border border-[rgba(197,155,72,0.22)] relative overflow-hidden shadow-2xl" style={{ boxShadow: '0 0 0 1px rgba(197,155,72,0.20), 0 18px 60px rgba(0,0,0,0.55)' }}>
            {/* Gradient top accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C59B48] to-transparent" />
            
            {/* Holographic overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#C59B48]/10 via-transparent to-[#45e3d3]/10 opacity-50" />
            
            <div className="relative z-10 max-w-5xl mx-auto">
              {/* Code Section */}
              <div className="mb-6 sm:mb-8 text-center">
                <div className="text-[#B9BBC6] text-xs sm:text-sm mb-3 sm:mb-4 uppercase tracking-wider">{t.codeCard.label}</div>
                <div className="inline-flex items-center gap-2 sm:gap-4 p-4 sm:p-6 rounded-xl backdrop-blur-md bg-gradient-to-br from-[#191922]/60 to-[#0B0B0D]/60 border-2 border-[#C59B48]/40 mb-4 sm:mb-6 shadow-lg hover:shadow-[#C59B48]/30 transition-shadow flex-wrap sm:flex-nowrap justify-center sm:justify-start w-full sm:w-auto">
                  <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.2em] sm:tracking-[0.3em] text-white font-mono break-all sm:break-normal text-center sm:text-left">
                    {referralCode}
                  </div>
                  <motion.button
                    onClick={handleCopy}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#C59B48]/20 to-[#45e3d3]/20 border-2 border-[#C59B48]/40 hover:border-[#C59B48]/80 flex items-center justify-center transition-all shadow-md cursor-pointer shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-[#B9BBC6] hover:text-amber-400 transition-colors" />
                    )}
                  </motion.button>
                </div>
                
                {/* Share buttons - Primary social media buttons */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                  {[
                    { icon: Twitter, platform: 'twitter', label: 'Twitter' },
                    { icon: Instagram, platform: 'instagram', label: 'Instagram' },
                    { icon: Linkedin, platform: 'linkedin', label: 'LinkedIn' },
                    { icon: Video, platform: 'tiktok', label: 'TikTok' }
                  ].map((social) => {
                    const Icon = social.icon;
                    return (
                      <motion.button
                        key={social.platform}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleShare(social.platform)}
                        className="h-9 sm:h-10 px-3 sm:px-4 md:px-6 rounded-md backdrop-blur-md bg-gradient-to-br from-[#191922]/40 to-[#0B0B0D]/40 border border-[#C59B48]/30 hover:border-[#C59B48]/70 flex items-center gap-1.5 sm:gap-2 transition-all text-xs sm:text-sm text-[#B9BBC6] hover:text-white shadow-md hover:shadow-[#C59B48]/20 cursor-pointer font-body shrink-0"
                      >
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{social.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-6 sm:mb-8" />

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {t.stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      whileHover={{ y: -3, scale: 1.02 }}
                      className="text-center p-4 sm:p-5 rounded-xl backdrop-blur-md bg-gradient-to-br from-[#191922]/40 via-[#191922]/30 to-[#0B0B0D]/40 border border-[#C59B48]/20 hover:border-[#C59B48]/50 transition-all shadow-lg hover:shadow-[#C59B48]/20"
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500/60 mx-auto mb-2 sm:mb-3" />
                      <div className="text-2xl sm:text-3xl text-white mb-1 sm:mb-2">{stat.value}</div>
                      <div className="text-[#B9BBC6] text-xs sm:text-sm mb-1">{stat.label}</div>
                      <div className="text-xs text-white/50">{stat.sublabel}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
          
          {/* Process Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div 
              className="p-4 sm:p-6 rounded-2xl bg-[#191922] border border-[#2A2A3A] h-full group/card transition-all duration-300 overflow-hidden"
              style={{ 
                boxShadow: '0 0 0 1px rgba(197,155,72,0), 0 18px 60px rgba(0,0,0,0.55)'
              }}
            >
              {/* Hover Glow Effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" 
                style={{ boxShadow: '0 0 0 1px rgba(197,155,72,0.20), 0 18px 60px rgba(0,0,0,0.55)' }} 
              />
              
              <div className="flex items-center gap-2 mb-4 sm:mb-6 relative z-10">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#C59B48]" />
                <h3 className="text-[#F2F2F3] text-base sm:text-lg font-heading font-semibold">{t.process.title}</h3>
              </div>
              <div className="space-y-3 sm:space-y-4 relative z-10">
                {t.process.steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-[#222231] border border-[#2A2A3A] hover:border-[rgba(197,155,72,0.22)] transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#191922] flex items-center justify-center shrink-0 border border-[#C59B48]/30">
                        <Icon className="w-5 h-5 text-[#C59B48]" />
                      </div>
                      <div>
                        <div className="text-[#F2F2F3] text-sm mb-1 font-body font-medium">{step.title}</div>
                        <div className="text-[#B9BBC6] text-xs font-body font-normal">{step.desc}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Earnings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div 
              className="p-6 rounded-2xl bg-[#191922] border border-[#2A2A3A] h-full group/card transition-all duration-300 overflow-hidden"
              style={{ 
                boxShadow: '0 0 0 1px rgba(197,155,72,0), 0 18px 60px rgba(0,0,0,0.55)'
              }}
            >
              {/* Hover Glow Effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" 
                style={{ boxShadow: '0 0 0 1px rgba(197,155,72,0.20), 0 18px 60px rgba(0,0,0,0.55)' }} 
              />
              
              <div className="flex items-center gap-2 mb-6 relative z-10">
                <Zap className="w-5 h-5 text-[#C59B48]" />
                <h3 className="text-[#F2F2F3] text-lg font-heading font-semibold">{t.earnings.title}</h3>
              </div>

              {/* Current Rate Highlight */}
              <div className="mb-6 p-4 rounded-xl bg-[#222231] border border-[rgba(197,155,72,0.22)] text-center relative z-10">
                <div className="text-[#8A8EA0] text-xs mb-1 font-body font-medium">{t.earnings.current.label}</div>
                <div className="text-4xl text-[#C59B48] mb-1 font-heading font-semibold">
                  {t.earnings.current.value}
                </div>
                <div className="text-[#B9BBC6] text-sm font-body font-normal">{t.earnings.current.unit}</div>
              </div>

              {/* Tiers */}
              <div className="space-y-2 mb-4">
                {t.earnings.tiers.map((tier, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-all ${
                      tier.active
                        ? 'glass border-amber-500 bg-amber-500/10'
                        : 'glass border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#B9BBC6] text-sm">
                        {tier.min}-{tier.max || '∞'}
                      </span>
                      <span className={`text-sm ${tier.active ? 'text-amber-400' : 'text-[#B9BBC6]'}`}>
                        {tier.rate} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Unlock */}
              <div className="p-3 rounded-xl glass border border-amber-500/30 flex items-center justify-between">
                <span className="text-[#B9BBC6] text-sm">{t.earnings.next.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">{t.earnings.next.value}</span>
                  <ArrowUpRight className="w-4 h-4 text-amber-400" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Milestones Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div 
              className="p-6 rounded-2xl bg-[#191922] border border-[#2A2A3A] h-full group/card transition-all duration-300 overflow-hidden"
              style={{ 
                boxShadow: '0 0 0 1px rgba(197,155,72,0), 0 18px 60px rgba(0,0,0,0.55)'
              }}
            >
              {/* Hover Glow Effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" 
                style={{ boxShadow: '0 0 0 1px rgba(197,155,72,0.20), 0 18px 60px rgba(0,0,0,0.55)' }} 
              />
              
              <div className="flex items-center gap-2 mb-6 relative z-10">
                <Award className="w-5 h-5 text-[#C59B48]" />
                <h3 className="text-[#F2F2F3] text-lg font-heading font-semibold">{t.milestones.title}</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 relative z-10">
                {t.milestones.items.map((milestone, index) => {
                  const progress = Math.min((t.milestones.current / milestone.target) * 100, 100);
                  const isUnlocked = milestone.unlocked;
                  
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={`relative p-4 rounded-xl border-2 text-center backdrop-blur-md ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-[#45e3d3]/30 to-[#3bc4b5]/30 border-[#45e3d3] shadow-lg shadow-[#45e3d3]/30'
                          : 'bg-gradient-to-br from-[#191922]/50 to-[#0B0B0D]/50 border-[#C59B48]/20'
                      }`}
                    >
                      {isUnlocked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}

                      {/* Progress Ring Visual */}
                      <div className="relative w-12 h-12 mx-auto mb-3">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            className="text-white/10"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                            className={isUnlocked ? 'text-green-400' : 'text-orange-400'}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-sm ${isUnlocked ? 'text-green-400' : 'text-white'}`}>
                            {milestone.target}
                          </span>
                        </div>
                      </div>

                      <div className={`text-sm mb-1 ${isUnlocked ? 'text-green-400' : 'text-white'}`}>
                        +{milestone.reward.toLocaleString()}
                      </div>
                      <div className={`text-xs ${isUnlocked ? 'text-green-500' : 'text-[#B9BBC6]'}`}>
                        {milestone.label}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
