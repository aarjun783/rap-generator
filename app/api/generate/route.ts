export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

type FormType = "Rap" | "Poem" | "Short Story";

function buildPrompt(form: FormType, language: string, prompter: string, creative: string) {
  switch (form) {
    case "Poem":
      return `
You are a multilingual poet. Write a poem in ${language}.
Prompt: ${prompter}.
Creative Preferences: ${creative}.
Length: 12–24 lines.
Focus on imagery, emotion and rhythm.
Output only the poem.
`;

    case "Short Story":
      return `
You are a multilingual fiction writer. Write a short story in ${language}.
Prompt: ${prompter}.
Creative Preferences: ${creative}.
Length: about 400–800 words.
Use clear narrative structure (beginning, middle, end) with character and setting.
Output only the story.
`;

    case "Rap":
    default:
      return `
You are a multilingual rap songwriter. Write a rap verse in ${language}.
Prompt: ${prompter}.
Creative Preferences: ${creative}.
Length: 16–24 bars.
Focus on rhyme, flow, rhythm and punchlines.
Output only the lyrics.
`;
  }
}

export async function POST(req: Request) {
  try {
    const { language, prompter, creativeSummary, form } = await req.json();

    const formType: FormType = form || "Rap";

    const prompt = buildPrompt(formType, language, prompter,creativeSummary);

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
