import { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Target, Users, Gift, ArrowRight, ChevronLeft, Sparkles, Crown } from 'lucide-react';
import { Button } from '../ui/button';
import type { OnboardingData } from './OnboardingFlow';

interface GamificationStepProps {
  language: 'en' | 'ar';
  onNext: (data: Record<string, unknown>) => void;
  onBack?: () => void;
  data: OnboardingData;
}

export function GamificationStep({ language, onNext, onBack }: GamificationStepProps) {
  const [selectedGoal, setSelectedGoal] = useState<string>('');

  const isRTL = language === 'ar';

  const t = {
    en: {
      title: 'Set Your First Goal',
      subtitle: 'Let\'s make your FANN journey rewarding',
      currentStatus: {
        title: 'Your Current Status',
        tier: 'Explorer Tier',
        points: '0 Points',
        rank: 'Unranked',
      },
      goals: {
        title: 'Choose Your Primary Goal',
        subtitle: 'This will help us guide your experience',
        options: [
          {
            id: 'networking',
            icon: Users,
            title: 'Build Network',
            desc: 'Connect with 50+ art professionals',
            reward: '+500 pts',
            color: 'from-blue-500/20 to-cyan-500/20',
            borderColor: 'blue-500/50',
          },
          {
            id: 'collection',
            icon: Gift,
            title: 'Start Collecting',
            desc: 'Discover and collect 10 artworks',
            reward: '+750 pts',
            color: 'from-amber-500/20 to-orange-500/20',
            borderColor: 'amber-500/50',
          },
          {
            id: 'showcase',
            icon: Sparkles,
            title: 'Showcase Work',
            desc: 'Upload and feature 20 artworks',
            reward: '+600 pts',
            color: 'from-purple-500/20 to-pink-500/20',
            borderColor: 'purple-500/50',
          },
          {
            id: 'referral',
            icon: Trophy,
            title: 'Grow Community',
            desc: 'Invite 15 quality members',
            reward: '+1000 pts',
            color: 'from-yellow-500/20 to-amber-500/20',
            borderColor: 'yellow-500/50',
          },
        ],
      },
      rewards: {
        title: 'What You\'ll Unlock',
        items: [
          {
            tier: 'Curator',
            points: '1,000 pts',
            perks: ['Priority support', 'AR previews', 'Exclusive events'],
          },
          {
            tier: 'Ambassador',
            points: '5,000 pts',
            perks: ['VIP badge', 'Early releases', 'Custom profile'],
          },
          {
            tier: 'Founding Patron',
            points: '10,000 pts',
            perks: ['Lifetime benefits', 'Advisory access', 'Revenue share'],
          },
        ],
      },
      tiers: {
        title: 'Tier System',
        desc: 'Progress through tiers by earning points and achieving milestones',
      },
      back: 'Back',
      continue: 'Start My Journey',
    },
    ar: {
      title: 'حدد هدفك الأول',
      subtitle: 'دعنا نجعل رحلتك في FANN مجزية',
      currentStatus: {
        title: 'حالتك الحالية',
        tier: 'مستوى المستكشف',
        points: '0 نقطة',
        rank: 'غير مصنف',
      },
      goals: {
        title: 'اختر هدفك الأساسي',
        subtitle: 'سيساعدنا هذا في توجيه تجربتك',
        options: [
          {
            id: 'networking',
            icon: Users,
            title: 'بناء الشبكة',
            desc: 'تواصل مع أكثر من 50 محترف فني',
            reward: '+500 نقطة',
            color: 'from-blue-500/20 to-cyan-500/20',
            borderColor: 'blue-500/50',
          },
          {
            id: 'collection',
            icon: Gift,
            title: 'ابدأ الجمع',
            desc: 'اكتشف واجمع 10 أعمال فنية',
            reward: '+750 نقطة',
            color: 'from-amber-500/20 to-orange-500/20',
            borderColor: 'amber-500/50',
          },
          {
            id: 'showcase',
            icon: Sparkles,
            title: 'اعرض الأعمال',
            desc: 'حمّل واعرض 20 عملاً فنياً',
            reward: '+600 نقطة',
            color: 'from-purple-500/20 to-pink-500/20',
            borderColor: 'purple-500/50',
          },
          {
            id: 'referral',
            icon: Trophy,
            title: 'تنمية المجتمع',
            desc: 'ادعُ 15 عضواً ذا جودة',
            reward: '+1000 نقطة',
            color: 'from-yellow-500/20 to-amber-500/20',
            borderColor: 'yellow-500/50',
          },
        ],
      },
      rewards: {
        title: 'ما ستفتحه',
        items: [
          {
            tier: 'منسق',
            points: '1,000 نقطة',
            perks: ['دعم ذو أولوية', 'معاينات الواقع المعزز', 'فعاليات حصرية'],
          },
          {
            tier: 'سفير',
            points: '5,000 نقطة',
            perks: ['شارة VIP', 'إصدارات مبكرة', 'ملف شخصي مخصص'],
          },
          {
            tier: 'راعي مؤسس',
            points: '10,000 نقطة',
            perks: ['مزايا مدى الحياة', 'وصول استشاري', 'حصة من الإيرادات'],
          },
        ],
      },
      tiers: {
        title: 'نظام المستويات',
        desc: 'تقدم عبر المستويات عن طريق كسب النقاط وتحقيق المعالم',
      },
      back: 'رجوع',
      continue: 'ابدأ رحلتي',
    },
  };

  const content = t[language];

  const handleSubmit = () => {
    onNext({ selectedGoal });
  };

  return (
    <div className="glass border border-white/10 rounded-3xl p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-3xl text-white mb-2">{content.title}</h2>
          <p className="text-white/60">{content.subtitle}</p>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30"
        >
          <h3 className="text-white mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            {content.currentStatus.title}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg glass">
              <div className="text-2xl text-amber-400 mb-1">{content.currentStatus.tier}</div>
              <div className="text-xs text-white/60">Tier</div>
            </div>
            <div className="text-center p-4 rounded-lg glass">
              <div className="text-2xl text-white mb-1">{content.currentStatus.points}</div>
              <div className="text-xs text-white/60">Total</div>
            </div>
            <div className="text-center p-4 rounded-lg glass">
              <div className="text-2xl text-white/60 mb-1">{content.currentStatus.rank}</div>
              <div className="text-xs text-white/60">Position</div>
            </div>
          </div>
        </motion.div>

        {/* Goals Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="mb-6 text-center">
            <h3 className="text-2xl text-white mb-2">{content.goals.title}</h3>
            <p className="text-white/60">{content.goals.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {content.goals.options.map((goal, index) => {
              const Icon = goal.icon;
              const isSelected = selectedGoal === goal.id;

              return (
                <motion.button
                  key={goal.id}
                  type="button"
                  onClick={() => setSelectedGoal(goal.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-xl border transition-all text-left ${
                    isSelected
                      ? `bg-gradient-to-br ${goal.color} border-${goal.borderColor}`
                      : 'glass border-white/10 hover:border-amber-500/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${goal.color} border border-${goal.borderColor} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-7 h-7 ${isSelected ? 'text-amber-400' : 'text-white/70'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`text-lg ${isSelected ? 'text-white' : 'text-white/80'}`}>
                          {goal.title}
                        </h4>
                        <span className="text-amber-400 text-sm shrink-0 ml-2">{goal.reward}</span>
                      </div>
                      <p className="text-white/60 text-sm mb-3">{goal.desc}</p>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-2 text-amber-400 text-sm"
                        >
                          <Target className="w-4 h-4" />
                          <span>Selected Goal</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Rewards Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <div className="mb-6 text-center">
            <h3 className="text-2xl text-white mb-2">{content.rewards.title}</h3>
            <p className="text-white/60">{content.tiers.desc}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {content.rewards.items.map((reward, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="p-6 rounded-xl glass border border-white/10 hover:border-amber-500/30 transition-all"
              >
                <div className="text-center mb-4">
                  <div className="text-xl text-white mb-1">{reward.tier}</div>
                  <div className="text-amber-400 text-sm">{reward.points}</div>
                </div>
                <div className="space-y-2">
                  {reward.perks.map((perk, perkIndex) => (
                    <div key={perkIndex} className="flex items-center gap-2 text-white/60 text-sm">
                      <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex gap-4"
        >
          {onBack && (
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="flex-1 h-12 border-white/20 hover:border-amber-500/50 hover:bg-amber-500/10 text-white/70 hover:text-white"
            >
              <ChevronLeft className={`w-5 h-5 mr-2 ${isRTL ? 'rotate-180' : ''}`} />
              {content.back}
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedGoal}
            className="flex-1 h-12 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black shadow-lg shadow-amber-500/50 group relative overflow-hidden disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {content.continue}
              <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
            </span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
