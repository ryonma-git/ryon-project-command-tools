import { useState } from 'react';
import type { Screen } from '../types';
import { DUMMY_TEST } from '../data/dummyData';

interface Props {
  onNavigate: (s: Screen) => void;
}

const DUMMY_FILES = [
  { name: '第1回算数テスト_空白.pdf', size: '245 KB', date: '2026-06-20', pages: 2 },
  { name: '漢字テスト50問_空白.pdf',  size: '182 KB', date: '2026-06-15', pages: 1 },
];

export default function PdfRegisterScreen({ onNavigate }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(DUMMY_FILES[0].name);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    setUploaded(true);
  };

  return (
    <div>
      <div className="section-heading">
        <span>📄</span> PDF登録
        <span className="tag tag-blue" style={{ marginLeft: 'auto', fontSize: '.75rem' }}>ステップ 1 / 5</span>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Upload area */}
        <div>
          <div className="card-title">空白問題PDFをアップロード</div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => setUploaded(true)}
            style={{
              border: `2px dashed ${dragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '40px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragging ? '#eff6ff' : 'var(--color-bg)',
              transition: 'all .2s',
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📂</div>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>PDFをドラッグ＆ドロップ</p>
            <p className="text-sub">または クリックしてファイルを選択</p>
            <p className="text-small text-sub" style={{ marginTop: 8 }}>
              ※ このモックでは実際のPDFは処理されません
            </p>
          </div>

          {uploaded && (
            <div style={{
              background: '#dcfce7',
              border: '1px solid #86efac',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
            }}>
              <span style={{ fontSize: '1.2rem' }}>✅</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '.9rem' }}>アップロード完了（デモ）</div>
                <div className="text-small text-sub">第1回算数テスト_空白.pdf — 2ページ</div>
              </div>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label className="form-label">テスト名</label>
            <input className="form-input" defaultValue={DUMMY_TEST.title} />
          </div>
          <div className="grid-2">
            <div>
              <label className="form-label">教科</label>
              <input className="form-input" defaultValue={DUMMY_TEST.subject} />
            </div>
            <div>
              <label className="form-label">学年</label>
              <input className="form-input" defaultValue={DUMMY_TEST.grade} />
            </div>
          </div>
        </div>

        {/* File list */}
        <div>
          <div className="card-title">登録済みPDF一覧</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DUMMY_FILES.map((f) => (
              <div
                key={f.name}
                onClick={() => setSelectedFile(f.name)}
                style={{
                  border: `1.5px solid ${selectedFile === f.name ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  background: selectedFile === f.name ? '#eff6ff' : 'var(--color-surface)',
                  transition: 'all .15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.4rem' }}>📄</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{f.name}</div>
                    <div className="text-small text-sub">{f.size} · {f.pages}ページ · {f.date}</div>
                  </div>
                  {selectedFile === f.name && <span className="tag tag-blue">選択中</span>}
                </div>
              </div>
            ))}
          </div>

          {/* PDF preview mock */}
          <div style={{ marginTop: 16 }}>
            <div className="card-title">プレビュー（ダミー）</div>
            <div className="pdf-canvas-wrap" style={{ maxWidth: '100%' }}>
              <div className="pdf-canvas-bg">
                <div className="pdf-header-block">
                  <div>
                    <h2>第1回 算数テスト（架空）</h2>
                    <p>4年生 ／ 氏名：＿＿＿＿＿＿＿＿</p>
                  </div>
                  <div className="pdf-score-box">点</div>
                </div>
                {/* dummy lines */}
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} className="pdf-line" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button className="btn btn-outline" onClick={() => onNavigate('home')}>← ホームへ</button>
        <button className="btn btn-primary" onClick={() => onNavigate('scoring-setup')}>
          次へ：採点欄を設定 →
        </button>
      </div>
    </div>
  );
}
