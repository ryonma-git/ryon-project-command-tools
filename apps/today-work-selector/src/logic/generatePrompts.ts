// ============================================================
// generatePrompts.ts — プロンプト生成ロジック
// ============================================================

import type { Project, TodayState, PromptSet } from '../types';

function formatProjectList(projects: Project[]): string {
  return projects
    .map(
      (p, i) =>
        `${i + 1}. **${p.name}**（${p.area}）\n   - 次のアクション: ${p.nextAction}\n   - 出力形式: ${p.outputTypes.join('、')}`
    )
    .join('\n');
}

function formatState(state: TodayState): string {
  return `- 使える時間: ${state.time}
- 気力: ${state.energy}
- 場所: ${state.location}
- 使えるエージェント: ${state.agent}
- 今日の気分: ${state.mood}`;
}

function getGoal(projects: Project[], state: TodayState): string {
  if (state.mood === '何も決められない') {
    return '今日どこから手をつけるべきか整理し、最初の一歩を決める';
  }
  if (projects.length === 0) return '今日の作業を整理する';
  return projects.map((p) => p.nextAction).join('、または');
}

function getDoNotDo(state: TodayState): string {
  const items: string[] = [];
  if (state.time === '15分' || state.time === '30分') {
    items.push('新しい設計・大きな実装には着手しない');
    items.push('完璧を目指さず、記録・整理に集中する');
  }
  if (state.energy === '低') {
    items.push('複雑な意思決定や設計判断は行わない');
    items.push('新しいツールのセットアップは行わない');
  }
  if (state.agent === '全部なし') {
    items.push('AIエージェントへの依頼は行わない（手動作業のみ）');
  }
  if (items.length === 0) {
    items.push('スコープ外の新規タスクに着手しない');
    items.push('完了基準を曖昧にしない');
  }
  return items.map((i) => `- ${i}`).join('\n');
}

function getOutputs(projects: Project[]): string {
  const types = [...new Set(projects.flatMap((p) => p.outputTypes))];
  return types.map((t) => `- ${t}`).join('\n');
}

function getReturnTo(projects: Project[]): string {
  const items: string[] = [];
  const hasGitHub = projects.some((p) => p.outputTypes.includes('GitHub'));
  const hasNotion = projects.some((p) => p.outputTypes.includes('Notion'));
  const hasMarkdown = projects.some((p) => p.outputTypes.includes('Markdown'));

  if (hasGitHub) items.push('GitHub: 作業ログ・コード変更をコミット＆push');
  if (hasNotion) items.push('Notion: 作業内容・決定事項を該当ページに記録');
  if (hasMarkdown) items.push('personal-memory: 今日の作業ログをMarkdownで記録');
  if (items.length === 0) {
    items.push('personal-memory: 今日の作業ログをMarkdownで記録');
  }
  return items.map((i) => `- ${i}`).join('\n');
}

