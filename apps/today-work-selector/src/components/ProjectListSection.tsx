// ============================================================
// ProjectListSection.tsx — 全プロジェクト一覧表示
// ============================================================

import { useState } from 'react';
import type { Project, ProjectArea } from '../types';
import { PROJECTS } from '../data/projects';

const AREA_OPTIONS: (ProjectArea | 'すべて' | 'お気に入り')[] = [
  'すべて',
  'お気に入り',
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

interface ProjectRowProps {
  p: Project;
  isFav: boolean;
  onToggleFavorite?: (id: string) => void;
}

function ProjectRow({ p, isFav, onToggleFavorite }: ProjectRowProps) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: '1px solid var(--color-border)',
        padding: '10px 0',
        background: isFav ? 'var(--color-primary-light)' : 'transparent',
        borderRadius: isFav ? '6px' : '0',
        paddingLeft: isFav ? '8px' : '0',
        paddingRight: isFav ? '8px' : '0',
        marginBottom: isFav ? '4px' : '0',
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
        {onToggleFavorite && (
          <button
            type="button"
            className={`fav-btn${isFav ? ' fav-btn-active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(p.id); }}
            title={isFav ? 'お気に入りを解除' : 'お気に入りに追加'}
          >
            {isFav ? '★' : '☆'}
          </button>
        )}
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
          {p.defaultGoals && p.defaultGoals.length > 0 && (
            <div style={{ marginBottom: '4px' }}>
              <strong>今日のゴール候補：</strong>
              <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                {p.defaultGoals.map((g) => <li key={g}>{g}</li>)}
              </ul>
            </div>
          )}
          {p.avoidToday && p.avoidToday.length > 0 && (
            <div style={{ marginBottom: '4px', color: '#b45309' }}>
              <strong>今日やらないこと：</strong>
              <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                {p.avoidToday.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </div>
          )}
          {p.notes && (
            <div style={{ color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {p.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  favoriteIds?: string[];
  onToggleFavorite?: (id: string) => void;
}

export function ProjectListSection({ favoriteIds = [], onToggleFavorite }: Props) {
  const [filter, setFilter] = useState<ProjectArea | 'すべて' | 'お気に入り'>('すべて');
  const [showList, setShowList] = useState(false);

  const filtered =
    filter === 'すべて'
      ? PROJECTS
      : filter === 'お気に入り'
      ? PROJECTS.filter((p) => favoriteIds.includes(p.id))
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
        {favoriteIds.length > 0 && (
          <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: 'var(--color-primary)' }}>
            ★ {favoriteIds.length}件お気に入り
          </span>
        )}
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
                onClick={() => setFilter(area as ProjectArea | 'すべて' | 'お気に入り')}
                type="button"
                style={{ fontSize: '0.78rem', padding: '6px 10px' }}
              >
                {area === 'お気に入り' ? `★ ${area}` : area}
              </button>
            ))}
          </div>
          <div>
            {filtered.length === 0 ? (
              <div className="empty-state">
                <p>該当するプロジェクトがありません。</p>
              </div>
            ) : (
              filtered.map((p) => (
                <ProjectRow
                  key={p.id}
                  p={p}
                  isFav={favoriteIds.includes(p.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
