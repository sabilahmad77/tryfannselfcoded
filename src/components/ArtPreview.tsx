import { motion } from 'motion/react';
import { Image, DollarSign } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import bgImage from 'figma:asset/3fa9b9de7e4b1421a708a7c88cd0672cee3504e2.png';

interface ArtPreviewProps {
  language: 'en' | 'ar';
}

const content = {
  en: {
    title: { white: "Featured ", gold: "Artworks" },
    subtitle: "Discover verified artworks from partner galleries and featured artists. Each piece is authenticated, documented, and ready for collection.",
    placeholder: {
      artist: "Featured Artist",
      value: "Est. Value: $5,000 - $15,000",
      comingSoon: "Available at Launch"
    }
  },
  ar: {
    title: { white: "الأعمال الفنية", gold: " المميزة" },
    subtitle: "اكتشف الأعمال الفنية الموثقة من المعارض الشريكة والفنانين المميزين. كل قطعة موثقة وموثقة وجاهزة للاقتناء.",
    placeholder: {
      artist: "فنان مميز",
      value: "القيمة المقدرة: 5,000 - 15,000 دولار",
      comingSoon: "متاح عند الإطلاق"
    }
  }
};

// Placeholder artwork data - ready for real artwork integration
const placeholderArtworks = [
  { id: 1, artist: "Contemporary Master", value: "$5,000 - $15,000" },
  { id: 2, artist: "Emerging Talent", value: "$2,000 - $8,000" },
  { id: 3, artist: "Established Artist", value: "$10,000 - $25,000" },
  { id: 4, artist: "Gallery Collection", value: "$8,000 - $20,000" },
  { id: 5, artist: "Featured Creator", value: "$3,000 - $12,000" },
  { id: 6, artist: "Verified Artist", value: "$6,000 - $18,000" },
  { id: 7, artist: "Partner Gallery", value: "$12,000 - $30,000" },
  { id: 8, artist: "Exclusive Piece", value: "$15,000 - $40,000" },
  { id: 9, artist: "Limited Edition", value: "$4,000 - $10,000" }
];

export function ArtPreview({ language }: ArtPreviewProps) {
  const t = content[language];
  const isRTL = language === 'ar';

  return (
    <section className="relative py-16 overflow-hidden bg-[#0F021C]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Abstract Art Background Pattern */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={bgImage}
          alt="Abstract Art Pattern"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F021C]/60 via-transparent to-[#0F021C]/60" />
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#ffcc33]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#45e3d3]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-4xl md:text-5xl font-heading">
            <span className="text-white">{t.title.white}</span>
            <span className="text-[#ffcc33]">{t.title.gold}</span>
          </h2>
          <p className="text-white/60 max-w-4xl mx-auto text-lg font-body">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Artwork Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
        >
          {placeholderArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-[#1a1a2e]/95 via-[#16213e]/90 to-[#0f1624]/95 border border-[#2A2A3A] hover:border-[#ffcc33]/40 transition-all duration-500">
                {/* Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />

                {/* Artwork Image Placeholder */}
                <div className="relative h-64 bg-gradient-to-br from-[#191922] to-[#0F021C] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
                  <Image className="w-16 h-16 text-white/20" />

                  {/* Coming Soon Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#ffcc33]/20 border border-[#ffcc33]/40 backdrop-blur-sm">
                    <span className="text-[#ffcc33] text-xs font-medium">{t.placeholder.comingSoon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Artist Name */}
                  <h3 className="text-white text-lg mb-2 font-heading">
                    {artwork.artist}
                  </h3>

                  {/* Estimated Value */}
                  <div className="flex items-center gap-2 text-[#ffcc33] text-sm font-body">
                    <DollarSign className="w-4 h-4" />
                    <span>{artwork.value}</span>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ffcc33]/10 via-transparent to-transparent" />
                  <div className="absolute inset-0 rounded-2xl border-2 border-[#ffcc33]/30" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

