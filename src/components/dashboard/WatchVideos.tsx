import { motion } from "motion/react";
import { Play, Clock, CheckCircle, Award, Film } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/useLanguage";

const content = {
  en: {
    title: "Watch & Earn",
    description: "Complete video tutorials to earn points",
    watchNow: "Watch Now",
    completed: "Completed",
    duration: "min",
    points: "Points",
    totalEarned: "Total Earned",
    videosCompleted: "Videos Completed",
    progress: "Progress",
    videos: [
      {
        id: 1,
        title: "Welcome to FANN Platform",
        duration: 3,
        points: 25,
        completed: true,
        thumbnail: "intro",
      },
      {
        id: 2,
        title: "How to Build Your Art Collection",
        duration: 5,
        points: 50,
        completed: true,
        thumbnail: "collection",
      },
      {
        id: 3,
        title: "Understanding Art Authentication",
        duration: 7,
        points: 75,
        completed: false,
        thumbnail: "auth",
      },
      {
        id: 4,
        title: "Maximizing Your Referral Rewards",
        duration: 4,
        points: 50,
        completed: false,
        thumbnail: "referral",
      },
    ],
    watchSuccess: "Video started! Points will be awarded upon completion.",
  },
  ar: {
    title: "شاهد واربح",
    description: "أكمل الفيديوهات التعليمية لكسب النقاط",
    watchNow: "شاهد الآن",
    completed: "مكتمل",
    duration: "دقيقة",
    points: "نقاط",
    totalEarned: "إجمالي المكتسب",
    videosCompleted: "الفيديوهات المكتملة",
    progress: "التقدم",
    videos: [
      {
        id: 1,
        title: "مرحباً بك في منصة FANN",
        duration: 3,
        points: 25,
        completed: true,
        thumbnail: "intro",
      },
      {
        id: 2,
        title: "كيفية بناء مجموعتك الفنية",
        duration: 5,
        points: 50,
        completed: true,
        thumbnail: "collection",
      },
      {
        id: 3,
        title: "فهم توثيق الأعمال الفنية",
        duration: 7,
        points: 75,
        completed: false,
        thumbnail: "auth",
      },
      {
        id: 4,
        title: "تعظيم مكافآت الإحالة",
        duration: 4,
        points: 50,
        completed: false,
        thumbnail: "referral",
      },
    ],
    watchSuccess: "بدأ الفيديو! سيتم منح النقاط عند الانتهاء.",
  },
};

const thumbnailGradients: { [key: string]: string } = {
  intro: "from-[#d4af37] to-[#fbbf24]",
  collection: "from-[#14b8a6] to-[#0ea5e9]",
  auth: "from-[#8b5cf6] to-[#ec4899]",
  referral: "from-[#0ea5e9] to-[#14b8a6]",
};

export function WatchVideos() {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";

  const totalVideos = t.videos.length;
  const completedCount = t.videos.filter((v) => v.completed).length;
  const totalPointsEarned = t.videos
    .filter((v) => v.completed)
    .reduce((sum, v) => sum + v.points, 0);
  const progressPercent = (completedCount / totalVideos) * 100;

  const handleWatchVideo = () => {
    toast.success(t.watchSuccess);
    // In a real app, this would open a video player modal
  };

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      {/* Header */}
      <div
        className={`flex items-center gap-3 mb-4 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-[#0ea5e9] to-[#14b8a6] rounded-xl flex items-center justify-center">
          <Film className="w-6 h-6 text-white" />
        </div>
        <div className={isRTL ? "text-right" : "text-left"}>
          <h2 className="text-2xl text-[#fef3c7]">{t.title}</h2>
          <p className="text-sm text-[#cbd5e1]">{t.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 rounded-xl p-4 border border-[#d4af37]/30"
        >
          <div
            className={`flex items-center gap-2 mb-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Award className="w-5 h-5 text-[#d4af37]" />
            <span className="text-xs text-[#cbd5e1]">{t.totalEarned}</span>
          </div>
          <p className="text-2xl text-[#fef3c7]">{totalPointsEarned}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-[#14b8a6]/20 to-[#14b8a6]/5 rounded-xl p-4 border border-[#14b8a6]/30"
        >
          <div
            className={`flex items-center gap-2 mb-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <CheckCircle className="w-5 h-5 text-[#14b8a6]" />
            <span className="text-xs text-[#cbd5e1]">{t.videosCompleted}</span>
          </div>
          <p className="text-2xl text-[#fef3c7]">
            {completedCount}/{totalVideos}
          </p>
        </motion.div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div
          className={`flex items-center justify-between mb-2 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <span className="text-sm text-[#cbd5e1]">{t.progress}</span>
          <span className="text-sm text-[#d4af37]">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <Progress value={progressPercent} className="h-2 bg-[#334155]" />
      </div>

      {/* Video List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {t.videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`relative overflow-hidden rounded-xl border transition-all ${
              video.completed
                ? "border-[#14b8a6]/30 bg-[#1e293b]/30"
                : "border-[#334155] bg-[#1e293b]/50 hover:border-[#d4af37]/30"
            }`}
          >
            <div
              className={`flex gap-4 p-4 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              {/* Video Thumbnail */}
              <div
                className={`relative w-24 h-24 rounded-lg bg-gradient-to-br ${
                  thumbnailGradients[video.thumbnail]
                } flex items-center justify-center flex-shrink-0`}
              >
                {video.completed ? (
                  <CheckCircle className="w-10 h-10 text-white" />
                ) : (
                  <Play className="w-10 h-10 text-white" />
                )}
                <div className="absolute bottom-2 right-2 bg-black/70 rounded px-2 py-1 text-xs text-white flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                  {isRTL ? "" : " "}
                  {t.duration}
                </div>
              </div>

              {/* Video Info */}
              <div
                className={`flex-1 flex flex-col justify-between ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <div>
                  <h4 className="text-[#fef3c7] mb-1">{video.title}</h4>
                  <Badge
                    variant="outline"
                    className={`${
                      video.completed
                        ? "border-[#14b8a6] text-[#14b8a6]"
                        : "border-[#d4af37] text-[#d4af37]"
                    }`}
                  >
                    +{video.points} {t.points}
                  </Badge>
                </div>

                {!video.completed && (
                  <Button
                    onClick={handleWatchVideo}
                    size="sm"
                    className="mt-2 bg-gradient-to-r from-[#0ea5e9] to-[#14b8a6] hover:from-[#14b8a6] hover:to-[#0ea5e9] text-white transition-all self-start"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {t.watchNow}
                  </Button>
                )}

                {video.completed && (
                  <div
                    className={`flex items-center gap-2 mt-2 text-[#14b8a6] ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">{t.completed}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
