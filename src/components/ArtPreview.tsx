import { motion } from 'motion/react';
import { DollarSign } from 'lucide-react';
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
  { id: 1, artist: "Contemporary Master", value: "$5,000 - $15,000", title: "Abstract Expressionism", description: "A stunning piece showcasing modern artistic vision" },
  { id: 2, artist: "Emerging Talent", value: "$2,000 - $8,000", title: "Digital Renaissance", description: "Bridging traditional and contemporary art forms" },
  { id: 3, artist: "Established Artist", value: "$10,000 - $25,000", title: "Classical Revival", description: "Timeless beauty with contemporary interpretation" },
  { id: 4, artist: "Gallery Collection", value: "$8,000 - $20,000", title: "Curated Excellence", description: "Handpicked masterpiece from our partner galleries" }
];

export function ArtPreview({ language }: ArtPreviewProps) {
  const t = content[language];
  const isRTL = language === 'ar';

  return (
    <section className="relative py-16 overflow-hidden bg-[#0B0B0D]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Abstract Art Background Pattern */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={bgImage}
          alt="Abstract Art Pattern"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/60 via-transparent to-[#0B0B0D]/60" />
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
            <span className="text-[#C59B48]">{t.title.gold}</span>
          </h2>
          <p className="text-[#B9BBC6] max-w-4xl mx-auto text-lg font-body">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Artwork Grid - 4 Cards with Flip Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto"
        >
          {placeholderArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-[400px]"
              style={{ perspective: '1000px' }}
            >
              {/* Flip Card Container */}
              <div 
                className="relative w-full h-full transition-transform duration-700 group-hover:[transform:rotateY(180deg)]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front Side - Image Only */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-[#1a1a2e]/95 via-[#16213e]/90 to-[#0f1624]/95 border border-[#2A2A3A] group-hover:border-[#ffcc33]/40 transition-all duration-500"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Glass Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent z-10" />

                  {/* Artwork Image - Default Image */}
                  <div className="relative h-full w-full bg-gradient-to-br from-[#191922] to-[#0B0B0D] flex items-center justify-center overflow-hidden">
                    <ImageWithFallback
                      src={bgImage}
                      alt={artwork.title || artwork.artist}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/80 via-transparent to-transparent" />

                    {/* Coming Soon Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#ffcc33]/20 border border-[#ffcc33]/40 backdrop-blur-sm z-20">
                      <span className="text-[#ffcc33] text-xs font-medium">{t.placeholder.comingSoon}</span>
                    </div>
                  </div>
                </div>

                {/* Back Side - Details */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-[#1a1a2e]/95 via-[#16213e]/90 to-[#0f1624]/95 border border-[#ffcc33]/40"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  {/* Glass Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />

                  {/* Content */}
                  <div className="relative h-full flex flex-col p-6 z-10">
                    {/* Title */}
                    <h3 className="text-white text-xl mb-3 font-heading">
                      {artwork.title || artwork.artist}
                    </h3>

                    {/* Artist Name */}
                    <div className="mb-4">
                      <p className="text-white/60 text-sm mb-1 font-body">{t.placeholder.artist}</p>
                      <p className="text-white text-base font-body">{artwork.artist}</p>
                    </div>

                    {/* Description */}
                    {artwork.description && (
                      <p className="text-white/70 text-sm mb-4 font-body leading-relaxed flex-1">
                        {artwork.description}
                      </p>
                    )}

                    {/* Estimated Value */}
                    <div className="mt-auto pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-[#ffcc33] text-base font-semibold font-body">
                        <DollarSign className="w-5 h-5" />
                        <span>{artwork.value}</span>
                      </div>
                      <p className="text-white/50 text-xs mt-1 font-body">{t.placeholder.value}</p>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ffcc33]/10 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

