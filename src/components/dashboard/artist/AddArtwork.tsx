import { useLanguage } from "@/contexts/useLanguage";
import {
  AlertCircle,
  Camera,
  DollarSign,
  Image as ImageIcon,
  Lock,
  Palette,
  Plus,
  Sparkles,
  Trash2,
  Pencil,
  Upload,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateArtworkMutation,
  useGetMyArtworksQuery,
  useUpdateArtworkMutation,
  useDeleteArtworkMutation,
  type ArtworkItem,
} from "@/services/api/artworkApi";
import { Button } from "@/components/ui/button";
import { ArtworkModal, type ArtworkFormValues } from "./ArtworkModal";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

interface AddArtworkProps {
  profileCompleted?: boolean;
  onCompleteProfile?: () => void;
  /** User type to use for artworks (Artist, Gallery, or Collector) */
  userType?: "Artist" | "Gallery" | "Collector";
}

const content = {
  en: {
    title: "Add Artwork",
    subtitle: "Upload your masterpiece",
    uploadImage: "Upload Image",
    artworkTitle: "Artwork Title",
    description: "Description",
    price: "Price (AED)",
    medium: "Medium",
    dimensions: "Dimensions",
    addArtwork: "Add Artwork", // updated button label
    cancel: "Cancel",
    quickAdd: "Quick Add",
    mediamPlaceholder: "Oil on Canvas, Digital...",
    dimensionsPlaceholder: "100 x 80 cm",
    titlePlaceholder: "Enter title",
    descriptionPlaceholder: "Describe your artwork...",
    pricePlaceholder: "0.00",
    success: "Artwork added successfully! +50 points",
    error: "Please fill all required fields",
    imageRequired: "Please upload an image",
    earnPoints: "+50 pts",
    addNew: "Add New Artwork",
    myArtworks: "My Artworks",
    totalUploaded: "Total Uploaded",
    viewAll: "View All",
    delete: "Delete",
    confirmDelete: "Artwork deleted",
    noArtworks: "No artworks yet",
    startAdding: "Start adding your masterpieces",
    profileLocked: "Complete Your Profile",
    unlockFeature: "Complete your profile to unlock artwork uploads",
    completeProfile: "Complete Profile",
    profileRequired: "Please complete your profile to add artworks",
    loading: "Loading artworks...",
    loadError: "Unable to load artworks. Please try again.",
    userType: "User Type",
    noOfArtists: "Artists",
    artist: "Artist",
    gallery: "Gallery",
  },
  ar: {
    title: "إضافة عمل فني",
    subtitle: "ارفع تحفتك الفنية",
    uploadImage: "تحميل الصورة",
    artworkTitle: "عنوان العمل",
    description: "الوصف",
    price: "السعر (درهم)",
    medium: "الوسيط",
    dimensions: "الأبعاد",
    addArtwork: "إضافة عمل فني", // updated button label
    cancel: "إلغاء",
    quickAdd: "إضافة سريعة",
    mediamPlaceholder: "زيت على قماش، رقمي...",
    dimensionsPlaceholder: "100 × 80 سم",
    titlePlaceholder: "أدخل العنوان",
    descriptionPlaceholder: "صف عملك الفني...",
    pricePlaceholder: "0.00",
    success: "تمت إضافة العمل الفني! +50 نقطة",
    error: "يرجى ملء جميع الحقول",
    imageRequired: "يرجى تحميل صورة",
    earnPoints: "+50 نقطة",
    addNew: "إضافة عمل فني جديد",
    myArtworks: "أعمالي الفنية",
    totalUploaded: "المجموع المرفوع",
    viewAll: "عرض الكل",
    delete: "حذف",
    confirmDelete: "تم حذف العمل الفني",
    noArtworks: "لا توجد أعمال فنية حتى الآن",
    startAdding: "ابدأ بإضافة روائعك",
    profileLocked: "أكمل ملفك الشخصي",
    unlockFeature: "أكمل ملفك الشخصي لفتح تحميل الأعمال الفنية",
    completeProfile: "إكمال الملف الشخصي",
    profileRequired: "يرجى إكمال ملفك الشخصي لإضافة أعمال فنية",
    loading: "جارٍ تحميل الأعمال الفنية...",
    loadError: "تعذر تحميل الأعمال الفنية. يرجى المحاولة مرة أخرى.",
    userType: "نوع المستخدم",
    noOfArtists: "فنانين",
    artist: "فنان",
    gallery: "معرض",
  },
};

