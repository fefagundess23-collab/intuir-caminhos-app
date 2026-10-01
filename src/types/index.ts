export type PracticeCategory = 'respiracao' | 'apoio' | 'desaceleracao' | 'presenca';

/**
 * Estrutura de dados completa para cada Prática Corporal Somática.
 * Atende tanto às convenções em português quanto às propriedades estruturadas do player.
 */
export interface Practice {
  // Identificador único
  id: string;
  dayNumber: number; // 1 a 21

  // Título e identificação
  titulo: string;
  title: string;
  subtitle?: string;

  // Descrição acolhedora da prática
  descricao: string;
  description: string;
  practiceDescription?: string; // alias retrocompatível

  // Duração
  duracao: string;
  durationDisplay: string;
  durationMinutes: number;
  durationSeconds?: number;

  // Categoria somática
  categoria: PracticeCategory;
  category: PracticeCategory;

  // Contexto de uso (Quando usar)
  quandoUsar: string;
  whenToUse: string;

  // Instruções e frases-guia para condução corporal
  instrucoes: string[];
  instructions: string[];
  guidedPhrases: string[];

  // Arquivo de áudio (local em /public/audio/ ou URL remota como Firebase Storage)
  arquivoAudio: string;
  audioUrl: string;

  // Arquivo de vídeo opcional para expansão futura
  arquivoVideo?: string;
  videoUrl?: string;

  // Pergunta reflexiva pós-prática
  perguntaPosPratica: string;
  reflectionQuestion: string;

  // Metadados adicionais
  focusArea?: string;
  isAvailable: boolean; // Dias 1-7 ativos no MVP, 8-21 reservados para fase 2
}

export interface UserStateOption {
  id: string;
  label: string;
  emoji: string;
  summary: string;
  recommendedPracticeId: string;
  leadKicker: string;
  leadMessage: string;
}

export interface QuickNeedOption {
  id: string;
  label: string;
  recommendedPracticeId: string;
  kicker: string;
  explanation: string;
}

export type PostPracticeState =
  | 'mais_tenso'
  | 'parecido'
  | 'mais_presente'
  | 'mais_tranquilo'
  | 'mais_desperto';

export interface PostPracticeOption {
  id: PostPracticeState;
  emoji: string;
  label: string;
  description: string;
}

export interface JournalEntry {
  id: string;
  practiceId: string;
  dayNumber?: number;
  practiceTitle: string;
  feelingAfter: PostPracticeState;
  feelingLabel: string;
  note?: string;
  completedAt: string; // ISO date string
}

export interface UserProgressData {
  completedDayNumbers: number[];
  completedPracticesCount: number;
  journalEntries: JournalEntry[];
  favoritePracticeIds: string[];
  hasSeenWelcome: boolean;
  lastActiveDate?: string;
}

export type AppTab = 'inicio' | 'percurso' | 'preciso_agora' | 'praticas';
