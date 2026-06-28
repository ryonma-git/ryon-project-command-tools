# Today Work Selector - Handoff Document

このドキュメントは、Manusによって作成された `Today Work Selector` アプリケーションの引き継ぎ資料です。
Manusの利用期限終了後、他のAIエージェント（Codex / Claude Code / ChatGPT）で開発を継続するための情報をまとめています。

## 現在実装済みの機能
1. **状態入力UI**: 時間、気力、場所、使えるエージェント、今日の気分を選択するトグルボタン。
2. **プロジェクトデータ**: Project Command Centerで整理済みの27個のプロジェクトを内蔵（`src/data/projects.ts`）。
3. **推薦ロジック**: 状態入力に基づき、優先度やタグを考慮して上位3つのプロジェクトを推薦するスコアリングエンジン（`src/logic/recommend.ts`）。
4. **プロンプト生成**: 選択されたプロジェクトと状態を組み合わせて、ChatGPT、Codex、Claude Code、Manus向けの具体的なプロンプト、およびふりかえり用プロンプトを自動生成（`src/logic/generatePrompts.ts`）。
5. **コピー機能**: 生成されたプロンプトをクリップボードにコピーするボタン（フォールバック実装済み）。
6. **データ保存**: 選択状態と生成されたプロンプトをlocalStorageに保存・復元する機能（`src/logic/storage.ts`）。
7. **レスポンシブデザイン**: カスタムCSS（`src/index.css`）によるスマートフォン対応のレイアウト。
8. **プロジェクト一覧表示**: すべてのプロジェクトをカテゴリ別にフィルタリングして確認できるアコーディオンUI。

## 未実装の機能（今後の課題）
1. プロジェクトデータの外部JSON/Notionからの動的インポート
2. カスタムプロンプトテンプレートの編集・保存機能
3. ふりかえり結果のMarkdownダウンロード機能
4. PWA（Progressive Web App）としてのインストール対応

## 次にやるべきこと
1. **デプロイの実行**: GitHub PagesまたはNetlifyへのデプロイ設定を行い、オンラインで利用可能にする。
2. **プロジェクトデータの更新**: `src/data/projects.ts` の内容を最新のProject Command Centerと同期する。
3. **`school-safety-checker` の設計・実装**: `apps/school-safety-checker` の実装を進める（設計書は `docs/school-safety-checker-design.md` に記載）。

## Manus終了後にCodex / Claude Code / ChatGPTで引き継ぐ方法

### Codexで引き継ぐ場合
Codexはコードの変更やコマンド実行に優れています。機能追加やバグ修正を行う際は、以下のプロンプトを使用してください。

```markdown
# Today Work Selector 開発引き継ぎ

## 概要
このプロジェクトはReact + Vite + TypeScriptで構築された静的Webアプリです。
ディレクトリ: `apps/today-work-selector/`

## 依頼内容
（ここに追加したい機能や修正したいバグを記載してください）

## 制約事項
- 外部APIや秘密情報は使用しない
- 既存のカスタムCSS（`src/index.css`）のスタイルガイドラインに従う
- 変更後は必ず `pnpm build` でTypeScriptエラーがないか確認する
```

### Claude Codeで引き継ぐ場合
Claude Codeは構造の理解や大規模なリファクタリング、ドキュメントの更新に適しています。

```markdown
# Today Work Selector アーキテクチャ引き継ぎ

## 概要
React + Viteの静的Webアプリです。データは `src/data/projects.ts` にハードコードされており、`src/logic/recommend.ts` で推薦ロジックが動いています。

## 依頼内容
（例：プロジェクトデータを外部JSONから読み込むようにリファクタリングしたい、など）

## 参照ファイル
- `src/types.ts`
- `src/logic/recommend.ts`
- `src/logic/generatePrompts.ts`
```

### ChatGPTで引き継ぐ場合
ChatGPTはアイデア出しやUI/UXの改善案、プロンプト生成ロジックの調整に適しています。

```markdown
# Today Work Selector プロンプト生成ロジックの改善

## 概要
現在のプロンプト生成ロジックは `src/logic/generatePrompts.ts` にあります。

## 依頼内容
現在のプロンプト出力を以下のように改善したいです。具体的なコードの修正案を提示してください。
（例：ふりかえりプロンプトにもっと具体的な質問を追加したい）
```
