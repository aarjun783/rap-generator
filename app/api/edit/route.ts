export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

type FormType = "Rap" | "Poem" | "Short Story" | "Haiku";

function buildPrompt(form: FormType, language: string, theme: string, style: string) {
  switch (form) {
    case "Poem":
      return `
You are a multilingual poet. Write a poem in ${language}.
Theme: ${theme}
Style / tone: ${style}.
Length: 12–24 lines.
Focus on imagery, emotion and rhythm.
Output only the poem.
`;

    case "Short Story":
      return `
You are a multilingual fiction writer. Write a short story in ${language}.
Theme: ${theme}
Style / tone: ${style}.
Length: about 400–800 words.
Use clear narrative structure (beginning, middle, end) with character and setting.
Output only the story.
`;

    case "Haiku":
      return `
You are a multilingual poet. Write a haiku in ${language}.
Theme: ${theme}
Style / tone: ${style}.
Use traditional haiku spirit (nature / moment / insight).
If the language does not naturally follow 5-7-5 syllables, prioritise natural flow over strict syllable count.
Output only the haiku (3 short lines).
`;

    case "Rap":
    default:
      return `
You are a multilingual rap songwriter. Write a rap verse in ${language}.
Theme: ${theme}
Style / vibe: ${style}.
Length: 16–24 bars.
Focus on rhyme, flow, rhythm and punchlines.
Output only the lyrics.
`;
  }
}

export async function POST(req: Request) {
  try {
    const { language, theme, style, form } = await req.json();

    const formType: FormType = form || "Rap";

    const prompt = buildPrompt(formType, language, theme, style);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // or your existing model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    return NextResponse.json({
      lyric: completion.choices[0].message.content ?? "",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}
