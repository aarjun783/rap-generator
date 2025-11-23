"use client";

import React from "react";

export type RapSettings = {
  flow: number;
  tempo: number;
  emotion: number;
  complexity: number;
};

type Props = {
  settings: RapSettings;
  setSettings: (s: RapSettings) => void;
};

export function CreativeRapControls({ settings, setSettings }: Props) {
  function update(key: keyof RapSettings, value: number) {
    setSettings({ ...settings, [key]: value });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Rap Creative Controls</h2>

      <div>
        <label className="text-xs text-zinc-400 block mb-1">
          Flow (Smooth ↔ Choppy)
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={settings.flow}
          onChange={(e) => update("flow", Number(e.target.value))}
        />
      </div>

      <div>
        <label className="text-xs text-zinc-400 block mb-1">
          Tempo (Slow ↔ Fast)
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={settings.tempo}
          onChange={(e) => update("tempo", Number(e.target.value))}
        />
      </div>

      <div>
        <label className="text-xs text-zinc-400 block mb-1">
          Emotion (Calm ↔ Aggressive)
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={settings.emotion}
          onChange={(e) => update("emotion", Number(e.target.value))}
        />
      </div>

      <div>
        <label className="text-xs text-zinc-400 block mb-1">
          Complexity (Simple ↔ Lyrical)
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={settings.complexity}
          onChange={(e) => update("complexity", Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export function summarizeRapSettings(s: RapSettings) {
  return `
Flow: ${s.flow < 40 ? "choppy" : s.flow > 60 ? "smooth" : "balanced"}
Tempo: ${s.tempo < 40 ? "slow" : s.tempo > 60 ? "fast" : "medium"}
Emotion: ${s.emotion < 40 ? "calm" : s.emotion > 60 ? "aggressive" : "neutral"}
Complexity: ${
    s.complexity < 40
      ? "simple rhymes"
      : s.complexity > 60
      ? "lyrical multisyllabic rhymes"
      : "medium complexity"
  }
  `;
}
