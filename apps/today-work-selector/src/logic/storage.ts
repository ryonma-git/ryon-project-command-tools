// ============================================================
// storage.ts — localStorage ユーティリティ
// ============================================================

import type { AppState, TodayState } from '../types';

const STORAGE_KEY = 'today-work-selector-state';

export const DEFAULT_TODAY_STATE: TodayState = {
  time: '1時間',
  energy: '中',
  location: '自宅',
  agent: 'ChatGPTのみ',
  mood: 'とにかく進めたい',
  mode: 'おまかせ',
};

export function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage が使えない環境では無視
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
