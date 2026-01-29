import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Play,
  Clock,
  CheckCircle,
  Award,
  Film,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { Badge } from "../../ui/badge";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/useLanguage";
import {
  useGetWatchEarnQuery,
  useUserWatchEarnMutation,
  type WatchEarn,
} from "@/services/api/dashboardApi";
import { VideoWatchModal } from "./VideoWatchModal";

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
    watchError: "Failed to start video. Please try again.",
    loadingError: "Failed to load videos. Please try again.",
    noVideos: "No videos available",
    watchProgress: "Watch {seconds}/20 seconds to earn points",
    closeWarning: "You haven't watched 20 seconds yet. Close anyway?",
    videoLoading: "Loading video...",
    videoError: "Failed to load video. Please try again.",
    watchComplete: "Great! You've earned {points} points!",
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
    videos: [],
    watchSuccess: "بدأ الفيديو! سيتم منح النقاط عند الانتهاء.",
    watchError: "فشل بدء الفيديو. يرجى المحاولة مرة أخرى.",
    loadingError: "فشل تحميل الفيديوهات. يرجى المحاولة مرة أخرى.",
    noVideos: "لا توجد فيديوهات متاحة",
    watchProgress: "شاهد {seconds}/20 ثانية لكسب النقاط",
    closeWarning: "لم تشاهد 20 ثانية بعد. إغلاق على أي حال؟",
    videoLoading: "جاري تحميل الفيديو...",
    videoError: "فشل تحميل الفيديو. يرجى المحاولة مرة أخرى.",
    watchComplete: "رائع! لقد ربحت {points} نقاط!",
  },
};

const thumbnailGradients: { [key: string]: string } = {
  intro: "from-[#C59B48] to-[#fbbf24]",
  collection: "from-[#45e3d3] to-[#0ea5e9]",
  auth: "from-[#9375b5] to-[#fface3]",
  referral: "from-[#0ea5e9] to-[#45e3d3]",
  default: "from-[#0ea5e9] to-[#45e3d3]",
};

// Helper function to get thumbnail gradient based on video index or title
const getThumbnailGradient = (video: WatchEarn, index: number): string => {
  const title = (video.title || "").toLowerCase();
  if (title.includes("welcome") || title.includes("مرحب"))
    return thumbnailGradients.intro;
  if (title.includes("collection") || title.includes("مجموعة"))
    return thumbnailGradients.collection;
  if (title.includes("auth") || title.includes("توثيق"))
    return thumbnailGradients.auth;
  if (title.includes("referral") || title.includes("إحالة"))
    return thumbnailGradients.referral;
  // Use index-based fallback
  const gradients = [
    thumbnailGradients.intro,
    thumbnailGradients.collection,
    thumbnailGradients.auth,
    thumbnailGradients.referral,
  ];
  return gradients[index % gradients.length] || thumbnailGradients.default;
};

interface VideoWatchTime {
  watchTime: number;
  hasCalledAPI: boolean;
  lastPosition: number;
}

interface WatchVideosProps {
  /** Callback to refetch dashboard stats after watch earn API is called */
  onRefetchStats?: () => void;
}

