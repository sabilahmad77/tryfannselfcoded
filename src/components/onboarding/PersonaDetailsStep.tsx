import { Button } from "@/components/ui/button";
import {
  FileUploadField,
  InputField,
  TextareaField,
} from "@/components/ui/custom-form-elements";
import { useProfileSetupMutation } from "@/services/api/onboardingApi";
import { extractErrorMessage } from "@/utils/errorMessages";
import {
  ArrowRight,
  Building2,
  ChevronLeft,
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
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  markStepAsSubmitted,
  selectIsStepSubmitted,
  selectSubmittedData,
} from "@/store/onboardingSlice";
import { setUser, type UserProfileData } from "@/store/authSlice";
import type { OnboardingData } from "./OnboardingFlow";

interface PersonaDetailsStepProps {
  language: "en" | "ar";
  onNext: (data: Record<string, unknown>) => void;
  onBack?: () => void;
  data: OnboardingData;
}

interface PersonaDetailsFormData {
  title: string;
  bio: string;
  website: string;
  instagram_handle: string;
  focus: string;
  years_of_experience: string;
  profile_image: File | null;
}

export function PersonaDetailsStep({
  language,
  onNext,
  onBack,
  data,
}: PersonaDetailsStepProps) {
  const dispatch = useDispatch();
  const isStepSubmitted = useSelector(
    (state: RootState) => selectIsStepSubmitted(state, 1) // Step 1 is PersonaDetailsStep
  );
  const submittedData = useSelector((state: RootState) =>
    selectSubmittedData(state, "personaDetails")
  );
  const storedUser = useSelector((state: RootState) => state.auth.user);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [profileSetup, { isLoading }] = useProfileSetupMutation();

  // Load initial values from Redux
  const savedData = (data.personaDetails ||
    {}) as Partial<PersonaDetailsFormData>;
  const initialValues: PersonaDetailsFormData = {
    title: (savedData.title as string) || "",
    bio: (savedData.bio as string) || "",
    website: (savedData.website as string) || "",
    instagram_handle: (savedData.instagram_handle as string) || "",
    focus: (savedData.focus as string) || "",
    years_of_experience: (savedData.years_of_experience as string) || "",
    profile_image: (savedData.profile_image as File | null) || null,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PersonaDetailsFormData>({
    defaultValues: initialValues,
  });

  // Watch form values to compare with submitted data
  const currentValues = watch();

  // Load profile image and form values from saved data when component mounts or data changes
  useEffect(() => {
    const savedProfileImage = savedData.profile_image;

    // Handle profile image - could be a File, URL string, or null
    if (savedProfileImage) {
      if (savedProfileImage instanceof File) {
        setProfileImage(savedProfileImage);
        setValue("profile_image", savedProfileImage);
        // Create preview URL for File
        const previewUrl = URL.createObjectURL(savedProfileImage);
        setProfileImagePreview(previewUrl);
      } else if (typeof savedProfileImage === "string") {
        // It's a URL, show it but don't set as File
        setProfileImagePreview(savedProfileImage);
        setProfileImage(null);
        setValue("profile_image", null);
      }
    } else {
      setProfileImage(null);
      setProfileImagePreview(null);
      setValue("profile_image", null);
    }

    // Reset form with saved values
    reset({
      title: (savedData.title as string) || "",
      bio: (savedData.bio as string) || "",
      website: (savedData.website as string) || "",
      instagram_handle: (savedData.instagram_handle as string) || "",
      focus: (savedData.focus as string) || "",
      years_of_experience: (savedData.years_of_experience as string) || "",
      profile_image:
        (savedProfileImage instanceof File ? savedProfileImage : null) || null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.personaDetails]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (profileImagePreview && profileImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  // Compare current form values with submitted values
  const hasChanges = () => {
    if (!isStepSubmitted || !submittedData) return true;

    const submitted = submittedData as Partial<PersonaDetailsFormData>;

    // Compare text fields (ignore profile_image for comparison as File objects can't be compared)
    const textFieldsMatch =
      (currentValues.title?.trim() || "") ===
        ((submitted.title as string) || "") &&
      (currentValues.bio?.trim() || "") === ((submitted.bio as string) || "") &&
      (currentValues.website?.trim() || "") ===
        ((submitted.website as string) || "") &&
      (currentValues.instagram_handle?.trim() || "") ===
        ((submitted.instagram_handle as string) || "") &&
      (currentValues.focus?.trim() || "") ===
        ((submitted.focus as string) || "") &&
      (currentValues.years_of_experience?.trim() || "") ===
        ((submitted.years_of_experience as string) || "");

    // Profile image comparison - check if both are null or both are files
    const imageMatch =
      (!profileImage && !submitted.profile_image) ||
      (profileImage &&
        submitted.profile_image &&
        profileImage.name === (submitted.profile_image as File)?.name);

    return !(textFieldsMatch && imageMatch);
  };

  const shouldShowNext = isStepSubmitted && !hasChanges();

  const isRTL = language === "ar";

  const t = {
    en: {
      title: "Tell us about yourself",
      subtitle: "Help us personalize your FANN experience",
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
        instagramPlaceholder: "@yourusername",
        uploadPhoto: "Upload Profile Photo",
        optional: "(Optional)",
        required: "Required fields",
      },
      back: "Back",
      continue: "Continue",
      next: "Next",
    },
    ar: {
      title: "أخبرنا عن نفسك",
      subtitle: "ساعدنا في تخصيص تجربتك في FANN",
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
        instagramPlaceholder: "@yourusername",
        uploadPhoto: "تحميل صورة الملف الشخصي",
        optional: "(اختياري)",
        required: "الحقول المطلوبة",
      },
      back: "رجوع",
      continue: "متابعة",
      next: "التالي",
    },
  };

  const content = t[language];
  const personaContent =
    data.persona && typeof data.persona === "string" && data.persona in content
      ? (content[data.persona as keyof typeof content] as typeof content.artist)
      : content.artist;

  const icons = {
    artist: Palette,
    gallery: Building2,
    collector: Gem,
    curator: UsersIcon,
    investor: TrendingUp,
  };

  const Icon = icons[data.persona as keyof typeof icons] || Palette;

  const onSubmit = async (formData: PersonaDetailsFormData) => {
    // If step was already submitted and no changes, just proceed without API call
    if (shouldShowNext) {
      onNext({ ...formData, profile_image: profileImage });
      return;
    }

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
              ? "Profile setup completed successfully!"
              : "تم إعداد الملف الشخصي بنجاح!";
        }

        toast.success(successMessage);

        // Extract user data from API response
        // API response structure: { success, status_code, message, data: { user: {...} } }
        if (apiResponse.data) {
          try {
            const responseData = apiResponse.data as { user?: UserProfileData };

            // Check if data contains user object
            if (
              responseData.user &&
              typeof responseData.user === "object" &&
              "id" in responseData.user
            ) {
              const userData = responseData.user as UserProfileData;

              // If storedUser exists, merge with form values; otherwise use API data directly
              if (storedUser) {
                // Merge API user data with form values to ensure form updates are preserved
                const mergedUserData: UserProfileData = {
                  ...userData,
                  // Override with form values to ensure they're up to date
                  title: formData.title.trim() || userData.title || null,
                  bio: formData.bio.trim() || userData.bio || null,
                  website: formData.website?.trim()
                    ? (formData.website.trim() as string | string[])
                    : userData.website,
                  instagram_handle:
                    formData.instagram_handle?.trim() ||
                    userData.instagram_handle ||
                    null,
                  focus: formData.focus?.trim() || userData.focus || null,
                  years_of_experience: formData.years_of_experience
                    ? Number(formData.years_of_experience)
                    : userData.years_of_experience || null,
                  // profile_image is already included from userData spread above
                };

                dispatch(setUser(mergedUserData));
              } else {
                // No storedUser (e.g., during onboarding), merge form values with API data
                const mergedUserData: UserProfileData = {
                  ...userData,
                  // Override with form values to ensure they're up to date
                  title: formData.title.trim() || userData.title || null,
                  bio: formData.bio.trim() || userData.bio || null,
                  website: formData.website?.trim()
                    ? (formData.website.trim() as string | string[])
                    : userData.website,
                  instagram_handle:
                    formData.instagram_handle?.trim() ||
                    userData.instagram_handle ||
                    null,
                  focus: formData.focus?.trim() || userData.focus || null,
                  years_of_experience: formData.years_of_experience
                    ? Number(formData.years_of_experience)
                    : userData.years_of_experience || null,
                  // profile_image is already included from userData spread above
                };

                dispatch(setUser(mergedUserData));
              }
            } else if (
              apiResponse.data &&
              typeof apiResponse.data === "object" &&
              "id" in apiResponse.data
            ) {
              // Fallback: API response data might be the user object directly
              const userData = apiResponse.data as unknown as UserProfileData;
              dispatch(setUser(userData));
            }
          } catch (error) {
            console.error(
              "Failed to parse user data from profile setup response:",
              error
            );
          }
        }

        // Mark step as submitted in Redux
        const stepData = { ...formData, profile_image: profileImage };
        dispatch(
          markStepAsSubmitted({
            stepIndex: 1, // PersonaDetailsStep is step 1
            stepKey: "personaDetails",
            data: stepData,
          })
        );

        onNext(stepData);
      } else {
        const errorMessage =
          language === "en"
            ? "Profile setup failed. Please try again."
            : "فشل إعداد الملف الشخصي. يرجى المحاولة مرة أخرى.";
        toast.error(errorMessage);
      }
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, language);
      console.error("Profile setup error:", errorMessage);
    }
  };

  return (
    <div className="glass border border-white/10 rounded-3xl p-8 md:p-12">
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
        <div className="space-y-6">
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
                // Cleanup old preview URL if it was a blob URL
                if (
                  profileImagePreview &&
                  profileImagePreview.startsWith("blob:")
                ) {
                  URL.revokeObjectURL(profileImagePreview);
                }

                setProfileImage(file);
                setValue("profile_image", file);

                // Create preview URL for new file
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  setProfileImagePreview(previewUrl);
                } else {
                  setProfileImagePreview(null);
                }
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
            {/* Show current profile image preview if exists and no new file selected */}
            {profileImagePreview && !profileImage && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-white/60">
                  {language === "en"
                    ? "Current profile image"
                    : "صورة الملف الشخصي الحالية"}
                </p>
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                  <img
                    src={profileImagePreview}
                    alt="Current profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-white/40">
                  {language === "en"
                    ? "Upload new image to replace"
                    : "قم بتحميل صورة جديدة للاستبدال"}
                </p>
              </div>
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
            {onBack && (
              <Button
                type="button"
                onClick={onBack}
                variant="outline"
                disabled={isLoading}
                className="flex-1 h-12 border-white/20 hover:border-amber-500/50 hover:bg-amber-500/10 text-white/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft
                  className={`w-5 h-5 mr-2 ${isRTL ? "rotate-180" : ""}`}
                />
                {content.back}
              </Button>
            )}
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="flex-1 h-12 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black shadow-lg shadow-amber-500/50 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                    {language === "en" ? "Saving..." : "جارٍ الحفظ..."}
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
    </div>
  );
}
