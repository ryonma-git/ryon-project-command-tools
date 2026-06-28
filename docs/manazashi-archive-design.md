# Manazashi Archive Demo 設計書

## 概要
子どもの「まなざし」（気になる言動・成長の記録）を管理・閲覧するアーカイブのデモアプリです。

## 主な機能
1. **タイムライン表示**
   - すべての記録を時系列で表示
   - タグ（ポジティブ、ネガティブ、学習、生活など）による絞り込み
2. **子ども別表示**
   - 特定の子どもに紐づく記録のみを抽出して表示
   - 子どもの基本情報（名前、学年、特性メモ）の表示

## データ構造
現在は `src/data/children.ts` に架空の静的データとして保持しています。
実データを使用する場合は、厳密なプライバシー保護（ローカル完結・暗号化等）が必要です。

```typescript
export interface Child {
  id: string;
  name: string;
  grade: string;
  notes: string;
}

export interface RecordEntry {
  id: string;
  childId: string;
  date: string;
  content: string;
  tags: string[];
  type: 'positive' | 'neutral' | 'concern';
}
```
