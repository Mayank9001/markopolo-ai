import React, { useState, useEffect } from "react";

const SearchBar = ({ onSearch }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(value);
    }, 500);
    return () => clearTimeout(timeout);
  }, [value, onSearch]);

  return (
    <div className="w-full flex justify-end mb-4">
      <div className="relative w-full sm:max-w-sm">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default SearchBar;
