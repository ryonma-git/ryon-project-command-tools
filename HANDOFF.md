# ryon-project-command-tools — Handoff Document

このドキュメントは、Manusによって作成・管理されている `ryon-project-command-tools` リポジトリ全体の引き継ぎ資料です。
Manusの利用期限終了後、他のAIエージェント（Codex / Claude Code / ChatGPT）で開発を継続するための情報をまとめています。

---

## リポジトリ構成

```
ryon-project-command-tools/
├── apps/
│   ├── today-work-selector/   # App 1: 今日の作業選択 & プロンプト生成
│   ├── school-safety-checker/ # App 2: 学校安全点検（設計中）
│   └── maruflow-mock/         # App 3: 採点支援アプリ MaruFlow MVP モック
├── docs/
│   ├── school-safety-checker-design.md
│   └── maruflow-mvp.md        # MaruFlow MVP 仕様書
├── README.md
└── HANDOFF.md                 # このファイル
```

---

## App 1: Today Work Selector (`apps/today-work-selector/`)

### 実装済みの機能

1. **状態入力UI**: 時間、気力、場所、使えるエージェント、今日の気分を選択するトグルボタン。
2. **プロジェクトデータ**: Project Command Centerで整理済みの27個のプロジェクトを内蔵（`src/data/projects.ts`）。
3. **推薦ロジック**: 状態入力に基づき、優先度やタグを考慮して上位3つのプロジェクトを推薦するスコアリングエンジン（`src/logic/recommend.ts`）。
4. **プロンプト生成**: 選択されたプロジェクトと状態を組み合わせて、ChatGPT/Codex/Claude Code/Manus向けプロンプトを自動生成（`src/logic/generatePrompts.ts`）。
5. **コピー機能**: 生成されたプロンプトをクリップボードにコピーするボタン（フォールバック実装済み）。
6. **データ保存**: 選択状態と生成されたプロンプトをlocalStorageに保存・復元する機能（`src/logic/storage.ts`）。

### 未実装の機能（今後の課題）

- プロジェクトデータの外部JSON/Notionからの動的インポート
- カスタムプロンプトテンプレートの編集・保存機能
- ふりかえり結果のMarkdownダウンロード機能

---

## App 2: school-safety-checker (`apps/school-safety-checker/`)

現在は設計段階です。詳細は `docs/school-safety-checker-design.md` を参照してください。

---

## App 3: MaruFlow MVP Mock (`apps/maruflow-mock/`)

紙テスト採点支援アプリ **MaruFlow** の MVP を、実装前に画面モックとして具体化したものです。

### 技術スタック

- React 19 + Vite 8 + TypeScript 6
- カスタムCSS（`src/index.css`）のみ。外部UIライブラリ不使用。
- 外部API・秘密情報不要。完全な静的Webアプリ。

### 画面構成

| 画面 | コンポーネント | 説明 |
|------|--------------|------|
| ホーム | `screens/HomeScreen.tsx` | ワークフロー全体像とMVP範囲の説明 |
| PDF登録 | `screens/PdfRegisterScreen.tsx` | 空白問題PDFのアップロードとテスト情報入力 |
| 採点欄設定 | `screens/ScoringSetupScreen.tsx` | PDF上の問題ゾーン（座標・配点）の定義 |
| 採点 | `screens/ScoringScreen.tsx` | 答案への丸・バツ・点数・コメントの付与 |
| 出力確認 | `screens/OutputScreen.tsx` | 採点結果サマリーと採点済みPDFのダウンロード |

### 主要ファイル

| ファイル | 役割 |
|----------|------|
| `src/types.ts` | 型定義（Screen, Question, ScoreEntry, AnswerSheet 等） |
| `src/data/dummyData.ts` | 架空テスト・架空答案のダミーデータ |
| `src/index.css` | 全画面共通のデザインシステム（CSS変数・コンポーネントクラス） |

### 実行方法

```bash
cd apps/maruflow-mock
pnpm install   # 初回のみ
pnpm dev       # 開発サーバー起動 → http://localhost:5173
pnpm build     # 本番ビルド → dist/
pnpm preview   # ビルド結果のプレビュー
```

### MVP 対象・非対象

| 区分 | 機能 |
|------|------|
| **MVP（実装済み）** | 手動採点（丸・バツ・三角・点数・コメント）、採点欄定義、結果サマリー、PDF出力（モック） |
| **次フェーズ** | AI採点、OCR、クラス管理、成績分析ダッシュボード |

### 注意事項

- 実際のPDF処理（読み込み・生成）は未実装です。架空のダミーデータで画面の見た目を構築しています。
- 個人情報・実児童データは一切含まれていません。

---

## 全アプリ共通: Codex / Claude Code / ChatGPT で引き継ぐ方法

### Codex で引き継ぐ場合

```markdown
# ryon-project-command-tools 開発引き継ぎ

## 概要
このリポジトリは React + Vite + TypeScript で構築された静的Webアプリ群です。

## 対象アプリ
apps/maruflow-mock/ — 採点支援アプリ MaruFlow の MVP モック

## 依頼内容
（ここに追加したい機能や修正したいバグを記載してください）

## 制約事項
- 外部APIや秘密情報は使用しない
- 個人情報・実児童データを扱わない
- 変更後は必ず `pnpm build` でTypeScriptエラーがないか確認する
```

### Claude Code で引き継ぐ場合

```markdown
# MaruFlow MVP Mock アーキテクチャ引き継ぎ

## 概要
React + Vite の静的Webアプリです。
- 型定義: `src/types.ts`
- ダミーデータ: `src/data/dummyData.ts`
- 画面コンポーネント: `src/screens/`
- グローバルCSS: `src/index.css`

## 依頼内容
（例：採点画面にキーボードショートカット（○=1キー、×=2キー）を追加したい）
```

### ChatGPT で引き継ぐ場合

```markdown
# MaruFlow MVP Mock UI改善

## 概要
紙テスト採点支援アプリのUIモックです。
採点画面（`src/screens/ScoringScreen.tsx`）のUIを改善したいです。

## 依頼内容
（例：採点画面のモバイル対応を改善し、タブレットでの操作性を向上させたい）
```

---

## デプロイ方法（各アプリ共通）

```bash
# ビルド
cd apps/<app-name>
pnpm build

# dist/ ディレクトリを GitHub Pages / Netlify にデプロイ
# Netlify の場合:
#   Base directory: apps/<app-name>
#   Build command:  pnpm build
#   Publish directory: dist
```
