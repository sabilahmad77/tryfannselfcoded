import React, { useState, ReactNode } from 'react';
import { LanguageContext } from './language-context';

type Language = 'en' | 'ar';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

