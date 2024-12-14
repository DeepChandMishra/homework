import React, { useState } from 'react';

const SearchInput = ({ searchQuery, onSearch }) => {
  const [query, setQuery] = useState(searchQuery);

  // Handle search on button click
  const handleSearchClick = () => {
    onSearch(query); // Trigger search when the icon is clicked
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Update query state as user types
        className="p-2 w-full border-2 border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Search"
      />

      {/* Search Icon (Unicode character) */}
      <button
        type="button"
        onClick={handleSearchClick}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      >
        {/* Unicode Search Icon: Magnifying Glass */}
        <span className="text-xl">&#128269;</span> 
      </button>
    </div>
  );
};

export default SearchInput;
