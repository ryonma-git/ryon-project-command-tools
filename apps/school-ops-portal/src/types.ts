// ============================================================
// types.ts — School Ops Portal の型定義
// ============================================================

export type OpsCategory =
  | 'ICT'
  | 'ネットワーク'
  | 'タブレット管理'
  | '情報部会'
  | 'AI活用'
  | '学校安全'
  | 'マニュアル';

export type ArticleStatus = 'confirmed' | 'draft' | 'needs-review' | 'outdated';

export interface OpsArticle {
  id: string;
  title: string;
  category: OpsCategory;
  status: ArticleStatus;
  summary: string;
  body: string;
  tags: string[];
  updatedAt: string;
  pendingItems?: string[];
  nextActions?: string[];
}

export interface OpsState {
  activeCategory: OpsCategory | 'すべて';
  searchQuery: string;
  selectedArticleId: string | null;
  showPrompt: boolean;
}
