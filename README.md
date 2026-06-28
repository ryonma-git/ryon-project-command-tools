# ryon-project-command-tools

このリポジトリは、松尾亮佑のプロジェクト実行を支援する静的Webアプリ群である。

Notion Project Command Centerはプロジェクト管理の司令塔、project-management-seedはNotion同期ツール、personal-memoryは思想と記憶の保管庫、ryon-project-command-toolsは日々の作業開始・安全確認・教育プロダクト構想のUIプロトタイプ群として使う。

## 収録アプリ

現在、以下の5つのアプリが収録されています。

### 1. Today Work Selector (`apps/today-work-selector/`)
今日やるべき作業を選んで、AIエージェントへのプロンプトを生成するアプリ。
- 27のプロジェクトデータから、時間・気力・場所・使えるツールに合わせて上位推薦
- お気に入り機能、モード選択（校務ops、personal-memory等）、localStorageによる状態保存
- 各エージェント向けの専用プロンプト生成

### 2. School Safety Checker (`apps/school-safety-checker/`)
児童所在不明・校内安全確認などの初動時に、抜け漏れを減らすためのチェックリスト・記録支援アプリ。
- 初動チェックリスト、捜索エリア管理（要再確認対応）、役割カード、経過時間タイマー
- 個人情報（氏名・写真・住所等）を入力させない設計
- 印刷対応、振り返り用Markdownおよび事後整理用ChatGPTプロンプト出力機能

### 3. MaruFlow MVP Mock (`apps/maruflow-mock/`)
紙テスト前提の採点支援アプリ「MaruFlow」のMVPを具体化した画面モック。
- PDF登録、採点欄設定、採点画面、出力確認、統計、履歴の7画面構成
- 実AI採点やOCRは未実装（架空のダミーデータによるデモ）

### 4. School Ops Portal (`apps/school-ops-portal/`)
学校ICT・校務に関するナレッジメモを管理するポータル。
- カテゴリ分類、タグ付け、全文検索
- 記事からChatGPT向けプロンプト生成（校務ナレッジ整理用）

### 5. Manazashi Archive Demo (`apps/manazashi-archive-demo/`)
子どもの「まなざし」（気になる言動・成長の記録）を管理するアーカイブのデモ。
- タグ絞り込み、時系列表示、子ども別タイムライン
- ※架空データのみ使用

## 特徴

- **Vite + React + TypeScript**: 全アプリ共通のモダンなフロントエンドスタック
- **PWA対応**: 全アプリに `manifest.json` とテーマカラーを設定
- **ローカルファースト**: バックエンドなしで動作し、データはブラウザの `localStorage` に保存（プライバシー配慮）
- **GitHub Pages デプロイ**: `main` ブランチへのプッシュで全アプリが自動的にビルド・デプロイされます

## ローカル実行方法

このリポジトリは [pnpm](https://pnpm.io/) を使用しています。

```bash
# リポジトリのクローン
git clone https://github.com/ryon-project/ryon-project-command-tools.git
cd ryon-project-command-tools

# 各アプリのディレクトリに移動して実行
cd apps/today-work-selector
pnpm install
pnpm dev
```

## GitHub Pages へのデプロイ方法

`.github/workflows/deploy-pages.yml` により、`main` ブランチにプッシュすると全5アプリと共通トップページが自動的にビルドされ、GitHub Pages にデプロイされます。

## Manus終了後の引き継ぎ方法

AIエージェント（Codex / Claude Code / ChatGPT）への引き継ぎ手順は [HANDOFF.md](./HANDOFF.md) に記載しています。
開発を再開する際は、まず HANDOFF.md を確認してください。
