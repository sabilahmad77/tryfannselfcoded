import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileUploadField,
  InputField,
  SelectField,
} from "@/components/ui/custom-form-elements";
import { ImagePreviewList } from "@/components/ui/image-preview-list";
import { Label } from "@/components/ui/label";
import {
  useKycVerificationMutation,
  type KYCVerificationRequest,
} from "@/services/api/onboardingApi";
import {
  markStepAsSubmitted,
  selectIsStepSubmitted,
  selectSubmittedData,
} from "@/store/onboardingSlice";
import type { RootState } from "@/store/store";
import { extractErrorMessage } from "@/utils/errorMessages";
import {
  type PreviewItem,
  normalizeToPreviewItems,
  cleanupPreviewUrls,
  getFullImageUrl,
} from "@/utils/filePreviewHelpers";
import { setUser, type UserProfileData } from "@/store/authSlice";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle,
  ChevronLeft,
  FileText,
  Hash,
  MapPin,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import type { OnboardingData } from "./OnboardingFlow";

interface KYCStepProps {
  language: "en" | "ar";
  onNext: (data: Record<string, unknown>) => void;
  onBack?: () => void;
  data: OnboardingData;
}

interface KYCFormData {
  id_number: string;
  dob: string;
  nationality: string;
  city: string;
  postal_code: string;
  street_address: string;
  id_type: string;
  gov_issued_id: File | File[] | null; // For form state only (legacy)
  gov_issued_id_front: File | null; // Front of ID
  gov_issued_id_back: File | null; // Back of ID
  proof_address: File | null;
}

