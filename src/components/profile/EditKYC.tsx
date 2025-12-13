import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileUploadField,
  InputField,
  SelectField,
} from "@/components/ui/custom-form-elements";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  useKycVerificationMutation,
  type KYCVerificationRequest,
} from "@/services/api/onboardingApi";
import type { RootState } from "@/store/store";
import { updateUser } from "@/store/authSlice";
import { extractErrorMessage } from "@/utils/errorMessages";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle,
  FileText,
  Hash,
  MapPin,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

interface EditKYCProps {
  open: boolean;
  onClose: () => void;
  language: "en" | "ar";
  initialData?: {
    id_number?: string;
    dob?: string;
    nationality?: string;
    city?: string;
    postal_code?: string;
    gov_issued_id?: File | string | null;
    proof_address?: File | string | null;
  };
}

interface KYCFormData {
  id_number: string;
  dob: string;
  nationality: string;
  city: string;
  postal_code: string;
  gov_issued_id: File | null;
  proof_address: File | null;
}

export function EditKYC({
  open,
  onClose,
  language,
  initialData,
}: EditKYCProps) {
  const dispatch = useDispatch();
  const storedUser = useSelector((state: RootState) => state.auth.user);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [idDocumentPreview, setIdDocumentPreview] = useState<string | null>(
    null
  );
  const [proofOfAddressPreview, setProofOfAddressPreview] = useState<
    string | null
  >(null);
  const [acceptedCompliance, setAcceptedCompliance] = useState(false);
  const [kycVerification, { isLoading }] = useKycVerificationMutation();

  const initialValues: KYCFormData = useMemo(
    () => ({
      id_number: initialData?.id_number || "",
      dob: initialData?.dob || "",
      nationality: initialData?.nationality || "",
      city: initialData?.city || "",
      postal_code: initialData?.postal_code || "",
      gov_issued_id: null,
      proof_address: null,
    }),
    [initialData]
  );

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

  // Load initial values when dialog opens or initialData changes
  useEffect(() => {
    if (open && initialData) {
      reset({
        id_number: initialData.id_number || "",
        dob: initialData.dob || "",
        nationality: initialData.nationality || "",
        city: initialData.city || "",
        postal_code: initialData.postal_code || "",
        gov_issued_id: null,
        proof_address: null,
      });

      // Handle ID document - similar to profile image in EditProfile
      if (initialData.gov_issued_id) {
        if (initialData.gov_issued_id instanceof File) {
          // If it's a File object (from current session), use it
          setIdDocument(initialData.gov_issued_id);
          setValue("gov_issued_id", initialData.gov_issued_id);
          // Create preview URL for File
          const previewUrl = URL.createObjectURL(initialData.gov_issued_id);
          setIdDocumentPreview(previewUrl);
        } else if (typeof initialData.gov_issued_id === "string") {
          // If it's a string (URL or filename), show it but don't set as File
          setIdDocumentPreview(initialData.gov_issued_id);
          setIdDocument(null);
          setValue("gov_issued_id", null);
        }
      } else {
        setIdDocument(null);
        setIdDocumentPreview(null);
        setValue("gov_issued_id", null);
      }

      // Handle proof of address - similar to profile image in EditProfile
      if (initialData.proof_address) {
        if (initialData.proof_address instanceof File) {
          // If it's a File object (from current session), use it
          setProofOfAddress(initialData.proof_address);
          setValue("proof_address", initialData.proof_address);
          // Create preview URL for File
          const previewUrl = URL.createObjectURL(initialData.proof_address);
          setProofOfAddressPreview(previewUrl);
        } else if (typeof initialData.proof_address === "string") {
          // If it's a string (URL or filename), show it but don't set as File
          setProofOfAddressPreview(initialData.proof_address);
          setProofOfAddress(null);
          setValue("proof_address", null);
        }
      } else {
        setProofOfAddress(null);
        setProofOfAddressPreview(null);
        setValue("proof_address", null);
      }

      // If we have existing data, assume compliance was already accepted
      if (initialData.id_number || initialData.dob) {
        setAcceptedCompliance(true);
      }
    } else if (open) {
      // Reset form if no initial data
      reset(initialValues);
      setIdDocument(null);
      setProofOfAddress(null);
      setIdDocumentPreview(null);
      setProofOfAddressPreview(null);
      setAcceptedCompliance(false);
    }
  }, [open, initialData, initialValues, reset, setValue]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (idDocumentPreview && idDocumentPreview.startsWith("blob:")) {
        URL.revokeObjectURL(idDocumentPreview);
      }
      if (proofOfAddressPreview && proofOfAddressPreview.startsWith("blob:")) {
        URL.revokeObjectURL(proofOfAddressPreview);
      }
    };
  }, [idDocumentPreview, proofOfAddressPreview]);

  const isRTL = language === "ar";

  const t = {
    en: {
      title: "Edit KYC Information",
      subtitle: "Update your identity verification details",
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
      cancel: "Cancel",
      save: "Save Changes",
      saving: "Saving...",
    },
    ar: {
      title: "تعديل معلومات التحقق من الهوية",
      subtitle: "قم بتحديث تفاصيل التحقق من هويتك",
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
      cancel: "إلغاء",
      save: "حفظ التغييرات",
      saving: "جارٍ الحفظ...",
    },
  };

  const content = t[language];

  const nationalityOptions = content.nationality.options.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  const onSubmit = async (formData: KYCFormData) => {
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
        dob: formData.dob,
        nationality: formData.nationality.trim(),
        city: formData.city.trim(),
        postal_code: formData.postal_code.trim(),
      };

      // Only include document fields if files are attached
      if (idDocument) {
        kycData.gov_issued_id = idDocument;
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
        data?: {
          kyc_verification?: {
            id?: number;
            id_number?: string;
            dob?: string;
            nationality?: string;
            city?: string;
            postal_code?: string;
            gov_issued_id?: string | null;
            proof_address?: string | null;
          };
          user?: unknown;
          [key: string]: unknown;
        };
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
              ? "KYC information updated successfully!"
              : "تم تحديث معلومات التحقق من الهوية بنجاح!";
        }

        toast.success(successMessage);

        // Update user data in Redux with KYC information from API response
        if (storedUser && apiResponse.data?.kyc_verification) {
          const kycVerification = apiResponse.data.kyc_verification;

          dispatch(
            updateUser({
              // Store KYC data as additional properties in user object
              // Using type assertion since KYC fields aren't in UserProfileData interface
              ...({
                kyc_id_number:
                  kycVerification.id_number || formData.id_number.trim(),
                kyc_dob: kycVerification.dob || formData.dob,
                kyc_nationality:
                  kycVerification.nationality || formData.nationality.trim(),
                kyc_city: kycVerification.city || formData.city.trim(),
                kyc_postal_code:
                  kycVerification.postal_code || formData.postal_code.trim(),
                kyc_gov_issued_id: kycVerification.gov_issued_id || null,
                kyc_proof_address: kycVerification.proof_address || null,
              } as Partial<typeof storedUser>),
            })
          );
        } else if (storedUser) {
          // Fallback: if API response doesn't have kyc_verification, use form data
          // Check if API response contains document URLs in alternative format
          let govIdUrl = idDocument?.name || initialData?.gov_issued_id || null;
          let proofUrl =
            proofOfAddress?.name || initialData?.proof_address || null;

          // If API response has document data in alternative format
          if (apiResponse.data) {
            try {
              const responseData = apiResponse.data as {
                gov_issued_id?: string;
                proof_address?: string;
                [key: string]: unknown;
              };
              if (responseData.gov_issued_id) {
                govIdUrl = responseData.gov_issued_id;
              }
              if (responseData.proof_address) {
                proofUrl = responseData.proof_address;
              }
            } catch (error) {
              console.error(
                "Failed to parse document URLs from response:",
                error
              );
            }
          }

          dispatch(
            updateUser({
              // Store KYC data as additional properties in user object
              // Using type assertion since KYC fields aren't in UserProfileData interface
              ...({
                kyc_id_number: formData.id_number.trim(),
                kyc_dob: formData.dob,
                kyc_nationality: formData.nationality.trim(),
                kyc_city: formData.city.trim(),
                kyc_postal_code: formData.postal_code.trim(),
                kyc_gov_issued_id: govIdUrl,
                kyc_proof_address: proofUrl,
              } as Partial<typeof storedUser>),
            })
          );
        }

        onClose();
      } else {
        const errorMessage =
          language === "en"
            ? "KYC update failed. Please try again."
            : "فشل تحديث التحقق من الهوية. يرجى المحاولة مرة أخرى.";
        toast.error(errorMessage);
      }
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err, language);
      console.error("KYC update error:", errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl max-h-[95vh] overflow-y-auto custom-scrollbar glass border border-white/10 bg-[#0F021C] p-8"
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

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    inputClassName="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:ring-amber-500/20"
                    labelClassName="text-white/80 text-sm"
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
                    inputClassName="bg-white/5 border-white/10 text-white focus:border-amber-500/50 focus:ring-amber-500/20"
                    labelClassName="text-white/80 text-sm"
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
                    inputClassName="bg-white/5 border-white/10 text-white focus:border-amber-500/50 focus:ring-amber-500/20"
                    labelClassName="text-white/80 text-sm"
                    contentClassName="bg-[#1D112A] border-white/10"
                    itemClassName="text-white focus:bg-amber-500/10 focus:text-amber-400"
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
                        language === "en"
                          ? "City is required"
                          : "المدينة مطلوبة",
                    })}
                    label={content.city}
                    placeholder={content.cityPlaceholder}
                    icon={MapPin}
                    isRTL={isRTL}
                    required
                    error={errors.city?.message}
                    inputClassName="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:ring-amber-500/20"
                    labelClassName="text-white/80 text-sm"
                  />
                </motion.div>
              </div>

              {/* Postal Code */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
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
                  inputClassName="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:ring-amber-500/20"
                  labelClassName="text-white/80 text-sm"
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

                {/* ID Document */}
                <div className="p-6 rounded-xl glass border border-white/10">
                  <FileUploadField
                    label={content.documents.idDocument.label}
                    helperText={content.documents.idDocument.desc}
                    accept=".pdf,.png,.jpg,.jpeg"
                    maxSize={10 * 1024 * 1024} // 10MB
                    value={idDocument}
                    onFileChange={(file) => {
                      // Cleanup old preview URL if it was a blob URL
                      if (
                        idDocumentPreview &&
                        idDocumentPreview.startsWith("blob:")
                      ) {
                        URL.revokeObjectURL(idDocumentPreview);
                      }

                      setIdDocument(file);
                      setValue("gov_issued_id", file || null);

                      // Create preview URL for new file
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);
                        setIdDocumentPreview(previewUrl);
                      } else {
                        setIdDocumentPreview(null);
                      }
                    }}
                    isRTL={isRTL}
                    formatText={content.documents.formats}
                    buttonText={content.documents.uploadButton}
                    buttonClassName="border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10 text-white/70 hover:text-white"
                    labelClassName="text-white/80 text-sm"
                  />
                  {/* Show current document preview if exists and no new file selected */}
                  {idDocumentPreview && !idDocument && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-white/60">
                        {language === "en"
                          ? "Current document"
                          : "المستند الحالي"}
                      </p>
                      <div className="flex items-center gap-2 p-3 bg-[#1D112A]/50 rounded-lg border border-white/10">
                        <FileText className="w-5 h-5 text-[#45e3d3] shrink-0" />
                        <span className="text-sm text-[#ffffff] flex-1 truncate">
                          {idDocumentPreview.includes("/") ||
                          idDocumentPreview.startsWith("http")
                            ? idDocumentPreview.split("/").pop() || "Document"
                            : idDocumentPreview}
                        </span>
                      </div>
                      <p className="text-xs text-white/40">
                        {language === "en"
                          ? "Upload new document to replace"
                          : "قم بتحميل مستند جديد للاستبدال"}
                      </p>
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
                      // Cleanup old preview URL if it was a blob URL
                      if (
                        proofOfAddressPreview &&
                        proofOfAddressPreview.startsWith("blob:")
                      ) {
                        URL.revokeObjectURL(proofOfAddressPreview);
                      }

                      setProofOfAddress(file);
                      setValue("proof_address", file || null);

                      // Create preview URL for new file
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);
                        setProofOfAddressPreview(previewUrl);
                      } else {
                        setProofOfAddressPreview(null);
                      }
                    }}
                    isRTL={isRTL}
                    formatText={content.documents.formats}
                    buttonText={content.documents.uploadButton}
                    buttonClassName="border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10 text-white/70 hover:text-white"
                    labelClassName="text-white/80 text-sm"
                  />
                  {/* Show current document preview if exists and no new file selected */}
                  {proofOfAddressPreview && !proofOfAddress && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-white/60">
                        {language === "en"
                          ? "Current document"
                          : "المستند الحالي"}
                      </p>
                      <div className="flex items-center gap-2 p-3 bg-[#1D112A]/50 rounded-lg border border-white/10">
                        <FileText className="w-5 h-5 text-[#45e3d3] shrink-0" />
                        <span className="text-sm text-[#ffffff] flex-1 truncate">
                          {proofOfAddressPreview.includes("/") ||
                          proofOfAddressPreview.startsWith("http")
                            ? proofOfAddressPreview.split("/").pop() ||
                              "Document"
                            : proofOfAddressPreview}
                        </span>
                      </div>
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
