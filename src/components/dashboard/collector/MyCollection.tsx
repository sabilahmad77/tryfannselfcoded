import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Gem,
  TrendingUp,
  Plus,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useLanguage } from "@/contexts/useLanguage";
import { AddArtworkModal, type Artwork } from "./AddArtworkModal";
import { ConfirmationDialog } from "../../ui/ConfirmationDialog";
import {
  useGetArtworkCollectionQuery,
  useCreateArtworkCollectionMutation,
  useUpdateArtworkCollectionMutation,
  useDeleteArtworkCollectionMutation,
  type ArtworkCollection,
} from "@/services/api/dashboardApi";
import { formatDateForDisplay } from "@/utils/dateUtils";

const content = {
  en: {
    title: "My Collection",
    totalPieces: "Total Pieces",
    totalValue: "Portfolio Value",
    growth: "Growth",
    addPiece: "Add Artwork",
    filter: "Filter",
    recent: "Recent Acquisitions",
    pieces: [
      {
        title: "Desert Echoes",
        artist: "Sarah Al-Mansouri",
        year: "2024",
        medium: "Oil on Canvas",
        acquired: "Nov 2024",
        value: "$12,500",
        category: "Contemporary" as const,
      },
      {
        title: "Digital Horizon",
        artist: "Ahmed Hassan",
        year: "2024",
        medium: "Digital Art",
        acquired: "Oct 2024",
        value: "$8,000",
        category: "Digital" as const,
      },
      {
        title: "Urban Reflections",
        artist: "Layla Ibrahim",
        year: "2023",
        medium: "Mixed Media",
        acquired: "Sep 2024",
        value: "$15,000",
        category: "Contemporary" as const,
      },
    ] as Artwork[],
    categories: {
      contemporary: "Contemporary",
      digital: "Digital",
      traditional: "Traditional",
    },
    by: "by",
  },
  ar: {
    title: "مجموعتي",
    totalPieces: "إجمالي القطع",
    totalValue: "قيمة المحفظة",
    growth: "النمو",
    addPiece: "إضافة عمل فني",
    filter: "تصفية",
    recent: "الاقتناءات الأخيرة",
    pieces: [
      {
        title: "أصداء الصحراء",
        artist: "سارة المنصوري",
        year: "٢٠٢٤",
        medium: "زيت على قماش",
        acquired: "نوفمبر ٢٠٢٤",
        value: "١٢,٥٠٠ دولار",
        category: "Contemporary" as const,
      },
      {
        title: "الأفق الرقمي",
        artist: "أحمد حسن",
        year: "٢٠٢٤",
        medium: "فن رقمي",
        acquired: "أكتوبر ٢٠٢٤",
        value: "٨,٠٠٠ دولار",
        category: "Digital" as const,
      },
      {
        title: "انعكاسات المدينة",
        artist: "ليلى إبراهيم",
        year: "٢٠٢٣",
        medium: "وسائط مختلطة",
        acquired: "سبتمبر ٢٠٢٤",
        value: "١٥,٠٠٠ دولار",
        category: "Contemporary" as const,
      },
    ] as Artwork[],
    categories: {
      contemporary: "معاصر",
      digital: "رقمي",
      traditional: "تقليدي",
    },
    by: "بواسطة",
  },
};

