// ============================================================
// initialData.ts — 事案テンプレート・チェックリスト・エリア・役割カードの初期データ
// ※ このアプリは個人情報（氏名・写真・住所等）を保存しません
// ============================================================
import type { CheckItem, SearchArea, RoleCard, IncidentInfo, IncidentType } from '../types';

export const INITIAL_INCIDENT: IncidentInfo = {
  type: '',
  occurredAt: '',
  noticedAt: '',
  lastSeenLocation: '',
  memo: '',
  startedAt: null,
};

// ============================================================
// 事案テンプレート（事案種別ごとの初期メモ・場所ヒント）
// ============================================================
export interface IncidentTemplate {
  type: IncidentType;
  label: string;
  locationHint: string;
  memoHint: string;
  description: string;
}

export const INCIDENT_TEMPLATES: IncidentTemplate[] = [
  {
    type: 'indoor_missing',
    label: '校内所在不明',
    locationHint: '例：3年2組教室前廊下',
    memoHint: '例：給食後に見当たらなくなった。体操服着用。（個人名は書かないこと）',
    description: '校内で児童・生徒の所在が確認できない場合。まず校内の全エリアを分担して確認します。',
  },
  {
    type: 'outdoor_missing',
    label: '校外所在不明',
    locationHint: '例：正門付近',
    memoHint: '例：下校後に帰宅していないとの連絡あり。（個人名は書かないこと）',
    description: '校外で児童・生徒の所在が確認できない場合。警察への連絡基準を管理職と確認します。',
  },
  {
    type: 'injury',
    label: 'けが',
    locationHint: '例：運動場南側',
    memoHint: '例：体育の授業中に転倒。足首を痛めている様子。（個人名は書かないこと）',
    description: '児童・生徒がけがをした場合。状況の記録と保護者連絡、必要に応じて救急対応を行います。',
  },
  {
    type: 'suspicious',
    label: '不審者',
    locationHint: '例：北門付近',
    memoHint: '例：校内に不審な人物が侵入。（個人を特定できる情報は書かないこと）',
    description: '不審者が校内・校外に現れた場合。児童の安全確保を最優先にします。',
  },
  {
    type: 'ict_failure',
    label: 'ICT障害',
    locationHint: '例：コンピュータ室・全教室',
    memoHint: '例：授業中にタブレット端末が接続できなくなった。Wi-Fi障害の可能性。',
    description: 'ネットワーク・端末・システム等のICT障害が発生した場合。授業への影響と復旧手順を確認します。',
  },
];

// ============================================================
// チェックリスト（カテゴリ分け・事案種別対応）
// ============================================================
export const INITIAL_CHECK_ITEMS: CheckItem[] = [
  // ---- 共有（share） ----
  {
    id: 'c01', label: '管理職に共有した', checked: false, checkedAt: null,
    priority: 'critical', category: 'share',
  },
  {
    id: 'c02', label: '学年・担任に共有した', checked: false, checkedAt: null,
    priority: 'critical', category: 'share',
  },
  {
    id: 'c03', label: '校内放送の要否を管理職と確認した', checked: false, checkedAt: null,
    priority: 'high', category: 'share',
    applicableTo: ['indoor_missing', 'outdoor_missing', 'suspicious'],
  },
  {
    id: 'c04', label: '全教職員への周知方法を確認した', checked: false, checkedAt: null,
    priority: 'high', category: 'share',
  },

  // ---- 確認（confirm） ----
  {
    id: 'c05', label: '最終確認場所を記録した', checked: false, checkedAt: null,
    priority: 'critical', category: 'confirm',
    applicableTo: ['indoor_missing', 'outdoor_missing'],
  },
  {
    id: 'c06', label: '最終確認時刻を記録した', checked: false, checkedAt: null,
    priority: 'critical', category: 'confirm',
    applicableTo: ['indoor_missing', 'outdoor_missing'],
  },
  {
    id: 'c07', label: 'けがの状態・程度を確認した', checked: false, checkedAt: null,
    priority: 'critical', category: 'confirm',
    applicableTo: ['injury'],
  },
  {
    id: 'c08', label: '救急車要請の要否を判断した', checked: false, checkedAt: null,
    priority: 'critical', category: 'confirm',
    applicableTo: ['injury'],
  },
  {
    id: 'c09', label: '不審者の現在位置・状況を確認した', checked: false, checkedAt: null,
    priority: 'critical', category: 'confirm',
    applicableTo: ['suspicious'],
  },
  {
    id: 'c10', label: '障害の範囲（端末・ネットワーク・システム）を確認した', checked: false, checkedAt: null,
    priority: 'critical', category: 'confirm',
    applicableTo: ['ict_failure'],
  },
  {
    id: 'c11', label: '出入口・門・職員室周辺を確認した', checked: false, checkedAt: null,
    priority: 'high', category: 'confirm',
    applicableTo: ['indoor_missing', 'outdoor_missing', 'suspicious'],
  },

  // ---- 捜索（search） ----
  {
    id: 'c12', label: '捜索担当を割り振った', checked: false, checkedAt: null,
    priority: 'high', category: 'search',
    applicableTo: ['indoor_missing', 'outdoor_missing'],
  },
  {
    id: 'c13', label: 'トイレ・特別教室・体育館・運動場を確認した', checked: false, checkedAt: null,
    priority: 'high', category: 'search', requiresRecheck: true,
    applicableTo: ['indoor_missing'],
  },
  {
    id: 'c14', label: '捜索済みエリアを記録した', checked: false, checkedAt: null,
    priority: 'high', category: 'search',
    applicableTo: ['indoor_missing', 'outdoor_missing'],
  },
  {
    id: 'c15', label: '児童の安全確保・避難誘導を行った', checked: false, checkedAt: null,
    priority: 'critical', category: 'search',
    applicableTo: ['suspicious'],
  },

  // ---- 連絡（contact） ----
  {
    id: 'c16', label: '保護者連絡の要否を管理職と確認した', checked: false, checkedAt: null,
    priority: 'high', category: 'contact',
  },
  {
    id: 'c17', label: '教育委員会連絡の要否を確認した', checked: false, checkedAt: null,
    priority: 'normal', category: 'contact',
  },
  {
    id: 'c18', label: '警察連絡の基準を確認した', checked: false, checkedAt: null,
    priority: 'normal', category: 'contact',
    applicableTo: ['outdoor_missing', 'suspicious'],
  },
  {
    id: 'c19', label: '保健室・養護教諭に連絡した', checked: false, checkedAt: null,
    priority: 'critical', category: 'contact',
    applicableTo: ['injury'],
  },
  {
    id: 'c20', label: 'ICT担当・業者への連絡を行った', checked: false, checkedAt: null,
    priority: 'high', category: 'contact',
    applicableTo: ['ict_failure'],
  },

  // ---- 記録（record） ----
  {
    id: 'c21', label: '対応ログを残した（時刻・場所・対応内容）', checked: false, checkedAt: null,
    priority: 'normal', category: 'record',
  },
  {
    id: 'c22', label: '関係者の対応内容を記録した', checked: false, checkedAt: null,
    priority: 'normal', category: 'record',
  },
  {
    id: 'c23', label: '障害の発生時刻・症状・復旧時刻を記録した', checked: false, checkedAt: null,
    priority: 'high', category: 'record',
    applicableTo: ['ict_failure'],
  },

  // ---- 事後対応（followup） ----
  {
    id: 'c24', label: '事案終了の確認・管理職への報告を行った', checked: false, checkedAt: null,
    priority: 'normal', category: 'followup',
  },
  {
    id: 'c25', label: '振り返り・再発防止策の検討を行った', checked: false, checkedAt: null,
    priority: 'normal', category: 'followup',
  },
  {
    id: 'c26', label: '保護者への事後連絡・説明を行った', checked: false, checkedAt: null,
    priority: 'normal', category: 'followup',
  },
];

