/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStorageItem, removeStorageItem } from "@/lib/storage";
import QuoteCard from "@/components/QuoteCard";
import QuoteSearch from "@/components/QuoteSearch";
import { LogOut, Trash } from "lucide-react";

type Quote = {
  name: string;
  code: string;
  bid: string;
  variation: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
    setLoading(true);
    try {
      const response = await fetch("/api/quotes");
      const data = await response.json();

      const currencies = data.results?.currencies || {};
      const stocks = data.results?.stocks || {};
      const bitcoin = data.results?.bitcoin || {};

      const quotesArray = [
        ...Object.entries(currencies)
          .filter(([key]) => key !== "source")
          .map(([key, value]) => ({
            code: key,
            name: (value as { name: string }).name,
            bid: (value as { buy: string }).buy,
            variation: (value as { variation: string }).variation,
          })),
        ...Object.entries(stocks).map(([key, value]) => ({
          code: key,
          name: (value as { name: string }).name,
          bid: (value as { points: string }).points,
          variation: (value as { variation: string }).variation,
        })),
        ...Object.entries(bitcoin).map(([key, value]) => ({
          code: key,
          name: (value as { name: string }).name,
          bid: (value as { last: number }).last?.toString() || "N/A",
          variation:
            (value as { variation: number }).variation?.toString() || "N/A",
        })),
      ];

      const limitedQuotes = quotesArray.slice(0, 10);
      setFilteredQuotes(limitedQuotes);
    } catch (error) {
      console.error("Erro ao buscar cotações", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm: string) => {
    setLoading(true);
    setSearchTerm(searchTerm);
    try {
      const response = await fetch(`/api/quotes?search=${searchTerm}`);
      const data = await response.json();

      const currencies = data.results?.currencies || {};
      const stocks = data.results?.stocks || {};
      const bitcoin = data.results?.bitcoin || {};

      const quotesArray = [
        ...Object.entries(currencies)
          .filter(([key]) => key !== "source")
          .map(([key, value]) => ({
            code: key,
            name: (value as { name: string }).name,
            bid: (value as { buy: string }).buy,
            variation: (value as { variation: string }).variation,
          })),
        ...Object.entries(stocks).map(([key, value]) => ({
          code: key,
          name: (value as { name: string }).name,
          bid: (value as { points: string }).points,
          variation: (value as { variation: string }).variation,
        })),
        ...Object.entries(bitcoin).map(([key, value]) => ({
          code: key,
          name: (value as { name: string }).name,
          bid: (value as { last: number }).last?.toString() || "N/A",
          variation:
            (value as { variation: number }).variation?.toString() || "N/A",
        })),
      ];

      setFilteredQuotes(quotesArray.slice(0, 10));
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
                  className="shadow-sm rounded-md bg-gray-50 hover:bg-gray-100 transition duration-150 ease-in-out"
                >
                  <QuoteCard
                    name={quote.name}
                    code={quote.code}
                    bid={quote.bid}
                    variation={quote.variation}
                  />
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
