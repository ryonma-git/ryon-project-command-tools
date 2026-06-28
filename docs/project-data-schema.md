# Project Data Schema

`Today Work Selector` で使用されるプロジェクトデータ（27プロジェクト）のスキーマ定義です。
このデータは `apps/today-work-selector/src/data/projects.ts` に静的に定義されています。

## `Project` インターフェース

```typescript
export interface Project {
  id: string;                 // プロジェクトの一意の識別子（例: 'school-ops-portal'）
  name: string;               // プロジェクトの表示名
  description: string;        // プロジェクトの簡単な説明
  category: 'core' | 'exploration' | 'routine'; // プロジェクトの分類
  
  // 推薦ロジックに使用されるメタデータ
  energyLevel: 'high' | 'medium' | 'low'; // 必要な気力レベル
  timeRequired: number;       // 想定される作業時間（分）
  environment: 'any' | 'desk' | 'mobile'; // 必要な環境
  tools: string[];            // 使用するツール（'notion', 'cursor', 'claude' など）
  
  // 新規追加された詳細メタデータ
  risk: 'low' | 'medium' | 'high'; // プロジェクトのリスクレベル
  suitableFor: string;        // 向いている状況の短い説明
  suitableForDetail: string;  // 向いている状況の詳細な説明
  defaultGoals: string[];     // デフォルトの目標リスト
  avoidToday: string[];       // 今日避けるべき作業のリスト
  
  // 出力とコンテキスト
  recommendedContexts: string[]; // 推奨されるAIエージェントのコンテキスト
  outputTypes: string[];      // 期待される出力形式（'code', 'document', 'ui-mock' など）
  
  // プロンプト生成用テンプレート
  prompts: {
    reflection: string;       // 振り返り用のプロンプトテンプレート
    [key: string]: string;    // その他、エージェントごとのプロンプトテンプレート
  };
}
```

## データ拡張の方針

将来的に Notion API と連携してプロジェクトデータを動的に取得する場合、Notionのデータベーススキーマも上記のインターフェースにマッピングできるように設計する必要があります。
