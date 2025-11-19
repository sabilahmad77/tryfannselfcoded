import { motion } from 'motion/react';
import { Medal, Crown, Zap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import bgImage from 'figma:asset/c85d96c5ec679934a6c95c18a6db9da4a5b2bc2d.png';

interface LeaderboardProps {
  language: 'en' | 'ar';
  onNavigateToSignUp?: () => void;
}

const content = {
  en: {
    title: { white: "Global", gold: " Leaderboard" },
    subtitle: "Compete with art pioneers from around the world",
    tabs: ["All Time", "This Month", "This Week"],
    columns: ["Rank", "User", "Points", "Tier"],
    viewAll: "View Full Leaderboard",
    yourRank: "Your Current Rank",
    leaders: [
      {
        rank: 1,
        name: "Sarah Al-Mansouri",
        username: "@sarahm",
        points: 8450,
        tier: "Founding Patron",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
      },
      {
        rank: 2,
        name: "Michael Chen",
        username: "@mchen",
        points: 7230,
        tier: "Founding Patron",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
      },
      {
        rank: 3,
        name: "Layla Hassan",
        username: "@laylaart",
        points: 6890,
        tier: "Founding Patron",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Layla"
      },
      {
        rank: 4,
        name: "James Rodriguez",
        username: "@jrodriguez",
        points: 5420,
        tier: "Founding Patron",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James"
      },
      {
        rank: 5,
        name: "Fatima Al-Khalifa",
        username: "@fatimak",
        points: 4980,
        tier: "Ambassador",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima"
      }
    ]
  },
  ar: {
    title: { white: "لوحة المتصدرين", gold: " العالمية" },
    subtitle: "تنافس مع رواد الفن من جميع أنحاء العالم",
    tabs: ["كل الأوقات", "هذا الشهر", "هذا الأسبوع"],
    columns: ["الترتيب", "المستخدم", "النقاط", "المستوى"],
    viewAll: "عرض لوحة المتصدرين الكاملة",
    yourRank: "ترتيبك الحالي",
    leaders: [
      {
        rank: 1,
        name: "سارة المنصوري",
        username: "@sarahm",
        points: 8450,
        tier: "راعي مؤسس",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
      },
      {
        rank: 2,
        name: "مايكل تشين",
        username: "@mchen",
        points: 7230,
        tier: "راعي مؤسس",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
      },
      {
        rank: 3,
        name: "ليلى حسن",
        username: "@laylaart",
        points: 6890,
        tier: "راعي مؤسس",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Layla"
      },
      {
        rank: 4,
        name: "جيمس رودريغيز",
        username: "@jrodriguez",
        points: 5420,
        tier: "راعي مؤسس",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James"
      },
      {
        rank: 5,
        name: "فاطمة الخليفة",
        username: "@fatimak",
        points: 4980,
        tier: "سفير",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima"
      }
    ]
  }
};

export function Leaderboard({ language }: LeaderboardProps) {
  const t = content[language];
  const isRTL = language === 'ar';

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Crown className="w-6 h-6 text-amber-400" />
          </motion.div>
        );
      case 2:
        return <Medal className="w-6 h-6 text-white/60" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="text-white/60">#{rank}</span>;
    }
  };

  const getTierColor = (tier: string) => {
    if (tier.includes('Founding') || tier.includes('مؤسس')) return 'border-amber-500/50 text-amber-400 bg-amber-500/10';
    if (tier.includes('Ambassador') || tier.includes('سفير')) return 'border-orange-500/50 text-orange-400 bg-orange-500/10';
    if (tier.includes('Curator') || tier.includes('منسق')) return 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10';
    return 'border-white/10 text-white/60 bg-white/5';
  };

  return (
    <section className="relative py-32 overflow-hidden bg-[#0a0612]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Abstract Art Background Pattern */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={bgImage}
          alt="Abstract Art Pattern"
          className="w-full h-full object-cover opacity-75"
          style={{ transform: 'rotate(90deg) scale(1.1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/50 via-transparent to-[#0f172a]/55" />
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#14b8a6]/15 rounded-full blur-3xl" />
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

        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-10"
          >
            {t.tabs.map((tab, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-full transition-all duration-300 ${
                  index === 0
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black shadow-lg shadow-amber-500/50'
                    : 'glass border border-white/10 text-white/60 hover:text-white hover:border-amber-500/50'
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </motion.div>

          {/* Your Rank Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#1e1b4b]/80 via-[#1e293b]/70 to-[#0f172a]/80 border-2 border-[#d4af37]/50 relative overflow-hidden shadow-xl shadow-[#d4af37]/20"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/15 via-[#14b8a6]/15 to-[#d4af37]/15"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Zap className="w-6 h-6 text-yellow-400" />
                <span className="text-white text-lg">{t.yourRank}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-orange-400 text-xl">#247</span>
                <span className="text-white/60">•</span>
                <span className="text-white text-lg">350 points</span>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="rounded-3xl backdrop-blur-xl bg-gradient-to-br from-[#1e1b4b]/75 via-[#1e293b]/65 to-[#0f172a]/75 border-2 border-[#d4af37]/40 overflow-hidden shadow-2xl shadow-[#d4af37]/20"
          >
            {/* Mobile View */}
            <div className="block lg:hidden">
              {t.leaders.map((leader, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ backgroundColor: 'rgba(212, 175, 55, 0.08)', scale: 1.01 }}
                  className="p-6 border-b border-[#d4af37]/10 last:border-0 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 shrink-0">
                      {getRankIcon(leader.rank)}
                    </div>

                    {/* Avatar & Info */}
                    <Avatar className="w-14 h-14 border-2 border-orange-500/50">
                      <AvatarImage src={leader.avatar} alt={leader.name} />
                      <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="text-white truncate">{leader.name}</div>
                      <div className="text-white/60 text-sm">{leader.username}</div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <div className="text-transparent bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text">
                        {leader.points.toLocaleString()}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs mt-2 ${getTierColor(leader.tier)}`}
                      >
                        {leader.tier}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    {t.columns.map((column, index) => (
                      <th
                        key={index}
                        className="px-8 py-5 text-left text-white/60 text-sm"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.leaders.map((leader, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ backgroundColor: 'rgba(168, 85, 247, 0.05)' }}
                      className="border-b border-white/10 last:border-0 transition-colors"
                    >
                      {/* Rank */}
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center w-12">
                          {getRankIcon(leader.rank)}
                        </div>
                      </td>

                      {/* User */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 border-2 border-orange-500/50">
                            <AvatarImage src={leader.avatar} alt={leader.name} />
                            <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-white">{leader.name}</div>
                            <div className="text-white/60 text-sm">{leader.username}</div>
                          </div>
                        </div>
                      </td>

                      {/* Points */}
                      <td className="px-8 py-5">
                        <span className="text-transparent bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-lg">
                          {leader.points.toLocaleString()}
                        </span>
                      </td>

                      {/* Tier */}
                      <td className="px-8 py-5">
                        <Badge
                          variant="outline"
                          className={getTierColor(leader.tier)}
                        >
                          {leader.tier}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-transparent bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text hover:from-orange-300 hover:to-amber-300 transition-all"
            >
              {t.viewAll} →
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
