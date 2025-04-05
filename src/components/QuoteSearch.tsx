import { useState } from "react";

type QuoteSearchProps = {
  onSearch: (searchTerm: string) => void;
};

const QuoteSearch = ({ onSearch }: QuoteSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Buscar cotações..."
        className="border p-2 rounded w-1/3"
      />
      <button
        onClick={handleClear}
        className="ml-2 text-sm text-gray-500 underline"
      >
        Limpar Busca
      </button>
    </div>
  );
};

export default QuoteSearch;
