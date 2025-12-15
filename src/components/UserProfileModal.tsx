import { useLanguage } from '@/contexts/useLanguage';
import { Award, CheckCircle, Facebook, Flame, Heart, Instagram, Linkedin, Share2, Shield, ShieldCheck, Target, TrendingUp, Twitter, UserCheck, UserPlus, Users, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState, type ElementType } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    username: string;
    points: number;
    tier: string;
    type: string;
    avatar: string;
    rank: number;
  } | null;
}

interface UserStats {
  influencePoints: number;
  provenancePoints: number;
  followers: number;
  following: number;
  artworksAdded: number;
  videosWatched: number;
  referrals: number;
  activeExhibitions: number;
  representedArtists: number;
  curatedShows: number;
  collectionSize: number;
  acquisitions: number;
  collectionValue: number;
  totalReach: number;
  engagementRate: number;
  conversions: number;
  campaignsActive: number;
  contentCreated: number;
  socialFollowers: number;
}

interface Achievement {
  icon: ElementType;
  title: string;
  description: string;
}

interface ArtworkItem {
  id: number;
  title: string;
  image: string;
  price: string;
  status: 'available' | 'sold' | 'featured';
}

interface ExhibitionItem {
  id: number;
  title: string;
  image: string;
  artists: string;
  status: 'active' | 'upcoming' | 'past';
}

interface CollectionItem {
  id: number;
  title: string;
  image: string;
  artist: string;
  value: string;
}

interface SocialMediaStat {
  platform: 'Instagram' | 'Twitter' | 'Facebook';
  followers: string;
  engagement: string;
  posts: number;
  trend: string;
}

interface UserProfileData {
  bio: string;
  kycStatus: 'verified' | 'notVerified' | 'pending';
  social: {
    instagram: string;
    twitter: string;
    facebook: string;
    linkedin: string;
  };
  stats: UserStats;
  achievements: Achievement[];
  artworks?: ArtworkItem[];
  exhibitions?: ExhibitionItem[];
  collection?: CollectionItem[];
  socialMediaStats?: SocialMediaStat[];
}

const content = {
  en: {
    close: "Close",
    profile: "Profile",
    tier: "Tier",
    rank: "Rank",
    totalPoints: "Total Points",
    kycStatus: "KYC Status",
    verified: "Verified",
    notVerified: "Not Verified",
    pending: "Pending",
    socialMedia: "Social Media",
    bio: "Bio",
    stats: "Statistics",
    influencePoints: "Influence Points",
    provenancePoints: "Provenance Points",
    followers: "Followers",
    following: "Following",
    artworksAdded: "Artworks Added",
    videosWatched: "Videos Watched",
    referrals: "Referrals",
    activity: "Recent Activity",
    overview: "Overview",
    achievements: "Achievements",
    badges: "Badges",
    instagram: "Instagram",
    twitter: "Twitter",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    nextTier: "Progress to Next Tier",
    pointsNeeded: "points needed",
    artworks: "Artworks",
    viewAll: "View All",
    noArtworks: "No artworks yet",
    featured: "Featured",
    sold: "Sold",
    available: "Available",
    exhibitions: "Exhibitions",
    activeExhibitions: "Active Exhibitions",
    representedArtists: "Represented Artists",
    gallerySpace: "Gallery Space",
    pastExhibitions: "Past Exhibitions",
    upcomingShows: "Upcoming Shows",
    curatedShows: "Curated Shows",
    collection: "Collection",
    acquisitions: "Acquisitions",
    collectionValue: "Collection Value",
    recentAcquisitions: "Recent Acquisitions",
    favoriteArtists: "Favorite Artists",
    wishlist: "Wishlist",
    totalReach: "Total Reach",
    engagementRate: "Engagement Rate",
    conversions: "Conversions",
    campaignsActive: "Active Campaigns",
    contentCreated: "Content Created",
    partnershipsActive: "Active Partnerships",
    socialPerformance: "Social Media Performance",
    campaigns: "Campaigns",
    platform: "Platform",
    posts: "Posts",
    trend: "Trend",
    follow: "Follow",
  },
  ar: {
    close: "إغلاق",
    profile: "الملف الشخصي",
    tier: "المستوى",
    rank: "الترتيب",
    totalPoints: "إجمالي النقاط",
    kycStatus: "حالة التحقق من الهوية",
    verified: "موثق",
    notVerified: "غير موثق",
    pending: "قيد المراجعة",
    socialMedia: "وسائل التواصل الاجتماعي",
    bio: "السيرة الذاتية",
    stats: "الإحصائيات",
    influencePoints: "نقاط التأثير",
    provenancePoints: "نقاط المصداقية",
    followers: "المتابعين",
    following: "المتابَعون",
    artworksAdded: "الأعمال الفنية المضافة",
    videosWatched: "الفيديوهات المشاهدة",
    referrals: "الإحالات",
    activity: "النشاط الأخير",
    overview: "نظرة عامة",
    achievements: "الإنجازات",
    badges: "الشارات",
    instagram: "انستغرام",
    twitter: "تويتر",
    facebook: "فيسبوك",
    linkedin: "لينكد إن",
    nextTier: "التقدم إلى المستوى التالي",
    pointsNeeded: "نقطة مطلوبة",
    artworks: "الأعمال الفنية",
    viewAll: "عرض الكل",
    noArtworks: "لا توجد أعمال فنية بعد",
    featured: "مميز",
    sold: "مباع",
    available: "متاح",
    exhibitions: "المعارض",
    activeExhibitions: "المعارض النشطة",
    representedArtists: "الفنانين الممثلين",
    gallerySpace: "مساحة المعرض",
    pastExhibitions: "المعارض السابقة",
    upcomingShows: "العروض القادمة",
    curatedShows: "العروض المنسقة",
    collection: "المجموعة",
    acquisitions: "المقتنيات",
    collectionValue: "قيمة المجموعة",
    recentAcquisitions: "المقتنيات الأخيرة",
    favoriteArtists: "الفنانين المفضلين",
    wishlist: "قائمة الأمنيات",
    totalReach: "إجمالي الوصول",
    engagementRate: "معدل التفاعل",
    conversions: "التحويلات",
    campaignsActive: "الحملات النشطة",
    contentCreated: "المحتوى المُنشأ",
    partnershipsActive: "الشراكات النشطة",
    socialPerformance: "أداء وسائل التواصل",
    campaigns: "الحملات",
    platform: "المنصة",
    posts: "المنشورات",
    trend: "الاتجاه",
    follow: "تابع",
  }
};

