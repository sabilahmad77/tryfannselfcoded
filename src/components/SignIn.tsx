import { ROUTES } from "@/routes/paths";
import { useLoginMutation } from "@/services/api/authApi";
import {
  setAccessToken,
  setPersona,
  setTokens,
  type UserProfileData,
} from "@/store/authSlice";
import { persistor } from "@/store/store";
import { clearAllAuthState, REMEMBERED_EMAIL_KEY, REMEMBERED_PASSWORD_KEY } from "@/utils/auth";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { InputField, PasswordField } from "./ui/custom-form-elements";
import { Label } from "./ui/label";
import { AmbassadorVerificationModal } from "./auth/AmbassadorVerificationModal";
import { EmailVerificationModal } from "./auth/EmailVerificationModal";

interface SignInProps {
  language: "en" | "ar";
  onNavigateToSignUp: () => void;
  onNavigateToHome: () => void;
}

interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
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
    setValue,
    watch,
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");
  const [login, { isLoading }] = useLoginMutation();
  const [showAmbassadorVerificationModal, setShowAmbassadorVerificationModal] =
    useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] =
    useState(false);

  // Load remembered credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
    const savedPassword = localStorage.getItem(REMEMBERED_PASSWORD_KEY);

    if (savedEmail && savedPassword) {
      setValue("email", savedEmail);
      setValue("password", savedPassword);
      setValue("rememberMe", true);
    }
  }, [setValue]);

  const t = {
    en: {
      title: "Welcome Back",
      subtitle: "Sign in to continue your FANN journey",
      email: "Email Address",
      emailPlaceholder: "your.email@example.com",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      forgotPassword: "Forgot password?",
      rememberMe: "Remember me",
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
      rememberMe: "تذكرني",
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

  // Show ambassador verification modal if needed
  if (showAmbassadorVerificationModal) {
    return <AmbassadorVerificationModal />;
  }

  // Show email verification modal if needed
  if (showEmailVerificationModal) {
    return <EmailVerificationModal />;
  }

  const onSubmit = async (data: SignInFormData) => {
    try {
      // Handle remember me functionality
      if (data.rememberMe) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, data.email.trim());
        localStorage.setItem(REMEMBERED_PASSWORD_KEY, data.password.trim());
      } else {
        // Clear saved credentials if remember me is unchecked
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        localStorage.removeItem(REMEMBERED_PASSWORD_KEY);
      }

      const result = await login({
        email: data.email.trim(),
        password: data.password.trim(),
      }).unwrap();

      // Extract tokens from the nested data structure
      // API response: { success: true, status_code: 200, message: {}, data: { access: "...", refresh: "...", role: "...", is_verify: ..., ... } }
      const loginResult = result as LoginResponse;
      const responseData = loginResult.data || loginResult;

      const accessToken =
        (responseData as LoginResponseData).access ||
        loginResult.access ||
        loginResult.token;

      const refreshToken =
        (responseData as LoginResponseData).refresh || loginResult.refresh;

      // Extract user profile data from response
      // The API always returns full user data in the data field
      const userData = loginResult.data
        ? (loginResult.data as unknown as UserProfileData)
        : undefined;

      // Get profile completion status and role (persona) from userData
      const profileCompleted = userData?.profile_completed ?? false;
      const role = userData?.role || (responseData as LoginResponseData)?.role;
      // Convert role to lowercase persona (e.g., "Artist" -> "artist")
      const persona = role ? role.toLowerCase() : undefined;

      if (accessToken) {
        // Clear all auth state before setting new tokens
        await clearAllAuthState(dispatch, persistor, {
          clearExpiredPage: true,    // Clear expired page on relogin
        });

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

      // Extract role and is_verify from user data for verification check
      const userRole = userData?.role;
      const isVerify = userData?.is_verify;

      // Check if user is an ambassador with pending verification
      const isAmbassador =
        userRole === "Ambassador" || userRole?.toLowerCase?.() === "ambassador";
      const isPendingVerification = isAmbassador && isVerify === false;

      // Check if user needs email verification (artist, gallery, collector)
      const needsEmailVerification =
        isVerify === false &&
        (userRole === "Artist" ||
          userRole === "Gallery" ||
          userRole === "Collector" ||
          userRole?.toLowerCase?.() === "artist" ||
          userRole?.toLowerCase?.() === "gallery" ||
          userRole?.toLowerCase?.() === "collector");

      // Show success message
      const successMessage =
        (typeof loginResult.message === "string"
          ? loginResult.message
          : null) ||
        (language === "en"
          ? "Successfully signed in!"
          : "تم تسجيل الدخول بنجاح!");

      toast.success(successMessage);

      // Check for verification status
      if (isPendingVerification) {
        // Show ambassador verification modal instead of navigating
        setShowAmbassadorVerificationModal(true);
      } else if (needsEmailVerification) {
        // Show email verification modal instead of navigating
        setShowEmailVerificationModal(true);
      } else {
        // Redirect to dashboard regardless of profile completion status
        navigate(ROUTES.DASHBOARD, { replace: true });
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
      color: "from-[#ffcc33] to-[#ffb54d]",
    },
    {
      value: "1.2K+",
      label: content.stats.collectors,
      color: "from-[#45e3d3] to-[#4de3ed]",
    },
    {
      value: "150+",
      label: content.stats.galleries,
      color: "from-[#4de3ed] to-[#45e3d3]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F021C] flex" dir={isRTL ? "rtl" : "ltr"}>
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
              className="flex items-center gap-2 text-cream/70 hover:text-[#ffcc33] transition-colors group mb-8 cursor-pointer"
            >
              <ChevronLeft
                className={`w-5 h-5 group-hover:-translate-x-1 transition-transform ${isRTL ? "rotate-180" : ""
                  }`}
              />
              <span className="text-sm">{content.backToHome}</span>
            </motion.button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffcc33] to-[#ffb54d] flex items-center justify-center glow-gold">
                <Sparkles className="w-6 h-6 text-[#0F021C]" />
              </div>
              <h1 className="text-3xl text-[#ffffff]">FANN</h1>
            </div>
            <p className="text-[#ffffff]/60 text-sm">{content.subtitle}</p>
          </div>

          {/* Features Section */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl text-[#ffffff] mb-3">
                {content.leftPanel.title}
              </h2>
              <p className="text-[#ffffff]/70 mb-8 leading-relaxed">
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
                      <div className="w-12 h-12 rounded-lg bg-[#ffffff]/5 border border-[#ffcc33]/20 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-[#ffcc33]" />
                      </div>
                      <div>
                        <h3 className="text-[#ffffff] mb-1">{feature.title}</h3>
                        <p className="text-[#ffffff]/60 text-sm">
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
                    className="glass border border-[#ffcc33]/20 rounded-lg p-3 text-center hover:border-[#ffcc33]/50 transition-all"
                  >
                    <div
                      className={`text-xl mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[#ffffff]/50 text-xs">
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
                <h2 className="text-3xl text-[#ffffff] mb-2">
                  {content.title}
                </h2>
                <p className="text-[#ffffff]/60">{content.subtitle}</p>
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

                  {/* Remember Me and Forgot Password */}
                  <div
                    className={`flex items-center ${isRTL ? "flex-row-reverse justify-between" : "justify-between"
                      }`}
                  >
                    {/* Remember Me Checkbox */}
                    <div className={`flex items-center ${isRTL ? "gap-2 flex-row-reverse" : "gap-2"}`}>
                      <Checkbox
                        id="rememberMe"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                          setValue("rememberMe", checked === true)
                        }
                        className="border-[#ffcc33]/30 data-[state=checked]:bg-[#ffcc33] data-[state=checked]:border-[#ffcc33]"
                      />
                      <Label
                        htmlFor="rememberMe"
                        className="text-sm text-[#ffffff]/70 cursor-pointer hover:text-[#ffffff] transition-colors"
                      >
                        {content.rememberMe}
                      </Label>
                    </div>

                    {/* Forgot Password */}
                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                      className="text-sm text-[#ffcc33] hover:text-[#ffb54d] transition-colors cursor-pointer"
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
                      className={`w-full h-12 shadow-lg shadow-primary/30 transition-all group glow-gold btn-glow ${isLoading
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
                              color="#0F021C"
                              ariaLabel="loading"
                              visible={true}
                            />
                            {content.signingIn}
                          </>
                        ) : (
                          <>
                            {content.signInButton}
                            <ArrowRight
                              className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? "rotate-180" : ""
                                }`}
                            />
                          </>
                        )}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="mt-6 text-center">
                  <span className="text-[#ffffff]/60 text-sm">
                    {content.noAccount}
                  </span>{" "}
                  <button
                    type="button"
                    onClick={onNavigateToSignUp}
                    className="text-[#ffcc33] hover:text-[#ffb54d] transition-colors text-sm cursor-pointer"
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
