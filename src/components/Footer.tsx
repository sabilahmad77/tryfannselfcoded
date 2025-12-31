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
    tagline: { white: "Get Started Today", gold: " Join the Future of Art" },
    description: "The art world is changing. FANN is at the forefront of this transformation. Whether you’re an artist, a curator, or a collector, FANN offers the tools, community, and opportunities you need to thrive in the future of art.",
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
    tagline: { white: "ابدأ اليوم", gold: " انضم إلى مستقبل الفن" },
    description: "عالم الفن يتغير. FANN في طليعة هذا التحول. سواء كنت فنانًا أو منسقًا أو جامعًا، تقدم FANN الأدوات والمجتمع والفرص التي تحتاجها للازدهار في مستقبل الفن.",
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
    <footer className="relative bg-[#0F021C] border-t border-[#ffcc33]/20" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Abstract Art Background Pattern */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={bgImage}
          alt="Abstract Art Pattern"
          className="w-full h-full object-cover opacity-60"
          style={{ transform: 'scaleX(-1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F021C]/60 via-transparent to-[#0F021C]/50" />
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#ffcc33]/8 rounded-full blur-3xl" />
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
                    'drop-shadow(0 0 8px rgba(255, 204, 51, 0.3))',
                    'drop-shadow(0 0 16px rgba(255, 204, 51, 0.5))',
                    'drop-shadow(0 0 8px rgba(255, 204, 51, 0.3))',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <p className="mb-3">
              <span className="text-white">{t.tagline.white}</span>
              <span className="text-[#ffcc33]">{t.tagline.gold}</span>
            </p>
            <p className="text-[#ffffff]/60 text-sm mb-6 max-w-sm leading-relaxed">
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
                    className="w-11 h-11 rounded-full glass border border-[#ffcc33]/30 hover:border-[#ffcc33] flex items-center justify-center transition-all group"
                  >
                    <Icon className="w-5 h-5 text-[#ffffff]/60 group-hover:text-[#ffcc33] transition-colors" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {t.sections.map((section, index) => (
            <div key={index}>
              <h4 className="text-[#ffffff] mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5 }}
                      className="text-[#ffffff]/60 hover:text-[#ffcc33] text-sm transition-colors inline-block"
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
        <div className="pt-8 border-t border-[#ffcc33]/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#ffffff]/60 text-sm">{t.copyright}</p>
            <div className="flex items-center gap-4">
              <motion.div
                className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#45e3d3]/30"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 rounded-full bg-[#45e3d3] animate-pulse" />
                <span className="text-[#ffffff]/60 text-xs">{t.compliance}</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
