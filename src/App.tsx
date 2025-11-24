import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TokenExpiredProvider } from '@/contexts/TokenExpiredContext';
import { TokenExpiredDialog } from '@/components/TokenExpiredDialog';
import { AppRoutes } from '@/routes';
import { useTokenExpired } from '@/contexts/TokenExpiredContext';

// Component to render the dialog inside the providers
function AppContent() {
  const { isDialogOpen, hideDialog } = useTokenExpired();

  return (
    <>
      <AppRoutes />
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
      <TokenExpiredDialog open={isDialogOpen} onClose={hideDialog} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <TokenExpiredProvider>
          <AppContent />
        </TokenExpiredProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
