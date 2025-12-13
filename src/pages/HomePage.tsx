import { useLanguage } from '@/contexts/useLanguage';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { PersonaPaths } from '@/components/PersonaPaths';
import { RewardsTiers } from '@/components/RewardsTiers';
import { Leaderboard } from '@/components/Leaderboard';
import { ReferralModule } from '@/components/ReferralModule';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/paths';

export function HomePage() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F021C]">
      <Navigation 
        onNavigateToSignIn={() => navigate(ROUTES.SIGN_IN)}
      />
      
      <main>
        <Hero 
          language={language}
          onNavigateToSignUp={() => navigate(ROUTES.SIGN_UP)}
        />
        
        <div id="how">
          <HowItWorks 
            language={language}
            onNavigateToSignUp={() => navigate(ROUTES.SIGN_UP)}
          />
        </div>
        
        <PersonaPaths 
          language={language}
          onNavigateToSignUp={(personaId) => navigate(ROUTES.SIGN_UP, { state: { personaId } })}
        />
        
        <div id="rewards">
          <RewardsTiers 
            language={language}
            onNavigateToSignUp={() => navigate(ROUTES.SIGN_UP)}
          />
        </div>
        
        <div id="leaderboard">
          <Leaderboard 
            language={language}
            onNavigateToSignUp={() => navigate(ROUTES.SIGN_UP)}
            onViewFullLeaderboard={() => navigate(ROUTES.LEADERBOARD, { state: { fromHomepage: true } })}
          />
        </div>
        
        <div id="referrals">
          <ReferralModule 
            language={language}
            onNavigateToSignUp={() => navigate(ROUTES.SIGN_UP)}
          />
        </div>
        
        <div id="faq">
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

