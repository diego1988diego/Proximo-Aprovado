
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, Video, FileText, LayoutDashboard, User as UserIcon, 
  ShoppingCart, Sun, Moon, LogOut, Menu, X, MessageSquare, ShieldAlert
} from 'lucide-react';
import QuestionBank from './pages/QuestionBank';
import VideoLessons from './pages/VideoLessons';
import PdfsPage from './pages/PdfsPage';
import StudentArea from './pages/StudentArea';
import AdminDashboard from './pages/AdminDashboard';
import StorePage from './pages/StorePage';
import ChatComponent from './components/Chat';
import { db } from './db';
import { User, UserRole } from './types';

const SidebarLink = ({ to, icon: Icon, label, active, onClick }: { to: string, icon: any, label: string, active: boolean, onClick?: () => void }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-xl translate-x-1' 
        : 'text-gray-500 hover:bg-blue-50 dark:text-gray-400 dark:hover:bg-gray-800'
    }`}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-gray-400'} />
    <span className="font-bold tracking-tight text-sm uppercase">{label}</span>
  </Link>
);

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const currentUser = db.getCurrentUser();
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const isAdmin = currentUser.role === UserRole.ADMIN;

  return (
    <div className="min-h-screen flex flex-col md:flex-row dark:bg-[#0f172a] transition-colors duration-300">
      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">P</div>
          <span className="font-black text-xl text-blue-900 dark:text-blue-400 tracking-tighter">PRÓXIMO APROVADO</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600 dark:text-gray-300">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 border-r dark:border-gray-800 transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-blue-200 dark:shadow-none shadow-lg">P</div>
            <div>
              <span className="font-black text-lg text-gray-900 dark:text-white block tracking-tighter leading-none">PRÓXIMO</span>
              <span className="font-black text-lg text-blue-600 block tracking-tighter leading-none">APROVADO</span>
            </div>
          </div>

          <nav className="space-y-3 flex-1">
            <SidebarLink to="/" icon={BookOpen} label="Banco Questões" active={location.pathname === '/'} onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/videoaulas" icon={Video} label="Videoaulas" active={location.pathname === '/videoaulas'} onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/pdfs" icon={FileText} label="Materiais PDF" active={location.pathname === '/pdfs'} onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/loja" icon={ShoppingCart} label="Loja Premium" active={location.pathname === '/loja'} onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink to="/aluno" icon={UserIcon} label="Minha Conta" active={location.pathname === '/aluno'} onClick={() => setIsSidebarOpen(false)} />
            
            {isAdmin && (
              <div className="pt-6 mt-6 border-t dark:border-gray-800">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Administração</p>
                <SidebarLink to="/admin" icon={LayoutDashboard} label="Painel Admin" active={location.pathname === '/admin'} onClick={() => setIsSidebarOpen(false)} />
              </div>
            )}
          </nav>

          <div className="pt-8 border-t dark:border-gray-800 space-y-2">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all font-bold text-sm uppercase"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span>{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all font-bold text-sm uppercase">
              <LogOut size={20} />
              <span>Sair da Conta</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-[#0f172a] p-6 md:p-10">
        <Routes>
          <Route path="/" element={<QuestionBank />} />
          <Route path="/videoaulas" element={<VideoLessons />} />
          <Route path="/pdfs" element={<PdfsPage />} />
          <Route path="/loja" element={<StorePage />} />
          <Route path="/aluno" element={<StudentArea />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <div className="p-20 text-center text-red-500 font-bold flex flex-col items-center gap-4"><ShieldAlert size={64}/>ACESSO NEGADO: APENAS ADMINISTRADORES.</div>} />
        </Routes>
      </main>

      {/* WhatsApp Style Chat Floating Button */}
      <button 
        onClick={() => setShowChat(!showChat)}
        className={`fixed bottom-8 right-8 w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl z-[100] transition-all transform hover:scale-110 active:scale-90 ${showChat ? 'rotate-90 bg-red-500' : 'animate-pulse-green'}`}
      >
        {showChat ? <X size={40} /> : <MessageSquare size={40} />}
      </button>

      {/* Chat Full Modal (Exclusivo Membros) */}
      {showChat && (
        <div className="fixed inset-0 md:inset-auto md:bottom-32 md:right-8 w-full md:w-[900px] h-full md:h-[650px] bg-white dark:bg-gray-900 rounded-none md:rounded-3xl shadow-2xl z-[90] overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
           <ChatComponent currentUser={currentUser} />
        </div>
      )}
    </div>
  );
};

const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
