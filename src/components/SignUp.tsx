import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Palette,
  Building2,
  Gem,
  Users,
  TrendingUp,
  Check,
  Gift,
  MapPin,
  Shield,
  Zap,
  Globe,
  Award,
} from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import {
  InputField,
  PasswordField,
  SelectField,
} from "./ui/custom-form-elements";

interface SignUpProps {
  language: "en" | "ar";
  onNavigateToSignIn: () => void;
  onNavigateToHome: () => void;
  onSignUpComplete: (persona: string) => void;
}

export function SignUp({
  language,
  onNavigateToSignIn,
  onNavigateToHome,
  onSignUpComplete,
}: SignUpProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(
    "artist"
  );
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const t = {
    en: {
      title: "Join FANN",
      subtitle: "Create your account",
      step1Title: "Select Your Role",
      step1Subtitle:
        "Choose the path that best describes you in the art ecosystem",
      step2Title: "Account Information",
      step2Subtitle: "Enter your details to create your account",
      fullName: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      email: "Email Address",
      emailPlaceholder: "your.email@example.com",
      password: "Password",
      passwordPlaceholder: "Create a strong password",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Re-enter your password",
      region: "Region",
      regionPlaceholder: "Select your region",
      referral: "Referral Code",
      referralOptional: "(Optional)",
      referralPlaceholder: "Enter code",
      terms: "I agree to the Terms & Conditions and Privacy Policy",
      kyc: "KYC verification will be required for full platform access",
      signUpButton: "Create Account",
      signingUp: "Creating account...",
      haveAccount: "Already have an account?",
      signIn: "Sign In",
      back: "Back",
      backToHome: "Back to Home",
      continue: "Continue",
      step: "Step",
      of: "of",
      personas: {
        artist: {
          name: "Artist",
          desc: "Showcase and monetize your artwork",
          points: "+500 pts",
        },
        gallery: {
          name: "Gallery / Museum",
          desc: "Curate and manage collections",
          points: "+750 pts",
        },
        collector: {
          name: "Collector",
          desc: "Discover and acquire authenticated art",
          points: "+500 pts",
        },
        curator: {
          name: "Curator / Critic",
          desc: "Build exhibitions and narratives",
          points: "+600 pts",
        },
        investor: {
          name: "Investor / Patron",
          desc: "Support and invest in emerging art",
          points: "+1000 pts",
        },
      },
      leftPanel: {
        welcomeTitle: "Welcome to the Future of Art",
        welcomeDesc:
          "Join a verified community where authenticated fine art meets digital innovation.",
        features: [
          {
            icon: Shield,
            title: "Verified & Secure",
            desc: "KYC-verified community with certified authentication",
          },
          {
            icon: Zap,
            title: "Earn Rewards",
            desc: "Points, tiers, and exclusive benefits as you engage",
          },
          {
            icon: Globe,
            title: "Global Network",
            desc: "Connect with artists, galleries, and collectors worldwide",
          },
          {
            icon: Award,
            title: "Early Access",
            desc: "Be among the first to experience the platform",
          },
        ],
        selectedPersona: "Your Path",
        benefits: "Your Welcome Package",
        benefitsList: [
          "Explorer Tier status",
          "Welcome bonus points",
          "Early platform access",
          "Exclusive rewards unlock",
        ],
      },
      regions: [
        "UAE",
        "Saudi Arabia",
        "Qatar",
        "Kuwait",
        "Bahrain",
        "Oman",
        "Egypt",
        "Lebanon",
        "Jordan",
        "Other",
      ],
    },
    ar: {
      title: "انضم إلى FANN",
      subtitle: "أنشئ حسابك",
      step1Title: "اختر دورك",
      step1Subtitle: "اختر المسار الذي يصفك بشكل أفضل في النظام الفني",
      step2Title: "معلومات الحساب",
      step2Subtitle: "أدخل بياناتك لإنشاء حسابك",
      fullName: "الاسم الكامل",
      fullNamePlaceholder: "أدخل اسمك الكامل",
      email: "البريد الإلكتروني",
      emailPlaceholder: "your.email@example.com",
      password: "كلمة المرور",
      passwordPlaceholder: "أنشئ كلمة مرور قوية",
      confirmPassword: "تأكيد كلمة المرور",
      confirmPasswordPlaceholder: "أعد إدخال كلمة المرور",
      region: "المنطقة",
      regionPlaceholder: "اختر منطقتك",
      referral: "كود الإحالة",
      referralOptional: "(اختياري)",
      referralPlaceholder: "أدخل الكود",
      terms: "أوافق على الشروط والأحكام وسياسة الخصوصية",
      kyc: "سيكو�� التحقق من الهوية (KYC) مطلوباً للوصول الكامل للمنصة",
      signUpButton: "إنشاء حساب",
      signingUp: "جارٍ إنشاء الحساب...",
      haveAccount: "لديك حساب بالفعل؟",
      signIn: "تسجيل الدخول",
      back: "رجوع",
      backToHome: "العودة للرئيسية",
      continue: "متابعة",
      step: "الخطوة",
      of: "من",
      personas: {
        artist: {
          name: "فنان",
          desc: "اعرض واستثمر أعمالك الفنية",
          points: "+500 نقطة",
        },
        gallery: {
          name: "معرض / متحف",
          desc: "قم بتنظيم وإدارة المجموعات",
          points: "+750 نقطة",
        },
        collector: {
          name: "جامع",
          desc: "اكتشف واقتنِ الفن الموثق",
          points: "+500 نقطة",
        },
        curator: {
          name: "منسق / ناقد",
          desc: "ابنِ المعارض والروايات",
          points: "+600 نقطة",
        },
        investor: {
          name: "مستثمر / راعي",
          desc: "ادعم واستثمر في الفن الناشئ",
          points: "+1000 نقطة",
        },
      },
      leftPanel: {
        welcomeTitle: "مرحباً بك في مستقبل الفن",
        welcomeDesc:
          "انضم إل�� مج��مع موثق حيث يلتقي الفن الراقي الموثق بتكنولوجيا البلوكتشين.",
        features: [
          {
            icon: Shield,
            title: "موثق وآمن",
            desc: "مجتمع موثق بـ KYC مع مصادقة البلوكتشين",
          },
          {
            icon: Zap,
            title: "اكسب المكافآت",
            desc: "نقاط ومستويات ومزايا حصرية مع تفاعلك",
          },
          {
            icon: Globe,
            title: "شبكة عالمية",
            desc: "تواصل مع الفنانين والمعارض والجامعين عالمياً",
          },
          {
            icon: Award,
            title: "وصول مبكر",
            desc: "كن من أوائل من يختبر المنصة",
          },
        ],
        selectedPersona: "مسارك",
        benefits: "حزمة الترحيب الخاصة بك",
        benefitsList: [
          "حالة مستوى المستكشف",
          "نقاط مكافأة الترحيب",
          "الوصول المبكر للمنصة",
          "فتح المكافآت الحصرية",
        ],
      },
      regions: [
        "الإمارات",
        "السعودية",
        "قطر",
        "الكويت",
        "البحرين",
        "عُمان",
        "مصر",
        "لبنان",
        "الأردن",
        "أخرى",
      ],
    },
  };

  const content = t[language];
  const isRTL = language === "ar";

  // Convert regions to SelectFieldOption format
  const regionOptions = content.regions.map((region) => ({
    value: region,
    label: region,
  }));

  const personas = [
    {
      id: "artist",
      icon: Palette,
      gradient: "from-amber-500 to-orange-500",
      ...content.personas.artist,
    },
    {
      id: "gallery",
      icon: Building2,
      gradient: "from-yellow-500 to-amber-500",
      ...content.personas.gallery,
    },
    {
      id: "collector",
      icon: Gem,
      gradient: "from-orange-500 to-amber-600",
      ...content.personas.collector,
    },
    {
      id: "curator",
      icon: Users,
      gradient: "from-amber-400 to-yellow-500",
      ...content.personas.curator,
    },
    {
      id: "investor",
      icon: TrendingUp,
      gradient: "from-yellow-600 to-orange-600",
      ...content.personas.investor,
    },
  ];

  const handleContinueToStep2 = () => {
    if (selectedPersona) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms || !selectedPersona) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);

    onSignUpComplete(selectedPersona);
  };

  const selectedPersonaData = personas.find((p) => p.id === selectedPersona);

  return (
    <div className="min-h-screen bg-[#0f172a] flex" dir={isRTL ? "rtl" : "ltr"}>
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
              className="flex items-center gap-2 text-[#fef3c7]/70 hover:text-[#d4af37] transition-colors group mb-8"
            >
              <ChevronLeft
                className={`w-5 h-5 group-hover:-translate-x-1 transition-transform ${
                  isRTL ? "rotate-180" : ""
                }`}
              />
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

          {/* Dynamic Content Based on Step */}
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1-info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl text-[#fef3c7] mb-3">
                    {content.leftPanel.welcomeTitle}
                  </h2>
                  <p className="text-[#fef3c7]/70 mb-8 leading-relaxed">
                    {content.leftPanel.welcomeDesc}
                  </p>

                  <div className="space-y-6">
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
                            <h3 className="text-[#fef3c7] mb-1">
                              {feature.title}
                            </h3>
                            <p className="text-[#fef3c7]/60 text-sm">
                              {feature.desc}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2-info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Selected Persona Display */}
                  {selectedPersonaData && (
                    <div className="mb-8">
                      <p className="text-[#fef3c7]/60 text-sm mb-3">
                        {content.leftPanel.selectedPersona}
                      </p>
                      <div className="p-6 rounded-2xl glass border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/10 to-[#14b8a6]/10">
                        <div className="flex items-center gap-4 mb-4">
                          {(() => {
                            const Icon = selectedPersonaData.icon;
                            return (
                              <div
                                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedPersonaData.gradient} flex items-center justify-center shrink-0`}
                              >
                                <Icon className="w-7 h-7 text-[#0f172a]" />
                              </div>
                            );
                          })()}
                          <div>
                            <h3 className="text-xl text-[#fef3c7] mb-1">
                              {selectedPersonaData.name}
                            </h3>
                            <p className="text-[#fef3c7]/70 text-sm">
                              {selectedPersonaData.desc}
                            </p>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/30">
                          <Gift className="w-4 h-4 text-[#d4af37]" />
                          <span className="text-[#d4af37] text-sm">
                            {selectedPersonaData.points}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Benefits */}
                  <div>
                    <p className="text-[#fef3c7]/60 text-sm mb-3">
                      {content.leftPanel.benefits}
                    </p>
                    <div className="space-y-2">
                      {content.leftPanel.benefitsList.map((benefit, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx }}
                          className="flex items-center gap-3 text-[#fef3c7]/80"
                        >
                          <div className="w-5 h-5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/30 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-[#d4af37]" />
                          </div>
                          <span className="text-sm">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Stats/Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-8 border-t border-[#d4af37]/20"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl text-[#fef3c7] mb-1">20K+</div>
                <div className="text-[#fef3c7]/50 text-xs">Early Members</div>
              </div>
              <div>
                <div className="text-2xl text-[#fef3c7] mb-1">2K+</div>
                <div className="text-[#fef3c7]/50 text-xs">Artists</div>
              </div>
              <div>
                <div className="text-2xl text-[#fef3c7] mb-1">1K+</div>
                <div className="text-[#fef3c7]/50 text-xs">Galleries</div>
              </div>
            </div>
          </motion.div>
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
              {/* Step Indicator */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[#d4af37] text-sm">
                    {content.step} {step} {content.of} 2
                  </span>
                  <div className="flex-1 h-1 bg-[#fef3c7]/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#d4af37] to-[#14b8a6]"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(step / 2) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
                <h2 className="text-3xl text-[#fef3c7] mb-2">
                  {step === 1 ? content.step1Title : content.step2Title}
                </h2>
                <p className="text-[#fef3c7]/60">
                  {step === 1 ? content.step1Subtitle : content.step2Subtitle}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  /* STEP 1: Persona Selection */
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRTL ? 30 : -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-3 mb-8">
                      {personas.map((persona) => {
                        const Icon = persona.icon;
                        const isSelected = selectedPersona === persona.id;

                        return (
                          <motion.button
                            key={persona.id}
                            type="button"
                            onClick={() => setSelectedPersona(persona.id)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`w-full p-5 rounded-xl border transition-all text-left relative overflow-hidden group ${
                              isSelected
                                ? "bg-gradient-to-br from-[#d4af37]/20 to-[#14b8a6]/20 border-[#d4af37]/50 shadow-lg shadow-[#d4af37]/20"
                                : "glass border-[#d4af37]/20 hover:border-[#d4af37]/40"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                                  persona.gradient
                                } flex items-center justify-center shrink-0 ${
                                  isSelected ? "scale-110" : ""
                                } transition-transform`}
                              >
                                <Icon className="w-6 h-6 text-[#0f172a]" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-3 mb-1">
                                  <h3
                                    className={`${
                                      isSelected
                                        ? "text-[#fef3c7]"
                                        : "text-[#fef3c7]/90"
                                    }`}
                                  >
                                    {persona.name}
                                  </h3>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${persona.gradient} text-[#0f172a]`}
                                    >
                                      {persona.points}
                                    </span>
                                    {isSelected && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-6 h-6 rounded-full bg-[#d4af37] flex items-center justify-center glow-gold"
                                      >
                                        <Check className="w-4 h-4 text-[#0f172a]" />
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                                <p className="text-[#fef3c7]/60 text-sm">
                                  {persona.desc}
                                </p>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={() => setStep(1)}
                        disabled={true}
                        className="h-12 px-6 bg-[#fef3c7]/5 border border-[#d4af37]/20 text-[#fef3c7] hover:bg-[#fef3c7]/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <span className="flex items-center gap-2">
                          <ChevronLeft
                            className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
                          />
                          {content.back}
                        </span>
                      </Button>

                      <Button
                        onClick={handleContinueToStep2}
                        disabled={!selectedPersona}
                        className="flex-1 h-12 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black shadow-lg shadow-amber-500/30 transition-all group disabled:opacity-50"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {content.continue}
                          <ArrowRight
                            className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${
                              isRTL ? "rotate-180" : ""
                            }`}
                          />
                        </span>
                      </Button>
                    </div>

                    <div className="text-center pt-6">
                      <span className="text-white/60 text-sm">
                        {content.haveAccount}
                      </span>{" "}
                      <button
                        type="button"
                        onClick={onNavigateToSignIn}
                        className="text-amber-400 hover:text-amber-300 transition-colors text-sm"
                      >
                        {content.signIn}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* STEP 2: Registration Form */
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRTL ? 30 : -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Full Name */}
                      <InputField
                        label={content.fullName}
                        type="text"
                        placeholder={content.fullNamePlaceholder}
                        icon={User}
                        isRTL={isRTL}
                        required
                        inputClassName="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:ring-amber-500/20"
                        labelClassName="text-white/80 text-sm"
                      />

                      {/* Email */}
                      <InputField
                        label={content.email}
                        type="email"
                        placeholder={content.emailPlaceholder}
                        icon={Mail}
                        isRTL={isRTL}
                        required
                        inputClassName="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:ring-amber-500/20"
                        labelClassName="text-white/80 text-sm"
                      />

                      {/* Password Fields */}
                      <div className="grid sm:grid-cols-2 gap-5">
                        <PasswordField
                          label={content.password}
                          placeholder={content.passwordPlaceholder}
                          icon={Lock}
                          isRTL={isRTL}
                          showToggle
                          showPassword={showPassword}
                          onShowPasswordChange={setShowPassword}
                          required
                          inputClassName="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:ring-amber-500/20"
                          labelClassName="text-white/80 text-sm"
                        />

                        <PasswordField
                          label={content.confirmPassword}
                          placeholder={content.confirmPasswordPlaceholder}
                          icon={Lock}
                          isRTL={isRTL}
                          showToggle
                          showPassword={showConfirmPassword}
                          onShowPasswordChange={setShowConfirmPassword}
                          required
                          inputClassName="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:ring-amber-500/20"
                          labelClassName="text-white/80 text-sm"
                        />
                      </div>

                      {/* Region & Referral */}
                      <div className="grid sm:grid-cols-2 gap-5">
                        <SelectField
                          label={content.region}
                          placeholder={content.regionPlaceholder}
                          icon={MapPin}
                          options={regionOptions}
                          value={selectedRegion}
                          onValueChange={setSelectedRegion}
                          isRTL={isRTL}
                          required
                          inputClassName="bg-white/5 border-white/10 text-white focus:border-amber-500/50 focus:ring-amber-500/20"
                          labelClassName="text-white/80 text-sm"
                          contentClassName="bg-[#1a1a24] border-white/10"
                          itemClassName="text-white focus:bg-amber-500/10 focus:text-amber-400"
                        />

                        <InputField
                          label={
                            <>
                              {content.referral}{" "}
                              <span className="text-white/40">
                                {content.referralOptional}
                              </span>
                            </>
                          }
                          type="text"
                          placeholder={content.referralPlaceholder}
                          icon={Gift}
                          isRTL={isRTL}
                          value={referralCode}
                          onChange={(e) =>
                            setReferralCode(e.target.value.toUpperCase())
                          }
                          inputClassName="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:ring-amber-500/20"
                          labelClassName="text-white/80 text-sm"
                        />
                      </div>

                      {/* Referral Success Message */}
                      <AnimatePresence>
                        {referralCode && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2"
                          >
                            <Check className="w-4 h-4 text-green-400 shrink-0" />
                            <span className="text-sm text-green-400">
                              +250 bonus points applied!
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Terms */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="terms"
                            checked={acceptedTerms}
                            onCheckedChange={(checked: boolean) =>
                              setAcceptedTerms(checked)
                            }
                            className="mt-0.5 border-white/20 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                          />
                          <Label
                            htmlFor="terms"
                            className="text-white/70 text-sm cursor-pointer leading-relaxed"
                          >
                            {content.terms}
                          </Label>
                        </div>

                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-start gap-2">
                          <Shield className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                          <span className="text-blue-400 text-xs leading-relaxed">
                            {content.kyc}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          onClick={() => setStep(1)}
                          disabled={isLoading}
                          className="h-12 px-6 bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <span className="flex items-center gap-2">
                            <ChevronLeft
                              className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
                            />
                            {content.back}
                          </span>
                        </Button>

                        <Button
                          type="submit"
                          disabled={isLoading || !acceptedTerms}
                          className="flex-1 h-12 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black shadow-lg shadow-amber-500/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="flex items-center justify-center gap-2">
                            {isLoading
                              ? content.signingUp
                              : content.signUpButton}
                            {!isLoading && (
                              <ArrowRight
                                className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${
                                  isRTL ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </span>
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
