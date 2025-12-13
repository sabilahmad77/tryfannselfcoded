import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, Plus, TrendingUp, Award, Mail, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { useLanguage } from "@/contexts/useLanguage";
import { AddArtistModal, type Artist } from "./AddArtistModal";
import {
  useGetArtistRoasterQuery,
  useCreateArtistRoasterMutation,
  useDeleteArtistRoasterMutation,
  type ArtistRoaster,
} from "@/services/api/dashboardApi";

const content = {
  en: {
    title: "Artist Roster",
    totalArtists: "Total Artists",
    active: "Active",
    emerging: "Emerging",
    established: "Established",
    addArtist: "Add Artist",
    viewProfile: "View Profile",
    contact: "Contact",
    artists: [
      {
        name: "Sarah Al-Mansouri",
        email: "sarah.almansouri@example.com",
        initials: "SM",
        specialty: "Contemporary Painting",
        status: "established" as const,
        artworks: 24,
        exhibitions: 8,
      },
      {
        name: "Ahmed Hassan",
        email: "ahmed.hassan@example.com",
        initials: "AH",
        specialty: "Digital Art",
        status: "emerging" as const,
        artworks: 12,
        exhibitions: 3,
      },
      {
        name: "Layla Ibrahim",
        email: "layla.ibrahim@example.com",
        initials: "LI",
        specialty: "Sculpture",
        status: "established" as const,
        artworks: 18,
        exhibitions: 6,
      },
    ] as Artist[],
    artworks: "Artworks",
    exhibitions: "Exhibitions",
  },
  ar: {
    title: "قائمة الفنانين",
    totalArtists: "إجمالي الفنانين",
    active: "نشط",
    emerging: "ناشئ",
    established: "راسخ",
    addArtist: "إضافة فنان",
    viewProfile: "عرض الملف الشخصي",
    contact: "تواصل",
    artists: [
      {
        name: "سارة المنصوري",
        email: "sarah.almansouri@example.com",
        initials: "SM",
        specialty: "الرسم المعاصر",
        status: "established" as const,
        artworks: 24,
        exhibitions: 8,
      },
      {
        name: "أحمد حسن",
        email: "ahmed.hassan@example.com",
        initials: "AH",
        specialty: "الفن الرقمي",
        status: "emerging" as const,
        artworks: 12,
        exhibitions: 3,
      },
      {
        name: "ليلى إبراهيم",
        email: "layla.ibrahim@example.com",
        initials: "LI",
        specialty: "النحت",
        status: "established" as const,
        artworks: 18,
        exhibitions: 6,
      },
    ] as Artist[],
    artworks: "الأعمال الفنية",
    exhibitions: "المعارض",
  },
};

