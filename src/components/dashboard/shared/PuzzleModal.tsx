import { useState } from "react";
import { motion } from "motion/react";
import { Puzzle, Sparkles, Award, CheckCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { PuzzleSolver } from "./PuzzleSolver";
import { useLanguage } from "@/contexts/useLanguage";
import {
  useGetDashboardStatsQuery,
  useUserPuzzleCompletionMutation,
} from "@/services/api/dashboardApi";
import { toast } from "sonner";

const content = {
  en: {
    title: "Puzzle Challenge",
    description: "Solve the puzzle to earn points!",
    startPuzzle: "Start Puzzle",
    completed: "Completed",
    alreadyCompleted: "Puzzle Already Completed",
    completedDescription: "You have already completed this puzzle challenge!",
    difficulty: {
      easy: "Easy (3x3)",
      medium: "Medium (4x4)",
    },
    pointsReward: "Points Reward",
    selectDifficulty: "Select Difficulty",
    success:
      "Puzzle completed successfully! Points have been added to your account.",
    error: "Failed to complete puzzle. Please try again.",
  },
  ar: {
    title: "تحدي اللغز",
    description: "حل اللغز لكسب النقاط!",
    startPuzzle: "بدء اللغز",
    completed: "مكتمل",
    alreadyCompleted: "تم حل اللغز بالفعل",
    completedDescription: "لقد أكملت تحدي اللغز هذا بالفعل!",
    difficulty: {
      easy: "سهل (3x3)",
      medium: "متوسط (4x4)",
    },
    pointsReward: "مكافأة النقاط",
    selectDifficulty: "اختر الصعوبة",
    success: "تم حل اللغز بنجاح! تمت إضافة النقاط إلى حسابك.",
    error: "فشل إكمال اللغز. يرجى المحاولة مرة أخرى.",
  },
};

export interface PuzzleModalProps {
  difficulty?: "easy" | "medium";
  pointsReward?: number;
  imageUrl?: string;
  onComplete?: (moves: number, time: number) => void;
}

export function PuzzleModal({
  difficulty: defaultDifficulty = "easy",
  pointsReward = 50,
  imageUrl,
  onComplete,
}: PuzzleModalProps) {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";

  const [open, setOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<"easy" | "medium">(
    defaultDifficulty
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Fetch dashboard stats to check puzzle_completed status
  const { data: statsData, isLoading: isLoadingStats } =
    useGetDashboardStatsQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  // Puzzle completion mutation
  const [userPuzzleCompletion] = useUserPuzzleCompletionMutation();

  // Check if puzzle is already completed
  const puzzleCompleted = statsData?.data?.puzzle_completed === true;

  // Calculate points based on difficulty
  const calculatedPoints =
    difficulty === "easy" ? pointsReward : pointsReward * 1.5;

  const handleComplete = async (moves: number, time: number) => {
    setIsCompleted(true);

    try {
      // Call API to mark puzzle as completed
      const result = await userPuzzleCompletion().unwrap();

      if (result.success) {
        toast.success(t.success);
        if (onComplete) {
          onComplete(moves, time);
        }
      } else {
        const errorMessage =
          typeof result.message === "string" ? result.message : t.error;
        toast.error(errorMessage);
      }
    } catch (error: unknown) {
      console.error("Error completing puzzle:", error);
      // Handle different error types
      if (error && typeof error === "object" && "data" in error) {
        const errorData = error.data as {
          message?: string;
          detail?: string;
          [key: string]: unknown;
        };
        const errorMessage =
          errorData?.message ||
          errorData?.detail ||
          (typeof errorData === "string" ? errorData : t.error);
        toast.error(errorMessage);
      } else {
        toast.error(t.error);
      }
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset completion state and puzzle when modal closes
      setIsCompleted(false);
      setResetKey((prev) => prev + 1);
    }
  };

  const handleTriggerClick = () => {
    if (!puzzleCompleted) {
      setOpen(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <div onClick={handleTriggerClick}>
        <motion.div
          whileHover={!puzzleCompleted ? { scale: 1.02 } : {}}
          whileTap={!puzzleCompleted ? { scale: 0.98 } : {}}
          className="h-full"
        >
          <div
            className={`glass rounded-2xl p-6 h-full flex flex-col transition-all duration-300 border-2 ${
              puzzleCompleted
                ? "border-[#45e3d3]/30 cursor-not-allowed opacity-75"
                : "border-[#4e4e4e78] cursor-pointer hover:border-[#ffcc33]/50"
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-center gap-3 mb-4 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#9375b5] to-[#fface3] rounded-xl flex items-center justify-center">
                <Puzzle className="w-6 h-6 text-white" />
              </div>
              <div className={isRTL ? "text-right" : "text-left"}>
                <h2 className="text-2xl text-[#ffffff]">{t.title}</h2>
                <p className="text-sm text-[#808c99]">{t.description}</p>
              </div>
            </div>

            {/* Points Reward Badge */}
            <div className="mb-4">
              <Badge className="bg-gradient-to-r from-[#ffcc33] to-[#fbbf24] text-[#0F021C] border-0">
                <Award className="w-3 h-3 mr-1" />
                {calculatedPoints} {t.pointsReward}
              </Badge>
            </div>

            {/* Difficulty Info */}
            <div className="flex-1 flex items-center justify-center">
              <div
                className={`flex items-center gap-2 text-[#808c99] ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Sparkles className="w-5 h-5 text-[#9375b5]" />
                <span className="text-sm">
                  {t.difficulty[difficulty === "easy" ? "easy" : "medium"]}
                </span>
              </div>
            </div>

            {/* Start Button or Completed State */}
            {puzzleCompleted ? (
              <div className="mt-4 p-4 bg-gradient-to-r from-[#45e3d3]/20 to-[#0ea5e9]/20 rounded-lg border border-[#45e3d3]/30">
                <div
                  className={`flex items-center gap-2 justify-center ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <CheckCircle className="w-5 h-5 text-[#45e3d3]" />
                  <span className="text-sm text-[#ffffff] font-semibold">
                    {t.completed}
                  </span>
                </div>
              </div>
            ) : (
              <Button
                disabled={isLoadingStats}
                className="w-full bg-gradient-to-r from-[#9375b5] to-[#fface3] hover:from-[#fface3] hover:to-[#9375b5] hover:shadow-lg hover:shadow-[#9375b5]/50 text-white transition-all duration-200 cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {isLoadingStats ? (
                  <Loader2
                    className={`w-4 h-4 animate-spin ${
                      isRTL ? "ml-2" : "mr-2"
                    }`}
                  />
                ) : (
                  <Puzzle className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                )}
                {t.startPuzzle}
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      <DialogContent
        className="max-w-2xl w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto glass border-2 border-[#4e4e4e78]"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#ffffff]">
            {t.title}
          </DialogTitle>
          <DialogDescription className="text-[#808c99]">
            {puzzleCompleted ? t.completedDescription : t.description}
          </DialogDescription>
        </DialogHeader>

        {/* Show completed message if puzzle is already completed */}
        {puzzleCompleted && (
          <div className="mb-4 p-4 bg-gradient-to-r from-[#45e3d3]/20 to-[#0ea5e9]/20 rounded-lg border border-[#45e3d3]/30">
            <div
              className={`flex items-center gap-3 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <CheckCircle className="w-6 h-6 text-[#45e3d3] shrink-0" />
              <div className={isRTL ? "text-right" : "text-left"}>
                <p className="text-[#ffffff] font-semibold">
                  {t.alreadyCompleted}
                </p>
                <p className="text-sm text-[#808c99]">
                  {t.completedDescription}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Difficulty Selector (only show if not completed and puzzle not already completed) */}
        {!isCompleted && !puzzleCompleted && (
          <div className="mb-4">
            <label
              className={`text-sm text-[#808c99] mb-2 block ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t.selectDifficulty}
            </label>
            <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Button
                onClick={() => {
                  setDifficulty("easy");
                  setResetKey((prev) => prev + 1);
                  setIsCompleted(false);
                }}
                variant={difficulty === "easy" ? "default" : "outline"}
                size="sm"
                className={
                  difficulty === "easy"
                    ? "bg-gradient-to-r from-[#ffcc33] to-[#fbbf24] text-[#0F021C] border-0"
                    : "border-[#4e4e4e78] text-[#808c99] hover:bg-[#1D112A]"
                }
              >
                {t.difficulty.easy}
              </Button>
              <Button
                onClick={() => {
                  setDifficulty("medium");
                  setResetKey((prev) => prev + 1);
                  setIsCompleted(false);
                }}
                variant={difficulty === "medium" ? "default" : "outline"}
                size="sm"
                className={
                  difficulty === "medium"
                    ? "bg-gradient-to-r from-[#45e3d3] to-[#0ea5e9] text-white border-0"
                    : "border-[#4e4e4e78] text-[#808c99] hover:bg-[#1D112A]"
                }
              >
                {t.difficulty.medium}
              </Button>
            </div>
          </div>
        )}

        {/* Puzzle Component (only show if puzzle not already completed) */}
        {!puzzleCompleted && (
          <div className="relative">
            <PuzzleSolver
              key={`puzzle-${resetKey}-${difficulty}`}
              difficulty={difficulty}
              imageUrl={imageUrl}
              pointsReward={Math.round(calculatedPoints)}
              onComplete={handleComplete}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
