// ============================================================
// App.tsx — まなざしアーカイブ架空デモ
// ※ すべて架空のデータです。実在する児童・人物とは関係ありません。
// ※ 所見の自動生成・成績管理・監視を目的としたものではありません。
// ============================================================
import { useState } from 'react';
import type { ViewMode, StoryStyle } from './types';
import { STORY_STYLE_LABELS, STORY_STYLE_DESCRIPTIONS } from './types';
import { FICTIONAL_CHILDREN } from './data/children';
import { generateStory } from './logic/generateStory';

const GRADE_LABELS: Record<number, string> = {
  1: '1年生', 2: '2年生', 3: '3年生', 4: '4年生', 5: '5年生', 6: '6年生',
};

const SUBJECT_COLORS: Record<string, string> = {
  '理科': '#3b82f6',
  '英語': '#10b981',
  '英語活動': '#10b981',
  '図工': '#f59e0b',
  '生活科': '#84cc16',
  '国語': '#8b5cf6',
  '体育': '#ef4444',
  '総合': '#6b7280',
  '学活': '#ec4899',
  '算数': '#f97316',
};

function getSubjectColor(subject: string): string {
  return SUBJECT_COLORS[subject] || '#6b7280';
}

export default function App() {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('select');
  const [storyStyle, setStoryStyle] = useState<StoryStyle>('gentle');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const selectedChild = FICTIONAL_CHILDREN.find(c => c.id === selectedChildId) || null;

  const handleCopy = async (text: string, key: string) => {
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
  };

  const filteredRecords = selectedChild
    ? selectedChild.records.filter(r => {
        if (selectedGrade !== null && r.grade !== selectedGrade) return false;
        if (selectedSubject && r.subject !== selectedSubject) return false;
        if (selectedTag && !r.tags.includes(selectedTag)) return false;
        return true;
      })
    : [];

  const allTags = selectedChild
    ? [...new Set(selectedChild.records.flatMap(r => r.tags))].sort()
    : [];

  const allSubjects = selectedChild
    ? [...new Set(selectedChild.records.map(r => r.subject))].sort()
    : [];

  return (
    <div>
      <header className="app-header">
        <h1>🌱 まなざしアーカイブ</h1>
        <div className="subtitle">Manazashi Archive Demo — 架空データによるコンセプトデモ</div>
      </header>

      <div className="disclaimer-banner">
        ⚠️ <strong>架空データのデモです。</strong>実在する児童・人物とは一切関係ありません。
        所見の自動生成・成績管理・監視を目的としたものではありません。
      </div>

      <nav className="tab-nav">
        <button className={`tab-btn${viewMode === 'select' ? ' active' : ''}`}
          onClick={() => setViewMode('select')}>👤 児童を選ぶ</button>
        {selectedChild && (
          <>
            <button className={`tab-btn${viewMode === 'timeline' ? ' active' : ''}`}
              onClick={() => setViewMode('timeline')}>📅 タイムライン</button>
            <button className={`tab-btn${viewMode === 'story' ? ' active' : ''}`}
              onClick={() => setViewMode('story')}>📖 学びの物語</button>
          </>
        )}
        <button className={`tab-btn${viewMode === 'ethics' ? ' active' : ''}`}
          onClick={() => setViewMode('ethics')}>🔍 倫理説明</button>
      </nav>

      <main className="main-content">

        {/* 児童選択 */}
        {viewMode === 'select' && (
          <div>
            <div className="card">
              <div className="concept-box">
                <div className="concept-title">「学校に残る先生のまなざしを、子ども自身の人生に返す」</div>
                <p className="concept-text">
                  先生は6年間、子どもたちの学びを見つめてきました。
                  その「まなざし」を、卒業時に「学びの物語」として本人に返す——
                  そんな構想の架空デモです。
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-title">架空児童を選ぶ</div>
              <div className="notice">
                以下はすべて架空のデータです。実在する児童とは関係ありません。
                「まなざし」（学びの記録）のコンセプトを体験するためのデモです。
              </div>
              <div className="child-grid">
                {FICTIONAL_CHILDREN.map(child => (
                  <div
                    key={child.id}
                    className={`child-card${selectedChildId === child.id ? ' selected' : ''}`}
                    onClick={() => {
                      setSelectedChildId(child.id);
                      setViewMode('timeline');
                      setSelectedGrade(null);
                      setSelectedSubject(null);
                      setSelectedTag(null);
                    }}
                  >
                    <div className="child-alias">{child.alias}</div>
                    <div className="child-type">{child.type}</div>
                    <div className="child-profile">{child.profile}</div>
                    <div className="child-meta">記録数：{child.records.length}件 / 1〜6年</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* タイムライン */}
        {viewMode === 'timeline' && selectedChild && (
          <div>
            <div className="card">
              <div className="card-title">
                {selectedChild.alias} のタイムライン
                <span className="child-type-badge">{selectedChild.type}</span>
              </div>

              <div className="filter-row">
                <div className="filter-group">
                  <label className="filter-label">学年</label>
                  <div className="filter-chips">
                    <button className={`chip${selectedGrade === null ? ' active' : ''}`}
                      onClick={() => setSelectedGrade(null)}>全学年</button>
                    {[1, 2, 3, 4, 5, 6].map(g => (
                      <button key={g}
                        className={`chip${selectedGrade === g ? ' active' : ''}`}
                        onClick={() => setSelectedGrade(selectedGrade === g ? null : g)}>
                        {GRADE_LABELS[g]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">教科</label>
                  <div className="filter-chips">
                    <button className={`chip${selectedSubject === null ? ' active' : ''}`}
                      onClick={() => setSelectedSubject(null)}>全教科</button>
                    {allSubjects.map(s => (
                      <button key={s}
                        className={`chip${selectedSubject === s ? ' active' : ''}`}
                        style={selectedSubject === s ? { background: getSubjectColor(s), borderColor: getSubjectColor(s), color: '#fff' } : {}}
                        onClick={() => setSelectedSubject(selectedSubject === s ? null : s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">タグ</label>
                  <div className="filter-chips">
                    <button className={`chip${selectedTag === null ? ' active' : ''}`}
                      onClick={() => setSelectedTag(null)}>全タグ</button>
                    {allTags.map(t => (
                      <button key={t}
                        className={`chip chip-tag${selectedTag === t ? ' active' : ''}`}
                        onClick={() => setSelectedTag(selectedTag === t ? null : t)}>
                        #{t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="timeline-count">{filteredRecords.length}件の記録を表示中</div>
            </div>

            {[1, 2, 3, 4, 5, 6].map(grade => {
              const gradeRecords = filteredRecords.filter(r => r.grade === grade);
              if (gradeRecords.length === 0) return null;
              return (
                <div key={grade} className="grade-section">
                  <div className="grade-header">
                    <span className="grade-badge">{GRADE_LABELS[grade]}</span>
                  </div>
                  <div className="timeline">
                    {gradeRecords.map((record, idx) => (
                      <div key={idx} className="timeline-item">
                        <div className="timeline-dot"
                          style={{ background: getSubjectColor(record.subject) }} />
                        <div className="timeline-card">
                          <div className="timeline-header">
                            <span className="subject-badge"
                              style={{ background: getSubjectColor(record.subject) }}>
                              {record.subject}
                            </span>
                            <span className="timeline-term">{record.term}</span>
                            <span className="timeline-event-label">{record.event}</span>
                          </div>

                          {record.quote && (
                            <div className="record-quote">
                              <span className="quote-icon">💬</span>
                              「{record.quote}」
                            </div>
                          )}

                          {record.workMemo && (
                            <div className="record-workmemo">
                              <span className="workmemo-label">作品メモ</span>
                              {record.workMemo}
                            </div>
                          )}

                          <div className="record-teacher">
                            <span className="teacher-label">教師の観察メモ</span>
                            <p>{record.teacherNote}</p>
                          </div>

                          {record.selfReflection && (
                            <div className="record-reflection">
                              <span className="reflection-label">本人の振り返り</span>
                              <p>「{record.selfReflection}」</p>
                            </div>
                          )}

                          <div className="record-tags">
                            {record.tags.map(tag => (
                              <span key={tag}
                                className={`tag${selectedTag === tag ? ' active' : ''}`}
                                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 学びの物語 */}
        {viewMode === 'story' && selectedChild && (
          <div>
            <div className="card">
              <div className="card-title">
                {selectedChild.alias} の「あなたの学びの物語」
              </div>
              <div className="notice">
                ⚠️ これは架空データから生成された物語です。実在する児童とは関係ありません。
                所見の自動生成ではなく、学びの記録を物語として整理するコンセプトデモです。
              </div>

              <div className="style-grid">
                {(Object.keys(STORY_STYLE_LABELS) as StoryStyle[]).map(style => (
                  <div
                    key={style}
                    className={`style-card${storyStyle === style ? ' selected' : ''}`}
                    onClick={() => setStoryStyle(style)}
                  >
                    <div className="style-label">{STORY_STYLE_LABELS[style]}</div>
                    <div className="style-desc">{STORY_STYLE_DESCRIPTIONS[style]}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-title">{STORY_STYLE_LABELS[storyStyle]}</div>
              <pre className="story-pre">{generateStory(selectedChild, storyStyle)}</pre>
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <button
                  className={`copy-btn${copiedKey === storyStyle ? ' copied' : ''}`}
                  onClick={() => handleCopy(generateStory(selectedChild, storyStyle), storyStyle)}>
                  {copiedKey === storyStyle ? '✓ コピーしました' : '📋 クリップボードにコピー'}
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-title">3スタイルの比較</div>
              <table className="style-compare-table">
                <thead>
                  <tr>
                    <th>スタイル</th>
                    <th>特徴</th>
                    <th>主な読者</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>やさしい文体</strong></td>
                    <td>本人への語りかけ。温かく親しみやすい言葉</td>
                    <td>本人（子ども）</td>
                  </tr>
                  <tr>
                    <td><strong>卒業文集風</strong></td>
                    <td>少し改まった文体。6年間を振り返る</td>
                    <td>本人・クラスメート</td>
                  </tr>
                  <tr>
                    <td><strong>保護者向け説明文風</strong></td>
                    <td>客観的な説明文体。成長を整理して伝える</td>
                    <td>保護者・教師</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 倫理説明 */}
        {viewMode === 'ethics' && (
          <div className="ethics-page">
            <div className="ethics-hero">
              <div className="ethics-icon">🔍</div>
              <h2>このアプリについて — 倫理的な説明</h2>
            </div>

            <div className="card">
              <div className="card-title">このアプリは何ですか？</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#374151' }}>
                「まなざしアーカイブ」は、子どもの学びの記録（観察メモ・発言・振り返り）を
                時系列で整理し、「学びの物語」として出力するコンセプトデモです。
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#374151', marginTop: 8 }}>
                <strong>すべてのデータは架空です。</strong>実在する児童・人物・学校とは一切関係ありません。
              </p>
            </div>

            <div className="card">
              <div className="card-title">❌ これは何ではないか</div>
              <div className="ethics-not-grid">
                {[
                  { icon: '📝', title: '所見の自動生成ではありません', desc: '通知表の所見文を自動生成するツールではありません。教師の観察・判断を代替するものではなく、記録を整理する補助ツールです。' },
                  { icon: '📊', title: '成績管理ではありません', desc: '点数・評定・成績を管理するシステムではありません。数値化できない学びの質的な側面を記録することを目的としています。' },
                  { icon: '👁️', title: '監視ではありません', desc: '子どもの行動を監視・追跡するシステムではありません。教師が気づいた「まなざし」（成長の瞬間）を記録するものです。' },
                  { icon: '🤖', title: '判断の自動化ではありません', desc: '子どもの評価・進路・指導方針を自動的に決定するものではありません。すべての判断は教師・保護者・本人が行います。' },
                ].map(item => (
                  <div key={item.title} className="ethics-not-card">
                    <div className="ethics-not-icon">{item.icon}</div>
                    <div className="ethics-not-title">{item.title}</div>
                    <div className="ethics-not-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-title">✅ このアプリが大切にしていること</div>
              <ul className="ethics-list">
                <li><strong>子どもの主体性</strong>：本人の振り返りを記録の中心に置く</li>
                <li><strong>教師の専門性</strong>：観察・解釈は教師が行い、アプリは整理を補助するだけ</li>
                <li><strong>保護者との共有</strong>：成長の記録を家庭と学校で共有する手段として使う</li>
                <li><strong>個人情報の保護</strong>：実名・写真・住所などの個人情報は使わない設計</li>
                <li><strong>透明性</strong>：何を記録し、何を記録しないかを明示する</li>
              </ul>
            </div>

            <div className="card">
              <div className="card-title">実データ投入前に必要な検討</div>
              <ul className="ethics-list">
                <li>保護者・児童本人への説明と同意取得</li>
                <li>データの保存場所・アクセス権限の設計</li>
                <li>データの保存期間と削除ルール</li>
                <li>個人情報保護法・学校教育法との整合確認</li>
                <li>学校・自治体・教育委員会への相談</li>
                <li>AIが生成した文章の確認・修正プロセスの設計</li>
                <li>「物語」が本人にとって有益かどうかの継続的な評価</li>
              </ul>
            </div>
          </div>
        )}

      </main>

      <footer className="app-footer">
        まなざしアーカイブ — 架空データによるコンセプトデモ<br />
        所見の自動生成・成績管理・監視を目的としたものではありません。
      </footer>
    </div>
  );
}
