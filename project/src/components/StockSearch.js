import React, { useState } from 'react';

function StockSearch({ onSearch }) {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(symbol);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter BSE symbol (e.g., RELIANCE)"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default StockSearch;
