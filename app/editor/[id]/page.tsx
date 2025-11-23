"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Idea = {
  id: string;
  title: string;
  lyric: string;
  language: string;
  createdAt: number;
};

export default function EditorPage() {
  // ✔ Correct way in Next.js 15 client components
  const params = useParams();
  const id = params.id as string;

  const [idea, setIdea] = useState<Idea | null>(null);

  useEffect(() => {
    const saved: Idea[] = JSON.parse(localStorage.getItem("ideas") || "[]");
    const found = saved.find((i) => i.id === id) || null;
    setIdea(found);
  }, [id]);

  function updateLyric(newText: string) {
    if (!idea) return;

    const updated: Idea = { ...idea, lyric: newText };
    setIdea(updated);

    const all: Idea[] = JSON.parse(localStorage.getItem("ideas") || "[]");
    const updatedList = all.map((i) => (i.id === id ? updated : i));
    localStorage.setItem("raps", JSON.stringify(updatedList));
  }

  function deleteIdea() {
    const all: Idea[] = JSON.parse(localStorage.getItem("ideas") || "[]");
    const updated = all.filter((i) => i.id !== id);
    localStorage.setItem("raps", JSON.stringify(updated));

    window.location.href = "/library";
  }

  if (!idea) {
    return <div className="p-6 text-zinc-100">Idea not found.</div>;
  }

  return (
    <div className="p-6 bg-zinc-950 min-h-screen text-zinc-100">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">{idea.title}</h1>

        <button
          onClick={deleteIdea}
          className="bg-red-600 px-3 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>

      <textarea
        className="w-full h-[500px] bg-zinc-900 border border-zinc-800 p-3 rounded font-mono mt-4"
        value={idea.lyric}
        onChange={(e) => updateLyric(e.target.value)}
      />

      <a href="/library" className="block mt-4 underline text-sm">
        Back to Library
      </a>
    </div>
  );
}
