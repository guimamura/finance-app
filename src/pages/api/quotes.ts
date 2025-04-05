import type { NextApiRequest, NextApiResponse } from "next";

type Currency = {
  name: string;
  buy: string;
  sell: string | null;
  variation: string | null;
};

type Stock = {
  name: string;
  points: string;
  variation: string | null;
};

type Bitcoin = {
  name: string;
  last: string;
  variation: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const search = Array.isArray(req.query.search)
    ? req.query.search[0]
    : req.query.search || "";

  if (!apiKey) {
    return res.status(500).json({ error: "API Key not found" });
  }

  try {
    const response = await fetch(
      `https://api.hgbrasil.com/finance?format=json-cors&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch quotes");
    }

    const data = await response.json();

    if (!data || !data.results) {
      throw new Error("A resposta da API não contém os dados esperados.");
    }

    const { currencies, stocks, bitcoin } = data.results;

    if (!currencies || !stocks || !bitcoin) {
      throw new Error("Faltando dados em currencies, stocks ou bitcoin.");
    }

    const filteredCurrencies = Object.entries(currencies).filter(
      ([key, value]) => {
        const currency = value as Currency;
        const normalizedSearch = search.toLowerCase();
        return (
          key.toLowerCase().includes(normalizedSearch) ||
          (currency.name &&
            currency.name.toLowerCase().includes(normalizedSearch)) ||
          (currency.variation &&
            typeof currency.variation === "string" &&
            currency.variation.toLowerCase().includes(normalizedSearch))
        );
      }
    );

    const filteredStocks = Object.entries(stocks).filter(([key, value]) => {
      const stock = value as Stock;
      const normalizedSearch = search.toLowerCase();
      return (
        key.toLowerCase().includes(normalizedSearch) ||
        (stock.name && stock.name.toLowerCase().includes(normalizedSearch)) ||
        (stock.variation &&
          typeof stock.variation === "string" &&
          stock.variation.toLowerCase().includes(normalizedSearch))
      );
    });

    const filteredBitcoin = Object.entries(bitcoin).filter(([key, value]) => {
      const btc = value as Bitcoin;
      const normalizedSearch = search.toLowerCase();
      return (
        key.toLowerCase().includes(normalizedSearch) ||
        (btc.name && btc.name.toLowerCase().includes(normalizedSearch)) ||
        (btc.variation &&
          typeof btc.variation === "string" &&
          btc.variation.toLowerCase().includes(normalizedSearch))
      );
    });

    const filteredData = {
      currencies: filteredCurrencies.reduce<{ [key: string]: Currency }>(
        (acc, [key, value]) => {
          acc[key] = value as Currency;
          return acc;
        },
        {}
      ),
      stocks: filteredStocks.reduce<{ [key: string]: Stock }>(
        (acc, [key, value]) => {
          acc[key] = value as Stock;
          return acc;
        },
        {}
      ),
      bitcoin: filteredBitcoin.reduce<{ [key: string]: Bitcoin }>(
        (acc, [key, value]) => {
          acc[key] = value as Bitcoin;
          return acc;
        },
        {}
      ),
    };

    res.status(200).json({ results: filteredData });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao buscar cotações:", error.message);
      res.status(500).json({ error: error.message });
    } else {
      console.error("Erro desconhecido:", error);
      res.status(500).json({ error: "Erro desconhecido ao buscar cotações" });
    }
  }
}
