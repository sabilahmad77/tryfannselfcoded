import {
  initializeOnboarding,
  selectCurrentStep,
  selectOnboardingData,
  setCurrentStep,
  updateStepData,
} from "@/store/onboardingSlice";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CompletionStep } from "./CompletionStep";
import { GamificationStep } from "./GamificationStep";
import { InterestsStep } from "./InterestsStep";
import { KYCStep } from "./KYCStep";
import { PersonaDetailsStep } from "./PersonaDetailsStep";
import { WelcomeStep } from "./WelcomeStep";
import { AmbassadorInfoStep } from "./AmbassadorInfoStep";

interface OnboardingFlowProps {
  language: "en" | "ar";
  selectedPersona: string;
  onComplete: () => void;
}

export interface OnboardingData {
  persona: string;
  personaDetails: Record<string, unknown>;
  interests: Record<string, unknown>;
  kyc: Record<string, unknown>;
  gamification: Record<string, unknown>;
}

export function OnboardingFlow({
  language,
  selectedPersona,
  onComplete,
}: OnboardingFlowProps) {
  const dispatch = useDispatch();
  const currentStep = useSelector(selectCurrentStep);
  const onboardingData = useSelector(selectOnboardingData);

  // Initialize onboarding with persona if not already set
  useEffect(() => {
    if (!onboardingData.persona || onboardingData.persona !== selectedPersona) {
      dispatch(initializeOnboarding({ persona: selectedPersona }));
    }
  }, [selectedPersona, onboardingData.persona, dispatch]);

  const isRTL = language === "ar";

  const t = {
    en: {
      steps:
        selectedPersona === "ambassador"
          ? ["Welcome", "Social Media", "Verification", "Rewards", "Complete"]
          : [
            "Welcome",
            "Profile Setup",
            "Interests",
            "Verification",
            "Rewards",
            "Complete",
          ],
      stepOf: "Step {current} of {total}",
    },
    ar: {
      steps:
        selectedPersona === "ambassador"
          ? ["مرحباً", "وسائل التواصل", "التحقق", "المكافآت", "اكتمال"]
          : [
            "مرحباً",
            "إعداد الملف",
            "الاهتمامات",
            "التحقق",
            "المكافآت",
            "اكتمال",
          ],
      stepOf: "الخطوة {current} من {total}",
    },
  };

  const content = t[language];

  // For ambassadors, skip PersonaDetailsStep and InterestsStep, use AmbassadorInfoStep
  const steps =
    selectedPersona === "ambassador"
      ? [
        { component: WelcomeStep, key: "welcome" },
        { component: AmbassadorInfoStep, key: "personaDetails" }, // Includes profile setup + social media
        { component: KYCStep, key: "kyc" },
        { component: GamificationStep, key: "gamification" },
        { component: CompletionStep, key: "completion" },
      ]
      : [
        { component: WelcomeStep, key: "welcome" },
        { component: PersonaDetailsStep, key: "personaDetails" },
        { component: InterestsStep, key: "interests" },
        { component: KYCStep, key: "kyc" },
        { component: GamificationStep, key: "gamification" },
        { component: CompletionStep, key: "completion" },
      ];

  const handleNext = (stepData: Record<string, unknown>) => {
    // If current step is WelcomeStep (step 0), skip to dashboard
    if (currentStep === 0 && steps[currentStep].key === "welcome") {
      onComplete(); // Go directly to dashboard
      return;
    }

    // Update Redux state with step data
    const stepKey = steps[currentStep].key as
      | "personaDetails"
      | "interests"
      | "kyc"
      | "gamification";

    // Only update step data if it's a valid step key (skip interests for ambassador)
    if (stepKey !== "interests" || selectedPersona !== "ambassador") {
      dispatch(updateStepData({ stepKey, data: stepData }));
    }

    if (currentStep === steps.length - 1) {
      onComplete();
    } else {
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div
      className="min-h-screen bg-[#0F021C] relative overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Stepper Header - Hide on WelcomeStep (step 0) */}
          {currentStep !== 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              {/* Progress Text */}
              <div className="text-center mb-6">
                <p className="text-white/60 text-sm">
                  {content.stepOf
                    .replace("{current}", (currentStep + 1).toString())
                    .replace("{total}", steps.length.toString())}
                </p>
              </div>

              {/* Stepper */}
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                {content.steps.map((step, index) => {
                  const isCompleted = index < currentStep;
                  const isCurrent = index === currentStep;

                  return (
                    <div key={index} className="flex items-center flex-1">
                      <div className="flex flex-col items-center relative">
                        {/* Step Circle */}
                        <motion.div
                          animate={{
                            scale: isCurrent ? 1.1 : 1,
                            backgroundColor: isCompleted
                              ? "rgb(245, 158, 11)"
                              : isCurrent
                                ? "rgb(251, 191, 36)"
                                : "rgba(255, 255, 255, 0.1)",
                          }}
                          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${isCompleted || isCurrent
                              ? "border-amber-500"
                              : "border-white/20"
                            } relative z-10 bg-[#0F021C]`}
                        >
                          {isCompleted ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring" }}
                            >
                              <Check className="w-6 h-6 text-black" />
                            </motion.div>
                          ) : (
                            <span
                              className={`text-sm ${isCurrent ? "text-black" : "text-white/60"
                                }`}
                            >
                              {index + 1}
                            </span>
                          )}

                          {/* Glow Effect for Current Step */}
                          {isCurrent && (
                            <motion.div
                              className="absolute inset-0 rounded-full bg-amber-500/30 blur-xl"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </motion.div>

                        {/* Step Label */}
                        <p
                          className={`text-xs mt-2 text-center absolute top-14 whitespace-nowrap ${isCurrent ? "text-amber-400" : "text-white/60"
                            }`}
                        >
                          {step}
                        </p>
                      </div>

                      {/* Connector Line */}
                      {index < content.steps.length - 1 && (
                        <div className="flex-1 h-0.5 mx-2 relative -mt-6">
                          <div className="absolute inset-0 bg-white/10" />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500"
                            initial={{ scaleX: 0 }}
                            animate={{
                              scaleX: isCompleted ? 1 : 0,
                            }}
                            style={{
                              transformOrigin: isRTL ? "right" : "left",
                            }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 50 : -50 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent
                language={language}
                onNext={handleNext}
                onBack={currentStep > 0 ? handleBack : undefined}
                data={onboardingData}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
