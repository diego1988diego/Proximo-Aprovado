
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db';
import { User, ChatMessage, ChatRoom, UserRole } from '../types';
import { Send, Image as ImageIcon, CheckCheck, Hash, User as UserIcon, MoreVertical, Search, Smile, Paperclip } from 'lucide-react';

const ChatComponent: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [rooms, setRooms] = useState<ChatRoom[]>(db.getChatRooms());
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(rooms[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(activeRoom ? db.getChatMessages(activeRoom.id) : []);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRoom) {
      setMessages(db.getChatMessages(activeRoom.id));
    }
  }, [activeRoom]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulated "Real-time" polling
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeRoom) {
        setMessages(db.getChatMessages(activeRoom.id));
      }
      setRooms(db.getChatRooms());
    }, 2000);
    return () => clearInterval(interval);
  }, [activeRoom]);

  const handleSend = () => {
    if (!newMessage.trim() || !activeRoom) return;
    
    const msg: ChatMessage = {
      id: Date.now().toString(),
      roomId: activeRoom.id,
      userId: currentUser.id,
      userName: currentUser.nome,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    db.saveChatMessage(msg);
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  const handleAdminDelete = (msgId: string) => {
    if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.MODERATOR) {
      db.deleteChatMessage(msgId);
      setMessages(prev => prev.filter(m => m.id !== msgId));
    }
  };

  return (
    <div className="flex h-full bg-white dark:bg-gray-900 overflow-hidden">
      {/* Rooms Sidebar */}
      <div className="w-1/3 border-r dark:border-gray-700 flex flex-col bg-[#f0f2f5] dark:bg-gray-800">
        <div className="p-4 bg-[#f0f2f5] dark:bg-gray-800 flex justify-between items-center border-b dark:border-gray-700">
          <img src={currentUser.avatar} className="w-10 h-10 rounded-full border border-gray-200" alt="" />
          <div className="flex gap-4 text-gray-500">
             <MoreVertical size={20} className="cursor-pointer" />
          </div>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Pesquisar conversas"
              className="w-full pl-10 p-2 bg-white dark:bg-gray-700 rounded-lg text-sm focus:outline-none dark:text-white"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {rooms.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())).map(room => (
            <div 
              key={room.id}
              onClick={() => setActiveRoom(room)}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                activeRoom?.id === room.id ? 'bg-[#ebebeb] dark:bg-gray-700' : 'hover:bg-[#f5f5f5] dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                {room.type === 'GROUP' ? <Hash size={24} /> : <UserIcon size={24} />}
              </div>
              <div className="flex-1 border-b dark:border-gray-700 pb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-800 dark:text-gray-100 truncate">{room.name}</span>
                  <span className="text-[10px] text-gray-400">12:45</span>
                </div>
                <p className="text-xs text-gray-500 truncate">Clique para entrar na conversa</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col bg-[#e5ddd5] dark:bg-gray-900 relative">
        {/* Chat Background Image (Mockup) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8d974919620baac.jpg')] bg-repeat"></div>

        {activeRoom ? (
          <>
            {/* Header */}
            <div className="p-3 bg-[#f0f2f5] dark:bg-gray-800 flex items-center justify-between border-b dark:border-gray-700 z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  {activeRoom.type === 'GROUP' ? <Hash size={20} /> : <UserIcon size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white leading-tight">{activeRoom.name}</h3>
                  <span className="text-[11px] text-green-500 font-bold">Online, Digitando...</span>
                </div>
              </div>
              <div className="flex gap-4 text-gray-500">
                 <Search size={20} className="cursor-pointer" />
                 <MoreVertical size={20} className="cursor-pointer" />
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 z-10 custom-scrollbar">
              {messages.map((m) => {
                const isMe = m.userId === currentUser.id;
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group relative`}>
                    <div className={`max-w-[70%] rounded-lg p-3 shadow-sm relative ${
                      isMe ? 'bg-[#dcf8c6] dark:bg-green-900/60 rounded-tr-none' : 'bg-white dark:bg-gray-800 rounded-tl-none'
                    }`}>
                      {!isMe && <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-1 uppercase">{m.userName}</p>}
                      <p className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">{m.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                         <span className="text-[9px] text-gray-400 font-medium uppercase">{m.timestamp}</span>
                         {isMe && <CheckCheck size={12} className="text-blue-500" />}
                      </div>

                      {/* Admin Delete Action */}
                      {(currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.MODERATOR) && (
                        <button 
                          onClick={() => handleAdminDelete(m.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer / Input */}
            <div className="p-3 bg-[#f0f2f5] dark:bg-gray-800 flex items-center gap-3 z-10 border-t dark:border-gray-700">
              <button className="text-gray-500 hover:text-gray-700"><Smile size={24} /></button>
              <button className="text-gray-500 hover:text-gray-700"><Paperclip size={24} /></button>
              <input 
                type="text" 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Mensagem"
                className="flex-1 p-2.5 bg-white dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none shadow-sm"
              />
              <button 
                onClick={handleSend}
                className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 active:scale-95 transition-all"
              >
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-24 h-24 bg-gray-200/50 rounded-full flex items-center justify-center mb-4">
               <Hash size={48} />
            </div>
            <h2 className="text-xl font-bold">Chat Membros</h2>
            <p>Selecione uma sala para começar a estudar em grupo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Trash2 = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

export default ChatComponent;
