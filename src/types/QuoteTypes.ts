export interface Currency {
  name: string;
  buy: number;
  sell: number | null;
  variation: number;
}

export interface Stock {
  name: string;
  location: string;
  points: number;
  variation: number;
}

export interface Bitcoin {
  name: string;
  buy: number;
  variation: number;
}

export interface QuoteData {
  currencies: Record<string, Currency>;
  stocks: Record<string, Stock>;
  bitcoin: Record<string, Bitcoin>;
}
