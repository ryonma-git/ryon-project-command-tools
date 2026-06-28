# ryon-project-command-tools

このリポジトリは、松尾亮佑のプロジェクト実行を支援する静的Webアプリ群である。

Notion Project Command Centerはプロジェクト管理の司令塔、project-management-seedはNotion同期ツール、personal-memoryは思想と記憶の保管庫、ryon-project-command-toolsは日々の作業開始・安全確認・教育プロダクト構想のUIプロトタイプ群として使う。

## 収録アプリ

現在、以下の3つのアプリが収録されています。

### 1. Today Work Selector (`apps/today-work-selector/`)
今日やるべき作業を選んで、AIエージェント（ChatGPT / Codex / Claude Code / Manus）へのプロンプトを生成するアプリ。
- 27のプロジェクトデータから、時間・気力・場所・使えるツールに合わせて上位3件を推薦
- localStorageによる状態保存
- 各エージェント向けの専用プロンプト生成

### 2. School Safety Checker (`apps/school-safety-checker/`)
児童所在不明・校内安全確認などの初動時に、抜け漏れを減らすためのチェックリスト・記録支援アプリ。
- 初動チェックリスト、捜索エリア管理、役割カード、経過時間タイマー
- 個人情報（氏名・写真・住所等）を入力させない設計
- 振り返り用Markdownおよび事後整理用ChatGPTプロンプト出力機能
- ※正式な危機管理マニュアルではなく、初動確認補助ツールです。

### 3. MaruFlow MVP Mock (`apps/maruflow-mock/`)
紙テスト前提の採点支援アプリ「MaruFlow」の最初のMVPを具体化した画面モック。
- PDF登録、採点欄設定、採点画面、出力確認の5画面構成
- 実AI採点やOCRは未実装（架空のダミーデータによるデモ）
- 実児童データは使用していません

## ローカル実行方法

このリポジトリは [pnpm](https://pnpm.io/) を使用しています。

```bash
# リポジトリのクローン
git clone https://github.com/your-username/ryon-project-command-tools.git
cd ryon-project-command-tools

# 各アプリのディレクトリに移動して実行
cd apps/today-work-selector
pnpm install
pnpm dev
```

## ビルド方法

```bash
cd apps/today-work-selector
pnpm build
# dist/ ディレクトリに静的ファイルが出力されます
```

## GitHub Pages / Netlify へのデプロイ方法

すべてのアプリは外部API不要の静的Webアプリ（React + Vite）です。

### GitHub Pages (Actions)
`.github/workflows/deploy-pages.yml` に設定例があります。
`apps/today-work-selector/dist` などをアーティファクトとしてアップロードし、デプロイします。
※ Viteの `base` 設定をリポジトリ名に合わせる必要があります。

### Netlify
1. Netlifyで新しいサイトを作成し、GitHubリポジトリを連携
2. Base directory: `apps/today-work-selector` (デプロイしたいアプリ)
3. Build command: `pnpm build`
4. Publish directory: `dist`

## Manus終了後の引き継ぎ方法

AIエージェント（Codex / Claude Code / ChatGPT）への引き継ぎ手順は [HANDOFF.md](./HANDOFF.md) に記載しています。
開発を再開する際は、まず HANDOFF.md を確認してください。
