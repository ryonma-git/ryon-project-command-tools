// ============================================================
// types.ts — Today Work Selector 型定義
// ============================================================

export type TimeSlot = '15分' | '30分' | '1時間' | '2時間以上';
export type EnergyLevel = '低' | '中' | '高';
export type Location = '学校' | '自宅' | '外';
export type AgentAvailability = 'ChatGPTのみ' | 'Codexあり' | 'Claude Codeあり' | 'Manusあり' | '全部なし';
export type Mood =
  | 'とにかく進めたい'
  | '記録だけしたい'
  | '実装したい'
  | '授業を考えたい'
  | '校務を片付けたい'
  | 'キャリアを進めたい'
  | '何も決められない';

export type ProjectArea =
  | '校務'
  | '授業'
  | '開発'
  | '記録'
  | 'キャリア'
  | '個人'
  | 'インフラ'
  | '健康・趣味';

export type ProjectStatus = 'active' | 'pending' | 'paused' | 'done';
export type Priority = 'high' | 'medium' | 'low';
export type EnergyRequired = '低' | '中' | '高';
export type OutputType =
  | 'Markdown'
  | 'コード'
  | 'Notion'
  | 'Excel'
  | 'JSON'
  | 'GitHub'
  | 'PDF'
  | 'アイデア'
  | '会話';

export type RiskLevel = 'low' | 'medium' | 'high';

/** プロジェクト固有のプロンプトテンプレート */
export interface ProjectPrompts {
  chatgpt?: string;
  codex?: string;
  claudeCode?: string;
  manus?: string;
}

export interface Project {
  id: string;
  name: string;
  area: ProjectArea;
  status: ProjectStatus;
  priority: Priority;
  energy: EnergyRequired;
  nextAction: string;
  /** @deprecated Use recommendedContexts */
  recommendedContext?: AgentAvailability[];
  /** 推奨エージェント（複数） */
  recommendedContexts: AgentAvailability[];
  /** @deprecated Use outputTypes */
  outputType?: OutputType[];
  /** 出力形式（複数） */
  outputTypes: OutputType[];
  notes: string;
  preferredLocation?: Location[];
  /** リスクレベル */
  risk?: RiskLevel;
  /** このプロジェクトに向いている状況・条件 */
  suitableFor?: string;
  /** プロジェクト固有のプロンプトテンプレート */
  prompts?: ProjectPrompts;
}

export interface TodayState {
  time: TimeSlot;
  energy: EnergyLevel;
  location: Location;
  agent: AgentAvailability;
  mood: Mood;
}

export interface PromptSet {
  chatgpt: string;
  codex: string;
  claudeCode: string;
  manus: string;
  reflection: string;
}

export interface AppState {
  todayState: TodayState;
  selectedProjects: string[]; // project ids
  prompts: PromptSet | null;
  savedAt: string | null;
}