export function generatePrompts(state: TodayState, projects: Project[]): PromptSet {
  const stateText = formatState(state);
  const projectList = formatProjectList(projects);
  const goal = getGoal(projects, state);
  const doNotDo = getDoNotDo(state);
  const outputs = getOutputs(projects);
  const returnTo = getReturnTo(projects);

  // 何も決められない日は特別なプロンプト
  if (state.mood === '何も決められない') {
    const consultPrompt = `# 今日の作業相談

## 今日の状態
${stateText}

## 相談内容
今日は何から手をつければいいか迷っています。
以下のプロジェクト候補を踏まえて、今日の状態に最適な作業を1〜2個提案してください。

## プロジェクト候補
${projectList}

## お願い
- 今日の気力・時間・場所・使えるツールを考慮して提案してください
- 「まず5分でできること」から始められるよう具体的に教えてください
- やらなくていいことも教えてください`;

    return {
      chatgpt: consultPrompt,
      codex: `# Codex相談プロンプト\n\n${consultPrompt}\n\n## Codexへの追加依頼\nもし作業を始めるとしたら、最初のコマンドや操作を具体的に教えてください。`,
      claudeCode: `# Claude Code相談プロンプト\n\n${consultPrompt}\n\n## Claude Codeへの追加依頼\nNotionやMarkdownで整理すべき内容があれば、テンプレートも作成してください。`,
      manus: `# Manus相談プロンプト\n\n${consultPrompt}\n\n## Manusへの追加依頼\nWebアプリやUIプロトタイプで進められる作業があれば提案してください。`,
      reflection: `# 今日のふりかえり（何も決められなかった日）\n\n## 今日の状態\n${stateText}\n\n## ふりかえり\n今日は何から手をつければいいか迷いました。\n\n以下を整理してください：\n1. 今日実際に何をしましたか？\n2. 迷った原因は何でしたか？\n3. 次回同じ状況になったとき、どうすればスムーズに始められますか？\n4. personal-memory / Notion / GitHub に記録すべきことはありますか？`,
    };
  }

  const baseContext = `## 今日の状態
${stateText}

## 今日やるプロジェクト
${projectList}

## 今日のゴール
${goal}

## やらないこと
${doNotDo}

## 期待する成果物
${outputs}

## 作業後に戻すべき場所
${returnTo}`;

  const chatgpt = `# 今日の作業プロンプト（ChatGPT用）

${baseContext}

## ChatGPTへの依頼
上記の今日の状態とプロジェクトを踏まえて、以下をお願いします：

1. 今日のゴールを達成するための具体的な作業ステップを3〜5個教えてください
2. 各ステップで注意すべきことを簡潔に教えてください
3. 作業中に迷ったときの判断基準を教えてください
4. 作業終了の目安（完了条件）を教えてください

## 注意事項
- 今日の時間（${state.time}）と気力（${state.energy}）に合わせた現実的なステップにしてください
- 完璧を目指さず、「今日できること」に絞ってください`;

  const codex = `# 今日の作業プロンプト（Codex用）

${baseContext}

## Codexへの依頼
以下の作業をCodexで進めます。具体的なコマンドやファイル操作を教えてください：

${projects
  .filter((p) => p.recommendedContexts.includes('Codexあり'))
  .map((p) => `- **${p.name}**: ${p.nextAction}`)
  .join('\n') || projects.map((p) => `- **${p.name}**: ${p.nextAction}`).join('\n')}

## Codexへのお願い
1. 作業を始めるための最初のコマンドを教えてください
2. Markdownファイルの作成・更新が必要な場合はテンプレートを提供してください
3. GitHubへのコミット・pushの手順を確認してください
4. 作業ログを personal-memory に記録するためのMarkdownテンプレートを作成してください

## 制約
- APIキー・秘密情報は使わない
- node_modules / .env はコミットしない
- コミットメッセージは日本語で簡潔に`;

  const claudeCode = `# 今日の作業プロンプト（Claude Code用）

${baseContext}

## Claude Codeへの依頼
以下の作業をClaude Codeで進めます：

${projects
  .filter((p) => p.recommendedContexts.includes('Claude Codeあり'))
  .map((p) => `- **${p.name}**: ${p.nextAction}`)
  .join('\n') || projects.map((p) => `- **${p.name}**: ${p.nextAction}`).join('\n')}

## Claude Codeへのお願い
1. Notionページの更新・整理が必要な場合は、記載内容のMarkdown草稿を作成してください
2. Project Command Center の整理・更新が必要な場合は、変更内容を提案してください
3. ドキュメント・設計書の作成・更新をサポートしてください
4. 作業後に personal-memory / GitHub に戻すべき内容を整理してください

## 注意事項
- Notionの構造・命名規則を維持してください
- 既存のドキュメント形式を踏襲してください`;

  const manus = `# 今日の作業プロンプト（Manus用）

${baseContext}

## Manusへの依頼
以下の作業をManusで進めます：

${projects
  .filter((p) => p.recommendedContexts.includes('Manusあり'))
  .map((p) => `- **${p.name}**: ${p.nextAction}`)
  .join('\n') || projects.map((p) => `- **${p.name}**: ${p.nextAction}`).join('\n')}

## Manusへのお願い
1. Webアプリ・UIプロトタイプの実装をお願いします
2. React + TypeScript + Tailwind CSS を使ってください
3. 静的Webアプリとして実装し、GitHub Pagesにデプロイできる形にしてください
4. 実装後は必ずGitHubにpushできる状態にしてください
5. README.md と HANDOFF.md を作成してください

## 制約
- APIキー・秘密情報は使わない
- ChatGPT APIは使わない
- manus.space だけに依存しない構成にする
- node_modules / .env はコミットしない`;

  const reflection = `# 今日の作業ふりかえりプロンプト（ChatGPT用）

## 今日の状態
${stateText}

## 今日やったプロジェクト
${projectList}

## 今日のゴール（当初）
${goal}

## ふりかえり依頼
今日の作業を振り返って、以下を整理してください：

1. **達成できたこと**: 今日のゴールに対して何が達成できましたか？
2. **達成できなかったこと・残タスク**: 何が残りましたか？次回に引き継ぐことは？
3. **気づき・学び**: 作業を通じて気づいたこと・学んだことはありますか？
4. **次回へのアクション**: 次回同じプロジェクトに取り組むとき、最初にすべきことは？
5. **記録すべき場所**:
   - GitHub: コミット・push すべき変更はありますか？
   - Notion: 更新・追記すべきページはありますか？
   - personal-memory: 今日のログとして記録すべきことは？

## 注意
- 完璧なふりかえりより、「次につながる記録」を重視してください
- 5分でできる範囲でまとめてください`;

  return { chatgpt, codex, claudeCode, manus, reflection };
}