export function KYCStep({ language, onNext, onBack, data }: KYCStepProps) {
  const dispatch = useDispatch();
  const isStepSubmitted = useSelector(
    (state: RootState) => selectIsStepSubmitted(state, 3) // Step 3 is KYCStep
  );
  const submittedData = useSelector((state: RootState) =>
    selectSubmittedData(state, "kyc")
  );
  const storedUser = useSelector((state: RootState) => state.auth.user);

  // Load initial values from Redux
  const savedData = (data.kyc || {}) as Partial<
    KYCFormData & {
      gov_issued_id?: File | File[] | string | string[] | null;
      acceptedCompliance?: boolean;
    }
  >;
  const initialValues: KYCFormData = {
    id_number: (savedData.id_number as string) || "",
    dob: (savedData.dob as string) || "",
    nationality: (savedData.nationality as string) || "",
    city: (savedData.city as string) || "",
    postal_code: (savedData.postal_code as string) || "",
    street_address: (savedData.street_address as string) || "",
    id_type: (savedData.id_type as string) || "",
    gov_issued_id: null,
    gov_issued_id_front: null,
    gov_issued_id_back: null,
    proof_address: null,
  };

  const [idDocumentFront, setIdDocumentFront] = useState<File | null>(null);
  const [idDocumentBack, setIdDocumentBack] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [idDocumentPreviews, setIdDocumentPreviews] = useState<PreviewItem[]>(
    []
  );
  const [proofOfAddressPreviews, setProofOfAddressPreviews] = useState<
    PreviewItem[]
  >([]);
  // Restore compliance checkbox state from saved data
  const savedCompliance = savedData.acceptedCompliance;
  const [acceptedCompliance, setAcceptedCompliance] = useState(
    savedCompliance || false
  );

  const [kycVerification, { isLoading }] = useKycVerificationMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<KYCFormData>({
    defaultValues: initialValues,
  });

  // Watch form values to compare with submitted data
  const currentValues = watch();

  // Load document files and form values from saved data when component mounts or data changes
  useEffect(() => {
    const savedIdDoc = savedData.gov_issued_id;
    const savedProof = savedData.proof_address;
    const savedComplianceState = savedData.acceptedCompliance;

    // Restore compliance checkbox
    if (savedComplianceState !== undefined) {
      setAcceptedCompliance(savedComplianceState);
    }

    // Handle ID documents - support front and back separately
    // API can return: single string, array of strings, or separate front/back fields
    if (savedIdDoc) {
      // Normalize to array for handling
      const idDocs = Array.isArray(savedIdDoc)
        ? savedIdDoc
        : [savedIdDoc];

      const fileDocs: File[] = [];
      const urlDocs: string[] = [];

      idDocs.forEach((doc) => {
        if (doc instanceof File) {
          fileDocs.push(doc);
        } else if (typeof doc === "string" && doc) {
          urlDocs.push(doc);
        }
      });

      if (fileDocs.length > 0) {
        // Map files: first = front, second = back
        setIdDocumentFront(fileDocs[0] || null);
        setIdDocumentBack(fileDocs[1] || null);
        setValue("gov_issued_id_front", fileDocs[0] || null);
        setValue("gov_issued_id_back", fileDocs[1] || null);
        const previews = normalizeToPreviewItems(fileDocs, ["Front", "Back"]);
        setIdDocumentPreviews(previews);
      } else if (urlDocs.length > 0) {
        // Map URLs: first = front, second = back
        setIdDocumentFront(null);
        setIdDocumentBack(null);
        setValue("gov_issued_id_front", null);
        setValue("gov_issued_id_back", null);
        const fullUrls = urlDocs
          .map((url) => getFullImageUrl(url))
          .filter((url): url is string => !!url);
        const previews = normalizeToPreviewItems(fullUrls, ["Front", "Back"]);
        setIdDocumentPreviews(previews);
      } else {
        setIdDocumentFront(null);
        setIdDocumentBack(null);
        setIdDocumentPreviews([]);
        setValue("gov_issued_id_front", null);
        setValue("gov_issued_id_back", null);
      }
    } else {
      setIdDocumentFront(null);
      setIdDocumentBack(null);
      setIdDocumentPreviews([]);
      setValue("gov_issued_id_front", null);
      setValue("gov_issued_id_back", null);
    }

    // Handle proof of address - single file
    if (savedProof) {
      if (savedProof instanceof File) {
        setProofOfAddress(savedProof);
        setValue("proof_address", savedProof);
        const previews = normalizeToPreviewItems(savedProof);
        setProofOfAddressPreviews(previews);
      } else if (typeof savedProof === "string") {
        const fullUrl = getFullImageUrl(savedProof);
        if (fullUrl) {
          const previews = normalizeToPreviewItems(fullUrl);
          setProofOfAddressPreviews(previews);
        } else {
          setProofOfAddressPreviews([]);
        }
        setProofOfAddress(null);
        setValue("proof_address", null);
      }
    } else {
      setProofOfAddress(null);
      setProofOfAddressPreviews([]);
      setValue("proof_address", null);
    }

    // Reset form with saved values
    // Extract File objects for form reset (skip string URLs as they can't be used directly)
    let frontFile: File | null = null;
    let backFile: File | null = null;
    
    if (savedIdDoc instanceof File) {
      frontFile = savedIdDoc;
    } else if (Array.isArray(savedIdDoc)) {
      if (savedIdDoc[0] instanceof File) {
        frontFile = savedIdDoc[0];
      }
      if (savedIdDoc[1] instanceof File) {
        backFile = savedIdDoc[1];
      }
    }
    
    reset({
      id_number: (savedData.id_number as string) || "",
      dob: (savedData.dob as string) || "",
      nationality: (savedData.nationality as string) || "",
      city: (savedData.city as string) || "",
      postal_code: (savedData.postal_code as string) || "",
      street_address: (savedData.street_address as string) || "",
      id_type: (savedData.id_type as string) || "",
      gov_issued_id: null,
      gov_issued_id_front: frontFile,
      gov_issued_id_back: backFile,
      proof_address: savedProof instanceof File ? savedProof : null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.kyc]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      cleanupPreviewUrls(idDocumentPreviews);
      cleanupPreviewUrls(proofOfAddressPreviews);
    };
  }, [idDocumentPreviews, proofOfAddressPreviews]);

  // Compare current form values with submitted values
  const hasChanges = () => {
    if (!isStepSubmitted || !submittedData) return true;

    const submitted = submittedData as Partial<
      KYCFormData & {
        acceptedCompliance?: boolean;
        gov_issued_id?: File | File[] | string | string[] | null;
      }
    >;

    // Compare text fields
    const textFieldsMatch =
      (currentValues.id_number?.trim() || "") ===
        ((submitted.id_number as string) || "") &&
      (currentValues.dob || "") === ((submitted.dob as string) || "") &&
      (currentValues.nationality?.trim() || "") ===
        ((submitted.nationality as string) || "") &&
      (currentValues.city?.trim() || "") ===
        ((submitted.city as string) || "") &&
      (currentValues.postal_code?.trim() || "") ===
        ((submitted.postal_code as string) || "") &&
      (currentValues.street_address?.trim() || "") ===
        ((submitted.street_address as string) || "") &&
      (currentValues.id_type?.trim() || "") ===
        ((submitted.id_type as string) || "");

    // File comparison - check if both are null or both have files with same name
    const submittedIdDocs = submitted.gov_issued_id;
    const submittedIdDocsArray = Array.isArray(submittedIdDocs)
      ? submittedIdDocs
      : submittedIdDocs
        ? [submittedIdDocs]
        : [];

    const submittedFrontName =
      submittedIdDocsArray[0] instanceof File
        ? submittedIdDocsArray[0].name
        : typeof submittedIdDocsArray[0] === "string"
          ? submittedIdDocsArray[0]
          : "";
    const submittedBackName =
      submittedIdDocsArray[1] instanceof File
        ? submittedIdDocsArray[1].name
        : typeof submittedIdDocsArray[1] === "string"
          ? submittedIdDocsArray[1]
          : "";

    // Check if front and back documents match (both null or both have same names)
    const frontMatch =
      (!idDocumentFront && !submittedFrontName) ||
      (idDocumentFront?.name === submittedFrontName && submittedFrontName !== "");
    const backMatch =
      (!idDocumentBack && !submittedBackName) ||
      (idDocumentBack?.name === submittedBackName && submittedBackName !== "");
    const idDocMatch = frontMatch && backMatch;

    const proofMatch =
      (!proofOfAddress && !submitted.proof_address) ||
      (proofOfAddress &&
        submitted.proof_address &&
        (proofOfAddress.name ===
          (submitted.proof_address as unknown as string) ||
          proofOfAddress.name ===
            (submitted.proof_address as unknown as string)));

    // Compare compliance checkbox
    const complianceMatch =
      acceptedCompliance === (submitted.acceptedCompliance || false);

    return !(textFieldsMatch && idDocMatch && proofMatch && complianceMatch);
  };

  const shouldShowNext = isStepSubmitted && !hasChanges();

  const isRTL = language === "ar";

  const t = {
    en: {
      title: "Identity Verification",
      subtitle: "Required for KYC compliance and platform security",
      notice: {
        title: "Why do we need this?",
        points: [
          "Regulatory compliance in MENA/GCC region",
          "Prevent fraud and ensure platform security",
          "Enable high-value transactions",
          "Protect all community members",
        ],
      },
      idNumber: "ID Number",
      idNumberPlaceholder: "Enter your ID number",
      dateOfBirth: "Date of Birth",
      nationality: {
        label: "Nationality",
        placeholder: "Select or enter your nationality",
        options: [
          { value: "Emirati", label: "Emirati" },
          { value: "Saudi", label: "Saudi" },
          { value: "Egyptian", label: "Egyptian" },
          { value: "Lebanese", label: "Lebanese" },
          { value: "Jordanian", label: "Jordanian" },
          { value: "Pakistani", label: "Pakistani" },
          { value: "Indian", label: "Indian" },
          { value: "Other", label: "Other" },
        ],
      },
      city: "City",
      cityPlaceholder: "Your city",
      postalCode: "Postal Code",
      postalCodePlaceholder: "Postal/ZIP code",
      streetAddress: "Street Address",
      streetAddressPlaceholder: "Street and building",
      idType: {
        label: "ID Type",
        placeholder: "Select ID type",
        options: [
          { value: "Passport", label: "Passport" },
          { value: "National ID", label: "National ID" },
          { value: "Emirates ID", label: "Emirates ID" },
          { value: "Iqama (Saudi Residency)", label: "Iqama (Saudi Residency)" },
          { value: "Driver's License", label: "Driver's License" },
        ],
      },
      documents: {
        title: "Upload Documents",
        idDocument: {
          label: "Government-issued ID",
          desc: "Clear photo or scan of your ID (front and back)",
        },
        proofOfAddress: {
          label: "Proof of Address",
          desc: "Utility bill or bank statement (not older than 3 months)",
        },
        uploadButton: "Click to upload",
        formats: "PDF, PNG, JPG up to 10MB",
      },
      compliance: {
        title: "Data Privacy & Compliance",
        text: "I consent to the processing of my personal data for KYC verification purposes and understand that my information will be stored securely in accordance with GDPR and local regulations.",
      },
      security: {
        title: "Your data is secure",
        features: [
          "End-to-end encryption",
          "GDPR compliant",
          "Secure storage",
          "Never shared",
        ],
      },
      skipForNow: "Skip for now (Limited access)",
      back: "Back",
      continue: "Verify & Continue",
      next: "Next",
    },
    ar: {
      title: "التحقق من الهوية",
      subtitle: "مطلوب للامتثال لمعرفة العميل وأمان المنصة",
      notice: {
        title: "لماذا نحتاج هذا؟",
        points: [
          "الامتثال التنظيمي في منطقة الشرق الأوسط وشمال أفريقيا ودول مجلس التعاون الخليجي",
          "منع الاحتيال وضمان أمن المنصة",
          "تمكين المعاملات عالية القيمة",
          "حماية جميع أعضاء المجتمع",
        ],
      },
      idNumber: "رقم الهوية",
      idNumberPlaceholder: "أدخل رقم هويتك",
      dateOfBirth: "تاريخ الميلاد",
      nationality: {
        label: "الجنسية",
        placeholder: "اختر أو أدخل جنسيتك",
        options: [
          { value: "Emirati", label: "إماراتي" },
          { value: "Saudi", label: "سعودي" },
          { value: "Egyptian", label: "مصري" },
          { value: "Lebanese", label: "لبناني" },
          { value: "Jordanian", label: "أردني" },
          { value: "Pakistani", label: "باكستاني" },
          { value: "Indian", label: "هندي" },
          { value: "Other", label: "أخرى" },
        ],
      },
      city: "المدينة",
      cityPlaceholder: "مدينتك",
      postalCode: "الرمز البريدي",
      postalCodePlaceholder: "الرمز البريدي",
      streetAddress: "عنوان الشارع",
      streetAddressPlaceholder: "الشارع والمبنى",
      idType: {
        label: "نوع الهوية",
        placeholder: "اختر نوع الهوية",
        options: [
          { value: "Passport", label: "جواز السفر" },
          { value: "National ID", label: "الهوية الوطنية" },
          { value: "Emirates ID", label: "هوية الإمارات" },
          {
            value: "Iqama (Saudi Residency)",
            label: "الإقامة (إقامة سعودية)",
          },
          { value: "Driver's License", label: "رخصة القيادة" },
        ],
      },
      documents: {
        title: "تحميل المستندات",
        idDocument: {
          label: "هوية صادرة عن الحكومة",
          desc: "صورة واضحة أو مسح ضوئي لهويتك (الأمام والخلف)",
        },
        proofOfAddress: {
          label: "إثبات العنوان",
          desc: "فاتورة المرافق أو كشف حساب بنكي (لا يزيد عمره عن 3 أشهر)",
        },
        uploadButton: "انقر للتحميل",
        formats: "PDF، PNG، JPG حتى 10 ميجابايت",
      },
      compliance: {
        title: "خصوصية البيانات والامتثال",
        text: "أوافق على معالجة بياناتي الشخصية لأغراض التحقق من معرفة العميل وأفهم أن معلوماتي ستُخزن بشكل آمن وفقاً للائحة العامة لحماية البيانات (GDPR) واللوائح المحلية.",
      },
      security: {
        title: "بياناتك آمنة",
        features: [
          "تشفير من طرف إلى طرف",
          "متوافق مع GDPR",
          "تخزين آمن",
          "لن يتم مشاركتها أبداً",
        ],
      },
      skipForNow: "تخطي الآن (وصول محدود)",
      back: "رجوع",
      continue: "التحقق والمتابعة",
      next: "التالي",
    },
  };

  const content = t[language];

  const nationalityOptions = content.nationality.options.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  const onSubmit = async (formData: KYCFormData) => {
    // If step was already submitted and no changes, just proceed without API call
    if (shouldShowNext) {
      const savedIdDocs: string[] = [];
      if (idDocumentFront?.name) savedIdDocs.push(idDocumentFront.name);
      if (idDocumentBack?.name) savedIdDocs.push(idDocumentBack.name);
      
      onNext({
        id_number: formData.id_number,
        dob: formData.dob,
        nationality: formData.nationality,
        city: formData.city,
        postal_code: formData.postal_code,
        street_address: formData.street_address,
        id_type: formData.id_type,
        gov_issued_id:
          savedIdDocs.length === 1
            ? savedIdDocs[0]
            : savedIdDocs.length > 1
              ? savedIdDocs
              : "",
        proof_address: proofOfAddress?.name || "",
        acceptedCompliance: acceptedCompliance, // Include compliance checkbox state
      });
      return;
    }

    if (!acceptedCompliance) {
      toast.error(
        language === "en"
          ? "Please accept the compliance terms"
          : "يرجى قبول شروط الامتثال"
      );
      return;
    }

    try {
      const kycData: KYCVerificationRequest = {
        id_number: formData.id_number.trim(),
        dob: formData.dob, // Format: YYYY-MM-DD (from date input)
        nationality: formData.nationality.trim(),
        city: formData.city.trim(),
        postal_code: formData.postal_code.trim(),
        street_address: formData.street_address.trim(),
        id_type: formData.id_type.trim(),
      };

      // Handle ID documents - send front and back separately
      if (idDocumentFront) {
        kycData.gov_issued_id_front = idDocumentFront;
      }
      if (idDocumentBack) {
        kycData.gov_issued_id_back = idDocumentBack;
      }
      if (proofOfAddress) {
        kycData.proof_address = proofOfAddress;
      }

      const result = await kycVerification(kycData).unwrap();

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
              ? "KYC verification submitted successfully!"
              : "تم تقديم التحقق من الهوية بنجاح!";
        }

        toast.success(successMessage);

        // Check if API response includes updated user data (profile_step may be updated)
        if (apiResponse.data) {
          try {
            const responseData = apiResponse.data as { user?: UserProfileData };

            if (
              responseData.user &&
              typeof responseData.user === "object" &&
              "id" in responseData.user
            ) {
              const userData = responseData.user as UserProfileData;

              // Merge with existing storedUser if available
              if (storedUser) {
                const mergedUserData: UserProfileData = {
                  ...storedUser,
                  ...userData, // API response takes precedence
                };
                dispatch(setUser(mergedUserData));
              } else {
                dispatch(setUser(userData));
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
              "Failed to parse user data from KYC verification response:",
              error
            );
          }
        }

        // Mark step as submitted in Redux
        const savedIdDocs: string[] = [];
        if (idDocumentFront?.name) savedIdDocs.push(idDocumentFront.name);
        if (idDocumentBack?.name) savedIdDocs.push(idDocumentBack.name);

        const stepData = {
          id_number: formData.id_number,
          dob: formData.dob,
          nationality: formData.nationality,
          city: formData.city,
          postal_code: formData.postal_code,
          street_address: formData.street_address,
          id_type: formData.id_type,
          gov_issued_id:
            savedIdDocs.length === 1
              ? savedIdDocs[0]
              : savedIdDocs.length > 1
                ? savedIdDocs
                : "",
          proof_address: proofOfAddress?.name || "",
          acceptedCompliance: acceptedCompliance, // Save compliance checkbox state
        };

        dispatch(
          markStepAsSubmitted({
            stepIndex: 3, // KYCStep is step 3
            stepKey: "kyc",
            data: stepData,
          })
        );

        onNext(stepData);
      } else {
        const errorMessage =
          language === "en"
            ? "KYC verification failed. Please try again."
            : "فشل التحقق من الهوية. يرجى المحاولة مرة أخرى.";
        toast.error(errorMessage);
      }
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, language);
      console.error("KYC verification error:", errorMessage);
    }
  };

  const handleSkip = () => {
    onNext({ skipped: true });
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
            <Shield className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-3xl text-white mb-2">{content.title}</h2>
          <p className="text-white/60">{content.subtitle}</p>
        </motion.div>

        {/* Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 rounded-xl bg-blue-500/10 border border-blue-500/30"
        >
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <h3 className="text-blue-400">{content.notice.title}</h3>
          </div>
          <ul className="space-y-2 ml-8">
            {content.notice.points.map((point, index) => (
              <li
                key={index}
                className="text-white/60 text-sm flex items-start gap-2"
              >
                <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="space-y-6">
          {/* ID Number & Date of Birth */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <InputField
                {...register("id_number", {
                  required:
                    language === "en"
                      ? "ID number is required"
                      : "رقم الهوية مطلوب",
                })}
                label={content.idNumber}
                placeholder={content.idNumberPlaceholder}
                icon={Hash}
                isRTL={isRTL}
                required
                error={errors.id_number?.message}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <InputField
                {...register("dob", {
                  required:
                    language === "en"
                      ? "Date of birth is required"
                      : "تاريخ الميلاد مطلوب",
                })}
                label={content.dateOfBirth}
                type="date"
                icon={Calendar}
                isRTL={isRTL}
                required
                error={errors.dob?.message}
              />
            </motion.div>
          </div>

          {/* Nationality & City */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SelectField
                label={content.nationality.label}
                placeholder={content.nationality.placeholder}
                options={nationalityOptions}
                value={watch("nationality")}
                onValueChange={(value) => {
                  setValue("nationality", value, { shouldValidate: true });
                }}
                isRTL={isRTL}
                required
                error={errors.nationality?.message}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <InputField
                {...register("city", {
                  required:
                    language === "en" ? "City is required" : "المدينة مطلوبة",
                })}
                label={content.city}
                placeholder={content.cityPlaceholder}
                icon={MapPin}
                isRTL={isRTL}
                required
                error={errors.city?.message}
              />
            </motion.div>
          </div>

          {/* Street Address & Postal Code */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <InputField
                {...register("street_address", {
                  required:
                    language === "en"
                      ? "Street address is required"
                      : "عنوان الشارع مطلوب",
                })}
                label={content.streetAddress}
                placeholder={content.streetAddressPlaceholder}
                icon={MapPin}
                isRTL={isRTL}
                required
                error={errors.street_address?.message}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <InputField
                {...register("postal_code", {
                  required:
                    language === "en"
                      ? "Postal code is required"
                      : "الرمز البريدي مطلوب",
                })}
                label={content.postalCode}
                placeholder={content.postalCodePlaceholder}
                icon={Hash}
                isRTL={isRTL}
                required
                error={errors.postal_code?.message}
              />
            </motion.div>
          </div>

          {/* ID Type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <SelectField
              label={content.idType.label}
              placeholder={content.idType.placeholder}
              options={content.idType.options}
              value={watch("id_type")}
              onValueChange={(value) => {
                setValue("id_type", value, { shouldValidate: true });
              }}
              isRTL={isRTL}
              required
              error={errors.id_type?.message}
            />
          </motion.div>

          {/* Document Uploads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <h3 className="text-white text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              {content.documents.title}
            </h3>

            {/* ID Document - Multiple files (Front & Back) */}
            <div className="p-6 rounded-xl glass border border-white/10">
              <FileUploadField
                label={content.documents.idDocument.label}
                helperText={content.documents.idDocument.desc}
                accept=".pdf,.png,.jpg,.jpeg"
                maxSize={10 * 1024 * 1024} // 10MB
                multiple={true}
                maxFiles={2}
                files={[idDocumentFront, idDocumentBack].filter(
                  (f): f is File => f !== null
                )}
                onFilesChange={(files) => {
                  // Cleanup old preview URLs
                  cleanupPreviewUrls(idDocumentPreviews);

                  // Map files: first = front, second = back
                  const front = files[0] || null;
                  const back = files[1] || null;

                  setIdDocumentFront(front);
                  setIdDocumentBack(back);
                  setValue("gov_issued_id_front", front);
                  setValue("gov_issued_id_back", back);

                  // Create preview items for new files
                  if (files.length > 0) {
                    const previews = normalizeToPreviewItems(files, [
                      "Front",
                      "Back",
                    ]);
                    setIdDocumentPreviews(previews);
                  } else {
                    setIdDocumentPreviews([]);
                  }
                }}
                onPreviewChange={(items) => {
                  setIdDocumentPreviews(items);
                }}
                showPreview={false}
                isRTL={isRTL}
                formatText={content.documents.formats}
                buttonText={content.documents.uploadButton}
                buttonClassName="border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10 text-white/70 hover:text-white"
                labelClassName="text-white/80 text-sm"
              />
              {/* Show current document previews if exist and no new files selected */}
              {idDocumentPreviews.length > 0 &&
                !idDocumentFront &&
                !idDocumentBack && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-white/60">
                      {language === "en"
                        ? "Current documents"
                        : "المستندات الحالية"}
                    </p>
                    <ImagePreviewList
                      items={idDocumentPreviews}
                      onRemove={(item) => {
                        // Remove from previews (read-only for existing documents)
                        const newPreviews = idDocumentPreviews.filter(
                          (p) => p.id !== item.id
                        );
                        setIdDocumentPreviews(newPreviews);
                        cleanupPreviewUrls([item]);
                      }}
                      size="md"
                      gridCols={2}
                      showNames={true}
                      itemLabels={["Front", "Back"]}
                      isRTL={isRTL}
                    />
                    <p className="text-xs text-white/40">
                      {language === "en"
                        ? "Upload new documents to replace"
                        : "قم بتحميل مستندات جديدة للاستبدال"}
                    </p>
                  </div>
                )}
              {/* Show previews for newly selected files */}
              {idDocumentPreviews.length > 0 &&
                (idDocumentFront || idDocumentBack) && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-white/60">
                      {language === "en"
                        ? "Selected documents"
                        : "المستندات المحددة"}
                    </p>
                    <ImagePreviewList
                      items={idDocumentPreviews}
                      onRemove={(item) => {
                        // Find and remove the file
                        const index = idDocumentPreviews.findIndex(
                          (p) => p.id === item.id
                        );
                        if (index === 0) {
                          // Remove front
                          setIdDocumentFront(null);
                          setValue("gov_issued_id_front", null);
                        } else if (index === 1) {
                          // Remove back
                          setIdDocumentBack(null);
                          setValue("gov_issued_id_back", null);
                        }
                        const newPreviews = idDocumentPreviews.filter(
                          (p) => p.id !== item.id
                        );
                        setIdDocumentPreviews(newPreviews);
                        cleanupPreviewUrls([item]);
                      }}
                      size="md"
                      gridCols={2}
                      showNames={true}
                      itemLabels={["Front", "Back"]}
                      isRTL={isRTL}
                    />
                  </div>
                )}
            </div>

            {/* Proof of Address */}
            <div className="p-6 rounded-xl glass border border-white/10">
              <FileUploadField
                label={content.documents.proofOfAddress.label}
                helperText={content.documents.proofOfAddress.desc}
                accept=".pdf,.png,.jpg,.jpeg"
                maxSize={10 * 1024 * 1024} // 10MB
                value={proofOfAddress}
                onFileChange={(file) => {
                  // Cleanup old preview URLs
                  cleanupPreviewUrls(proofOfAddressPreviews);

                  setProofOfAddress(file);
                  setValue("proof_address", file || null);

                  // Create preview items for new file
                  if (file) {
                    const previews = normalizeToPreviewItems(file);
                    setProofOfAddressPreviews(previews);
                  } else {
                    setProofOfAddressPreviews([]);
                  }
                }}
                onPreviewChange={(items) => {
                  setProofOfAddressPreviews(items);
                }}
                isRTL={isRTL}
                formatText={content.documents.formats}
                buttonText={content.documents.uploadButton}
                buttonClassName="border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10 text-white/70 hover:text-white"
                labelClassName="text-white/80 text-sm"
              />
              {/* Show current document preview if exists and no new file selected */}
              {proofOfAddressPreviews.length > 0 && !proofOfAddress && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-white/60">
                    {language === "en" ? "Current document" : "المستند الحالي"}
                  </p>
                  <ImagePreviewList
                    items={proofOfAddressPreviews}
                    size="md"
                    showNames={true}
                    isRTL={isRTL}
                  />
                  <p className="text-xs text-white/40">
                    {language === "en"
                      ? "Upload new document to replace"
                      : "قم بتحميل مستند جديد للاستبدال"}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Security Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="p-6 rounded-xl bg-green-500/10 border border-green-500/30"
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-green-400" />
              <h3 className="text-green-400">{content.security.title}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {content.security.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white/60 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Compliance Checkbox */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="p-6 rounded-xl glass border border-white/10"
          >
            <div className="flex items-start gap-3">
              <Checkbox
                id="compliance"
                checked={acceptedCompliance}
                onCheckedChange={(checked: boolean) =>
                  setAcceptedCompliance(checked)
                }
                className="mt-0.5 border-white/20 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
              />
              <div>
                <Label
                  htmlFor="compliance"
                  className="text-white/80 cursor-pointer mb-1 block"
                >
                  {content.compliance.title}
                </Label>
                <p className="text-white/60 text-sm leading-relaxed">
                  {content.compliance.text}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="space-y-4 pt-8"
          >
            <div className="flex gap-4">
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
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading || !acceptedCompliance}
                className="flex-1 h-12 shadow-lg shadow-primary/50 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                      {language === "en" ? "Submitting..." : "جارٍ الإرسال..."}
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
            </div>

            <Button
              type="button"
              onClick={handleSkip}
              variant="ghost"
              disabled={isLoading}
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {content.skipForNow}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
