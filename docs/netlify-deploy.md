# Netlify Deploy Guide

GitHub Pages の代わりに Netlify を使用して5つのアプリをデプロイする際の手順です。

## Netlify デプロイのメリット

- GitHub Actions のワークフローファイルを編集する権限がなくても、Netlify側の管理画面から設定可能です。
- PRごとのプレビュー環境（Deploy Previews）が自動で作成されます。

## デプロイ設定手順

1. **Netlify アカウントにログイン**
   [Netlify](https://www.netlify.com/) にログインし、「Add new site」から「Import an existing project」を選択します。

2. **GitHub リポジトリの連携**
   `ryon-project-command-tools` リポジトリを選択します。

3. **ビルド設定の入力**
   - **Base directory**: （空欄）
   - **Build command**: `npm run build:all` （※事前に `package.json` に全アプリをビルドして一つのフォルダにまとめるスクリプトを定義しておく必要があります）
   - **Publish directory**: `deploy-dist` （ビルドスクリプトで出力される統合フォルダ名）

## ビルドスクリプトの準備

Netlifyでビルドを成功させるには、ルートの `package.json` に以下のようなスクリプトを追加する必要があります。

```json
{
  "scripts": {
    "build:all": "mkdir -p deploy-dist && cp index.html deploy-dist/ && cd apps/today-work-selector && npm install && npm run build && cp -r dist ../../deploy-dist/today-work-selector && cd ../school-safety-checker && npm install && npm run build && cp -r dist ../../deploy-dist/school-safety-checker && ..."
  }
}
```
※上記は概念を示すものであり、実際のスクリプトはより堅牢に記述してください。

## ViteのBase Path設定

GitHub Pages と同様に、各アプリの `vite.config.ts` で `base` パスを `/アプリ名/` に設定する必要があります。
