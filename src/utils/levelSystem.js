export const MAX_LEVEL = 10;

export const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0 },
  { level: 2, xp: 100 },
  { level: 3, xp: 250 },
  { level: 4, xp: 450 },
  { level: 5, xp: 700 },
  { level: 6, xp: 1000 },
  { level: 7, xp: 1350 },
  { level: 8, xp: 1750 },
  { level: 9, xp: 2200 },
  { level: 10, xp: 2700 },
];

export function getLevelFromXp(totalXp) {
  const safeXp = Math.max(0, Number(totalXp) || 0);
  let currentLevel = 1;
  for (const entry of LEVEL_THRESHOLDS) {
    if (safeXp >= entry.xp) {
      currentLevel = entry.level;
    } else {
      break;
    }
  }
  return currentLevel;
}

export function getLevelInfo(totalXp) {
  const safeXp = Math.max(0, Number(totalXp) || 0);
  const level = getLevelFromXp(safeXp);
  const isMaxLevel = level >= MAX_LEVEL;

  const currentEntry = LEVEL_THRESHOLDS[level - 1];
  const nextEntry = isMaxLevel ? null : LEVEL_THRESHOLDS[level];

  const currentThreshold = currentEntry.xp;
  const nextThreshold = nextEntry ? nextEntry.xp : currentEntry.xp;
  const span = nextEntry ? nextThreshold - currentThreshold : 0;
  const xpIntoLevel = safeXp - currentThreshold;
  const xpRemaining = nextEntry ? Math.max(0, nextThreshold - safeXp) : 0;
  const progressPercent = isMaxLevel
    ? 100
    : Math.min(100, Math.max(0, Math.round((xpIntoLevel / span) * 100)));

  return {
    level,
    isMaxLevel,
    totalXp: safeXp,
    currentThreshold,
    nextLevel: nextEntry ? nextEntry.level : null,
    nextThreshold,
    xpIntoLevel,
    xpRemaining,
    progressPercent,
  };
}
