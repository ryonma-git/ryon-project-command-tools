// ============================================================
// App.tsx — School Ops Portal / 校務ops閲覧ポータル
// ※ サンプルデータのみ使用。実データ・個人情報は含みません。
// ============================================================
import { useState, useMemo, useCallback } from 'react';
import type { OpsCategory, OpsState } from './types';
import { ARTICLES } from './data/articles';

const CATEGORIES: (OpsCategory | 'すべて')[] = [
  'すべて',
  'ICT',
  'ネットワーク',
  'タブレット管理',
  '情報部会',
  'AI活用',
  '学校安全',
  'マニュアル',
];

const STATUS_LABEL: Record<string, string> = {
  confirmed: '確認済み',
  draft: '下書き',
  'needs-review': '要確認',
  outdated: '古い情報',
};

const STATUS_COLOR: Record<string, string> = {
  confirmed: '#16a34a',
  draft: '#d97706',
  'needs-review': '#dc2626',
  outdated: '#64748b',
};

function generateOpsPrompt(articleTitle: string, body: string): string {
  return `# 校務ナレッジ整理プロンプト

以下は学校のICT・校務に関するナレッジメモです（個人情報は含まれていません）。
このメモをもとに、以下の整理をお願いします。

## 対象メモ
**タイトル**: ${articleTitle}

**内容**:
${body}

## 依頼内容
1. このメモの要点を3〜5行でまとめてください
2. 未確認事項・曖昧な点があれば指摘してください
3. 次に確認・更新すべきことを提案してください
4. 他の教員や管理職に共有する際の説明文を作成してください

---
_※ このプロンプトはSchool Ops Portalにより生成されました。_
_※ ChatGPTの回答は参考情報です。正式な判断は学校・自治体のルールに従ってください。_`;
}

