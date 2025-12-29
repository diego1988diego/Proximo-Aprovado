
import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { 
  Plus, Upload, Trash2, FileSpreadsheet, ExternalLink, Save, 
  FileUp, Image as ImageIcon, CheckCircle, AlertCircle, RefreshCw, 
  Download, Edit3, MessageSquare, Shield, Activity, FileText
} from 'lucide-react';
import { Letter, Question, ImportedCSV, ImportedPDF, VideoLesson, User, UserRole } from '../types';
import { crossReferencePdfExam } from '../geminiService';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'questions' | 'csv' | 'pdfs' | 'videos' | 'materials' | 'users' | 'logs'>('questions');
  const [csvs, setCsvs] = useState<ImportedCSV[]>(db.getImportedCSVs());
  const [questions, setQuestions] = useState<Question[]>(db.getQuestions());
  const [importedPdfs, setImportedPdfs] = useState<ImportedPDF[]>(db.getImportedPDFs());
  const [users, setUsers] = useState<User[]>(db.getUsers());

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newImport: ImportedCSV = {
        id: Date.now().toString(),
        name: file.name,
        count: 20, // Simulated
        date: new Date().toLocaleDateString()
      };
      db.saveImportedCSV(newImport);
      setCsvs(db.getImportedCSVs());
      db.saveLog({
        id: Date.now().toString(),
        userId: 'admin',
        action: 'IMPORT_CSV',
        details: `Imported file: ${file.name}`,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleDeleteCsv = (id: string) => {
    if (confirm('Deseja remover este CSV e todas as questões vinculadas?')) {
      db.removeImportedCSV(id);
      setCsvs(db.getImportedCSVs());
      setQuestions(db.getQuestions());
    }
  };

  const handlePdfCrossover = async () => {
    const mockExamText = "Questão 1: Qual a capital do Brasil? A) RJ B) SP C) BSB D) BH E) PR";
    const mockAnswerText = "1: C";
    alert('Processando PDFs com IA... Aguarde.');
    try {
      const newQuestions = await crossReferencePdfExam(mockExamText, mockAnswerText);
      const updated = [...questions, ...newQuestions];
      db.saveQuestions(updated);
      setQuestions(updated);
      alert(`${newQuestions.length} questões geradas com sucesso via PDF!`);
    } catch (err) {
      alert('Erro ao processar PDF');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">Central de Comando</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestão integral do ecossistema Próximo Aprovado</p>
        </div>
        <div className="flex gap-2">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-2">
             <Activity className="text-green-500" size={16} />
             <span className="text-xs font-bold uppercase dark:text-gray-300">Status Sistema: OK</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-2xl overflow-x-auto">
        {[
          { id: 'questions', label: 'Questões', icon: MessageSquare },
          { id: 'csv', label: 'CSVs', icon: FileSpreadsheet },
          { id: 'pdfs', label: 'PDFs Autom.', icon: RefreshCw },
          { id: 'videos', label: 'Videoaulas', icon: FileUp },
          { id: 'materials', label: 'Materiais', icon: FileText },
          { id: 'users', label: 'Usuários', icon: Shield },
          { id: 'logs', label: 'Logs', icon: Activity },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 font-black text-sm transition-all rounded-xl ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content Areas */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[600px]">
        {activeTab === 'questions' && (
          <div className="p-0">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
               <h3 className="font-bold text-lg dark:text-white">Banco Geral de Questões ({questions.length})</h3>
               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                 <Plus size={16} /> NOVA QUESTÃO
               </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs uppercase text-gray-400 font-black border-b dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4">Disciplina / Assunto</th>
                    <th className="px-6 py-4">Banca / Ano</th>
                    <th className="px-6 py-4">Status / Coments</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {questions.map(q => (
                    <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800 dark:text-gray-100">{q.disciplina}</p>
                        <p className="text-xs text-gray-500">{q.assunto}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-700 dark:text-gray-300">{q.banca}</p>
                        <p className="text-xs text-blue-600 font-bold">{q.ano}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                           <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold">ATIVA</span>
                           <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-bold">5 Coments</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Edit3 size={16} /></button>
                        <button 
                          onClick={() => { if(confirm('Excluir?')) { db.deleteQuestion(q.id); setQuestions(db.getQuestions()); } }}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                        ><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'csv' && (
          <div className="p-8 space-y-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-3xl border-2 border-dashed border-blue-200 dark:border-blue-700 text-center">
               <FileSpreadsheet size={48} className="mx-auto text-blue-600 mb-4" />
               <h3 className="text-2xl font-black mb-2 dark:text-white">Importador Inteligente CSV</h3>
               <p className="text-gray-500 max-w-md mx-auto mb-6">Arraste seu arquivo CSV. Os dados serão somados ao banco atual sem sobrescrever.</p>
               <label className="inline-flex items-center gap-2 bg-blue-600 text-white font-black px-8 py-4 rounded-2xl shadow-xl hover:bg-blue-700 cursor-pointer">
                 <Upload size={20} /> UPLOAD CSV
                 <input type="file" className="hidden" accept=".csv" onChange={handleCsvImport} />
               </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {csvs.map(csv => (
                <div key={csv.id} className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                       <FileSpreadsheet size={20} />
                    </div>
                    <div className="flex gap-2">
                       <button className="text-gray-400 hover:text-blue-500"><Download size={18}/></button>
                       <button onClick={() => handleDeleteCsv(csv.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-800 dark:text-white truncate">{csv.name}</h4>
                  <p className="text-xs text-gray-500 mb-4">{csv.date} • {csv.count} questões</p>
                  <button className="w-full py-2 bg-gray-100 dark:bg-gray-600 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-200 hover:bg-gray-200">Ver Questões</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pdfs' && (
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold dark:text-white">Gerar Questões via PDF</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-xl dark:bg-gray-700 dark:border-gray-600">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">1. Selecione o PDF da Prova</p>
                    <input type="file" className="text-sm" />
                  </div>
                  <div className="p-4 border rounded-xl dark:bg-gray-700 dark:border-gray-600">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">2. Selecione o PDF do Gabarito</p>
                    <input type="file" className="text-sm" />
                  </div>
                </div>
                <button 
                  onClick={handlePdfCrossover}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} /> PROCESSAR E CRUZAR DADOS
                </button>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border dark:border-gray-600">
                <h4 className="font-bold mb-4 dark:text-white flex items-center gap-2"><Activity size={18} /> Processamentos Recentes</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                    <div>
                      <p className="text-sm font-bold dark:text-white">Prova PC-DF 2024</p>
                      <p className="text-[10px] text-green-500 font-black">CONCLUÍDO • 120 QUESTÕES</p>
                    </div>
                    <CheckCircle className="text-green-500" size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="p-8 space-y-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border dark:border-gray-700">
              <h3 className="text-2xl font-black mb-8 dark:text-white uppercase tracking-tight">Upload de Videoaula (MP4)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Título da Aula</label>
                    <input type="text" className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Disciplina</label>
                      <input type="text" className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Assunto</label>
                      <input type="text" className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Descrição Completa</label>
                    <textarea className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:text-white" rows={3}></textarea>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-3xl p-10 text-center hover:border-blue-500 transition-all cursor-pointer">
                    <FileUp size={40} className="mx-auto text-gray-300 mb-2" />
                    <p className="font-bold text-gray-500">Selecionar arquivo MP4</p>
                  </div>
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-3xl p-10 text-center hover:border-blue-500 transition-all cursor-pointer">
                    <ImageIcon size={40} className="mx-auto text-gray-300 mb-2" />
                    <p className="font-bold text-gray-500">Thumbnail personalizada</p>
                  </div>
                </div>
              </div>
              <button className="mt-8 bg-blue-600 text-white font-black px-12 py-4 rounded-2xl shadow-xl hover:bg-blue-700 flex items-center gap-2">
                <Save size={20} /> CADASTRAR VIDEOAULA
              </button>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-0">
             <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
               <h3 className="font-bold text-lg dark:text-white">Gestão de Membros ({users.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs uppercase text-gray-400 font-black border-b dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4">Usuário</th>
                    <th className="px-6 py-4">CPF / E-mail</th>
                    <th className="px-6 py-4">Cargo Pretendido</th>
                    <th className="px-6 py-4 text-right">Controle</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar || `https://i.pravatar.cc/150?u=${u.id}`} className="w-10 h-10 rounded-full" alt=""/>
                          <div>
                            <p className="font-bold dark:text-white">{u.nome}</p>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                              {u.role}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm dark:text-gray-300">{u.cpf}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </td>
                      <td className="px-6 py-4 font-medium dark:text-gray-200">{u.cargoPretendido}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                         <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">EDITAR</button>
                         <button onClick={() => { if(confirm('Banir usuário?')) db.banUser(u.id); }} className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100">BANIR</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="p-6">
            <h3 className="text-lg font-bold mb-6 dark:text-white">Logs Administrativos de Sistema</h3>
            <div className="space-y-4">
              {db.getLogs().reverse().map(log => (
                <div key={log.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border dark:border-gray-600">
                  <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm text-blue-600">
                    <Activity size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-xs uppercase tracking-widest text-blue-600">{log.action}</span>
                      <span className="text-xs text-gray-400">• {new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-200">{log.details}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">OPERADOR: {log.userId}</p>
                  </div>
                </div>
              ))}
              {db.getLogs().length === 0 && <p className="text-gray-500 text-center py-20">Nenhum log registrado ainda.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
