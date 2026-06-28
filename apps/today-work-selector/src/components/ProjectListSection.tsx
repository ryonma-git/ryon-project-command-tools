// ============================================================
// ProjectListSection.tsx — 全プロジェクト一覧表示
// ============================================================

import { useState } from 'react';
import type { Project, ProjectArea } from '../types';
import { PROJECTS } from '../data/projects';

const AREA_OPTIONS: (ProjectArea | 'すべて')[] = [
  'すべて',
  '校務',
  '授業',
  '開発',
  '記録',
  'キャリア',
  '個人',
  'インフラ',
  '健康・趣味',
];

const STATUS_LABEL: Record<string, string> = {
  active: '進行中',
  pending: '保留',
  paused: '一時停止',
  done: '完了',
};

const STATUS_COLOR: Record<string, string> = {
  active: '#16a34a',
  pending: '#d97706',
  paused: '#64748b',
  done: '#2563eb',
};

function ProjectRow({ p }: { p: Project }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: '1px solid var(--color-border)',
        padding: '10px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          flexWrap: 'wrap',
        }}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          style={{
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '10px',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {p.area}
        </span>
        <span style={{ fontWeight: 600, fontSize: '0.9rem', flex: 1 }}>
          {p.name}
        </span>
        <span
          style={{
            fontSize: '0.7rem',
            color: STATUS_COLOR[p.status],
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {STATUS_LABEL[p.status]}
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            flexShrink: 0,
          }}
        >
          {open ? '▲' : '▼'}
        </span>
      </div>
      {open && (
        <div
          style={{
            marginTop: '8px',
            padding: '10px 12px',
            background: 'var(--color-surface-2)',
            borderRadius: '6px',
            fontSize: '0.82rem',
          }}
        >
          <div style={{ marginBottom: '4px' }}>
            <strong>次のアクション：</strong>
            {p.nextAction}
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong>出力形式：</strong>
            {p.outputTypes.join('、')}
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong>推奨エージェント：</strong>
            {p.recommendedContexts.join('、')}
          </div>
          {p.preferredLocation && (
            <div style={{ marginBottom: '4px' }}>
              <strong>推奨場所：</strong>
              {p.preferredLocation.join('、')}
            </div>
          )}
          {p.suitableFor && (
            <div style={{ marginBottom: '4px' }}>
              <strong>向いている状況：</strong>
              {p.suitableFor}
            </div>
          )}
          {p.notes && (
            <div style={{ color: 'var(--color-text-muted)' }}>
              {p.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ProjectListSection() {
  const [filter, setFilter] = useState<ProjectArea | 'すべて'>('すべて');
  const [showList, setShowList] = useState(false);

  const filtered =
    filter === 'すべて'
      ? PROJECTS
      : PROJECTS.filter((p) => p.area === filter);

  return (
    <div className="section-card">
      <div
        className="section-title"
        style={{ cursor: 'pointer' }}
        onClick={() => setShowList((v) => !v)}
      >
        <span className="step-badge">4</span>
        全プロジェクト一覧（{PROJECTS.length}件）
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
          }}
        >
          {showList ? '▲ 閉じる' : '▼ 開く'}
        </span>
      </div>

      {showList && (
        <>
          <div className="btn-group" style={{ marginBottom: '16px' }}>
            {AREA_OPTIONS.map((area) => (
              <button
                key={area}
                className={`toggle-btn${filter === area ? ' active' : ''}`}
                onClick={() => setFilter(area as ProjectArea | 'すべて')}
                type="button"
                style={{ fontSize: '0.78rem', padding: '6px 10px' }}
              >
                {area}
              </button>
            ))}
          </div>
          <div>
            {filtered.map((p) => (
              <ProjectRow key={p.id} p={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
