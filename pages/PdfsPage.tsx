
import React, { useState } from 'react';
import { db } from '../db';
import { FileText, Download, Lock } from 'lucide-react';

const PdfsPage: React.FC = () => {
  const [pdfs] = useState(db.getPdfs());

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Materiais em PDF</h1>
          <p className="text-gray-500 dark:text-gray-400">Acesse apostilas, resumos e questões comentadas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pdfs.map(pdf => (
          <div key={pdf.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 group transition-all hover:shadow-lg">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl flex items-center justify-center mb-4">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{pdf.nome}</h3>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-6">{pdf.categoria}</span>
            
            <div className="flex items-center justify-between mt-auto">
              <span className={`text-xl font-black ${pdf.preco === 'Grátis' ? 'text-green-500' : 'text-blue-600'}`}>
                {typeof pdf.preco === 'number' ? `R$ ${pdf.preco.toFixed(2)}` : pdf.preco}
              </span>
              
              {pdf.preco === 'Grátis' ? (
                <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-900 transition-colors">
                  <Download size={18} /> Baixar
                </button>
              ) : (
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                  <Lock size={18} /> Comprar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PdfsPage;
