import { useState, useEffect, useRef, useCallback } from 'react';
import type { AppState, TabId, IncidentType, AreaStatus } from './types';
import { TAB_LABELS, INCIDENT_TYPE_LABELS, AREA_STATUS_LABELS } from './types';
import { INITIAL_INCIDENT, INITIAL_CHECK_ITEMS, INITIAL_SEARCH_AREAS, INITIAL_ROLES } from './data/initialData';
import { generateLog, generateReflection, generateChatGPTPrompt } from './logic/generateOutput';

const STORAGE_KEY = 'school-safety-checker-state';

function getNow(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function getTimeLabel(): string {
  return new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function buildInitialState(): AppState {
  return {
    incident: { ...INITIAL_INCIDENT },
    checkItems: INITIAL_CHECK_ITEMS.map(c => ({ ...c })),
    searchAreas: INITIAL_SEARCH_AREAS.map(a => ({ ...a })),
    roles: INITIAL_ROLES.map(r => ({ ...r })),
    localStorageEnabled: false,
    activeTab: 'incident',
  };
}

export default function App() {
  const [state, setState] = useState<AppState>(() => buildInitialState());
  const [elapsed, setElapsed] = useState<string>('--:--');
  const [outputTab, setOutputTab] = useState<'log' | 'reflection' | 'chatgpt'>('log');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (state.incident.startedAt) {
      timerRef.current = setInterval(() => {
        const ms = Date.now() - new Date(state.incident.startedAt!).getTime();
        setElapsed(formatElapsed(ms));
      }, 1000);
    } else {
      setElapsed('--:--');
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.incident.startedAt]);

  useEffect(() => {
    if (state.localStorageEnabled) {
      try {
        const toSave = { ...state, roles: state.roles.map(r => ({ ...r, assignee: '' })) };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch { /* ignore */ }
    }
  }, [state]);

  const setTab = (tab: TabId) => setState(s => ({ ...s, activeTab: tab }));

  const updateIncident = useCallback(<K extends keyof AppState['incident']>(
    key: K, value: AppState['incident'][K]
  ) => {
    setState(s => ({ ...s, incident: { ...s.incident, [key]: value } }));
  }, []);

  const startIncident = () => {
    setState(s => ({ ...s, incident: { ...s.incident, startedAt: new Date() }, activeTab: 'checklist' }));
  };

  const toggleCheck = (id: string) => {
    setState(s => ({
      ...s,
      checkItems: s.checkItems.map(c =>
        c.id === id ? { ...c, checked: !c.checked, checkedAt: !c.checked ? getTimeLabel() : null } : c
      ),
    }));
  };

  const cycleAreaStatus = (id: string) => {
    const cycle: AreaStatus[] = ['unchecked', 'checking', 'checked', 'requires_recheck'];
    setState(s => ({
      ...s,
      searchAreas: s.searchAreas.map(a => {
        if (a.id !== id) return a;
        const next = cycle[(cycle.indexOf(a.status) + 1) % cycle.length];
        return { ...a, status: next, updatedAt: getTimeLabel() };
      }),
    }));
  };

  const updateAreaMemo = (id: string, memo: string) => {
    setState(s => ({ ...s, searchAreas: s.searchAreas.map(a => a.id === id ? { ...a, memo } : a) }));
  };

  const updateRoleAssignee = (id: string, assignee: string) => {
    setState(s => ({ ...s, roles: s.roles.map(r => r.id === id ? { ...r, assignee } : r) }));
  };

  const toggleStorage = () => {
    setState(s => {
      const next = !s.localStorageEnabled;
      if (!next) { try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ } }
      return { ...s, localStorageEnabled: next };
    });
  };

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        setState({ ...parsed, roles: parsed.roles.map(r => ({ ...r, assignee: '' })) });
      }
    } catch { /* ignore */ }
  };

  const resetAll = () => {
    if (window.confirm('すべてのデータをリセットします。よろしいですか？')) {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      setState(buildInitialState());
    }
  };

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

  const checkedCount = state.checkItems.filter(c => c.checked).length;
  const totalCount = state.checkItems.length;
  const progressPct = Math.round((checkedCount / totalCount) * 100);

  const outputText = outputTab === 'log'
    ? generateLog(state)
    : outputTab === 'reflection'
    ? generateReflection(state)
    : generateChatGPTPrompt(state);

  return (
    <div>
      <header className="app-header">
        <h1>🏫 学校安全初動チェックアプリ</h1>
        <div className="subtitle">School Safety Checker — 初動確認の補助ツール（正式な危機管理マニュアルではありません）</div>
      </header>

      <div className="disclaimer-banner">
        ⚠️ このアプリは<strong>初動確認の補助ツール</strong>です。判断を自動化するものではありません。
        通報・連絡基準は<strong>学校・自治体の正式ルール</strong>に従ってください。
        <strong>個人情報（氏名・写真・住所等）は入力しないでください。</strong>
      </div>

      <nav className="tab-nav">
        {(Object.keys(TAB_LABELS) as TabId[]).map(tab => (
          <button
            key={tab}
            className={`tab-btn${state.activeTab === tab ? ' active' : ''}`}
            onClick={() => setTab(tab)}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </nav>

      <main className="main-content">

        {state.activeTab === 'incident' && (
          <div>
            <div className="card">
              <div className="card-title">① 事案開始</div>
              <div className="notice">
                <strong>⚠️ 個人情報を入力しないでください。</strong><br />
                児童名・写真・住所・個人を特定できる情報は入力欄に入れないでください。
                このアプリは個人情報を保存しない設計です。
              </div>

              <div className="form-group">
                <label className="form-label">事案種別</label>
                <select className="form-select" value={state.incident.type}
                  onChange={e => updateIncident('type', e.target.value as IncidentType)}>
                  <option value="">-- 選択してください --</option>
                  {(Object.keys(INCIDENT_TYPE_LABELS) as IncidentType[]).map(t => (
                    <option key={t} value={t}>{INCIDENT_TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">発生時刻</label>
                <input type="time" className="form-input" value={state.incident.occurredAt}
                  onChange={e => updateIncident('occurredAt', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">気づいた時刻</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="time" className="form-input" value={state.incident.noticedAt}
                    onChange={e => updateIncident('noticedAt', e.target.value)} />
                  <button className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}
                    onClick={() => updateIncident('noticedAt', getNow())}>今</button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">最終確認場所（個人名・住所は書かないこと）</label>
                <input type="text" className="form-input" placeholder="例：3年2組教室前廊下"
                  value={state.incident.lastSeenLocation}
                  onChange={e => updateIncident('lastSeenLocation', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">状況メモ（個人を特定できる情報は書かないこと）</label>
                <textarea className="form-textarea" placeholder="例：給食後に見当たらなくなった。体操服着用。"
                  value={state.incident.memo}
                  onChange={e => updateIncident('memo', e.target.value)} />
              </div>

              <div style={{ textAlign: 'center', marginTop: 8 }}>
                {state.incident.startedAt ? (
                  <div style={{ color: '#057a55', fontWeight: 700, fontSize: 14 }}>
                    ✅ 対応開始済み（{new Date(state.incident.startedAt).toLocaleTimeString('ja-JP')}）
                  </div>
                ) : (
                  <button className="btn btn-primary" onClick={startIncident}>
                    対応開始・タイマースタート
                  </button>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-title">データ保存設定</div>
              <div className="storage-toggle">
                <label className="toggle-switch">
                  <input type="checkbox" checked={state.localStorageEnabled} onChange={toggleStorage} />
                  <span className="toggle-slider" />
                </label>
                <div>
                  <div className="toggle-label">ブラウザ内保存（localStorage）</div>
                  <div className="toggle-sublabel">
                    {state.localStorageEnabled
                      ? '✅ ON — このデバイスのブラウザに保存されます（役割担当者名は保存しません）'
                      : '⬜ OFF（デフォルト）— ページを閉じるとデータは消えます'}
                  </div>
                </div>
              </div>
              {state.localStorageEnabled && (
                <button className="btn btn-outline btn-sm" onClick={loadFromStorage}>
                  保存データを読み込む
                </button>
              )}
              <div className="reset-area" style={{ marginTop: 12 }}>
                <button className="btn btn-danger btn-sm" onClick={resetAll}>全データをリセット</button>
              </div>
            </div>
          </div>
        )}

        {state.activeTab === 'checklist' && (
          <div className="card">
            <div className="card-title">② 初動チェックリスト</div>
            <div className="progress-bar-wrap">
              <div className="progress-bar" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="progress-label">{checkedCount} / {totalCount} 完了（{progressPct}%）</div>
            <ul className="checklist">
              {state.checkItems.map(item => (
                <li key={item.id} className={`checklist-item${item.priority === 'critical' ? ' priority-critical' : item.priority === 'high' ? ' priority-high' : ''}`} onClick={() => toggleCheck(item.id)}>
                  <div className={`checklist-checkbox${item.checked ? ' checked' : ''}`} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      {item.priority === 'critical' && <span className="priority-badge badge-critical">緊急</span>}
                      {item.priority === 'high' && <span className="priority-badge badge-high-p">高</span>}
                      <div className={`checklist-label${item.checked ? ' checked' : ''}`}>{item.label}</div>
                      {item.requiresRecheck && !item.checked && <span className="recheck-badge">要再確認</span>}
                    </div>
                    {item.checkedAt && <div className="checklist-time">✓ {item.checkedAt}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {state.activeTab === 'areas' && (
          <div className="card">
            <div className="card-title">③ 捜索エリア管理</div>
            <div className="notice">エリアをタップするたびに「未確認 → 確認中 → 確認済み」と切り替わります。</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {(['unchecked', 'checking', 'checked', 'requires_recheck'] as AreaStatus[]).map(s => {
                const count = state.searchAreas.filter(a => a.status === s).length;
                return (
                  <span key={s} className={`area-status-badge badge-${s}`}>
                    {AREA_STATUS_LABELS[s]}：{count}件
                  </span>
                );
              })}
            </div>
            <div className="area-grid">
              {state.searchAreas.map(area => (
                <div key={area.id} className={`area-card status-${area.status}`}>
                  <div className="area-name" onClick={() => cycleAreaStatus(area.id)}>{area.name}</div>
                  <div className={`area-status-badge badge-${area.status}`} onClick={() => cycleAreaStatus(area.id)}>
                    {AREA_STATUS_LABELS[area.status]}
                  </div>
                  {area.updatedAt && (
                    <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{area.updatedAt}</div>
                  )}
                  <textarea className="area-memo-input" rows={2} placeholder="メモ" value={area.memo}
                    onClick={e => e.stopPropagation()}
                    onChange={e => updateAreaMemo(area.id, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {state.activeTab === 'elapsed' && (
          <div>
            <div className="card">
              <div className="card-title">④ 経過時間</div>
              <div className="elapsed-display">
                <div className="elapsed-time">{elapsed}</div>
                <div className="elapsed-label">
                  {state.incident.startedAt
                    ? `対応開始：${new Date(state.incident.startedAt).toLocaleTimeString('ja-JP')} から`
                    : '「① 事案開始」でタイマーをスタートしてください'}
                </div>
              </div>
              <div className="elapsed-note">
                ⚠️ 通報・連絡基準は学校・自治体の正式ルールに従ってください。<br />
                このアプリは自動的な判断・通知を行いません。
              </div>
            </div>
            <div className="card">
              <div className="card-title">時刻メモ</div>
              <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '8px 4px', color: '#6b7280', width: '40%' }}>発生時刻</td>
                    <td style={{ padding: '8px 4px', fontWeight: 600 }}>{state.incident.occurredAt || '未記録'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '8px 4px', color: '#6b7280' }}>気づいた時刻</td>
                    <td style={{ padding: '8px 4px', fontWeight: 600 }}>{state.incident.noticedAt || '未記録'}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 4px', color: '#6b7280' }}>対応開始時刻</td>
                    <td style={{ padding: '8px 4px', fontWeight: 600 }}>
                      {state.incident.startedAt
                        ? new Date(state.incident.startedAt).toLocaleTimeString('ja-JP')
                        : '未開始'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {state.activeTab === 'roles' && (
          <div className="card">
            <div className="card-title">⑤ 役割カード</div>
            <div className="notice">
              担当者名の入力欄は<strong>保存されません</strong>。ページを閉じると消えます。
              個人情報の保護のため、フルネームの入力は避けてください（例：「田中先生」「3年担任」など）。
            </div>
            <div className="role-grid">
              {state.roles.map(role => (
                <div key={role.id} className="role-card">
                  <div className="role-title">{role.title}</div>
                  <div className="role-desc">{role.description}</div>
                  <input type="text" className="role-assignee-input" placeholder="担当者（例：教頭先生）"
                    value={role.assignee} onChange={e => updateRoleAssignee(role.id, e.target.value)} />
                  <div className="role-no-save-note">※ この欄は保存されません</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.activeTab === 'output' && (
          <div className="card">
            <div className="card-title">⑥ 出力</div>
            <div className="notice">
              <strong>⚠️ 出力内容に個人情報が含まれていないか必ず確認してください。</strong><br />
              氏名・写真・住所・個人を特定できる情報は含めないでください。
            </div>
            <div className="output-tabs">
              {(['log', 'reflection', 'chatgpt'] as const).map(t => (
                <button key={t}
                  className={`output-tab-btn${outputTab === t ? ' active' : ''}`}
                  onClick={() => setOutputTab(t)}>
                  {t === 'log' ? '対応ログ (Markdown)' : t === 'reflection' ? '振り返りメモ' : 'ChatGPTプロンプト'}
                </button>
              ))}
            </div>
            <pre className="output-pre">{outputText}</pre>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <button className={`copy-btn${copiedKey === outputTab ? ' copied' : ''}`}
                onClick={() => handleCopy(outputText, outputTab)}>
                {copiedKey === outputTab ? '✓ コピーしました' : 'クリップボードにコピー'}
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
                🖨️ 印刷・ PDF保存
              </button>
            </div>
          </div>
        )}

      </main>

      <footer className="app-footer">
        学校安全初動チェックアプリ — 初動確認の補助ツール（正式な危機管理マニュアルではありません）<br />
        個人情報は保存しない設計です。通報・連絡基準は学校・自治体の正式ルールに従ってください。
      </footer>
    </div>
  );
}
