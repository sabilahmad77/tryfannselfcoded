import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./button";
import { useLanguage } from "@/contexts/useLanguage";

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

const defaultContent = {
  en: {
    defaultTitle: "Confirm Action",
    defaultMessage: "Are you sure you want to proceed?",
    confirm: "Confirm",
    cancel: "Cancel",
    deleteTitle: "Delete Item",
    deleteMessage: "Are you sure you want to delete this item? This action cannot be undone.",
    deleteConfirm: "Delete",
  },
  ar: {
    defaultTitle: "تأكيد الإجراء",
    defaultMessage: "هل أنت متأكد من المتابعة؟",
    confirm: "تأكيد",
    cancel: "إلغاء",
    deleteTitle: "حذف العنصر",
    deleteMessage: "هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.",
    deleteConfirm: "حذف",
  },
};

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = "warning",
  isLoading = false,
}: ConfirmationDialogProps) {
  const { language } = useLanguage();
  const t = defaultContent[language];
  const isRTL = language === "ar";

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconColor: "text-red-400",
          iconBg: "bg-red-500/20",
          buttonColor:
            "bg-red-500 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/50 text-white border-0 cursor-pointer transition-all duration-200",
        };
      case "warning":
        return {
          iconColor: "text-amber-400",
          iconBg: "bg-amber-500/20",
          buttonColor:
            "bg-amber-500 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/50 text-white border-0 cursor-pointer transition-all duration-200",
        };
      default:
        return {
          iconColor: "text-blue-400",
          iconBg: "bg-blue-500/20",
          buttonColor:
            "bg-blue-500 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/50 text-white border-0 cursor-pointer transition-all duration-200",
        };
    }
  };

  const styles = getVariantStyles();

  // Auto-detect delete variant if title/message contains delete keywords
  const isDeleteAction =
    variant === "danger" ||
    title?.toLowerCase().includes("delete") ||
    message?.toLowerCase().includes("delete");

  const finalTitle = title || (isDeleteAction ? t.deleteTitle : t.defaultTitle);
  const finalMessage =
    message || (isDeleteAction ? t.deleteMessage : t.defaultMessage);
  const finalConfirmText =
    confirmText || (isDeleteAction ? t.deleteConfirm : t.confirm);
  const finalCancelText = cancelText || t.cancel;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl p-6 max-w-md w-full border border-[#334155] shadow-2xl"
      >
        {/* Header */}
        <div
          className={`flex items-start gap-4 mb-4 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div
            className={`${styles.iconBg} rounded-full p-3 shrink-0`}
          >
            <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
          </div>
          <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
            <h3 className="text-xl text-[#fef3c7] mb-2">{finalTitle}</h3>
            <p className="text-sm text-[#cbd5e1]">{finalMessage}</p>
          </div>
        </div>

        {/* Actions */}
        <div
          className={`flex gap-3 mt-6 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isLoading}
            className="flex-1 border-[#334155] hover:bg-[#334155]/30 hover:border-[#475569] text-[#cbd5e1] hover:text-[#fef3c7] transition-all duration-200 cursor-pointer"
          >
            {finalCancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 ${styles.buttonColor} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading
              ? language === "en"
                ? "Processing..."
                : "جاري المعالجة..."
              : finalConfirmText}
          </Button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

