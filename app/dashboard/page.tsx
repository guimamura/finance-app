/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getStorageItem, removeStorageItem } from "@/lib/storage";
import QuoteCard from "@/components/QuoteCard";
import QuoteSearch from "@/components/QuoteSearch";
import { LogOut, Trash } from "lucide-react";
import QuoteChart from "@/components/QuoteChart";
import { useQuoteHistoryStore } from "@/store/quoteHistoryStore";

interface APICurrency {
  name: string;
  buy: string;
  sell: string | null;
  variation: string | null;
}
interface APIStock {
  name: string;
  points: string;
  variation: string | null;
}
interface APIBitcoin {
  name: string;
  last: string;
  variation: string | null;
}

interface Quote {
  code: string;
  name: string;
  buy: number;
  sell: number | null;
  variation: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuoteCode, setSelectedQuoteCode] = useState<string | null>(
    null
  );
  const [isChartOpen, setIsChartOpen] = useState(false);

  const setLoginTimestamp = useQuoteHistoryStore(
    (state) => state.setLoginTimestamp
  );
  const initializeHistory = useQuoteHistoryStore(
    (state) => state.initializeHistory
  );
  const updateHistory = useQuoteHistoryStore((state) => state.updateHistory);
  const clearHistory = useQuoteHistoryStore((state) => state.clearHistory);

  const fetchInitialQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/quotes");
      const data = await response.json();
      if (data?.results) {
        const initialQuotes = transformAPIDataToQuotes(data.results);
        setFilteredQuotes(initialQuotes.slice(0, 10));
        initializeHistory(
          initialQuotes.map((q) => ({ code: q.code, variation: q.variation }))
        );
      }
    } catch (error) {
      console.error("Erro ao buscar cotações iniciais", error);
    } finally {
      setLoading(false);
    }
  }, [initializeHistory]);

  useEffect(() => {
    const session = getStorageItem("session") as {
      email: string;
      expiresAt: number;
      loginTime: number;
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
    setLoginTimestamp(session.loginTime);
    fetchInitialQuotes();
    const intervalId = setInterval(fetchAndUpdateQuotes, 60000);
    return () => clearInterval(intervalId);
  }, [router, fetchInitialQuotes, setLoginTimestamp]);

  const fetchAndUpdateQuotes = useCallback(async () => {
    try {
      const response = await fetch(`/api/quotes?search=${searchTerm}`);
      const data = await response.json();
      if (data?.results) {
        const updatedQuotes = transformAPIDataToQuotes(data.results);
        setFilteredQuotes(updatedQuotes.slice(0, 10));
        updateHistory(
          updatedQuotes.map((q) => ({ code: q.code, variation: q.variation }))
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar cotações", error);
    }
  }, [searchTerm, updateHistory]);

  const transformAPIDataToQuotes = (results: {
    currencies: Record<string, APICurrency>;
    stocks: Record<string, APIStock>;
    bitcoin: Record<string, APIBitcoin>;
  }): Quote[] => {
    const quotes: Quote[] = [];
    if (results.currencies) {
      Object.entries(results.currencies)
        .filter(([key]) => key !== "source")
        .forEach(([key, value]) => {
          quotes.push({
            code: key,
            name: value.name,
            buy: parseFloat(value.buy),
            sell: value.sell ? parseFloat(value.sell) : null,
            variation: parseFloat(value.variation || "0"),
          });
        });
    }
    if (results.stocks) {
      Object.entries(results.stocks).forEach(([key, value]) => {
        quotes.push({
          code: key,
          name: value.name,
          buy: parseFloat(value.points),
          sell: null,
          variation: parseFloat(value.variation || "0"),
        });
      });
    }
    if (results.bitcoin) {
      Object.entries(results.bitcoin).forEach(([key, value]) => {
        quotes.push({
          code: key,
          name: value.name,
          buy: parseFloat(value.last),
          sell: null,
          variation: parseFloat(value.variation || "0"),
        });
      });
    }
    return quotes;
  };

  const handleSearch = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setSearchTerm(searchTerm);
    try {
      const response = await fetch(`/api/quotes?search=${searchTerm}`);
      const data = await response.json();
      if (data?.results) {
        setFilteredQuotes(transformAPIDataToQuotes(data.results).slice(0, 10));
      }
    } catch (error) {
      console.error("Erro ao buscar cotações", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    removeStorageItem("session");
    clearHistory();
    router.push("/");
  };

  const handleClearStorage = () => {
    localStorage.clear();
    clearHistory();
    router.push("/");
  };

  const openChart = (code: string) => {
    setSelectedQuoteCode(code);
    setIsChartOpen(true);
  };

  const closeChart = () => {
    setIsChartOpen(false);
    setSelectedQuoteCode(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Cotações Financeiras
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearStorage}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Trash className="h-4 w-4 mr-1" />
              Limpar Dados
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              <LogOut className="h-4 w-4 mr-2 transform rotate-180" />
              Sair
            </button>
          </div>
        </header>

        <div className="mb-4">
          <QuoteSearch onSearch={handleSearch} />
        </div>

        <div className="bg-white shadow overflow-hidden rounded-md p-4">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <li className="col-span-full py-4 text-center text-gray-500">
                Carregando cotações...
              </li>
            ) : filteredQuotes.length === 0 && searchTerm ? (
              <li className="col-span-full py-4 text-center text-gray-500">
                Nenhuma cotação encontrada para "{searchTerm}".
              </li>
            ) : filteredQuotes.length === 0 && !searchTerm ? (
              <li className="col-span-full py-4 text-center text-gray-500">
                Nenhuma cotação disponível.
              </li>
            ) : (
              filteredQuotes.map((quote) => (
                <li
                  key={quote.code}
                  className="shadow-sm rounded-md bg-gray-50 hover:bg-gray-100 transition duration-150 ease-in-out cursor-pointer"
                  onClick={() => openChart(quote.code)}
                >
                  <QuoteCard
                    name={quote.name}
                    code={quote.code}
                    bid={quote.buy?.toString() || "N/A"}
                    variation={quote.variation?.toString() || "0"}
                  />
                </li>
              ))
            )}
          </ul>
        </div>

        {isChartOpen && selectedQuoteCode && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-md shadow-lg p-6 max-w-2xl w-full">
              <h2 className="text-xl font-semibold mb-4">
                Variação de {selectedQuoteCode}
              </h2>
              <QuoteChart
                dataKey="variation"
                quoteCode={selectedQuoteCode}
                onClose={closeChart}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