// ============================================================
// 捜索エリア
// ============================================================
export const INITIAL_SEARCH_AREAS: SearchArea[] = [
  { id: 'a01', name: '教室', status: 'unchecked', memo: '', updatedAt: null },
  { id: 'a02', name: '廊下', status: 'unchecked', memo: '', updatedAt: null },
  { id: 'a03', name: 'トイレ', status: 'unchecked', memo: '', updatedAt: null },
  { id: 'a04', name: '階段', status: 'unchecked', memo: '', updatedAt: null },
  { id: 'a05', name: '特別教室', status: 'unchecked', memo: '', updatedAt: null },
  { id: 'a06', name: '体育館', status: 'unchecked', memo: '', updatedAt: null },
  { id: 'a07', name: '運動場', status: 'unchecked', memo: '', updatedAt: null },
  { id: 'a08', name: '図書室', status: 'unchecked', memo: '', updatedAt: null },
  { id: 'a09', name: '保健室', status: 'unchecked', memo: '', updatedAt: null },
  { id: 'a10', name: '職員室周辺', status: 'unchecked', memo: '', updatedAt: null },
  { id: 'a11', name: '門・出入口', status: 'unchecked', memo: '', updatedAt: null },
  { id: 'a12', name: '校外周辺', status: 'unchecked', memo: '', updatedAt: null },
];

// ============================================================
// 役割カード
// ============================================================
export const INITIAL_ROLES: RoleCard[] = [
  {
    id: 'r01',
    title: '全体指揮',
    description: '対応全体の指揮・判断を行う。管理職が担当することが多い。',
    assignee: '',
  },
  {
    id: 'r02',
    title: '記録係',
    description: '時刻・場所・対応内容を記録する。このアプリの入力担当。',
    assignee: '',
  },
  {
    id: 'r03',
    title: '校内捜索',
    description: '校内各エリアを分担して捜索する。',
    assignee: '',
    applicableTo: ['indoor_missing', 'outdoor_missing'],
  },
  {
    id: 'r04',
    title: '出入口確認',
    description: '門・出入口・校外周辺を確認・監視する。',
    assignee: '',
    applicableTo: ['indoor_missing', 'outdoor_missing', 'suspicious'],
  },
  {
    id: 'r05',
    title: '連絡担当',
    description: '保護者・教育委員会・警察等への連絡を担当する。',
    assignee: '',
  },
  {
    id: 'r06',
    title: '児童対応',
    description: '在校中の他の児童の安全確保・落ち着いた対応を行う。',
    assignee: '',
  },
  {
    id: 'r07',
    title: '保護者対応',
    description: '来校した保護者への対応・情報提供を担当する。',
    assignee: '',
  },
  {
    id: 'r08',
    title: '救護担当',
    description: '養護教諭と連携し、けがをした児童の応急処置・救急対応を担当する。',
    assignee: '',
    applicableTo: ['injury'],
  },
  {
    id: 'r09',
    title: '安全確保・避難誘導',
    description: '不審者対応時に児童を安全な場所に誘導する。',
    assignee: '',
    applicableTo: ['suspicious'],
  },
  {
    id: 'r10',
    title: 'ICT復旧担当',
    description: 'ICT障害の状況確認・業者連絡・復旧作業を担当する。',
    assignee: '',
    applicableTo: ['ict_failure'],
  },
];