// Mock data for user profile (in a real app, this would come from an API)
const getUserProfileData = (_username: string, userType: string): UserProfileData => {
  const baseData: UserProfileData = {
    bio: userType === 'Artist' ? "Passionate contemporary artist exploring the intersection of traditional and digital mediums." :
      userType === 'Gallery' || userType === 'Gallery/Museum' ? "Premier art gallery showcasing exceptional contemporary art from emerging and established artists in the MENA region." :
        userType === 'Collector' ? "Art enthusiast and collector focused on contemporary Middle Eastern art and digital innovation." :
          "Social media influencer and art advocate promoting cultural engagement and artistic discovery.",
    kycStatus: "verified" as "verified" | "notVerified" | "pending",
    social: {
      instagram: "@example",
      twitter: "@example",
      facebook: "example",
      linkedin: "example"
    },
    stats: {
      influencePoints: 4200,
      provenancePoints: 4250,
      followers: 156,
      following: 89,
      artworksAdded: userType === 'Artist' ? 12 : 0,
      videosWatched: 45,
      referrals: 23,
      activeExhibitions: userType === 'Gallery' || userType === 'Gallery/Museum' ? 3 : 0,
      representedArtists: userType === 'Gallery' || userType === 'Gallery/Museum' ? 24 : 0,
      curatedShows: userType === 'Gallery' || userType === 'Gallery/Museum' ? 18 : 0,
      collectionSize: userType === 'Collector' ? 28 : 0,
      acquisitions: userType === 'Collector' ? 8 : 0,
      collectionValue: userType === 'Collector' ? 450000 : 0,
      totalReach: userType === 'Ambassador' ? 124500 : 0,
      engagementRate: userType === 'Ambassador' ? 4.8 : 0,
      conversions: userType === 'Ambassador' ? 47 : 0,
      campaignsActive: userType === 'Ambassador' ? 5 : 0,
      contentCreated: userType === 'Ambassador' ? 89 : 0,
      socialFollowers: userType === 'Ambassador' ? 45200 : 0
    },
    achievements: [
      { icon: Award, title: "Early Adopter", description: "Joined in the first month" },
      { icon: Users, title: "Community Builder", description: "Referred 20+ users" },
      { icon: TrendingUp, title: "Rising Star", description: "Top 10 this month" }
    ]
  };

  // Type-specific content
  if (userType === 'Artist') {
    return {
      ...baseData,
      artworks: [
        {
          id: 1,
          title: "Abstract Dreams",
          image: "https://images.unsplash.com/photo-1653144898324-baeff343d2ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc2NTM5MzcwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
          price: "$2,500",
          status: "available" as "available" | "sold" | "featured"
        },
        {
          id: 2,
          title: "Modern Harmony",
          image: "https://images.unsplash.com/photo-1760795731536-6017bfea3eab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY3VscHR1cmUlMjBhcnR3b3JrfGVufDF8fHx8MTc2NTQ0ODQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
          price: "$5,800",
          status: "featured" as "available" | "sold" | "featured"
        },
        {
          id: 3,
          title: "Contemporary Vision",
          image: "https://images.unsplash.com/photo-1562785072-c65ab858fcbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBjYW52YXMlMjBwYWludGluZ3xlbnwxfHx8fDE3NjU0NDg0ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
          price: "$3,200",
          status: "sold" as "available" | "sold" | "featured"
        },
        {
          id: 4,
          title: "Colorful Expression",
          image: "https://images.unsplash.com/photo-1656360089577-8f9c465441a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGFydCUyMGdhbGxlcnl8ZW58MXx8fHwxNzY1NDQzMDg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
          price: "$4,100",
          status: "available" as "available" | "sold" | "featured"
        },
        {
          id: 5,
          title: "Fine Art Collection",
          image: "https://images.unsplash.com/photo-1573560354513-d68d229fdd34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwYXJ0JTIwcGFpbnRpbmd8ZW58MXx8fHwxNzY1MzUwMjc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
          price: "$7,500",
          status: "featured" as "available" | "sold" | "featured"
        },
        {
          id: 6,
          title: "Digital Masterpiece",
          image: "https://images.unsplash.com/photo-1633248869117-573d5bcc3bde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3NjUzNzgyMzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
          price: "$3,800",
          status: "available" as "available" | "sold" | "featured"
        }
      ]
    };
  } else if (userType === 'Gallery' || userType === 'Gallery/Museum') {
    return {
      ...baseData,
      exhibitions: [
        {
          id: 1,
          title: "Contemporary Visions",
          image: "https://images.unsplash.com/photo-1656360089577-8f9c465441a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGFydCUyMGdhbGxlcnl8ZW58MXx8fHwxNzY1NDQzMDg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
          artists: "12 Artists",
          status: "active" as "active" | "upcoming" | "past"
        },
        {
          id: 2,
          title: "Digital Horizons",
          image: "https://images.unsplash.com/photo-1633248869117-573d5bcc3bde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3NjUzNzgyMzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
          artists: "8 Artists",
          status: "active" as "active" | "upcoming" | "past"
        },
        {
          id: 3,
          title: "MENA Masters",
          image: "https://images.unsplash.com/photo-1573560354513-d68d229fdd34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwYXJ0JTIwcGFpbnRpbmd8ZW58MXx8fHwxNzY1MzUwMjc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
          artists: "15 Artists",
          status: "upcoming" as "active" | "upcoming" | "past"
        },
        {
          id: 4,
          title: "Abstract Expressions",
          image: "https://images.unsplash.com/photo-1653144898324-baeff343d2ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc2NTM5MzcwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
          artists: "6 Artists",
          status: "past" as "active" | "upcoming" | "past"
        },
        {
          id: 5,
          title: "Sculptural Forms",
          image: "https://images.unsplash.com/photo-1760795731536-6017bfea3eab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY3VscHR1cmUlMjBhcnR3b3JrfGVufDF8fHx8MTc2NTQ0ODQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
          artists: "10 Artists",
          status: "past" as "active" | "upcoming" | "past"
        },
        {
          id: 6,
          title: "Cultural Heritage",
          image: "https://images.unsplash.com/photo-1562785072-c65ab858fcbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBjYW52YXMlMjBwYWludGluZ3xlbnwxfHx8fDE3NjU0NDg0ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
          artists: "20 Artists",
          status: "upcoming" as "active" | "upcoming" | "past"
        }
      ]
    };
  } else if (userType === 'Collector') {
    return {
      ...baseData,
      collection: [
        {
          id: 1,
          title: "Contemporary Landscape",
          image: "https://images.unsplash.com/photo-1573560354513-d68d229fdd34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwYXJ0JTIwcGFpbnRpbmd8ZW58MXx8fHwxNzY1MzUwMjc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
          artist: "Sarah Al-Mansoori",
          value: "$12,500"
        },
        {
          id: 2,
          title: "Urban Reflections",
          image: "https://images.unsplash.com/photo-1656360089577-8f9c465441a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGFydCUyMGdhbGxlcnl8ZW58MXx8fHwxNzY1NDQzMDg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
          artist: "Mohammed Al-Ali",
          value: "$8,900"
        },
        {
          id: 3,
          title: "Desert Dreams",
          image: "https://images.unsplash.com/photo-1653144898324-baeff343d2ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBhaW50aW5nJTIwYXJ0fGVufDF8fHx8MTc2NTM5MzcwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
          artist: "Fatima Hassan",
          value: "$15,200"
        },
        {
          id: 4,
          title: "Geometric Harmony",
          image: "https://images.unsplash.com/photo-1562785072-c65ab858fcbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBjYW52YXMlMjBwYWludGluZ3xlbnwxfHx8fDE3NjU0NDg0ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
          artist: "Ahmed bin Rashid",
          value: "$9,800"
        },
        {
          id: 5,
          title: "Cultural Fusion",
          image: "https://images.unsplash.com/photo-1760795731536-6017bfea3eab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY3VscHR1cmUlMjBhcnR3b3JrfGVufDF8fHx8MTc2NTQ0ODQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
          artist: "Laila Al-Farsi",
          value: "$11,400"
        },
        {
          id: 6,
          title: "Modern Heritage",
          image: "https://images.unsplash.com/photo-1633248869117-573d5bcc3bde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3NjUzNzgyMzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
          artist: "Rashid bin Khalifa",
          value: "$7,600"
        }
      ]
    };
  } else if (userType === 'Ambassador') {
    return {
      ...baseData,
      socialMediaStats: [
        {
          platform: 'Instagram',
          followers: '15.2K',
          engagement: '4.8%',
          posts: 124,
          trend: '+12%'
        },
        {
          platform: 'Twitter',
          followers: '8.5K',
          engagement: '3.2%',
          posts: 312,
          trend: '+8%'
        },
        {
          platform: 'Facebook',
          followers: '21.5K',
          engagement: '2.9%',
          posts: 89,
          trend: '+15%'
        }
      ]
    };
  } else {
    return baseData;
  }
};

