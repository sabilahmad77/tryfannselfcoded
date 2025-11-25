import { useLoginMutation } from "@/services/api/authApi";
import {
  setAccessToken,
  setTokens,
  setPersona,
  type UserProfileData,
} from "@/store/authSlice";
import {
  ArrowRight,
  ChevronLeft,
  Globe,
  Lock,
  Mail,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "@/routes/paths";
import { Button } from "./ui/button";
import { InputField, PasswordField } from "./ui/custom-form-elements";

interface SignInProps {
  language: "en" | "ar";
  onNavigateToSignUp: () => void;
  onNavigateToHome: () => void;
}

interface SignInFormData {
  email: string;
  password: string;
}

interface LoginResponseData {
  access?: string;
  refresh?: string;
  profile_completed?: boolean;
  role?: string;
  [key: string]: unknown;
}

interface LoginResponse {
  success?: boolean;
  status_code?: number;
  message?: string | Record<string, unknown>;
  data?: LoginResponseData;
  access?: string;
  refresh?: string;
  token?: string;
  user?: unknown;
}

export function SignIn({
  language,
  onNavigateToSignUp,
  onNavigateToHome,
}: SignInProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [login, { isLoading }] = useLoginMutation();

  const t = {
    en: {
      title: "Welcome Back",
      subtitle: "Sign in to continue your FANN journey",
      email: "Email Address",
      emailPlaceholder: "your.email@example.com",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      forgotPassword: "Forgot password?",
      signInButton: "Sign In",
      signingIn: "Signing in...",
      noAccount: "Don't have an account?",
      signUp: "Sign Up",
      orContinue: "Or continue with",
      sso: "Single Sign-On",
      backToHome: "Back to Home",
      leftPanel: {
        title: "Continue Your Art Journey",
        desc: "Access your personalized dashboard and connect with the MENA/GCC art ecosystem.",
        features: [
          {
            icon: Shield,
            title: "Secure Access",
            desc: "Your account is protected with enterprise-grade security",
          },
          {
            icon: TrendingUp,
            title: "Track Progress",
            desc: "Monitor your points, tier status, and achievements",
          },
          {
            icon: Globe,
            title: "Global Network",
            desc: "Engage with verified artists, galleries, and collectors",
          },
          {
            icon: Zap,
            title: "Instant Rewards",
            desc: "Earn points for every interaction and milestone",
          },
        ],
      },
      stats: {
        artists: "Artists",
        collectors: "Collectors",
        galleries: "Galleries",
      },
    },
    ar: {
      title: "مرحباً بعودتك",
      subtitle: "سجّل الدخول لمواصلة رحلتك في FANN",
      email: "البريد الإلكتروني",
      emailPlaceholder: "your.email@example.com",
      password: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      signInButton: "تسجيل الدخول",
      signingIn: "جارٍ تسجيل الدخول...",
      noAccount: "ليس لديك حساب؟",
      signUp: "إنشاء حساب",
      orContinue: "أو المتابعة باستخدام",
      sso: "تسجيل دخول موحد",
      backToHome: "العودة للرئيسية",
      leftPanel: {
        title: "تابع رحلتك الفنية",
        desc: "الوصول إلى لوحة التحكم الشخصية والتواصل مع نظام الفن في منطقة الشرق الأوسط وشمال أفريقيا ودول مجلس التعاون الخليجي.",
        features: [
          {
            icon: Shield,
            title: "دخول آمن",
            desc: "حسابك محمي بأمان على مستوى المؤسسات",
          },
          {
            icon: TrendingUp,
            title: "تتبع التقدم",
            desc: "راقب نقاطك ومستوى طبقتك وإنجازاتك",
          },
          {
            icon: Globe,
            title: "شبكة عالمية",
            desc: "تفاعل مع فنانين ومعارض وجامعين معتمدين",
          },
          {
            icon: Zap,
            title: "مكافآت فورية",
            desc: "اكسب نقاطاً عن كل تفاعل وإنجاز",
          },
        ],
      },
      stats: {
        artists: "فنانون",
        collectors: "جامعون",
        galleries: "معارض",
      },
    },
  };

  const content = t[language];
  const isRTL = language === "ar";

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await login({
        email: data.email.trim(),
        password: data.password.trim(),
      }).unwrap();

      // Extract tokens from the nested data structure
      // API response: { success: true, data: { access: "...", refresh: "...", profile_completed: ... } }
      const loginResult = result as LoginResponse;
      const responseData = loginResult.data || loginResult;

      const accessToken =
        (responseData as LoginResponseData).access ||
        loginResult.access ||
        loginResult.token;

      const refreshToken =
        (responseData as LoginResponseData).refresh || loginResult.refresh;

      // Get profile completion status and role (persona)
      const profileCompleted =
        (responseData as LoginResponseData)?.profile_completed ?? false;
      const role = (responseData as LoginResponseData)?.role;
      // Convert role to lowercase persona (e.g., "Artist" -> "artist")
      const persona = role ? role.toLowerCase() : undefined;

      // Extract user profile data from response
      // The API returns user data in the data field when profile_completed is true
      const userData =
        profileCompleted && loginResult.data
          ? (loginResult.data as unknown as UserProfileData)
          : undefined;

      if (accessToken) {
        // Store tokens in Redux (persisted via redux-persist)
        if (refreshToken) {
          dispatch(
            setTokens({
              accessToken,
              refreshToken,
              profileCompleted,
              persona,
              user: userData,
            })
          );
        } else {
          dispatch(
            setAccessToken({
              token: accessToken,
              profileCompleted,
              user: userData,
            })
          );
          // If persona exists, set it separately when only access token is available
          if (persona) {
            dispatch(setPersona(persona));
          }
        }
      } else {
        console.warn("No token received from API response:", result);
        // Still proceed if user data is present (some APIs return user without explicit token)
        const hasUserData = loginResult.data || loginResult.user;
        if (!hasUserData) {
          throw new Error("Invalid response from server");
        }
      }

      // Show success message
      const successMessage =
        (typeof loginResult.message === "string"
          ? loginResult.message
          : null) ||
        (language === "en"
          ? "Successfully signed in!"
          : "تم تسجيل الدخول بنجاح!");

      toast.success(successMessage);

      // Navigation will be handled by PublicRoute based on profile_completed status
      // If profile is completed, navigate to dashboard, otherwise onboarding
      if (profileCompleted) {
        // Navigate to dashboard if profile is completed
        navigate(ROUTES.DASHBOARD);
      } else {
        // Navigate to onboarding if profile is not completed
        const onboardingPath = persona
          ? `${ROUTES.ONBOARDING}?persona=${encodeURIComponent(persona)}`
          : ROUTES.DASHBOARD;
        navigate(onboardingPath, { replace: true });
      }
    } catch {
      // Error toast is already shown by baseApi interceptor
      // No need to show duplicate toast here
    }
  };

  const statsData = [
    {
      value: "500+",
      label: content.stats.artists,
      color: "from-[#d4af37] to-[#fbbf24]",
    },
    {
      value: "1.2K+",
      label: content.stats.collectors,
      color: "from-[#14b8a6] to-[#0ea5e9]",
    },
    {
      value: "150+",
      label: content.stats.galleries,
      color: "from-[#0ea5e9] to-[#14b8a6]",
    },
  ];

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
              className="flex items-center gap-2 text-cream/70 hover:text-[#d4af37] transition-colors group mb-8 cursor-pointer"
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

          {/* Features Section */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl text-[#fef3c7] mb-3">
                {content.leftPanel.title}
              </h2>
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
                        <p className="text-[#fef3c7]/60 text-sm">
                          {feature.desc}
                        </p>
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
                    <div
                      className={`text-xl mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[#fef3c7]/50 text-xs">
                      {stat.label}
                    </div>
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
                <h2 className="text-3xl text-[#fef3c7] mb-2">
                  {content.title}
                </h2>
                <p className="text-[#fef3c7]/60">{content.subtitle}</p>
              </div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-5">
                  {/* Email */}
                  <InputField
                    {...register("email", {
                      required:
                        language === "en"
                          ? "Email is required"
                          : "البريد الإلكتروني مطلوب",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message:
                          language === "en"
                            ? "Invalid email address"
                            : "عنوان بريد إلكتروني غير صالح",
                      },
                    })}
                    label={content.email}
                    type="email"
                    placeholder={content.emailPlaceholder}
                    icon={Mail}
                    isRTL={isRTL}
                    required
                    error={errors.email?.message}
                  />

                  {/* Password */}
                  <PasswordField
                    {...register("password", {
                      required:
                        language === "en"
                          ? "Password is required"
                          : "كلمة المرور مطلوبة",
                      minLength: {
                        value: 6,
                        message:
                          language === "en"
                            ? "Password must be at least 6 characters"
                            : "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
                      },
                    })}
                    label={content.password}
                    placeholder={content.passwordPlaceholder}
                    icon={Lock}
                    isRTL={isRTL}
                    showToggle
                    required
                    error={errors.password?.message}
                  />

                  {/* Forgot Password */}
                  <div
                    className={`flex ${
                      isRTL ? "justify-start" : "justify-end"
                    }`}
                  >
                    <button
                      type="button"
                      className="text-sm text-[#d4af37] hover:text-[#fbbf24] transition-colors cursor-pointer"
                    >
                      {content.forgotPassword}
                    </button>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="button"
                      onClick={handleFormSubmit(onSubmit)}
                      disabled={isLoading}
                      className={`w-full h-12 bg-gradient-to-r from-[#d4af37] via-[#fbbf24] to-[#d4af37] hover:from-[#fbbf24] hover:via-[#d4af37] hover:to-[#fbbf24] text-[#0f172a] shadow-lg shadow-[#d4af37]/30 transition-all group glow-gold btn-glow ${
                        isLoading
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
                            <Oval
                              height={20}
                              width={20}
                              color="#0f172a"
                              ariaLabel="loading"
                              visible={true}
                            />
                            {content.signingIn}
                          </>
                        ) : (
                          <>
                            {content.signInButton}
                            <ArrowRight
                              className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${
                                isRTL ? "rotate-180" : ""
                              }`}
                            />
                          </>
                        )}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                  <div className="flex-1 h-px bg-[#d4af37]/20" />
                  <span className="text-[#fef3c7]/40 text-sm">
                    {content.orContinue}
                  </span>
                  <div className="flex-1 h-px bg-[#d4af37]/20" />
                </div>

                {/* SSO / Social Login */}
                <Button
                  variant="outline"
                  className="w-full h-11 border-[#14b8a6]/30 hover:border-[#14b8a6]/60 hover:bg-[#14b8a6]/10 text-[#fef3c7]/70 hover:text-[#fef3c7] transition-all group cursor-pointer"
                >
                  <Sparkles
                    className={`w-5 h-5 text-[#14b8a6] ${
                      isRTL ? "ml-2" : "mr-2"
                    }`}
                  />
                  {content.sso}
                </Button>

                {/* Sign Up Link */}
                <div className="mt-6 text-center">
                  <span className="text-[#fef3c7]/60 text-sm">
                    {content.noAccount}
                  </span>{" "}
                  <button
                    type="button"
                    onClick={onNavigateToSignUp}
                    className="text-[#d4af37] hover:text-[#fbbf24] transition-colors text-sm cursor-pointer"
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
