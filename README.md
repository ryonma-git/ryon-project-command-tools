# ryon-project-command-tools

松尾亮佑の教育・校務・開発プロジェクトを管理・支援するためのツール群です。
各アプリは静的Webアプリとして独立しており、GitHub Pages / Netlify にデプロイ可能です。

## アプリ一覧

| アプリ | ディレクトリ | 状態 | 概要 |
|--------|-------------|------|------|
| Today Work Selector | `apps/today-work-selector/` | 実装済み | 今日やるべき作業を選び、AIエージェントへのプロンプトを生成する |
| school-safety-checker | `apps/school-safety-checker/` | 設計中 | 学校施設の安全点検記録・管理Webアプリ |

## ドキュメント

- `HANDOFF.md` — 引き継ぎ資料（Manus終了後の継続開発方法）
- `docs/school-safety-checker-design.md` — school-safety-checker の設計書

## 開発方針

このリポジトリは、Manusの利用期限終了後も継続して開発できるよう、以下の方針で構築されています。

1. **manus.space に依存しない**: 静的ファイルのみで動作し、外部サービスへの依存を最小化。
2. **APIキー・秘密情報なし**: すべての機能はフロントエンドのみで完結。
3. **GitHub Pages / Netlify 対応**: `pnpm build` でビルドした `dist/` をそのままデプロイ可能。
4. **Codex / Claude Code / ChatGPT で継続可能**: 各アプリのソースコードとドキュメントを整備し、AIエージェントによる引き継ぎを容易にしている。
