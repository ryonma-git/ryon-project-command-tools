import { useState } from 'react';
import type { Screen } from '../types';
import { DUMMY_TEST } from '../data/dummyData';

interface Props {
  onNavigate: (s: Screen) => void;
}

const MARK_SYMBOL: Record<string, string> = {
  maru: '○', batsu: '✕', sankaku: '△', none: '—',
};
const MARK_COLOR: Record<string, string> = {
  maru: 'var(--color-maru)',
  batsu: 'var(--color-batsu)',
  sankaku: 'var(--color-sankaku)',
  none: 'var(--color-text-sub)',
};

export default function OutputScreen({ onNavigate }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState<string[]>([]);

  const handleDownload = (name: string) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded((prev) => [...prev, name]);
    }, 1200);
  };

  const handleDownloadAll = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(DUMMY_TEST.answerSheets.map((s) => s.studentName));
    }, 1800);
  };

  return (
    <div>
      <div className="section-heading">
        <span>📤</span> 出力確認
        <span className="tag tag-blue" style={{ marginLeft: 'auto' }}>ステップ 5 / 5</span>
      </div>

      <p className="text-sub mb-16">
        採点済みPDFの内容を確認し、ダウンロードします。
        このモックでは実際のPDF生成は行いません。ダウンロードボタンはデモ動作です。
      </p>

      {/* Summary stats */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          { label: '採点済み答案', value: `${DUMMY_TEST.answerSheets.length} 枚`, icon: '📄', color: 'var(--color-primary)' },
          { label: '平均点',       value: (() => {
            const totals = DUMMY_TEST.answerSheets.map((s) =>
              s.scores.reduce((acc, e) => acc + (e.score ?? 0), 0)
            );
            return `${(totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(1)} 点`;
          })(), icon: '📊', color: 'var(--color-success)' },
          { label: '満点',         value: `${DUMMY_TEST.questions.reduce((s, q) => s + q.maxScore, 0)} 点`, icon: '🏆', color: 'var(--color-warning)' },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 4 }}>{stat.icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div className="text-sub">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Per-student output list */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="card-title" style={{ marginBottom: 0 }}>採点済みPDF一覧</div>
          <button
            className="btn btn-primary"
            onClick={handleDownloadAll}
            disabled={downloading}
          >
            {downloading ? '⏳ 生成中…' : '📦 全員分をまとめてダウンロード'}
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>氏名</th>
              {DUMMY_TEST.questions.map((q) => <th key={q.id}>{q.label}</th>)}
              <th>合計</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {DUMMY_TEST.answerSheets.map((sheet) => {
              const total = sheet.scores.reduce((s, e) => s + (e.score ?? 0), 0);
              const maxTotal = DUMMY_TEST.questions.reduce((s, q) => s + q.maxScore, 0);
              const isDone = downloaded.includes(sheet.studentName);
              return (
                <tr key={sheet.id}>
                  <td style={{ fontWeight: 600 }}>{sheet.studentName}</td>
                  {sheet.scores.map((e) => (
                    <td key={e.questionId} style={{ color: MARK_COLOR[e.mark], fontWeight: 700, textAlign: 'center' }}>
                      {MARK_SYMBOL[e.mark]}
                      {e.score !== null && (
                        <span style={{ color: 'var(--color-text-sub)', fontWeight: 400, fontSize: '.8rem', marginLeft: 2 }}>
                          {e.score}
                        </span>
                      )}
                    </td>
                  ))}
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                    {total}/{maxTotal}
                  </td>
                  <td>
                    {isDone ? (
                      <span className="tag tag-green">✅ 完了</span>
                    ) : (
                      <button
                        className="btn btn-outline"
                        style={{ padding: '4px 10px', fontSize: '.8rem' }}
                        onClick={() => handleDownload(sheet.studentName)}
                        disabled={downloading}
                      >
                        📥 DL
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PDF preview mock */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div>
          <div className="card-title">採点済みPDF プレビュー（架空 太郎）</div>
          <div className="pdf-canvas-wrap">
            <div className="pdf-canvas-bg">
              <div className="pdf-header-block">
                <div>
                  <h2>第1回 算数テスト（架空）</h2>
                  <p>4年生 ／ 氏名：架空 太郎</p>
                </div>
                <div className="pdf-score-box" style={{ color: 'var(--color-primary)' }}>72</div>
              </div>
            </div>
            {/* dummy lines */}
            <div style={{ position: 'absolute', inset: 0, padding: '5%', paddingTop: '22%' }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} style={{ height: 1, background: '#e5e7eb', marginBottom: 'clamp(6px,2.2%,12px)' }} />
              ))}
            </div>
            {/* Zones with marks for first sheet */}
            {DUMMY_TEST.questions.map((q) => {
              const e = DUMMY_TEST.answerSheets[0].scores.find((s) => s.questionId === q.id);
              const mark = e?.mark ?? 'none';
              return (
                <div
                  key={q.id}
                  className="pdf-question-zone"
                  style={{ left: `${q.x}%`, top: `${q.y}%`, width: `${q.width}%`, height: `${q.height}%`, cursor: 'default' }}
                >
                  <span className="pdf-question-label">{q.label}</span>
                  {mark !== 'none' && (
                    <span className="pdf-mark-overlay" style={{ color: MARK_COLOR[mark] }}>
                      {MARK_SYMBOL[mark]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Next steps */}
        <div>
          <div className="card-title">次フェーズへの展望</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { phase: 'Phase 2', title: 'AI採点',       desc: 'GPT-4o Vision等を使い、答案画像から自動で丸・バツを判定する', tag: 'tag-blue' },
              { phase: 'Phase 3', title: 'OCR連携',      desc: '手書き文字を認識し、記述式問題の採点を補助する',             tag: 'tag-blue' },
              { phase: 'Phase 4', title: 'クラス管理',   desc: '名簿と連携し、クラス全体の成績を一括管理・集計する',         tag: 'tag-yellow' },
              { phase: 'Phase 5', title: '成績分析',     desc: '問題別正答率・個人推移グラフ・クラス分布を可視化する',       tag: 'tag-yellow' },
            ].map((item) => (
              <div key={item.title} style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className={`tag ${item.tag}`}>{item.phase}</span>
                  <span style={{ fontWeight: 700, fontSize: '.9rem' }}>{item.title}</span>
                </div>
                <p className="text-sub text-small">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button className="btn btn-outline" onClick={() => onNavigate('scoring')}>← 採点画面へ</button>
        <button className="btn btn-ghost" onClick={() => onNavigate('home')}>🏠 ホームへ戻る</button>
      </div>
    </div>
  );
}
