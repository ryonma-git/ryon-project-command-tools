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

// 物語スタイル
export type StoryStyle = 'gentle' | 'graduation' | 'parent';

export const STORY_STYLE_LABELS: Record<StoryStyle, string> = {
  gentle: 'やさしい文体',
  graduation: '卒業文集風',
  parent: '保護者にも読める説明文風',
};

export const STORY_STYLE_DESCRIPTIONS: Record<StoryStyle, string> = {
  gentle: '本人への語りかけ（「あなたは〜」）で、温かく親しみやすい言葉で書く',
  graduation: '卒業文集に載るような、少し改まった文体で6年間を振り返る',
  parent: '保護者にも伝わるよう、子どもの成長を客観的に説明する文体で書く',
};

export type ViewMode = 'select' | 'timeline' | 'story' | 'ethics';
