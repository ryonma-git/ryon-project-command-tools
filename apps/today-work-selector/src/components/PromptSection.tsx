// ============================================================
// PromptSection.tsx — プロンプト生成・表示・コピーコンポーネント
// ============================================================

import { useState, useCallback } from 'react';
import type { PromptSet } from '../types';

interface Props {
  prompts: PromptSet;
}

type TabKey = keyof PromptSet;

const TABS: { key: TabKey; label: string }[] = [
  { key: 'chatgpt', label: 'ChatGPT' },
  { key: 'codex', label: 'Codex' },
  { key: 'claudeCode', label: 'Claude Code' },
  { key: 'manus', label: 'Manus' },
  { key: 'reflection', label: 'ふりかえり' },
];

export function PromptSection({ prompts }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('chatgpt');
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompts[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // フォールバック: テキストエリアを使ったコピー
      const el = document.createElement('textarea');
      el.value = prompts[activeTab];
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [prompts, activeTab]);

  return (
    <div className="section-card">
      <div className="section-title">
        <span className="step-badge">3</span>
        生成されたプロンプト
      </div>

      <div className="prompt-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => {
              setActiveTab(tab.key);
              setCopied(false);
            }}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="prompt-box">
        <button
          className={`copy-btn${copied ? ' copied' : ''}`}
          onClick={handleCopy}
          type="button"
        >
          {copied ? '✓ コピー済み' : 'コピー'}
        </button>
        <pre className="prompt-text">{prompts[activeTab]}</pre>
      </div>

      <p
        style={{
          marginTop: '10px',
          fontSize: '0.78rem',
          color: 'var(--color-text-muted)',
        }}
      >
        「コピー」ボタンを押してChatGPT / Codex / Claude Code / Manusに貼り付けてください。
      </p>
    </div>
  );
}
