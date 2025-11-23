"use client";

export type StorySettings = {
  pacing: number;
  tension: number;
  detail: number;
  dialogue: number;
};

type Props = {
  settings: StorySettings;
  setSettings: (s: StorySettings) => void;
};

export function CreativeStoryControls({ settings, setSettings }: Props) {
  const update = (k: keyof StorySettings, v: number) =>
    setSettings({ ...settings, [k]: v });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Short Story Creative Controls</h2>

      <div>
        <label className="text-xs text-zinc-400 block mb-1">
          Pacing (Slow ↔ Fast)
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={settings.pacing}
          onChange={(e) => update("pacing", Number(e.target.value))}
        />
      </div>

      <div>
        <label className="text-xs text-zinc-400 block mb-1">
          Tension (Low ↔ High)
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={settings.tension}
          onChange={(e) => update("tension", Number(e.target.value))}
        />
      </div>

      <div>
        <label className="text-xs text-zinc-400 block mb-1">
          Detail (Minimal ↔ Descriptive)
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={settings.detail}
          onChange={(e) => update("detail", Number(e.target.value))}
        />
      </div>

      <div>
        <label className="text-xs text-zinc-400 block mb-1">
          Dialogue (None ↔ Heavy)
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={settings.dialogue}
          onChange={(e) => update("dialogue", Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export function summarizeStorySettings(s: StorySettings) {
  return `
Pacing: ${s.pacing < 40 ? "slow" : s.pacing > 60 ? "fast" : "medium"}
Tension: ${s.tension < 40 ? "low" : s.tension > 60 ? "high" : "moderate"}
Detail: ${s.detail < 40 ? "minimal" : s.detail > 60 ? "descriptive" : "balanced"}
Dialogue: ${s.dialogue < 40 ? "minimal" : s.dialogue > 60 ? "heavy" : "moderate"}
`;
}
