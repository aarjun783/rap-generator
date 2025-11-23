"use client";

import { useEffect, useState } from "react";

type Idea = {
  id: string;
  title: string;
  language: string;
  lyric: string;
  createdAt: number;
};

export default function LibraryPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    const saved: Idea[] = JSON.parse(localStorage.getItem("ideas") || "[]");
    setIdeas(saved);
  }, []);

  function deleteIdea(id: string) {
    const updated = ideas.filter((r) => r.id !== id);
    setIdeas(updated);
    localStorage.setItem("ideas", JSON.stringify(updated));
  }

  return (
    <div className="p-6 min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Your Saved Ideas</h1>

        <a
          href="/"
          className="bg-zinc-800 px-3 py-1 rounded text-sm hover:bg-zinc-700"
        >
          Back to Home
        </a>
      </div>

      {ideas.length === 0 && (
        <p className="text-zinc-500 text-sm">No pieces saved yet.</p>
      )}

      <div className="grid gap-4">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="p-4 bg-zinc-900 border border-zinc-800 rounded"
          >
            <a
              href={`/editor/${idea.id}`}
              className="text-lg block hover:text-white"
            >
              {idea.title}
            </a>
            <p className="text-xs text-zinc-500">{idea.language}</p>

            <button
              onClick={() => deleteIdea(idea.id)}
              className="mt-2 bg-red-600 px-3 py-1 rounded text-xs"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