export function MyCollection() {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artworkList, setArtworkList] = useState<Artwork[]>([]);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [deletingArtworkId, setDeletingArtworkId] = useState<number | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [artworkToDelete, setArtworkToDelete] = useState<number | null>(null);

  // Fetch artworks from API
  const {
    data: artworksData,
    isLoading: isLoadingArtworks,
    error: artworksError,
  } = useGetArtworkCollectionQuery();

  const [createArtwork, { isLoading: isCreating }] =
    useCreateArtworkCollectionMutation();
  const [updateArtwork, { isLoading: isUpdating }] =
    useUpdateArtworkCollectionMutation();
  const [deleteArtwork, { isLoading: isDeleting }] =
    useDeleteArtworkCollectionMutation();

  // Transform API data to component format
  useEffect(() => {
    if (artworksData?.data) {
      const apiArtworks = Array.isArray(artworksData.data)
        ? artworksData.data
        : [artworksData.data];

      const transformedArtworks: Artwork[] = apiArtworks.map(
        (artwork: ArtworkCollection) => ({
          id: artwork.id,
          title: artwork.title,
          artist: artwork.artist_name,
          year: artwork.year,
          medium: artwork.medium,
          acquired: artwork.acquisition_date || "", // Keep original YYYY-MM-DD format for date input
          value: artwork.purchase_value
            ? artwork.purchase_value.toString()
            : "0",
          category: (artwork.category as "Contemporary" | "Digital" | "Traditional") || "Contemporary",
        })
      );

      setArtworkList(transformedArtworks);
    } else if (!artworksData && !isLoadingArtworks && !artworksError) {
      // Fallback to default data if API returns no data
      setArtworkList(t.pieces);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artworksData, isLoadingArtworks, artworksError]);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "contemporary":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "digital":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    }
  };

  const handleAddArtwork = async (artwork: Artwork) => {
    try {
      const purchaseValue = artwork.value
        ? parseFloat(artwork.value) || 0
        : 0;

      if (artwork.id) {
        // Update existing artwork
        await updateArtwork({
          id: artwork.id,
          data: {
            title: artwork.title,
            artist_name: artwork.artist,
            year: artwork.year,
            medium: artwork.medium,
            category: artwork.category,
            acquisition_date: artwork.acquired || undefined,
            purchase_value: purchaseValue,
          },
        }).unwrap();
      } else {
        // Create new artwork
        await createArtwork({
          title: artwork.title,
          artist_name: artwork.artist,
          year: artwork.year,
          medium: artwork.medium,
          category: artwork.category,
          acquisition_date: artwork.acquired || undefined,
          purchase_value: purchaseValue,
        }).unwrap();
      }
      setIsModalOpen(false);
      setEditingArtwork(null);
    } catch (error) {
      console.error(
        `Failed to ${artwork.id ? "update" : "create"} artwork:`,
        error
      );
      setIsModalOpen(false);
      setEditingArtwork(null);
    }
  };

  const handleEditArtwork = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (artworkId: number) => {
    setArtworkToDelete(artworkId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!artworkToDelete) return;

    try {
      setDeletingArtworkId(artworkToDelete);
      await deleteArtwork(artworkToDelete).unwrap();
      setShowDeleteConfirm(false);
      setArtworkToDelete(null);
    } catch (error) {
      console.error("Failed to delete artwork:", error);
    } finally {
      setDeletingArtworkId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setArtworkToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArtwork(null);
  };

  return (
    <div className="glass rounded-2xl p-6 h-full">
      {/* Header */}
      <div
        className={`flex items-center justify-between mb-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className={`flex items-center gap-3 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#8b5cf6] rounded-xl flex items-center justify-center">
            <Gem className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl text-[#fef3c7]">{t.title}</h2>
        </div>
        <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-[#d4af37] to-[#fbbf24] hover:from-[#b8941f] hover:to-[#d4af37] text-[#0f172a] border-0 cursor-pointer"
          >
            <Plus className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {t.addPiece}
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-[#8b5cf6]/20 to-[#8b5cf6]/5 rounded-xl p-4 border border-[#8b5cf6]/30"
        >
          <div
            className={`flex items-center gap-2 mb-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Gem className="w-4 h-4 text-[#8b5cf6]" />
            <span className="text-xs text-[#cbd5e1]">{t.totalPieces}</span>
          </div>
          <p className="text-2xl text-[#fef3c7]">{artworkList.length}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-[#14b8a6]/20 to-[#14b8a6]/5 rounded-xl p-4 border border-[#14b8a6]/30"
        >
          <div
            className={`flex items-center gap-2 mb-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#14b8a6]" />
            <span className="text-xs text-[#cbd5e1]">{t.totalValue}</span>
          </div>
          <p className="text-2xl text-[#fef3c7]">$35.5K</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 rounded-xl p-4 border border-[#d4af37]/30"
        >
          <div
            className={`flex items-center gap-2 mb-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs text-[#cbd5e1]">{t.growth}</span>
          </div>
          <p className="text-2xl text-emerald-400">+12.5%</p>
        </motion.div>
      </div>

      {/* Recent Acquisitions */}
      <div>
        <h3
          className={`text-sm text-[#cbd5e1] mb-4 ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {t.recent}
        </h3>
        {isLoadingArtworks ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#d4af37] animate-spin" />
          </div>
        ) : artworksError ? (
          <div className="text-center py-8 text-[#cbd5e1]">
            <p className="text-sm">
              {language === "en"
                ? "Failed to load artworks. Showing default data."
                : "فشل تحميل الأعمال الفنية. عرض البيانات الافتراضية."}
            </p>
          </div>
        ) : artworkList.length === 0 ? (
          <div className="text-center py-8 text-[#cbd5e1]">
            <p className="text-sm">
              {language === "en"
                ? "No artworks found. Add your first artwork!"
                : "لم يتم العثور على أعمال فنية. أضف أول عمل فني!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto overflow-x-hidden custom-scrollbar">
            {artworkList.map((piece, index) => (
              <motion.div
                key={piece.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-4 border border-[#334155] hover:border-[#d4af37]/50 transition-all"
              >
                <div
                  className={`flex items-start justify-between ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                    <div
                      className={`flex items-center gap-2 mb-1 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <h3 className="text-[#fef3c7]">{piece.title}</h3>
                      <Badge
                        className={`${getCategoryColor(
                          piece.category
                        )} border text-xs`}
                      >
                        {
                          t.categories[
                            piece.category.toLowerCase() as keyof typeof t.categories
                          ]
                        }
                      </Badge>
                    </div>
                    <p className="text-sm text-[#cbd5e1]">
                      {t.by} {piece.artist} • {piece.year}
                    </p>
                    <p className="text-xs text-[#94a3b8] mt-1">{piece.medium}</p>
                  </div>
                  <div
                    className={`flex items-start gap-3 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className={isRTL ? "text-left" : "text-right"}>
                      <p className="text-lg text-[#d4af37]">
                        ${parseFloat(piece.value || "0").toLocaleString()}
                      </p>
                      <p className="text-xs text-[#94a3b8]">
                        {piece.acquired ? formatDateForDisplay(piece.acquired, language) : ""}
                      </p>
                    </div>
                    <div
                      className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditArtwork(piece);
                        }}
                        disabled={isUpdating || isDeleting}
                        className="p-2 rounded-lg bg-[#14b8a6]/20 hover:bg-[#14b8a6]/40 hover:scale-110 text-[#14b8a6] hover:text-[#0d9488] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        title={language === "en" ? "Edit" : "تعديل"}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (piece.id) handleDeleteClick(piece.id);
                        }}
                        disabled={
                          isDeleting ||
                          deletingArtworkId === piece.id ||
                          !piece.id
                        }
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 hover:scale-110 text-red-400 hover:text-red-300 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        title={language === "en" ? "Delete" : "حذف"}
                      >
                        {deletingArtworkId === piece.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Artwork Modal */}
      <AddArtworkModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddArtwork}
        isLoading={isCreating || isUpdating}
        initialData={editingArtwork}
        isEditMode={!!editingArtwork}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        variant="danger"
        title={
          language === "en"
            ? "Delete Artwork"
            : "حذف العمل الفني"
        }
        message={
          language === "en"
            ? "Are you sure you want to delete this artwork? This action cannot be undone."
            : "هل أنت متأكد من حذف هذا العمل الفني؟ لا يمكن التراجع عن هذا الإجراء."
        }
        confirmText={language === "en" ? "Delete" : "حذف"}
        cancelText={language === "en" ? "Cancel" : "إلغاء"}
        isLoading={isDeleting && deletingArtworkId === artworkToDelete}
      />
    </div>
  );
}
