import type { Screen } from '../types';
import { WORKFLOW_STEPS } from '../data/dummyData';

interface Props {
  onNavigate: (s: Screen) => void;
}

export default function HomeScreen({ onNavigate }: Props) {
  return (
    <div>
      {/* Hero */}
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg,#1d4ed8 0%,#2563eb 60%,#3b82f6 100%)', color: '#fff', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ fontSize: '3rem' }}>📝</div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>MaruFlow</h1>
            <p style={{ fontSize: '.95rem', opacity: .9 }}>紙テスト採点支援アプリ — MVP モック</p>
            <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="tag" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>MVP v0.1</span>
              <span className="tag" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>UIモック</span>
              <span className="tag" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>架空データ使用</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow overview */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title">📋 採点ワークフロー</div>
        <div className="workflow-steps">
          {WORKFLOW_STEPS.map((step, i) => (
            <div
              key={step.id}
              className={`workflow-step ${i < 2 ? 'done' : i === 2 ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => onNavigate(step.screen)}
            >
              <div className="step-circle">
                {i < 2 ? '✓' : step.icon}
              </div>
              <div className="step-label">{step.label}</div>
            </div>
          ))}
        </div>
        <p className="text-sub mt-16" style={{ textAlign: 'center' }}>
          各ステップをクリックして画面を確認できます（デモ用）
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('pdf-register')}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>📄</div>
          <div className="card-title" style={{ marginBottom: 4 }}>PDF登録</div>
          <p className="text-sub">空白問題PDFを登録してテストを作成します</p>
          <button className="btn btn-primary mt-12" style={{ width: '100%' }}>開く</button>
        </div>
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('scoring')}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>✏️</div>
          <div className="card-title" style={{ marginBottom: 4 }}>採点する</div>
          <p className="text-sub">答案に丸・バツ・点数・コメントを付けます</p>
          <button className="btn btn-success mt-12" style={{ width: '100%' }}>開く</button>
        </div>
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('output')}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>📤</div>
          <div className="card-title" style={{ marginBottom: 4 }}>PDF出力</div>
          <p className="text-sub">採点済みPDFを確認・ダウンロードします</p>
          <button className="btn btn-outline mt-12" style={{ width: '100%' }}>開く</button>
        </div>
      </div>

      {/* MVP scope */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title">✅ MVP 対象（このモック）</div>
          <ul style={{ paddingLeft: 18, lineHeight: 2, fontSize: '.9rem' }}>
            <li>PDF上に手動で丸・バツ・点数・コメントを置く</li>
            <li>採点欄の位置を定義する</li>
            <li>採点済みPDFとして出力する（モック）</li>
            <li>架空のテスト・架空の答案でデモ</li>
          </ul>
        </div>
        <div className="card">
          <div className="card-title">🔜 次フェーズ（MVP外）</div>
          <ul style={{ paddingLeft: 18, lineHeight: 2, fontSize: '.9rem', color: 'var(--color-text-sub)' }}>
            <li><span className="tag tag-gray">Next</span> AI採点（自動丸付け）</li>
            <li><span className="tag tag-gray">Next</span> OCR（手書き文字認識）</li>
            <li><span className="tag tag-gray">Next</span> クラス管理・名簿連携</li>
            <li><span className="tag tag-gray">Next</span> 成績集計・分析</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
