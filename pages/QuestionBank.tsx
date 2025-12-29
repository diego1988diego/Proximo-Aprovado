
import React, { useState, useEffect } from 'react';
import { 
  Clock, ChevronLeft, ChevronRight, CheckCircle, XCircle, AlertCircle, MessageSquare, Send, Trash2, Pin
} from 'lucide-react';
import { db } from '../db';
import { Question, Letter, Attempt, Comment, UserRole } from '../types';

const QuestionBank: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timer, setTimer] = useState(180);
  const [attempts, setAttempts] = useState<Attempt[]>(db.getAttempts());
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const currentUser = db.getCurrentUser();
  
  // Filters
  const [filterDiscipline, setFilterDiscipline] = useState('');
  const [filterBanca, setFilterBanca] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const all = db.getQuestions();
    let filtered = all;
    if (filterDiscipline) filtered = filtered.filter(q => q.disciplina === filterDiscipline);
    if (filterBanca) filtered = filtered.filter(q => q.banca === filterBanca);
    if (filterStatus === 'solved') filtered = filtered.filter(q => attempts.some(a => a.question_id === q.id));
    else if (filterStatus === 'unsolved') filtered = filtered.filter(q => !attempts.some(a => a.question_id === q.id));
    setQuestions(filtered.sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  }, [filterDiscipline, filterBanca, filterStatus, attempts.length]);

  useEffect(() => {
    let interval: any;
    if (timer > 0 && !isAnswered) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer, isAnswered]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (currentQuestion) {
      setComments(db.getComments(currentQuestion.id));
    }
  }, [currentQuestion]);

  const handleAnswer = () => {
    if (!selectedLetter || !currentQuestion) return;
    const isCorrect = selectedLetter === currentQuestion.correta_letra;
    setIsAnswered(true);
    const attempt: Attempt = {
      attempt_id: Math.random().toString(36).substr(2, 9),
      user_id: currentUser.id,
      question_id: currentQuestion.id,
      respondida_letra: selectedLetter,
      correta: isCorrect,
      tempo_gasto_seg: 180 - timer,
      data_hora: new Date().toISOString()
    };
    db.saveAttempt(attempt);
    setAttempts(prev => [...prev, attempt]);
    if (attempts.length + 1 === 50) alert("Parabéns, você respondeu 50 questões!");
  };

  const handleSendComment = () => {
    if (!newComment.trim() || !currentQuestion) return;
    const c: Comment = {
      id: Date.now().toString(),
      questionId: currentQuestion.id,
      userId: currentUser.id,
      userName: currentUser.nome,
      text: newComment,
      isFixed: false,
      timestamp: new Date().toISOString()
    };
    db.saveComment(c);
    setComments(prev => [...prev, c]);
    setNewComment('');
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetQuestionState();
    }
  };

  const resetQuestionState = () => {
    setSelectedLetter(null);
    setIsAnswered(false);
    setTimer(180);
  };

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <AlertCircle size={48} className="mb-4 text-blue-200" />
        <p className="text-xl font-black uppercase tracking-tighter">Nenhuma questão encontrada.</p>
        <button onClick={() => { setFilterDiscipline(''); setFilterBanca(''); setFilterStatus('all'); }} className="mt-4 text-blue-600 font-bold hover:underline">RESETAR FILTROS</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
      <div className="lg:col-span-2 space-y-6">
        {/* Main Question Display */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded">{currentQuestion.banca}</span>
              <span>•</span>
              <span className="dark:text-gray-300">{currentQuestion.ano}</span>
              <span>•</span>
              <span className="dark:text-gray-300">{currentQuestion.cargo}</span>
            </div>
            <div className={`flex items-center gap-2 font-mono font-bold ${timer < 30 ? 'text-red-500 animate-pulse' : 'text-blue-600 dark:text-blue-400'}`}>
              <Clock size={18} />
              {Math.floor(timer / 60)}:{ (timer % 60).toString().padStart(2, '0') }
            </div>
          </div>

          <div className="p-8">
            <p className="text-xl text-gray-800 dark:text-gray-100 leading-relaxed mb-10 font-medium">
              {currentQuestion.enunciado}
            </p>

            <div className="space-y-3">
              {currentQuestion.alternatives.map((alt) => {
                const isSelected = selectedLetter === alt.letra;
                const isCorrect = alt.letra === currentQuestion.correta_letra;
                let borderClass = 'border-gray-100 dark:border-gray-700 hover:border-blue-400';
                let bgClass = 'bg-white dark:bg-gray-800';
                
                if (isAnswered) {
                  if (isCorrect) { borderClass = 'border-green-500'; bgClass = 'bg-green-50 dark:bg-green-900/20'; }
                  else if (isSelected) { borderClass = 'border-red-500'; bgClass = 'bg-red-50 dark:bg-red-900/20'; }
                } else if (isSelected) {
                  borderClass = 'border-blue-600'; bgClass = 'bg-blue-50 dark:bg-blue-900/20';
                }

                return (
                  <button
                    key={alt.letra}
                    disabled={isAnswered}
                    onClick={() => setSelectedLetter(alt.letra)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex gap-5 ${borderClass} ${bgClass}`}
                  >
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black flex-shrink-0 text-lg ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {alt.letra}
                    </span>
                    <span className="text-gray-700 dark:text-gray-200 font-medium mt-1">{alt.texto}</span>
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className={`mt-10 p-8 rounded-3xl border-l-8 animate-in slide-in-from-bottom duration-500 ${
                selectedLetter === currentQuestion.correta_letra 
                  ? 'bg-green-50 border-green-500 text-green-900 dark:bg-green-900/10 dark:text-green-300' 
                  : 'bg-red-50 border-red-500 text-red-900 dark:bg-red-900/10 dark:text-red-300'
              }`}>
                <h4 className="text-xl font-black mb-2 flex items-center gap-2">
                   {selectedLetter === currentQuestion.correta_letra ? <CheckCircle /> : <XCircle />}
                   {selectedLetter === currentQuestion.correta_letra ? 'Parabéns, Próximo Aprovado!' : 'Essa não... Veja a explicação:'}
                </h4>
                <p className="opacity-90 leading-relaxed">{currentQuestion.comentario_oficial}</p>
              </div>
            )}
          </div>

          <div className="p-8 bg-gray-50 dark:bg-gray-700/30 border-t dark:border-gray-700 space-y-4">
            <button 
              onClick={handleAnswer}
              disabled={!selectedLetter || isAnswered}
              className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-blue-700 disabled:opacity-30 disabled:grayscale transition-all transform active:scale-95"
            >
              RESPONDER AGORA
            </button>
            <div className="flex gap-4">
              <button onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} className="flex-1 bg-green-500 text-white font-black py-4 rounded-xl shadow-lg hover:bg-green-600 flex items-center justify-center gap-2">
                 <ChevronLeft size={20} /> ANTERIOR
              </button>
              <button onClick={nextQuestion} className="flex-1 bg-green-500 text-white font-black py-4 rounded-xl shadow-lg hover:bg-green-600 flex items-center justify-center gap-2">
                 PRÓXIMA <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* User Comments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 space-y-6">
          <h3 className="text-2xl font-black flex items-center gap-3 dark:text-white uppercase tracking-tighter">
            <MessageSquare className="text-blue-600" /> Fórum de Discussão
          </h3>
          <div className="flex gap-3">
             <input 
               type="text" 
               placeholder="Tire sua dúvida ou deixe um comentário..." 
               className="flex-1 p-4 border rounded-2xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
               value={newComment}
               onChange={e => setNewComment(e.target.value)}
               onKeyPress={e => e.key === 'Enter' && handleSendComment()}
             />
             <button onClick={handleSendComment} className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all">
                <Send size={20} />
             </button>
          </div>

          <div className="space-y-6">
            {comments.sort((a,b) => (b.isFixed ? 1 : 0) - (a.isFixed ? 1 : 0)).map(c => (
              <div key={c.id} className={`p-4 rounded-2xl border flex gap-4 ${c.isFixed ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-700' : 'bg-gray-50 border-gray-100 dark:bg-gray-700/50 dark:border-gray-600'}`}>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-blue-600 uppercase">
                  {c.userName.substring(0,1)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm dark:text-white">{c.userName} {c.isFixed && <span className="ml-2 text-[8px] bg-yellow-400 text-yellow-900 px-2 rounded-full uppercase tracking-tighter">FIXADO ADMIN</span>}</span>
                    <div className="flex gap-2">
                      {(currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.MODERATOR) && (
                        <>
                           <button onClick={() => { db.fixComment(c.id); setComments(db.getComments(currentQuestion.id)); }} className="text-gray-400 hover:text-yellow-600"><Pin size={14} /></button>
                           <button onClick={() => { db.deleteComment(c.id); setComments(db.getComments(currentQuestion.id)); }} className="text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                        </>
                      )}
                      <span className="text-[10px] text-gray-400">{new Date(c.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{c.text}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && <p className="text-center text-gray-400 py-6 italic">Ainda não há comentários nesta questão. Seja o primeiro!</p>}
          </div>
        </div>
      </div>

      {/* Sidebar Filters */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700">
           <h4 className="font-black mb-6 uppercase tracking-widest text-xs text-gray-400">Filtragem Dinâmica</h4>
           <div className="space-y-4">
              <select value={filterDiscipline} onChange={e => setFilterDiscipline(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:text-white outline-none">
                <option value="">Matérias (Todas)</option>
                <option value="Direito Constitucional">Dir. Constitucional</option>
                <option value="Direito Penal">Dir. Penal</option>
                <option value="Português">Português</option>
              </select>
              <select value={filterBanca} onChange={e => setFilterBanca(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:text-white outline-none">
                <option value="">Bancas (Todas)</option>
                <option value="CESPE / CEBRASPE">CESPE</option>
                <option value="FGV">FGV</option>
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:text-white outline-none">
                <option value="all">Status: Ver tudo</option>
                <option value="unsolved">Não Resolvidas</option>
                <option value="solved">Resolvidas</option>
              </select>
           </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl shadow-xl text-white">
           <h4 className="text-xl font-black mb-2 uppercase tracking-tight">Modo Simulado</h4>
           <p className="text-xs opacity-80 mb-6">Gere uma prova completa baseada no seu cargo pretendido.</p>
           <button className="w-full bg-white text-blue-700 font-black py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-lg">INICIAR SIMULADO</button>
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
