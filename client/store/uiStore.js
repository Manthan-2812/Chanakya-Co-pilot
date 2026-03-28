import { create } from "zustand";

export const useUIStore = create((set) => ({
  chatbotOpen: true,
  darkMode: true,

  toggleChatbot: () =>
    set((state) => ({ chatbotOpen: !state.chatbotOpen })),

  toggleTheme: () =>
    set((state) => ({ darkMode: !state.darkMode })),
}));