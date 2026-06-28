// MaruFlow MVP Mock — 型定義

export type Screen =
  | 'home'
  | 'pdf-register'
  | 'scoring-setup'
  | 'scoring'
  | 'output'
  | 'statistics'
  | 'history';

export interface Question {
  id: string;
  label: string;
  maxScore: number;
  x: number; // PDF上の相対位置 (%)
  y: number;
  width: number;
  height: number;
}

export type MarkType = 'maru' | 'batsu' | 'sankaku' | 'none';

export interface ScoreEntry {
  questionId: string;
  mark: MarkType;
  score: number | null;
  comment: string;
}

export interface AnswerSheet {
  id: string;
  studentName: string; // ダミー氏名
  scores: ScoreEntry[];
}

// ダミーデータ用
export interface DummyTest {
  title: string;
  subject: string;
  grade: string;
  questions: Question[];
  answerSheets: AnswerSheet[];
}
