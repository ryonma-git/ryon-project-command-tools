// ============================================================
// HistoryScreen.tsx — 採点履歴画面（モック）
// ============================================================
import { useState } from 'react';
import type { Screen } from '../types';

interface Props {
  onNavigate: (s: Screen) => void;
}

interface HistoryEntry {
  id: string;
  title: string;
  subject: string;
  grade: string;
  date: string;
  totalStudents: number;
  averageScore: number;
  status: 'completed' | 'in-progress' | 'draft';
}

const DUMMY_HISTORY: HistoryEntry[] = [
  {
    id: 'h01',
    title: '第1回 算数テスト',
    subject: '算数',
    grade: '3年生',
    date: '2025-06-20',
    totalStudents: 28,
    averageScore: 72.4,
    status: 'completed',
  },
  {
    id: 'h02',
    title: '第1回 国語テスト',
    subject: '国語',
    grade: '3年生',
    date: '2025-06-15',
    totalStudents: 28,
    averageScore: 68.1,
    status: 'completed',
  },
  {
    id: 'h03',
    title: '第2回 算数テスト',
    subject: '算数',
    grade: '3年生',
    date: '2025-06-28',
    totalStudents: 28,
    averageScore: 0,
    status: 'in-progress',
  },
  {
    id: 'h04',
    title: '理科 単元テスト（植物）',
    subject: '理科',
    grade: '3年生',
    date: '2025-07-05',
    totalStudents: 28,
    averageScore: 0,
    status: 'draft',
  },
];

const STATUS_LABEL: Record<HistoryEntry['status'], string> = {
  completed: '採点完了',
  'in-progress': '採点中',
  draft: '準備中',
};

const STATUS_COLOR: Record<HistoryEntry['status'], string> = {
  completed: '#16a34a',
  'in-progress': '#d97706',
  draft: '#64748b',
};

export default function HistoryScreen({ onNavigate }: Props) {
  const [filter, setFilter] = useState<HistoryEntry['status'] | 'all'>('all');

  const filtered = filter === 'all'
    ? DUMMY_HISTORY
    : DUMMY_HISTORY.filter((h) => h.status === filter);

  return (
    <div className="screen-card">
      <h2 className="screen-title">📋 採点履歴</h2>
      <div className="mock-badge">モックデータ表示</div>

      <div className="filter-row">
        {(['all', 'completed', 'in-progress', 'draft'] as const).map((s) => (
          <button
            key={s}
            className={`filter-btn${filter === s ? ' active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? 'すべて' : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="history-list">
        {filtered.map((entry) => (
          <div key={entry.id} className="history-card">
            <div className="history-card-header">
              <div className="history-title">{entry.title}</div>
              <span
                className="history-status-badge"
                style={{ color: STATUS_COLOR[entry.status] }}
              >
                {STATUS_LABEL[entry.status]}
              </span>
            </div>
            <div className="history-meta">
              <span>{entry.subject}</span>
              <span>·</span>
              <span>{entry.grade}</span>
              <span>·</span>
              <span>{entry.date}</span>
              <span>·</span>
              <span>{entry.totalStudents}名</span>
            </div>
            {entry.status === 'completed' && (
              <div className="history-score">
                平均点：<strong>{entry.averageScore}</strong> 点
              </div>
            )}
            <div className="history-actions">
              {entry.status === 'completed' && (
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => onNavigate('statistics')}
                >
                  統計を見る
                </button>
              )}
              {entry.status === 'in-progress' && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => onNavigate('scoring')}
                >
                  採点を続ける
                </button>
              )}
              {entry.status === 'draft' && (
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => onNavigate('scoring-setup')}
                >
                  設定を開く
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="screen-actions">
        <button className="btn btn-outline" onClick={() => onNavigate('home')}>
          ← ホームへ
        </button>
        <button className="btn btn-primary" onClick={() => onNavigate('pdf-register')}>
          新規採点を開始
        </button>
      </div>
    </div>
  );
}
