import { createContext } from 'react';

export interface TokenExpiredContextType {
  showDialog: () => void;
  hideDialog: () => void;
  isDialogOpen: boolean;
}

export const TokenExpiredContext = createContext<TokenExpiredContextType | undefined>(
  undefined
);