export function WatchVideos({ onRefetchStats }: WatchVideosProps = {}) {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<WatchEarn | null>(null);

  // Per-video watch time tracking
  const [videoWatchTimes, setVideoWatchTimes] = useState<
    Record<number, VideoWatchTime>
  >({});

  // Fetch videos from API
  const {
    data: watchEarnData,
    isLoading: isLoadingVideos,
    isError: isVideosError,
    refetch: refetchVideos,
  } = useGetWatchEarnQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // User watch earn mutation
  const [userWatchEarn] = useUserWatchEarnMutation();

  // Parse videos from API response
  const videos = useMemo(() => {
    if (!watchEarnData?.data) return [];

    // Handle both array and single object responses
    const data = watchEarnData.data;
    if (Array.isArray(data)) {
      return data;
    }
    // If single object, wrap in array
    return [data as WatchEarn];
  }, [watchEarnData]);

  // Calculate stats from API data (memoized for performance)
  const stats = useMemo(() => {
    const totalVideos = videos.length;

    // Filter completed videos once for efficiency
    const completedVideos = videos.filter((v) => v.is_completed === true);
    const completedCount = completedVideos.length;

    // Calculate total points from completed videos only
    const totalPointsEarned = completedVideos.reduce(
      (sum, v) => sum + (Number(v.points) || 0),
      0
    );

    // Calculate progress percentage (0-100)
    const progressPercent =
      totalVideos > 0 ? (completedCount / totalVideos) * 100 : 0;

    return {
      totalVideos,
      completedCount,
      totalPointsEarned,
      progressPercent: Math.min(100, Math.max(0, progressPercent)), // Clamp between 0-100
    };
  }, [videos]);

  const { totalVideos, completedCount, totalPointsEarned, progressPercent } =
    stats;

  // Handle watching a video - open modal instead of calling API
  const handleWatchVideo = (video: WatchEarn) => {
    if (!video.link) {
      toast.error(t.watchError);
      return;
    }

    // If opening a different video, update selected video first
    // The modal will handle the state reset when video.id changes
    if (selectedVideo?.id !== video.id) {
      setSelectedVideo(video);
      // Ensure modal is open for the new video
      setIsModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Don't reset selectedVideo to preserve state for reopening
  };

  // Handle watch time update from modal
  const handleWatchTimeUpdate = (videoId: number, data: VideoWatchTime) => {
    setVideoWatchTimes((prev) => ({
      ...prev,
      [videoId]: data,
    }));
  };

  // Handle API call from modal
  const handleApiCall = async (videoId: number) => {
    try {
      const result = await userWatchEarn({
        watch_id: videoId,
      }).unwrap();

      if (result.success) {
        // Mark API as called in watch time state
        setVideoWatchTimes((prev) => ({
          ...prev,
          [videoId]: {
            ...prev[videoId],
            hasCalledAPI: true,
          },
        }));
        // Refetch dashboard stats to update points and other stats
        onRefetchStats?.();
        // Videos will be automatically refetched via RTK Query tag invalidation
      } else {
        // Handle API error messages
        const errorMessage =
          typeof result.message === "string" ? result.message : t.watchError;
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: unknown) {
      console.error("Error watching video:", error);
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
          (typeof errorData === "string" ? errorData : t.watchError);
        toast.error(errorMessage);
      } else {
        toast.error(t.watchError);
      }
      throw error;
    }
  };

  // Get watch time data for selected video
  const selectedVideoWatchTime =
    selectedVideo && videoWatchTimes[selectedVideo.id]
      ? videoWatchTimes[selectedVideo.id]
      : null;

  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      {/* Header */}
      <div
        className={`flex items-center gap-3 mb-4 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-[#0ea5e9] to-[#45e3d3] rounded-xl flex items-center justify-center">
          <Film className="w-6 h-6 text-white" />
        </div>
        <div className={isRTL ? "text-right" : "text-left"}>
          <h2 className="text-2xl text-[#ffffff]">{t.title}</h2>
          <p className="text-sm text-[#808c99]">{t.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-[#C59B48]/20 to-[#C59B48]/5 rounded-xl p-4 border border-[#C59B48]/30"
        >
          <div
            className={`flex items-center gap-2 mb-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Award className="w-5 h-5 text-[#C59B48]" />
            <span className="text-xs text-[#808c99]">{t.totalEarned}</span>
          </div>
          <p className="text-2xl text-[#ffffff]">{totalPointsEarned}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-[#45e3d3]/20 to-[#45e3d3]/5 rounded-xl p-4 border border-[#45e3d3]/30"
        >
          <div
            className={`flex items-center gap-2 mb-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <CheckCircle className="w-5 h-5 text-[#45e3d3]" />
            <span className="text-xs text-[#808c99]">{t.videosCompleted}</span>
          </div>
          <p className="text-2xl text-[#ffffff]">
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
          <span className="text-sm text-[#808c99]">{t.progress}</span>
          <span className="text-sm text-[#C59B48]">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <Progress value={progressPercent} className="h-2 bg-[#0B0B0D]" />
      </div>

      {/* Video List */}
      <div className="flex-1 space-y-3 overflow-y-auto overflow-x-hidden min-h-0 pr-1">
        {isLoadingVideos ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#0ea5e9] animate-spin" />
          </div>
        ) : isVideosError ? (
          <div className="flex flex-col items-center justify-center py-8 text-[#808c99]">
            <AlertCircle className="w-12 h-12 mb-2 text-[#ef4444]" />
            <p className="text-sm mb-4">{t.loadingError}</p>
            <Button
              onClick={() => refetchVideos()}
              size="sm"
              className="hover:shadow-lg hover:shadow-primary/50 transition-all duration-200 cursor-pointer"
            >
              {language === "en" ? "Retry" : "إعادة المحاولة"}
            </Button>
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-[#808c99]">
            <Film className="w-12 h-12 mb-2" />
            <p className="text-sm">{t.noVideos}</p>
          </div>
        ) : (
          videos.map((video, index) => {
            const isCompleted = video.is_completed === true;
            const videoDuration = video.duration || 0;
            const videoPoints = video.points || 0;

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`relative overflow-hidden rounded-xl border transition-all ${
                  isCompleted
                    ? "border-[#45e3d3]/30 bg-[#0B0B0D]"
                    : "border-[#4e4e4e78] bg-[#0B0B0D] hover:border-[#C59B48]/30"
                }`}
              >
                <div
                  className={`flex gap-4 p-4 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Video Thumbnail */}
                  <div
                    className={`relative w-24 h-24 rounded-lg bg-gradient-to-br ${getThumbnailGradient(
                      video,
                      index
                    )} flex items-center justify-center shrink-0`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-10 h-10 text-white" />
                    ) : (
                      <Play className="w-10 h-10 text-white" />
                    )}
                    {videoDuration > 0 && (
                      <div className="absolute bottom-2 right-2 bg-black/70 rounded px-2 py-1 text-xs text-white flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {videoDuration}
                        {isRTL ? "" : " "}
                        {t.duration}
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div
                    className={`flex-1 flex flex-col justify-between ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <div>
                      <h4 className="text-[#ffffff] mb-1">{video.title}</h4>
                      <Badge
                        variant="outline"
                        className={`${
                          isCompleted
                            ? "border-[#45e3d3] text-[#45e3d3]"
                            : "border-[#C59B48] text-[#C59B48]"
                        }`}
                      >
                        +{videoPoints} {t.points}
                      </Badge>
                    </div>

                    {!isCompleted && (
                      <Button
                        onClick={() => handleWatchVideo(video)}
                        size="sm"
                        className="mt-2 bg-gradient-to-r from-[#0ea5e9] to-[#45e3d3] hover:from-[#45e3d3] hover:to-[#0ea5e9] hover:shadow-lg hover:shadow-[#0ea5e9]/50 text-white transition-all duration-200 self-start cursor-pointer"
                      >
                        <Play
                          className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`}
                        />
                        {t.watchNow}
                      </Button>
                    )}

                    {isCompleted && (
                      <div
                        className={`flex items-center gap-2 mt-2 text-[#45e3d3] ${
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
            );
          })
        )}
      </div>

      {/* Video Watch Modal */}
      {selectedVideo && (
        <VideoWatchModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          video={selectedVideo}
          watchTimeData={selectedVideoWatchTime}
          onWatchTimeUpdate={handleWatchTimeUpdate}
          onApiCall={handleApiCall}
        />
      )}
    </div>
  );
}
