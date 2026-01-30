import { ROUTES } from '@/routes/paths';
import fannLogo from 'figma:asset/3b0b3b085f063d168ed55b6b769b2fbf5143db61.png';
import bgImage from 'figma:asset/c85d96c5ec679934a6c95c18a6db9da4a5b2bc2d.png';
import { BookOpen, Facebook, FileText, Globe, Image as ImageIcon, Instagram, Layers, Linkedin, Palette, Twitter, Video, Youtube } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FooterProps {
  language: 'en' | 'ar';
  onNavigateToSignUp?: () => void;
}

const content = {
  en: {
    tagline: { white: "Get Started Today", gold: " Join the Future of Art" },
    description: "The art world is changing. FANN is at the forefront of this transformation. Whether you’re an artist, a curator, or a collector, FANN offers the tools, community, and opportunities you need to thrive in the future of art.",
    sections: [
      {
        title: "Platform",
        links: ["How It Works", "Rewards", "Leaderboard", "Referrals"]
      },
      {
        title: "Resources",
        links: ["FAQ", "Privacy & Terms", "Contact Us"]
      },
      {
        title: "Community",
        links: ["Blog", "Events", "Partners", "Careers"]
      }
    ],
    newsletter: {
      title: "Stay Updated",
      placeholder: "Enter your email",
      button: "Subscribe"
    },
    copyright: "© 2026 FANN All Rights Reserved",
    comingSoon: "Coming Soon"
  },
  ar: {
    tagline: { white: "ابدأ اليوم", gold: " انضم إلى مستقبل الفن" },
    description: "عالم الفن يتغير. FANN في طليعة هذا التحول. سواء كنت فنانًا أو منسقًا أو جامعًا، تقدم FANN الأدوات والمجتمع والفرص التي تحتاجها للازدهار في مستقبل الفن.",
    sections: [
      {
        title: "المنصة",
        links: ["كيف يعمل", "المكافآت", "لوحة المتصدرين", "الإحالات"]
      },
      {
        title: "الموارد",
        links: ["الأسئلة الشائعة", "الخصوصية والشروط", "اتصل بنا"]
      },
      {
        title: "المجتمع",
        links: ["المدونة", "الأحداث", "الشركاء", "الوظائف"]
      }
    ],
    newsletter: {
      title: "ابق على اطلاع",
      placeholder: "أدخل بريدك الإلكتروني",
      button: "اشترك"
    },
    copyright: "© 2026 FANN جميع الحقوق محفوظة",
    comingSoon: "قريباً"
  }
};

