"use client";

export type PoemSettings = {
  imagery: number;
  emotion: number;
  rhythm: number;
  metaphorDensity: number;
};

type Props = {
  settings: PoemSettings;
  setSettings: (s: PoemSettings) => void;
};

export function CreativePoemControls({ settings, setSettings }: Props) {
  const update = (k: keyof PoemSettings, v: number) =>
    setSettings({ ...settings, [k]: v });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Poem Creative Controls</h2>

      <div>
        <label className="text-xs text-zinc-400 block mb-1">
          Imagery (Sparse ↔ Vivid)
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={settings.imagery}
          onChange={(e) => update("imagery", Number(e.target.value))}
        />
      </div>

      <div>
        <label className="text-xs text-zinc-400 block mb-1">
          Emotion (Quiet ↔ Intense)
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
          Rhythm (Free Verse ↔ Structured)
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={settings.rhythm}
          onChange={(e) => update("rhythm", Number(e.target.value))}
        />
      </div>

      <div>
        <label className="text-xs text-zinc-400 block mb-1">
          Metaphor Density (Literal ↔ Symbolic)
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={settings.metaphorDensity}
          onChange={(e) =>
            update("metaphorDensity", Number(e.target.value))
          }
        />
      </div>
    </div>
  );
}

export function summarizePoemSettings(s: PoemSettings) {
  return `
Imagery: ${s.imagery < 40 ? "sparse" : s.imagery > 60 ? "vivid" : "moderate"}
Emotion: ${s.emotion < 40 ? "quiet" : s.emotion > 60 ? "intense" : "neutral"}
Rhythm: ${s.rhythm < 40 ? "free verse" : s.rhythm > 60 ? "structured" : "semi-structured"}
Metaphor Density: ${
    s.metaphorDensity < 40
      ? "literal"
      : s.metaphorDensity > 60
      ? "symbolic"
      : "balanced"
  }
`;
}
