export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

type FormType = "Rap" | "Poem" | "Short Story";

function buildEditPrompt(
  form: FormType,
  lyric: string,
  instruction: string,
  language: string
) {
  const base = `
Rewrite the following piece in ${language}.

Respect the writing form: ${form}.
Follow ALL user instructions and creative preferences.

User Instructions:
${instruction}

Original Text:
${lyric}

Rewritten Text (same form, same language):
`;

  // Now add mode-specific guardrails
  switch (form) {
    case "Rap":
      return (
        base +
        `
Rap-specific rules:
- Maintain bar/line structure.
- Preserve rhyme scheme where possible.
- Keep flow consistent.
- Avoid adding a chorus unless instructed.
`
      );

    case "Poem":
      return (
        base +
        `
Poem-specific rules:
- Maintain poetic line structure.
- Preserve emotional core.
- You're allowed to improve imagery, rhythm, metaphor depth.
`
      );

    case "Short Story":
      return (
        base +
        `
Story-specific rules:
- Maintain narrative structure (beginning, middle, end).
- Preserve characters, setting, and plot unless told otherwise.
- Improve pacing, tension, detail as requested.
- Do NOT turn it into a poem.
`
      );

    default:
      return base;
  }
}

export async function POST(req: Request) {
  try {
    const { lyric, instruction, language, form } = await req.json();

    const prompt = buildEditPrompt(form, lyric, instruction, language);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // or whichever Groq model you're using
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const edited = completion.choices[0].message.content;

    return NextResponse.json({ edited });
  } catch (err) {
    console.error("Edit error:", err);
    return NextResponse.json(
      { error: "Editing failed" },
      { status: 500 }
    );
  }
}
