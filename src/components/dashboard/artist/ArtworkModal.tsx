import { useLanguage } from "@/contexts/useLanguage";
import { Camera, DollarSign, Palette, Ruler } from "lucide-react";
import { CustomModal } from "@/components/ui/CustomModal";
import {
  InputField,
  TextareaField,
  FileUploadField,
} from "@/components/ui/custom-form-elements";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export type ArtworkFormValues = {
  title: string;
  description: string;
  price: string;
  medium: string;
  dimensions: string;
  imageFile: File | null;
};

interface ArtworkModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialValues?: Partial<ArtworkFormValues>;
  onClose: () => void;
  onSubmit: (values: ArtworkFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
}

const modalContent = {
  en: {
    titleCreate: "Add Artwork",
    titleEdit: "Edit Artwork",
    uploadImage: "Upload Image",
    artworkTitle: "Artwork Title",
    description: "Description",
    price: "Price (AED)",
    medium: "Medium",
    dimensions: "Dimensions",
    mediamPlaceholder: "Oil on Canvas, Digital...",
    dimensionsPlaceholder: "100 x 80 cm",
    titlePlaceholder: "Enter title",
    descriptionPlaceholder: "Describe your artwork...",
    pricePlaceholder: "0.00",
    imageRequired: "Please upload an image",
    error: "Please fill all required fields",
    save: "Save Changes",
    add: "Add Artwork",
    cancel: "Cancel",
  },
  ar: {
    titleCreate: "إضافة عمل فني",
    titleEdit: "تعديل العمل الفني",
    uploadImage: "تحميل الصورة",
    artworkTitle: "عنوان العمل",
    description: "الوصف",
    price: "السعر (درهم)",
    medium: "الوسيط",
    dimensions: "الأبعاد",
    mediamPlaceholder: "زيت على قماش، رقمي...",
    dimensionsPlaceholder: "100 × 80 سم",
    titlePlaceholder: "أدخل العنوان",
    descriptionPlaceholder: "صف عملك الفني...",
    pricePlaceholder: "0.00",
    imageRequired: "يرجى تحميل صورة",
    error: "يرجى ملء جميع الحقول",
    save: "حفظ التغييرات",
    add: "إضافة عمل فني",
    cancel: "إلغاء",
  },
};

export function ArtworkModal({
  isOpen,
  mode,
  initialValues,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ArtworkModalProps) {
  const { language } = useLanguage();
  const t = modalContent[language];
  const isRTL = language === "ar";

  const [values, setValues] = useState<ArtworkFormValues>({
    title: "",
    description: "",
    price: "",
    medium: "",
    dimensions: "",
    imageFile: null,
  });

  useEffect(() => {
    if (isOpen) {
      setValues({
        title: initialValues?.title ?? "",
        description: initialValues?.description ?? "",
        price: initialValues?.price ?? "",
        medium: initialValues?.medium ?? "",
        dimensions: initialValues?.dimensions ?? "",
        imageFile: null,
      });
    }
  }, [isOpen, initialValues]);

  const handleSubmit = async () => {
    // For create, image is required. For edit, allow without new image.
    if (mode === "create" && !values.imageFile) {
      toast.error(t.imageRequired);
      return;
    }

    if (
      !values.title ||
      !values.description ||
      !values.price ||
      !values.medium ||
      !values.dimensions
    ) {
      toast.error(t.error);
      return;
    }

    await onSubmit(values);
  };

  const title = mode === "create" ? t.titleCreate : t.titleEdit;
  const primaryLabel = mode === "create" ? t.add : t.save;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      headerIcon={Camera}
      size="lg"
      maxHeight="max-h-[90vh]"
    >
      <div className="p-6 space-y-6">
        {/* Image Upload */}
        <FileUploadField
          label={t.uploadImage}
          required={mode === "create"}
          isRTL={isRTL}
          accept="image/*"
          maxSize={10 * 1024 * 1024}
          value={values.imageFile}
          onFileChange={(file) =>
            setValues((prev) => ({
              ...prev,
              imageFile: file,
            }))
          }
          formatText={
            language === "en"
              ? "JPG, PNG up to 10MB"
              : "صور JPG أو PNG حتى 10 ميجابايت"
          }
        />

        {/* Form Fields */}
        <div className="space-y-4">
          <InputField
            label={t.artworkTitle}
            required
            isRTL={isRTL}
            value={values.title}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder={t.titlePlaceholder}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label={t.price}
              required
              isRTL={isRTL}
              type="number"
              icon={DollarSign}
              value={values.price}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, price: e.target.value }))
              }
              placeholder={t.pricePlaceholder}
            />
            <InputField
              label={t.medium}
              required
              isRTL={isRTL}
              icon={Palette}
              value={values.medium}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, medium: e.target.value }))
              }
              placeholder={t.mediamPlaceholder}
            />
          </div>

          <InputField
            label={t.dimensions}
            required
            isRTL={isRTL}
            icon={Ruler}
            value={values.dimensions}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                dimensions: e.target.value,
              }))
            }
            placeholder={t.dimensionsPlaceholder}
          />

          <TextareaField
            label={t.description}
            required
            isRTL={isRTL}
            value={values.description}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder={t.descriptionPlaceholder}
            rows={4}
          />
        </div>

        {/* Actions */}
        <div
          className={`flex gap-3 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-[#ffcc33] to-[#ffb54d] text-[#020e27] hover:opacity-90"
          >
            {isSubmitting
              ? language === "en"
                ? "Saving..."
                : "جارٍ الحفظ..."
              : primaryLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="bg-[#1D112A]/50 border border-[#4e4e4e78] text-[#808c99] hover:bg-[#1D112A]"
          >
            {t.cancel}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}


