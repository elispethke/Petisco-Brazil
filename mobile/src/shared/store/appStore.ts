import { create } from 'zustand';
import i18n from '../i18n';
import { Language } from '../types';

interface AppState {
  language: Language;
  isOnboarded: boolean;
  setLanguage: (lang: Language) => void;
  setOnboarded: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'pt',
  isOnboarded: false,
  setLanguage: (lang) => {
    i18n.changeLanguage(lang);
    set({ language: lang });
  },
  setOnboarded: (value) => set({ isOnboarded: value }),
}));
