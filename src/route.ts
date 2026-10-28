import { WIDTH } from "./actors.ts";

/**
 * The whole level progression as data. To retune difficulty, add a sector, or
 * move a wave, edit this table; the play scene only interprets it.
 */
// Wave timing ("at") is in seconds after the sector begins; x is a fraction
// of the screen width. Formations: line, vee, column, pincer.
export const SECTORS = [
  {
    name: "Outer Drift",
    subtitle: "Scouts ahead",
    seconds: 26,
    waves: [
      { at: 1, kind: "drone", count: 4, formation: "line", x: 0.5 },
      { at: 6, kind: "drone", count: 5, formation: "vee", x: 0.35 },
      { at: 11, kind: "drone", count: 5, formation: "vee", x: 0.65 },
      { at: 16, kind: "drone", count: 6, formation: "line", x: 0.5 },
      { at: 20, kind: "drone", count: 4, formation: "column", x: 0.25 },
      { at: 21, kind: "drone", count: 4, formation: "column", x: 0.75 },
    ],
  },
  {
    name: "Shatter Belt",
    subtitle: "Divers incoming",
    seconds: 30,
    waves: [
      { at: 1, kind: "drone", count: 6, formation: "vee", x: 0.5 },
      { at: 5, kind: "dart", count: 4, formation: "line", x: 0.5 },
      { at: 10, kind: "dart", count: 5, formation: "column", x: 0.3 },
      { at: 12, kind: "dart", count: 5, formation: "column", x: 0.7 },
      { at: 17, kind: "drone", count: 7, formation: "line", x: 0.5 },
      { at: 19, kind: "dart", count: 5, formation: "vee", x: 0.5 },
      { at: 24, kind: "dart", count: 6, formation: "line", x: 0.5 },
    ],
  },
  {
    name: "Gun Lanes",
    subtitle: "Turrets online",
    seconds: 32,
    waves: [
      { at: 1, kind: "turret", count: 1, formation: "line", x: 0.5 },
      { at: 4, kind: "drone", count: 6, formation: "vee", x: 0.5 },
      { at: 9, kind: "turret", count: 2, formation: "line", x: 0.5 },
      { at: 14, kind: "dart", count: 6, formation: "column", x: 0.5 },
      { at: 18, kind: "turret", count: 2, formation: "line", x: 0.5 },
      { at: 19, kind: "drone", count: 6, formation: "line", x: 0.5 },
      { at: 25, kind: "turret", count: 3, formation: "line", x: 0.5 },
    ],
  },
  {
    name: "Lancer Gate",
    subtitle: "Crossfire",
    seconds: 32,
    waves: [
      { at: 1, kind: "lancer", count: 4, formation: "pincer" },
      { at: 6, kind: "dart", count: 6, formation: "vee", x: 0.5 },
      { at: 10, kind: "lancer", count: 6, formation: "pincer" },
      { at: 13, kind: "turret", count: 2, formation: "line", x: 0.5 },
      { at: 19, kind: "lancer", count: 6, formation: "pincer" },
      { at: 21, kind: "drone", count: 8, formation: "vee", x: 0.5 },
      { at: 26, kind: "dart", count: 8, formation: "line", x: 0.5 },
    ],
  },
  {
    name: "Last Approach",
    subtitle: "Everything they have",
    seconds: 34,
    waves: [
      { at: 1, kind: "turret", count: 3, formation: "line", x: 0.5 },
      { at: 3, kind: "lancer", count: 6, formation: "pincer" },
      { at: 9, kind: "dart", count: 6, formation: "column", x: 0.25 },
      { at: 9, kind: "dart", count: 6, formation: "column", x: 0.75 },
      { at: 15, kind: "drone", count: 9, formation: "vee", x: 0.5 },
      { at: 17, kind: "turret", count: 2, formation: "line", x: 0.5 },
      { at: 22, kind: "lancer", count: 8, formation: "pincer" },
      { at: 26, kind: "dart", count: 8, formation: "vee", x: 0.5 },
    ],
  },
];

export const BOSS_NAME = "The Warden";

/** Expands a wave's formation into individual spawns. */
export function layout(wave) {
  const center = (wave.x ?? 0.5) * WIDTH;
  return Array.from({ length: wave.count }, (_, i) => {
    const offset = i - (wave.count - 1) / 2;
    const side = i % 2 === 0 ? 1 : -1;
    switch (wave.formation) {
      case "line":
        return { delay: 0, x: center + offset * 64, y: -30, side };
      case "vee":
        return {
          delay: Math.abs(offset) * 10,
          x: center + offset * 44,
          y: -30,
          side,
        };
      case "column":
        return { delay: i * 24, x: center, y: -30, side };
      case "pincer":
        return {
          delay: Math.floor(i / 2) * 30,
          x: side > 0 ? -30 : WIDTH + 30,
          y: 70 + Math.floor(i / 2) * 50,
          side,
        };
    }
  });
}
