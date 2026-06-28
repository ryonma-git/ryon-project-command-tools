# ryon-project-command-tools 開発ロードマップ

このドキュメントは、本リポジトリに含まれる5つのアプリ群の今後の開発方針と拡張計画をフェーズ別に整理したものです。

## Phase 1：静的プロトタイプ作成（完了）
- 5つの独立したアプリのViteプロジェクト立ち上げ。
- 基本的なコンポーネントとルーティングの作成。
- 架空データ（静的ファイル）を用いた基本機能の実装。

## Phase 2：5アプリのUI完成（完了）
- **Today Work Selector**: 27プロジェクト、推薦ロジック、8モード、お気に入り機能、プロンプト生成。
- **School Safety Checker**: 5種の事案テンプレート、カテゴリ別チェックリスト、エリア管理、印刷対応、エクスポート機能。
- **MaruFlow MVP Mock**: 7画面（ホーム、登録、設定、採点、出力、統計、履歴）のUI実装。
- **School Ops Portal**: カテゴリ・タグ検索、ナレッジ一覧、プロンプト生成。
- **Manazashi Archive Demo**: 児童3名分の6年タイムライン、3スタイルの物語生成、倫理説明ページ。
- 共通トップページ（`index.html`）の作成とPWA対応（`manifest.json`）。

## Phase 3：GitHub Pages / Netlify公開（Next Step）
- 全5アプリをビルドして一つの `dist` フォルダにまとめるビルドスクリプトの作成。
- GitHub Actions の `deploy-pages.yml` の修正と自動デプロイの確立。
- または、Netlifyへの連携とデプロイ設定。

## Phase 4：Project Command Center / personal-memory / 校務opsとの接続設計
- Notion API を用いた Today Work Selector と Project Command Center の同期アーキテクチャ設計。
- School Ops Portal と `IshibashiPS-School-Operations-Knowledge-Base`（既存ナレッジ）の連携。
- Manazashi Archive の記録データを `personal-memory` のフォーマットに合わせるためのスキーマ設計。

## Phase 5：安全・倫理レビュー
- School Safety Checker のログフォーマットが実際の学校・自治体のルールに適合しているかのレビュー。
- Manazashi Archive のデータ管理に関するプライバシー・セキュリティレビュー。
- 実際のLLM（ChatGPT等）APIを組み込む前の、データ送信に関するガイドライン策定。

## Phase 6：独立リポジトリ化するか判断
- 各プロトタイプが実用に耐えうる規模になった段階で、モノレポから独立したリポジトリ（例：`school-safety-checker` 単独リポジトリ）に切り出すかの判断。
- MaruFlow は既にバックエンドが必要な規模になるため、別リポジトリでの本格開発へ移行。
