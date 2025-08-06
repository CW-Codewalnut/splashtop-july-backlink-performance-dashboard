
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Splashtop Backlink & Keyword Performance
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Country: US | Source: GA, moz, GSC
        </p>
      </div>
    </header>
  );
};

export default Header;
