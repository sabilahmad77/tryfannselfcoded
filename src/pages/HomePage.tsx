import { useLanguage } from '@/contexts/useLanguage';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { ArtPreview } from '@/components/ArtPreview';
import { HowItWorks } from '@/components/HowItWorks';
import { PersonaPaths } from '@/components/PersonaPaths';
import { RewardsTiers } from '@/components/RewardsTiers';
import { Leaderboard } from '@/components/Leaderboard';
import { ReferralModule } from '@/components/ReferralModule';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEO/SEOHead';
import { SchemaMarkup } from '@/components/SEO/SchemaMarkup';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/paths';
import { useMemo } from 'react';

export function HomePage() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Extract FAQ data for schema markup
  const faqData = useMemo(() => {
    const faqContent = {
      en: [
        { question: "What is FANN?", answer: "FANN is a next-generation digital ecosystem built exclusively for physical art. It combines expert authentication, immersive technologies like AR galleries, and a trusted global network to help artists, collectors, galleries, and institutions connect with confidence." },
        { question: "Who is FANN for?", answer: "FANN is designed for every serious participant in the physical art world: Artists seeking credibility, visibility, and protection; Collectors who want verified art with clear provenance; Galleries & Museums expanding globally with digital tools; Ambassadors building influence within a trusted ecosystem." },
        { question: "Why FANN?", answer: "FANN isn't just a platform; it's a movement. Combining artistic integrity with digital innovation, FANN gives you a premium art experience designed to empower, connect, and elevate." },
        { question: "How do I earn points on FANN?", answer: "FANN uses a dual-point system to reward meaningful participation: Influence Points earned through referrals, community engagement, ambassador activity, and platform participation; Provenance Points earned through completing KYC, uploading verified portfolios, listing authenticated works, and participating in official challenges." },
        { question: "What are the tiers and how do they work?", answer: "Members progress through 5 tiers, each unlocking greater benefits: Early previews and feature access, reduced platform fees, profile boosts and visibility, priority support, and exclusive invitations and recognition. The highest tier, Founding Patron, offers lifetime perks and legacy status within the FANN ecosystem." },
        { question: "How does authentication work on FANN?", answer: "Every artwork on FANN goes through a structured verification process: Reviewed by art professionals and experts, matched with artist credentials and documentation, issued verified records and provenance data, and secured with tamper-resistant digital tracking." },
        { question: "What are AR Galleries and how do they help?", answer: "FANN's immersive AR galleries allow artworks to be viewed in real-world spaces before purchase, presented digitally without losing physical value, shared globally without shipping risks, and experienced by collectors, curators, and institutions." },
        { question: "Is FANN free to join?", answer: "Yes. Registration is free, allowing users to explore the platform, community, and features. Additional benefits unlock through participation, verification, and tier progression." },
        { question: "How does FANN protect collectors?", answer: "Collectors are protected through expert authentication, provenance tracking, verified artist credentials, secure insured logistics, and transparent records. Every layer is designed to reduce risk and preserve long-term value." },
        { question: "How does FANN support artists?", answer: "FANN empowers artists by providing verified status, offering global exposure without gatekeeping, protecting work through authentication, supporting logistics and documentation, and building long-term credibility, not short-term hype." },
        { question: "What makes FANN different from traditional platforms?", answer: "Traditional platforms focus on visibility. FANN focuses on trust, structure, and sustainability. It's not about selling fast — it's about building value that lasts." },
        { question: "Is FANN focused on NFTs or digital-only art?", answer: "No. FANN is dedicated to physical art only — paintings, sculptures, installations, and tangible works. Technology is used to support authenticity, documentation, and presentation, not replace the artwork itself." },
      ],
      ar: [
        { question: "ما هو FANN؟", answer: "FANN هو نظام بيئي رقمي من الجيل القادم مبني حصريًا للفن المادي. يجمع بين المصادقة الخبيرة والتكنولوجيات الغامرة مثل معارض الواقع المعزز، وشبكة عالمية موثوقة لمساعدة الفنانين والجامعين والمعارض والمؤسسات على التواصل بثقة." },
        { question: "لمن FANN؟", answer: "FANN مصمم لكل مشارك جاد في عالم الفن المادي: الفنانون الذين يسعون للحصول على المصداقية والرؤية والحماية؛ الجامعون الذين يريدون فنًا موثقًا بمصداقية واضحة؛ المعارض والمتاحف التي تتوسع عالميًا بالأدوات الرقمية؛ السفراء الذين يبنون التأثير داخل نظام بيئي موثوق." },
        { question: "لماذا FANN؟", answer: "FANN ليست مجرد منصة؛ إنها حركة. بدمج النزاهة الفنية مع الابتكار الرقمي، تمنحك FANN تجربة فنية مميزة مصممة لتمكينك وربطك ورفعك." },
        { question: "كيف أكسب النقاط على FANN؟", answer: "يستخدم FANN نظام نقاط مزدوج لمكافأة المشاركة الهادفة: نقاط التأثير تُكسب من خلال الإحالات والمشاركة المجتمعية ونشاط السفراء والمشاركة في المنصة؛ نقاط المصداقية تُكسب من خلال إكمال التحقق من الهوية وتحميل المحافظ الموثقة وإدراج الأعمال الموثقة والمشاركة في التحديات الرسمية." },
        { question: "ما هي المستويات وكيف تعمل؟", answer: "يتقدم الأعضاء عبر 5 مستويات، كل مستوى يفتح فوائد أكبر: معاينات مبكرة ووصول للميزات، رسوم منصة مخفضة، تعزيز الملف الشخصي والرؤية، دعم ذو أولوية، ودعوات حصرية والاعتراف. المستوى الأعلى، الراعي المؤسس، يقدم امتيازات مدى الحياة وحالة الإرث داخل نظام FANN البيئي." },
        { question: "كيف يعمل التحقق على FANN؟", answer: "كل عمل فني على FANN يمر بعملية تحقق منظمة: مراجعة من قبل محترفي الفن والخبراء، مطابقة مع أوراق اعتماد الفنان والتوثيق، إصدار سجلات موثقة وبيانات المصداقية، وتأمين بتتبع رقمي مقاوم للعبث." },
        { question: "ما هي معارض الواقع المعزز وكيف تساعد؟", answer: "تسمح معارض الواقع المعزز الغامرة في FANN للأعمال الفنية بأن تكون مشاهدة في مساحات العالم الحقيقي قبل الشراء، معروضة رقميًا دون فقدان القيمة المادية، مشاركة عالميًا دون مخاطر الشحن، وتجربة من قبل الجامعين والمنسقين والمؤسسات." },
        { question: "هل الانضمام إلى FANN مجاني؟", answer: "نعم. التسجيل مجاني، مما يسمح للمستخدمين باستكشاف المنصة والمجتمع والميزات. تفتح الفوائد الإضافية من خلال المشاركة والتحقق وتقدم المستويات." },
        { question: "كيف يحمي FANN الجامعين؟", answer: "يتم حماية الجامعين من خلال المصادقة الخبيرة وتتبع المصداقية وأوراق اعتماد الفنان الموثقة ولوجستيات آمنة ومؤمنة وسجلات شفافة. كل طبقة مصممة لتقليل المخاطر والحفاظ على القيمة طويلة الأجل." },
        { question: "كيف يدعم FANN الفنانين؟", answer: "FANN يمكّن الفنانين من خلال توفير حالة موثقة وتقديم التعرض العالمي دون بوابات وحماية العمل من خلال المصادقة ودعم اللوجستيات والتوثيق وبناء المصداقية طويلة الأجل، وليس الضجة قصيرة الأجل." },
        { question: "ما الذي يجعل FANN مختلفًا عن المنصات التقليدية؟", answer: "المنصات التقليدية تركز على الرؤية. FANN تركز على الثقة والهيكل والاستدامة. الأمر ليس حول البيع السريع — بل حول بناء قيمة تدوم." },
        { question: "هل يركز FANN على NFTs أو الفن الرقمي فقط؟", answer: "لا. FANN مخصص للفن المادي فقط — اللوحات والمنحوتات والتركيبات والأعمال الملموسة. تُستخدم التكنولوجيا لدعم الأصالة والتوثيق والعرض، وليس لاستبدال العمل الفني نفسه." },
      ],
    };
    return faqContent[language] || faqContent.en;
  }, [language]);

  return (
    <div className="min-h-screen bg-[#0B0B0D] overflow-x-hidden">
      <SEOHead />
      <SchemaMarkup faqData={faqData} />
      <Navigation 
        onNavigateToSignIn={() => navigate(ROUTES.SIGN_IN)}
      />
      
      <main className="overflow-x-hidden">
        <Hero 
          language={language}
          onNavigateToSignUp={() => navigate(ROUTES.SIGN_UP)}
          onNavigateToRewards={() => {
            const element = document.getElementById('rewards');
            if (element) {
              const navbarHeight = 80; // h-20 = 80px
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          }}
        />
        
        <ArtPreview language={language} />
        
        <div id="how" className="scroll-mt-20">
          <HowItWorks 
            language={language}
            onNavigateToSignUp={() => navigate(ROUTES.SIGN_UP)}
          />
        </div>
        
        <PersonaPaths 
          language={language}
          onNavigateToSignUp={(personaId) => navigate(ROUTES.SIGN_UP, { state: { personaId } })}
        />
        
        <div id="rewards" className="scroll-mt-20">
          <RewardsTiers 
            language={language}
            onNavigateToSignUp={() => navigate(ROUTES.SIGN_UP)}
          />
        </div>
        
        <div id="leaderboard" className="scroll-mt-20">
          <Leaderboard 
            language={language}
            onNavigateToSignUp={() => navigate(ROUTES.SIGN_UP)}
            onViewFullLeaderboard={() => navigate(ROUTES.LEADERBOARD, { state: { fromHomepage: true } })}
          />
        </div>
        
        <div id="referrals" className="scroll-mt-20">
          <ReferralModule 
            language={language}
            onNavigateToSignUp={() => navigate(ROUTES.SIGN_UP)}
          />
        </div>
        
        <div id="faq" className="scroll-mt-20">
          <FAQ 
            language={language}
            onNavigateToSignUp={() => navigate(ROUTES.SIGN_UP)}
          />
        </div>
      </main>
      
      <Footer 
        language={language}
        onNavigateToSignUp={() => navigate(ROUTES.SIGN_UP)}
      />
    </div>
  );
}

