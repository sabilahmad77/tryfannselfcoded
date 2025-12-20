import { AlertCircle, Lock } from "lucide-react";
import { motion } from "motion/react";

export interface ProfileLockedStateProps {
  title: string;
  description: string;
  ctaLabel: string;
  onCta?: () => void;
  isRTL?: boolean;
}

export function ProfileLockedState({
  title,
  description,
  ctaLabel,
  onCta,
  isRTL = false,
}: ProfileLockedStateProps) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-[#0f021c] border-2 border-[#ffb54d]/30 rounded-xl p-8 text-center max-w-sm mx-auto">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffb54d]/20 to-[#ffcc33]/20 rounded-2xl blur-xl" />
          <div className="relative w-full h-full bg-gradient-to-br from-[#ffb54d]/10 to-[#ffcc33]/10 border-2 border-[#ffb54d]/30 rounded-2xl flex items-center justify-center">
            <Lock className="w-12 h-12 text-[#ffb54d]" />
          </div>
        </div>
        <h4 className="text-[#ffffff] mb-2">{title}</h4>
        <p className="text-sm text-[#808c99] mb-6">{description}</p>
        <motion.button
          onClick={onCta}
          className="relative overflow-hidden group w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#ffb54d] to-[#ffcc33] rounded-xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#ffb54d]/0 via-white/20 to-[#ffb54d]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <div
            className={`relative px-6 py-3 flex items-center justify-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <AlertCircle className="w-5 h-5 text-[#020e27]" />
            <span className="text-[#020e27]">{ctaLabel}</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}


