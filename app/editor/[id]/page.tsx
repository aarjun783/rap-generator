"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Rap = {
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

  const [rap, setRap] = useState<Rap | null>(null);

  useEffect(() => {
    const saved: Rap[] = JSON.parse(localStorage.getItem("raps") || "[]");
    const found = saved.find((r) => r.id === id) || null;
    setRap(found);
  }, [id]);

  function updateLyric(newText: string) {
    if (!rap) return;

    const updated: Rap = { ...rap, lyric: newText };
    setRap(updated);

    const all: Rap[] = JSON.parse(localStorage.getItem("raps") || "[]");
    const updatedList = all.map((r) => (r.id === id ? updated : r));
    localStorage.setItem("raps", JSON.stringify(updatedList));
  }

  function deleteRap() {
    const all: Rap[] = JSON.parse(localStorage.getItem("raps") || "[]");
    const updated = all.filter((r) => r.id !== id);
    localStorage.setItem("raps", JSON.stringify(updated));

    window.location.href = "/library";
  }

  if (!rap) {
    return <div className="p-6 text-zinc-100">Rap not found.</div>;
  }

  return (
    <div className="p-6 bg-zinc-950 min-h-screen text-zinc-100">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">{rap.title}</h1>

        <button
          onClick={deleteRap}
          className="bg-red-600 px-3 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>

      <textarea
        className="w-full h-[500px] bg-zinc-900 border border-zinc-800 p-3 rounded font-mono mt-4"
        value={rap.lyric}
        onChange={(e) => updateLyric(e.target.value)}
      />

      <a href="/library" className="block mt-4 underline text-sm">
        Back to Library
      </a>
    </div>
  );
}
