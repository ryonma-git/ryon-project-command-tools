# GitHub Pages Deploy Guide

このリポジトリの5つのアプリを GitHub Pages にデプロイするための手順と現状の課題をまとめます。

## 現状の課題

現在、`.github/workflows/deploy-pages.yml` は存在しますが、全5アプリを同時にビルドして一つの `dist` フォルダにまとめる処理が実装されていません。
（以前のエージェントの権限不足により、ワークフローファイルの更新が保留されています）

## デプロイを成功させるための手順（Codex/人間向け）

GitHub Pages でルートの `index.html` から各アプリへ正しく遷移させるには、以下の構造を持つデプロイ用ディレクトリ（例: `deploy-dist/`）を作成する必要があります。

```
deploy-dist/
├── index.html (ルートのポータル)
├── today-work-selector/ (アプリ1のビルド結果)
├── school-safety-checker/ (アプリ2のビルド結果)
├── maruflow-mock/ (アプリ3のビルド結果)
├── school-ops-portal/ (アプリ4のビルド結果)
└── manazashi-archive-demo/ (アプリ5のビルド結果)
```

### 必要な作業

1. **Vite設定の修正**
   各アプリの `vite.config.ts` で `base` パスを設定します。
   例（today-work-selectorの場合）: `base: '/ryon-project-command-tools/today-work-selector/'`

2. **ビルドスクリプトの作成**
   リポジトリルートに `build-all.sh` などのスクリプトを作成し、以下の処理を行います。
   - `mkdir deploy-dist`
   - `cp index.html deploy-dist/`
   - 各アプリのディレクトリで `npm run build` を実行
   - ビルドされた `dist/` フォルダを `deploy-dist/<アプリ名>/` としてコピー

3. **deploy-pages.yml の修正**
   GitHub Actions のワークフローを修正し、上記のビルドスクリプトを実行後、`deploy-dist` フォルダを GitHub Pages にアップロードするように設定します。

この作業は、リポジトリを引き継いだ次の開発者が最初に行うべきタスクです。
