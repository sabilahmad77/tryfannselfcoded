import { Button } from "@/components/ui/button";
import { useRewardsMutation } from "@/services/api/onboardingApi";
import {
  markStepAsSubmitted,
  selectIsStepSubmitted,
  selectSubmittedData,
} from "@/store/onboardingSlice";
import type { RootState } from "@/store/store";
import { extractErrorMessage } from "@/utils/errorMessages";
import {
  ArrowRight,
  ChevronLeft,
  Crown,
  Gift,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import type { OnboardingData } from "./OnboardingFlow";

interface GamificationStepProps {
  language: "en" | "ar";
  onNext: (data: Record<string, unknown>) => void;
  onBack?: () => void;
  data: OnboardingData;
}

export function GamificationStep({
  language,
  onNext,
  onBack,
  data,
}: GamificationStepProps) {
  const dispatch = useDispatch();
  const isStepSubmitted = useSelector(
    (state: RootState) => selectIsStepSubmitted(state, 4) // Step 4 is GamificationStep
  );
  const submittedData = useSelector((state: RootState) =>
    selectSubmittedData(state, "gamification")
  );

  // Load initial values from Redux
  const savedData = (data.gamification || {}) as {
    selectedGoal?: string;
    goal_type?: string;
    points_reward?: string;
  };

  const [selectedGoal, setSelectedGoal] = useState<string>(
    savedData.selectedGoal || ""
  );
  const [rewards, { isLoading }] = useRewardsMutation();

  // Restore state from saved data when component mounts or data changes
  useEffect(() => {
    const gamificationData = (data.gamification || {}) as {
      selectedGoal?: string;
      goal_type?: string;
      points_reward?: string;
    };
    setSelectedGoal(gamificationData.selectedGoal || "");
  }, [data.gamification]);

  // Compare current selection with submitted data
  const hasChanges = () => {
    if (!isStepSubmitted || !submittedData) return true;
    const submitted = submittedData as { selectedGoal?: string };
    return selectedGoal !== (submitted.selectedGoal || "");
  };

  const shouldShowNext = isStepSubmitted && !hasChanges();

  const isRTL = language === "ar";

  const t = {
    en: {
      title: "Set Your First Goal",
      subtitle: "Let's make your FANN journey rewarding",
      currentStatus: {
        title: "Your Current Status",
        tier: "Explorer Tier",
        points: "0 Points",
        rank: "Unranked",
      },
      goals: {
        title: "Choose Your Primary Goal",
        subtitle: "This will help us guide your experience",
        options: [
          {
            id: "networking",
            icon: Users,
            title: "Build Network",
            desc: "Connect with 50+ art professionals",
            reward: "+500 pts",
            goal_type: "Build network",
            points_reward: "500",
            color: "from-blue-500/20 to-cyan-500/20",
            borderColor: "blue-500/50",
          },
          {
            id: "collection",
            icon: Gift,
            title: "Start Collecting",
            desc: "Discover and collect 10 artworks",
            reward: "+750 pts",
            goal_type: "Start collecting",
            points_reward: "750",
            color: "from-amber-500/20 to-orange-500/20",
            borderColor: "amber-500/50",
          },
          {
            id: "showcase",
            icon: Sparkles,
            title: "Showcase Work",
            desc: "Upload and feature 20 artworks",
            reward: "+600 pts",
            goal_type: "Showcase work",
            points_reward: "600",
            color: "from-purple-500/20 to-pink-500/20",
            borderColor: "purple-500/50",
          },
          {
            id: "referral",
            icon: Trophy,
            title: "Grow Community",
            desc: "Invite 15 quality members",
            reward: "+1000 pts",
            goal_type: "Grow community",
            points_reward: "1000",
            color: "from-yellow-500/20 to-amber-500/20",
            borderColor: "yellow-500/50",
          },
        ],
      },
      rewards: {
        title: "What You'll Unlock",
        items: [
          {
            tier: "Curator",
            points: "1,000 pts",
            perks: ["Priority support", "AR previews", "Exclusive events"],
          },
          {
            tier: "Ambassador",
            points: "5,000 pts",
            perks: ["VIP badge", "Early releases", "Custom profile"],
          },
          {
            tier: "Founding Patron",
            points: "10,000 pts",
            perks: ["Lifetime benefits", "Advisory access", "Revenue share"],
          },
        ],
      },
      tiers: {
        title: "Tier System",
        desc: "Progress through tiers by earning points and achieving milestones",
      },
      back: "Back",
      continue: "Start My Journey",
      next: "Next",
    },
    ar: {
      title: "حدد هدفك الأول",
      subtitle: "دعنا نجعل رحلتك في FANN مجزية",
      currentStatus: {
        title: "حالتك الحالية",
        tier: "مستوى المستكشف",
        points: "0 نقطة",
        rank: "غير مصنف",
      },
      goals: {
        title: "اختر هدفك الأساسي",
        subtitle: "سيساعدنا هذا في توجيه تجربتك",
        options: [
          {
            id: "networking",
            icon: Users,
            title: "بناء الشبكة",
            desc: "تواصل مع أكثر من 50 محترف فني",
            reward: "+500 نقطة",
            goal_type: "Build network",
            points_reward: "500",
            color: "from-blue-500/20 to-cyan-500/20",
            borderColor: "blue-500/50",
          },
          {
            id: "collection",
            icon: Gift,
            title: "ابدأ الجمع",
            desc: "اكتشف واجمع 10 أعمال فنية",
            reward: "+750 نقطة",
            goal_type: "Start collecting",
            points_reward: "750",
            color: "from-amber-500/20 to-orange-500/20",
            borderColor: "amber-500/50",
          },
          {
            id: "showcase",
            icon: Sparkles,
            title: "اعرض الأعمال",
            desc: "حمّل واعرض 20 عملاً فنياً",
            reward: "+600 نقطة",
            goal_type: "Showcase work",
            points_reward: "600",
            color: "from-purple-500/20 to-pink-500/20",
            borderColor: "purple-500/50",
          },
          {
            id: "referral",
            icon: Trophy,
            title: "تنمية المجتمع",
            desc: "ادعُ 15 عضواً ذا جودة",
            reward: "+1000 نقطة",
            goal_type: "Grow community",
            points_reward: "1000",
            color: "from-yellow-500/20 to-amber-500/20",
            borderColor: "yellow-500/50",
          },
        ],
      },
      rewards: {
        title: "ما ستفتحه",
        items: [
          {
            tier: "منسق",
            points: "1,000 نقطة",
            perks: ["دعم ذو أولوية", "معاينات الواقع المعزز", "فعاليات حصرية"],
          },
          {
            tier: "سفير",
            points: "5,000 نقطة",
            perks: ["شارة VIP", "إصدارات مبكرة", "ملف شخصي مخصص"],
          },
          {
            tier: "راعي مؤسس",
            points: "10,000 نقطة",
            perks: ["مزايا مدى الحياة", "وصول استشاري", "حصة من الإيرادات"],
          },
        ],
      },
      tiers: {
        title: "نظام المستويات",
        desc: "تقدم عبر المستويات عن طريق كسب النقاط وتحقيق المعالم",
      },
      back: "رجوع",
      continue: "ابدأ رحلتي",
      next: "التالي",
    },
  };

  const content = t[language];

  const handleSubmit = async () => {
    // If step was already submitted and no changes, just proceed without API call
    if (shouldShowNext) {
      const selectedGoalData = content.goals.options.find(
        (goal) => goal.id === selectedGoal
      );
      if (selectedGoalData) {
        onNext({
          selectedGoal,
          goal_type: selectedGoalData.goal_type,
          points_reward: selectedGoalData.points_reward,
        });
      }
      return;
    }

    if (!selectedGoal) {
      toast.error(
        language === "en" ? "Please select a goal" : "يرجى اختيار هدف"
      );
      return;
    }

    try {
      const selectedGoalData = content.goals.options.find(
        (goal) => goal.id === selectedGoal
      );

      if (!selectedGoalData) {
        toast.error(
          language === "en" ? "Invalid goal selected" : "هدف غير صحيح"
        );
        return;
      }

      const rewardsData = {
        goal_type: selectedGoalData.goal_type,
        points_reward: selectedGoalData.points_reward,
      };

      const result = await rewards(rewardsData).unwrap();

      // Handle API response
      const apiResponse = result as {
        success?: boolean;
        status_code?: number;
        message?: string | Record<string, unknown>;
        data?: unknown;
      };

      const isSuccess =
        apiResponse.success === true || apiResponse.status_code === 200;

      if (isSuccess) {
        // Extract success message
        let successMessage = "";
        if (apiResponse.message) {
          if (
            typeof apiResponse.message === "string" &&
            apiResponse.message.trim()
          ) {
            successMessage = apiResponse.message;
          } else if (
            typeof apiResponse.message === "object" &&
            apiResponse.message !== null &&
            Object.keys(apiResponse.message).length > 0
          ) {
            const messageObj = apiResponse.message as Record<string, unknown>;
            if (messageObj.message) {
              successMessage = String(messageObj.message);
            }
          }
        }

        if (!successMessage) {
          successMessage =
            language === "en"
              ? "Goal set successfully!"
              : "تم تعيين الهدف بنجاح!";
        }

        toast.success(successMessage);

        // Mark step as submitted in Redux
        const stepData = {
          selectedGoal,
          goal_type: selectedGoalData.goal_type,
          points_reward: selectedGoalData.points_reward,
        };

        dispatch(
          markStepAsSubmitted({
            stepIndex: 4, // GamificationStep is step 4
            stepKey: "gamification",
            data: stepData,
          })
        );

        onNext(stepData);
      } else {
        const errorMessage =
          language === "en"
            ? "Failed to set goal. Please try again."
            : "فشل تعيين الهدف. يرجى المحاولة مرة أخرى.";
        toast.error(errorMessage);
      }
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, language);
      console.error("Rewards error:", errorMessage);
    }
  };

  return (
    <div className="glass border border-white/10 rounded-3xl p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-3xl text-white mb-2">{content.title}</h2>
          <p className="text-white/60">{content.subtitle}</p>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30"
        >
          <h3 className="text-white mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            {content.currentStatus.title}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg glass">
              <div className="text-2xl text-amber-400 mb-1">
                {content.currentStatus.tier}
              </div>
              <div className="text-xs text-white/60">Tier</div>
            </div>
            <div className="text-center p-4 rounded-lg glass">
              <div className="text-2xl text-white mb-1">
                {content.currentStatus.points}
              </div>
              <div className="text-xs text-white/60">Total</div>
            </div>
            <div className="text-center p-4 rounded-lg glass">
              <div className="text-2xl text-white/60 mb-1">
                {content.currentStatus.rank}
              </div>
              <div className="text-xs text-white/60">Position</div>
            </div>
          </div>
        </motion.div>

        {/* Goals Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="mb-6 text-center">
            <h3 className="text-2xl text-white mb-2">{content.goals.title}</h3>
            <p className="text-white/60">{content.goals.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {content.goals.options.map((goal, index) => {
              const Icon = goal.icon;
              const isSelected = selectedGoal === goal.id;

              return (
                <motion.button
                  key={goal.id}
                  type="button"
                  onClick={() => setSelectedGoal(goal.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className={`p-6 rounded-xl border transition-all text-left ${
                    isSelected
                      ? `bg-gradient-to-br ${goal.color} border-${goal.borderColor}`
                      : "glass border-white/10 hover:border-amber-500/30"
                  } disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${goal.color} border border-${goal.borderColor} flex items-center justify-center shrink-0`}
                    >
                      <Icon
                        className={`w-7 h-7 ${
                          isSelected ? "text-amber-400" : "text-white/70"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4
                          className={`text-lg ${
                            isSelected ? "text-white" : "text-white/80"
                          }`}
                        >
                          {goal.title}
                        </h4>
                        <span className="text-amber-400 text-sm shrink-0 ml-2">
                          {goal.reward}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm mb-3">{goal.desc}</p>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-2 text-amber-400 text-sm"
                        >
                          <Target className="w-4 h-4" />
                          <span>
                            {language === "en"
                              ? "Selected Goal"
                              : "الهدف المحدد"}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Rewards Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <div className="mb-6 text-center">
            <h3 className="text-2xl text-white mb-2">
              {content.rewards.title}
            </h3>
            <p className="text-white/60">{content.tiers.desc}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {content.rewards.items.map((reward, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="p-6 rounded-xl glass border border-white/10 hover:border-amber-500/30 transition-all"
              >
                <div className="text-center mb-4">
                  <div className="text-xl text-white mb-1">{reward.tier}</div>
                  <div className="text-amber-400 text-sm">{reward.points}</div>
                </div>
                <div className="space-y-2">
                  {reward.perks.map((perk, perkIndex) => (
                    <div
                      key={perkIndex}
                      className="flex items-center gap-2 text-white/60 text-sm"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex gap-4"
        >
          {onBack && (
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              disabled={isLoading}
              className="flex-1 h-12 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft
                className={`w-5 h-5 mr-2 ${isRTL ? "rotate-180" : ""}`}
              />
              {content.back}
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !selectedGoal}
            className="flex-1 h-12 shadow-lg shadow-primary/50 group relative overflow-hidden disabled:opacity-50"
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
                  {language === "en"
                    ? "Setting goal..."
                    : "جارٍ تعيين الهدف..."}
                </>
              ) : (
                <>
                  {shouldShowNext ? content.next : content.continue}
                  <ArrowRight
                    className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${
                      isRTL ? "rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
