import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Send, MessageSquare, Smile, Meh, Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputField, TextareaField } from '@/components/ui/custom-form-elements';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/dashboard/shared/DashboardLayout';
import { useLanguage } from '@/contexts/useLanguage';

const content = {
  en: {
    title: "Share Your Feedback",
    subtitle: "Help us improve FANN by sharing your thoughts and suggestions",
    satisfactionLabel: "How satisfied are you with FANN?",
    veryDissatisfied: "Very Dissatisfied",
    dissatisfied: "Dissatisfied",
    neutral: "Neutral",
    satisfied: "Satisfied",
    verySatisfied: "Very Satisfied",
    categoryLabel: "What would you like to give feedback about?",
    categories: {
      platform: "Platform Experience",
      features: "Features & Functionality",
      design: "Design & Interface",
      performance: "Performance & Speed",
      support: "Customer Support",
      other: "Other"
    },
    messageLabel: "Your Feedback",
    messagePlaceholder: "Tell us what you think, what we're doing well, or how we can improve...",
    emailLabel: "Email",
    emailPlaceholder: "your.email@example.com",
    submitButton: "Submit Feedback",
    submitting: "Submitting...",
    successTitle: "Thank You!",
    successMessage: "Your feedback has been submitted successfully. We appreciate your input!",
    errorMessage: "Failed to submit feedback. Please try again.",
    requiredField: "Please fill in all required fields"
  },
  ar: {
    title: "شارك ملاحظاتك",
    subtitle: "ساعدنا في تحسين FANN من خلال مشاركة أفكارك واقتراحاتك",
    satisfactionLabel: "ما مدى رضاك عن FANN؟",
    veryDissatisfied: "غير راضٍ جداً",
    dissatisfied: "غير راضٍ",
    neutral: "محايد",
    satisfied: "راضٍ",
    verySatisfied: "راضٍ جداً",
    categoryLabel: "ما الذي تود إبداء ملاحظاتك عنه؟",
    categories: {
      platform: "تجربة المنصة",
      features: "الميزات والوظائف",
      design: "التصميم والواجهة",
      performance: "الأداء والسرعة",
      support: "دعم العملاء",
      other: "أخرى"
    },
    messageLabel: "ملاحظاتك",
    messagePlaceholder: "أخبرنا برأيك، ما نقوم به بشكل جيد، أو كيف يمكننا التحسين...",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "your.email@example.com",
    submitButton: "إرسال الملاحظات",
    submitting: "جاري الإرسال...",
    successTitle: "شكراً لك!",
    successMessage: "تم إرسال ملاحظاتك بنجاح. نحن نقدر مساهمتك!",
    errorMessage: "فشل إرسال الملاحظات. يرجى المحاولة مرة أخرى.",
    requiredField: "يرجى ملء جميع الحقول المطلوبة"
  }
};

