import type { Quiz, QuizResult } from './types';
import { DIFFICULTY_LABELS, LETTERS } from './types';

export function quizToMarkdown(quiz: Quiz, result?: QuizResult): string {
  const lines: string[] = [];
  lines.push(`# ${quiz.title}`);
  lines.push('');
  lines.push(`- **Topic:** ${quiz.topic}`);
  lines.push(`- **Difficulty:** ${DIFFICULTY_LABELS[quiz.difficulty]}`);
  lines.push(`- **Questions:** ${quiz.questions.length}`);
  if (result) {
    lines.push(`- **Score:** ${result.correct}/${result.total} (${result.percentage}%)`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  quiz.questions.forEach((q, i) => {
    const sel = result?.perQuestion.find((p) => p.questionId === q.id);
    lines.push(`## Q${i + 1}. ${q.question}`);
    q.options.forEach((opt, oi) => {
      const isCorrect = oi === q.correctIndex;
      const isChosen = sel?.selected === oi;
      const tag = isCorrect ? ' ✓ correct' : isChosen ? ' ✗ your answer' : '';
      lines.push(`- **${LETTERS[oi]}.** ${opt}${tag}`);
    });
    lines.push('');
    lines.push(`> **Explanation:** ${q.explanation}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  });

  return lines.join('\n');
}

export function quizToPlainText(quiz: Quiz, result?: QuizResult): string {
  const lines: string[] = [];
  lines.push(`${quiz.title}`);
  lines.push(`Topic: ${quiz.topic} | Difficulty: ${DIFFICULTY_LABELS[quiz.difficulty]} | Questions: ${quiz.questions.length}`);
  if (result) {
    lines.push(`Score: ${result.correct}/${result.total} (${result.percentage}%)`);
  }
  lines.push('');

  quiz.questions.forEach((q, i) => {
    lines.push(`Q${i + 1}. ${q.question}`);
    q.options.forEach((opt, oi) => {
      const mark = oi === q.correctIndex ? ' *' : '';
      lines.push(`   ${LETTERS[oi]}. ${opt}${mark}`);
    });
    lines.push(`   Explanation: ${q.explanation}`);
    lines.push('');
  });

  return lines.join('\n');
}

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
