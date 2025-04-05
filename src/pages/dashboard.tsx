import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getStorageItem, removeStorageItem } from "@/lib/storage";
import QuoteCard from "@/components/QuoteCard";
import QuoteSearch from "@/components/QuoteSearch";

type Quote = {
  name: string;
  code: string;
  bid: string;
  variation: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getStorageItem("session") as {
      email: string;
      expiresAt: number;
    };

    if (!session) {
      router.push("/");
      return;
    }

    if (new Date().getTime() > session.expiresAt) {
      removeStorageItem("session");
      router.push("/");
      return;
    }

    fetchQuotes();
  }, [router]);

  const fetchQuotes = async () => {
    try {
      const response = await fetch("/api/quotes");
      const data = await response.json();
      console.log("Dados da API:", data);

      const currencies = data.results.currencies;
      const stocks = data.results.stocks;
      const bitcoin = data.results.bitcoin;

      const quotesArray = [
        ...Object.entries(currencies)
          .filter(([key]) => key !== "source")
          .map(([key, value]) => {
            const currency = value as {
              name: string;
              buy: string;
              sell: string;
              variation: string;
            };

            return {
              code: key,
              name: currency.name,
              bid: currency.buy,
              variation: currency.variation,
            };
          }),
        ...Object.entries(stocks).map(([key, value]) => {
          const stock = value as {
            name: string;
            points: string;
            variation: string;
          };

          return {
            code: key,
            name: stock.name,
            bid: stock.points,
            variation: stock.variation,
          };
        }),
        ...Object.entries(bitcoin).map(([key, value]) => {
          const btc = value as {
            name: string;
            last: number;
            variation: number;
          };

          return {
            code: key,
            name: btc.name,
            bid: btc.last.toString(),
            variation: btc.variation.toString(),
          };
        }),
      ];

      const limitedQuotes = quotesArray.slice(0, 10);
      setQuotes(limitedQuotes);
      setFilteredQuotes(limitedQuotes);
    } catch (error) {
      console.error("Erro ao buscar cotações", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm: string) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/quotes?search=${searchTerm}`);
      const data = await response.json();
      console.log("Dados filtrados da API:", data);

      const currencies = data.results.currencies;
      const stocks = data.results.stocks;
      const bitcoin = data.results.bitcoin;

      const quotesArray = [
        ...Object.entries(currencies)
          .filter(([key]) => key !== "source")
          .map(([key, value]) => {
            const currency = value as {
              name: string;
              buy: string;
              sell: string;
              variation: string;
            };

            return {
              code: key,
              name: currency.name,
              bid: currency.buy,
              variation: currency.variation,
            };
          }),
        ...Object.entries(stocks).map(([key, value]) => {
          const stock = value as {
            name: string;
            points: string;
            variation: string;
          };

          return {
            code: key,
            name: stock.name,
            bid: stock.points,
            variation: stock.variation,
          };
        }),
        ...Object.entries(bitcoin).map(([key, value]) => {
          const btc = value as {
            name: string;
            last: number;
            variation: number;
          };

          return {
            code: key,
            name: btc.name,
            bid: btc.last.toString(),
            variation: btc.variation.toString(),
          };
        }),
      ];

      const limitedQuotes = quotesArray.slice(0, 10);
      setFilteredQuotes(limitedQuotes);
    } catch (error) {
      console.error("Erro ao buscar cotações", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleClearStorage = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl">Bem-vindo!</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearStorage}
            className="text-sm text-gray-500 underline"
          >
            Limpar localStorage
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sair
          </button>
        </div>
      </header>

      <QuoteSearch onSearch={handleSearch} />

      {loading ? (
        <p>Carregando cotações...</p>
      ) : filteredQuotes.length === 0 ? (
        <p>Nenhuma cotação encontrada para o termo buscado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuotes.map((quote) => (
            <QuoteCard
              key={quote.code}
              name={quote.name}
              code={quote.code}
              bid={quote.bid}
              variation={quote.variation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
