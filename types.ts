
export enum Letter {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E'
}

export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

export interface Alternative {
  question_id: string;
  letra: Letter;
  texto: string;
  explicacao_item: string;
}

export interface Comment {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  text: string;
  isFixed: boolean;
  timestamp: string;
}

export interface Question {
  id: string;
  enunciado: string;
  disciplina: string;
  assunto: string;
  subassunto: string;
  banca: string;
  orgao: string;
  cargo: string;
  estado_municipio: string;
  ano: number;
  nivel: string;
  dificuldade: string;
  tipo: string;
  correta_letra: Letter;
  tempo_sugerido_seg: number;
  tags: string;
  fonte_url: string;
  imagem_url: string;
  comentario_oficial: string;
  alternatives: Alternative[];
  csvId?: string;
  pdfId?: string;
}

export interface User {
  id: string;
  nome: string;
  cpf: string;
  idade: number;
  cidade: string;
  estado: string;
  email: string;
  cargoPretendido: string;
  avatar?: string;
  online: boolean;
  role: UserRole;
  isTyping?: boolean;
  lastSeen?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'DIRECT' | 'GROUP';
  category?: 'CARGO' | 'DISCIPLINA' | 'LIVRE';
  members: string[]; // user ids
  privacy: 'PUBLIC' | 'PRIVATE';
  lastMessage?: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  text: string;
  image?: string;
  timestamp: string;
}

export interface Attempt {
  attempt_id: string;
  user_id: string;
  question_id: string;
  respondida_letra: Letter;
  correta: boolean;
  tempo_gasto_seg: number;
  data_hora: string;
  prova_id?: string;
  simulado_id?: string;
}

export interface VideoLesson {
  id: string;
  titulo: string;
  disciplina: string;
  assunto: string;
  descricao: string;
  url: string;
  thumb: string;
}

export interface PdfMaterial {
  id: string;
  nome: string;
  preco: number | 'Grátis';
  url: string;
  categoria: string;
}

export interface ImportedCSV {
  id: string;
  name: string;
  count: number;
  date: string;
}

export interface ImportedPDF {
  id: string;
  examName: string;
  examUrl: string;
  answerUrl: string;
  date: string;
  status: 'PROCESSING' | 'DONE' | 'ERROR';
}

export interface AdminLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'COMMENT' | 'PDF' | 'VIDEO' | 'CHAT';
  content: string;
  read: boolean;
  timestamp: string;
}
