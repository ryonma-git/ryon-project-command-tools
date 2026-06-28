import type { DummyTest, Question, AnswerSheet } from '../types';

export const DUMMY_QUESTIONS: Question[] = [
  { id: 'q1', label: '問1', maxScore: 10, x: 8,  y: 12, width: 30, height: 8 },
  { id: 'q2', label: '問2', maxScore: 10, x: 8,  y: 26, width: 30, height: 8 },
  { id: 'q3', label: '問3', maxScore: 20, x: 8,  y: 40, width: 30, height: 14 },
  { id: 'q4', label: '問4', maxScore: 20, x: 55, y: 12, width: 35, height: 14 },
  { id: 'q5', label: '問5', maxScore: 20, x: 55, y: 32, width: 35, height: 14 },
  { id: 'q6', label: '問6', maxScore: 20, x: 55, y: 52, width: 35, height: 14 },
];

const makeSheet = (
  id: string,
  name: string,
  marks: Array<{ mark: 'maru' | 'batsu' | 'sankaku' | 'none'; score: number | null; comment: string }>
): AnswerSheet => ({
  id,
  studentName: name,
  scores: DUMMY_QUESTIONS.map((q, i) => ({
    questionId: q.id,
    mark: marks[i].mark,
    score: marks[i].score,
    comment: marks[i].comment,
  })),
});

export const DUMMY_TEST: DummyTest = {
  title: '第1回 算数テスト（架空）',
  subject: '算数',
  grade: '4年生',
  questions: DUMMY_QUESTIONS,
  answerSheets: [
    makeSheet('s1', '架空 太郎', [
      { mark: 'maru',    score: 10, comment: '' },
      { mark: 'maru',    score: 10, comment: '' },
      { mark: 'sankaku', score: 12, comment: '途中式が不足' },
      { mark: 'maru',    score: 20, comment: '' },
      { mark: 'batsu',   score: 0,  comment: '符号ミス' },
      { mark: 'maru',    score: 20, comment: '' },
    ]),
    makeSheet('s2', '架空 花子', [
      { mark: 'maru',    score: 10, comment: '' },
      { mark: 'batsu',   score: 0,  comment: '計算ミス' },
      { mark: 'maru',    score: 20, comment: '' },
      { mark: 'sankaku', score: 15, comment: '単位忘れ' },
      { mark: 'maru',    score: 20, comment: '' },
      { mark: 'maru',    score: 20, comment: '' },
    ]),
    makeSheet('s3', '架空 一郎', [
      { mark: 'batsu',   score: 0,  comment: '' },
      { mark: 'maru',    score: 10, comment: '' },
      { mark: 'sankaku', score: 10, comment: '式が不完全' },
      { mark: 'maru',    score: 20, comment: '' },
      { mark: 'maru',    score: 20, comment: '' },
      { mark: 'batsu',   score: 0,  comment: '問題文の読み間違い' },
    ]),
    makeSheet('s4', '架空 二郎', [
      { mark: 'none', score: null, comment: '' },
      { mark: 'none', score: null, comment: '' },
      { mark: 'none', score: null, comment: '' },
      { mark: 'none', score: null, comment: '' },
      { mark: 'none', score: null, comment: '' },
      { mark: 'none', score: null, comment: '' },
    ]),
  ],
};

export const WORKFLOW_STEPS = [
  { id: 1, label: '空白問題PDFを登録',          icon: '📄', screen: 'pdf-register'  as const },
  { id: 2, label: '採点欄を定義',               icon: '🗂️', screen: 'scoring-setup' as const },
  { id: 3, label: '答案画像/PDFを読み込む',     icon: '📷', screen: 'scoring'       as const },
  { id: 4, label: '丸・バツ・点数・コメントを置く', icon: '✏️', screen: 'scoring'   as const },
  { id: 5, label: '採点済みPDFを出力',          icon: '📤', screen: 'output'        as const },
];
