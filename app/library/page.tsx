"use client";

import { useEffect, useState } from "react";

type Rap = {
  id: string;
  title: string;
  language: string;
  lyric: string;
  createdAt: number;
};

export default function LibraryPage() {
  const [raps, setRaps] = useState<Rap[]>([]);

  useEffect(() => {
    const saved: Rap[] = JSON.parse(localStorage.getItem("raps") || "[]");
    setRaps(saved);
  }, []);

  function deleteRap(id: string) {
    const updated = raps.filter((r) => r.id !== id);
    setRaps(updated);
    localStorage.setItem("raps", JSON.stringify(updated));
  }

  return (
    <div className="p-6 min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Your Saved Raps</h1>

        <a
          href="/"
          className="bg-zinc-800 px-3 py-1 rounded text-sm hover:bg-zinc-700"
        >
          Back to Home
        </a>
      </div>

      {raps.length === 0 && (
        <p className="text-zinc-500 text-sm">No raps saved yet.</p>
      )}

      <div className="grid gap-4">
        {raps.map((rap) => (
          <div
            key={rap.id}
            className="p-4 bg-zinc-900 border border-zinc-800 rounded"
          >
            <a
              href={`/editor/${rap.id}`}
              className="text-lg block hover:text-white"
            >
              {rap.title}
            </a>
            <p className="text-xs text-zinc-500">{rap.language}</p>

            <button
              onClick={() => deleteRap(rap.id)}
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
