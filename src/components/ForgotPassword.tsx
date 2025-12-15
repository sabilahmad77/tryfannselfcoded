import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowRight, ChevronLeft, Sparkles, Shield, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useLanguage } from '@/contexts/useLanguage';

interface ForgotPasswordProps {
  onNavigateToSignIn: () => void;
  onNavigateToHome: () => void;
}

export function ForgotPassword({ onNavigateToSignIn, onNavigateToHome }: ForgotPasswordProps) {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const t = {
    en: {
      title: 'Reset Password',
      subtitle: 'Enter your email to receive a password reset link',
      successTitle: 'Check Your Email',
      successSubtitle: "We've sent password reset instructions to",
      email: 'Email Address',
      emailPlaceholder: 'your.email@example.com',
      sendButton: 'Send Reset Link',
      sending: 'Sending...',
      backToSignIn: 'Back to Sign In',
      backToHome: 'Back to Home',
      resendLink: "Didn't receive the email?",
      resend: 'Resend',
      checkSpam: "Check your spam folder if you don't see the email",
      instructions: [
        'Check your email inbox',
        'Click the reset link we sent you',
        'Create a new password',
        'Sign in with your new credentials'
      ]
    },
    ar: {
      title: 'إعادة تعيين كلمة المرور',
      subtitle: 'أدخل بريدك الإلكتروني لتلقي رابط إعادة تعيين كلمة المرور',
      successTitle: 'تحقق من بريدك الإلكتروني',
      successSubtitle: "لقد أرسلنا تعليمات إعادة تعيين كلمة المرور إلى",
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'your.email@example.com',
      sendButton: 'إرسال رابط إعادة التعيين',
      sending: 'جارٍ الإرسال...',
      backToSignIn: 'العودة لتسجيل الدخول',
      backToHome: 'العودة للرئيسية',
      resendLink: "لم تتلق البريد الإلكتروني؟",
      resend: 'إعادة الإرسال',
      checkSpam: "تحقق من مجلد البريد العشوائي إذا لم تجد البريد الإلكتروني",
      instructions: [
        'تحقق من صندوق بريدك الإلكتروني',
        'انقر على رابط إعادة التعيين الذي أرسلناه لك',
        'أنشئ كلمة مرور جديدة',
        'سجّل الدخول باستخدام بيانات الاعتماد الجديدة'
      ]
    }
  };

  const content = t[language];
  const isRTL = language === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setEmailSent(true);
  };

  const handleResend = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F021C] flex" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* LEFT PANEL - Branding & Info */}
      <motion.div 
        initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-[40%] relative overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffcc33]/10 via-[#45e3d3]/5 to-[#4de3ed]/10" />
          <div className="absolute top-20 -left-20 w-80 h-80 bg-[#ffcc33]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 -right-20 w-80 h-80 bg-[#45e3d3]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,204,51,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,204,51,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo/Brand */}
          <div className="mb-12">
            <motion.button
              onClick={onNavigateToHome}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 text-[#808c99] hover:text-[#ffcc33] transition-colors group mb-8"
            >
              <ChevronLeft className={`w-5 h-5 group-hover:-translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
              <span className="text-sm">{content.backToHome}</span>
            </motion.button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffcc33] to-[#ffb54d] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#020e27]" />
              </div>
              <h1 className="text-3xl text-[#ffffff]">FANN</h1>
            </div>
            <p className="text-[#808c99] text-sm">{content.subtitle}</p>
          </div>

          {/* Features Section */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[#ffcc33]/10 border border-[#ffcc33]/30 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#ffcc33]" />
                </div>
                <div>
                  <h2 className="text-xl text-[#ffffff] mb-1">
                    {language === 'en' ? 'Secure Reset Process' : 'عملية إعادة تعيين آمنة'}
                  </h2>
                  <p className="text-[#808c99] text-sm">
                    {language === 'en' ? 'Your security is our priority' : 'أمانك هو أولويتنا'}
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-6 rounded-xl bg-[#1D112A]/50 border border-[#ffcc33]/20">
                {content.instructions.map((instruction, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#ffcc33]/20 border border-[#ffcc33]/40 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[#ffcc33] text-xs">{idx + 1}</span>
                    </div>
                    <p className="text-[#808c99] text-sm">{instruction}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT PANEL - Form */}
      <div className="flex-1 relative overflow-hidden">
        {/* Form Container */}
        <div className="h-full overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-6 lg:p-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-xl"
            >
              {!emailSent ? (
                <>
                  {/* Header */}
                  <div className="mb-8">
                    <h2 className="text-3xl text-[#ffffff] mb-2">{content.title}</h2>
                    <p className="text-[#808c99]">{content.subtitle}</p>
                  </div>

                  {/* Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#ffffff]/80">{content.email}</Label>
                        <div className="relative">
                          <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#808c99] ${isRTL ? 'right-3' : 'left-3'}`} />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={content.emailPlaceholder}
                            className={`bg-[#0f021c] border border-[#ffcc33]/20 text-[#ffffff] placeholder:text-[#808c99] h-11 focus:border-[#ffcc33]/50 focus:ring-[#ffcc33]/20 ${isRTL ? 'pr-10' : 'pl-10'}`}
                            required
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-2">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-12 bg-gradient-to-r from-[#ffcc33] to-[#45e3d3] text-[#020e27] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {isLoading ? content.sending : content.sendButton}
                            {!isLoading && <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />}
                          </span>
                        </Button>
                      </div>
                    </form>

                    {/* Back to Sign In Link */}
                    <div className="mt-6 text-center">
                      <button
                        type="button"
                        onClick={onNavigateToSignIn}
                        className="text-[#ffcc33] hover:text-[#ffb54d] transition-colors text-sm flex items-center justify-center gap-2 mx-auto"
                      >
                        <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                        {content.backToSignIn}
                      </button>
                    </div>
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Success State */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    {/* Success Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-[#45e3d3] to-[#4de3ed] flex items-center justify-center mx-auto mb-6"
                    >
                      <Check className="w-10 h-10 text-white" />
                    </motion.div>

                    {/* Success Message */}
                    <h2 className="text-3xl text-[#ffffff] mb-3">{content.successTitle}</h2>
                    <p className="text-[#808c99] mb-2">{content.successSubtitle}</p>
                    <p className="text-[#ffcc33] mb-8">{email}</p>

                    {/* Info Box */}
                    <div className="p-6 rounded-xl bg-[#1D112A]/50 border border-[#ffcc33]/20 mb-6">
                      <p className="text-[#808c99] text-sm mb-4">{content.checkSpam}</p>
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="text-[#808c99]">{content.resendLink}</span>
                        <button
                          onClick={handleResend}
                          disabled={isLoading}
                          className="text-[#ffcc33] hover:text-[#ffb54d] transition-colors disabled:opacity-50"
                        >
                          {content.resend}
                        </button>
                      </div>
                    </div>

                    {/* Back to Sign In Button */}
                    <Button
                      onClick={onNavigateToSignIn}
                      className="w-full h-12 bg-gradient-to-r from-[#ffcc33] to-[#45e3d3] text-[#020e27] hover:opacity-90 transition-opacity"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <ChevronLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                        {content.backToSignIn}
                      </span>
                    </Button>
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

