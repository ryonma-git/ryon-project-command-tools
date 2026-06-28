// ============================================================
// App.tsx — Today Work Selector メインコンポーネント
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import type { TodayState, PromptSet } from './types';
import { recommendProjects } from './logic/recommend';
import { generatePrompts } from './logic/generatePrompts';
import { loadState, saveState, clearState, DEFAULT_TODAY_STATE } from './logic/storage';
import { StateSelector } from './components/StateSelector';
import { RecommendSection } from './components/RecommendSection';
import { PromptSection } from './components/PromptSection';
import { ProjectListSection } from './components/ProjectListSection';

function App() {
  const [todayState, setTodayState] = useState<TodayState>(DEFAULT_TODAY_STATE);
  const [prompts, setPrompts] = useState<PromptSet | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState('');

  // 起動時に localStorage から復元
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setTodayState(saved.todayState);
      setPrompts(saved.prompts);
      setSavedAt(saved.savedAt);
    }
  }, []);

  const recommended = recommendProjects(todayState);

  const handleGenerate = useCallback(() => {
    const generated = generatePrompts(todayState, recommended);
    setPrompts(generated);

    const now = new Date().toLocaleString('ja-JP');
    setSavedAt(now);
    saveState({
      todayState,
      selectedProjects: recommended.map((p) => p.id),
      prompts: generated,
      savedAt: now,
    });
    setSaveMsg('保存しました');
    setTimeout(() => setSaveMsg(''), 3000);
  }, [todayState, recommended]);

  const handleSave = useCallback(() => {
    const now = new Date().toLocaleString('ja-JP');
    setSavedAt(now);
    saveState({
      todayState,
      selectedProjects: recommended.map((p) => p.id),
      prompts,
      savedAt: now,
    });
    setSaveMsg('保存しました');
    setTimeout(() => setSaveMsg(''), 3000);
  }, [todayState, recommended, prompts]);

  const handleClear = useCallback(() => {
    if (window.confirm('保存データをリセットしますか？')) {
      clearState();
      setTodayState(DEFAULT_TODAY_STATE);
      setPrompts(null);
      setSavedAt(null);
      setSaveMsg('リセットしました');
      setTimeout(() => setSaveMsg(''), 3000);
    }
  }, []);

  return (
    <div className="app-container">
      {/* ヘッダー */}
      <header className="app-header">
        <h1>今日の仕事教えてアプリ</h1>
        <p>Today Work Selector — 今日やるべき作業を選んで、AIエージェントへのプロンプトを生成します</p>
      </header>

      {/* Step 1: 状態入力 */}
      <StateSelector state={todayState} onChange={setTodayState} />

      {/* Step 2: おすすめ表示 */}
      <RecommendSection projects={recommended} />

      {/* アクションボタン */}
      <div className="action-row">
        <button className="btn btn-primary" onClick={handleGenerate} type="button">
          プロンプトを生成する
        </button>
        <button className="btn btn-secondary" onClick={handleSave} type="button">
          状態を保存
        </button>
        <button className="btn btn-danger" onClick={handleClear} type="button">
          リセット
        </button>
        {saveMsg && (
          <div className={`save-status${saveMsg.includes('保存') ? ' saved' : ''}`}>
            {saveMsg.includes('保存') ? '✓' : '↺'} {saveMsg}
          </div>
        )}
        {savedAt && !saveMsg && (
          <div className="save-status">
            最終保存: {savedAt}
          </div>
        )}
      </div>

      {/* Step 3: プロンプト表示 */}
      {prompts ? (
        <div style={{ marginTop: '20px' }}>
          <PromptSection prompts={prompts} />
        </div>
      ) : (
        <div className="section-card" style={{ marginTop: '20px' }}>
          <div className="section-title">
            <span className="step-badge">3</span>
            生成されたプロンプト
          </div>
          <div className="empty-state">
            <p>「プロンプトを生成する」ボタンを押すと、各AIエージェント向けのプロンプトが生成されます。</p>
          </div>
        </div>
      )}

      {/* Step 4: 全プロジェクト一覧 */}
      <div style={{ marginTop: '8px' }}>
        <ProjectListSection />
      </div>

      {/* フッター */}
      <footer
        style={{
          textAlign: 'center',
          padding: '24px 0 16px',
          fontSize: '0.78rem',
          color: 'var(--color-text-muted)',
        }}
      >
        ryon-project-command-tools / Today Work Selector &nbsp;|&nbsp;
        データはすべてブラウザのlocalStorageに保存されます
      </footer>
    </div>
  );
}

export default App;
