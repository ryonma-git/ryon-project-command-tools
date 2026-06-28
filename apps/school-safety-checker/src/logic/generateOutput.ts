// ============================================================
// generateOutput.ts — 出力生成ロジック
// ※ 個人情報を含む出力を生成しないよう設計しています
// ============================================================
import type { AppState } from '../types';
import { INCIDENT_TYPE_LABELS, CHECK_CATEGORY_LABELS } from '../types';

function getIncidentLabel(type: string): string {
  return INCIDENT_TYPE_LABELS[type as keyof typeof INCIDENT_TYPE_LABELS] ?? type;
}

function nowStr(): string {
  return new Date().toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

// ---- 対応ログ（Markdown） ----
export function generateLog(state: AppState): string {
  const { incident, checkItems, searchAreas } = state;
  const typeLabel = incident.type ? getIncidentLabel(incident.type) : '未選択';

  const checkedItems = checkItems.filter(c => c.checked);
  const uncheckedItems = checkItems.filter(c => !c.checked);

  const areaLines = searchAreas.map(a => {
    const status = a.status === 'unchecked' ? '未確認'
      : a.status === 'checking' ? '確認中'
      : a.status === 'checked' ? '確認済み'
      : '要再確認';
    return `- ${a.name}：${status}${a.memo ? `（${a.memo}）` : ''}`;
  }).join('\n');

  const checkedLines = checkedItems.map(c =>
    `- [x] ${c.label}${c.checkedAt ? `（${c.checkedAt}）` : ''}`
  ).join('\n');

  const uncheckedLines = uncheckedItems.map(c =>
    `- [ ] ${c.label}`
  ).join('\n');

  return `# 学校安全初動対応ログ

> ⚠️ このログは初動確認の補助ツールが生成したものです。
> 判断の自動化ではありません。通報・連絡基準は学校・自治体の正式ルールに従ってください。
> **個人情報（氏名・写真・住所等）が含まれていないか必ず確認してください。**

## 事案概要

| 項目 | 内容 |
|---|---|
| 事案種別 | ${typeLabel} |
| 発生時刻 | ${incident.occurredAt || '未記録'} |
| 気づいた時刻 | ${incident.noticedAt || '未記録'} |
| 対応開始時刻 | ${incident.startedAt ? new Date(incident.startedAt).toLocaleTimeString('ja-JP') : '未開始'} |
| 最終確認場所 | ${incident.lastSeenLocation || '未記録'} |
| 状況メモ | ${incident.memo || '（なし）'} |
| 出力日時 | ${nowStr()} |

## チェックリスト進捗

完了：${checkedItems.length} / ${checkItems.length} 件

### 完了済み
${checkedLines || '（なし）'}

### 未完了
${uncheckedLines || '（なし）'}

## 捜索エリア状況

${areaLines}

---
_このログはSchool Safety Checker（初動確認補助ツール）により生成されました。_
_正式な危機管理マニュアルではありません。_
`;
}

// ---- 振り返りメモ（Markdown） ----
export function generateReflection(state: AppState): string {
  const { incident, checkItems } = state;
  const typeLabel = incident.type ? getIncidentLabel(incident.type) : '未選択';
  const checkedCount = checkItems.filter(c => c.checked).length;
  const totalCount = checkItems.length;

  const uncheckedCritical = checkItems.filter(c => !c.checked && c.priority === 'critical');
  const uncheckedHigh = checkItems.filter(c => !c.checked && c.priority === 'high');

  return `# 振り返りメモ

> ⚠️ このメモは初動確認の補助ツールが生成したものです。
> 判断の自動化ではありません。

## 事案概要

- 事案種別：${typeLabel}
- 発生時刻：${incident.occurredAt || '未記録'}
- 対応開始：${incident.startedAt ? new Date(incident.startedAt).toLocaleTimeString('ja-JP') : '未開始'}

## 対応の振り返り

チェックリスト完了率：${checkedCount} / ${totalCount}（${Math.round(checkedCount / totalCount * 100)}%）

${uncheckedCritical.length > 0
  ? `### ⚠️ 未完了の緊急項目\n${uncheckedCritical.map(c => `- ${c.label}`).join('\n')}`
  : '### ✅ 緊急項目はすべて完了しています'}

${uncheckedHigh.length > 0
  ? `\n### 未完了の高優先度項目\n${uncheckedHigh.map(c => `- ${c.label}`).join('\n')}`
  : ''}

## 今後の課題・改善点

（ここに振り返り内容を記入してください）

---
_このメモはSchool Safety Checker（初動確認補助ツール）により生成されました。_
`;
}

// ---- ChatGPTプロンプト ----
export function generateChatGPTPrompt(state: AppState): string {
  const { incident, checkItems, searchAreas } = state;
  const typeLabel = incident.type ? getIncidentLabel(incident.type) : '未選択';
  const checkedCount = checkItems.filter(c => c.checked).length;
  const totalCount = checkItems.length;

  const areaStatus = searchAreas.map(a =>
    `${a.name}：${a.status === 'checked' ? '確認済み' : a.status === 'requires_recheck' ? '要再確認' : '未確認'}`
  ).join('、');

  return `# 学校安全初動対応 事後整理プロンプト（ChatGPT用）

> ⚠️ このプロンプトを使用する際は、個人情報（氏名・写真・住所等）を含めないでください。
> 学校外のサービスへの個人情報送信は、学校・自治体のルールに従って慎重に判断してください。

---

以下は学校での初動対応の記録です。この記録をもとに、事後整理・振り返りを支援してください。

## 事案情報（個人情報なし）

- 事案種別：${typeLabel}
- 発生時刻：${incident.occurredAt || '未記録'}
- 気づいた時刻：${incident.noticedAt || '未記録'}
- 最終確認場所：${incident.lastSeenLocation || '未記録'}
- 状況メモ：${incident.memo || '（なし）'}

## 対応状況

- チェックリスト完了：${checkedCount} / ${totalCount}
- エリア確認状況：${areaStatus}

## 依頼内容

1. この対応の振り返りポイントを3〜5点挙げてください
2. 次回同様の事案が発生した際の改善点を提案してください
3. 保護者向け説明文の骨子を作成してください（個人情報なし）

---
_このプロンプトはSchool Safety Checker（初動確認補助ツール）により生成されました。_
`;
}

// ---- JSONエクスポート ----
export function generateJSON(state: AppState): string {
  const exportData = {
    exportedAt: new Date().toISOString(),
    disclaimer: 'このデータは学校安全初動チェックアプリが生成したものです。個人情報は含まれていません。',
    incident: {
      type: state.incident.type,
      occurredAt: state.incident.occurredAt,
      noticedAt: state.incident.noticedAt,
      lastSeenLocation: state.incident.lastSeenLocation,
      memo: state.incident.memo,
      startedAt: state.incident.startedAt ? new Date(state.incident.startedAt).toISOString() : null,
    },
    checkItems: state.checkItems.map(c => ({
      id: c.id,
      label: c.label,
      category: c.category,
      priority: c.priority,
      checked: c.checked,
      checkedAt: c.checkedAt,
    })),
    searchAreas: state.searchAreas.map(a => ({
      id: a.id,
      name: a.name,
      status: a.status,
      memo: a.memo,
      updatedAt: a.updatedAt,
    })),
    summary: {
      checkedCount: state.checkItems.filter(c => c.checked).length,
      totalCount: state.checkItems.length,
      areaCheckedCount: state.searchAreas.filter(a => a.status === 'checked').length,
      totalAreaCount: state.searchAreas.length,
    },
  };
  return JSON.stringify(exportData, null, 2);
}

// カテゴリ別チェックリストのグループ化
export function groupCheckItemsByCategory(state: AppState) {
  const groups: Record<string, typeof state.checkItems> = {};
  for (const item of state.checkItems) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }
  return groups;
}

// カテゴリラベル取得
export { CHECK_CATEGORY_LABELS };
