import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../i18n/translations';

const LANGUAGE_STORAGE_KEY = '@app_language';
const LANG_SELECTED_KEY = '@app_language_selected';

// Fallback in-memory storage if native AsyncStorage module is missing
const memoryStorage = {};

const safeStorage = {
  getItem: async (key) => {
    try {
      if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        const val = await AsyncStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch (e) {
      // Ignore native module missing error
    }
    return memoryStorage[key] || null;
  },
  setItem: async (key, val) => {
    memoryStorage[key] = val;
    try {
      if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        await AsyncStorage.setItem(key, val);
      }
    } catch (e) {
      // Ignore native module missing error
    }
  },
  removeItem: async (key) => {
    delete memoryStorage[key];
    try {
      if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      // Ignore native module missing error
    }
  }
};

const LanguageContext = createContext({
  language: 'uz',
  isLanguageSelected: false,
  isLoading: true,
  setLanguage: () => {},
  completeInitialLanguageSelect: () => {},
  resetLanguageSelection: () => {},
  t: (key) => key
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('uz');
  const [isLanguageSelected, setIsLanguageSelectedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedSettings();
  }, []);

  const loadSavedSettings = async () => {
    try {
      const savedLang = await safeStorage.getItem(LANGUAGE_STORAGE_KEY);
      const isSelected = await safeStorage.getItem(LANG_SELECTED_KEY);

      if (savedLang && translations[savedLang]) {
        setLanguageState(savedLang);
      }
      if (isSelected === 'true') {
        setIsLanguageSelectedState(true);
      }
    } catch (e) {
      // Silently fall back to defaults
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = async (lang) => {
    if (!translations[lang]) return;
    setLanguageState(lang);
    await safeStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const completeInitialLanguageSelect = async (lang) => {
    const targetLang = translations[lang] ? lang : 'uz';
    setLanguageState(targetLang);
    setIsLanguageSelectedState(true);
    await safeStorage.setItem(LANGUAGE_STORAGE_KEY, targetLang);
    await safeStorage.setItem(LANG_SELECTED_KEY, 'true');
  };

  const resetLanguageSelection = async () => {
    setIsLanguageSelectedState(false);
    await safeStorage.removeItem(LANG_SELECTED_KEY);
  };

  const t = (key) => {
    const langDict = translations[language] || translations.uz;
    return langDict[key] || translations.uz[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isLanguageSelected,
        isLoading,
        setLanguage,
        completeInitialLanguageSelect,
        resetLanguageSelection,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
