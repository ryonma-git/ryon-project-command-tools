import type { AppState } from '../types';
import { INCIDENT_TYPE_LABELS, AREA_STATUS_LABELS } from '../types';

function now(): string {
  return new Date().toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

// 対応ログ（Markdown形式）
export function generateLog(state: AppState): string {
  const { incident, checkItems, searchAreas } = state;
  const typeLabel = incident.type ? INCIDENT_TYPE_LABELS[incident.type] : '（未選択）';
  const checkedCount = checkItems.filter(c => c.checked).length;
  const checkedAreas = searchAreas.filter(a => a.status === 'checked');
  const checkingAreas = searchAreas.filter(a => a.status === 'checking');
  const uncheckedAreas = searchAreas.filter(a => a.status === 'unchecked');

  const lines: string[] = [
    `# 学校安全初動対応ログ`,
    ``,
    `> ⚠️ このログには個人情報（氏名・写真・住所等）を含めないでください。`,
    `> このアプリは初動確認の補助ツールです。正式な対応は学校・自治体のルールに従ってください。`,
    ``,
    `## 出力日時`,
    `${now()}`,
    ``,
    `## 事案概要`,
    `| 項目 | 内容 |`,
    `|------|------|`,
    `| 事案種別 | ${typeLabel} |`,
    `| 発生時刻 | ${incident.occurredAt || '未記録'} |`,
    `| 気づいた時刻 | ${incident.noticedAt || '未記録'} |`,
    `| 最終確認場所 | ${incident.lastSeenLocation || '未記録'} |`,
    ``,
    `### 状況メモ`,
    incident.memo ? incident.memo : '（なし）',
    ``,
    `## 初動チェックリスト（${checkedCount}/${checkItems.length}完了）`,
    ``,
    ...checkItems.map(c => {
      const mark = c.checked ? '- [x]' : '- [ ]';
      const time = c.checkedAt ? ` _(${c.checkedAt})_` : '';
      return `${mark} ${c.label}${time}`;
    }),
    ``,
    `## 捜索エリア状況`,
    ``,
    `### 確認済み（${checkedAreas.length}件）`,
    checkedAreas.length > 0
      ? checkedAreas.map(a => `- ✅ ${a.name}${a.memo ? `：${a.memo}` : ''}`).join('\n')
      : '（なし）',
    ``,
    `### 確認中（${checkingAreas.length}件）`,
    checkingAreas.length > 0
      ? checkingAreas.map(a => `- 🔄 ${a.name}${a.memo ? `：${a.memo}` : ''}`).join('\n')
      : '（なし）',
    ``,
    `### 未確認（${uncheckedAreas.length}件）`,
    uncheckedAreas.length > 0
      ? uncheckedAreas.map(a => `- ⬜ ${a.name}`).join('\n')
      : '（なし）',
    ``,
    `---`,
    `_このログはManusで構築した学校安全初動チェックアプリにより生成されました。_`,
    `_正式な危機管理記録は学校・自治体の定める書式で別途作成してください。_`,
  ];

  return lines.join('\n');
}

// 振り返り用メモ
export function generateReflection(state: AppState): string {
  const { incident, checkItems, searchAreas } = state;
  const typeLabel = incident.type ? INCIDENT_TYPE_LABELS[incident.type] : '（未選択）';
  const unchecked = checkItems.filter(c => !c.checked);
  const uncheckedAreas = searchAreas.filter(a => a.status === 'unchecked');

  const lines: string[] = [
    `# 振り返り用メモ`,
    ``,
    `> ⚠️ 個人情報（氏名・写真・住所等）は記入しないでください。`,
    ``,
    `## 事案種別`,
    typeLabel,
    ``,
    `## 今回の対応で良かった点`,
    `（ここに記入してください）`,
    ``,
    `## 改善できた点・次回への課題`,
    `（ここに記入してください）`,
    ``,
  ];

  if (unchecked.length > 0) {
    lines.push(`## 今回チェックできなかった項目`);
    lines.push(`以下の項目は今回チェックされていませんでした。次回の対応で意識してください。`);
    lines.push(``);
    unchecked.forEach(c => lines.push(`- ${c.label}`));
    lines.push(``);
  }

  if (uncheckedAreas.length > 0) {
    lines.push(`## 今回確認できなかったエリア`);
    uncheckedAreas.forEach(a => lines.push(`- ${a.name}`));
    lines.push(``);
  }

  lines.push(`## 今後の対応フローへの提案`);
  lines.push(`（ここに記入してください）`);
  lines.push(``);
  lines.push(`---`);
  lines.push(`_このメモは正式な事後報告書ではありません。学校・自治体の定める書式で別途作成してください。_`);

  return lines.join('\n');
}

// ChatGPTに貼るための事後整理プロンプト
export function generateChatGPTPrompt(state: AppState): string {
  const { incident, checkItems, searchAreas } = state;
  const typeLabel = incident.type ? INCIDENT_TYPE_LABELS[incident.type] : '（未選択）';
  const checkedCount = checkItems.filter(c => c.checked).length;
  const areasSummary = searchAreas
    .map(a => `${a.name}：${AREA_STATUS_LABELS[a.status]}`)
    .join('、');

  const lines: string[] = [
    `# ChatGPT 事後整理プロンプト`,
    ``,
    `> ⚠️ 以下のプロンプトをChatGPTに貼り付ける際、個人情報（氏名・写真・住所・個人を特定できる情報）は絶対に含めないでください。`,
    ``,
    `---`,
    ``,
    `以下は学校で発生した事案の初動対応記録です（個人情報は含まれていません）。`,
    `この記録をもとに、対応の振り返りと今後の改善点を整理する手助けをしてください。`,
    ``,
    `## 事案概要`,
    `- 事案種別：${typeLabel}`,
    `- 発生時刻：${incident.occurredAt || '未記録'}`,
    `- 気づいた時刻：${incident.noticedAt || '未記録'}`,
    `- 最終確認場所：${incident.lastSeenLocation || '未記録'}`,
    `- 状況メモ：${incident.memo || '（なし）'}`,
    ``,
    `## チェックリスト完了状況`,
    `- 完了：${checkedCount}/${checkItems.length}項目`,
    `- 未完了の項目：${checkItems.filter(c => !c.checked).map(c => c.label).join('、') || 'なし'}`,
    ``,
    `## 捜索エリア状況`,
    `${areasSummary}`,
    ``,
    `## 依頼内容`,
    `1. 今回の対応で抜け漏れがあった可能性のある点を指摘してください。`,
    `2. 次回同様の事案が発生した際に改善できる点を提案してください。`,
    `3. 学校の危機管理マニュアルに追記すべき内容があれば提案してください。`,
    ``,
    `---`,
    `_※ このプロンプトはManusで構築した学校安全初動チェックアプリにより生成されました。_`,
    `_※ ChatGPTの回答は参考情報です。正式な対応は学校・自治体のルールに従ってください。_`,
  ];

  return lines.join('\n');
}