export function UserProfileModal({ isOpen, onClose, user }: UserProfileModalProps) {
  const { language } = useLanguage();
  const t = content[language];
  const isRTL = language === 'ar';
  const profileData = user ? getUserProfileData(user.username, user.type) : null;
  const [isFollowing, setIsFollowing] = useState(false);

  if (!user || !profileData) {
    return null;
  }

  const getTierColor = (tier: string) => {
    if (tier.includes('Patron') || tier.includes('مؤسس')) return 'from-[#ffcc33] to-[#ffb54d]';
    if (tier.includes('Ambassador') || tier.includes('سفير')) return 'from-[#8b5cf6] to-[#ec4899]';
    return 'from-[#45e3d3] to-[#3bc4b5]';
  };

  const getKYCBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
            <ShieldCheck className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {t.verified}
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            <Shield className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {t.pending}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0">
            <Shield className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {t.notVerified}
          </Badge>
        );
    }
  };

  const nextTierPoints = 10000;
  const progress = (user.points / nextTierPoints) * 100;
  const pointsNeeded = nextTierPoints - user.points;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-4xl my-8"
              onClick={(e) => e.stopPropagation()}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div className="glass rounded-2xl overflow-hidden max-h-[85vh] flex flex-col">
                {/* Header */}
                <div className="relative p-6 border-b border-[#4e4e4e78] shrink-0">
                  <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-4 border-[#ffcc33]">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#ffcc33] to-[#45e3d3] text-[#020e27] text-2xl">
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {profileData.kycStatus === 'verified' && (
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-[#020e27]">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className={`flex items-start justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div>
                          <h2 className="text-2xl text-[#ffffff] mb-1">{user.name}</h2>
                          <p className="text-[#808c99] mb-3">{user.username}</p>
                        </div>
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          {/* Follow Button */}
                          <Button
                            onClick={() => setIsFollowing(!isFollowing)}
                            size="sm"
                            className={`${isFollowing
                                ? 'bg-gradient-to-r from-[#45e3d3] to-[#3bc4b5] hover:from-[#3bc4b5] hover:to-[#45e3d3]'
                                : 'bg-gradient-to-r from-[#ffcc33] to-[#ffb54d] hover:from-[#ffb54d] hover:to-[#ffcc33]'
                              } text-[#020e27] transition-all duration-300`}
                          >
                            {isFollowing ? (
                              <>
                                <UserCheck className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                {t.following}
                              </>
                            ) : (
                              <>
                                <UserPlus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                {t.follow}
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={onClose}
                            variant="ghost"
                            size="icon"
                            className="text-[#808c99] hover:text-[#ffffff] hover:bg-[#1D112A]"
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>

                      <div className={`flex items-center gap-3 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Badge className={`bg-gradient-to-r ${getTierColor(user.tier)} text-[#020e27] border-0`}>
                          {user.tier}
                        </Badge>
                        <Badge variant="outline" className="border-[#4e4e4e78] text-[#808c99]">
                          {user.type}
                        </Badge>
                        {getKYCBadge(profileData.kycStatus)}
                        <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
                          #{user.rank} {t.rank}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {profileData.bio && (
                    <p className={`mt-4 text-[#808c99] text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                      {profileData.bio}
                    </p>
                  )}
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {/* Points Card */}
                  <motion.div
                    className="relative overflow-hidden rounded-xl p-6"
                    style={{
                      background: 'linear-gradient(135deg, #45e3d3 0%, #45e3d3 100%)',
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-xl" />
                    </div>
                    <div className={`relative z-10 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <p className="text-[#020e27] opacity-80 text-sm mb-1">{t.totalPoints}</p>
                      <p className="text-5xl text-[#020e27] mb-4">{user.points.toLocaleString()}</p>

                      {/* Progress to Next Tier */}
                      <div>
                        <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-sm text-[#020e27] opacity-80">{t.nextTier}</span>
                          <span className="text-sm text-[#020e27]">{pointsNeeded} {t.pointsNeeded}</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-[#0f021c]" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Stats Grid */}
                  <div>
                    <h3 className={`text-lg text-[#ffffff] mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t.stats}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-[#8b5cf6]/20 to-[#8b5cf6]/5 rounded-xl p-4 border border-[#8b5cf6]/30"
                      >
                        <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Flame className="w-5 h-5 text-[#8b5cf6]" />
                          <span className="text-xs text-[#808c99]">{t.influencePoints}</span>
                        </div>
                        <p className="text-2xl text-[#ffffff]">{profileData.stats.influencePoints}</p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-[#0ea5e9]/20 to-[#0ea5e9]/5 rounded-xl p-4 border border-[#0ea5e9]/30"
                      >
                        <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Shield className="w-5 h-5 text-[#0ea5e9]" />
                          <span className="text-xs text-[#808c99]">{t.provenancePoints}</span>
                        </div>
                        <p className="text-2xl text-[#ffffff]">{profileData.stats.provenancePoints}</p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-[#ec4899]/20 to-[#ec4899]/5 rounded-xl p-4 border border-[#ec4899]/30"
                      >
                        <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Users className="w-5 h-5 text-[#ec4899]" />
                          <span className="text-xs text-[#808c99]">{t.followers}</span>
                        </div>
                        <p className="text-2xl text-[#ffffff]">{profileData.stats.followers}</p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-[#f59e0b]/20 to-[#f59e0b]/5 rounded-xl p-4 border border-[#f59e0b]/30"
                      >
                        <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <TrendingUp className="w-5 h-5 text-[#f59e0b]" />
                          <span className="text-xs text-[#808c99]">{t.referrals}</span>
                        </div>
                        <p className="text-2xl text-[#ffffff]">{profileData.stats.referrals}</p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <h3 className={`text-lg text-[#ffffff] mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t.socialMedia}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {profileData.social.instagram && (
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={`https://instagram.com/${profileData.social.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass rounded-xl p-4 flex items-center gap-3 border border-[#4e4e4e78] hover:border-[#e4405f]/50 transition-all"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] rounded-lg flex items-center justify-center shrink-0">
                            <Instagram className="w-5 h-5 text-white" />
                          </div>
                          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <p className="text-xs text-[#808c99]">{t.instagram}</p>
                            <p className="text-sm text-[#ffffff]">{profileData.social.instagram}</p>
                          </div>
                        </motion.a>
                      )}
                      {profileData.social.twitter && (
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={`https://twitter.com/${profileData.social.twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass rounded-xl p-4 flex items-center gap-3 border border-[#4e4e4e78] hover:border-[#1da1f2]/50 transition-all"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-[#1da1f2] to-[#0c85d0] rounded-lg flex items-center justify-center shrink-0">
                            <Twitter className="w-5 h-5 text-white" />
                          </div>
                          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <p className="text-xs text-[#808c99]">{t.twitter}</p>
                            <p className="text-sm text-[#ffffff]">{profileData.social.twitter}</p>
                          </div>
                        </motion.a>
                      )}
                      {profileData.social.facebook && (
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={`https://facebook.com/${profileData.social.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass rounded-xl p-4 flex items-center gap-3 border border-[#4e4e4e78] hover:border-[#1877f2]/50 transition-all"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-[#1877f2] to-[#0e5fc6] rounded-lg flex items-center justify-center shrink-0">
                            <Facebook className="w-5 h-5 text-white" />
                          </div>
                          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <p className="text-xs text-[#808c99]">{t.facebook}</p>
                            <p className="text-sm text-[#ffffff]">Facebook</p>
                          </div>
                        </motion.a>
                      )}
                      {profileData.social.linkedin && (
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={`https://linkedin.com/in/${profileData.social.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass rounded-xl p-4 flex items-center gap-3 border border-[#4e4e4e78] hover:border-[#0a66c2]/50 transition-all"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-[#0a66c2] to-[#004182] rounded-lg flex items-center justify-center shrink-0">
                            <Linkedin className="w-5 h-5 text-white" />
                          </div>
                          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <p className="text-xs text-[#808c99]">{t.linkedin}</p>
                            <p className="text-sm text-[#ffffff]">LinkedIn</p>
                          </div>
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* Overview - Dynamic based on user type */}
                  <div>
                    <h3 className={`text-lg text-[#ffffff] mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t.overview}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Ambassador-specific stats */}
                      {user.type === 'Ambassador' ? (
                        <>
                          <div className="glass rounded-xl p-4 border border-[#4e4e4e78]">
                            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Users className="w-5 h-5 text-[#45e3d3]" />
                              <span className="text-xs text-[#808c99]">{t.totalReach}</span>
                            </div>
                            <p className="text-2xl text-[#ffffff]">{profileData.stats.totalReach.toLocaleString()}</p>
                          </div>
                          <div className="glass rounded-xl p-4 border border-[#4e4e4e78]">
                            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Heart className="w-5 h-5 text-[#ec4899]" />
                              <span className="text-xs text-[#808c99]">{t.engagementRate}</span>
                            </div>
                            <p className="text-2xl text-[#ffffff]">{profileData.stats.engagementRate}%</p>
                          </div>
                          <div className="glass rounded-xl p-4 border border-[#4e4e4e78]">
                            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Target className="w-5 h-5 text-[#10b981]" />
                              <span className="text-xs text-[#808c99]">{t.conversions}</span>
                            </div>
                            <p className="text-2xl text-[#ffffff]">{profileData.stats.conversions}</p>
                          </div>
                          <div className="glass rounded-xl p-4 border border-[#4e4e4e78]">
                            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Share2 className="w-5 h-5 text-[#8b5cf6]" />
                              <span className="text-xs text-[#808c99]">{t.campaignsActive}</span>
                            </div>
                            <p className="text-2xl text-[#ffffff]">{profileData.stats.campaignsActive}</p>
                          </div>
                        </>
                      ) : (
                        /* Default stats for other user types */
                        <>
                          <div className="glass rounded-xl p-4 border border-[#4e4e4e78]">
                            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Award className="w-5 h-5 text-[#ffcc33]" />
                              <span className="text-xs text-[#808c99]">{t.artworksAdded}</span>
                            </div>
                            <p className="text-2xl text-[#ffffff]">{profileData.stats.artworksAdded}</p>
                          </div>
                          <div className="glass rounded-xl p-4 border border-[#4e4e4e78]">
                            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <TrendingUp className="w-5 h-5 text-[#45e3d3]" />
                              <span className="text-xs text-[#808c99]">{t.videosWatched}</span>
                            </div>
                            <p className="text-2xl text-[#ffffff]">{profileData.stats.videosWatched}</p>
                          </div>
                          <div className="glass rounded-xl p-4 border border-[#4e4e4e78]">
                            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Users className="w-5 h-5 text-[#8b5cf6]" />
                              <span className="text-xs text-[#808c99]">{t.following}</span>
                            </div>
                            <p className="text-2xl text-[#ffffff]">{profileData.stats.following}</p>
                          </div>
                          <div className="glass rounded-xl p-4 border border-[#4e4e4e78]">
                            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Flame className="w-5 h-5 text-[#f59e0b]" />
                              <span className="text-xs text-[#808c99]">Streak Days</span>
                            </div>
                            <p className="text-2xl text-[#ffffff]">12</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Artworks Gallery - Artist Only */}
                  {user.type === 'Artist' && profileData.artworks && profileData.artworks.length > 0 && (
                    <div>
                      <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <h3 className={`text-lg text-[#ffffff] ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t.artworks}
                        </h3>
                        <span className="text-sm text-[#808c99]">
                          {profileData.artworks.length} {language === 'en' ? 'pieces' : 'قطعة'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {profileData.artworks.map((artwork: ArtworkItem) => (
                          <motion.div
                            key={artwork.id}
                            whileHover={{ scale: 1.03, y: -5 }}
                            className="group relative overflow-hidden rounded-xl border border-[#4e4e4e78] hover:border-[#ffcc33]/50 transition-all cursor-pointer"
                          >
                            <div className="aspect-square relative overflow-hidden bg-[#1D112A]">
                              <img
                                src={artwork.image}
                                alt={artwork.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute top-2 right-2 z-10">
                                {artwork.status === 'featured' && (
                                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">
                                    {t.featured}
                                  </Badge>
                                )}
                                {artwork.status === 'sold' && (
                                  <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 text-xs">
                                    {t.sold}
                                  </Badge>
                                )}
                                {artwork.status === 'available' && (
                                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs">
                                    {t.available}
                                  </Badge>
                                )}
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                  <h4 className="text-white text-sm mb-1">{artwork.title}</h4>
                                  <p className="text-[#ffcc33] font-semibold">{artwork.price}</p>
                                </div>
                              </div>
                            </div>
                            <div className="md:hidden p-3 bg-[#1D112A]/80 backdrop-blur-sm">
                              <h4 className="text-white text-sm mb-1 truncate">{artwork.title}</h4>
                              <p className="text-[#ffcc33] text-xs">{artwork.price}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Exhibitions Gallery - Gallery Only */}
                  {(user.type === 'Gallery' || user.type === 'Gallery/Museum') && profileData.exhibitions && profileData.exhibitions.length > 0 && (
                    <div>
                      <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <h3 className={`text-lg text-[#ffffff] ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t.exhibitions}
                        </h3>
                        <span className="text-sm text-[#808c99]">
                          {profileData.exhibitions.length} {language === 'en' ? 'shows' : 'معرض'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {profileData.exhibitions.map((exhibition: ExhibitionItem) => (
                          <motion.div
                            key={exhibition.id}
                            whileHover={{ scale: 1.03, y: -5 }}
                            className="group relative overflow-hidden rounded-xl border border-[#4e4e4e78] hover:border-[#ffcc33]/50 transition-all cursor-pointer"
                          >
                            <div className="aspect-square relative overflow-hidden bg-[#1D112A]">
                              <img
                                src={exhibition.image}
                                alt={exhibition.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute top-2 right-2 z-10">
                                {exhibition.status === 'active' && (
                                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs">
                                    {language === 'en' ? 'Active' : 'نشط'}
                                  </Badge>
                                )}
                                {exhibition.status === 'upcoming' && (
                                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 text-xs">
                                    {language === 'en' ? 'Upcoming' : 'قادم'}
                                  </Badge>
                                )}
                                {exhibition.status === 'past' && (
                                  <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 text-xs">
                                    {language === 'en' ? 'Past' : 'سابق'}
                                  </Badge>
                                )}
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                  <h4 className="text-white text-sm mb-1">{exhibition.title}</h4>
                                  <p className="text-[#ffcc33] text-xs">{exhibition.artists}</p>
                                </div>
                              </div>
                            </div>
                            <div className="md:hidden p-3 bg-[#1D112A]/80 backdrop-blur-sm">
                              <h4 className="text-white text-sm mb-1 truncate">{exhibition.title}</h4>
                              <p className="text-[#ffcc33] text-xs">{exhibition.artists}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Collection Gallery - Collector Only */}
                  {user.type === 'Collector' && profileData.collection && profileData.collection.length > 0 && (
                    <div>
                      <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <h3 className={`text-lg text-[#ffffff] ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t.collection}
                        </h3>
                        <span className="text-sm text-[#808c99]">
                          {profileData.collection.length} {language === 'en' ? 'pieces' : 'قطعة'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {profileData.collection.map((item: CollectionItem) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.03, y: -5 }}
                            className="group relative overflow-hidden rounded-xl border border-[#4e4e4e78] hover:border-[#ffcc33]/50 transition-all cursor-pointer"
                          >
                            <div className="aspect-square relative overflow-hidden bg-[#1D112A]">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                  <h4 className="text-white text-sm mb-1">{item.title}</h4>
                                  <p className="text-[#808c99] text-xs mb-1">{item.artist}</p>
                                  <p className="text-[#ffcc33] font-semibold text-xs">{item.value}</p>
                                </div>
                              </div>
                            </div>
                            <div className="md:hidden p-3 bg-[#1D112A]/80 backdrop-blur-sm">
                              <h4 className="text-white text-sm mb-1 truncate">{item.title}</h4>
                              <p className="text-[#808c99] text-xs mb-1">{item.artist}</p>
                              <p className="text-[#ffcc33] text-xs">{item.value}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Media Performance - Ambassador Only */}
                  {user.type === 'Ambassador' && profileData.socialMediaStats && profileData.socialMediaStats.length > 0 && (
                    <div>
                      <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <h3 className={`text-lg text-[#ffffff] ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t.socialPerformance}
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {profileData.socialMediaStats.map((stat: SocialMediaStat, index: number) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            className="glass rounded-xl p-4 border border-[#4e4e4e78] hover:border-[#ffcc33]/30 transition-all"
                          >
                            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className={`w-12 h-12 rounded-lg ${stat.platform === 'Instagram' ? 'bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]' :
                                  stat.platform === 'Twitter' ? 'bg-gradient-to-br from-[#1da1f2] to-[#0c85d0]' :
                                    'bg-gradient-to-br from-[#1877f2] to-[#0e5fc6]'
                                } flex items-center justify-center shrink-0`}>
                                {stat.platform === 'Instagram' && <Instagram className="w-6 h-6 text-white" />}
                                {stat.platform === 'Twitter' && <Twitter className="w-6 h-6 text-white" />}
                                {stat.platform === 'Facebook' && <Facebook className="w-6 h-6 text-white" />}
                              </div>
                              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                  <p className="text-xs text-[#808c99] mb-1">{t.platform}</p>
                                  <p className="text-sm text-[#ffffff]">{stat.platform}</p>
                                </div>
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                  <p className="text-xs text-[#808c99] mb-1">{t.followers}</p>
                                  <p className="text-sm text-[#ffffff]">{stat.followers}</p>
                                </div>
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                  <p className="text-xs text-[#808c99] mb-1">{t.engagementRate}</p>
                                  <p className="text-sm text-[#ffffff]">{stat.engagement}</p>
                                </div>
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                  <p className="text-xs text-[#808c99] mb-1">{t.posts}</p>
                                  <p className="text-sm text-green-400 flex items-center gap-1">{stat.posts} <span className="text-xs">({stat.trend})</span></p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  <div>
                    <h3 className={`text-lg text-[#ffffff] mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t.achievements}
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {profileData.achievements.map((achievement, index) => {
                        const Icon = achievement.icon;
                        return (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            className="glass rounded-xl p-4 border border-[#ffcc33]/30"
                          >
                            <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className="w-12 h-12 bg-gradient-to-br from-[#ffcc33] to-[#ffb54d] rounded-lg flex items-center justify-center shrink-0">
                                <Icon className="w-6 h-6 text-[#020e27]" />
                              </div>
                              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                                <p className="text-[#ffffff] mb-1">{achievement.title}</p>
                                <p className="text-[#808c99] text-sm">{achievement.description}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

