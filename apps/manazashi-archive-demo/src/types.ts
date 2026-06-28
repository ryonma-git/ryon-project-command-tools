// ============================================================
// types.ts — まなざしアーカイブ架空デモ の型定義
// ※ 実児童データは一切使用していません。すべて架空のデータです。
// ============================================================

export interface LearningRecord {
  grade: number;           // 学年（1〜6）
  term: string;            // 学期・時期
  subject: string;         // 教科・活動
  event: string;           // 出来事・活動内容
  quote?: string;          // 印象的な発言
  workMemo?: string;       // 作品メモ
  teacherNote: string;     // 教師の観察メモ
  selfReflection?: string; // 本人の振り返り
  tags: string[];
}

export interface FictionalChild {
  id: string;
  alias: string;           // 架空の呼称（「児童A」など）
  type: string;            // 学びのタイプ説明
  profile: string;         // 架空プロフィール
  records: LearningRecord[];
}

export type ViewMode = 'select' | 'timeline' | 'story' | 'ethics';
