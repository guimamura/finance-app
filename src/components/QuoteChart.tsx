"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuoteHistoryStore } from "@/store/quoteHistoryStore";

interface QuoteChartProps {
  dataKey: string;
  quoteCode: string | null;
  onClose: () => void;
}

const QuoteChart = ({ dataKey, quoteCode, onClose }: QuoteChartProps) => {
  const getHistoryForQuote = useQuoteHistoryStore(
    (state) => state.getHistoryForQuote
  );
  const [chartData, setChartData] = useState<
    { timestamp: number; variation: number }[]
  >([]);

  useEffect(() => {
    if (quoteCode) {
      setChartData(getHistoryForQuote(quoteCode));
    }
  }, [quoteCode, getHistoryForQuote]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (quoteCode) {
        setChartData(getHistoryForQuote(quoteCode));
      }
    }, 5000); // Atualiza a cada 5 segundos (ajuste conforme necessário)

    return () => clearInterval(intervalId);
  }, [quoteCode, getHistoryForQuote]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickFormatter={formatDate} />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip labelFormatter={(value) => formatDate(value)} />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default QuoteChart;
