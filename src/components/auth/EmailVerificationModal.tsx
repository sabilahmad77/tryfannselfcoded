import { useLanguage } from "@/contexts/useLanguage";
import { ROUTES } from "@/routes/paths";
import { baseApi } from "@/services/api/baseApi";
import { clearAuth } from "@/store/authSlice";
import type { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export function EmailVerificationModal() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isRTL = language === "ar";

  const content = {
    en: {
      title: "Email Verification Required",
      subtitle: "Please verify your email address to continue",
      body: "We've sent a verification email to your inbox. Please check your email and click the verification link to activate your account. Once verified, please sign in again to access your dashboard.",
      note: "If you didn't receive the email, please check your spam folder or contact our support team.",
      signOut: "Sign out",
      backToHome: "Back to Home",
      pendingLabel: "Status: Email verification pending",
    },
    ar: {
      title: "التحقق من البريد الإلكتروني مطلوب",
      subtitle: "يرجى التحقق من عنوان بريدك الإلكتروني للمتابعة",
      body: "لقد أرسلنا بريداً إلكترونياً للتحقق إلى صندوق الوارد الخاص بك. يرجى التحقق من بريدك الإلكتروني والنقر على رابط التحقق لتفعيل حسابك. بعد التحقق، يرجى تسجيل الدخول مرة أخرى للوصول إلى لوحة التحكم.",
      note: "إذا لم تستلم البريد الإلكتروني، يرجى التحقق من مجلد الرسائل غير المرغوب فيها أو التواصل مع فريق الدعم.",
      signOut: "تسجيل الخروج",
      backToHome: "العودة إلى الرئيسية",
      pendingLabel: "الحالة: في انتظار التحقق من البريد الإلكتروني",
    },
  } as const;

  const t = content[language];

  const handleSignOut = () => {
    // Clear RTK Query cache to remove all cached API data
    dispatch(baseApi.util.resetApiState());
    dispatch(clearAuth());
    navigate(ROUTES.SIGN_IN, { replace: true });
  };

  const handleBackHome = () => {
    // Clear RTK Query cache to remove all cached API data
    dispatch(baseApi.util.resetApiState());
    dispatch(clearAuth());
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg mx-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="glass border border-cyan-500/40 rounded-3xl p-8 md:p-10 shadow-2xl bg-[#0B0B0D]/95">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.4)] mb-2">
              <Mail className="w-8 h-8 text-cyan-400" />
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              {t.title}
            </h2>
            <p className="text-white/80 text-sm md:text-base">
              {t.subtitle}
            </p>

            <p className="text-[#B9BBC6] text-sm leading-relaxed mt-2 max-w-xl">
              {t.body}
            </p>

            <div className="mt-4 w-full max-w-md px-4 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-medium">{t.pendingLabel}</span>
              </div>
              {user?.email && (
                <p className="mt-1 text-cyan-200/80 text-[0.7rem] md:text-xs break-all opacity-90">
                  {user.email}
                </p>
              )}
            </div>

            <p className="text-white/50 text-xs md:text-xs leading-relaxed mt-3">
              {t.note}
            </p>
          </div>

          <div
            className={`mt-8 flex flex-col gap-3 ${
              isRTL ? "items-stretch" : "items-stretch"
            }`}
          >
            <Button
              type="button"
              onClick={handleSignOut}
              className="h-11 md:h-12 w-full flex items-center justify-center gap-2 bg-cyan-500 text-[#0B0B0D] hover:bg-cyan-400 font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.signOut}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleBackHome}
              className="h-11 md:h-12 w-full flex items-center justify-center gap-2 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>{t.backToHome}</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

