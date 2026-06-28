import { useState } from 'react';
import type { Screen, Question } from '../types';
import { DUMMY_QUESTIONS } from '../data/dummyData';

interface Props {
  onNavigate: (s: Screen) => void;
}

export default function ScoringSetupScreen({ onNavigate }: Props) {
  const [questions, setQuestions] = useState<Question[]>(DUMMY_QUESTIONS);
  const [selected, setSelected] = useState<string | null>('q1');
  const [saved, setSaved] = useState(false);

  const selectedQ = questions.find((q) => q.id === selected);

  const updateQ = (id: string, field: keyof Question, value: number | string) => {
    setQuestions((qs) =>
      qs.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const totalMax = questions.reduce((s, q) => s + q.maxScore, 0);

  return (
    <div>
      <div className="section-heading">
        <span>🗂️</span> 採点欄設定
        <span className="tag tag-blue" style={{ marginLeft: 'auto' }}>ステップ 2 / 5</span>
      </div>

      <p className="text-sub mb-16">
        PDF上の各問題の位置と配点を定義します。実際の実装ではPDF上をドラッグして範囲を指定します。
        このモックでは架空の設定値を編集できます。
      </p>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* PDF mock with zones */}
        <div>
          <div className="card-title">問題ゾーン配置（ダミープレビュー）</div>
          <div className="pdf-canvas-wrap">
            <div className="pdf-canvas-bg">
              <div className="pdf-header-block">
                <div>
                  <h2>第1回 算数テスト（架空）</h2>
                  <p>4年生 ／ 氏名：＿＿＿＿＿＿＿＿</p>
                </div>
                <div className="pdf-score-box">点</div>
              </div>
            </div>
            {/* Question zones */}
            {questions.map((q) => (
              <div
                key={q.id}
                className={`pdf-question-zone ${selected === q.id ? 'selected' : ''}`}
                style={{
                  left: `${q.x}%`,
                  top: `${q.y}%`,
                  width: `${q.width}%`,
                  height: `${q.height}%`,
                }}
                onClick={() => setSelected(q.id)}
              >
                <span className="pdf-question-label">{q.label} ({q.maxScore}点)</span>
              </div>
            ))}
          </div>
          <p className="text-small text-sub mt-8">
            ※ ゾーンをクリックして選択し、右パネルで編集できます
          </p>
        </div>

        {/* Edit panel */}
        <div>
          <div className="card-title">問題一覧 · 合計 {totalMax} 点</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {questions.map((q) => (
              <div
                key={q.id}
                onClick={() => setSelected(q.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${selected === q.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: selected === q.id ? '#eff6ff' : 'var(--color-surface)',
                  cursor: 'pointer',
                  transition: 'all .15s',
                }}
              >
                <span style={{ fontWeight: 700, minWidth: 32 }}>{q.label}</span>
                <span className="text-sub" style={{ flex: 1 }}>
                  位置: ({q.x}%, {q.y}%) · {q.width}×{q.height}%
                </span>
                <span className="tag tag-blue">{q.maxScore}点</span>
              </div>
            ))}
          </div>

          {/* Selected question editor */}
          {selectedQ && (
            <div style={{
              border: '1.5px solid var(--color-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: 16,
              background: '#f8faff',
            }}>
              <div className="card-title" style={{ marginBottom: 12 }}>
                ✏️ {selectedQ.label} を編集
              </div>
              <div className="grid-2" style={{ marginBottom: 12 }}>
                <div>
                  <label className="form-label">ラベル</label>
                  <input
                    className="form-input"
                    value={selectedQ.label}
                    onChange={(e) => updateQ(selectedQ.id, 'label', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">配点（点）</label>
                  <input
                    className="form-input"
                    type="number"
                    value={selectedQ.maxScore}
                    onChange={(e) => updateQ(selectedQ.id, 'maxScore', Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid-2" style={{ marginBottom: 12 }}>
                <div>
                  <label className="form-label">X位置 (%)</label>
                  <input
                    className="form-input"
                    type="number"
                    value={selectedQ.x}
                    onChange={(e) => updateQ(selectedQ.id, 'x', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="form-label">Y位置 (%)</label>
                  <input
                    className="form-input"
                    type="number"
                    value={selectedQ.y}
                    onChange={(e) => updateQ(selectedQ.id, 'y', Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid-2">
                <div>
                  <label className="form-label">幅 (%)</label>
                  <input
                    className="form-input"
                    type="number"
                    value={selectedQ.width}
                    onChange={(e) => updateQ(selectedQ.id, 'width', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="form-label">高さ (%)</label>
                  <input
                    className="form-input"
                    type="number"
                    value={selectedQ.height}
                    onChange={(e) => updateQ(selectedQ.id, 'height', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}

          {saved && (
            <div style={{ marginTop: 12, color: 'var(--color-success)', fontWeight: 600, fontSize: '.9rem' }}>
              ✅ 設定を保存しました（デモ）
            </div>
          )}

          <button className="btn btn-primary mt-12 w-full" onClick={handleSave}>
            💾 設定を保存
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button className="btn btn-outline" onClick={() => onNavigate('pdf-register')}>← PDF登録へ</button>
        <button className="btn btn-primary" onClick={() => onNavigate('scoring')}>
          次へ：採点画面 →
        </button>
      </div>
    </div>
  );
}
