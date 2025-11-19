import { motion } from 'motion/react';
import { Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import fannLogo from 'figma:asset/3b0b3b085f063d168ed55b6b769b2fbf5143db61.png';
import { ImageWithFallback } from './figma/ImageWithFallback';
import bgImage from 'figma:asset/c85d96c5ec679934a6c95c18a6db9da4a5b2bc2d.png';

interface FooterProps {
  language: 'en' | 'ar';
  onNavigateToSignUp?: () => void;
}

const content = {
  en: {
    tagline: "The Future of Art Starts Here",
    description: "TRYFANN is the gateway to FANN - where authenticated fine art meets immersive technology.",
    sections: [
      {
        title: "Platform",
        links: ["How It Works", "Rewards", "Leaderboard", "Referrals"]
      },
      {
        title: "Resources",
        links: ["FAQ", "Terms of Service", "Privacy Policy", "Contact Us"]
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
    copyright: "© 2025 TRYFANN. All rights reserved.",
    compliance: "KYC powered by SumSub • GDPR Compliant"
  },
  ar: {
    tagline: "مستقبل الفن يبدأ هنا",
    description: "TRYFANN هو البوابة إلى FANN - حيث يلتقي الفن الراقي الموثق بالتكنولوجيا الغامرة.",
    sections: [
      {
        title: "المنصة",
        links: ["كيف يعمل", "المكافآت", "لوحة المتصدرين", "الإحالات"]
      },
      {
        title: "الموارد",
        links: ["الأسئلة الشائعة", "شروط الخدمة", "سياسة الخصوصية", "اتصل بنا"]
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
    copyright: "© 2025 TRYFANN. جميع الحقوق محفوظة.",
    compliance: "التحقق من الهوية بواسطة SumSub • متوافق مع GDPR"
  }
};

export function Footer({ language }: FooterProps) {
  const t = content[language];
  const isRTL = language === 'ar';

  return (
    <footer className="relative bg-[#0a0612] border-t border-[#d4af37]/20" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Abstract Art Background Pattern */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={bgImage}
          alt="Abstract Art Pattern"
          className="w-full h-full object-cover opacity-60"
          style={{ transform: 'scaleX(-1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 via-transparent to-[#0f172a]/50" />
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#d4af37]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div 
              className="flex items-center gap-3 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <motion.img 
                src={fannLogo}
                alt="FANN"
                className="h-8 w-auto"
                animate={{
                  filter: [
                    'drop-shadow(0 0 8px rgba(212, 175, 55, 0.3))',
                    'drop-shadow(0 0 16px rgba(212, 175, 55, 0.5))',
                    'drop-shadow(0 0 8px rgba(212, 175, 55, 0.3))',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <p className="text-[#d4af37] mb-3">{t.tagline}</p>
            <p className="text-[#fef3c7]/60 text-sm mb-6 max-w-sm leading-relaxed">
              {t.description}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Mail, href: '#' },
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-11 h-11 rounded-full glass border border-[#d4af37]/30 hover:border-[#d4af37] flex items-center justify-center transition-all group"
                  >
                    <Icon className="w-5 h-5 text-[#fef3c7]/60 group-hover:text-[#d4af37] transition-colors" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {t.sections.map((section, index) => (
            <div key={index}>
              <h4 className="text-[#fef3c7] mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5 }}
                      className="text-[#fef3c7]/60 hover:text-[#d4af37] text-sm transition-colors inline-block"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#d4af37]/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#fef3c7]/60 text-sm">{t.copyright}</p>
            <div className="flex items-center gap-4">
              <motion.div
                className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#14b8a6]/30"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 rounded-full bg-[#14b8a6] animate-pulse" />
                <span className="text-[#fef3c7]/60 text-xs">{t.compliance}</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
