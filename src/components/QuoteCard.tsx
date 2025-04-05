import { ArrowUp, ArrowDown, Minus } from "lucide-react";

type QuoteCardProps = {
  name: string;
  code: string;
  bid: string;
  variation: string;
};

const QuoteCard = ({ name, code, bid, variation }: QuoteCardProps) => {
  const variationNumber = Number(variation);

  const getVariationIndicator = () => {
    if (variationNumber > 0)
      return <ArrowUp className="h-4 w-4 text-green-600 inline-block mr-1" />;
    if (variationNumber < 0)
      return <ArrowDown className="h-4 w-4 text-red-600 inline-block mr-1" />;
    return <Minus className="h-4 w-4 text-gray-500 inline-block mr-1" />;
  };

  const getVariationClass = () => {
    if (variationNumber > 0) return "text-green-600";
    if (variationNumber < 0) return "text-red-600";
    return "text-gray-900";
  };

  return (
    <div className="bg-white rounded-md shadow-md p-4 flex justify-between items-center">
      <div className="flex flex-col space-y-1">
        <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600">{code}</p>
        <p className={`text-xl font-bold ${getVariationClass()}`}>
          {Number(bid).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      <div className="flex items-center">
        {getVariationIndicator()}
        <span
          className={`text-sm font-semibold ${
            variationNumber > 0
              ? "text-green-600"
              : variationNumber < 0
              ? "text-red-600"
              : "text-gray-500"
          }`}
        >
          {variation}%
        </span>
      </div>
    </div>
  );
};

export default QuoteCard;
