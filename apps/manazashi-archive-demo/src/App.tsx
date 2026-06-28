// ============================================================
// App.tsx — まなざしアーカイブ架空デモ
// ※ 実児童データは一切使用していません。すべて架空のデータです。
// ============================================================
import { useState, useCallback } from 'react';
import type { FictionalChild, ViewMode } from './types';
import { FICTIONAL_CHILDREN } from './data/children';

function generateStoryPrompt(child: FictionalChild): string {
  const records = child.records.map((r) =>
    `【${r.grade}年生 ${r.term}・${r.subject}】${r.event}\n` +
    (r.quote ? `  発言: 「${r.quote}」\n` : '') +
    `  観察: ${r.teacherNote}\n` +
    (r.selfReflection ? `  振り返り: ${r.selfReflection}\n` : '')
  ).join('\n');

  return `# 学びの物語 生成プロンプト（架空デモ）

以下は架空の小学生（${child.alias}）の6年間の学びの記録です。
実在する児童のデータではありません。

## 児童プロフィール（架空）
${child.alias}：${child.type}
${child.profile}

## 学びの記録（架空）
${records}

## 依頼
この記録をもとに、卒業時に本人に手渡す「学びの物語」を書いてください。

条件：
- 本人への語りかけ（「あなたは〜」）の文体で書く
- 成績や評価ではなく、学びの姿勢・変化・印象的な瞬間を中心に書く
- 400〜600字程度
- 温かく、前向きなトーンで
- 個人情報（実名・学校名等）は含めない

---
_※ このプロンプトはまなざしアーカイブ架空デモにより生成されました。_
_※ 実際の児童に使用する際は、個人情報保護・倫理的配慮を十分に検討してください。_`;
}

