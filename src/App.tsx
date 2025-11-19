import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { PersonaPaths } from './components/PersonaPaths';
import { RewardsTiers } from './components/RewardsTiers';
import { Leaderboard } from './components/Leaderboard';
import { ReferralModule } from './components/ReferralModule';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';

type Page = 'home' | 'signin' | 'signup' | 'onboarding';

export default function App() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedPersona, setSelectedPersona] = useState<string>('');

  const renderPage = () => {
    switch (currentPage) {
      case 'signin':
        return (
          <SignIn
            language={language}
            onNavigateToSignUp={() => setCurrentPage('signup')}
            onNavigateToHome={() => setCurrentPage('home')}
          />
        );
      case 'signup':
        return (
          <SignUp
            language={language}
            onNavigateToSignIn={() => setCurrentPage('signin')}
            onNavigateToHome={() => setCurrentPage('home')}
            onSignUpComplete={(persona: string) => {
              setSelectedPersona(persona);
              setCurrentPage('onboarding');
            }}
          />
        );
      case 'onboarding':
        return (
          <OnboardingFlow
            language={language}
            selectedPersona={selectedPersona}
            onComplete={() => setCurrentPage('home')}
          />
        );
      case 'home':
      default:
        return (
          <div className="min-h-screen bg-[#0a0a0f]">
            <Navigation 
              language={language} 
              onLanguageToggle={setLanguage}
              onNavigateToSignIn={() => setCurrentPage('signin')}
            />
            
            <main>
              <Hero 
                language={language}
                onNavigateToSignUp={() => setCurrentPage('signup')}
              />
              
              <div id="how">
                <HowItWorks 
                  language={language}
                  onNavigateToSignUp={() => setCurrentPage('signup')}
                />
              </div>
              
              <PersonaPaths 
                language={language}
                onNavigateToSignUp={() => setCurrentPage('signup')}
              />
              
              <div id="rewards">
                <RewardsTiers 
                  language={language}
                  onNavigateToSignUp={() => setCurrentPage('signup')}
                />
              </div>
              
              <div id="leaderboard">
                <Leaderboard 
                  language={language}
                  onNavigateToSignUp={() => setCurrentPage('signup')}
                />
              </div>
              
              <div id="referrals">
                <ReferralModule 
                  language={language}
                  onNavigateToSignUp={() => setCurrentPage('signup')}
                />
              </div>
              
              <div id="faq">
                <FAQ 
                  language={language}
                  onNavigateToSignUp={() => setCurrentPage('signup')}
                />
              </div>
            </main>
            
            <Footer 
              language={language}
              onNavigateToSignUp={() => setCurrentPage('signup')}
            />
          </div>
        );
    }
  };

  return (
    <>
      {renderPage()}
      
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(26, 26, 36, 0.9)',
            color: '#ffffff',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            backdropFilter: 'blur(10px)'
          }
        }}
      />
    </>
  );
}
