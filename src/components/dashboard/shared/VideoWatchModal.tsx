import { useState, useEffect, useRef, useCallback } from "react";
import ReactPlayer from "react-player";
import { Loader2, AlertCircle, Clock } from "lucide-react";
import { CustomModal } from "../../ui/CustomModal";
import { ConfirmationDialog } from "../../ui/ConfirmationDialog";
import { Progress } from "../../ui/progress";
import { useLanguage } from "@/contexts/useLanguage";
import { toast } from "sonner";
import type { WatchEarn } from "@/services/api/dashboardApi";

interface VideoWatchTime {
  watchTime: number;
  hasCalledAPI: boolean;
  lastPosition: number;
}

interface VideoWatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: WatchEarn | null;
  watchTimeData: VideoWatchTime | null;
  onWatchTimeUpdate: (videoId: number, data: VideoWatchTime) => void;
  onApiCall: (videoId: number) => Promise<void>;
}

const MIN_WATCH_SECONDS = 20;

const content = {
  en: {
    watchProgress: "Watch {seconds}/20 seconds to earn points",
    closeWarning: "You haven't watched 20 seconds yet. Close anyway?",
    videoLoading: "Loading video...",
    videoError: "Failed to load video. Please try again.",
    watchComplete: "Great! You've earned {points} points!",
    close: "Close",
    stay: "Stay",
  },
  ar: {
    watchProgress: "شاهد {seconds}/20 ثانية لكسب النقاط",
    closeWarning: "لم تشاهد 20 ثانية بعد. إغلاق على أي حال؟",
    videoLoading: "جاري تحميل الفيديو...",
    videoError: "فشل تحميل الفيديو. يرجى المحاولة مرة أخرى.",
    watchComplete: "رائع! لقد ربحت {points} نقاط!",
    close: "إغلاق",
    stay: "البقاء",
  },
};

