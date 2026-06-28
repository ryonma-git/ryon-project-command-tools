# 学校安全管理アプリ (school-safety-checker) 設計書

## 1. プロジェクト概要
**目的**: 学校施設の安全点検を効率化し、点検記録の管理・報告をペーパーレス化するWebアプリケーション。
**ターゲットユーザー**: 学校の教職員、安全管理担当者
**プラットフォーム**: スマートフォン（点検時の現場入力）および PC（管理者向けの集計・報告書出力）

## 2. 技術スタック（想定）
- **フロントエンド**: React + TypeScript + Vite + Tailwind CSS (PWA対応推奨)
- **バックエンド/BaaS**: Supabase または Firebase (認証、データベース、ストレージ)
- **インフラ**: Vercel または Netlify

## 3. 主要機能要件
1. **点検項目のカスタマイズ**
   - 教室、体育館、グラウンド、遊具などの場所別に点検項目を定義可能。
2. **モバイルファーストの点検入力UI**
   - 「異常なし」「要対応」のワンタップ入力。
   - 異常箇所をスマートフォンのカメラで撮影し、即座にアップロード。
   - 音声入力によるコメントのテキスト化（Web Speech API等の活用）。
3. **対応状況のトラッキング**
   - 「要対応」となった項目のステータス管理（未対応 / 対応中 / 完了）。
4. **レポート自動生成**
   - 月次・学期ごとの安全点検報告書（PDFまたはExcel）の自動生成機能。

## 4. データモデル設計 (案)

### Locations (点検場所)
- `id`: UUID
- `name`: string (例: "第1体育館", "北校舎1階トイレ")
- `category`: string (例: "屋内", "屋外", "遊具")

### CheckItems (点検項目)
- `id`: UUID
- `location_id`: UUID (Foreign Key)
- `description`: string (例: "バスケットゴールの固定ボルトに緩みはないか")
- `is_active`: boolean

### Inspections (点検記録)
- `id`: UUID
- `inspector_id`: UUID (ユーザーID)
- `date`: Date
- `status`: enum ('draft', 'submitted')

### InspectionResults (点検結果詳細)
- `id`: UUID
- `inspection_id`: UUID (Foreign Key)
- `check_item_id`: UUID (Foreign Key)
- `status`: enum ('ok', 'warning', 'danger')
- `comment`: text
- `photo_url`: string (StorageのURL)
- `repair_status`: enum ('none', 'pending', 'in_progress', 'resolved')

## 5. 今後の開発フェーズ
- **Phase 1 (MVP)**: 静的な点検項目リストを用いたフロントエンドのみのモックアップ作成（ローカルストレージ保存）。
- **Phase 2**: BaaSを導入し、クラウドでのデータ同期と画像アップロード機能の実装。
- **Phase 3**: 認証機能の追加と、レポート出力（PDF化）機能の実装。
- **Phase 4**: PWA対応と、オフライン時のデータ一時保存・オンライン復帰時の同期機能の実装。

## 6. 備考
この設計書は、`Today Work Selector` での作業推薦をもとに、Codex や Manus を用いて順次実装を進めるためのベースとなります。
