import type {
  ApiProvider,
  Difficulty,
  Quiz,
  QuizQuestion,
  QuizLength,
} from './types';
import { DIFFICULTY_LABELS, LETTERS } from './types';
import { mockGenerateQuiz } from './mock-generator';

const SYSTEM_PROMPT = `You are PrepIQ, an expert exam writer and study companion.
Your job: turn a student's study notes into a multiple-choice quiz that tests real understanding.

RULES (follow exactly):
1. Generate exactly the number of questions requested — no more, no less.
2. Every question must have exactly 4 options labeled A, B, C, D.
3. Exactly one option is correct.
4. Write a clear, specific explanation for each question that teaches WHY the correct answer is right and briefly why the others are wrong.
5. Base every question ONLY on the provided notes. Do not invent facts outside the notes.
6. Match the requested difficulty:
   - easy: definitions, direct recall, basic concepts
   - medium: application, comparison, analysis
   - hard: synthesis, edge cases, "which is NOT" style reasoning
7. Avoid trick questions and ambiguous wording. Make distractors plausible but clearly wrong.
8. Return ONLY valid JSON — no markdown fences, no commentary.

OUTPUT FORMAT (a single JSON object):
{
  "title": "short quiz title",
  "topic": "short topic",
  "questions": [
    {
      "question": "the question text",
      "options": ["option A text", "option B text", "option C text", "option D text"],
      "correctIndex": 0,
      "explanation": "why the correct answer is right"
    }
  ]
}

correctIndex is the 0-based index of the correct option (0=A, 1=B, 2=C, 3=D).`;

interface RawQuestion {
  question?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
}

function cleanJson(text: string): string {
  let t = text.trim();
  // strip markdown code fences
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  // trim to outermost braces
  const first = t.indexOf('{');
  const last = t.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    t = t.slice(first, last + 1);
  }
  return t;
}

function normalizeQuestions(raw: RawQuestion[], count: number): QuizQuestion[] {
  return raw.slice(0, count).map((q, i) => {
    const options = (q.options || []).slice(0, 4);
    while (options.length < 4) options.push('—');
    let correct = Number(q.correctIndex);
    if (!Number.isInteger(correct) || correct < 0 || correct > 3) correct = 0;
    return {
      id: i + 1,
      question: q.question?.trim() || `Question ${i + 1}`,
      options: options.map((o) => String(o).trim()),
      correctIndex: correct,
      explanation: q.explanation?.trim() || 'No explanation provided.',
    };
  });
}

async function generateWithGemini(
  apiKey: string,
  notes: string,
  difficulty: Difficulty,
  count: QuizLength
): Promise<{ title: string; topic: string; questions: QuizQuestion[] }> {
  const userPrompt = `DIFFICULTY: ${DIFFICULTY_LABELS[difficulty]}
NUMBER OF QUESTIONS: ${count}

STUDY NOTES:
"""
${notes}
"""

Generate the quiz now. Return ONLY the JSON object.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }] as any,
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!text) throw new Error('Gemini returned an empty response.');

  const parsed = JSON.parse(cleanJson(text));
  return {
    title: parsed.title || 'AI-Generated Quiz',
    topic: parsed.topic || 'Your Notes',
    questions: normalizeQuestions(parsed.questions || [], count),
  };
}

async function generateWithOpenAI(
  apiKey: string,
  notes: string,
  difficulty: Difficulty,
  count: QuizLength
): Promise<{ title: string; topic: string; questions: QuizQuestion[] }> {
  const userPrompt = `DIFFICULTY: ${DIFFICULTY_LABELS[difficulty]}
NUMBER OF QUESTIONS: ${count}

STUDY NOTES:
"""
${notes}
"""

Generate the quiz now. Return ONLY the JSON object.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const text: string = data?.choices?.[0]?.message?.content ?? '';
  if (!text) throw new Error('OpenAI returned an empty response.');

  const parsed = JSON.parse(cleanJson(text));
  return {
    title: parsed.title || 'AI-Generated Quiz',
    topic: parsed.topic || 'Your Notes',
    questions: normalizeQuestions(parsed.questions || [], count),
  };
}

export async function generateQuiz(opts: {
  notes: string;
  difficulty: Difficulty;
  count: QuizLength;
  apiKeyConfig: { provider: ApiProvider; key: string } | null;
}): Promise<Quiz> {
  const { notes, difficulty, count, apiKeyConfig } = opts;

  if (apiKeyConfig?.key) {
    try {
      const result =
        apiKeyConfig.provider === 'gemini'
          ? await generateWithGemini(apiKeyConfig.key, notes, difficulty, count)
          : await generateWithOpenAI(apiKeyConfig.key, notes, difficulty, count);

      if (result.questions.length === 0) {
        throw new Error('The AI returned no valid questions.');
      }

      return {
        id: crypto.randomUUID(),
        title: result.title,
        topic: result.topic,
        difficulty,
        questions: result.questions,
        createdAt: Date.now(),
        source: 'ai',
      };
    } catch (err) {
      throw err; // surfaced to the caller so it can decide to fall back
    }
  }

  // No API key — use the reliable mock generator
  return mockGenerateQuiz(notes, difficulty, count);
}
