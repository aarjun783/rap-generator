console.log("SERVER ENV TEST:", process.env.GROQ_API_KEY);

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { language, theme, style } = await req.json();

    const prompt = `
You are a multilingual rap songwriter. Generate a rap in ${language}.
Theme: ${theme}
Style: ${style}.
Length: 16–24 bars.
Use rhyme, flow, rhythm, and punchlines.
Output ONLY the lyrics.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // free, fast, multilingual
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    return NextResponse.json({
      lyric: completion.choices[0].message.content ?? "",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Rap generation failed" },
      { status: 500 }
    );
  }
}
