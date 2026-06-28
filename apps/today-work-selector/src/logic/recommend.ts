// ============================================================
// recommend.ts — 今日のおすすめプロジェクト推薦ロジック
// ============================================================

import type { Project, TodayState } from '../types';
import { PROJECTS } from '../data/projects';

/**
 * 今日の状態に基づいてプロジェクトをスコアリングし、
 * 上位3件を返す。
 */
export function recommendProjects(state: TodayState): Project[] {
  const scored = PROJECTS.map((p) => ({
    project: p,
    score: calcScore(p, state),
  }));

  // スコア降順でソートし、上位3件を返す
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((s) => s.project);
}

function calcScore(p: Project, state: TodayState): number {
  let score = 0;

  // ---- ステータス・優先度ベーススコア ----
  if (p.status === 'active') score += 10;
  if (p.status === 'pending') score += 5;
  if (p.priority === 'high') score += 8;
  if (p.priority === 'medium') score += 4;
  if (p.priority === 'low') score += 1;

  // ---- 気力マッチング ----
  if (state.energy === '低') {
    // 気力が低い日は記録・整理・短時間作業を優先
    if (p.energy === '低') score += 12;
    if (p.energy === '中') score += 4;
    if (p.energy === '高') score -= 6;
    if (p.area === '記録') score += 6;
    if (p.outputType.includes('Markdown')) score += 4;
  } else if (state.energy === '中') {
    if (p.energy === '低') score += 6;
    if (p.energy === '中') score += 10;
    if (p.energy === '高') score += 2;
  } else {
    // 気力が高い日は設計・実装系を優先
    if (p.energy === '高') score += 12;
    if (p.energy === '中') score += 6;
    if (p.area === '開発') score += 6;
    if (p.outputType.includes('コード')) score += 4;
  }

  // ---- 時間マッチング ----
  if (state.time === '15分' || state.time === '30分') {
    // 短時間は記録・整理系
    if (p.energy === '低') score += 8;
    if (p.area === '記録') score += 6;
    if (p.outputType.includes('Markdown')) score += 4;
    if (p.outputType.includes('コード')) score -= 4;
  } else if (state.time === '1時間') {
    if (p.energy === '中') score += 6;
  } else {
    // 2時間以上は設計・実装系
    if (state.energy !== '低') {
      if (p.energy === '高') score += 8;
      if (p.outputType.includes('コード')) score += 6;
      if (p.area === '開発') score += 4;
    }
  }

  // ---- 場所マッチング ----
  if (state.location === '学校') {
    if (p.preferredLocation?.includes('学校')) score += 10;
    if (p.area === '校務') score += 6;
    if (p.area === '授業') score += 4;
  } else if (state.location === '自宅') {
    if (p.preferredLocation?.includes('自宅')) score += 10;
    if (p.area === '開発') score += 4;
    if (p.area === '記録') score += 4;
    if (p.area === 'インフラ') score += 4;
  } else {
    // 外
    if (p.preferredLocation?.includes('外')) score += 8;
    if (p.energy === '低') score += 4;
    if (p.area === 'キャリア') score += 4;
  }

  // ---- エージェントマッチング ----
  if (state.agent === 'Codexあり') {
    if (p.recommendedContext.includes('Codexあり')) score += 8;
    if (p.outputType.includes('Markdown')) score += 4;
    if (p.outputType.includes('GitHub')) score += 4;
    if (p.outputType.includes('コード')) score += 4;
  } else if (state.agent === 'Claude Codeあり') {
    if (p.recommendedContext.includes('Claude Codeあり')) score += 8;
    if (p.outputType.includes('Notion')) score += 4;
  } else if (state.agent === 'Manusあり') {
    if (p.recommendedContext.includes('Manusあり')) score += 8;
    if (p.area === '開発') score += 4;
    if (p.outputType.includes('コード')) score += 4;
  } else if (state.agent === 'ChatGPTのみ') {
    if (p.recommendedContext.includes('ChatGPTのみ')) score += 6;
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
      if (p.outputType.includes('Markdown')) score += 6;
      if (p.energy === '低') score += 6;
      break;
    case '実装したい':
      if (p.area === '開発') score += 12;
      if (p.outputType.includes('コード')) score += 8;
      if (p.energy === '高') score += 4;
      break;
    case '授業を考えたい':
      if (p.area === '授業') score += 12;
      if (p.outputType.includes('アイデア')) score += 6;
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
