// ============================================================
// recommend.ts — 今日のおすすめプロジェクト推薦ロジック
// ============================================================

import type { Project, TodayState, WorkMode } from '../types';
import { PROJECTS } from '../data/projects';

/**
 * 今日の状態に基づいてプロジェクトをスコアリングし、
 * 上位5件を返す。お気に入りIDリストがあれば優先度を上げる。
 */
export function recommendProjects(
  state: TodayState,
  favoriteIds: string[] = [],
  count = 5
): Project[] {
  const scored = PROJECTS.map((p) => ({
    project: p,
    score: calcScore(p, state, favoriteIds),
  }));

  // スコア降順でソートし、上位N件を返す
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.project);
}

/**
 * WorkMode に対応するエリア・キーワードを返す
 */
function getModeBoostAreas(mode: WorkMode): string[] {
  switch (mode) {
    case '校務opsを進めたい': return ['校務'];
    case 'personal-memoryを進めたい': return ['記録'];
    case 'MaruFlowを進めたい': return ['開発'];
    case '学校安全を進めたい': return ['開発'];
    case '授業実践を進めたい': return ['授業'];
    case 'キャリアを進めたい': return ['キャリア'];
    case '生活基盤を整えたい': return ['インフラ', '健康・趣味', '個人'];
    case 'おまかせ': return [];
    default: return [];
  }
}

function getModeBoostIds(mode: WorkMode): string[] {
  switch (mode) {
    case '校務opsを進めたい': return ['koumuops', 'ai-hearing', 'tantou-ai', 'tablet-kanri', 'joho-notion', 'ai-jirei'];
    case 'personal-memoryを進めたい': return ['personal-memory', 'manazashi', 'scent-music'];
    case 'MaruFlowを進めたい': return ['maruflow'];
    case '学校安全を進めたい': return ['school-safety'];
    case '授業実践を進めたい': return ['toio-rika', 'eigo-redesign', 'taiwan-qr', 'jugyo-json', 'joho-moral'];
    case 'キャリアを進めたい': return ['ai-kenshu', 'portfolio', 'career', 'eigo-jiko'];
    case '生活基盤を整えたい': return ['health', 'bicycle', 'mac-dev', 'github-infra', 'codex-ops'];
    case 'おまかせ': return [];
    default: return [];
  }
}

