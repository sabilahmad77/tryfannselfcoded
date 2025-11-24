import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";

interface TokenExpiredContextType {
  showDialog: () => void;
  hideDialog: () => void;
  isDialogOpen: boolean;
}

const TokenExpiredContext = createContext<TokenExpiredContextType | undefined>(
  undefined
);

export function TokenExpiredProvider({ children }: { children: ReactNode }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const showDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const hideDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  // Listen for token-expired events from baseApi interceptor
  useEffect(() => {
    const handleTokenExpired = () => {
      // Only show dialog if it's not already open (prevent duplicates)
      if (!isDialogOpen) {
        showDialog();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("token-expired", handleTokenExpired);
      return () => {
        window.removeEventListener("token-expired", handleTokenExpired);
      };
    }
  }, [showDialog, isDialogOpen]);

  return (
    <TokenExpiredContext.Provider
      value={{
        showDialog,
        hideDialog,
        isDialogOpen,
      }}
    >
      {children}
    </TokenExpiredContext.Provider>
  );
}

export function useTokenExpired() {
  const context = useContext(TokenExpiredContext);
  if (context === undefined) {
    throw new Error(
      "useTokenExpired must be used within a TokenExpiredProvider"
    );
  }
  return context;
}
