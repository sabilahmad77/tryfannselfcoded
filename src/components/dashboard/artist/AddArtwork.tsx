import { useLanguage } from '@/contexts/useLanguage';
import { AlertCircle, Camera, DollarSign, Image as ImageIcon, Lock, Palette, Plus, Ruler, Sparkles, Trash2, Upload, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddArtworkProps {
  profileCompleted?: boolean;
  onCompleteProfile?: () => void;
}

interface Artwork {
  id: string;
  title: string;
  description: string;
  price: string;
  medium: string;
  dimensions: string;
  image: string;
  uploadedAt: Date;
}

const content = {
  en: {
    title: 'Add Artwork',
    subtitle: 'Upload your masterpiece',
    uploadImage: 'Upload Image',
    artworkTitle: 'Artwork Title',
    description: 'Description',
    price: 'Price (AED)',
    medium: 'Medium',
    dimensions: 'Dimensions',
    addArtwork: 'Publish',
    cancel: 'Cancel',
    quickAdd: 'Quick Add',
    dragDrop: 'Drop image here',
    orClick: 'or click to browse',
    mediamPlaceholder: 'Oil on Canvas, Digital...',
    dimensionsPlaceholder: '100 x 80 cm',
    titlePlaceholder: 'Enter title',
    descriptionPlaceholder: 'Describe your artwork...',
    pricePlaceholder: '0.00',
    success: 'Artwork added successfully! +50 points',
    error: 'Please fill all required fields',
    imageRequired: 'Please upload an image',
    earnPoints: '+50 pts',
    addNew: 'Add New Artwork',
    myArtworks: 'My Artworks',
    totalUploaded: 'Total Uploaded',
    viewAll: 'View All',
    delete: 'Delete',
    confirmDelete: 'Artwork deleted',
    noArtworks: 'No artworks yet',
    startAdding: 'Start adding your masterpieces',
    profileLocked: 'Complete Your Profile',
    unlockFeature: 'Complete your profile to unlock artwork uploads',
    completeProfile: 'Complete Profile',
    profileRequired: 'Please complete your profile to add artworks',
  },
  ar: {
    title: 'إضافة عمل فني',
    subtitle: 'ارفع تحفتك الفنية',
    uploadImage: 'تحميل الصورة',
    artworkTitle: 'عنوان العمل',
    description: 'الوصف',
    price: 'السعر (درهم)',
    medium: 'الوسيط',
    dimensions: 'الأبعاد',
    addArtwork: 'نشر',
    cancel: 'إلغاء',
    quickAdd: 'إضافة سريعة',
    dragDrop: 'أفلت الصورة هنا',
    orClick: 'أو انقر للتصفح',
    mediamPlaceholder: 'زيت على قماش، رقمي...',
    dimensionsPlaceholder: '100 × 80 سم',
    titlePlaceholder: 'أدخل العنوان',
    descriptionPlaceholder: 'صف عملك الفني...',
    pricePlaceholder: '0.00',
    success: 'تمت إضافة العمل الفني! +50 نقطة',
    error: 'يرجى ملء جميع الحقول',
    imageRequired: 'يرجى تحميل صورة',
    earnPoints: '+50 نقطة',
    addNew: 'إضافة عمل فني جديد',
    myArtworks: 'أعمالي الفنية',
    totalUploaded: 'المجموع المرفوع',
    viewAll: 'عرض الكل',
    delete: 'حذف',
    confirmDelete: 'تم حذف العمل الفني',
    noArtworks: 'لا توجد أعمال فنية حتى الآن',
    startAdding: 'ابدأ بإضافة روائعك',
    profileLocked: 'أكمل ملفك الشخصي',
    unlockFeature: 'أكمل ملفك الشخصي لفتح تحميل الأعمال الفنية',
    completeProfile: 'إكمال الملف الشخصي',
    profileRequired: 'يرجى إكمال ملفك الشخصي لإضافة أعمال فنية',
  }
};

export function AddArtwork({ profileCompleted, onCompleteProfile }: AddArtworkProps) {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === 'ar';
  const [showModal, setShowModal] = useState(false);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    medium: '',
    dimensions: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = () => {
    if (!imagePreview) {
      toast.error(t.imageRequired);
      return;
    }

    if (!formData.title || !formData.description || !formData.price || !formData.medium || !formData.dimensions) {
      toast.error(t.error);
      return;
    }

    // Simulate artwork submission
    toast.success(t.success);

    // Add artwork to the list
    const newArtwork: Artwork = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      price: formData.price,
      medium: formData.medium,
      dimensions: formData.dimensions,
      image: imagePreview,
      uploadedAt: new Date(),
    };
    setArtworks([...artworks, newArtwork]);

    // Reset form
    setFormData({
      title: '',
      description: '',
      price: '',
      medium: '',
      dimensions: '',
    });
    setImagePreview(null);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    setFormData({
      title: '',
      description: '',
      price: '',
      medium: '',
      dimensions: '',
    });
    setImagePreview(null);
  };

  const handleDelete = (id: string) => {
    setArtworks(artworks.filter(artwork => artwork.id !== id));
    toast.success(t.confirmDelete);
  };

  const handleAddClick = () => {
    if (!profileCompleted) {
      toast.error(t.profileRequired);
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      {/* Main Card */}
      <div className="glass rounded-2xl p-6 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h3 className="text-lg text-[#ffffff]">{t.myArtworks}</h3>
              <p className="text-sm text-[#808c99]">
                {artworks.length} {language === 'en' ? 'artworks' : 'أعمال فنية'}
              </p>
            </div>
          </div>

          {/* Add Button (Small) */}
          <motion.button
            onClick={handleAddClick}
            className={`relative overflow-hidden group ${!profileCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={profileCompleted ? { scale: 1.05 } : {}}
            whileTap={profileCompleted ? { scale: 0.95 } : {}}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#ffcc33] to-[#45e3d3] rounded-xl" />
            {profileCompleted && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#ffcc33]/0 via-white/20 to-[#ffcc33]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            )}
            <div className={`relative px-4 py-2 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {!profileCompleted && <Lock className="w-3 h-3 text-white" />}
              <Plus className="w-4 h-4 text-white" />
              <span className="text-sm text-white">{language === 'en' ? 'Add' : 'إضافة'}</span>
            </div>
          </motion.button>
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
          ) : artworks.length === 0 ? (
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
              {artworks.map((artwork, index) => (
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
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(artwork.id)}
                          className="w-10 h-10 bg-red-500/90 hover:bg-red-500 rounded-lg flex items-center justify-center backdrop-blur-sm"
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
                    <div className="p-3">
                      <h4 className={`text-sm text-[#ffffff] mb-2 truncate ${isRTL ? 'text-right' : 'text-left'}`}>
                        {artwork.title}
                      </h4>

                      <div className={`flex items-center justify-between gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
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

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="glass border border-[#ffcc33]/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                dir={isRTL ? 'rtl' : 'ltr'}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-[#0F021C]/95 backdrop-blur-lg border-b border-[#ffcc33]/20 p-6 z-10">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 bg-gradient-to-br from-[#ffcc33] to-[#ffb54d] rounded-xl flex items-center justify-center">
                        <Camera className="w-6 h-6 text-[#020e27]" />
                      </div>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h3 className="text-xl text-[#ffffff]">{t.title}</h3>
                        <p className="text-sm text-[#808c99]">{t.subtitle}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleCancel}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1D112A]/50 hover:bg-[#1D112A] transition-colors"
                    >
                      <X className="w-5 h-5 text-[#808c99]" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  {/* Image Upload Area */}
                  <div
                    className={`relative mb-6 border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300 ${isDragging
                        ? 'border-[#ffcc33] bg-[#ffcc33]/5'
                        : 'border-[#ffcc33]/30 hover:border-[#ffcc33]/50'
                      }`}
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                  >
                    {imagePreview ? (
                      <div className="relative aspect-video">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setImagePreview(null)}
                          className="absolute top-3 right-3 w-10 h-10 bg-red-500/90 hover:bg-red-500 rounded-xl flex items-center justify-center transition-colors backdrop-blur-sm"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center py-16 cursor-pointer">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#ffcc33]/20 to-[#45e3d3]/20 border border-[#ffcc33]/30 rounded-2xl flex items-center justify-center mb-4">
                          <Upload className="w-10 h-10 text-[#ffcc33]" />
                        </div>
                        <p className="text-[#ffffff] mb-2">{t.dragDrop}</p>
                        <p className="text-sm text-[#808c99]">{t.orClick}</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className={`block text-sm text-[#808c99] mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t.artworkTitle} *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder={t.titlePlaceholder}
                        className="w-full px-4 py-3 bg-[#0f021c] border border-[#ffcc33]/30 rounded-xl text-[#ffffff] placeholder:text-[#808c99]/30 focus:outline-none focus:border-[#ffcc33] transition-colors"
                      />
                    </div>

                    {/* Price and Medium */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm text-[#808c99] mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t.price} *
                        </label>
                        <div className="relative">
                          <DollarSign className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#808c99]/50 ${isRTL ? 'right-3' : 'left-3'}`} />
                          <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder={t.pricePlaceholder}
                            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-[#0f021c] border border-[#ffcc33]/30 rounded-xl text-[#ffffff] placeholder:text-[#808c99]/30 focus:outline-none focus:border-[#ffcc33] transition-colors`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm text-[#808c99] mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t.medium} *
                        </label>
                        <div className="relative">
                          <Palette className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#808c99]/50 ${isRTL ? 'right-3' : 'left-3'}`} />
                          <input
                            type="text"
                            value={formData.medium}
                            onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                            placeholder={t.mediamPlaceholder}
                            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-[#0f021c] border border-[#ffcc33]/30 rounded-xl text-[#ffffff] placeholder:text-[#808c99]/30 focus:outline-none focus:border-[#ffcc33] transition-colors`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dimensions */}
                    <div>
                      <label className={`block text-sm text-[#808c99] mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t.dimensions} *
                      </label>
                      <div className="relative">
                        <Ruler className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[#808c99]/50 ${isRTL ? 'right-3' : 'left-3'}`} />
                        <input
                          type="text"
                          value={formData.dimensions}
                          onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                          placeholder={t.dimensionsPlaceholder}
                          className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-[#0f021c] border border-[#ffcc33]/30 rounded-xl text-[#ffffff] placeholder:text-[#808c99]/30 focus:outline-none focus:border-[#ffcc33] transition-colors`}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className={`block text-sm text-[#808c99] mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t.description} *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder={t.descriptionPlaceholder}
                        rows={4}
                        className="w-full px-4 py-3 bg-[#0f021c] border border-[#ffcc33]/30 rounded-xl text-[#ffffff] placeholder:text-[#808c99]/30 focus:outline-none focus:border-[#ffcc33] transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={`flex gap-3 mt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-[#ffcc33] to-[#45e3d3] text-[#020e27] rounded-xl hover:opacity-90 transition-opacity"
                    >
                      {t.addArtwork}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-[#1D112A]/50 border border-[#4e4e4e78] text-[#808c99] rounded-xl hover:bg-[#1D112A] transition-colors"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

