// ============================================================
// RecommendSection.tsx — 今日のおすすめプロジェクト表示
// ============================================================

import type { Project } from '../types';

interface Props {
  projects: Project[];
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

export function RecommendSection({ projects }: Props) {
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
        今日のおすすめ（最大3件）
      </div>
      <div className="recommend-list">
        {projects.map((p, i) => (
          <div key={p.id} className="project-card">
            <div className="project-card-header">
              <span className="project-rank">{i + 1}</span>
              <span className="project-name">{p.name}</span>
              <span className="project-area-badge">{p.area}</span>
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
              {p.outputType.slice(0, 2).map((t) => (
                <span key={t} className="badge badge-output">
                  {t}
                </span>
              ))}
            </div>
            {p.notes && (
              <div
                style={{
                  marginTop: '8px',
                  fontSize: '0.78rem',
                  color: 'var(--color-text-muted)',
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '6px',
                }}
              >
                {p.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
