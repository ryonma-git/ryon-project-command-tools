# Future Integration (将来の連携構想)

本リポジトリのプロトタイプ群が将来的に外部システムやデータソースと連携する際の構想と注意点です。

## 1. Notion Project Command Center との連携
- **対象アプリ**: Today Work Selector
- **構想**: 現在静的に定義されている27のプロジェクトデータを、Notionデータベースから動的に取得する。
- **課題**: クライアントサイドから直接 Notion API を叩くとCORSエラーやAPIキー漏洩のリスクがあるため、サーバーレス関数（Vercel Functions や Netlify Functions）をプロキシとして挟むアーキテクチャが必要。

## 2. personal-memory との連携
- **対象アプリ**: Manazashi Archive Demo
- **構想**: 子どもの「まなざし」記録を、思想と記憶の保管庫である `personal-memory` のフォーマットに合わせてエクスポート・同期する。
- **課題**: データスキーマの互換性確保。

## 3. IshibashiPS-School-Operations-Knowledge-Base との連携
- **対象アプリ**: School Ops Portal
- **構想**: 既存の校務ナレッジベース（Markdownファイル群）をビルド時に読み込み、ポータルの記事データとして自動変換する。
- **課題**: ビルドスクリプト（Node.js）でファイルシステムを走査し、フロントエンド用のJSON/TSデータに変換する処理の実装。

## 4. MaruFlow 本体との連携
- **対象アプリ**: MaruFlow MVP Mock
- **構想**: モックUIをベースに、実際のバックエンド（Python/FastAPI等）とAI OCR・採点APIを接続する。
- **課題**: このリポジトリは静的フロントエンド専用であるため、本格開発時は `maruflow` 専用の別リポジトリに切り出すことを推奨。

## 5. GitHub Issues との連携
- **対象アプリ**: 全体
- **構想**: 各アプリ内で発生したエラーやフィードバックを、直接 GitHub Issues に起票する機能。

## 6. ChatGPT API を使う場合の注意
- 現在は「プロンプトテキストを生成してクリップボードにコピーする」のみに留めています。
- 将来的にアプリ内から直接 ChatGPT API を叩く場合、**絶対にフロントエンドコード内にAPIキーをハードコードしないでください。**
- ユーザーにAPIキーを入力させる（`localStorage` に保存）か、バックエンドプロキシを用意する必要があります。
