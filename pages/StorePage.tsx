
import React, { useState } from 'react';
import { ShoppingBag, CreditCard, ShieldCheck, Zap } from 'lucide-react';

const StorePage: React.FC = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const products = [
    { id: 'p1', name: 'Plano Anual Diamante', price: 297.00, features: ['Banco de Questões Ilimitado', 'Todas as Videoaulas', 'Monitoria Personalizada', 'Ranking VIP'] },
    { id: 'p2', name: 'Combo Polícia Federal', price: 147.00, features: ['Foco total em Edital PF', 'Mapas Mentais', 'Simulados Estilo Cespe'] },
    { id: 'p3', name: 'Pack 500 Questões Comentadas', price: 47.00, features: ['Acesso Imediato', 'Comentários em Vídeo'] }
  ];

  const handleBuy = (prod: any) => {
    setSelectedProduct(prod);
    setShowCheckout(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white flex items-center justify-center gap-3">
          <Zap className="text-yellow-400 fill-yellow-400" /> Loja Próximo Aprovado
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Turbine seus estudos com os melhores materiais.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border-2 border-transparent hover:border-blue-500 transition-all flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{p.name}</h2>
            <div className="mb-8">
              <span className="text-4xl font-black text-blue-600">R$ {p.price.toFixed(2)}</span>
            </div>
            
            <ul className="space-y-4 mb-10 flex-1">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <ShieldCheck size={20} className="text-green-500" /> {f}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleBuy(p)}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} /> COMPRAR AGORA
            </button>
          </div>
        ))}
      </div>

      {showCheckout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold dark:text-white">Finalizar Compra</h3>
                <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-gray-600">×</button>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <p className="text-sm text-blue-600 dark:text-blue-300 font-bold uppercase mb-1">Produto Selecionado</p>
                <div className="flex justify-between font-bold dark:text-white">
                  <span>{selectedProduct.name}</span>
                  <span>R$ {selectedProduct.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input type="text" placeholder="Número do Cartão" className="w-full pl-11 p-3.5 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM/AA" className="w-full p-3.5 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  <input type="text" placeholder="CVV" className="w-full p-3.5 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
              </div>

              <button 
                onClick={() => { alert('Pagamento simulado com sucesso!'); setShowCheckout(false); }}
                className="w-full bg-green-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-green-600"
              >
                CONFIRMAR PAGAMENTO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorePage;
