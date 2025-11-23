"use client";

import { useState } from "react";

import {
  CreativeRapControls,
  CreativePoemControls,
  CreativeStoryControls,
  summarizeRapSettings,
  summarizePoemSettings,
  summarizeStorySettings,
  RapSettings,
  PoemSettings,
  StorySettings
} from "@/app/components/creative";

type WritingItem = {
  id: string;
  title: string;
  lyric: string;
  language: string;
  form: string;
  createdAt: number;
};

type FormType = "Rap" | "Poem" | "Short Story" | "Haiku";

export default function HomePage() {
  const [form, setForm] = useState<FormType>("Rap");
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("Hustle and ambition");
  const [style, setStyle] = useState("Old-school boom bap");
  const [lyric, setLyric] = useState("");

  const [instruction, setInstruction] = useState("");

  // --- mode-specific creative settings ---
  const [rapSettings, setRapSettings] = useState<RapSettings>({
    flow: 50,
    tempo: 50,
    emotion: 50,
    complexity: 50,
  });

  const [poemSettings, setPoemSettings] = useState<PoemSettings>({
    imagery: 50,
    emotion: 50,
    rhythm: 50,
    metaphorDensity: 50,
  });

  const [storySettings, setStorySettings] = useState<StorySettings>({
    pacing: 50,
    tension: 50,
    detail: 50,
    dialogue: 50,
  });

  const [loading, setLoading] = useState(false);

  function buildCreativeSummary() {
    switch (form) {
      case "Rap":
        return summarizeRapSettings(rapSettings);
      case "Poem":
        return summarizePoemSettings(poemSettings);
      case "Short Story":
        return summarizeStorySettings(storySettings);
      default:
        return "";
    }
  }

  // --- generate new piece ---
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

  // --- save piece ---
  function savePiece() {
    if (!lyric) return alert("Generate something first!");

    const title = prompt("Enter a title:");
    if (!title) return;

    const newItem: WritingItem = {
      id: crypto.randomUUID(),
      title,
      lyric,
      language,
      form,
      createdAt: Date.now(),
    };

    const existing: WritingItem[] = JSON.parse(
      localStorage.getItem("raps") || "[]"
    );
    existing.push(newItem);
    localStorage.setItem("raps", JSON.stringify(existing));

    alert("Saved!");
  }

  // --- romanise ---
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

  // --- apply creative edit ---
  async function applyEdit() {
    if (!lyric) return alert("Generate something first!");

    const creative = buildCreativeSummary();

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
        form,
      }),
    });

    const data = await res.json();
    if (data.edited) setLyric(data.edited);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 flex justify-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-semibold mb-2">Multilingual Writing Lab</h1>
        <p className="text-sm text-zinc-400 mb-6">
          Generate rap, poems, and short stories — then reshape them with
          creative controls.
        </p>

        {/* GENERATE FORM */}
        <form
          onSubmit={generatePiece}
          className="space-y-4 border border-zinc-800 p-4 rounded-lg mb-6"
        >
          <div className="grid md:grid-cols-4 gap-4">
            {/* FORM SELECT */}
            <div>
              <label className="text-xs text-zinc-400">Form</label>
              <select
                value={form}
                onChange={(e) => setForm(e.target.value as FormType)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-sm"
              >
                <option>Rap</option>
                <option>Poem</option>
                <option>Short Story</option>
                <option>Haiku</option>
              </select>
            </div>

            {/* LANGUAGE */}
            <div>
              <label className="text-xs text-zinc-400">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-sm"
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
                ].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* THEME */}
            <div>
              <label className="text-xs text-zinc-400">Theme</label>
              <input
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-sm"
              />
            </div>

            {/* STYLE */}
            <div>
              <label className="text-xs text-zinc-400">Style / Tone</label>
              <input
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-zinc-100 text-zinc-900 px-4 py-2 rounded text-sm hover:bg-white disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>

          <a href="/library" className="ml-4 underline text-sm">
            View Saved Items
          </a>
        </form>

        {/* CREATIVE CONTROLS */}
        <div className="border border-zinc-800 p-4 rounded-lg mb-6 space-y-6">
          <h2 className="text-xl font-semibold">Creative Controls</h2>
          <p className="text-xs text-zinc-500 mb-4">
            Adjust stylistic elements depending on the writing form.
          </p>

          {form === "Rap" && (
            <CreativeRapControls
              settings={rapSettings}
              setSettings={setRapSettings}
            />
          )}

          {form === "Poem" && (
            <CreativePoemControls
              settings={poemSettings}
              setSettings={setPoemSettings}
            />
          )}

          {form === "Short Story" && (
            <CreativeStoryControls
              settings={storySettings}
              setSettings={setStorySettings}
            />
          )}

          {/* EDIT INSTRUCTION */}
          <div className="pt-4">
            <label className="text-xs text-zinc-400 block mb-1">
              Edit Instruction (optional)
            </label>
            <input
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g., Add tension, increase imagery, make rhyme tighter..."
              className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-sm"
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
            <p className="text-sm text-zinc-500">
              Your {form.toLowerCase()} will appear here after generation.
            </p>
          ) : (
            <>
              <pre className="whitespace-pre-wrap font-mono text-sm mb-4">
                {lyric}
              </pre>

              <div className="flex gap-3">
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
