# Today Work Selector (今日の仕事教えてアプリ)

## アプリの目的
松尾亮佑が、抱えている複数のプロジェクトの中から「今日やるべき作業」を選び、各種AIエージェント（ChatGPT / Codex / Claude Code / Manus）に投げるべきプロンプトを簡単に生成するための静的Webアプリです。

毎日の「何から手をつけるべきか」という迷いを減らし、気力や時間、場所に合わせた最適なプロジェクトを推薦することで、作業の初速を最大化します。

## 使い方
1. **今日の状態を入力**
   - 使える時間、気力、場所、使えるエージェント、今日の気分を選択します。
2. **おすすめを確認**
   - 入力された状態をもとに、最大3つのプロジェクトが推薦されます。
3. **プロンプトをコピー**
   - 推薦されたプロジェクトをもとに、各エージェント向けのプロンプトが自動生成されます。
   - コピーしてエージェントに貼り付けるだけで作業を開始できます。
4. **状態の保存**
   - 「状態を保存」ボタンを押すと、現在の状態と生成されたプロンプトがブラウザのlocalStorageに保存され、次回アクセス時に復元されます。

## 技術構成
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: カスタムCSS (Tailwindなし、`index.css` に集約)
- **Data Storage**: localStorage (外部データベース・API不要)
- **Deployment**: 静的ファイルホスティング (GitHub Pages / Netlify) 対応

## ローカル実行方法

### 前提条件
- Node.js (v18以上推奨)
- pnpm (または npm / yarn)

### 手順
```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```
起動後、ブラウザで `http://localhost:5173` にアクセスしてください。

## GitHub Pages / Netlifyへのデプロイ方法

### GitHub Pages の場合
1. リポジトリの `Settings` > `Pages` を開く
2. `Source` を `GitHub Actions` に設定
3. Vite 用の GitHub Actions ワークフローファイル（`.github/workflows/deploy.yml` など）を追加して push すると自動でデプロイされます。

### Netlify の場合
1. Netlify にログインし、「Add new site」から「Import an existing project」を選択
2. GitHub リポジトリを連携
3. 以下の設定でデプロイ
   - **Base directory**: `apps/today-work-selector`
   - **Build command**: `pnpm build`
   - **Publish directory**: `apps/today-work-selector/dist`

## 今今後の拡張案
- **プロジェクトデータの外部化**: 現在は `src/data/projects.ts` にハードコードされていますが、JSONファイルやNotion APIからの動的取得への移行。
- **ふりかえり機能の強化**: その日のふりかえり結果をそのままMarkdownとしてダウンロードする機能。
- **PWA対応**: スマホのホーム画面に追加してネイティブアプリのように使えるようにする。
- **Project Command Centerとの完全同期**: GitHub Actionsなどを用いて、定期的にマスターデータを取り込む仕組み。
