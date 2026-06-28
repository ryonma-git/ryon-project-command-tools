import type { CheckItem, SearchArea, RoleCard, IncidentInfo } from '../types';

export const INITIAL_INCIDENT: IncidentInfo = {
  type: '',
  occurredAt: '',
  noticedAt: '',
  lastSeenLocation: '',
  memo: '',
  startedAt: null,
};

export const INITIAL_CHECK_ITEMS: CheckItem[] = [
  { id: 'c01', label: '管理職に共有した', checked: false, checkedAt: null },
  { id: 'c02', label: '学年・担任に共有した', checked: false, checkedAt: null },
  { id: 'c03', label: '最終確認場所を記録した', checked: false, checkedAt: null },
  { id: 'c04', label: '最終確認時刻を記録した', checked: false, checkedAt: null },
  { id: 'c05', label: '校内放送の要否を確認した', checked: false, checkedAt: null },
  { id: 'c06', label: '出入口・門・職員室周辺を確認した', checked: false, checkedAt: null },
  { id: 'c07', label: 'トイレ・特別教室・体育館・運動場を確認した', checked: false, checkedAt: null },
  { id: 'c08', label: '捜索担当を割り振った', checked: false, checkedAt: null },
  { id: 'c09', label: '捜索済みエリアを記録した', checked: false, checkedAt: null },
  { id: 'c10', label: '保護者連絡の要否を管理職と確認した', checked: false, checkedAt: null },
  { id: 'c11', label: '教育委員会連絡の要否を確認した', checked: false, checkedAt: null },
  { id: 'c12', label: '警察連絡の基準を確認した', checked: false, checkedAt: null },
  { id: 'c13', label: '対応ログを残した', checked: false, checkedAt: null },
];

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
  },
  {
    id: 'r04',
    title: '出入口確認',
    description: '門・出入口・校外周辺を確認・監視する。',
    assignee: '',
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
];
