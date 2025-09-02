import { useState, useEffect } from 'react';
import { Language, getTranslation } from '@/utils/translations';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('echoes_language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('echoes_language', language);
    // Set document direction for Hebrew
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, subKey?: string) => getTranslation(language, key, subKey);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'he' : 'en');
  };

  return {
    language,
    setLanguage,
    toggleLanguage,
    t,
  };
};