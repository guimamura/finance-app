import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getStorageItem, removeStorageItem } from "@/lib/storage";

type Quote = {
  name: string;
  code: string;
  bid: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getStorageItem("user");

    if (!user) {
      router.push("/");
      return;
    }

    fetchQuotes();
  }, [router]);

  const fetchQuotes = async () => {
    try {
      const response = await fetch("/api/quotes");
      const data = await response.json();

      const currencies = data.results.currencies;

      const quotesArray = Object.entries(currencies)
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
          };
        }) as Quote[];

      setQuotes(quotesArray);
    } catch (error) {
      console.error("Erro ao buscar cotações", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeStorageItem("user");
    router.push("/");
  };

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl">Bem-vindo!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sair
        </button>
      </header>

      {loading ? (
        <p>Carregando cotações...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quotes.map((quote) => (
            <div
              key={quote.code}
              className="border p-4 rounded shadow bg-white"
            >
              <p className="font-semibold">{quote.name}</p>
              <p>Código: {quote.code}</p>
              <p>
                Valor:{" "}
                {Number(quote.bid).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
