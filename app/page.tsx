"use client";

import { useState } from "react";

type Rap = {
  id: string;
  title: string;
  lyric: string;
  language: string;
  createdAt: number;
};

type FormType = "Rap" | "Poem" | "Short Story" | "Haiku";

export default function HomePage() {
  const [form, setForm] = useState<FormType>("Rap");
  const [language, setLanguage] = useState<string>("English");
  const [theme, setTheme] = useState<string>("Hustle and ambition");
  const [style, setStyle] = useState<string>("Old-school boom bap");
  const [lyric, setLyric] = useState<string>("");

  const [instruction, setInstruction] = useState<string>("");

  // creative sliders
  const [flow, setFlow] = useState<number>(50);
  const [tempo, setTempo] = useState<number>(50);
  const [emotion, setEmotion] = useState<number>(50);
  const [complexity, setComplexity] = useState<number>(50);

  const [loading, setLoading] = useState<boolean>(false);

  function creativeSettingsText() {
    return `
Form: ${form}
Flow: ${flow < 40 ? "choppy" : flow > 60 ? "smooth" : "balanced"}
Tempo: ${tempo < 40 ? "slow" : tempo > 60 ? "fast" : "medium"}
Emotion: ${emotion < 40 ? "calm" : emotion > 60 ? "aggressive" : "neutral"}
Complexity: ${
      complexity < 40
        ? "simple language"
        : complexity > 60
        ? "rich, layered language"
        : "medium complexity"
    }
`;
  }

  // Generate piece
  async function generatePiece(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setLyric("");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, theme, style, form }),
    });

    const data = await res.json();
    setLyric(data.lyric || "");
    setLoading(false);
  }

  // Save locally
  function savePiece() {
    if (!lyric) return alert("Generate something first!");

    const title = prompt("Enter a title:");
    if (!title) return;

    const newItem: Rap = {
      id: crypto.randomUUID(),
      title,
      lyric,
      language,
      createdAt: Date.now(),
    };

    const existing: Rap[] = JSON.parse(localStorage.getItem("raps") || "[]");
    existing.push(newItem);
    localStorage.setItem("raps", JSON.stringify(existing));

    alert("Saved!");
  }

  // Romanise (still works generically)
  async function romaniseText() {
    if (!lyric) return;

    const res = await fetch("/api/romanise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lyric, language }),
    });

    const data = await res.json();
    if (data.romanised) setLyric(data.romanised);
  }

  // Apply edit (creative + user instruction)
  async function applyEdit() {
    if (!lyric) return alert("Generate something first!");

    const creative = creativeSettingsText();

    const finalInstruction =
      instruction.trim().length > 0
        ? `${instruction}\n\nCreative preferences:\n${creative}`
        : `Apply these creative preferences:\n${creative}`;

    const res = await fetch("/api/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lyric,
        instruction: finalInstruction,
        language,
      }),
    });

    const data = await res.json();
    if (data.edited) setLyric(data.edited);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 flex justify-center">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <h1 className="text-3xl font-semibold mb-2">Multilingual Writing Lab</h1>
        <p className="text-sm text-zinc-400 mb-6">
          Generate rap, poems, short stories and haikus. Then refine with creative controls.
        </p>

        {/* Generate Form */}
        <form
          onSubmit={generatePiece}
          className="space-y-4 border border-zinc-800 p-4 rounded-lg mb-6"
        >
          <div className="grid md:grid-cols-4 gap-4">
            {/* Form type */}
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Form</label>
              <select
                className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-sm"
                value={form}
                onChange={(e) => setForm(e.target.value as FormType)}
              >
                <option value="Rap">Rap</option>
                <option value="Poem">Poem</option>
                <option value="Short Story">Short Story</option>
                <option value="Haiku">Haiku</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Language</label>
              <select
                className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-sm"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {[
                  "English",
                  "Hindi",
                  "Tamil",
                  "Spanish",
                  "French",
                  "Punjabi",
                  "Malay",
                  "Arabic",
                ].map((lang) => (
                  <option key={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Theme */}
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Theme</label>
              <input
                className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-sm"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              />
            </div>

            {/* Style */}
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Style / Tone</label>
              <input
                className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-sm"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-zinc-100 text-zinc-900 px-4 py-2 rounded text-sm hover:bg-white disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate"}
          </button>

          <a href="/library" className="ml-4 underline text-sm">
            View Saved Pieces
          </a>
        </form>

        {/* Creative Toolbar (always visible) */}
        <div className="border border-zinc-800 p-4 rounded-lg mb-6 space-y-6">
          <h2 className="text-lg font-semibold">Creative Controls</h2>

          <div>
            <label className="text-xs text-zinc-400 block mb-1">
              Flow (Smooth ↔ Choppy)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={flow}
              onChange={(e) => setFlow(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1">
              Tempo (Slow ↔ Fast)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1">
              Emotion (Calm ↔ Aggressive)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={emotion}
              onChange={(e) => setEmotion(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1">
              Complexity (Simple ↔ Rich & Lyrical)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={complexity}
              onChange={(e) => setComplexity(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1">
              Edit Instruction
            </label>
            <input
              className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-sm"
              placeholder="e.g., Make it more atmospheric, add imagery, tighten ending..."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
            />

            <button
              onClick={applyEdit}
              className="mt-3 bg-zinc-800 text-zinc-100 px-3 py-2 rounded text-sm"
            >
              Apply Creative Edit
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="border border-zinc-800 p-4 rounded-lg">
          {!lyric ? (
            <p className="text-sm text-zinc-500">
              Your {form.toLowerCase()} will appear here after generation.
            </p>
          ) : (
            <>
              <pre className="whitespace-pre-wrap font-mono text-sm">{lyric}</pre>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={savePiece}
                  className="bg-zinc-100 text-zinc-900 px-3 py-2 rounded text-sm"
                >
                  Save
                </button>

                <button
                  onClick={romaniseText}
                  className="bg-zinc-800 text-zinc-100 px-3 py-2 rounded text-sm"
                >
                  Romanise
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
