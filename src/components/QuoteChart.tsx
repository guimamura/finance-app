"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface QuoteChartProps {
  data: { timestamp: number; variation: number }[];
  dataKey: string;
}

const QuoteChart = ({ data, dataKey }: QuoteChartProps) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
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
  );
};

export default QuoteChart;
