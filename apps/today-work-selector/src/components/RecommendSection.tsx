// ============================================================
// RecommendSection.tsx — 今日のおすすめプロジェクト表示
// ============================================================

import type { Project } from '../types';

interface Props {
  projects: Project[];
  favoriteIds?: string[];
  onToggleFavorite?: (id: string) => void;
}

const PRIORITY_LABEL: Record<string, string> = {
  high: '優先度：高',
  medium: '優先度：中',
  low: '優先度：低',
};

const PRIORITY_CLASS: Record<string, string> = {
  high: 'badge badge-high',
  medium: 'badge badge-medium',
  low: 'badge badge-low',
};

export function RecommendSection({ projects, favoriteIds = [], onToggleFavorite }: Props) {
  if (projects.length === 0) {
    return (
      <div className="section-card">
        <div className="section-title">
          <span className="step-badge">2</span>
          今日のおすすめ
        </div>
        <div className="empty-state">
          <p>状態を入力すると、おすすめプロジェクトが表示されます。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-card">
      <div className="section-title">
        <span className="step-badge">2</span>
        今日のおすすめ（最大5件）
      </div>
      <div className="recommend-list">
        {projects.map((p, i) => {
          const isFav = favoriteIds.includes(p.id);
          return (
            <div key={p.id} className={`project-card${isFav ? ' project-card-fav' : ''}`}>
              <div className="project-card-header">
                <span className="project-rank">{i + 1}</span>
                <span className="project-name">{p.name}</span>
                <span className="project-area-badge">{p.area}</span>
                {onToggleFavorite && (
                  <button
                    type="button"
                    className={`fav-btn${isFav ? ' fav-btn-active' : ''}`}
                    onClick={() => onToggleFavorite(p.id)}
                    title={isFav ? 'お気に入りを解除' : 'お気に入りに追加'}
                  >
                    {isFav ? '★' : '☆'}
                  </button>
                )}
              </div>
              <div className="project-next-action">
                <strong>次のアクション：</strong>
                {p.nextAction}
              </div>
              <div className="project-meta">
                <span className={PRIORITY_CLASS[p.priority]}>
                  {PRIORITY_LABEL[p.priority]}
                </span>
                <span className="badge badge-energy">
                  気力：{p.energy}
                </span>
                {p.outputTypes.slice(0, 2).map((t) => (
                  <span key={t} className="badge badge-output">
                    {t}
                  </span>
                ))}
              </div>
              {p.suitableFor && (
                <div className="project-suitable">
                  ✓ {p.suitableFor}
                </div>
              )}
              {p.defaultGoals && p.defaultGoals.length > 0 && (
                <div className="project-goals">
                  <span className="goals-label">今日のゴール候補</span>
                  <ul>
                    {p.defaultGoals.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>
              )}
              {p.avoidToday && p.avoidToday.length > 0 && (
                <div className="project-avoid">
                  <span className="avoid-label">今日やらないこと</span>
                  <ul>
                    {p.avoidToday.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
              {p.notes && (
                <div className="project-notes">
                  {p.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
