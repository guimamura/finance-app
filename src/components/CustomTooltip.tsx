/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";

import React from "react";
import { TooltipProps } from "recharts";

interface CustomTooltipProps extends TooltipProps<number, string> {}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length > 0) {
    const formattedVariation =
      payload[0].value?.toLocaleString("pt-BR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 3,
      }) + "%";

    const formattedTime = new Date(label).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="recharts-custom-tooltip bg-white p-2 border rounded shadow-md text-sm">
        <p className="label text-gray-800">{`${formattedTime}`}</p>
        <p className="intro text-blue-600">{`Variação: ${formattedVariation}`}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
