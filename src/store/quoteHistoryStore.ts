import { create } from "zustand";

interface QuoteHistoryState {
  history: Record<string, { timestamp: number; variation: number }[]>;
  loginTimestamp: number | null;
  setLoginTimestamp: (timestamp: number) => void;
  initializeHistory: (
    initialQuotes: { code: string; variation: number }[]
  ) => void;
  updateHistory: (currentQuotes: { code: string; variation: number }[]) => void;
  getHistoryForQuote: (
    code: string
  ) => { timestamp: number; variation: number }[];
  clearHistory: () => void;
}

export const useQuoteHistoryStore = create<QuoteHistoryState>((set, get) => ({
  history: {},
  loginTimestamp: null,
  setLoginTimestamp: (timestamp) => set({ loginTimestamp: timestamp }),
  initializeHistory: (initialQuotes) => {
    const currentTime = Date.now();
    const initialHistory: Record<
      string,
      { timestamp: number; variation: number }[]
    > = {};
    initialQuotes.forEach((quote) => {
      initialHistory[quote.code] = [
        { timestamp: currentTime, variation: quote.variation },
      ];
    });
    set({ history: initialHistory });
  },
  updateHistory: (currentQuotes) => {
    const currentTime = Date.now();
    set((state) => {
      const updatedHistory = { ...state.history };
      currentQuotes.forEach((quote) => {
        if (updatedHistory[quote.code]) {
          const lastRecord =
            updatedHistory[quote.code][updatedHistory[quote.code].length - 1];
          if (!lastRecord || lastRecord.variation !== quote.variation) {
            updatedHistory[quote.code] = [
              ...updatedHistory[quote.code],
              { timestamp: currentTime, variation: quote.variation },
            ];
          }
        } else {
          updatedHistory[quote.code] = [
            { timestamp: currentTime, variation: quote.variation },
          ];
        }
      });
      return { history: updatedHistory };
    });
  },
  getHistoryForQuote: (code) => {
    const history = get().history[code] || [];
    return history.filter(
      (item) =>
        get().loginTimestamp === null || item.timestamp >= get().loginTimestamp!
    );
  },
  clearHistory: () => set({ history: {}, loginTimestamp: null }),
}));
