
import React from 'react';
import { Construction } from 'lucide-react';

const Extraction = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-6">
        <Construction className="w-24 h-24 text-gray-400 mx-auto" />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Em Construção</h1>
          <p className="text-gray-400 text-lg">
            Esta página está sendo desenvolvida e estará disponível em breve.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Extraction;