export function AddArtwork({
  profileCompleted,
  onCompleteProfile,
  userType = "Artist",
}: AddArtworkProps) {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkItem | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ArtworkItem | null>(null);
  const {
    data: artworks,
    isLoading,
    isError,
    refetch,
  } = useGetMyArtworksQuery();
  const [createArtwork, { isLoading: isCreating }] = useCreateArtworkMutation();
  const [updateArtwork, { isLoading: isUpdating }] = useUpdateArtworkMutation();
  const [deleteArtwork, { isLoading: isDeleting }] = useDeleteArtworkMutation();

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedArtwork(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (artwork: ArtworkItem) => {
    setModalMode("edit");
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedArtwork(null);
  };

  const handleCreateSubmit = async (values: ArtworkFormValues) => {
    try {
      const created = await createArtwork({
        title: values.title,
        description: values.description,
        price: values.price,
        medium: values.medium,
        dimensions: values.dimensions,
        image: values.imageFile as File,
        user_type: userType,
        no_artist: values.no_artist || undefined,
      }).unwrap();

      toast.success(t.success);
      void refetch();
      handleModalClose();

      if (import.meta.env.DEV) {
        console.log("Artwork created:", created);
      }
    } catch {
      // Error toast already handled by baseApi
    }
  };

  const handleEditSubmit = async (values: ArtworkFormValues) => {
    if (!selectedArtwork) return;
    try {
      const updated = await updateArtwork({
        id: selectedArtwork.id,
        title: values.title,
        description: values.description,
        price: values.price,
        medium: values.medium,
        dimensions: values.dimensions,
        image: values.imageFile ?? undefined,
        user_type: userType,
        no_artist: values.no_artist || undefined,
      }).unwrap();

      toast.success(
        language === "en"
          ? "Artwork updated successfully"
          : "تم تحديث العمل الفني بنجاح"
      );
      void refetch();
      handleModalClose();

      if (import.meta.env.DEV) {
        console.log("Artwork updated:", updated);
      }
    } catch {
      // Error toast already handled by baseApi
    }
  };

  const handleDeleteClick = (artwork: ArtworkItem) => {
    setDeleteTarget(artwork);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteArtwork(deleteTarget.id).unwrap();
      toast.success(
        language === "en"
          ? "Artwork deleted successfully"
          : "تم حذف العمل الفني بنجاح"
      );
      void refetch();
    } catch {
      // Error toast already handled by baseApi
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleAddClick = () => {
    if (!profileCompleted) {
      toast.error(t.profileRequired);
      return;
    }
    handleOpenCreate();
  };

  return (
    <>
      {/* Main Card */}
      <div className="glass rounded-2xl p-6 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div
          className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""
            }`}
        >
          <div
            className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""
              }`}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ffcc33] to-[#ffb54d] rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-[#020e27]" />
              </div>
              {/* Pulsing glow */}
              <motion.div
                className="absolute inset-0 bg-[#ffcc33]/30 rounded-xl blur-xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Lock overlay if profile not completed */}
              {!profileCompleted && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#ffb54d] to-[#ffcc33] rounded-full flex items-center justify-center border-2 border-[#020e27]">
                  <Lock className="w-3 h-3 text-[#020e27]" />
                </div>
              )}
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <h3 className="text-lg text-[#ffffff]">{t.myArtworks}</h3>
              <p className="text-sm text-[#808c99]">
                {artworks?.length ?? 0}{" "}
                {language === "en" ? "artworks" : "أعمال فنية"}
              </p>
            </div>
          </div>

          {/* Add Button - match primary CTA styling and cursor behavior */}
          <Button
            type="button"
            onClick={handleAddClick}
            disabled={!profileCompleted}
            className="relative overflow-hidden bg-gradient-to-r from-[#ffcc33] to-[#ffb54d] text-[#020e27] px-4 py-2 rounded-xl hover:opacity-90 transition-all group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              className={`relative flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""
                }`}
            >
              {!profileCompleted && <Lock className="w-3 h-3" />}
              <Plus className="w-4 h-4" />
              <span className="text-sm">
                {language === "en" ? "Add Artwork" : "إضافة عمل فني"}
              </span>
            </span>
          </Button>
        </div>

        {/* Artworks Grid or Empty State */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {!profileCompleted ? (
            /* Profile Locked State */
            <div className="h-full flex items-center justify-center">
              <div className="bg-[#0f021c] border-2 border-[#ffb54d]/30 rounded-xl p-8 text-center max-w-sm mx-auto">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ffb54d]/20 to-[#ffcc33]/20 rounded-2xl blur-xl" />
                  <div className="relative w-full h-full bg-gradient-to-br from-[#ffb54d]/10 to-[#ffcc33]/10 border-2 border-[#ffb54d]/30 rounded-2xl flex items-center justify-center">
                    <Lock className="w-12 h-12 text-[#ffb54d]" />
                  </div>
                </div>
                <h4 className="text-[#ffffff] mb-2">{t.profileLocked}</h4>
                <p className="text-sm text-[#808c99] mb-6">{t.unlockFeature}</p>
                <motion.button
                  onClick={onCompleteProfile}
                  className="relative overflow-hidden group w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ffb54d] to-[#ffcc33] rounded-xl" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ffb54d]/0 via-white/20 to-[#ffb54d]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className={`relative px-6 py-3 flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <AlertCircle className="w-5 h-5 text-[#020e27]" />
                    <span className="text-[#020e27]">{t.completeProfile}</span>
                  </div>
                </motion.button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-[#808c99]">{t.loading}</p>
            </div>
          ) : isError ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm text-[#ff6b6b]">{t.loadError}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="border-[#ffcc33]/40 text-[#ffcc33] hover:bg-[#ffcc33]/10"
              >
                {language === "en" ? "Retry" : "إعادة المحاولة"}
              </Button>
            </div>
          ) : !artworks || artworks.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="bg-[#0f021c] border border-[#ffcc33]/20 rounded-xl p-8 text-center max-w-sm mx-auto">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#ffcc33]/10 to-[#45e3d3]/10 border border-[#ffcc33]/30 rounded-2xl flex items-center justify-center">
                  <Upload className="w-10 h-10 text-[#ffcc33]/70" />
                </div>
                <p className="text-[#ffffff] mb-2">{t.noArtworks}</p>
                <p className="text-sm text-[#808c99] mb-4">{t.startAdding}</p>
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#45e3d3]" />
                    <span className="text-sm text-[#45e3d3]">{t.earnPoints}</span>
                  </div>
                  <div className="w-px h-4 bg-[#ffcc33]/30" />
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#ffcc33]" />
                    <span className="text-sm text-[#808c99]">JPG, PNG</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {artworks.map((artwork: ArtworkItem, index: number) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative"
                >
                  {/* Artwork Tile */}
                  <div className="relative overflow-hidden rounded-xl border border-[#ffcc33]/20 bg-[#0f021c] backdrop-blur-sm hover:border-[#ffcc33]/50 transition-all duration-300">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F021C] via-[#0F021C]/40 to-transparent opacity-80" />

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleOpenEdit(artwork)}
                          className="w-10 h-10 bg-[#ffcc33]/90 hover:bg-[#ffcc33] rounded-lg flex items-center justify-center backdrop-blur-sm cursor-pointer"
                        >
                          <Pencil className="w-5 h-5 text-[#020e27]" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteClick(artwork)}
                          className="w-10 h-10 bg-red-500/90 hover:bg-red-500 rounded-lg flex items-center justify-center backdrop-blur-sm cursor-pointer"
                        >
                          <Trash2 className="w-5 h-5 text-white" />
                        </motion.button>
                      </div>

                      {/* New Badge */}
                      {index === artworks.length - 1 && (
                        <div className="absolute top-2 left-2">
                          <div className="px-2 py-1 bg-gradient-to-r from-[#45e3d3] to-[#3bc4b5] rounded-lg flex items-center gap-1 backdrop-blur-sm">
                            <Sparkles className="w-3 h-3 text-white" />
                            <span className="text-xs text-white">New</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info Section */}
                    <div className="p-3 space-y-2">
                      <h4
                        className={`text-sm text-[#ffffff] mb-2 truncate ${isRTL ? "text-right" : "text-left"
                          }`}
                      >
                        {artwork.title}
                      </h4>

                      {/* First Row: Price and Medium */}
                      <div
                        className={`flex items-center justify-between gap-2 ${isRTL ? "flex-row-reverse" : ""
                          }`}
                      >
                        {/* Price */}
                        <div className="flex items-center gap-1 px-2 py-1 bg-[#45e3d3]/10 border border-[#45e3d3]/30 rounded-lg">
                          <DollarSign className="w-3 h-3 text-[#45e3d3]" />
                          <span className="text-xs text-[#45e3d3]">{artwork.price}</span>
                        </div>

                        {/* Medium Badge */}
                        <div className="flex items-center gap-1 px-2 py-1 bg-[#ffcc33]/10 border border-[#ffcc33]/30 rounded-lg max-w-[100px]">
                          <Palette className="w-3 h-3 text-[#ffcc33] flex-shrink-0" />
                          <span className="text-xs text-[#ffcc33] truncate">{artwork.medium}</span>
                        </div>
                      </div>
                    </div>

                    {/* Glow Effect on Hover */}
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#ffcc33]/0 to-[#45e3d3]/0 group-hover:from-[#ffcc33]/10 group-hover:to-[#45e3d3]/10 pointer-events-none transition-all duration-300"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <ArtworkModal
        isOpen={isModalOpen}
        mode={modalMode}
        defaultUserType={userType}
        initialValues={
          modalMode === "edit" && selectedArtwork
            ? {
              title: selectedArtwork.title,
              description: selectedArtwork.description,
              price: selectedArtwork.price,
              medium: selectedArtwork.medium,
              dimensions: selectedArtwork.dimensions,
              user_type: selectedArtwork.user_type || userType,
              no_artist: selectedArtwork.no_artist || "",
            }
            : undefined
        }
        existingImageUrl={
          modalMode === "edit" && selectedArtwork ? selectedArtwork.image : undefined
        }
        onClose={handleModalClose}
        onSubmit={modalMode === "create" ? handleCreateSubmit : handleEditSubmit}
        isSubmitting={modalMode === "create" ? isCreating : isUpdating}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          if (isDeleting) return;
          setIsDeleteDialogOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        variant="danger"
        isLoading={isDeleting}
        title={
          language === "en"
            ? "Delete artwork"
            : "حذف العمل الفني"
        }
        message={
          language === "en"
            ? "Are you sure you want to delete this artwork? This action cannot be undone."
            : "هل أنت متأكد من حذف هذا العمل الفني؟ لا يمكن التراجع عن هذا الإجراء."
        }
      />
    </>
  );
}

