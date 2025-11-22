export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { lyric, instruction, language } = await req.json();

    const prompt = `
You are a rap editor and writing assistant.
Apply the following edit instruction to the rap WITHOUT changing meaning (unless requested).

Language: ${language}
Instruction: ${instruction}

Rewrite the rap while keeping flow, rhyme, and rhythm strong.

Original:
${lyric}

Rewrite:
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    return NextResponse.json({
      edited: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Edit failed" }, { status: 500 });
  }
}
