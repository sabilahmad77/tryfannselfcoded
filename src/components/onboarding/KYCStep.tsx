import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileUploadField,
  InputField,
  SelectField,
} from "@/components/ui/custom-form-elements";
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
  gov_issued_id: File | null;
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

  // Load initial values from Redux
  const savedData = (data.kyc || {}) as Partial<KYCFormData>;
  const initialValues: KYCFormData = {
    id_number: (savedData.id_number as string) || "",
    dob: (savedData.dob as string) || "",
    nationality: (savedData.nationality as string) || "",
    city: (savedData.city as string) || "",
    postal_code: (savedData.postal_code as string) || "",
    gov_issued_id: (savedData.gov_issued_id as File | null) || null,
    proof_address: (savedData.proof_address as File | null) || null,
  };

  const [idDocument, setIdDocument] = useState<File | null>(
    initialValues.gov_issued_id
  );
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(
    initialValues.proof_address
  );
  // Restore compliance checkbox state from saved data
  const savedCompliance = (savedData as { acceptedCompliance?: boolean })
    .acceptedCompliance;
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
    const savedComplianceState = (savedData as { acceptedCompliance?: boolean })
      .acceptedCompliance;

    // Restore compliance checkbox
    if (savedComplianceState !== undefined) {
      setAcceptedCompliance(savedComplianceState);
    }

    // Restore ID document
    // Note: File objects can't be serialized in Redux, so we store file names as strings
    // If we have a File object, use it; otherwise, if we have a file name string,
    // we can't recreate the File object, so the user will need to re-upload
    if (savedIdDoc) {
      if (savedIdDoc instanceof File) {
        // If it's a File object (from current session), use it
        setIdDocument(savedIdDoc);
        setValue("gov_issued_id", savedIdDoc);
      } else if (typeof savedIdDoc === "string" && savedIdDoc) {
        // If it's a file name string (from Redux), we can't recreate the File object
        // The file will need to be re-uploaded, but we know a file was previously uploaded
        setIdDocument(null);
        setValue("gov_issued_id", null);
      } else {
        setIdDocument(null);
        setValue("gov_issued_id", null);
      }
    } else {
      setIdDocument(null);
      setValue("gov_issued_id", null);
    }

    // Restore proof of address
    if (savedProof) {
      if (savedProof instanceof File) {
        // If it's a File object (from current session), use it
        setProofOfAddress(savedProof);
        setValue("proof_address", savedProof);
      } else if (typeof savedProof === "string" && savedProof) {
        // If it's a file name string (from Redux), we can't recreate the File object
        // The file will need to be re-uploaded, but we know a file was previously uploaded
        setProofOfAddress(null);
        setValue("proof_address", null);
      } else {
        setProofOfAddress(null);
        setValue("proof_address", null);
      }
    } else {
      setProofOfAddress(null);
      setValue("proof_address", null);
    }

    // Reset form with saved values
    reset({
      id_number: (savedData.id_number as string) || "",
      dob: (savedData.dob as string) || "",
      nationality: (savedData.nationality as string) || "",
      city: (savedData.city as string) || "",
      postal_code: (savedData.postal_code as string) || "",
      gov_issued_id: savedIdDoc instanceof File ? savedIdDoc : null,
      proof_address: savedProof instanceof File ? savedProof : null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.kyc]);

  // Compare current form values with submitted values
  const hasChanges = () => {
    if (!isStepSubmitted || !submittedData) return true;

    const submitted = submittedData as Partial<
      KYCFormData & { acceptedCompliance?: boolean }
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
        ((submitted.postal_code as string) || "");

    // File comparison - check if both are null or both have files with same name
    const idDocMatch =
      (!idDocument && !submitted.gov_issued_id) ||
      (idDocument &&
        submitted.gov_issued_id &&
        (idDocument.name === (submitted.gov_issued_id as unknown as string) ||
          idDocument.name === (submitted.gov_issued_id as unknown as string)));

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
      onNext({
        id_number: formData.id_number,
        dob: formData.dob,
        nationality: formData.nationality,
        city: formData.city,
        postal_code: formData.postal_code,
        gov_issued_id: idDocument?.name || "",
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

        // Mark step as submitted in Redux
        const stepData = {
          id_number: formData.id_number,
          dob: formData.dob,
          nationality: formData.nationality,
          city: formData.city,
          postal_code: formData.postal_code,
          gov_issued_id: idDocument?.name || "",
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
                    language === "en" ? "City is required" : "المدينة مطلوبة",
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
                  setIdDocument(file);
                  setValue("gov_issued_id", file || null);
                }}
                isRTL={isRTL}
                formatText={content.documents.formats}
                buttonText={content.documents.uploadButton}
                buttonClassName="border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10 text-white/70 hover:text-white"
                labelClassName="text-white/80 text-sm"
              />
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
                  setProofOfAddress(file);
                  setValue("proof_address", file || null);
                }}
                isRTL={isRTL}
                formatText={content.documents.formats}
                buttonText={content.documents.uploadButton}
                buttonClassName="border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10 text-white/70 hover:text-white"
                labelClassName="text-white/80 text-sm"
              />
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
