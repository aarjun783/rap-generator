"use client";

import { useState } from "react";

type Rap = {
  id: string;
  title: string;
  lyric: string;
  language: string;
  createdAt: number;
};

export default function HomePage() {
  const [language, setLanguage] = useState<string>("English");
  const [theme, setTheme] = useState<string>("Hustle and ambition");
  const [style, setStyle] = useState<string>("Old-school boom bap");
  const [lyric, setLyric] = useState<string>("");

  const [instruction, setInstruction] = useState<string>("");

  // Creative controls
  const [flow, setFlow] = useState<number>(50);
  const [tempo, setTempo] = useState<number>(50);
  const [emotion, setEmotion] = useState<number>(50);
  const [complexity, setComplexity] = useState<number>(50);

  const [loading, setLoading] = useState<boolean>(false);

  function creativeSettingsText() {
    return `
Flow: ${flow < 40 ? "choppy" : flow > 60 ? "smooth" : "balanced"}
Tempo: ${tempo < 40 ? "slow" : tempo > 60 ? "fast" : "medium"}
Emotion: ${emotion < 40 ? "calm" : emotion > 60 ? "aggressive" : "neutral"}
Complexity: ${
      complexity < 40
        ? "simple rhymes"
        : complexity > 60
        ? "lyrical multisyllabic rhymes"
        : "medium complexity"
    }
`;
  }

  // Generate rap
  async function generateRap(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setLyric("");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, theme, style }),
    });

    const data = await res.json();
    setLyric(data.lyric || "");
    setLoading(false);
  }

  // Save locally
  function saveRap() {
    if (!lyric) return alert("Generate a rap first!");

    const title = prompt("Enter a title:");
    if (!title) return;

    const newRap: Rap = {
      id: crypto.randomUUID(),
      title,
      lyric,
      language,
      createdAt: Date.now(),
    };

    const existing: Rap[] = JSON.parse(localStorage.getItem("raps") || "[]");
    existing.push(newRap);

    localStorage.setItem("raps", JSON.stringify(existing));

    alert("Rap saved!");
  }

  // Romanise
  async function romaniseRap() {
    if (!lyric) return;

    const res = await fetch("/api/romanise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lyric, language }),
    });

    const data = await res.json();
    if (data.romanised) setLyric(data.romanised);
  }

  // Apply edit (creative + instruction)
  async function applyEdit() {
    if (!lyric) return alert("Generate a rap first!");

    const creative = creativeSettingsText();

    const finalInstruction =
      instruction.trim().length > 0
        ? `${instruction}\n\nCreative preferences:\n${creative}`
        : `Apply creative preferences:\n${creative}`;

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
        <h1 className="text-3xl font-semibold mb-2">Multilingual Rap Lab</h1>
        <p className="text-sm text-zinc-400 mb-6">
          Generate, romanise, and creatively edit rap lyrics.
        </p>

        {/* Generate Section */}
        <form onSubmit={generateRap} className="space-y-4 border border-zinc-800 p-4 rounded-lg mb-6">
          <div className="grid md:grid-cols-3 gap-4">

            {/* Language */}
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Language</label>
              <select
                className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-sm"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {["English","Hindi","Tamil","Spanish","French","Punjabi","Malay","Arabic"]
                  .map((lang) => (
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
              <label className="text-xs text-zinc-400 block mb-1">Style</label>
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
            className="bg-zinc-100 text-zinc-900 px-4 py-2 rounded text-sm hover:bg-white"
          >
            {loading ? "Generating..." : "Generate Rap"}
          </button>

          <a href="/library" className="ml-4 underline text-sm">View Saved Raps</a>
        </form>

        {/* CREATIVE TOOLBAR — Always Visible */}
        <div className="border border-zinc-800 p-4 rounded-lg mb-6 space-y-6">
          <h2 className="text-lg font-semibold">Creative Controls</h2>

          {/* Flow */}
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Flow (Smooth ↔ Choppy)</label>
            <input type="range" min="0" max="100" value={flow} onChange={(e) => setFlow(Number(e.target.value))} />
          </div>

          {/* Tempo */}
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Tempo (Slow ↔ Fast)</label>
            <input type="range" min="0" max="100" value={tempo} onChange={(e) => setTempo(Number(e.target.value))} />
          </div>

          {/* Emotion */}
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Emotion (Calm ↔ Aggressive)</label>
            <input type="range" min="0" max="100" value={emotion} onChange={(e) => setEmotion(Number(e.target.value))} />
          </div>

          {/* Complexity */}
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Complexity (Simple ↔ Lyrical)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={complexity}
              onChange={(e) => setComplexity(Number(e.target.value))}
            />
          </div>

          {/* Edit Instruction */}
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Edit Instruction</label>
            <input
              className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-sm"
              placeholder="e.g., Make rhyme scheme AABB, add punchlines..."
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

        {/* OUTPUT */}
        <div className="border border-zinc-800 p-4 rounded-lg">
          {!lyric ? (
            <p className="text-sm text-zinc-500">Your rap will appear here after generation.</p>
          ) : (
            <>
              <pre className="whitespace-pre-wrap font-mono text-sm">{lyric}</pre>

              <div className="flex gap-3 mt-4">
                <button onClick={saveRap} className="bg-zinc-100 text-zinc-900 px-3 py-2 rounded text-sm">
                  Save
                </button>

                <button onClick={romaniseRap} className="bg-zinc-800 text-zinc-100 px-3 py-2 rounded text-sm">
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
