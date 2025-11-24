import React, {
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { TokenExpiredContext } from "./token-expired-context";

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
