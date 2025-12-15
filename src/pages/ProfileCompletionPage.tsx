import { ProfileCompletion } from "@/components/onboarding/ProfileCompletion";
import { useLanguage } from "@/contexts/useLanguage";
import { ROUTES } from "@/routes/paths";
import { setProfileCompleted } from "@/store/authSlice";
import type { RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function ProfileCompletionPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persona = useSelector((state: RootState) => state.auth.persona);

  // Redirect if no persona
  useEffect(() => {
    if (!persona) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [persona, navigate]);

  if (!persona) {
    return null;
  }

  return (
    <ProfileCompletion
      language={language}
      selectedPersona={persona}
      onComplete={() => {
        // Update profile completion status
        dispatch(setProfileCompleted(true));
        navigate(ROUTES.DASHBOARD, { replace: true });
      }}
      onCancel={() => navigate(ROUTES.DASHBOARD, { replace: true })}
    />
  );
}

