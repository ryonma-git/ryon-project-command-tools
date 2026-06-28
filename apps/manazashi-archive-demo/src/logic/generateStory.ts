// ============================================================
// generateStory.ts — 「あなたの学びの物語」生成ロジック
// 3スタイル：やさしい文体 / 卒業文集風 / 保護者向け説明文風
// ============================================================
import type { FictionalChild, StoryStyle } from '../types';

function getHighlights(child: FictionalChild) {
  const quotes = child.records.filter(r => r.quote).map(r => r.quote!);
  const reflections = child.records.filter(r => r.selfReflection).map(r => r.selfReflection!);
  const subjects = [...new Set(child.records.map(r => r.subject))];
  const allTags = child.records.flatMap(r => r.tags);
  const tagCount: Record<string, number> = {};
  for (const t of allTags) tagCount[t] = (tagCount[t] || 0) + 1;
  const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);

  const firstRecord = child.records[0];
  const lastRecord = child.records[child.records.length - 1];
  const grade6Records = child.records.filter(r => r.grade === 6);
  const grade1Records = child.records.filter(r => r.grade === 1);

  return { quotes, reflections, subjects, topTags, firstRecord, lastRecord, grade6Records, grade1Records };
}

export function generateGentleStory(child: FictionalChild): string {
  const { quotes, reflections, topTags, firstRecord, grade6Records } = getHighlights(child);
  const lastGrade6 = grade6Records[grade6Records.length - 1];

  let story = `# ${child.alias}の学びの物語 — やさしい文体\n\n`;
  story += `> ※ これはすべて架空のデモデータです。実在する児童とは関係ありません。\n\n`;
  story += `---\n\n`;

  story += `あなたの学びは、${firstRecord ? `${firstRecord.subject}の授業で「${firstRecord.event}」をしたとき` : '小学校に入学したとき'}から始まりました。\n\n`;

  if (firstRecord?.selfReflection) {
    story += `あのとき、あなたはこんなことを感じていましたね。\n\n`;
    story += `> 「${firstRecord.selfReflection}」\n\n`;
  }

  story += `あなたは${child.type}。\n`;
  story += `${child.profile}\n\n`;

  if (quotes.length > 0) {
    story += `6年間で、あなたはたくさんの「気づき」を言葉にしてきました。\n\n`;
    const selectedQuotes = quotes.slice(0, 3);
    for (const q of selectedQuotes) {
      story += `> 「${q}」\n\n`;
    }
  }

  if (topTags.length > 0) {
    story += `あなたの学びのキーワードは、**${topTags.join('・')}**。\n`;
    story += `これらの言葉が、あなたの6年間を彩っていました。\n\n`;
  }

  if (reflections.length > 0) {
    const lastReflection = reflections[reflections.length - 1];
    story += `最後にあなたはこう振り返っていましたね。\n\n`;
    story += `> 「${lastReflection}」\n\n`;
  }

  if (lastGrade6?.teacherNote) {
    story += `先生の目には、あなたはこんなふうに映っていました。\n\n`;
    story += `> ${lastGrade6.teacherNote}\n\n`;
  }

  story += `---\n\n`;
  story += `これからも、あなたらしい「まなざし」で世界を見続けてください。\n`;

  return story;
}

