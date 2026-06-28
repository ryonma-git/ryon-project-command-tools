# Manus 終了後の引き継ぎ資料（HANDOFF.md）

このドキュメントは、Manusの利用期限終了後に、他のAIエージェント（Codex / Claude Code / ChatGPT）で `ryon-project-command-tools` の開発を継続するための引き継ぎ資料です。

## 1. 全体アーキテクチャ

このリポジトリは、複数の独立した静的Webアプリ（React + Vite + TypeScript）を管理するモノレポ構成です。
現在、以下の3つのアプリが含まれています。

- `apps/today-work-selector/`: 今日の作業推薦・プロンプト生成アプリ
- `apps/school-safety-checker/`: 学校安全初動チェックアプリ
- `apps/maruflow-mock/`: MaruFlow MVP 画面モック

### 技術スタック
- フロントエンド: React 18
- 言語: TypeScript
- スタイリング: プレーンCSS（各アプリの `index.css` に集約）
- ビルドツール: Vite
- パッケージマネージャー: pnpm

### 制約事項
- **APIキー・秘密情報の排除**: すべてのアプリは外部API（ChatGPT等）に依存せず、フロントエンドのみで完結しています。
- **manus.space 非依存**: 特定のホスティング環境に依存しない静的ファイルとしてビルドされます。

## 2. アプリ別引き継ぎ事項

### 2.1 Today Work Selector
- **状態**: 実装完了
- **主要ファイル**:
  - `src/data/projects.ts`: 27のプロジェクトデータが定義されています。プロジェクトの追加・変更はここで行います。
  - `src/logic/recommend.ts`: プロジェクトの推薦ロジック。時間・気力・場所などの条件に基づきスコアリングします。
  - `src/logic/generatePrompts.ts`: 各エージェント向けのプロンプト生成ロジック。
- **今後の拡張案**:
  - 新しいプロジェクトの追加
  - プロンプトテンプレートの微調整

### 2.2 School Safety Checker
- **状態**: 実装完了
- **主要ファイル**:
  - `src/App.tsx`: メインUI。状態管理（事案、チェックリスト、エリア、役割）を統合。
  - `src/logic/generateOutput.ts`: ログ、振り返り、ChatGPT用プロンプトの生成ロジック。
- **今後の拡張案**:
  - チェックリストのカスタマイズ機能（学校ごとのルール対応）
  - 捜索エリアの追加・編集機能

### 2.3 MaruFlow MVP Mock
- **状態**: モック実装完了（実データ・AI連携なし）
- **主要ファイル**:
  - `src/App.tsx`: 5つの画面（Home, Upload, Setting, Grading, Output）の切り替え。
  - `src/components/`: 各画面のコンポーネント。
- **今後の拡張案**:
  - 実データ連携の検討
  - AI採点API（OpenAI等）との連携プロトタイプ作成（別アプリとして切り出すことを推奨）

## 3. 各エージェントでの継続開発方法

### Codex を使う場合
Codexはローカルファイルシステムに直接アクセスできるため、コードの修正・ビルド確認に最適です。
1. `ryon-project-command-tools` リポジトリをVSCodeで開く
2. Codexのチャットで以下のように依頼する：
   > `apps/today-work-selector/src/data/projects.ts` に新しいプロジェクトを追加してください。
3. Codexがファイルを修正したら、ターミナルで `cd apps/today-work-selector && pnpm build` を実行してエラーがないか確認する。

### Claude Code を使う場合
Claude Codeもローカルで動作するため、複雑なロジックの修正や設計の相談に向いています。
1. ターミナルで `ryon-project-command-tools` ディレクトリに移動
2. `claude` コマンドを起動し、以下のように依頼する：
   > `apps/school-safety-checker` のチェックリスト項目をカスタマイズできるようにしたい。設計案と修正すべきファイルを教えて。

### ChatGPT を使う場合
ChatGPTはコードの直接編集ができないため、設計相談やプロンプト生成ロジックの改善に使用します。
1. `Today Work Selector` で生成された「ChatGPT用プロンプト」を貼り付ける
2. ChatGPTからの提案を受け取り、手動（またはCodex）でコードに反映する

## 4. デプロイに関する注意
GitHub Pages にデプロイする場合、Vite の `base` オプションを適切に設定する必要があります。
`vite.config.ts` で `base: '/ryon-project-command-tools/'` のようにリポジトリ名を指定してください（ルートドメインにデプロイする場合は不要です）。
