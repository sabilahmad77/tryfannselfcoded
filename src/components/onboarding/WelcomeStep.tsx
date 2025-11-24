import { motion } from 'motion/react';
import { Sparkles, Trophy, Users, Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OnboardingData } from './OnboardingFlow';

interface WelcomeStepProps {
  language: 'en' | 'ar';
  onNext: (data: Record<string, unknown>) => void;
  data: OnboardingData;
}

export function WelcomeStep({ language, onNext, data }: WelcomeStepProps) {
  const isRTL = language === 'ar';

  const t = {
    en: {
      title: 'Welcome to FANN!',
      subtitle: 'You\'re joining a revolutionary art-tech platform',
      intro: 'As a {persona}, you\'re about to unlock exclusive opportunities in the MENA/GCC art ecosystem.',
      features: {
        title: 'What You\'ll Get',
        items: [
          {
            icon: Trophy,
            title: 'Gamified Rewards',
            desc: 'Earn points, climb tiers, and unlock exclusive perks',
          },
          {
            icon: Users,
            title: 'Connect & Collaborate',
            desc: 'Network with artists, galleries, and collectors',
          },
          {
            icon: Gift,
            title: 'Early Access Benefits',
            desc: 'Be among the first to experience our platform',
          },
          {
            icon: Sparkles,
            title: 'Exclusive Content',
            desc: 'Access AR/VR previews and curated collections',
          },
        ],
      },
      welcome: {
        title: 'Let\'s get you started',
        desc: 'This quick setup will take about 5 minutes',
      },
      cta: 'Let\'s Begin',
      personas: {
        artist: 'Artist',
        gallery: 'Gallery Owner',
        collector: 'Collector',
        curator: 'Curator',
        investor: 'Investor',
      },
    },
    ar: {
      title: 'مرحباً بك في FANN!',
      subtitle: 'أنت تنضم إلى منصة فن-تقني ثورية',
      intro: 'بصفتك {persona}، أنت على وشك فتح فرص حصرية في النظام البيئي الفني في منطقة الشرق الأوسط وشمال أفريقيا ودول مجلس التعاون الخليجي.',
      features: {
        title: 'ما ستحصل عليه',
        items: [
          {
            icon: Trophy,
            title: 'مكافآت ممتعة',
            desc: 'احصل على نقاط، وتسلق المستويات، وافتح المزايا الحصرية',
          },
          {
            icon: Users,
            title: 'التواصل والتعاون',
            desc: 'تواصل مع الفنانين والمعارض والجامعين',
          },
          {
            icon: Gift,
            title: 'مزايا الوصول المبكر',
            desc: 'كن من أوائل الذين يختبرون منصتنا',
          },
          {
            icon: Sparkles,
            title: 'محتوى حصري',
            desc: 'الوصول إلى معاينات الواقع المعزز/الافتراضي والمجموعات المنسقة',
          },
        ],
      },
      welcome: {
        title: 'دعنا نبدأ',
        desc: 'سيستغرق هذا الإعداد السريع حوالي 5 دقائق',
      },
      cta: 'لنبدأ',
      personas: {
        artist: 'فنان',
        gallery: 'مالك معرض',
        collector: 'جامع',
        curator: 'منسق',
        investor: 'مستثمر',
      },
    },
  };

  const content = t[language];
  const personaName = content.personas[data.persona as keyof typeof content.personas] || data.persona;

  return (
    <div className="glass border border-white/10 rounded-3xl p-8 md:p-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center"
          >
            <Sparkles className="w-10 h-10 text-amber-400" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl text-white mb-4">{content.title}</h1>
          <p className="text-white/70 text-lg mb-4">{content.subtitle}</p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-6 py-3 rounded-full glass border border-amber-500/30"
          >
            <p className="text-white/80">
              {content.intro.replace('{persona}', personaName)}
            </p>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl text-white mb-6 text-center">{content.features.title}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {content.features.items.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-6 rounded-xl glass border border-white/10 hover:border-amber-500/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white mb-2">{feature.title}</h3>
                      <p className="text-white/60 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8 p-8 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30"
        >
          <h3 className="text-xl text-white mb-2">{content.welcome.title}</h3>
          <p className="text-white/60">{content.welcome.desc}</p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={() => onNext({})}
            className="w-full h-14 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black shadow-lg shadow-amber-500/50 transition-all group relative overflow-hidden text-lg cursor-pointer"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {content.cta}
              <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
