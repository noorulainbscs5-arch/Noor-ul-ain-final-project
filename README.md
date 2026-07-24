# PrepIQ — AI Study Companion

> Turn your study notes, lecture slides, and textbook summaries into instant, interactive quizzes.

---

## 🚀 Live Demo

🔗 **Live Application URL:**  https://prepiq-ai-study-quiz-ouf2.bolt.host/

## 📌 Problem & Solution

### **The Problem:**
Students and self-learners often struggle with active recall when reviewing long lecture notes, textbook chapters, or slides. Passively re-reading notes is inefficient and leads to low retention. However, manually creating custom quiz questions and flashcards is time-consuming.

### **The Solution:**
**PrepIQ** solves this by leveraging AI to generate instant, tailored multiple-choice quizzes directly from pasted study material. It provides real-time scoring, detailed answer explanations, and an AI tutor on standby to answer follow-up questions—helping students test their understanding efficiently.

---

## ✨ Features List

* 📝 **Instant Quiz Generation:** Paste lecture notes, text summaries, or slides to instantly generate customized multiple-choice questions.
* 🎯 **Custom Difficulty Levels:** Option to adjust quiz difficulty and question count according to your prep needs.
* ⚡ **Instant Automated Scoring:** Get immediate feedback on quiz submissions with calculated test scores.
* 💡 **Detailed Answer Explanations:** Comprehensive explanations provided for every correct and incorrect answer choice.
* 🤖 **AI Tutor on Standby:** Interactive chat assistant to clear up confusing concepts or explain specific question topics further.
* 🔑 **Custom API Key Integration:** Supports custom Gemini / LLM API key input directly in the UI for personal usage.
* 🌙 **Dark / Light Mode:** Built-in theme switcher for comfortable late-night studying.

---

## 🤖 The AI Feature & System Prompt

### **What the AI Feature Does:**
The AI core parses user-submitted study materials, extracts key concepts, and converts them into structured JSON containing multiple-choice questions, options, correct answers, and detailed explanations. It also acts as an embedded AI Tutor to answer student follow-up questions based on the provided material.

### **System Prompt / Instructions Used:**

```text
You are PrepIQ, an expert AI Study Assistant and Tutor.

Your core responsibility is to transform educational material provided by the user (lecture notes, textbook excerpts, slides) into engaging, pedagogical multiple-choice quizzes, and assist students with detailed explanations.

Strict Rules:
1. Parse the provided study material and extract core concepts.
2. Generate structured multiple-choice questions containing:
   - Clear question stems.
   - 4 distinct answer options (1 correct answer, 3 plausible distractors).
   - Detailed step-by-step explanations for why the correct answer is right and why others are wrong.
3. Match the requested difficulty level (Easy, Medium, Hard).
4. Maintain an encouraging, educational tone suitable for a high-performing study tutor.
5. If requested, act as a chat assistant to answer follow-up questions related strictly to the study material provided.
