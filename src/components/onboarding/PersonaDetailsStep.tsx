import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Palette, Building2, Gem, Users as UsersIcon, TrendingUp, 
  Upload, Instagram, Globe, ArrowRight, ChevronLeft
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import type { OnboardingData } from './OnboardingFlow';

interface PersonaDetailsStepProps {
  language: 'en' | 'ar';
  onNext: (data: Record<string, unknown>) => void;
  onBack?: () => void;
  data: OnboardingData;
}

export function PersonaDetailsStep({ language, onNext, onBack, data }: PersonaDetailsStepProps) {
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    website: '',
    instagram: '',
    portfolio: '',
    specialization: '',
    experience: '',
    location: '',
  });

  const isRTL = language === 'ar';

  const t = {
    en: {
      title: 'Tell us about yourself',
      subtitle: 'Help us personalize your FANN experience',
      artist: {
        displayName: 'Artist Name',
        displayNamePlaceholder: 'Your professional name',
        bio: 'Artist Bio',
        bioPlaceholder: 'Tell us about your artistic journey and style...',
        specialization: 'Art Medium/Style',
        specializationPlaceholder: 'e.g., Contemporary, Abstract, Digital Art',
        experience: 'Years of Experience',
        experiencePlaceholder: '5',
        portfolio: 'Portfolio URL',
        portfolioPlaceholder: 'https://yourportfolio.com',
      },
      gallery: {
        displayName: 'Gallery Name',
        displayNamePlaceholder: 'Your gallery\'s name',
        bio: 'Gallery Description',
        bioPlaceholder: 'Tell us about your gallery, focus, and vision...',
        specialization: 'Gallery Focus',
        specializationPlaceholder: 'e.g., Modern Art, Sculpture, Photography',
        experience: 'Years in Operation',
        experiencePlaceholder: '10',
        location: 'Gallery Location',
        locationPlaceholder: 'Dubai, UAE',
      },
      collector: {
        displayName: 'Display Name',
        displayNamePlaceholder: 'How should we call you?',
        bio: 'About Your Collection',
        bioPlaceholder: 'What drives your collecting passion?...',
        specialization: 'Collection Focus',
        specializationPlaceholder: 'e.g., MENA Artists, Contemporary Photography',
        experience: 'Years Collecting',
        experiencePlaceholder: '7',
      },
      curator: {
        displayName: 'Professional Name',
        displayNamePlaceholder: 'Your curatorial name',
        bio: 'Curatorial Statement',
        bioPlaceholder: 'Share your curatorial approach and philosophy...',
        specialization: 'Curatorial Expertise',
        specializationPlaceholder: 'e.g., Contemporary Art, Cultural Heritage',
        experience: 'Years of Experience',
        experiencePlaceholder: '8',
      },
      investor: {
        displayName: 'Name/Organization',
        displayNamePlaceholder: 'Your name or company',
        bio: 'Investment Philosophy',
        bioPlaceholder: 'What guides your art investment decisions?...',
        specialization: 'Investment Focus',
        specializationPlaceholder: 'e.g., Emerging Artists, Blue-chip Art',
        experience: 'Years Investing',
        experiencePlaceholder: '5',
      },
      common: {
        website: 'Website',
        websitePlaceholder: 'https://yourwebsite.com',
        instagram: 'Instagram Handle',
        instagramPlaceholder: '@yourusername',
        uploadPhoto: 'Upload Profile Photo',
        optional: '(Optional)',
        required: 'Required fields',
      },
      back: 'Back',
      continue: 'Continue',
    },
    ar: {
      title: 'أخبرنا عن نفسك',
      subtitle: 'ساعدنا في تخصيص تجربتك في FANN',
      artist: {
        displayName: 'اسم الفنان',
        displayNamePlaceholder: 'اسمك المهني',
        bio: 'السيرة الفنية',
        bioPlaceholder: 'أخبرنا عن رحلتك الفنية وأسلوبك...',
        specialization: 'الوسيط/الأسلوب الفني',
        specializationPlaceholder: 'مثلاً: معاصر، تجريدي، فن رقمي',
        experience: 'سنوات الخبرة',
        experiencePlaceholder: '5',
        portfolio: 'رابط المعرض',
        portfolioPlaceholder: 'https://yourportfolio.com',
      },
      gallery: {
        displayName: 'اسم المعرض',
        displayNamePlaceholder: 'اسم معرضك',
        bio: 'وصف المعرض',
        bioPlaceholder: 'أخبرنا عن معرضك وتركيزك ورؤيتك...',
        specialization: 'تركيز المعرض',
        specializationPlaceholder: 'مثلاً: الفن الحديث، النحت، التصوير الفوتوغرافي',
        experience: 'سنوات التشغيل',
        experiencePlaceholder: '10',
        location: 'موقع المعرض',
        locationPlaceholder: 'دبي، الإمارات',
      },
      collector: {
        displayName: 'الاسم المعروض',
        displayNamePlaceholder: 'كيف يجب أن نناديك؟',
        bio: 'عن مجموعتك',
        bioPlaceholder: 'ما الذي يحرك شغفك بالجمع؟...',
        specialization: 'تركيز المجموعة',
        specializationPlaceholder: 'مثلاً: فنانو منطقة الشرق الأوسط، التصوير المعاصر',
        experience: 'سنوات الجمع',
        experiencePlaceholder: '7',
      },
      curator: {
        displayName: 'الاسم المهني',
        displayNamePlaceholder: 'اسمك التنسيقي',
        bio: 'البيان التنسيقي',
        bioPlaceholder: 'شارك نهجك وفلسفتك التنسيقية...',
        specialization: 'الخبرة التنسيقية',
        specializationPlaceholder: 'مثلاً: الفن المعاصر، التراث الثقافي',
        experience: 'سنوات الخبرة',
        experiencePlaceholder: '8',
      },
      investor: {
        displayName: 'الاسم/المؤسسة',
        displayNamePlaceholder: 'اسمك أو شركتك',
        bio: 'فلسفة الاستثمار',
        bioPlaceholder: 'ما الذي يوجه قرارات استثمارك الفني؟...',
        specialization: 'تركيز الاستثمار',
        specializationPlaceholder: 'مثلاً: الفنانون الناشئون، الفن الممتاز',
        experience: 'سنوات الاستثمار',
        experiencePlaceholder: '5',
      },
      common: {
        website: 'الموقع الإلكتروني',
        websitePlaceholder: 'https://yourwebsite.com',
        instagram: 'حساب إنستغرام',
        instagramPlaceholder: '@yourusername',
        uploadPhoto: 'تحميل صورة الملف الشخصي',
        optional: '(اختياري)',
        required: 'الحقول المطلوبة',
      },
      back: 'رجوع',
      continue: 'متابعة',
    },
  };

  const content = t[language];
  const personaContent = (data.persona && typeof data.persona === 'string' && data.persona in content
    ? (content[data.persona as keyof typeof content] as typeof content.artist)
    : content.artist);

  const icons = {
    artist: Palette,
    gallery: Building2,
    collector: Gem,
    curator: UsersIcon,
    investor: TrendingUp,
  };

  const Icon = icons[data.persona as keyof typeof icons] || Palette;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.displayName || !formData.bio) return;
    onNext(formData);
  };

  return (
    <div className="glass border border-white/10 rounded-3xl p-8 md:p-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
            <Icon className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-3xl text-white mb-2">{content.title}</h2>
          <p className="text-white/60">{content.subtitle}</p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label className="text-white/80 mb-2 block">
              {content.common.uploadPhoto} <span className="text-white/40">{content.common.optional}</span>
            </Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center hover:border-amber-500/50 transition-colors cursor-pointer group">
                <Upload className="w-8 h-8 text-white/40 group-hover:text-amber-400 transition-colors" />
              </div>
              <div className="text-sm text-white/60">
                <p className="mb-1">Click to upload or drag and drop</p>
                <p className="text-white/40">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </motion.div>

          {/* Display Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="displayName" className="text-white/80">
              {personaContent.displayName} <span className="text-amber-400">*</span>
            </Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder={personaContent.displayNamePlaceholder}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus:border-amber-500/50 focus:ring-amber-500/20"
              required
            />
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="bio" className="text-white/80">
              {personaContent.bio} <span className="text-amber-400">*</span>
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder={personaContent.bioPlaceholder}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-32 focus:border-amber-500/50 focus:ring-amber-500/20 resize-none"
              required
            />
          </motion.div>

          {/* Two Column Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Specialization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="specialization" className="text-white/80">
                {personaContent.specialization}
              </Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder={personaContent.specializationPlaceholder}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus:border-amber-500/50 focus:ring-amber-500/20"
              />
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="experience" className="text-white/80">
                {personaContent.experience}
              </Label>
              <Input
                id="experience"
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder={personaContent.experiencePlaceholder}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus:border-amber-500/50 focus:ring-amber-500/20"
              />
            </motion.div>
          </div>

          {/* Social Links */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Website */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <Label htmlFor="website" className="text-white/80">
                {content.common.website} <span className="text-white/40">{content.common.optional}</span>
              </Label>
              <div className="relative">
                <Globe className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder={content.common.websitePlaceholder}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus:border-amber-500/50 focus:ring-amber-500/20 ${isRTL ? 'pr-10' : 'pl-10'}`}
                />
              </div>
            </motion.div>

            {/* Instagram */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-2"
            >
              <Label htmlFor="instagram" className="text-white/80">
                {content.common.instagram} <span className="text-white/40">{content.common.optional}</span>
              </Label>
              <div className="relative">
                <Instagram className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder={content.common.instagramPlaceholder}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus:border-amber-500/50 focus:ring-amber-500/20 ${isRTL ? 'pr-10' : 'pl-10'}`}
                />
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-4 pt-6"
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
              type="submit"
              disabled={!formData.displayName || !formData.bio}
              className="flex-1 h-12 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black shadow-lg shadow-amber-500/50 group relative overflow-hidden disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {content.continue}
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
              </span>
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
