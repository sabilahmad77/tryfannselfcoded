import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import {
  X,
  Loader2,
  Image,
  User,
  Calendar,
  DollarSign,
  Tag,
} from "lucide-react";
import { Button } from "../../ui/button";
import { useLanguage } from "@/contexts/useLanguage";
import { InputField, SelectField } from "../../ui/custom-form-elements";
import { formatDateForInput } from "@/utils/dateUtils";

export interface Artwork {
  id?: number;
  title: string;
  artist: string;
  year: string;
  medium: string;
  acquired: string; // Date in YYYY-MM-DD format for input field
  value: string;
  category: "Contemporary" | "Digital" | "Traditional";
}

interface AddArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (artwork: Artwork) => void;
  isLoading?: boolean;
  initialData?: Artwork | null;
  isEditMode?: boolean;
}

const content = {
  en: {
    addArtworkTitle: "Add Artwork to Collection",
    editArtworkTitle: "Edit Artwork",
    artworkTitle: "Artwork Title",
    artistName: "Artist Name",
    year: "Year",
    medium: "Medium",
    acquisitionDate: "Acquisition Date",
    purchaseValue: "Purchase Value",
    category: "Category",
    cancel: "Cancel",
    addToCollection: "Add to Collection",
    updateArtwork: "Update Artwork",
    placeholder: {
      title: "e.g., Desert Echoes",
      artist: "e.g., Sarah Al-Mansouri",
      medium: "Oil on Canvas",
      acquisitionDate: "Dec 2024",
      purchaseValue: "10000",
    },
    categories: {
      contemporary: "Contemporary",
      digital: "Digital",
      traditional: "Traditional",
    },
  },
  ar: {
    addArtworkTitle: "إضافة عمل فني إلى المجموعة",
    editArtworkTitle: "تعديل العمل الفني",
    artworkTitle: "عنوان العمل الفني",
    artistName: "اسم الفنان",
    year: "السنة",
    medium: "الوسيط",
    acquisitionDate: "تاريخ الاقتناء",
    purchaseValue: "قيمة الشراء",
    category: "الفئة",
    cancel: "إلغاء",
    addToCollection: "إضافة إلى المجموعة",
    updateArtwork: "تحديث العمل الفني",
    placeholder: {
      title: "مثال: أصداء الصحراء",
      artist: "مثال: سارة المنصوري",
      medium: "زيت على قماش",
      acquisitionDate: "ديسمبر ٢٠٢٤",
      purchaseValue: "10000",
    },
    categories: {
      contemporary: "معاصر",
      digital: "رقمي",
      traditional: "تقليدي",
    },
  },
};

export function AddArtworkModal({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  initialData = null,
  isEditMode = false,
}: AddArtworkModalProps) {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    year: "",
    medium: "",
    acquired: "",
    value: "",
    category: "Contemporary" as "Contemporary" | "Digital" | "Traditional",
  });

  // Load initial data when editing
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        title: initialData.title || "",
        artist: initialData.artist || "",
        year: initialData.year || "",
        medium: initialData.medium || "",
        // Ensure date is in YYYY-MM-DD format for input field
        acquired: initialData.acquired ? formatDateForInput(initialData.acquired) : "",
        value: initialData.value || "",
        category: initialData.category || "Contemporary",
      });
    } else {
      // Reset form for add mode
      setFormData({
        title: "",
        artist: "",
        year: "",
        medium: "",
        acquired: "",
        value: "",
        category: "Contemporary",
      });
    }
  }, [isEditMode, initialData, isOpen]);

  const handleSave = () => {
    // Validate required fields
    if (!formData.title || !formData.artist || !formData.year) {
      return; // Basic validation
    }

    // Validate year is a valid number
    const yearNum = parseInt(formData.year);
    if (isNaN(yearNum) || yearNum < 1000 || yearNum > 9999) {
      return; // Invalid year
    }

    onSave({
      id: initialData?.id,
      title: formData.title,
      artist: formData.artist,
      year: formData.year,
      medium: formData.medium,
      acquired: formData.acquired,
      value: formData.value,
      category: formData.category,
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-br from-[#1D112A] to-[#0F021C] rounded-2xl border border-[#ffcc33]/30 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between mb-6 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <h2 className="text-2xl text-[#ffffff]">
            {isEditMode ? t.editArtworkTitle : t.addArtworkTitle}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-[#808c99] hover:text-[#ffffff] transition-colors"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Artwork Title */}
          <InputField
            label={t.artworkTitle}
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder={t.placeholder.title}
            icon={Image}
            isRTL={isRTL}
            required
          />

          {/* Artist Name */}
          <InputField
            label={t.artistName}
            type="text"
            value={formData.artist}
            onChange={(e) =>
              setFormData({ ...formData, artist: e.target.value })
            }
            placeholder={t.placeholder.artist}
            icon={User}
            isRTL={isRTL}
            required
          />

          {/* Year and Medium */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label={t.year}
              type="number"
              min="1000"
              max="9999"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              placeholder="2024"
              icon={Calendar}
              isRTL={isRTL}
              required
            />
            <InputField
              label={t.medium}
              type="text"
              value={formData.medium}
              onChange={(e) =>
                setFormData({ ...formData, medium: e.target.value })
              }
              placeholder={t.placeholder.medium}
              icon={Tag}
              isRTL={isRTL}
            />
          </div>

          {/* Category */}
          <SelectField
            label={t.category}
            value={formData.category}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                category: value as "Contemporary" | "Digital" | "Traditional",
              })
            }
            options={[
              {
                value: "Contemporary",
                label: t.categories.contemporary,
              },
              {
                value: "Digital",
                label: t.categories.digital,
              },
              {
                value: "Traditional",
                label: t.categories.traditional,
              },
            ]}
            placeholder={language === "en" ? "Select category" : "اختر الفئة"}
            icon={Tag}
            isRTL={isRTL}
            contentClassName="z-[10000]"
          />

          {/* Acquisition Date and Value */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label={t.acquisitionDate}
              type="date"
              value={formData.acquired}
              onChange={(e) =>
                setFormData({ ...formData, acquired: e.target.value })
              }
              icon={Calendar}
              isRTL={isRTL}
            />
            <InputField
              label={t.purchaseValue}
              type="number"
              min="0"
              step="0.01"
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: e.target.value })
              }
              placeholder={t.placeholder.purchaseValue}
              icon={DollarSign}
              isRTL={isRTL}
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className={`flex gap-3 mt-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-[#4e4e4e78] hover:bg-[#4e4e4e78]/30 hover:border-[#808c99] text-[#808c99] hover:text-[#ffffff] transition-all duration-200 cursor-pointer"
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !formData.title || !formData.artist || !formData.year || isLoading
            }
            className="flex-1 bg-gradient-to-r from-[#ffcc33] to-[#ffb54d] hover:from-[#e6b800] hover:to-[#e6b800] hover:shadow-lg hover:shadow-[#ffcc33]/50 text-[#0F021C] border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none cursor-pointer transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {language === "en"
                  ? isEditMode
                    ? "Updating..."
                    : "Adding..."
                  : isEditMode
                    ? "جاري التحديث..."
                    : "جاري الإضافة..."}
              </>
            ) : isEditMode ? (
              t.updateArtwork
            ) : (
              t.addToCollection
            )}
          </Button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
