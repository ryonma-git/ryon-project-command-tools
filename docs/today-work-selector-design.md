# Today Work Selector 設計書

## 1. 概要
「Today Work Selector」は、松尾亮佑の個人・校務・開発プロジェクト（全27件）の中から、その日の「時間」「気力」「場所」「使えるツール」「気分」に応じて、最適な作業を推薦し、AIエージェント（ChatGPT / Codex / Claude Code / Manus）への作業開始プロンプトを生成する静的Webアプリです。

## 2. 目的
- 多数のプロジェクトを抱える中での「何から手をつけるべきか」という迷いをなくす。
- その日のコンディションに合わせた無理のない作業を選択する。
- AIエージェントへの作業指示（プロンプト）を自動生成し、作業開始のハードルを下げる。

## 3. 主要機能
1. **状態入力**: 時間（15分/30分/1時間/2時間以上）、気力（低/中/高）、場所（自宅/学校/外）、使えるエージェント、気分を選択。
2. **プロジェクト推薦**: 入力された状態に基づき、全27プロジェクトをスコアリングし、上位3件を推薦。
3. **プロンプト生成**: 選択されたエージェント向けに、今日のゴール、やらないこと、期待する成果物、作業後に戻すべき場所を明記したプロンプトを生成。
4. **全プロジェクト一覧**: 領域（校務、授業、開発、記録など）でフィルタリング可能な全プロジェクト一覧表示。
5. **状態保存**: 入力状態を `localStorage` に保存し、次回アクセス時に復元。

## 4. データ構造

### Project 型
```typescript
export type ProjectStatus = 'active' | 'pending' | 'paused' | 'done';
export type ProjectPriority = 'high' | 'medium' | 'low';
export type ProjectArea = '校務' | '授業' | '開発' | '記録' | 'キャリア' | '個人' | 'インフラ' | '健康・趣味';

export interface Project {
  id: string;
  name: string;
  area: ProjectArea;
  status: ProjectStatus;
  priority: ProjectPriority;
  energy: '低' | '中' | '高';
  nextAction: string;
  recommendedContexts: string[]; // ['ChatGPTのみ', 'Codexあり', 'Claude Codeあり', 'Manusあり']
  outputTypes: string[];         // ['Markdown', 'GitHub', 'Notion', 'コード', 'アイデア', 'PDF', 'Excel', 'JSON']
  notes?: string;
  preferredLocation?: ('自宅' | '学校' | '外')[];
  risk?: 'low' | 'medium' | 'high';
  suitableFor?: string;
  prompts?: {
    chatgpt?: string;
    codex?: string;
    claudeCode?: string;
    manus?: string;
  };
}
```

## 5. 推薦ロジック (`recommend.ts`)
- **ステータス・優先度**: `active`（進行中）や `high`（優先度高）のプロジェクトに加点。
- **気力マッチング**:
  - 気力「低」: 記録・整理系、Markdown出力のプロジェクトに加点。
  - 気力「高」: 開発・設計系、コード出力のプロジェクトに加点。
- **時間マッチング**:
  - 短時間（15分/30分）: 記録系に加点、開発系は減点。
  - 長時間（2時間以上）: 開発系に加点。
- **場所マッチング**: `preferredLocation` と一致する場合に加点。
- **気分マッチング**: 「記録だけしたい」「実装したい」などの特定の気分に強く連動するプロジェクトに大幅加点。

## 6. プロンプト生成ロジック (`generatePrompts.ts`)
生成されるプロンプトには以下の要素が含まれます。
- **今日の状態**: 入力されたコンディション。
- **今日やるプロジェクト**: 推薦された上位3件のプロジェクト名と次のアクション。
- **今日のゴール**: 達成すべき目標。
- **やらないこと**: 時間や気力に応じて、避けるべき作業（例: 「新しい設計には着手しない」）。
- **期待する成果物**: 出力形式（Markdown, コード等）。
- **作業後に戻すべき場所**: GitHubへのpush、Notionへの記録など。
- **エージェント固有の依頼**: Codexにはコマンド提示、Claude CodeにはNotion更新、ManusにはUI実装など、エージェントの特性に合わせた指示。