export default function App() {
  const [selectedChild, setSelectedChild] = useState<FictionalChild | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('select');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  const handleSelectChild = (child: FictionalChild) => {
    setSelectedChild(child);
    setViewMode('timeline');
  };

  const handleBack = () => {
    setSelectedChild(null);
    setViewMode('select');
  };

  // ---- 倫理ページ ----
  if (viewMode === 'ethics') {
    return (
      <div>
        <header className="app-header">
          <h1>📚 まなざしアーカイブ</h1>
          <div className="subtitle">架空デモ — 倫理的注意事項</div>
        </header>
        <div className="ethics-page">
          <button className="back-btn" onClick={() => setViewMode('select')} type="button">
            ← デモに戻る
          </button>
          <h2 className="ethics-title">⚖️ 倫理的注意事項</h2>
          <div className="ethics-section">
            <h3>このデモは何ではないか</h3>
            <p>このデモは以下のものではありません。</p>
            <ul>
              <li>所見の自動生成ツールではありません</li>
              <li>成績管理システムではありません</li>
              <li>児童監視・評価ツールではありません</li>
              <li>個人情報を収集・保存するシステムではありません</li>
              <li>教師の専門的判断を代替するものではありません</li>
            </ul>
          </div>
          <div className="ethics-section">
            <h3>このデモの目的</h3>
            <p>
              「学校に残る先生のまなざしを、子ども自身の人生に返す」という構想を、
              架空データで体験できるデモです。
              実際に運用する場合は、以下の検討が必要です。
            </p>
          </div>
          <div className="ethics-section">
            <h3>実データ投入前に必要な検討</h3>
            <ul>
              <li>保護者・児童本人への説明と同意取得</li>
              <li>データの保存場所・アクセス権限の設計</li>
              <li>データの保存期間と削除ルール</li>
              <li>個人情報保護法・学校教育法との整合確認</li>
              <li>学校・自治体・教育委員会への相談</li>
              <li>AIが生成した文章の確認・修正プロセスの設計</li>
              <li>「物語」が本人にとって有益かどうかの継続的な評価</li>
            </ul>
          </div>
          <div className="ethics-section">
            <h3>個人情報保護</h3>
            <p>
              このデモでは実児童データを一切使用していません。
              実際に運用する場合は、個人情報保護法に基づく適切な管理が必要です。
              学校外のサービス（ChatGPT等）に個人情報を送信することは、
              学校・自治体のルールに従って慎重に判断してください。
            </p>
          </div>
          <div className="ethics-section">
            <h3>AIと教師の役割</h3>
            <p>
              AIは「学びの物語」の下書きを生成できますが、
              最終的な文章は必ず教師が確認・修正してください。
              子どもへの言葉は、教師の専門的判断と温かさが不可欠です。
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---- 児童選択画面 ----
  if (viewMode === 'select') {
    return (
      <div>
        <header className="app-header">
          <h1>📚 まなざしアーカイブ</h1>
          <div className="subtitle">架空デモ — 学びの物語を体験する</div>
        </header>
        <div className="disclaimer-banner">
          ⚠️ このデモは<strong>架空データ</strong>のみを使用しています。
          実在する児童・人物とは一切関係ありません。
          個人情報は含まれていません。
        </div>
        <div className="select-page">
          <div className="concept-box">
            <h2 className="concept-title">「学校に残る先生のまなざしを、子ども自身の人生に返す」</h2>
            <p className="concept-text">
              先生は6年間、子どもたちの学びを見つめてきました。
              その「まなざし」を、卒業時に「学びの物語」として本人に返す——
              そんな構想の架空デモです。
            </p>
          </div>

          <h3 className="section-heading">架空の児童を選んでください</h3>
          <div className="child-cards">
            {FICTIONAL_CHILDREN.map((child) => (
              <div
                key={child.id}
                className="child-card"
                onClick={() => handleSelectChild(child)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSelectChild(child); }}
              >
                <div className="child-alias">{child.alias}</div>
                <div className="child-type">{child.type}</div>
                <p className="child-profile">{child.profile}</p>
                <div className="child-record-count">記録 {child.records.length}件</div>
              </div>
            ))}
          </div>

          <div className="ethics-link-box">
            <button
              className="ethics-link-btn"
              onClick={() => setViewMode('ethics')}
              type="button"
            >
              ⚖️ 倫理的注意事項を読む
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedChild) return null;

  // ---- タイムライン・物語画面 ----
  return (
    <div>
      <header className="app-header">
        <h1>📚 まなざしアーカイブ</h1>
        <div className="subtitle">架空デモ — {selectedChild.alias}の学びの記録</div>
      </header>
      <div className="disclaimer-banner">
        ⚠️ このデモは<strong>架空データ</strong>のみを使用しています。実在する児童とは無関係です。
      </div>

      <div className="child-detail-page">
        <div className="child-detail-header">
          <button className="back-btn" onClick={handleBack} type="button">
            ← 児童選択に戻る
          </button>
          <div className="tab-bar">
            <button
              className={`tab-btn${viewMode === 'timeline' ? ' active' : ''}`}
              onClick={() => setViewMode('timeline')}
              type="button"
            >
              📅 タイムライン
            </button>
            <button
              className={`tab-btn${viewMode === 'story' ? ' active' : ''}`}
              onClick={() => setViewMode('story')}
              type="button"
            >
              📖 物語生成デモ
            </button>
          </div>
        </div>

        <div className="child-profile-box">
          <div className="child-alias-large">{selectedChild.alias}</div>
          <div className="child-type-large">{selectedChild.type}</div>
          <p className="child-profile-text">{selectedChild.profile}</p>
        </div>

        {viewMode === 'timeline' && (
          <div className="timeline">
            {selectedChild.records.map((record, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-marker">{record.grade}年</div>
                <div className="timeline-content">
                  <div className="timeline-meta">
                    {record.term} ・ {record.subject}
                  </div>
                  <div className="timeline-event">{record.event}</div>
                  {record.quote && (
                    <blockquote className="timeline-quote">「{record.quote}」</blockquote>
                  )}
                  {record.workMemo && (
                    <div className="timeline-work">🎨 {record.workMemo}</div>
                  )}
                  <div className="timeline-teacher">
                    <span className="teacher-label">先生のまなざし</span>
                    {record.teacherNote}
                  </div>
                  {record.selfReflection && (
                    <div className="timeline-reflection">
                      <span className="reflection-label">本人の振り返り</span>
                      {record.selfReflection}
                    </div>
                  )}
                  <div className="tag-list">
                    {record.tags.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'story' && (
          <div className="story-section">
            <div className="story-notice">
              <strong>📖 学びの物語 生成デモ</strong><br />
              下のプロンプトをChatGPTに貼り付けると、
              この架空児童の「学びの物語」の下書きを生成できます。<br />
              <span className="story-notice-sub">
                ※ 実際の児童に使用する際は、個人情報保護・倫理的配慮を十分に検討してください。
              </span>
            </div>
            <div className="story-prompt-box">
              <pre className="prompt-text">
                {generateStoryPrompt(selectedChild)}
              </pre>
              <button
                className="copy-btn"
                onClick={() => handleCopy(generateStoryPrompt(selectedChild), 'story-prompt')}
                type="button"
              >
                {copiedKey === 'story-prompt' ? '✓ コピー済み' : '📋 コピー'}
              </button>
            </div>
            <div className="ethics-inline">
              <button
                className="ethics-link-btn"
                onClick={() => setViewMode('ethics')}
                type="button"
              >
                ⚖️ 倫理的注意事項を読む
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
