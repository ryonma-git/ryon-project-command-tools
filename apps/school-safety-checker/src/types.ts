// ============================================================
// 学校安全初動チェックアプリ - 型定義
// ※ このアプリは個人情報（氏名・写真・住所等）を保存しません
// ============================================================

export type IncidentType =
  | 'indoor_missing'   // 校内所在不明
  | 'outdoor_missing'  // 校外所在不明
  | 'injury'           // けが
  | 'suspicious'       // 不審者
  | 'other';           // その他

export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
  indoor_missing: '校内所在不明',
  outdoor_missing: '校外所在不明',
  injury: 'けが',
  suspicious: '不審者',
  other: 'その他',
};

// 事案情報（個人を特定できる情報は含まない）
export interface IncidentInfo {
  type: IncidentType | '';
  occurredAt: string;       // 発生時刻（HH:MM形式）
  noticedAt: string;        // 気づいた時刻（HH:MM形式）
  lastSeenLocation: string; // 最終確認場所（個人情報なし）
  memo: string;             // 状況メモ（個人情報を入れないよう注意書き表示）
  startedAt: Date | null;   // 対応開始時刻（タイマー用）
}

// チェックリスト項目
export interface CheckItem {
  id: string;
  label: string;
  checked: boolean;
  checkedAt: string | null;
}

// 捜索エリアのステータス
export type AreaStatus = 'unchecked' | 'checking' | 'checked';

export const AREA_STATUS_LABELS: Record<AreaStatus, string> = {
  unchecked: '未確認',
  checking: '確認中',
  checked: '確認済み',
};

export interface SearchArea {
  id: string;
  name: string;
  status: AreaStatus;
  memo: string;
  updatedAt: string | null;
}

// 役割カード（担当者名はセッション内のみ・保存しない）
export interface RoleCard {
  id: string;
  title: string;
  description: string;
  assignee: string; // 入力欄あり・保存なし
}

// アプリ全体の状態
export interface AppState {
  incident: IncidentInfo;
  checkItems: CheckItem[];
  searchAreas: SearchArea[];
  roles: RoleCard[];
  localStorageEnabled: boolean; // デフォルトOFF
  activeTab: TabId;
}

export type TabId =
  | 'incident'
  | 'checklist'
  | 'areas'
  | 'elapsed'
  | 'roles'
  | 'output';

export const TAB_LABELS: Record<TabId, string> = {
  incident: '① 事案開始',
  checklist: '② チェックリスト',
  areas: '③ 捜索エリア',
  elapsed: '④ 経過時間',
  roles: '⑤ 役割カード',
  output: '⑥ 出力',
};