export function Footer({ language }: FooterProps) {
  const t = content[language];
  const isRTL = language === 'ar';
  const navigate = useNavigate();

  // All 14 social media icons with links - using professional icons
  const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/company/fannarttech', label: 'LinkedIn' },
    { icon: Facebook, href: 'https://www.facebook.com/FannKuwait', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/fannarttech', label: 'Instagram' },
    { icon: Youtube, href: 'https://www.youtube.com/@fannarttech', label: 'YouTube' },
    { icon: Twitter, href: 'https://x.com/fannarttech', label: 'Twitter / X' },
    { icon: Video, href: 'https://www.tiktok.com/@fannarttech', label: 'TikTok' },
    { icon: Layers, href: 'https://www.pinterest.com/fannarttech', label: 'Pinterest' }, // Layers icon for Pinterest
    { icon: Globe, href: 'https://www.reddit.com/user/Fun-Commercial-7646', label: 'Reddit' },
    { icon: BookOpen, href: 'https://medium.com/@fannarttech', label: 'Medium' }, // BookOpen for Medium
    { icon: Palette, href: 'https://dribbble.com/fannarttech', label: 'Dribbble' },
    { icon: ImageIcon, href: 'https://www.behance.net/infoart', label: 'Behance' },
    { icon: FileText, href: 'https://app.lottiefiles.com/public-animations', label: 'Lottiefiles' }, // FileText for Lottiefiles
    { icon: Palette, href: 'https://www.artstation.com/fannarttech6', label: 'Artstation' },
  ];

  const scrollToSection = (sectionId: string) => {
    const navbarHeight = 80; // h-20 = 80px
    if (window.location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      navigate(ROUTES.HOME);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const handleLinkClick = (link: string) => {
    if (link === 'Blog' || link === 'المدونة') {
      window.open('https://medium.com/@fannarttech', '_blank');
      return;
    }
    if (link === 'Privacy & Terms' || link === 'الخصوصية والشروط') {
      navigate(ROUTES.PRIVACY_TERMS);
      return;
    }
    if (link === 'Contact Us' || link === 'اتصل بنا') {
      navigate(ROUTES.CONTACT_US);
      return;
    }
    if (link === 'FAQ' || link === 'الأسئلة الشائعة') {
      scrollToSection('faq');
      return;
    }
    if (link === 'How It Works' || link === 'كيف يعمل') {
      scrollToSection('how');
      return;
    }
    if (link === 'Rewards' || link === 'المكافآت') {
      scrollToSection('rewards');
      return;
    }
    if (link === 'Leaderboard' || link === 'لوحة المتصدرين') {
      scrollToSection('leaderboard');
      return;
    }
    if (link === 'Referrals' || link === 'الإحالات') {
      scrollToSection('referrals');
      return;
    }
  };

  const isComingSoon = (link: string) => {
    const comingSoonLinks = ['Events', 'Partners', 'Careers', 'الأحداث', 'الشركاء', 'الوظائف'];
    return comingSoonLinks.includes(link);
  };

  return (
    <footer className="relative bg-[#0B0B0D] border-t border-[#C59B48]/20 w-full overflow-x-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Abstract Art Background Pattern */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={bgImage}
          alt="Abstract Art Pattern"
          className="w-full h-full object-cover opacity-60"
          style={{ transform: 'scaleX(-1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/60 via-transparent to-[#0B0B0D]/50" />
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C59B48]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full max-w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12 w-full">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <motion.div
              className="flex items-center gap-3 mb-4 sm:mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <motion.img
                src={fannLogo}
                alt="FANN"
                className="h-7 sm:h-8 w-auto"
                animate={{
                  filter: [
                    'drop-shadow(0 0 8px rgba(197, 155, 72, 0.22))',
                    'drop-shadow(0 0 16px rgba(197, 155, 72, 0.4))',
                    'drop-shadow(0 0 8px rgba(197, 155, 72, 0.22))',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <p className="mb-2 sm:mb-3 font-heading text-base sm:text-lg">
              <span className="text-white font-heading">{t.tagline.white}</span>
              <span className="text-[#C59B48] font-heading">{t.tagline.gold}</span>
            </p>
            <p className="text-[#F2F2F3]/60 text-xs sm:text-sm mb-4 sm:mb-6 max-w-sm leading-relaxed font-body">
              {t.description}
            </p>

            {/* Social Links - All 14 icons with tooltips */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <div key={index} className="relative group/tooltip">
                    <motion.a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full glass border border-[#C59B48]/30 hover:border-[#C59B48] flex items-center justify-center transition-all group"
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-[#F2F2F3]/60 group-hover:text-[#C59B48] transition-colors" />
                    </motion.a>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-[#191922] border border-[#C59B48]/30 text-white text-xs font-body whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg">
                      {social.label}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                        <div className="w-2 h-2 bg-[#191922] border-r border-b border-[#C59B48]/30 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {t.sections.map((section, index) => (
            <div key={index}>
              <h4 className="text-[#F2F2F3] mb-4 sm:mb-6 text-sm sm:text-base font-heading">{section.title}</h4>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link, linkIndex) => {
                  const isComingSoonLink = isComingSoon(link);
                  return (
                    <li key={linkIndex}>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-2"
                      >
                        <motion.button
                          onClick={() => handleLinkClick(link)}
                          disabled={isComingSoonLink}
                          className={`text-[#F2F2F3]/60 hover:text-[#C59B48] text-xs sm:text-sm disabled:bg-disabled transition-colors inline-block font-body ${isComingSoonLink ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                          {link}
                        </motion.button>
                        {isComingSoonLink && (
                          <span className="text-[#C59B48] text-xs font-body px-1.5 sm:px-2 py-0.5 rounded-full border border-[#C59B48]/30">
                            {t.comingSoon}
                          </span>
                        )}
                      </motion.div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-[#C59B48]/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-[#F2F2F3]/60 text-xs sm:text-sm font-body text-center sm:text-left">{t.copyright}</p>
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.div
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass border border-[#45e3d3]/30"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#45e3d3] animate-pulse" />
                <span className="text-[#F2F2F3]/60 text-xs font-body">GDPR Compliant</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
