import { motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/useLanguage';

interface CompleteProfileProps {
  profileCompleted?: boolean;
  onCompleteProfile?: () => void;
}

const content = {
  en: {
    profileIncomplete: "Complete your profile to unlock all features",
    completeNow: "Complete Now",
  },
  ar: {
    profileIncomplete: "أكمل ملفك الشخصي لفتح جميع الميزات",
    completeNow: "أكمل الآن",
  }
};

export function CompleteProfile({ 
  profileCompleted = false, 
  onCompleteProfile 
}: CompleteProfileProps) {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === 'ar';

  // Don't render if profile is already completed
  if (!profileCompleted) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="glass border border-[#ffcc33]/30 p-4 rounded-xl mb-6 shadow-2xl"
    >
      <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <AlertCircle className={`w-5 h-5 text-[#ffcc33] flex-shrink-0 ${isRTL ? 'ml-3' : 'mr-3'}`} />
        <p className={`text-[#808c99] text-sm flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t.profileIncomplete}
        </p>
        <button 
          className={`text-[#ffcc33] hover:text-[#ffb54d] underline text-sm transition-colors flex-shrink-0 ${isRTL ? 'mr-3' : 'ml-3'}`}
          onClick={onCompleteProfile}
        >
          {t.completeNow}
        </button>
      </div>
    </motion.div>
  );
}

