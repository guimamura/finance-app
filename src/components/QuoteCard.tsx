type QuoteCardProps = {
  name: string;
  code: string;
  bid: string;
  variation: string;
};

export const QuoteCard = ({ name, code, bid, variation }: QuoteCardProps) => {
  const variationNumber = Number(variation);

  const getVariationText = () => {
    if (variationNumber > 0) return `▲ ${variation}%`;
    if (variationNumber < 0) return `▼ ${variation}%`;
    return `⏺ ${variation}%`;
  };

  const getVariationClass = () => {
    if (variationNumber > 0) return "text-green-600";
    if (variationNumber < 0) return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div className="border p-4 rounded shadow bg-white flex justify-between items-center">
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-500">{code}</p>
        <p className="text-lg">
          {Number(bid).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>

      <div className={`text-sm font-bold ${getVariationClass()}`}>
        {getVariationText()}
      </div>
    </div>
  );
};
