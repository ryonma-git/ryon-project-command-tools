# School Ops Portal 設計書

## 概要
学校ICT・校務に関するナレッジメモを管理・閲覧するためのポータルアプリです。

## 主な機能
1. **記事の閲覧・検索**
   - カテゴリ（ICT、ネットワーク、タブレット管理など）による絞り込み
   - タグ・タイトル・内容の全文検索
2. **ステータス管理**
   - 記事の鮮度（確認済み、下書き、要確認、古い情報）を視覚的に表示
3. **プロンプト生成**
   - 記事の内容をもとに、ChatGPT等のLLMに「校務ナレッジ整理」を依頼するためのプロンプトを生成

## データ構造
現在は `src/data/articles.ts` に静的データとして保持しています。
今後はローカルストレージや IndexedDB への移行を想定しています。

```typescript
export interface OpsArticle {
  id: string;
  title: string;
  category: OpsCategory;
  tags: string[];
  status: 'confirmed' | 'draft' | 'needs-review' | 'outdated';
  lastUpdated: string;
  summary: string;
  body: string; // Markdown形式
}
```