function calcScore(p: Project, state: TodayState, favoriteIds: string[]): number {
  let score = 0;

  // ---- お気に入りボーナス ----
  if (favoriteIds.includes(p.id)) score += 15;

  // ---- ステータス・優先度ベーススコア ----
  if (p.status === 'active') score += 10;
  if (p.status === 'pending') score += 5;
  if (p.priority === 'high') score += 8;
  if (p.priority === 'medium') score += 4;
  if (p.priority === 'low') score += 1;

  // ---- WorkMode ボーナス ----
  const modeAreas = getModeBoostAreas(state.mode);
  const modeIds = getModeBoostIds(state.mode);
  if (modeIds.includes(p.id)) score += 20;
  if (modeAreas.includes(p.area)) score += 10;

  // ---- 気力マッチング（suitableForDetail 優先） ----
  if (state.energy === '低') {
    if (p.suitableForDetail?.lowEnergy) score += 14;
    else if (p.energy === '低') score += 10;
    if (p.energy === '中') score += 3;
    if (p.energy === '高') score -= 8;
    if (p.area === '記録') score += 6;
    if (p.outputTypes.includes('Markdown')) score += 4;
  } else if (state.energy === '中') {
    if (p.suitableForDetail?.mediumEnergy) score += 12;
    else if (p.energy === '中') score += 10;
    if (p.energy === '低') score += 5;
    if (p.energy === '高') score += 2;
  } else {
    // 気力が高い日は設計・実装系を優先
    if (p.suitableForDetail?.highEnergy) score += 14;
    else if (p.energy === '高') score += 12;
    if (p.energy === '中') score += 5;
    if (p.area === '開発') score += 6;
    if (p.outputTypes.includes('コード')) score += 4;
  }

  // ---- 時間マッチング ----
  if (state.time === '15分' || state.time === '30分') {
    // 短時間は記録・整理系
    if (p.energy === '低') score += 8;
    if (p.area === '記録') score += 6;
    if (p.outputTypes.includes('Markdown')) score += 4;
    if (p.outputTypes.includes('コード')) score -= 4;
  } else if (state.time === '1時間') {
    if (p.energy === '中') score += 6;
  } else {
    // 2時間以上は設計・実装系
    if (state.energy !== '低') {
      if (p.energy === '高') score += 8;
      if (p.outputTypes.includes('コード')) score += 6;
      if (p.area === '開発') score += 4;
    }
  }

  // ---- 場所マッチング（suitableForDetail 優先） ----
  if (state.location === '学校') {
    if (p.suitableForDetail?.school) score += 12;
    else if (p.preferredLocation?.includes('学校')) score += 8;
    if (p.area === '校務') score += 6;
    if (p.area === '授業') score += 4;
  } else if (state.location === '自宅') {
    if (p.suitableForDetail?.home) score += 12;
    else if (p.preferredLocation?.includes('自宅')) score += 8;
    if (p.area === '開発') score += 4;
    if (p.area === '記録') score += 4;
    if (p.area === 'インフラ') score += 4;
  } else {
    // 外
    if (p.suitableForDetail?.outside) score += 10;
    else if (p.preferredLocation?.includes('外')) score += 6;
    if (p.energy === '低') score += 4;
    if (p.area === 'キャリア') score += 4;
  }

  // ---- エージェントマッチング（suitableForDetail 優先） ----
  if (state.agent === 'Codexあり') {
    if (p.suitableForDetail?.codex) score += 10;
    else if (p.recommendedContexts.includes('Codexあり')) score += 7;
    if (p.outputTypes.includes('Markdown')) score += 3;
    if (p.outputTypes.includes('GitHub')) score += 3;
    if (p.outputTypes.includes('コード')) score += 3;
  } else if (state.agent === 'Claude Codeあり') {
    if (p.suitableForDetail?.claudeCode) score += 10;
    else if (p.recommendedContexts.includes('Claude Codeあり')) score += 7;
    if (p.outputTypes.includes('Notion')) score += 3;
  } else if (state.agent === 'Manusあり') {
    if (p.suitableForDetail?.manus) score += 10;
    else if (p.recommendedContexts.includes('Manusあり')) score += 7;
    if (p.area === '開発') score += 4;
    if (p.outputTypes.includes('コード')) score += 4;
  } else if (state.agent === 'ChatGPTのみ') {
    if (p.suitableForDetail?.chatgptOnly) score += 10;
    else if (p.recommendedContexts.includes('ChatGPTのみ')) score += 5;
    if (p.energy === '低') score += 4;
  }

  // ---- 気分マッチング ----
  switch (state.mood) {
    case 'とにかく進めたい':
      if (p.status === 'active') score += 8;
      if (p.priority === 'high') score += 6;
      break;
    case '記録だけしたい':
      if (p.area === '記録') score += 12;
      if (p.outputTypes.includes('Markdown')) score += 6;
      if (p.energy === '低') score += 6;
      break;
    case '実装したい':
      if (p.area === '開発') score += 12;
      if (p.outputTypes.includes('コード')) score += 8;
      if (p.energy === '高') score += 4;
      break;
    case '授業を考えたい':
      if (p.area === '授業') score += 12;
      if (p.outputTypes.includes('アイデア')) score += 6;
      break;
    case '校務を片付けたい':
      if (p.area === '校務') score += 12;
      if (p.priority === 'high') score += 4;
      break;
    case 'キャリアを進めたい':
      if (p.area === 'キャリア') score += 12;
      if (p.priority === 'high') score += 4;
      break;
    case '何も決められない':
      // 最もシンプルなものを優先
      if (p.energy === '低') score += 10;
      if (p.area === '記録') score += 8;
      break;
  }

  return score;
}
