import { create } from "zustand";

interface QuoteHistoryState {
  loginTimestamp: number | null;
  history: Record<string, { timestamp: number; variation: number }[]>;
  setLoginTimestamp: (timestamp: number) => void;
  initializeHistory: (
    initialQuotes: { code: string; variation: number }[]
  ) => void;
  updateHistory: (updatedQuotes: { code: string; variation: number }[]) => void;
  getHistoryForQuote: (
    code: string
  ) => { timestamp: number; variation: number }[];
  clearHistory: () => void;
}

export const useQuoteHistoryStore = create<QuoteHistoryState>((set, get) => ({
  loginTimestamp: null,
  history: {},
  setLoginTimestamp: (timestamp) => set({ loginTimestamp: timestamp }),
  initializeHistory: (initialQuotes) => {
    const initialHistory: Record<
      string,
      { timestamp: number; variation: number }[]
    > = {};
    const now = Date.now();
    initialQuotes.forEach((quote) => {
      initialHistory[quote.code] = [
        { timestamp: now, variation: quote.variation },
      ];
    });
    set({ history: initialHistory });
  },
  updateHistory: (updatedQuotes) => {
    set((state) => {
      const newHistory = { ...state.history };
      const now = Date.now();
      updatedQuotes.forEach((quote) => {
        if (newHistory[quote.code]) {
          newHistory[quote.code] = [
            ...newHistory[quote.code],
            { timestamp: now, variation: quote.variation },
          ];
        } else {
          newHistory[quote.code] = [
            { timestamp: now, variation: quote.variation },
          ];
        }
      });
      return { history: newHistory };
    });
  },
  getHistoryForQuote: (code) => get().history[code] || [],
  clearHistory: () => set({ history: {} }),
}));
