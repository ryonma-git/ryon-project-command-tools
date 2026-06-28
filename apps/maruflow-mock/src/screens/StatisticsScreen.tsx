// ============================================================
// StatisticsScreen.tsx — 採点統計画面（モック）
// ============================================================
import type { Screen } from '../types';

interface Props {
  onNavigate: (s: Screen) => void;
}

// ダミー統計データ
const DUMMY_STATS = {
  testTitle: '第1回 算数テスト（3年生）',
  totalStudents: 28,
  averageScore: 72.4,
  maxScore: 98,
  minScore: 34,
  medianScore: 74,
  questionStats: [
    { label: '問1', maxScore: 10, average: 8.2, correctRate: 89 },
    { label: '問2', maxScore: 20, average: 14.1, correctRate: 71 },
    { label: '問3', maxScore: 20, average: 12.8, correctRate: 64 },
    { label: '問4', maxScore: 25, average: 16.5, correctRate: 66 },
    { label: '問5', maxScore: 25, average: 20.8, correctRate: 83 },
  ],
  distribution: [
    { range: '0〜19', count: 1 },
    { range: '20〜39', count: 2 },
    { range: '40〜59', count: 4 },
    { range: '60〜79', count: 11 },
    { range: '80〜99', count: 10 },
    { range: '100', count: 0 },
  ],
};

export default function StatisticsScreen({ onNavigate }: Props) {
  const maxCount = Math.max(...DUMMY_STATS.distribution.map((d) => d.count));

  return (
    <div className="screen-card">
      <h2 className="screen-title">📊 採点統計</h2>
      <div className="mock-badge">モックデータ表示</div>

      <div className="stats-header-card">
        <div className="stats-test-title">{DUMMY_STATS.testTitle}</div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{DUMMY_STATS.totalStudents}</div>
            <div className="stat-label">採点人数</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{DUMMY_STATS.averageScore}</div>
            <div className="stat-label">平均点</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{DUMMY_STATS.maxScore}</div>
            <div className="stat-label">最高点</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{DUMMY_STATS.minScore}</div>
            <div className="stat-label">最低点</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{DUMMY_STATS.medianScore}</div>
            <div className="stat-label">中央値</div>
          </div>
        </div>
      </div>

      <h3 className="section-heading">設問別正答率</h3>
      <div className="question-stats-list">
        {DUMMY_STATS.questionStats.map((q) => (
          <div key={q.label} className="question-stat-row">
            <div className="q-label">{q.label}</div>
            <div className="q-bar-wrap">
              <div
                className="q-bar"
                style={{ width: `${q.correctRate}%` }}
              />
            </div>
            <div className="q-rate">{q.correctRate}%</div>
            <div className="q-avg">平均 {q.average}/{q.maxScore}</div>
          </div>
        ))}
      </div>

      <h3 className="section-heading">得点分布</h3>
      <div className="distribution-chart">
        {DUMMY_STATS.distribution.map((d) => (
          <div key={d.range} className="dist-col">
            <div className="dist-count">{d.count}</div>
            <div
              className="dist-bar"
              style={{
                height: maxCount > 0 ? `${(d.count / maxCount) * 80}px` : '0px',
              }}
            />
            <div className="dist-range">{d.range}</div>
          </div>
        ))}
      </div>

      <div className="screen-actions">
        <button className="btn btn-outline" onClick={() => onNavigate('output')}>
          ← 出力確認へ
        </button>
        <button className="btn btn-outline" onClick={() => onNavigate('history')}>
          採点履歴 →
        </button>
      </div>
    </div>
  );
}
