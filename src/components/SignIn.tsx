import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ChevronLeft, Shield, Zap, Globe, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface SignInProps {
  language: 'en' | 'ar';
  onNavigateToSignUp: () => void;
  onNavigateToHome: () => void;
}

export function SignIn({ language, onNavigateToSignUp, onNavigateToHome }: SignInProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const t = {
    en: {
      title: 'Welcome Back',
      subtitle: 'Sign in to continue your FANN journey',
      email: 'Email Address',
      emailPlaceholder: 'your.email@example.com',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      forgotPassword: 'Forgot password?',
      signInButton: 'Sign In',
      signingIn: 'Signing in...',
      noAccount: "Don't have an account?",
      signUp: 'Sign Up',
      orContinue: 'Or continue with',
      sso: 'Single Sign-On',
      backToHome: 'Back to Home',
      leftPanel: {
        title: 'Continue Your Art Journey',
        desc: 'Access your personalized dashboard and connect with the MENA/GCC art ecosystem.',
        features: [
          { icon: Shield, title: 'Secure Access', desc: 'Your account is protected with enterprise-grade security' },
          { icon: TrendingUp, title: 'Track Progress', desc: 'Monitor your points, tier status, and achievements' },
          { icon: Globe, title: 'Global Network', desc: 'Engage with verified artists, galleries, and collectors' },
          { icon: Zap, title: 'Instant Rewards', desc: 'Earn points for every interaction and milestone' },
        ],
      },
      stats: {
        artists: 'Artists',
        collectors: 'Collectors',
        galleries: 'Galleries',
      }
    },
    ar: {
      title: 'مرحباً بعودتك',
      subtitle: 'سجّل الدخول لمواصلة رحلتك في FANN',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'your.email@example.com',
      password: 'كلمة المرور',
      passwordPlaceholder: 'أدخل كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      signInButton: 'تسجيل الدخول',
      signingIn: 'جارٍ تسجيل الدخول...',
      noAccount: 'ليس لديك حساب؟',
      signUp: 'إنشاء حساب',
      orContinue: 'أو المتابعة باستخدام',
      sso: 'تسجيل دخول موحد',
      backToHome: 'العودة للرئيسية',
      leftPanel: {
        title: 'تابع رحلتك الفنية',
        desc: 'الوصول إلى لوحة التحكم الشخصية والتواصل مع نظام الفن في منطقة الشرق الأوسط وشمال أفريقيا ودول مجلس التعاون الخليجي.',
        features: [
          { icon: Shield, title: 'دخول آمن', desc: 'حسابك محمي بأمان على مستوى المؤسسات' },
          { icon: TrendingUp, title: 'تتبع التقدم', desc: 'راقب نقاطك ومستوى طبقتك وإنجازاتك' },
          { icon: Globe, title: 'شبكة عالمية', desc: 'تفاعل مع فنانين ومعارض وجامعين معتمدين' },
          { icon: Zap, title: 'مكافآت فورية', desc: 'اكسب نقاطاً عن كل تفاعل وإنجاز' },
        ],
      },
      stats: {
        artists: 'فنانون',
        collectors: 'جامعون',
        galleries: 'معارض',
      }
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
  };

  const statsData = [
    { value: '500+', label: content.stats.artists, color: 'from-[#d4af37] to-[#fbbf24]' },
    { value: '1.2K+', label: content.stats.collectors, color: 'from-[#14b8a6] to-[#0ea5e9]' },
    { value: '150+', label: content.stats.galleries, color: 'from-[#0ea5e9] to-[#14b8a6]' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] flex" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* LEFT PANEL - Branding & Info */}
      <motion.div 
        initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-[40%] relative overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-[#14b8a6]/5 to-[#0ea5e9]/10" />
          <div className="absolute top-20 -left-20 w-80 h-80 bg-[#d4af37]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 -right-20 w-80 h-80 bg-[#14b8a6]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo/Brand */}
          <div className="mb-12">
            <motion.button
              onClick={onNavigateToHome}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 text-cream/70 hover:text-[#d4af37] transition-colors group mb-8"
            >
              <ChevronLeft className={`w-5 h-5 group-hover:-translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
              <span className="text-sm">{content.backToHome}</span>
            </motion.button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#fbbf24] flex items-center justify-center glow-gold">
                <Sparkles className="w-6 h-6 text-[#0f172a]" />
              </div>
              <h1 className="text-3xl text-[#fef3c7]">FANN</h1>
            </div>
            <p className="text-[#fef3c7]/60 text-sm">{content.subtitle}</p>
          </div>

          {/* Features Section */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl text-[#fef3c7] mb-3">{content.leftPanel.title}</h2>
              <p className="text-[#fef3c7]/70 mb-8 leading-relaxed">
                {content.leftPanel.desc}
              </p>

              <div className="space-y-6 mb-10">
                {content.leftPanel.features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="flex gap-4"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#fef3c7]/5 border border-[#d4af37]/20 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-[#d4af37]" />
                      </div>
                      <div>
                        <h3 className="text-[#fef3c7] mb-1">{feature.title}</h3>
                        <p className="text-[#fef3c7]/60 text-sm">{feature.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {statsData.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="glass border border-[#d4af37]/20 rounded-lg p-3 text-center hover:border-[#d4af37]/50 transition-all"
                  >
                    <div className={`text-xl mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-[#fef3c7]/50 text-xs">{stat.label}</div>
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
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl text-[#fef3c7] mb-2">{content.title}</h2>
                <p className="text-[#fef3c7]/60">{content.subtitle}</p>
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
                    <Label htmlFor="email" className="text-[#fef3c7]/80">{content.email}</Label>
                    <div className="relative">
                      <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#fef3c7]/40 ${isRTL ? 'right-3' : 'left-3'}`} />
                      <Input
                        id="email"
                        type="email"
                        placeholder={content.emailPlaceholder}
                        className={`bg-[#fef3c7]/5 border-[#d4af37]/20 text-[#fef3c7] placeholder:text-[#fef3c7]/30 h-11 focus:border-[#d4af37]/50 focus:ring-[#d4af37]/20 ${isRTL ? 'pr-10' : 'pl-10'}`}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#fef3c7]/80">{content.password}</Label>
                    <div className="relative">
                      <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-[#fef3c7]/40 ${isRTL ? 'right-3' : 'left-3'}`} />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={content.passwordPlaceholder}
                        className={`bg-[#fef3c7]/5 border-[#d4af37]/20 text-[#fef3c7] placeholder:text-[#fef3c7]/30 h-11 focus:border-[#d4af37]/50 focus:ring-[#d4af37]/20 ${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute top-1/2 -translate-y-1/2 text-[#fef3c7]/40 hover:text-[#fef3c7]/60 transition-colors ${isRTL ? 'left-3' : 'right-3'}`}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                    <button
                      type="button"
                      className="text-sm text-[#d4af37] hover:text-[#fbbf24] transition-colors"
                    >
                      {content.forgotPassword}
                    </button>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-[#d4af37] via-[#fbbf24] to-[#d4af37] hover:from-[#fbbf24] hover:via-[#d4af37] hover:to-[#fbbf24] text-[#0f172a] shadow-lg shadow-[#d4af37]/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed glow-gold btn-glow"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isLoading ? content.signingIn : content.signInButton}
                        {!isLoading && <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />}
                      </span>
                    </Button>
                  </div>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                  <div className="flex-1 h-px bg-[#d4af37]/20" />
                  <span className="text-[#fef3c7]/40 text-sm">{content.orContinue}</span>
                  <div className="flex-1 h-px bg-[#d4af37]/20" />
                </div>

                {/* SSO / Social Login */}
                <Button
                  variant="outline"
                  className="w-full h-11 border-[#14b8a6]/30 hover:border-[#14b8a6]/60 hover:bg-[#14b8a6]/10 text-[#fef3c7]/70 hover:text-[#fef3c7] transition-all group"
                >
                  <Sparkles className={`w-5 h-5 text-[#14b8a6] ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {content.sso}
                </Button>

                {/* Sign Up Link */}
                <div className="mt-6 text-center">
                  <span className="text-[#fef3c7]/60 text-sm">{content.noAccount}</span>
                  {' '}
                  <button
                    type="button"
                    onClick={onNavigateToSignUp}
                    className="text-[#d4af37] hover:text-[#fbbf24] transition-colors text-sm"
                  >
                    {content.signUp}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
