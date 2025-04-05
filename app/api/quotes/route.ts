import { NextResponse } from "next/server";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  if (!apiKey) {
    return new NextResponse(JSON.stringify({ error: "API Key not found" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
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

    return NextResponse.json({ results: filteredData });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao buscar cotações:", error.message);
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      console.error("Erro desconhecido:", error);
      return new NextResponse(
        JSON.stringify({ error: "Erro desconhecido ao buscar cotações" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
}
