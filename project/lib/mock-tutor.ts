import type { ChatMessage } from './types';

const KEYWORD_BANK: { match: string[]; reply: string }[] = [
  {
    match: ['what is', 'define', 'definition'],
    reply:
      "Great question! Based on your notes, here's a concise definition followed by the key details.\n\n• **Core idea:** the term describes a concept that organizes how something works.\n• **Why it matters:** it gives you a mental model you can apply to related problems.\n• **Example from your notes:** look at how the notes connect this idea to concrete cases.\n\nIf you tell me which specific term you're asking about, I'll give you the exact definition from your material.",
  },
  {
    match: ['difference between', 'vs', 'versus', 'compare'],
    reply:
      "Comparisons are one of the best ways to lock in understanding. Here's how to think about it:\n\n1. **Similarity** — both concepts share a common goal.\n2. **Key difference** — they achieve that goal through different mechanisms.\n3. **When to use each** — context from your notes determines the right choice.\n\nTell me the two things you'd like compared and I'll pull the specifics straight from your notes.",
  },
  {
    match: ['example', 'give me an example', 'real world'],
    reply:
      "Examples make abstract ideas stick. Here's a study strategy that works well:\n\n- Start from the definition in your notes.\n- Replace the abstract terms with concrete names.\n- Check whether the result still satisfies the definition.\n\nShare the specific concept and I'll generate a concrete example grounded in your notes.",
  },
  {
    match: ['why', 'explain', 'how does', 'how do'],
    reply:
      "Let's break this down step by step so it's easy to reason about:\n\n1. **What is happening** — the process your notes describe.\n2. **Why it happens that way** — the underlying mechanism or cause.\n3. **What follows from it** — the consequence or result.\n\nThis 'what → why → so what' structure is a powerful framework for exam answers. Tell me the exact topic and I'll map your notes onto this structure.",
  },
];

const GENERIC_REPLIES = [
  "That's a thoughtful question. Based on your notes, the key idea is that the concept connects several pieces of information into a single framework. Try summarizing it in your own words first — teaching it back is the fastest way to confirm you understand it. Ask me for the exact definition or an example and I'll dig into your notes.",
  "Good question! Here's a study tip: re-read the relevant section of your notes, then close them and try to explain the idea aloud as if teaching a friend. If you stumble, that's exactly the gap to focus on. Tell me which term or concept you're working on and I'll give you a structured breakdown from your material.",
  "I can help with that. The most effective approach is to identify the core definition, then one supporting example, then one edge case. That trio — definition, example, edge case — covers most exam questions. Point me at the specific topic in your notes and I'll build that trio for you.",
  "Great thing to ask about. Your notes lay out the foundations clearly, so I'd recommend making a quick concept map: put the main idea in the center and connect its supporting facts and examples around it. This visual reinforcement boosts recall. Share the exact concept and I'll structure the explanation for you.",
];

export function mockTutorReply(question: string, _notes: string): string {
  const q = question.toLowerCase();
  const hit = KEYWORD_BANK.find((k) =>
    k.match.some((m) => q.includes(m))
  );
  if (hit) return hit.reply;
  return GENERIC_REPLIES[Math.floor(Math.random() * GENERIC_REPLIES.length)];
}
