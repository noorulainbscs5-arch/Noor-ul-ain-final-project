import type { ApiProvider, ChatMessage } from './types';
import { mockTutorReply } from './mock-tutor';

const TUTOR_SYSTEM_PROMPT = `You are PrepIQ Tutor, a friendly, precise study companion.
The student has provided their study notes below. Help them understand the material deeply.

GUIDELINES:
- Answer ONLY based on the provided notes and general educational knowledge that supports them.
- Be concise but complete. Use short paragraphs and bullet points where helpful.
- When a question is unclear, ask one clarifying question.
- Use simple analogies to make hard ideas click.
- Structure longer answers with a one-line summary first, then the details.
- Be encouraging and never condescending.

STUDY NOTES:
"""
{{NOTES}}
"""`;

function buildSystemPrompt(notes: string) {
  return TUTOR_SYSTEM_PROMPT.replace('{{NOTES}}', notes.slice(0, 6000));
}

function stripFences(text: string): string {
  const fence = text.match(/```(?:json|markdown)?\s*([\s\S]*?)```/i);
  return fence ? fence[1].trim() : text.trim();
}

export async function askTutor(opts: {
  question: string;
  notes: string;
  history: ChatMessage[];
  apiKeyConfig: { provider: ApiProvider; key: string } | null;
}): Promise<string> {
  const { question, notes, history, apiKeyConfig } = opts;

  if (apiKeyConfig?.key) {
    try {
      if (apiKeyConfig.provider === 'gemini') {
        return await askGeminiTutor(apiKeyConfig.key, question, notes, history);
      }
      return await askOpenAITutor(apiKeyConfig.key, question, notes, history);
    } catch (err) {
      throw err;
    }
  }

  return mockTutorReply(question, notes);
}

async function askGeminiTutor(
  apiKey: string,
  question: string,
  notes: string,
  history: ChatMessage[]
): Promise<string> {
  const contents = [
    ...history.slice(-6).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: question }] },
  ] as any;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildSystemPrompt(notes) }] },
        contents,
        generationConfig: { temperature: 0.5 },
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
  return text
    ? stripFences(text)
    : 'Sorry, I could not generate a response. Please try rephrasing your question.';
}

async function askOpenAITutor(
  apiKey: string,
  question: string,
  notes: string,
  history: ChatMessage[]
): Promise<string> {
  const messages = [
    { role: 'system', content: buildSystemPrompt(notes) },
    ...history.slice(-6).map((m) => ({
      role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
      content: m.content,
    })),
    { role: 'user', content: question },
  ];

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.5,
      messages,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${errText.slice(0, 200)}`);
  }
  const data = await res.json();
  const text: string = data?.choices?.[0]?.message?.content ?? '';
  return text
    ? stripFences(text)
    : 'Sorry, I could not generate a response. Please try rephrasing your question.';
}