export function ArtistRoster() {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === "ar";

  const [artists, setArtists] = useState<Artist[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch artists from API
  const {
    data: artistsData,
    isLoading: isLoadingArtists,
    error: artistsError,
  } = useGetArtistRoasterQuery();

  const [createArtist, { isLoading: isCreating }] = useCreateArtistRoasterMutation();
  const [_deleteArtist] = useDeleteArtistRoasterMutation();

  // Transform API data to component format
  useEffect(() => {
    if (artistsData?.data) {
      const apiArtists = Array.isArray(artistsData.data)
        ? artistsData.data
        : [artistsData.data];

      const transformedArtists: Artist[] = apiArtists.map((artist: ArtistRoaster) => ({
        name: artist.name,
        email: artist.email || "",
        initials: generateInitials(artist.name),
        specialty: artist.specialty,
        status: (artist.status === "established" || artist.status === "emerging"
          ? artist.status
          : "emerging") as "emerging" | "established",
        artworks: artist.artwork_count || 0,
        exhibitions: artist.exhibition_count || 0,
      }));

      setArtists(transformedArtists);
    } else if (!artistsData && !isLoadingArtists && !artistsError) {
      // Fallback to default data if API returns no data
      setArtists(t.artists);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artistsData, isLoadingArtists, artistsError]);

  const generateInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };

  const handleAddArtist = async (artistData: Omit<Artist, "initials">) => {
    try {
      await createArtist({
        name: artistData.name,
        email: artistData.email,
        specialty: artistData.specialty,
        status: artistData.status,
        artwork_count: artistData.artworks,
        exhibition_count: artistData.exhibitions,
      }).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create artist:", error);
      // Still add to local state for UI feedback, but API will refetch
      const newArtist: Artist = {
        ...artistData,
        initials: generateInitials(artistData.name),
      };
      setArtists([...artists, newArtist]);
      setIsModalOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "established") {
      return {
        label: t.established,
        className: "bg-[#ffcc33]/20 text-[#ffcc33] border-[#ffcc33]/30",
      };
    }
    return {
      label: t.emerging,
      className: "bg-[#45e3d3]/20 text-[#45e3d3] border-[#45e3d3]/30",
    };
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
          className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#45e3d3] to-[#4de3ed] rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <h2 className="text-2xl text-[#ffffff]">{t.title}</h2>
            <p className="text-sm text-[#808c99]">
              {t.totalArtists}: {artists.length}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-[#45e3d3] to-[#4de3ed] hover:from-[#3bc4b5] hover:to-[#0284c7] hover:shadow-lg hover:shadow-[#45e3d3]/50 text-white border-0 transition-all duration-200 cursor-pointer"
        >
          <Plus className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
          {t.addArtist}
        </Button>
      </div>

      {/* Artists List */}
      <div className="space-y-4">
        {isLoadingArtists ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#45e3d3] animate-spin" />
          </div>
        ) : artistsError ? (
          <div className="text-center py-8 text-[#808c99]">
            <p className="text-sm">
              {language === "en"
                ? "Failed to load artists. Showing default data."
                : "فشل تحميل الفنانين. عرض البيانات الافتراضية."}
            </p>
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center py-8 text-[#808c99]">
            <p className="text-sm">
              {language === "en"
                ? "No artists found. Add your first artist!"
                : "لم يتم العثور على فنانين. أضف أول فنان!"}
            </p>
          </div>
        ) : (
          artists.map((artist, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-[#1D112A] to-[#0F021C] rounded-xl p-4 border border-[#4e4e4e78] hover:border-[#45e3d3]/50 transition-all"
          >
            <div
              className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <Avatar className="w-12 h-12 bg-gradient-to-br from-[#ffcc33] to-[#45e3d3] border-2 border-[#ffcc33]/30">
                <AvatarFallback className="bg-transparent text-[#0F021C]">
                  {artist.initials}
                </AvatarFallback>
              </Avatar>

              {/* Artist Info */}
              <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                <div
                  className={`flex items-center gap-2 mb-1 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <h3 className="text-[#ffffff]">{artist.name}</h3>
                  <Badge
                    className={`${getStatusBadge(artist.status).className} border text-xs`}
                  >
                    {getStatusBadge(artist.status).label}
                  </Badge>
                </div>
                <p className="text-sm text-[#808c99] mb-1">{artist.specialty}</p>
                {artist.email && (
                  <p className="text-xs text-[#94a3b8] mb-3">{artist.email}</p>
                )}

                {/* Stats */}
                <div
                  className={`flex items-center gap-6 text-sm ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex items-center gap-1 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-[#9375b5]" />
                    <span className="text-[#808c99]">
                      {artist.artworks} {t.artworks}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Award className="w-4 h-4 text-[#ffcc33]" />
                    <span className="text-[#808c99]">
                      {artist.exhibitions} {t.exhibitions}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-[#45e3d3] hover:text-[#3bc4b5] hover:bg-[#45e3d3]/20 hover:scale-110 transition-all duration-200 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-[#ffcc33] hover:text-[#b8941f] hover:bg-[#ffcc33]/20 hover:scale-110 transition-all duration-200 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
          ))
        )}
      </div>

      {/* Add Artist Modal */}
      <AddArtistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddArtist}
        isLoading={isCreating}
      />
    </div>
  );
}