export function FeedbackPage() {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === 'ar';

  const [satisfaction, setSatisfaction] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const satisfactionLevels = [
    { value: 1, label: t.veryDissatisfied, icon: Frown, color: '#ef4444' },
    { value: 2, label: t.dissatisfied, icon: Frown, color: '#f97316' },
    { value: 3, label: t.neutral, icon: Meh, color: '#ffcc33' },
    { value: 4, label: t.satisfied, icon: Smile, color: '#45e3d3' },
    { value: 5, label: t.verySatisfied, icon: Smile, color: '#10b981' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!satisfaction || !category || !message.trim()) {
      toast.error(t.requiredField);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const feedbackData = {
        satisfaction,
        category,
        message,
        email: email || null,
        language,
        timestamp: new Date().toISOString(),
      };

      console.log('Feedback submitted:', feedbackData);

      // Show success toast
      toast.success(t.successTitle, {
        description: t.successMessage,
      });

      // Reset form
      setSatisfaction(0);
      setCategory('');
      setMessage('');
      setEmail('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <DashboardLayout currentPage="feedback">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}
      >
        <h1 className="text-4xl md:text-5xl mb-2 text-[#ffffff]">
          {t.title}
        </h1>
        <p className="text-[#808c99] text-lg">{t.subtitle}</p>
      </motion.div>

      <div className="space-y-6">
        {/* Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Satisfaction Rating */}
            <div>
              <label className={`block text-[#ffffff] mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t.satisfactionLabel} <span className="text-[#ef4444]">*</span>
              </label>
              <div className={`grid grid-cols-5 gap-3`}>
                {satisfactionLevels.map((level) => {
                  const Icon = level.icon;
                  const isSelected = satisfaction === level.value;
                  return (
                    <motion.button
                      key={level.value}
                      type="button"
                      onClick={() => setSatisfaction(level.value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl transition-all cursor-pointer ${isSelected
                        ? 'border-2 border-[#ffcc33] bg-[#ffcc33]/10'
                        : 'bg-[#0f021c] border border-[#4e4e4e78]'
                        }`}
                    >
                      <Icon
                        className={`w-8 h-8 mx-auto mb-2 transition-colors`}
                        style={{ color: isSelected ? level.color : '#808c99' }}
                      />
                      <p className={`text-xs text-center ${isSelected ? 'text-[#ffffff]' : 'text-[#808c99]'
                        }`}>
                        {level.label}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className={`block text-[#ffffff] mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t.categoryLabel} <span className="text-[#ef4444]">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(t.categories).map(([key, label]) => {
                  const isSelected = category === key;
                  return (
                    <motion.button
                      key={key}
                      type="button"
                      onClick={() => setCategory(key)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-lg transition-all cursor-pointer ${isSelected
                        ? 'border-2 border-[#ffcc33] bg-[#ffcc33]/10 text-[#ffffff]'
                        : 'bg-[#0f021c] border border-[#4e4e4e78] text-[#808c99] hover:border-[#ffcc33]/30'
                        } ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      <span className="text-sm">{label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Message */}
            <TextareaField
              label={t.messageLabel}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.messagePlaceholder}
              rows={6}
              required
              isRTL={isRTL}
            />

            {/* Email */}
            <InputField
              label={t.emailLabel}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              isRTL={isRTL}
            />

            {/* Submit Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full h-12 shadow-lg shadow-primary/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'flex-row-reverse' : ''
                  }`}
              >
                {isSubmitting ? (
                  <span>{t.submitting}</span>
                ) : (
                  <>
                    <Send className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span>{t.submitButton}</span>
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 shadow-2xl"
        >
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-[#45e3d3]/20 rounded-lg flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-[#45e3d3]" />
              </div>
              <div>
                <h3 className="text-[#ffffff] mb-1">
                  {language === 'en' ? 'Your Voice Matters' : 'صوتك مهم'}
                </h3>
                <p className="text-sm text-[#808c99]">
                  {language === 'en'
                    ? 'Every piece of feedback helps us build a better platform for the art community.'
                    : 'كل ملاحظة تساعدنا في بناء منصة أفضل لمجتمع الفن.'}
                </p>
              </div>
            </div>
            <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-[#ffcc33]/20 rounded-lg flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-[#ffcc33]" />
              </div>
              <div>
                <h3 className="text-[#ffffff] mb-1">
                  {language === 'en' ? 'We Read Everything' : 'نقرأ كل شيء'}
                </h3>
                <p className="text-sm text-[#808c99]">
                  {language === 'en'
                    ? 'Our team reviews every submission to understand your needs better.'
                    : 'يراجع فريقنا كل رسالة لفهم احتياجاتك بشكل أفضل.'}
                </p>
              </div>
            </div>
            <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-[#8b5cf6]/20 rounded-lg flex items-center justify-center shrink-0">
                <Smile className="w-5 h-5 text-[#8b5cf6]" />
              </div>
              <div>
                <h3 className="text-[#ffffff] mb-1">
                  {language === 'en' ? 'Continuous Improvement' : 'تحسين مستمر'}
                </h3>
                <p className="text-sm text-[#808c99]">
                  {language === 'en'
                    ? "We're constantly evolving based on your valuable insights."
                    : 'نحن نتطور باستمرار بناءً على رؤاكم القيمة.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

