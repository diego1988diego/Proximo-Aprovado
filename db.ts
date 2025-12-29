
import { 
  Question, Letter, User, Attempt, VideoLesson, PdfMaterial, 
  ChatMessage, ImportedCSV, UserRole, ChatRoom, Comment, 
  AdminLog, Notification, ImportedPDF 
} from './types';

const STORAGE_KEYS = {
  QUESTIONS: 'pa_questions',
  ATTEMPTS: 'pa_attempts',
  USERS: 'pa_users',
  VIDEOS: 'pa_videos',
  PDFS: 'pa_pdfs',
  CHAT_MESSAGES: 'pa_chat_msgs',
  CHAT_ROOMS: 'pa_chat_rooms',
  CSVS: 'pa_csvs',
  PDFS_IMPORT: 'pa_pdfs_import',
  COMMENTS: 'pa_comments',
  LOGS: 'pa_logs',
  NOTIFICATIONS: 'pa_notifications',
  CURRENT_USER: 'pa_current_user'
};

const get = <T,>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const set = <T,>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const seedQuestions: Question[] = [
  {
    id: '1',
    enunciado: 'Sobre os princípios fundamentais da República Federativa do Brasil, assinale a alternativa que apresenta um objetivo fundamental:',
    disciplina: 'Direito Constitucional',
    assunto: 'Princípios Fundamentais',
    subassunto: 'Objetivos da República',
    banca: 'CESPE / CEBRASPE',
    orgao: 'Polícia Federal',
    cargo: 'Agente',
    estado_municipio: 'Brasil',
    ano: 2024,
    nivel: 'Superior',
    dificuldade: 'Média',
    tipo: 'Múltipla Escolha',
    correta_letra: Letter.B,
    tempo_sugerido_seg: 180,
    tags: 'Constituição, Direitos',
    fonte_url: '',
    imagem_url: '',
    comentario_oficial: 'O Art. 3º da CF/88 lista os objetivos fundamentais.',
    alternatives: [
      { question_id: '1', letra: Letter.A, texto: 'A soberania.', explicacao_item: 'Fundamento.' },
      { question_id: '1', letra: Letter.B, texto: 'Garantir o desenvolvimento nacional.', explicacao_item: 'Correto! Art. 3º, II.' },
      { question_id: '1', letra: Letter.C, texto: 'A dignidade da pessoa humana.', explicacao_item: 'Fundamento.' },
      { question_id: '1', letra: Letter.D, texto: 'O pluralismo político.', explicacao_item: 'Fundamento.' },
      { question_id: '1', letra: Letter.E, texto: 'Independência nacional.', explicacao_item: 'Princípio internacional.' }
    ]
  }
];

const seedRooms: ChatRoom[] = [
  { id: 'geral', name: 'Geral (Membros)', type: 'GROUP', category: 'LIVRE', members: [], privacy: 'PUBLIC' },
  { id: 'pf', name: 'Polícia Federal', type: 'GROUP', category: 'CARGO', members: [], privacy: 'PUBLIC' },
  { id: 'const', name: 'Dir. Constitucional', type: 'GROUP', category: 'DISCIPLINA', members: [], privacy: 'PUBLIC' }
];

