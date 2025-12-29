
import React, { useState } from 'react';
import { db } from '../db';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Trophy, Target, History, Star, TrendingUp, MapPin, Briefcase, Mail, CreditCard, User } from 'lucide-react';

const StudentArea: React.FC = () => {
  const [user] = useState(db.getCurrentUser());
  const [attempts] = useState(db.getAttempts());
  
  const correctCount = attempts.filter(a => a.correta).length;
  const wrongCount = attempts.length - correctCount;
  const accuracy = attempts.length > 0 ? (correctCount / attempts.length) * 100 : 0;

  const pieData = [
    { name: 'Acertos', value: correctCount },
    { name: 'Erros', value: wrongCount },
  ];
  const COLORS = ['#22c55e', '#ef4444'];

  const barData = [
    { name: 'Seg', total: 12 },
    { name: 'Ter', total: 45 },
    { name: 'Qua', total: 30 },
    { name: 'Qui', total: 80 },
    { name: 'Sex', total: 55 },
    { name: 'Sáb', total: 20 },
    { name: 'Dom', total: 10 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-8 items-center">
        <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 border-4 border-white dark:border-gray-700 shadow-xl overflow-hidden relative group">
          <User size={64} />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity cursor-pointer">EDITAR</div>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-3xl font-black text-gray-800 dark:text-white">{user.nome}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><Mail size={16}/> {user.email}</span>
            <span className="flex items-center gap-1"><MapPin size={16}/> {user.cidade}/{user.estado}</span>
            <span className="flex items-center gap-1"><Briefcase size={16}/> {user.cargoPretendido}</span>
            <span className="flex items-center gap-1"><CreditCard size={16}/> {user.cpf}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl min-w-[100px]">
            <p className="text-xs font-bold text-green-600 uppercase">Acertos</p>
            <p className="text-2xl font-black text-green-700 dark:text-green-400">{correctCount}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl min-w-[100px]">
            <p className="text-xs font-bold text-blue-600 uppercase">Precisão</p>
            <p className="text-2xl font-black text-blue-700 dark:text-blue-400">{accuracy.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white"><TrendingUp size={20} className="text-blue-500"/> Desempenho Semanal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white"><Target size={20} className="text-red-500"/> Total Geral</h3>
          <div className="h-64 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black dark:text-white">{attempts.length}</span>
              <span className="text-xs text-gray-400 font-bold uppercase">Questões</span>
            </div>
          </div>
        </div>
      </div>

      {/* History and Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white"><History size={20} className="text-orange-500"/> Histórico Recente</h3>
          <div className="space-y-4">
            {attempts.length === 0 ? (
              <p className="text-gray-500 text-center py-10">Você ainda não resolveu questões.</p>
            ) : (
              attempts.slice(-5).reverse().map(a => (
                <div key={a.attempt_id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${a.correta ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {a.correta ? <Trophy size={20}/> : <Target size={20}/>}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-100">Questão #{a.question_id.slice(0,4)}</p>
                      <p className="text-xs text-gray-500">{new Date(a.data_hora).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`font-bold ${a.correta ? 'text-green-600' : 'text-red-600'}`}>
                    {a.correta ? 'ACERTO' : 'ERRO'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white"><Star size={20} className="text-yellow-500"/> Ranking Policial</h3>
          <div className="space-y-4">
            {[
              { pos: 1, name: 'Pedro Souza', pts: 1240, active: false },
              { pos: 2, name: 'João Aprovado (Você)', pts: 980, active: true },
              { pos: 3, name: 'Carla Silva', pts: 850, active: false },
              { pos: 4, name: 'Marcos Oliver', pts: 720, active: false },
              { pos: 5, name: 'Julia Reis', pts: 610, active: false },
            ].map(r => (
              <div key={r.pos} className={`flex items-center justify-between p-4 rounded-xl ${r.active ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100'}`}>
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${r.active ? 'bg-white/20' : 'bg-white dark:bg-gray-600 shadow-sm'}`}>
                    {r.pos}
                  </span>
                  <span className="font-bold">{r.name}</span>
                </div>
                <span className="font-black">{r.pts} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentArea;
