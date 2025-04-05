import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";

type QuoteSearchProps = {
  onSearch: (searchTerm: string) => void;
};

const QuoteSearch = ({ onSearch }: QuoteSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchTerm(value);
      onSearch(value);
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setSearchTerm("");
    onSearch("");
  }, [onSearch]);

  return (
    <div className="relative rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Buscar cotações..."
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      />
      {searchTerm && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuoteSearch;