export function VideoWatchModal({
  isOpen,
  onClose,
  video,
  watchTimeData,
  onWatchTimeUpdate,
  onApiCall,
}: VideoWatchModalProps) {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWatchTime, setCurrentWatchTime] = useState(0);
  const [hasCalledAPI, setHasCalledAPI] = useState(false);
  const [lastPosition, setLastPosition] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isTabVisibleRef = useRef(true);
  const isPlayingRef = useRef(false);
  const isVideoReadyRef = useRef(false); // Track video ready state in ref for interval
  // Track if we've initialized this video to prevent infinite loops
  const initializedVideoIdRef = useRef<number | null>(null);
  const currentVideoIdRef = useRef<number | null>(null);
  // Track the starting position for watch time calculation
  // This is set when video starts playing or resumes from saved position
  const startTrackingPositionRef = useRef<number>(0);
  const savedWatchTimeRef = useRef<number>(0); // Track saved watch time for resume calculations
  const isSwitchingVideoRef = useRef(false); // Flag to prevent updates during video switch

  // Initialize video when video ID changes (only runs once per video)
  useEffect(() => {
    if (!video) return;

    // Only reset if this is a different video
    if (initializedVideoIdRef.current === video.id) {
      return; // Already initialized, skip
    }

    // Set flag to prevent updates during switch
    isSwitchingVideoRef.current = true;

    // Clear any running intervals FIRST to prevent stale updates from previous video
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Mark this video as initialized
    initializedVideoIdRef.current = video.id;
    currentVideoIdRef.current = video.id;
    // Reset tracking refs to prevent loops
    lastWatchTimeDataRef.current = null;
    lastUpdateRef.current = null;
    apiCallInProgressRef.current = false;
    // Reset API call tracking for new video
    if (hasCalledApiForVideoRef.current !== video.id) {
      hasCalledApiForVideoRef.current = null;
    }
    setIsVideoReady(false); // Reset video ready state
    isVideoReadyRef.current = false; // Reset ref

    // Reset player state when video changes - do this AFTER clearing intervals
    setIsPlaying(false);
    isPlayingRef.current = false;
    setIsLoading(true);
    setError(null);

    // Load watch time data for this video
    // Only use watchTimeData if it exists and matches current video (safety check)
    // Note: watchTimeData should already be filtered by parent, but double-check here
    if (watchTimeData) {
      // Initialize with watch time data for this video
      const savedWatchTime = watchTimeData.watchTime;
      const savedLastPosition = watchTimeData.lastPosition;

      setCurrentWatchTime(savedWatchTime);
      setLastPosition(savedLastPosition);
      // Set starting position to saved position
      // Watch time will be calculated as: savedWatchTime + (currentPosition - savedLastPosition)
      // This ensures we continue from where we left off
      startTrackingPositionRef.current = savedLastPosition;
      savedWatchTimeRef.current = savedWatchTime; // Store saved watch time for calculations

      // Only set hasCalledAPI from parent if it's true (don't reset if we've already called)
      // This prevents parent state from resetting our API call status
      if (watchTimeData.hasCalledAPI) {
        setHasCalledAPI(true);
        hasCalledApiForVideoRef.current = video.id; // Mark as called
      } else {
        // Only set to false if we haven't called API for this video yet
        if (hasCalledApiForVideoRef.current !== video.id) {
          setHasCalledAPI(false);
        }
      }
      // Mark this data as processed
      lastWatchTimeDataRef.current = watchTimeData;
    } else {
      // New video, initialize with zero state
      setCurrentWatchTime(0);
      setHasCalledAPI(false);
      setLastPosition(0);
      startTrackingPositionRef.current = 0; // Start tracking from 0
      savedWatchTimeRef.current = 0; // No saved watch time for new video
      hasCalledApiForVideoRef.current = null;
      lastWatchTimeDataRef.current = null;
    }

    // Allow updates after a brief delay to ensure state is settled
    setTimeout(() => {
      if (currentVideoIdRef.current === video.id) {
        isSwitchingVideoRef.current = false;
      }
    }, 100);

    // Fallback: Hide loading after 8 seconds if callbacks don't fire
    const timeoutId = setTimeout(() => {
      // Double-check we're still on the same video before hiding loading
      if (currentVideoIdRef.current === video.id) {
        setIsLoading(false);
      }
    }, 8000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [video, watchTimeData]); // Include video and watchTimeData to properly restore state

  // Update watch time data when it changes (without resetting loading)
  // Use ref to track last processed watchTimeData to prevent infinite loops
  const lastWatchTimeDataRef = useRef<VideoWatchTime | null>(null);
  useEffect(() => {
    // Don't update if we're switching videos or video not initialized
    if (!video || initializedVideoIdRef.current !== video.id || isSwitchingVideoRef.current) return;

    // Track current video ID to prevent stale updates
    currentVideoIdRef.current = video.id;

    // Only update if watchTimeData actually changed (by value, not reference)
    // AND it's for the current video (prevent stale data from previous video)
    if (watchTimeData && currentVideoIdRef.current === video.id && !isSwitchingVideoRef.current) {
      const lastData = lastWatchTimeDataRef.current;
      if (
        !lastData ||
        lastData.watchTime !== watchTimeData.watchTime ||
        lastData.hasCalledAPI !== watchTimeData.hasCalledAPI ||
        lastData.lastPosition !== watchTimeData.lastPosition
      ) {
        // Only update if we're not in the middle of switching
        const savedWatchTime = watchTimeData.watchTime;
        const savedLastPosition = watchTimeData.lastPosition;

        setCurrentWatchTime(savedWatchTime);
        setLastPosition(savedLastPosition);
        // Update starting position to saved position
        startTrackingPositionRef.current = savedLastPosition;
        savedWatchTimeRef.current = savedWatchTime; // Update saved watch time

        // CRITICAL: Only update hasCalledAPI from parent if:
        // 1. Parent says it's true (API was called), OR
        // 2. We haven't called API for this video yet locally
        // This prevents parent from resetting our API call status
        if (watchTimeData.hasCalledAPI) {
          setHasCalledAPI(true);
          hasCalledApiForVideoRef.current = video.id;
        } else if (hasCalledApiForVideoRef.current !== video.id) {
          // Only set to false if we haven't called API for this video
          setHasCalledAPI(false);
        }
        lastWatchTimeDataRef.current = watchTimeData;
      }
    }
  }, [watchTimeData, video]);

  // Handle tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabVisibleRef.current = !document.hidden;
      if (document.hidden && intervalRef.current) {
        // Pause tracking when tab is hidden
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Save watch time to parent when it changes (using ref to avoid infinite loops)
  const onWatchTimeUpdateRef = useRef(onWatchTimeUpdate);
  useEffect(() => {
    onWatchTimeUpdateRef.current = onWatchTimeUpdate;
  }, [onWatchTimeUpdate]);

  // Throttle watch time updates to prevent infinite loops
  const lastUpdateRef = useRef<{ watchTime: number, hasCalledAPI: boolean, lastPosition: number } | null>(null);
  useEffect(() => {
    // Don't update if switching videos
    if (
      !video ||
      !isOpen ||
      initializedVideoIdRef.current !== video.id ||
      currentVideoIdRef.current !== video.id ||
      isSwitchingVideoRef.current
    ) {
      return;
    }

    const updateData = {
      watchTime: currentWatchTime,
      hasCalledAPI,
      lastPosition,
    };

    // Only update if values actually changed
    const lastUpdate = lastUpdateRef.current;
    if (
      !lastUpdate ||
      lastUpdate.watchTime !== updateData.watchTime ||
      lastUpdate.hasCalledAPI !== updateData.hasCalledAPI ||
      lastUpdate.lastPosition !== updateData.lastPosition
    ) {
      onWatchTimeUpdateRef.current(video.id, updateData);
      lastUpdateRef.current = updateData;
    }
  }, [video, currentWatchTime, hasCalledAPI, lastPosition, isOpen]);

  // Call API when threshold is reached (using refs to prevent infinite loops)
  const onApiCallRef = useRef(onApiCall);
  const tWatchCompleteRef = useRef(t.watchComplete);
  useEffect(() => {
    onApiCallRef.current = onApiCall;
  }, [onApiCall]);
  useEffect(() => {
    tWatchCompleteRef.current = t.watchComplete;
  }, [t.watchComplete]);

  const apiCallInProgressRef = useRef(false);
  const hasCalledApiForVideoRef = useRef<number | null>(null); // Track which video we called API for
  useEffect(() => {
    if (
      currentWatchTime >= MIN_WATCH_SECONDS &&
      !hasCalledAPI &&
      !apiCallInProgressRef.current &&
      video &&
      isOpen &&
      initializedVideoIdRef.current === video.id &&
      hasCalledApiForVideoRef.current !== video.id // Prevent multiple calls for same video
    ) {
      // Stop interval tracking once we reach 20 seconds
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      apiCallInProgressRef.current = true;
      hasCalledApiForVideoRef.current = video.id; // Mark this video as API called
      setHasCalledAPI(true);
      onApiCallRef.current(video.id)
        .then(() => {
          toast.success(
            tWatchCompleteRef.current.replace("{points}", String(video.points || 0))
          );
          apiCallInProgressRef.current = false;
        })
        .catch((err) => {
          console.error("Error calling API:", err);
          // Only reset if this is still the current video
          if (currentVideoIdRef.current === video.id) {
            setHasCalledAPI(false); // Reset on error to allow retry
            hasCalledApiForVideoRef.current = null; // Allow retry for this video
          }
          apiCallInProgressRef.current = false;
        });
    }
  }, [currentWatchTime, hasCalledAPI, video, isOpen]);

  // Handle video progress
  const handleProgress = useCallback(
    (state: { playedSeconds: number; played: number; loadedSeconds: number; loaded: number }) => {
      // Don't track if switching videos or conditions not met
      if (
        !video ||
        !isTabVisibleRef.current ||
        !isPlayingRef.current ||
        !isVideoReadyRef.current ||
        currentVideoIdRef.current !== video.id ||
        isSwitchingVideoRef.current
      ) {
        return;
      }

      // Stop tracking if we've already reached 20 seconds
      if (currentWatchTime >= MIN_WATCH_SECONDS) {
        return;
      }

      const currentPosition = state.playedSeconds;

      // Only track if video is playing forward (prevent rewinding abuse)
      if (currentPosition >= lastPosition) {
        // Calculate watch time based on how far we've progressed from start tracking position
        // Formula: savedWatchTime + (currentPosition - savedLastPosition)
        // This ensures we continue from where we left off when resuming
        const positionDiff = currentPosition - startTrackingPositionRef.current;
        const newWatchTime = savedWatchTimeRef.current + positionDiff;

        // Cap watch time at MIN_WATCH_SECONDS (20 seconds) - stop tracking once reached
        if (newWatchTime > currentWatchTime && newWatchTime <= MIN_WATCH_SECONDS) {
          setCurrentWatchTime(newWatchTime);
        } else if (newWatchTime > MIN_WATCH_SECONDS && currentWatchTime < MIN_WATCH_SECONDS) {
          // Cap at MIN_WATCH_SECONDS when threshold is reached
          setCurrentWatchTime(MIN_WATCH_SECONDS);
          // Stop interval tracking once we reach 20 seconds
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }

      // Always update lastPosition to current position
      setLastPosition(currentPosition);
    },
    [lastPosition, video, currentWatchTime] // Added currentWatchTime to check if we've reached limit
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any;

  // Handle play state
  const handlePlay = useCallback(() => {
    // Verify this is for the current video and video is ready
    // Check both state and ref to ensure video is actually ready
    if (!video || currentVideoIdRef.current !== video.id || !isVideoReady || !isVideoReadyRef.current || isSwitchingVideoRef.current) return;

    // If starting from a saved position, ensure startTrackingPositionRef is set
    // This handles the case where video resumes from saved position
    if (startTrackingPositionRef.current === 0 && lastPosition > 0) {
      startTrackingPositionRef.current = lastPosition;
    }

    setIsPlaying(true);
    isPlayingRef.current = true;
    // Only start interval if video is actually ready and playing
    // Don't start interval during loading - wait for video to be ready
    // Check both state and ref for consistency
    if (!intervalRef.current && isTabVisibleRef.current && isVideoReady && isVideoReadyRef.current) {
      // Start interval as backup tracking (in case onProgress doesn't fire)
      // Note: This is a fallback - primary tracking is via handleProgress
      intervalRef.current = setInterval(() => {
        // Double-check video ID, playing state, and ready state using refs
        // This ensures we're checking current values, not stale closure values
        if (
          isTabVisibleRef.current &&
          isPlayingRef.current &&
          isVideoReadyRef.current &&
          currentVideoIdRef.current === video.id &&
          !isSwitchingVideoRef.current
        ) {
          // Use player's current position if available, otherwise estimate
          // This is a fallback, so we increment conservatively
          // Cap at MIN_WATCH_SECONDS (20 seconds) - stop tracking once reached
          setCurrentWatchTime((prev) => {
            if (prev < MIN_WATCH_SECONDS) {
              return Math.min(prev + 0.5, MIN_WATCH_SECONDS); // Increment by 0.5 seconds, cap at 20
            }
            return prev; // Stop incrementing once we reach MIN_WATCH_SECONDS
          });
        } else {
          // If conditions not met, clear interval
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 500);
    }
  }, [video, isVideoReady, lastPosition]); // Include isVideoReady state to check in handlePlay

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    // Clear interval when paused
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      initializedVideoIdRef.current = null; // Reset initialization tracking
      currentVideoIdRef.current = null; // Reset current video tracking
      lastWatchTimeDataRef.current = null;
      lastUpdateRef.current = null;
      apiCallInProgressRef.current = false;
      setIsLoading(true);
      setError(null);
      setIsPlaying(false);
      setIsVideoReady(false); // Reset video ready state
      isVideoReadyRef.current = false; // Reset ref
      isPlayingRef.current = false;
      isSwitchingVideoRef.current = false; // Reset switching flag
      startTrackingPositionRef.current = 0; // Reset start tracking position
      savedWatchTimeRef.current = 0; // Reset saved watch time
      // Clear interval immediately when modal closes
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    if (currentWatchTime < MIN_WATCH_SECONDS && !hasCalledAPI) {
      setShowCloseWarning(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowCloseWarning(false);
    onClose();
  };

  const handleCancelClose = () => {
    setShowCloseWarning(false);
  };

  const handleReady = () => {
    // Verify this is for the current video
    if (!video || currentVideoIdRef.current !== video.id) return;

    setIsLoading(false);
    setError(null);
    setIsVideoReady(true); // Mark video as ready - now progress tracking can start
    isVideoReadyRef.current = true; // Update ref for interval checks

    // If we have a saved position, ensure startTrackingPositionRef is set correctly
    // This handles the case where video resumes from saved position
    if (lastPosition > 0 && startTrackingPositionRef.current === 0) {
      startTrackingPositionRef.current = lastPosition;
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setIsVideoReady(false); // Video not ready on error
    isVideoReadyRef.current = false; // Update ref
    setError(t.videoError);
    // Clear interval on error
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  if (!video) return null;

  const progressPercent = Math.min(
    (currentWatchTime / MIN_WATCH_SECONDS) * 100,
    100
  );

  return (
    <>
      <CustomModal
        isOpen={isOpen}
        onClose={handleClose}
        title={video.title}
        size="xl"
        closeOnBackdropClick={false}
        className="max-w-5xl"
      >
        <div className="p-6">
          {/* Progress Indicator */}
          <div className="mb-4">
            <div
              className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""
                }`}
            >
              <div
                className={`flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""
                  }`}
              >
                <Clock className="w-4 h-4 text-[#C59B48]" />
                <span className="text-[#8A8EA0]">
                  {t.watchProgress.replace(
                    "{seconds}",
                    Math.min(Math.floor(currentWatchTime), MIN_WATCH_SECONDS).toString()
                  )}
                </span>
              </div>
              {hasCalledAPI && (
                <span className="text-sm text-[#45e3d3]">
                  {language === "en" ? "Completed!" : "مكتمل!"}
                </span>
              )}
            </div>
            <Progress value={progressPercent} className="h-2 bg-[#0B0B0D]" />
          </div>

          {/* Video Player */}
          <div className="relative w-full aspect-video bg-[#0B0B0D] rounded-lg overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-[#0ea5e9] animate-spin" />
                  <span className="text-sm text-[#8A8EA0]">{t.videoLoading}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2 text-center p-4">
                  <AlertCircle className="w-8 h-8 text-[#ef4444]" />
                  <span className="text-sm text-[#8A8EA0]">{error}</span>
                  <button
                    onClick={() => {
                      setError(null);
                      setIsLoading(true);
                    }}
                    className="mt-2 text-sm text-[#0ea5e9] hover:underline"
                  >
                    {language === "en" ? "Retry" : "إعادة المحاولة"}
                  </button>
                </div>
              </div>
            )}

            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore - react-player v3.4.0 type definitions issue */}
            <ReactPlayer
              ref={playerRef}
              src={video.link}
              width="100%"
              height="100%"
              playing={isPlaying}
              controls
              onReady={handleReady}
              onError={handleError}
              onPlay={handlePlay}
              onPause={handlePause}
              onProgress={handleProgress}
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    rel: 0,
                  },
                },
                vimeo: {
                  playerOptions: {
                    responsive: true,
                  },
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any}
            />
          </div>

          {/* Fallback for unsupported platforms - only show if video failed to load */}
          {error && (
            <div className="mt-4 text-center">
              <p className="text-xs text-[#8A8EA0] mb-2">
                {language === "en"
                  ? "If video doesn't load, you can"
                  : "إذا لم يتم تحميل الفيديو، يمكنك"}
              </p>
              <a
                href={video.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#0ea5e9] hover:underline"
              >
                {language === "en"
                  ? "Open in new tab"
                  : "فتح في علامة تبويب جديدة"}
              </a>
            </div>
          )}
        </div>
      </CustomModal>

      {/* Close Warning Dialog */}
      <ConfirmationDialog
        isOpen={showCloseWarning}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
        title={language === "en" ? "Close Video?" : "إغلاق الفيديو؟"}
        message={t.closeWarning}
        confirmText={t.close}
        cancelText={t.stay}
        variant="warning"
      />
    </>
  );
}