export function generateGraduationStory(child: FictionalChild): string {
  const { quotes, reflections, topTags, firstRecord, grade6Records } = getHighlights(child);
  const lastGrade6 = grade6Records[grade6Records.length - 1];

  let story = `# ${child.alias}の学びの物語 — 卒業文集風\n\n`;
  story += `> ※ これはすべて架空のデモデータです。実在する児童とは関係ありません。\n\n`;
  story += `---\n\n`;

  story += `小学校6年間を振り返ると、私の学びの歴史が見えてきます。\n\n`;

  if (firstRecord) {
    story += `1年生のとき、${firstRecord.subject}で「${firstRecord.event}」に取り組みました。`;
    if (firstRecord.selfReflection) {
      story += `そのとき「${firstRecord.selfReflection}」と感じたことを、今でも覚えています。`;
    }
    story += `\n\n`;
  }

  story += `私は${child.type}でした。\n`;
  story += `${child.profile}\n\n`;

  if (quotes.length > 0) {
    story += `6年間を通じて、私はさまざまな場面で自分の考えを言葉にしてきました。\n\n`;
    const selectedQuotes = quotes.slice(0, 2);
    for (const q of selectedQuotes) {
      story += `「${q}」\n\n`;
    }
    story += `これらの言葉は、私が本当に感じたことです。\n\n`;
  }

  if (topTags.length > 0) {
    story += `私の学びを一言で表すなら、**${topTags.slice(0, 3).join('・')}**という言葉になるでしょう。\n\n`;
  }

  if (lastGrade6?.selfReflection) {
    story += `6年生の最後に、私はこう思いました。\n\n`;
    story += `「${lastGrade6.selfReflection}」\n\n`;
  }

  if (reflections.length >= 2) {
    story += `この気持ちは、1年生のころの「${reflections[0]}」という感覚から、ずっとつながっています。\n\n`;
  }

  story += `---\n\n`;
  story += `中学校でも、小学校で育てた「まなざし」を大切にしていきたいと思います。\n`;

  return story;
}

export function generateParentStory(child: FictionalChild): string {
  const { quotes, topTags, firstRecord, lastRecord, grade6Records } = getHighlights(child);
  const lastGrade6 = grade6Records[grade6Records.length - 1];

  let story = `# ${child.alias}の学びの物語 — 保護者にも読める説明文風\n\n`;
  story += `> ※ これはすべて架空のデモデータです。実在する児童とは関係ありません。\n\n`;
  story += `---\n\n`;

  story += `## お子さんの学びの特徴\n\n`;
  story += `${child.alias}は、${child.type}です。\n\n`;
  story += `${child.profile}\n\n`;

  story += `## 6年間の成長の記録\n\n`;

  if (firstRecord) {
    story += `**1年生のころ**：${firstRecord.subject}の「${firstRecord.event}」では、`;
    story += `${firstRecord.teacherNote}\n\n`;
  }

  const grade3Records = child.records.filter(r => r.grade === 3);
  if (grade3Records.length > 0) {
    const r = grade3Records[0];
    story += `**3年生のころ**：${r.subject}の「${r.event}」では、`;
    story += `${r.teacherNote}\n\n`;
  }

  if (lastGrade6) {
    story += `**6年生のころ**：${lastGrade6.subject}の「${lastGrade6.event}」では、`;
    story += `${lastGrade6.teacherNote}\n\n`;
  }

  if (topTags.length > 0) {
    story += `## 学びのキーワード\n\n`;
    story += `6年間を通じて、お子さんの学びには **${topTags.join('・')}** というテーマが繰り返し現れています。\n\n`;
  }

  if (quotes.length > 0) {
    story += `## 印象的な言葉\n\n`;
    const selectedQuotes = quotes.slice(0, 3);
    for (const q of selectedQuotes) {
      story += `- 「${q}」\n`;
    }
    story += `\n`;
  }

  if (lastRecord?.selfReflection) {
    story += `## 本人の振り返り（最終）\n\n`;
    story += `> 「${lastRecord.selfReflection}」\n\n`;
  }

  story += `---\n\n`;
  story += `**このアーカイブについて**\n\n`;
  story += `このアーカイブは、お子さんの学びの記録を整理したものです。`;
  story += `成績評価・所見の自動生成・監視を目的としたものではありません。`;
  story += `学びの物語を振り返るための補助ツールです。\n`;

  return story;
}

export function generateStory(child: FictionalChild, style: StoryStyle): string {
  switch (style) {
    case 'gentle': return generateGentleStory(child);
    case 'graduation': return generateGraduationStory(child);
    case 'parent': return generateParentStory(child);
  }
}
