import { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { X, Loader2, User, Briefcase, Award, Image, Mail } from "lucide-react";
import { Button } from "../../ui/button";
import { useLanguage } from "@/contexts/useLanguage";
import { InputField, SelectField } from "../../ui/custom-form-elements";

export interface Artist {
  name: string;
  email: string;
  initials: string;
  specialty: string;
  status: "emerging" | "established";
  artworks: number;
  exhibitions: number;
}

interface AddArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (artist: Omit<Artist, "initials">) => void;
  isLoading?: boolean;
}

const content = {
  en: {
    addNewArtist: "Add New Artist",
    artistName: "Artist Name",
    email: "Email",
    specialty: "Specialty",
    status: "Status",
    artworksCount: "Artworks Count",
    exhibitionsCount: "Exhibitions Count",
    cancel: "Cancel",
    save: "Save",
    placeholder: {
      name: "Enter artist name",
      email: "Enter artist email",
      specialty: "e.g. Contemporary Painting",
    },
  },
  ar: {
    addNewArtist: "إضافة فنان جديد",
    artistName: "اسم الفنان",
    email: "البريد الإلكتروني",
    specialty: "التخصص",
    status: "الحالة",
    artworksCount: "عدد الأعمال",
    exhibitionsCount: "عدد المعارض",
    cancel: "إلغاء",
    save: "حفظ",
    placeholder: {
      name: "أدخل اسم الفنان",
      email: "أدخل البريد الإلكتروني",
      specialty: "مثال: الرسم المعاصر",
    },
  },
};

export function AddArtistModal({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: AddArtistModalProps) {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialty: "",
    status: "emerging" as "emerging" | "established",
    artworks: 0,
    exhibitions: 0,
  });

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.specialty.trim()) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return; // You might want to show an error message here
    }

    onSave({
      name: formData.name,
      email: formData.email.trim(),
      specialty: formData.specialty,
      status: formData.status,
      artworks: formData.artworks,
      exhibitions: formData.exhibitions,
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      specialty: "",
      status: "emerging",
      artworks: 0,
      exhibitions: 0,
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border border-[#334155] shadow-2xl"
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between mb-6 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <h3 className="text-2xl text-[#fef3c7]">{t.addNewArtist}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-[#cbd5e1] hover:text-[#fef3c7] transition-colors"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Artist Name */}
          <InputField
            label={t.artistName}
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t.placeholder.name}
            icon={User}
            isRTL={isRTL}
            required
          />

          {/* Email */}
          <InputField
            label={t.email}
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={t.placeholder.email}
            icon={Mail}
            isRTL={isRTL}
            required
          />

          {/* Specialty */}
          <InputField
            label={t.specialty}
            type="text"
            value={formData.specialty}
            onChange={(e) =>
              setFormData({ ...formData, specialty: e.target.value })
            }
            placeholder={t.placeholder.specialty}
            icon={Briefcase}
            isRTL={isRTL}
            required
          />

          {/* Status */}
          <SelectField
            label={t.status}
            value={formData.status}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                status: value as "emerging" | "established",
              })
            }
            options={[
              {
                value: "emerging",
                label: language === "en" ? "Emerging" : "ناشئ",
              },
              {
                value: "established",
                label: language === "en" ? "Established" : "راسخ",
              },
            ]}
            placeholder={language === "en" ? "Select status" : "اختر الحالة"}
            icon={Award}
            isRTL={isRTL}
            disableClear
            contentClassName="z-[10000]"
          />

          {/* Artworks Count */}
          <InputField
            label={t.artworksCount}
            type="number"
            min="0"
            value={formData.artworks.toString()}
            onChange={(e) =>
              setFormData({
                ...formData,
                artworks: parseInt(e.target.value) || 0,
              })
            }
            placeholder="0"
            icon={Image}
            isRTL={isRTL}
          />

          {/* Exhibitions Count */}
          <InputField
            label={t.exhibitionsCount}
            type="number"
            min="0"
            value={formData.exhibitions.toString()}
            onChange={(e) =>
              setFormData({
                ...formData,
                exhibitions: parseInt(e.target.value) || 0,
              })
            }
            placeholder="0"
            icon={Award}
            isRTL={isRTL}
          />
        </div>

        {/* Action Buttons */}
        <div className={`flex gap-3 mt-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-[#334155] hover:bg-[#334155]/30 hover:border-[#475569] text-[#cbd5e1] hover:text-[#fef3c7] transition-all duration-200 cursor-pointer"
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !formData.name.trim() || !formData.email.trim() || !formData.specialty.trim() || isLoading
            }
            className="flex-1 bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] hover:from-[#0d9488] hover:to-[#0271a8] hover:shadow-lg hover:shadow-[#14b8a6]/50 text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none cursor-pointer transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {language === "en" ? "Saving..." : "جاري الحفظ..."}
              </>
            ) : (
              t.save
            )}
          </Button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