export const db = {
  getQuestions: () => get<Question[]>(STORAGE_KEYS.QUESTIONS, seedQuestions),
  saveQuestions: (qs: Question[]) => set(STORAGE_KEYS.QUESTIONS, qs),
  deleteQuestion: (id: string) => {
    const qs = db.getQuestions();
    set(STORAGE_KEYS.QUESTIONS, qs.filter(q => q.id !== id));
  },
  
  getAttempts: () => get<Attempt[]>(STORAGE_KEYS.ATTEMPTS, []),
  saveAttempt: (attempt: Attempt) => {
    const attempts = get<Attempt[]>(STORAGE_KEYS.ATTEMPTS, []);
    attempts.push(attempt);
    set(STORAGE_KEYS.ATTEMPTS, attempts);
  },

  getVideos: () => get<VideoLesson[]>(STORAGE_KEYS.VIDEOS, [
    { id: '1', titulo: 'Direito Penal - Teoria do Crime', disciplina: 'Direito Penal', assunto: 'Teoria do Crime', descricao: 'Aula completa sobre tipicidade e ilicitude.', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumb: 'https://picsum.photos/400/225?random=1' }
  ]),
  saveVideo: (v: VideoLesson) => {
    const videos = get<VideoLesson[]>(STORAGE_KEYS.VIDEOS, []);
    videos.push(v);
    set(STORAGE_KEYS.VIDEOS, videos);
  },
  deleteVideo: (id: string) => {
    const vs = db.getVideos();
    set(STORAGE_KEYS.VIDEOS, vs.filter(v => v.id !== id));
  },

  getPdfs: () => get<PdfMaterial[]>(STORAGE_KEYS.PDFS, [
    { id: '1', nome: 'E-book Polícia Civil - Questões Comentadas', preco: 49.90, url: '#', categoria: 'E-books' },
    { id: '2', nome: 'Vade Mecum Policial 2024', preco: 'Grátis', url: '#', categoria: 'Leis' }
  ]),
  savePdf: (p: PdfMaterial) => {
    const pdfs = get<PdfMaterial[]>(STORAGE_KEYS.PDFS, []);
    pdfs.push(p);
    set(STORAGE_KEYS.PDFS, pdfs);
  },
  deletePdf: (id: string) => {
    const ps = db.getPdfs();
    set(STORAGE_KEYS.PDFS, ps.filter(p => p.id !== id));
  },

  // New Chat System
  getChatRooms: () => get<ChatRoom[]>(STORAGE_KEYS.CHAT_ROOMS, seedRooms),
  saveChatRoom: (room: ChatRoom) => {
    const rooms = db.getChatRooms();
    rooms.push(room);
    set(STORAGE_KEYS.CHAT_ROOMS, rooms);
  },
  deleteChatRoom: (id: string) => {
    const rooms = db.getChatRooms().filter(r => r.id !== id);
    set(STORAGE_KEYS.CHAT_ROOMS, rooms);
  },
  getChatMessages: (roomId: string) => get<ChatMessage[]>(STORAGE_KEYS.CHAT_MESSAGES, []).filter(m => m.roomId === roomId),
  saveChatMessage: (msg: ChatMessage) => {
    const msgs = get<ChatMessage[]>(STORAGE_KEYS.CHAT_MESSAGES, []);
    msgs.push(msg);
    set(STORAGE_KEYS.CHAT_MESSAGES, msgs);
  },
  deleteChatMessage: (id: string) => {
    const msgs = get<ChatMessage[]>(STORAGE_KEYS.CHAT_MESSAGES, []).filter(m => m.id !== id);
    set(STORAGE_KEYS.CHAT_MESSAGES, msgs);
  },

  // Admin and Imports
  getImportedCSVs: () => get<ImportedCSV[]>(STORAGE_KEYS.CSVS, []),
  saveImportedCSV: (csv: ImportedCSV) => {
    const csvs = db.getImportedCSVs();
    csvs.push(csv);
    set(STORAGE_KEYS.CSVS, csvs);
  },
  removeImportedCSV: (id: string) => {
    const csvs = db.getImportedCSVs().filter(c => c.id !== id);
    set(STORAGE_KEYS.CSVS, csvs);
    // Also remove questions
    const qs = db.getQuestions().filter(q => q.csvId !== id);
    db.saveQuestions(qs);
  },

  getImportedPDFs: () => get<ImportedPDF[]>(STORAGE_KEYS.PDFS_IMPORT, []),
  saveImportedPDF: (p: ImportedPDF) => {
    const ps = db.getImportedPDFs();
    ps.push(p);
    set(STORAGE_KEYS.PDFS_IMPORT, ps);
  },

  getComments: (questionId?: string) => {
    const all = get<Comment[]>(STORAGE_KEYS.COMMENTS, []);
    return questionId ? all.filter(c => c.questionId === questionId) : all;
  },
  saveComment: (c: Comment) => {
    const cs = get<Comment[]>(STORAGE_KEYS.COMMENTS, []);
    cs.push(c);
    set(STORAGE_KEYS.COMMENTS, cs);
  },
  deleteComment: (id: string) => {
    const cs = get<Comment[]>(STORAGE_KEYS.COMMENTS, []).filter(c => c.id !== id);
    set(STORAGE_KEYS.COMMENTS, cs);
  },
  fixComment: (id: string) => {
    const cs = get<Comment[]>(STORAGE_KEYS.COMMENTS, []).map(c => 
      c.id === id ? { ...c, isFixed: !c.isFixed } : c
    );
    set(STORAGE_KEYS.COMMENTS, cs);
  },

  getLogs: () => get<AdminLog[]>(STORAGE_KEYS.LOGS, []),
  saveLog: (log: AdminLog) => {
    const logs = db.getLogs();
    logs.push(log);
    set(STORAGE_KEYS.LOGS, logs);
  },

  getNotifications: (userId: string) => get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []).filter(n => n.userId === userId),
  saveNotification: (n: Notification) => {
    const ns = get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    ns.push(n);
    set(STORAGE_KEYS.NOTIFICATIONS, ns);
  },

  getCurrentUser: () => get<User>(STORAGE_KEYS.CURRENT_USER, {
    id: 'user1',
    nome: 'João Aprovado',
    cpf: '123.456.789-00',
    idade: 28,
    cidade: 'Brasília',
    estado: 'DF',
    email: 'joao@concurso.com',
    cargoPretendido: 'Agente da Polícia Federal',
    online: true,
    role: UserRole.ADMIN,
    avatar: 'https://i.pravatar.cc/150?u=user1'
  }),
  saveCurrentUser: (user: User) => set(STORAGE_KEYS.CURRENT_USER, user),

  getUsers: () => get<User[]>(STORAGE_KEYS.USERS, [
    { id: 'user1', nome: 'João Aprovado', role: UserRole.ADMIN, online: true, cpf: '123', idade: 28, cidade: 'DF', estado: 'DF', email: 'joao@pa.com', cargoPretendido: 'PF' },
    { id: 'user2', nome: 'Maria Concurseira', role: UserRole.USER, online: false, cpf: '456', idade: 25, cidade: 'SP', estado: 'SP', email: 'maria@pa.com', cargoPretendido: 'PC' }
  ]),
  banUser: (id: string) => {
    // Logic for banning could be removing or adding a status
    console.log('User banned:', id);
  }
};
