import { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Copy, Check, Users, Sparkles, Twitter, Send, MessageCircle, Award, Zap, Trophy, Target, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
// import fannLogo from 'figma:asset/3b0b3b085f063d168ed55b6b769b2fbf5143db61.png';
import { ImageWithFallback } from './figma/ImageWithFallback';
import bgImage from 'figma:asset/18b1d776f4ce826bfa3453d71d5a597f3dc3dd2b.png';

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
      platforms: ["Twitter", "Telegram", "WhatsApp"]
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
      platforms: ["تويتر", "تيليجرام", "واتساب"]
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
      telegram: `https://t.me/share/url?text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank');
  };

  return (
    <section className="relative py-32 overflow-hidden bg-[#0F021C]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Abstract Art Background Pattern */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={bgImage}
          alt="Abstract Art Pattern"
          className="w-full h-full object-cover opacity-70"
          style={{ transform: 'rotate(270deg) scale(1.1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F021C]/45 via-transparent to-[#0F021C]/50" />
      </div>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-yellow-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
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
          <h2 className="mb-4 text-4xl md:text-5xl max-w-3xl mx-auto font-heading">
            <span className="text-white">{t.title.white}</span>
            <span className="text-[#ffcc33]">{t.title.gold}</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg font-body">{t.subtitle}</p>
        </motion.div>

        {/* Featured Code Card - Minimal Modern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="p-8 md:p-12 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#1D112A]/80 via-[#1D112A]/70 to-[#0F021C]/80 border-2 border-[#ffcc33]/50 relative overflow-hidden shadow-2xl shadow-[#ffcc33]/30">
            {/* Gradient top accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#ffcc33] to-transparent" />
            
            {/* Holographic overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffcc33]/10 via-transparent to-[#45e3d3]/10 opacity-50" />
            
            <div className="relative z-10 max-w-5xl mx-auto">
              {/* Code Section */}
              <div className="mb-8 text-center">
                <div className="text-white/60 text-sm mb-4 uppercase tracking-wider">{t.codeCard.label}</div>
                <div className="inline-flex items-center gap-4 p-6 rounded-xl backdrop-blur-md bg-gradient-to-br from-[#1D112A]/60 to-[#0F021C]/60 border-2 border-[#ffcc33]/40 mb-6 shadow-lg hover:shadow-[#ffcc33]/30 transition-shadow">
                  <div className="text-3xl md:text-4xl tracking-[0.3em] text-white font-mono">
                    {referralCode}
                  </div>
                  <motion.button
                    onClick={handleCopy}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ffcc33]/20 to-[#45e3d3]/20 border-2 border-[#ffcc33]/40 hover:border-[#ffcc33]/80 flex items-center justify-center transition-all shadow-md cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-white/60 hover:text-amber-400 transition-colors" />
                    )}
                  </motion.button>
                </div>
                
                {/* Share buttons */}
                <div className="flex items-center justify-center gap-3">
                  {[
                    { icon: Twitter, platform: 'twitter', label: 'Twitter' },
                    { icon: Send, platform: 'telegram', label: 'Telegram' },
                    { icon: MessageCircle, platform: 'whatsapp', label: 'WhatsApp' }
                  ].map((social) => {
                    const Icon = social.icon;
                    return (
                      <motion.button
                        key={social.platform}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleShare(social.platform)}
                        className="px-4 py-2 rounded-lg backdrop-blur-md bg-gradient-to-br from-[#1D112A]/40 to-[#0F021C]/40 border border-[#ffcc33]/30 hover:border-[#ffcc33]/70 flex items-center gap-2 transition-all text-sm text-white/60 hover:text-white shadow-md hover:shadow-[#ffcc33]/20 cursor-pointer"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{social.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-8" />

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      className="text-center p-5 rounded-xl backdrop-blur-md bg-gradient-to-br from-[#1D112A]/40 via-[#1D112A]/30 to-[#0F021C]/40 border border-[#ffcc33]/20 hover:border-[#ffcc33]/50 transition-all shadow-lg hover:shadow-[#ffcc33]/20"
                    >
                      <Icon className="w-5 h-5 text-amber-500/60 mx-auto mb-3" />
                      <div className="text-3xl text-white mb-2">{stat.value}</div>
                      <div className="text-white/60 text-sm mb-1">{stat.label}</div>
                      <div className="text-xs text-white/50">{stat.sublabel}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Process Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#1D112A]/70 via-[#1D112A]/60 to-[#0F021C]/70 border-2 border-[#ffcc33]/40 h-full shadow-xl hover:shadow-[#ffcc33]/30 transition-shadow duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffcc33]/5 via-transparent to-[#45e3d3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-center gap-2 mb-6 relative z-10">
                <Target className="w-5 h-5 text-[#ffcc33]" />
                <h3 className="text-white text-lg font-heading">{t.process.title}</h3>
              </div>
              <div className="space-y-4 relative z-10">
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
                      className="flex items-center gap-4 p-3 rounded-xl backdrop-blur-md bg-gradient-to-br from-[#1D112A]/50 to-[#0F021C]/50 border border-[#ffcc33]/20 hover:border-[#ffcc33]/50 transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ffcc33]/40 to-[#45e3d3]/40 flex items-center justify-center shrink-0 shadow-lg border border-[#ffcc33]/30">
                        <Icon className="w-5 h-5 text-[#ffcc33]" />
                      </div>
                      <div>
                        <div className="text-white text-sm mb-1 font-body">{step.title}</div>
                        <div className="text-white/60 text-xs font-body">{step.desc}</div>
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
            <div className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#1D112A]/70 via-[#1D112A]/60 to-[#0F021C]/70 border-2 border-[#ffcc33]/40 h-full shadow-xl hover:shadow-[#ffcc33]/30 transition-shadow duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffcc33]/5 via-transparent to-[#45e3d3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-center gap-2 mb-6 relative z-10">
                <Zap className="w-5 h-5 text-[#ffcc33]" />
                <h3 className="text-white text-lg font-heading">{t.earnings.title}</h3>
              </div>

              {/* Current Rate Highlight */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-[#ffcc33]/30 to-[#45e3d3]/30 border-2 border-[#ffcc33]/60 text-center shadow-xl shadow-[#ffcc33]/30 relative z-10 overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                <div className="text-white/60 text-xs mb-1">{t.earnings.current.label}</div>
                <div className="text-4xl bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent mb-1">
                  {t.earnings.current.value}
                </div>
                <div className="text-amber-300 text-sm">{t.earnings.current.unit}</div>
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
                      <span className="text-white/60 text-sm">
                        {tier.min}-{tier.max || '∞'}
                      </span>
                      <span className={`text-sm ${tier.active ? 'text-amber-400' : 'text-white/60'}`}>
                        {tier.rate} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Unlock */}
              <div className="p-3 rounded-xl glass border border-amber-500/30 flex items-center justify-between">
                <span className="text-white/60 text-sm">{t.earnings.next.label}</span>
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
            <div className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#1D112A]/70 via-[#1D112A]/60 to-[#0F021C]/70 border-2 border-[#45e3d3]/40 h-full shadow-xl hover:shadow-[#45e3d3]/30 transition-shadow duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#45e3d3]/5 via-transparent to-[#ffcc33]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-center gap-2 mb-6 relative z-10">
                <Award className="w-5 h-5 text-[#45e3d3]" />
                <h3 className="text-white text-lg font-heading">{t.milestones.title}</h3>
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
                          : 'bg-gradient-to-br from-[#1D112A]/50 to-[#0F021C]/50 border-[#ffcc33]/20'
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
                      <div className={`text-xs ${isUnlocked ? 'text-green-500' : 'text-white/60'}`}>
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
