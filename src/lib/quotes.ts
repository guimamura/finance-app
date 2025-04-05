import { Currency, Stock, Bitcoin, QuoteData } from "@/types/QuoteTypes";

export const getFilteredData = async (search: string): Promise<QuoteData> => {
  try {
    const response = await fetch(
      `https://api.hgbrasil.com/finance?search=${search}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar cotações");
    }

    const data = await response.json();

    if (data && data.results) {
      const { currencies, stocks, bitcoin } = data.results;

      const filteredCurrencies = filterData(currencies, search);
      const filteredStocks = filterData(stocks, search);
      const filteredBitcoin = filterData(bitcoin, search);

      return {
        currencies: filteredCurrencies,
        stocks: filteredStocks,
        bitcoin: filteredBitcoin,
      };
    } else {
      throw new Error("Dados não encontrados na resposta da API");
    }
  } catch (error) {
    console.error("Erro ao obter cotações:", error);
    return { currencies: {}, stocks: {}, bitcoin: {} };
  }
};

function isCurrency(item: Currency | Stock | Bitcoin): item is Currency {
  return (
    (item as Currency).buy !== undefined &&
    (item as Currency).sell !== undefined
  );
}

function isBitcoin(item: Currency | Stock | Bitcoin): item is Bitcoin {
  return (item as Bitcoin).buy !== undefined;
}

const filterData = (
  data: Record<string, Currency | Stock | Bitcoin>,
  search: string
) => {
  const filteredItems = Object.entries(data)
    .filter(([key]) => key.toLowerCase().includes(search.toLowerCase()))
    .map(([key, value]) => {
      if (isCurrency(value)) {
        if (typeof value.variation === "string") {
          value.variation = parseFloat(value.variation);
        }
        if (value.buy && typeof value.buy === "string") {
          value.buy = parseFloat(value.buy);
        }
        if (value.sell && typeof value.sell === "string") {
          value.sell = parseFloat(value.sell);
        }
      } else if (isBitcoin(value)) {
        if (typeof value.variation === "string") {
          value.variation = parseFloat(value.variation);
        }
        if (value.buy && typeof value.buy === "string") {
          value.buy = parseFloat(value.buy);
        }
      }

      return { [key]: value };
    });

  return Object.assign({}, ...filteredItems);
};
