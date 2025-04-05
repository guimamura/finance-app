export interface Quote {
  code: string;
  name: string;
  buy: number;
  sell: number | null;
  variation: number;
}
