# Handoff

このファイルは、Manus AIから次の開発者（人間、Codex、Claude Code、ChatGPTなど）へ作業を引き継ぐための最重要ドキュメントです。
作業を再開する際は、必ず最初にこのファイルを確認してください。

## 現在の完成度

- **Today Work Selector**：100% / 完成（静的プロトタイプとして要件を全て満たす）
- **School Safety Checker**：100% / 完成（印刷・JSON出力対応、機能要件完了）
- **MaruFlow MVP Mock**：100% / 完成（7画面構成、UIモックとして完成）
- **School Ops Portal**：100% / 完成（検索・カテゴリ・プロンプト生成完了）
- **Manazashi Archive Demo**：100% / 完成（3スタイル物語生成・タイムライン完了）

全体として、**「Phase 1: 静的プロトタイプ作成」および「Phase 2: 5アプリのUI完成」は完全に終了**しています。

## 現在実装済みのもの

- 5つの独立したVite（React+TS）アプリ
- ルートの `index.html`（5アプリへの共通ナビゲーション）
- 各アプリのPWA対応（`manifest.json`、テーマカラー）
- 各アプリのビルド設定（TypeScriptエラーなし、本番ビルド成功）
- `docs/` 配下の各アプリ設計書
- GitHub Actions の `deploy-pages.yml`（ただし `today-work-selector` のみのデプロイ設定で止まっている）

## 未実装・未完成のもの

- **GitHub Pages への全5アプリのデプロイ**（現状のActions設定ではルートのindex.htmlと全アプリの同時デプロイが未完了）
- アプリ間のデータ連携（現在はそれぞれ独立した静的データを持っている）
- 実際のバックエンド・データベース（Supabase/Firebase等）との接続
- 実際のLLM API（OpenAI等）との直接接続（現在はプロンプトをコピーするだけ）

## 既知の問題

- GitHub Actions の `deploy-pages.yml` が5アプリ全体をビルド・デプロイする設定になっていない（権限エラーのため更新を保留した）。
- `dist` ディレクトリの扱い：ローカルビルドでは各アプリの `dist` に出力されるが、ルートの `index.html` からリンクをたどるには、デプロイ時にファイルを一つにまとめるビルドスクリプトが必要。

## 次にCodexへ渡すべき作業

1. **デプロイ設定の修正**：
   「ルートディレクトリに `build.sh` を作成し、全5アプリをビルドして一つの `dist` フォルダにまとめ、ルートの `index.html` もそこにコピーするスクリプトを書いてください。その後、`deploy-pages.yml` を修正してその `dist` を GitHub Pages にデプロイするようにしてください。」

## 次にClaude Codeへ渡すべき作業

1. **Notion API 連携の設計**：
   「`docs/future-integration.md` を読み、Today Work Selector や School Ops Portal のデータを Notion データベースから取得するアーキテクチャを設計し、`docs/notion-integration.md` を作成してください。」

## 次にChatGPTへ相談すべきこと

- **PMレビュー**：現在の5アプリのUI/UXについて、学校現場の視点から改善点がないかレビューしてもらう。
- **仕様判断**：School Safety Checker のログを学校の正式な記録として扱うために必要な、自治体ごとのフォーマット対応方針を相談する。

## 触ってはいけないこと

- **実児童データを入れない**（すべて架空データで運用すること）
- **個人情報を入れない**（氏名、住所、連絡先など）
- **APIキーを入れない**（`.env` に記述し、コミットしないこと）
- **`.env` をコミットしない**（`.gitignore` に記載済み）
- **School Safety Checkerで通報判断を自動化しない**（最終判断は必ず人間が行うUIを維持する）
- **まなざしアーカイブを所見自動生成や成績管理として扱わない**（あくまで「物語」の整理ツールであること）

## 再開手順

次のエージェント（または人間）が作業を再開する際の手順です。

1. `README.md` を読む
2. `HANDOFF.md`（このファイル）を読む
3. ルートディレクトリで `npm install` は不要（各アプリ内で実行する）
4. 各アプリのディレクトリ（例：`cd apps/today-work-selector`）に移動
5. `npm install`
6. `npm run dev` でローカルサーバー起動
7. `npm run build` でビルド確認
8. `docs/` フォルダ内の関連仕様書を確認
9. 未完了タスク（デプロイ設定など）を確認して作業開始

## 重要ファイル一覧

- `index.html`：5アプリへの共通ポータル（ナビゲーション）
- `HANDOFF.md`：引き継ぎ資料（このファイル）
- `ROADMAP.md`：今後の開発フェーズ
- `apps/*/src/App.tsx`：各アプリのメインUI実装
- `apps/*/src/data/*.ts`：各アプリの静的（架空）データ
- `docs/*.md`：各アプリの設計書・仕様書

## 直近のコミット

最後の作業完了時点のコミットハッシュ：
`fa6165f` (Enhance safety checker and manazashi archive demo)
