import { Button } from "@/components/ui/button";
import {
  FileUploadField,
  InputField,
  TextareaField,
} from "@/components/ui/custom-form-elements";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProfileSetupMutation } from "@/services/api/onboardingApi";
import type { RootState } from "@/store/store";
import { updateUser } from "@/store/authSlice";
import { extractErrorMessage } from "@/utils/errorMessages";
import {
  ArrowRight,
  Building2,
  Gem,
  Globe,
  Instagram,
  Palette,
  TrendingUp,
  User,
  Users as UsersIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

interface EditProfileProps {
  open: boolean;
  onClose: () => void;
  language: "en" | "ar";
  initialData?: {
    title?: string;
    bio?: string;
    website?: string;
    instagram_handle?: string;
    focus?: string;
    years_of_experience?: string;
    profile_image?: File | string | null;
    persona?: string;
  };
}

interface EditProfileFormData {
  title: string;
  bio: string;
  website: string;
  instagram_handle: string;
  focus: string;
  years_of_experience: string;
  profile_image: File | null;
}

export function EditProfile({
  open,
  onClose,
  language,
  initialData,
}: EditProfileProps) {
  const dispatch = useDispatch();
  const persona = useSelector((state: RootState) => state.auth.persona) as
    | string
    | null;
  const storedUser = useSelector((state: RootState) => state.auth.user);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profileSetup, { isLoading }] = useProfileSetupMutation();

  const initialValues: EditProfileFormData = {
    title: initialData?.title || "",
    bio: initialData?.bio || "",
    website: initialData?.website || "",
    instagram_handle: initialData?.instagram_handle || "",
    focus: initialData?.focus || "",
    years_of_experience: initialData?.years_of_experience || "",
    profile_image: null,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<EditProfileFormData>({
    defaultValues: initialValues,
  });

  // Load initial values when dialog opens or initialData changes
  useEffect(() => {
    if (open && initialData) {
      reset({
        title: initialData.title || "",
        bio: initialData.bio || "",
        website: initialData.website || "",
        instagram_handle: initialData.instagram_handle || "",
        focus: initialData.focus || "",
        years_of_experience: initialData.years_of_experience || "",
        profile_image: null,
      });

      // Handle profile image - could be a File, URL string, or null
      if (initialData.profile_image) {
        if (initialData.profile_image instanceof File) {
          setProfileImage(initialData.profile_image);
          setValue("profile_image", initialData.profile_image);
          setProfileImageUrl(null);
        } else if (typeof initialData.profile_image === "string") {
          // It's a URL, show it but don't set as File
          setProfileImageUrl(initialData.profile_image);
          setProfileImage(null);
          setValue("profile_image", null);
        }
      } else {
        setProfileImage(null);
        setProfileImageUrl(null);
        setValue("profile_image", null);
      }
    }
  }, [open, initialData, reset, setValue]);

  const isRTL = language === "ar";

  const t = {
    en: {
      title: "Edit Profile",
      subtitle: "Update your profile information",
      artist: {
        displayName: "Artist Name",
        displayNamePlaceholder: "Your professional name",
        bio: "Artist Bio",
        bioPlaceholder: "Tell us about your artistic journey and style...",
        specialization: "Art Medium/Style",
        specializationPlaceholder: "e.g., Contemporary, Abstract, Digital Art",
        experience: "Years of Experience",
        experiencePlaceholder: "5",
      },
      gallery: {
        displayName: "Gallery Name",
        displayNamePlaceholder: "Your gallery's name",
        bio: "Gallery Description",
        bioPlaceholder: "Tell us about your gallery, focus, and vision...",
        specialization: "Gallery Focus",
        specializationPlaceholder: "e.g., Modern Art, Sculpture, Photography",
        experience: "Years in Operation",
        experiencePlaceholder: "10",
        location: "Gallery Location",
        locationPlaceholder: "Dubai, UAE",
      },
      collector: {
        displayName: "Display Name",
        displayNamePlaceholder: "How should we call you?",
        bio: "About Your Collection",
        bioPlaceholder: "What drives your collecting passion?...",
        specialization: "Collection Focus",
        specializationPlaceholder:
          "e.g., MENA Artists, Contemporary Photography",
        experience: "Years Collecting",
        experiencePlaceholder: "7",
      },
      curator: {
        displayName: "Professional Name",
        displayNamePlaceholder: "Your curatorial name",
        bio: "Curatorial Statement",
        bioPlaceholder: "Share your curatorial approach and philosophy...",
        specialization: "Curatorial Expertise",
        specializationPlaceholder: "e.g., Contemporary Art, Cultural Heritage",
        experience: "Years of Experience",
        experiencePlaceholder: "8",
      },
      investor: {
        displayName: "Name/Organization",
        displayNamePlaceholder: "Your name or company",
        bio: "Investment Philosophy",
        bioPlaceholder: "What guides your art investment decisions?...",
        specialization: "Investment Focus",
        specializationPlaceholder: "e.g., Emerging Artists, Blue-chip Art",
        experience: "Years Investing",
        experiencePlaceholder: "5",
      },
      common: {
        website: "Website",
        websitePlaceholder: "https://yourwebsite.com",
        instagram: "Instagram Handle",
        instagramPlaceholder: "@yourusername or https://instagram.com/username",
        uploadPhoto: "Upload Profile Photo",
        optional: "(Optional)",
        required: "Required fields",
      },
      cancel: "Cancel",
      save: "Save Changes",
      saving: "Saving...",
    },
    ar: {
      title: "تعديل الملف الشخصي",
      subtitle: "قم بتحديث معلومات ملفك الشخصي",
      artist: {
        displayName: "اسم الفنان",
        displayNamePlaceholder: "اسمك المهني",
        bio: "السيرة الفنية",
        bioPlaceholder: "أخبرنا عن رحلتك الفنية وأسلوبك...",
        specialization: "الوسيط/الأسلوب الفني",
        specializationPlaceholder: "مثلاً: معاصر، تجريدي، فن رقمي",
        experience: "سنوات الخبرة",
        experiencePlaceholder: "5",
      },
      gallery: {
        displayName: "اسم المعرض",
        displayNamePlaceholder: "اسم معرضك",
        bio: "وصف المعرض",
        bioPlaceholder: "أخبرنا عن معرضك وتركيزك ورؤيتك...",
        specialization: "تركيز المعرض",
        specializationPlaceholder:
          "مثلاً: الفن الحديث، النحت، التصوير الفوتوغرافي",
        experience: "سنوات التشغيل",
        experiencePlaceholder: "10",
        location: "موقع المعرض",
        locationPlaceholder: "دبي، الإمارات",
      },
      collector: {
        displayName: "الاسم المعروض",
        displayNamePlaceholder: "كيف يجب أن نناديك؟",
        bio: "عن مجموعتك",
        bioPlaceholder: "ما الذي يحرك شغفك بالجمع؟...",
        specialization: "تركيز المجموعة",
        specializationPlaceholder:
          "مثلاً: فنانو منطقة الشرق الأوسط، التصوير المعاصر",
        experience: "سنوات الجمع",
        experiencePlaceholder: "7",
      },
      curator: {
        displayName: "الاسم المهني",
        displayNamePlaceholder: "اسمك التنسيقي",
        bio: "البيان التنسيقي",
        bioPlaceholder: "شارك نهجك وفلسفتك التنسيقية...",
        specialization: "الخبرة التنسيقية",
        specializationPlaceholder: "مثلاً: الفن المعاصر، التراث الثقافي",
        experience: "سنوات الخبرة",
        experiencePlaceholder: "8",
      },
      investor: {
        displayName: "الاسم/المؤسسة",
        displayNamePlaceholder: "اسمك أو شركتك",
        bio: "فلسفة الاستثمار",
        bioPlaceholder: "ما الذي يوجه قرارات استثمارك الفني؟...",
        specialization: "تركيز الاستثمار",
        specializationPlaceholder: "مثلاً: الفنانون الناشئون، الفن الممتاز",
        experience: "سنوات الاستثمار",
        experiencePlaceholder: "5",
      },
      common: {
        website: "الموقع الإلكتروني",
        websitePlaceholder: "https://yourwebsite.com",
        instagram: "حساب إنستغرام",
        instagramPlaceholder: "@yourusername أو https://instagram.com/username",
        uploadPhoto: "تحميل صورة الملف الشخصي",
        optional: "(اختياري)",
        required: "الحقول المطلوبة",
      },
      cancel: "إلغاء",
      save: "حفظ التغييرات",
      saving: "جارٍ الحفظ...",
    },
  };

  const content = t[language];
  const personaType = (initialData?.persona || persona || "artist") as
    | "artist"
    | "gallery"
    | "collector"
    | "curator"
    | "investor";
  const personaContent =
    personaType in content
      ? (content[personaType as keyof typeof content] as typeof content.artist)
      : content.artist;

  const icons = {
    artist: Palette,
    gallery: Building2,
    collector: Gem,
    curator: UsersIcon,
    investor: TrendingUp,
  };

  const Icon = icons[personaType] || Palette;

  const onSubmit = async (formData: EditProfileFormData) => {
    try {
      const profileData = {
        title: formData.title.trim(),
        bio: formData.bio.trim(),
        website: formData.website?.trim() || undefined,
        instagram_handle: formData.instagram_handle?.trim() || undefined,
        focus: formData.focus?.trim() || undefined,
        years_of_experience: formData.years_of_experience
          ? Number(formData.years_of_experience)
          : undefined,
        profile_image: profileImage || undefined,
      };

      const result = await profileSetup(profileData).unwrap();

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
              ? "Profile updated successfully!"
              : "تم تحديث الملف الشخصي بنجاح!";
        }

        toast.success(successMessage);

        // Update Redux store with the new profile data
        if (storedUser) {
          dispatch(
            updateUser({
              title: formData.title.trim(),
              bio: formData.bio.trim(),
              website: formData.website?.trim() || storedUser.website || null,
              instagram_handle:
                formData.instagram_handle?.trim() ||
                storedUser.instagram_handle ||
                null,
              focus: formData.focus?.trim() || storedUser.focus || null,
              years_of_experience: formData.years_of_experience
                ? Number(formData.years_of_experience)
                : storedUser.years_of_experience || null,
              // Note: profile_image URL will be updated by the API response
              // If the API returns the updated image URL, we should use that
              // For now, we keep the existing image URL if no new file was uploaded
              profile_image: profileImage
                ? null // Will be updated by API response
                : storedUser.profile_image,
            })
          );
        }

        onClose();
      } else {
        const errorMessage =
          language === "en"
            ? "Profile update failed. Please try again."
            : "فشل تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.";
        toast.error(errorMessage);
      }
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, language);
      console.error("Profile update error:", errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar glass border border-white/10 bg-[#0f172a]"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">
            {content.title}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                <Icon className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-3xl text-white mb-2">{content.title}</h2>
              <p className="text-white/60">{content.subtitle}</p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Photo Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <FileUploadField
                  label={content.common.uploadPhoto}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                  value={profileImage}
                  onFileChange={(file) => {
                    setProfileImage(file);
                    setValue("profile_image", file);
                    setProfileImageUrl(null);
                  }}
                  isRTL={isRTL}
                  formatText={
                    language === "en"
                      ? "PNG, JPG up to 5MB"
                      : "PNG، JPG حتى 5 ميجابايت"
                  }
                  labelClassName="text-white/80 text-sm"
                  buttonClassName="border-white/20 hover:border-amber-500/50 hover:bg-amber-500/10 text-white/70 hover:text-white"
                />
                {profileImageUrl && !profileImage && (
                  <p className="text-xs text-white/60 mt-2">
                    {language === "en"
                      ? "Current profile image (upload new to replace)"
                      : "صورة الملف الشخصي الحالية (قم بتحميل صورة جديدة للاستبدال)"}
                  </p>
                )}
              </motion.div>

              {/* Display Name / Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <InputField
                  {...register("title", {
                    required:
                      language === "en"
                        ? "Display name is required"
                        : "اسم العرض مطلوب",
                    minLength: {
                      value: 2,
                      message:
                        language === "en"
                          ? "Name must be at least 2 characters"
                          : "يجب أن يكون الاسم حرفين على الأقل",
                    },
                  })}
                  label={personaContent.displayName}
                  placeholder={personaContent.displayNamePlaceholder}
                  icon={User}
                  isRTL={isRTL}
                  required
                  error={errors.title?.message}
                  inputClassName="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:ring-amber-500/20"
                  labelClassName="text-white/80 text-sm"
                />
              </motion.div>

              {/* Bio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <TextareaField
                  {...register("bio", {
                    required:
                      language === "en"
                        ? "Bio is required"
                        : "السيرة الذاتية مطلوبة",
                    minLength: {
                      value: 10,
                      message:
                        language === "en"
                          ? "Bio must be at least 10 characters"
                          : "يجب أن تكون السيرة الذاتية 10 أحرف على الأقل",
                    },
                  })}
                  label={personaContent.bio}
                  placeholder={personaContent.bioPlaceholder}
                  isRTL={isRTL}
                  required
                  error={errors.bio?.message}
                  inputClassName="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:ring-amber-500/20"
                  labelClassName="text-white/80 text-sm"
                />
              </motion.div>

              {/* Two Column Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Specialization / Focus */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <InputField
                    {...register("focus")}
                    label={personaContent.specialization}
                    placeholder={personaContent.specializationPlaceholder}
                    isRTL={isRTL}
                    error={errors.focus?.message}
                    inputClassName="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:ring-amber-500/20"
                    labelClassName="text-white/80 text-sm"
                  />
                </motion.div>

                {/* Experience */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <InputField
                    {...register("years_of_experience", {
                      pattern: {
                        value: /^\d+$/,
                        message:
                          language === "en"
                            ? "Please enter a valid number"
                            : "يرجى إدخال رقم صحيح",
                      },
                    })}
                    label={personaContent.experience}
                    type="number"
                    placeholder={personaContent.experiencePlaceholder}
                    isRTL={isRTL}
                    error={errors.years_of_experience?.message}
                    inputClassName="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:ring-amber-500/20"
                    labelClassName="text-white/80 text-sm"
                  />
                </motion.div>
              </div>

              {/* Social Links */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Website */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <InputField
                    {...register("website", {
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message:
                          language === "en"
                            ? "Please enter a valid URL"
                            : "يرجى إدخال رابط صحيح",
                      },
                    })}
                    label={content.common.website}
                    type="url"
                    placeholder={content.common.websitePlaceholder}
                    icon={Globe}
                    isRTL={isRTL}
                    error={errors.website?.message}
                    inputClassName="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:ring-amber-500/20"
                    labelClassName="text-white/80 text-sm"
                  />
                </motion.div>

                {/* Instagram */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <InputField
                    {...register("instagram_handle")}
                    label={content.common.instagram}
                    placeholder={content.common.instagramPlaceholder}
                    icon={Instagram}
                    isRTL={isRTL}
                    error={errors.instagram_handle?.message}
                    inputClassName="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:ring-amber-500/20"
                    labelClassName="text-white/80 text-sm"
                  />
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex gap-4 pt-6"
              >
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  disabled={isLoading}
                  className="flex-1 h-12 border-white/20 hover:border-amber-500/50 hover:bg-amber-500/10 text-white/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {content.cancel}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-12 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black shadow-lg shadow-amber-500/50 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                        {content.saving}
                      </>
                    ) : (
                      <>
                        {content.save}
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
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
