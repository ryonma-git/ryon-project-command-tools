# ryon-project-command-tools

このリポジトリは、松尾亮佑のプロジェクト実行を支援する静的Webアプリ群（プロトタイプスイート）です。

Notion Project Command Centerはプロジェクト管理の司令塔、project-management-seedはNotion同期ツール、personal-memoryは思想と記憶の保管庫、ryon-project-command-toolsは日々の作業開始・安全確認・教育プロダクト構想のUIプロトタイプ群として使います。

**※Manus AIによる開発フェーズが終了したため、開発を再開する際は必ず最初に `HANDOFF.md` をお読みください。**

## 収録アプリ（5つのプロトタイプ）

### 1. Today Work Selector (`apps/today-work-selector/`)
今日やるべき作業を選んで、AIエージェントへのプロンプトを生成するアプリ。
- 27のプロジェクトデータから、時間・気力・場所・使えるツールに合わせて上位推薦。
- モード選択、お気に入り機能、各エージェント向けの専用プロンプト生成。

### 2. School Safety Checker (`apps/school-safety-checker/`)
学校での緊急事案（所在不明、けが、不審者、ICT障害）発生時の初動対応を支援するチェックリスト・ログ記録アプリ。
- 印刷対応、Markdownコピー、JSONエクスポート。
- **注意：これは正式な危機管理マニュアルではなく、判断を自動化するものでもありません。最終判断は教職員が行います。**

### 3. MaruFlow MVP Mock (`apps/maruflow-mock/`)
紙テスト前提の採点支援アプリ「MaruFlow」のMVPを具体化した画面モック（全7画面）。
- 実AI採点やOCRは未実装（架空のダミーデータによるUIデモ）。

### 4. School Ops Portal (`apps/school-ops-portal/`)
学校ICT・校務に関するナレッジメモを管理するポータル。
- カテゴリ分類、タグ付け、全文検索。記事からChatGPT向けプロンプト生成。

### 5. Manazashi Archive Demo (`apps/manazashi-archive-demo/`)
子どもの「まなざし」（気になる言動・成長の記録）を管理し、「学びの物語」を3つの文体で生成するデモアプリ。
- **注意：実児童データは一切使用していません（架空データのみ）。所見自動生成や成績管理、監視を目的としたものではありません。**

## ローカル実行方法

各アプリは独立したViteプロジェクトです。

```bash
# リポジトリのクローン
git clone https://github.com/ryonma-git/ryon-project-command-tools.git
cd ryon-project-command-tools

# 例：Today Work Selector の実行
cd apps/today-work-selector
npm install
npm run dev
```

## build方法

各アプリのディレクトリでビルドを実行します。

```bash
cd apps/today-work-selector
npm run build
```

## デプロイ方法

### GitHub Pages
現在、`.github/workflows/deploy-pages.yml` が存在しますが、全5アプリをまとめてビルド・デプロイする設定は未完了です。
デプロイするには、ルートディレクトリで5つのアプリをビルドし、一つの `dist` フォルダにまとめるスクリプトを作成し、Actionsのワークフローを修正する必要があります。
（詳細は `HANDOFF.md` の「次にCodexへ渡すべき作業」を参照）

### Netlify
Netlifyにデプロイする場合、リポジトリを連携し、ビルドコマンドに全アプリをビルドするスクリプト（例：`npm run build:all`）を指定し、公開ディレクトリ（Publish directory）を統合された `dist` フォルダに設定してください。

## 重要な注意（Safety & Privacy）

1. **個人情報を入れない**：APIキー、氏名、住所、連絡先などの機密情報は絶対にコミットしないでください（`.env` は `.gitignore` で除外されています）。
2. **実児童データを使わない**：Manazashi Archive Demo や School Safety Checker のテストには、必ず架空データを使用してください。
3. **School Safety Checker は正式な危機管理マニュアルではない**：あくまで初動の抜け漏れを防ぐ補助ツールです。
4. **判断自動化ではない**：通報や対応の最終判断は必ず人間（教職員）が行う設計を維持してください。

## 次の開発者（人間・AI）へ

開発を再開する際は、**必ず最初に `HANDOFF.md` を読んでください。**
現在の完成度、未実装機能、既知の問題、次にやるべきことが全て記載されています。