export default function App() {
  const [state, setState] = useState<OpsState>({
    activeCategory: 'すべて',
    searchQuery: '',
    selectedArticleId: null,
    showPrompt: false,
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((a) => {
      const matchCat = state.activeCategory === 'すべて' || a.category === state.activeCategory;
      const q = state.searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [state.activeCategory, state.searchQuery]);

  const selectedArticle = useMemo(
    () => ARTICLES.find((a) => a.id === state.selectedArticleId) ?? null,
    [state.selectedArticleId]
  );

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

  const renderMarkdown = (text: string) => {
    // シンプルなMarkdownレンダリング（見出し・太字・リスト・テーブル）
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="md-h2">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="md-h3">{line.slice(4)}</h3>;
      if (line.startsWith('> ')) return <blockquote key={i} className="md-blockquote">{line.slice(2)}</blockquote>;
      if (line.startsWith('- **')) {
        const match = line.match(/^- \*\*(.+?)\*\*(.*)$/);
        if (match) return <li key={i} className="md-li"><strong>{match[1]}</strong>{match[2]}</li>;
      }
      if (line.startsWith('- ')) return <li key={i} className="md-li">{line.slice(2)}</li>;
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="md-bold">{line.slice(2, -2)}</p>;
      if (line.startsWith('|') && line.endsWith('|')) {
        const cells = line.split('|').filter((c) => c.trim() !== '');
        if (cells.every((c) => c.trim().match(/^[-:]+$/))) return null;
        return (
          <tr key={i}>
            {cells.map((c, j) => <td key={j} className="md-td">{c.trim()}</td>)}
          </tr>
        );
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="md-p">{line}</p>;
    });
  };

  return (
    <div>
      <header className="app-header">
        <h1>🏫 School Ops Portal</h1>
        <div className="subtitle">校務ops閲覧ポータル — 学校業務ナレッジベース（サンプルデータ）</div>
      </header>

      <div className="disclaimer-banner">
        ⚠️ このポータルは<strong>サンプルデータ</strong>を使用しています。実際の学校名・個人名・業者名は含まれていません。
        正式な校務情報は学校・自治体の定める文書に従ってください。
      </div>

      <div className="portal-layout">
        {/* サイドバー */}
        <aside className="portal-sidebar">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 記事を検索..."
              value={state.searchQuery}
              onChange={(e) => setState((s) => ({ ...s, searchQuery: e.target.value }))}
            />
          </div>

          <div className="category-list">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-btn${state.activeCategory === cat ? ' active' : ''}`}
                onClick={() => setState((s) => ({ ...s, activeCategory: cat as OpsCategory | 'すべて' }))}
                type="button"
              >
                {cat}
                <span className="category-count">
                  {cat === 'すべて'
                    ? ARTICLES.length
                    : ARTICLES.filter((a) => a.category === cat).length}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* メインコンテンツ */}
        <main className="portal-main">
          {selectedArticle ? (
            <div className="article-view">
              <button
                className="back-btn"
                onClick={() => setState((s) => ({ ...s, selectedArticleId: null, showPrompt: false }))}
                type="button"
              >
                ← 一覧に戻る
              </button>

              <div className="article-header">
                <div className="article-meta">
                  <span className="category-badge">{selectedArticle.category}</span>
                  <span
                    className="status-badge"
                    style={{ color: STATUS_COLOR[selectedArticle.status] }}
                  >
                    {STATUS_LABEL[selectedArticle.status]}
                  </span>
                  <span className="updated-at">更新: {selectedArticle.updatedAt}</span>
                </div>
                <h2 className="article-title">{selectedArticle.title}</h2>
                <p className="article-summary">{selectedArticle.summary}</p>
                <div className="tag-list">
                  {selectedArticle.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>

              <div className="article-body">
                <div className="markdown-content">
                  {renderMarkdown(selectedArticle.body)}
                </div>
              </div>

              {selectedArticle.pendingItems && selectedArticle.pendingItems.length > 0 && (
                <div className="pending-section">
                  <h3 className="section-heading">📋 未確認事項</h3>
                  <ul className="pending-list">
                    {selectedArticle.pendingItems.map((item, i) => (
                      <li key={i} className="pending-item">⬜ {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedArticle.nextActions && selectedArticle.nextActions.length > 0 && (
                <div className="next-actions-section">
                  <h3 className="section-heading">🎯 次に確認すべきこと</h3>
                  <ul className="next-actions-list">
                    {selectedArticle.nextActions.map((item, i) => (
                      <li key={i} className="next-action-item">→ {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="prompt-section">
                <button
                  className="prompt-toggle-btn"
                  onClick={() => setState((s) => ({ ...s, showPrompt: !s.showPrompt }))}
                  type="button"
                >
                  💬 ChatGPTに整理を依頼するプロンプト {state.showPrompt ? '▲' : '▼'}
                </button>
                {state.showPrompt && (
                  <div className="prompt-box">
                    <div className="prompt-notice">
                      ⚠️ プロンプトを使用する際は、個人情報が含まれていないことを確認してからChatGPTに貼り付けてください。
                    </div>
                    <pre className="prompt-text">
                      {generateOpsPrompt(selectedArticle.title, selectedArticle.body)}
                    </pre>
                    <button
                      className="copy-btn"
                      onClick={() => handleCopy(
                        generateOpsPrompt(selectedArticle.title, selectedArticle.body),
                        'ops-prompt'
                      )}
                      type="button"
                    >
                      {copiedKey === 'ops-prompt' ? '✓ コピー済み' : '📋 コピー'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="article-list">
              <div className="list-header">
                <span className="list-count">
                  {filteredArticles.length}件
                  {state.searchQuery && ` / 検索: "${state.searchQuery}"`}
                </span>
              </div>
              {filteredArticles.length === 0 ? (
                <div className="empty-state">
                  <p>該当する記事が見つかりませんでした。</p>
                </div>
              ) : (
                filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="article-card"
                    onClick={() => setState((s) => ({ ...s, selectedArticleId: article.id }))}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setState((s) => ({ ...s, selectedArticleId: article.id }));
                    }}
                  >
                    <div className="article-card-meta">
                      <span className="category-badge">{article.category}</span>
                      <span
                        className="status-badge"
                        style={{ color: STATUS_COLOR[article.status] }}
                      >
                        {STATUS_LABEL[article.status]}
                      </span>
                      <span className="updated-at">{article.updatedAt}</span>
                    </div>
                    <h3 className="article-card-title">{article.title}</h3>
                    <p className="article-card-summary">{article.summary}</p>
                    {article.pendingItems && article.pendingItems.length > 0 && (
                      <div className="pending-badge">
                        📋 未確認事項 {article.pendingItems.length}件
                      </div>
                    )}
                    <div className="tag-list">
                      {article.tags.map((t) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
