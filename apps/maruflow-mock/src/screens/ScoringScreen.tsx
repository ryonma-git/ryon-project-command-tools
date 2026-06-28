import { useState } from 'react';
import type { Screen, MarkType, ScoreEntry } from '../types';
import { DUMMY_TEST } from '../data/dummyData';

interface Props {
  onNavigate: (s: Screen) => void;
}

const MARK_SYMBOL: Record<MarkType, string> = {
  maru: '○',
  batsu: '✕',
  sankaku: '△',
  none: '—',
};

const MARK_COLOR: Record<MarkType, string> = {
  maru: 'var(--color-maru)',
  batsu: 'var(--color-batsu)',
  sankaku: 'var(--color-sankaku)',
  none: 'var(--color-text-sub)',
};

export default function ScoringScreen({ onNavigate }: Props) {
  const [sheetIndex, setSheetIndex] = useState(0);
  const [selectedQId, setSelectedQId] = useState<string>('q1');
  const [scores, setScores] = useState<Record<string, ScoreEntry[]>>(
    Object.fromEntries(
      DUMMY_TEST.answerSheets.map((s) => [s.id, s.scores.map((sc) => ({ ...sc }))])
    )
  );

  const sheet = DUMMY_TEST.answerSheets[sheetIndex];
  const sheetScores = scores[sheet.id];
  const selectedEntry = sheetScores.find((e) => e.questionId === selectedQId);
  const selectedQ = DUMMY_TEST.questions.find((q) => q.id === selectedQId);

  const totalScore = sheetScores.reduce((s, e) => s + (e.score ?? 0), 0);
  const totalMax   = DUMMY_TEST.questions.reduce((s, q) => s + q.maxScore, 0);
  const doneCount  = sheetScores.filter((e) => e.mark !== 'none').length;

  const updateEntry = (field: keyof ScoreEntry, value: string | number | null) => {
    setScores((prev) => ({
      ...prev,
      [sheet.id]: prev[sheet.id].map((e) =>
        e.questionId === selectedQId ? { ...e, [field]: value } : e
      ),
    }));
  };

  const setMark = (mark: MarkType) => {
    const q = DUMMY_TEST.questions.find((q) => q.id === selectedQId);
    const autoScore = mark === 'maru' ? (q?.maxScore ?? null) : mark === 'batsu' ? 0 : null;
    setScores((prev) => ({
      ...prev,
      [sheet.id]: prev[sheet.id].map((e) =>
        e.questionId === selectedQId
          ? { ...e, mark, score: autoScore !== null ? autoScore : e.score }
          : e
      ),
    }));
  };

  return (
    <div>
      <div className="section-heading">
        <span>✏️</span> 採点画面
        <span className="tag tag-blue" style={{ marginLeft: 'auto' }}>ステップ 3–4 / 5</span>
      </div>

      {/* Student selector */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span className="card-title" style={{ marginBottom: 0 }}>答案選択：</span>
          {DUMMY_TEST.answerSheets.map((s, i) => (
            <button
              key={s.id}
              className={`btn ${i === sheetIndex ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 14px' }}
              onClick={() => { setSheetIndex(i); setSelectedQId('q1'); }}
            >
              {s.studentName}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="tag tag-blue">{doneCount}/{DUMMY_TEST.questions.length} 問採点済</span>
            <span className="tag tag-green" style={{ fontSize: '.85rem', padding: '4px 12px' }}>
              {totalScore} / {totalMax} 点
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
        {/* PDF mock */}
        <div>
          <div className="card-title">答案プレビュー — {sheet.studentName}（架空）</div>
          <div className="pdf-canvas-wrap">
            <div className="pdf-canvas-bg">
              <div className="pdf-header-block">
                <div>
                  <h2>第1回 算数テスト（架空）</h2>
                  <p>4年生 ／ 氏名：{sheet.studentName}</p>
                </div>
                <div className="pdf-score-box">{totalScore}</div>
              </div>
            </div>
            {/* dummy lines */}
            <div style={{ position: 'absolute', inset: 0, padding: '5%', paddingTop: '22%' }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} style={{ height: 1, background: '#e5e7eb', marginBottom: 'clamp(6px,2.2%,12px)' }} />
              ))}
            </div>
            {/* Question zones with marks */}
            {DUMMY_TEST.questions.map((q) => {
              const entry = sheetScores.find((e) => e.questionId === q.id);
              const mark = entry?.mark ?? 'none';
              return (
                <div
                  key={q.id}
                  className={`pdf-question-zone ${selectedQId === q.id ? 'selected' : ''}`}
                  style={{ left: `${q.x}%`, top: `${q.y}%`, width: `${q.width}%`, height: `${q.height}%` }}
                  onClick={() => setSelectedQId(q.id)}
                >
                  <span className="pdf-question-label">{q.label}</span>
                  {mark !== 'none' && (
                    <span
                      className="pdf-mark-overlay"
                      style={{ color: MARK_COLOR[mark] }}
                    >
                      {MARK_SYMBOL[mark]}
                    </span>
                  )}
                  {entry?.score !== null && entry?.score !== undefined && (
                    <span style={{
                      position: 'absolute',
                      bottom: 2,
                      right: 4,
                      fontSize: 'clamp(.5rem,1.2vw,.65rem)',
                      color: 'var(--color-text-sub)',
                    }}>
                      {entry.score}点
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-small text-sub mt-8">
            ※ 問題ゾーンをクリックして選択し、右パネルで採点します
          </p>
        </div>

        {/* Score panel */}
        <div>
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-title" style={{ marginBottom: 12 }}>
              {selectedQ?.label ?? '—'} を採点
              <span className="text-sub" style={{ fontWeight: 400, marginLeft: 8 }}>
                （満点: {selectedQ?.maxScore ?? '—'}点）
              </span>
            </div>

            <div className="score-panel">
              {/* Mark buttons */}
              <div>
                <label className="form-label">採点マーク</label>
                <div className="mark-btn-group">
                  {(['maru', 'batsu', 'sankaku'] as MarkType[]).map((m) => (
                    <button
                      key={m}
                      className={`mark-btn ${selectedEntry?.mark === m ? `active-${m}` : ''}`}
                      onClick={() => setMark(m)}
                    >
                      {MARK_SYMBOL[m]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Score input */}
              <div>
                <label className="form-label">点数</label>
                <input
                  className="form-input"
                  type="number"
                  min={0}
                  max={selectedQ?.maxScore}
                  value={selectedEntry?.score ?? ''}
                  onChange={(e) =>
                    updateEntry('score', e.target.value === '' ? null : Number(e.target.value))
                  }
                  placeholder="0"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="form-label">コメント</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={selectedEntry?.comment ?? ''}
                  onChange={(e) => updateEntry('comment', e.target.value)}
                  placeholder="例：途中式が不足"
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Score summary table */}
          <div className="card">
            <div className="card-title">採点サマリー</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>問</th>
                  <th>マーク</th>
                  <th>点数</th>
                </tr>
              </thead>
              <tbody>
                {DUMMY_TEST.questions.map((q) => {
                  const e = sheetScores.find((s) => s.questionId === q.id);
                  return (
                    <tr
                      key={q.id}
                      style={{ cursor: 'pointer', background: selectedQId === q.id ? '#eff6ff' : '' }}
                      onClick={() => setSelectedQId(q.id)}
                    >
                      <td style={{ fontWeight: 600 }}>{q.label}</td>
                      <td style={{ color: MARK_COLOR[e?.mark ?? 'none'], fontWeight: 700 }}>
                        {MARK_SYMBOL[e?.mark ?? 'none']}
                      </td>
                      <td>
                        {e?.score !== null && e?.score !== undefined
                          ? `${e.score}/${q.maxScore}`
                          : <span className="text-sub">—</span>}
                      </td>
                    </tr>
                  );
                })}
                <tr style={{ fontWeight: 700 }}>
                  <td colSpan={2}>合計</td>
                  <td style={{ color: 'var(--color-primary)' }}>{totalScore}/{totalMax}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
        <button className="btn btn-outline" onClick={() => onNavigate('scoring-setup')}>← 採点欄設定へ</button>
        <button className="btn btn-primary" onClick={() => onNavigate('output')}>
          次へ：出力確認 →
        </button>
      </div>
    </div>
  );
}
