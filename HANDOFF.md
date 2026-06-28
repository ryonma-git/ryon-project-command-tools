# Manus 終了後の引き継ぎ資料（HANDOFF.md）

このドキュメントは、Manusの利用期限終了後に、他のAIエージェント（Codex / Claude Code / Cursor / ChatGPT）で `ryon-project-command-tools` の開発を継続するための引き継ぎ資料です。

## 1. 全体アーキテクチャ

このリポジトリは、5つの独立した静的Webアプリ（React + Vite + TypeScript）を管理するモノレポ構成です。ルートの `index.html` が各アプリへのナビゲーションポータルとして機能します。

- `apps/today-work-selector/`: 今日の作業推薦・プロンプト生成アプリ
- `apps/school-safety-checker/`: 学校安全初動チェックアプリ
- `apps/maruflow-mock/`: MaruFlow MVP 画面モック
- `apps/school-ops-portal/`: School Ops Portal
- `apps/manazashi-archive-demo/`: Manazashi Archive Demo

### 技術スタック
- フロントエンド: React 18
- 言語: TypeScript
- スタイリング: プレーンCSS（各アプリの `index.css` に集約）
- ビルドツール: Vite
- パッケージマネージャー: pnpm

### 制約事項
- **APIキー・秘密情報の排除**: すべてのアプリは外部API（ChatGPT等）に依存せず、フロントエンドのみで完結しています。
- **データ永続化**: バックエンドを持たず、ブラウザの `localStorage` のみを使用しています。

## 2. アプリ別引き継ぎ事項

### 2.1 Today Work Selector
- **状態**: 実装完了
- **主要ファイル**:
  - `src/data/projects.ts`: 27のプロジェクトデータが定義されています。
  - `src/logic/recommend.ts`: 推薦ロジック。
- **今後の拡張案**:
  - 新規プロジェクト追加
  - プロンプトテンプレートの改善

### 2.2 School Safety Checker
- **状態**: 実装完了
- **主要ファイル**:
  - `src/App.tsx`: メインUI。状態管理（事案、チェックリスト、エリア、役割）を統合。
- **今後の拡張案**:
  - チェックリストのカスタマイズ機能（学校ごとのルール対応）
  - PWAとしてのオフライン機能の強化

### 2.3 MaruFlow MVP Mock
- **状態**: 7画面モック実装完了
- **主要ファイル**:
  - `src/App.tsx`: 7画面のルーティング。
- **今後の拡張案**:
  - 実データ・AI採点APIとの連携（別アプリとして切り出すことを推奨）

### 2.4 School Ops Portal
- **状態**: 実装完了
- **主要ファイル**:
  - `src/data/articles.ts`: サンプル記事データ。
- **今後の拡張案**:
  - Markdownエディタによる記事作成・編集機能の追加

### 2.5 Manazashi Archive Demo
- **状態**: デモ実装完了
- **主要ファイル**:
  - `src/data/children.ts`: 架空の児童・記録データ。
- **今後の拡張案**:
  - 実際の記録アプリとしての入力UI実装

## 3. 各エージェントでの継続開発方法

### Cursor / Codex を使う場合
ローカルファイルシステムに直接アクセスできるため、コードの修正・ビルド確認に最適です。
1. `ryon-project-command-tools` リポジトリをCursorで開く
2. `apps/today-work-selector/src/data/projects.ts` などの修正を依頼する
3. ターミナルで `cd apps/today-work-selector && pnpm build` を実行してエラーがないか確認する

### Claude Code を使う場合
複雑なロジックの修正や設計の相談に向いています。
1. ターミナルで `ryon-project-command-tools` ディレクトリに移動
2. `claude` コマンドを起動し、依頼を行う

## 4. デプロイに関する注意
GitHub Pages へのデプロイは `.github/workflows/deploy-pages.yml` によって自動化されています。
`main` ブランチにプッシュすると、5つのアプリすべてがビルドされ、ルートの `index.html` とともにデプロイされます。
