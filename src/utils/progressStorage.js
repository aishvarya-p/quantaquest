import { getSession } from './authStorage.js';
import { getLevelFromXp } from './levelSystem.js';

const PROGRESS_KEY_PREFIX = 'quantaquest_progress_';
const LEGACY_PROGRESS_KEY = 'quantaquest_progress_v1';

export const BADGE_DEFINITIONS = [
  {
    id: 'prime_hunter',
    name: 'Prime Hunter',
    hint: 'Solve 1 Math Challenge',
    icon: 'bolt',
    cardClasses: 'bg-realm-challenge-soft border-realm-challenge',
    circleClasses: 'bg-realm-challenge text-on-realm-challenge',
    textClasses: 'text-on-realm-challenge-soft',
  },
  {
    id: 'spark_streak',
    name: 'Spark Streak',
    hint: 'Get a 3+ Tables streak',
    icon: 'local_fire_department',
    cardClasses: 'bg-realm-tables-soft border-realm-tables',
    circleClasses: 'bg-realm-tables text-on-realm-tables',
    textClasses: 'text-on-realm-tables-soft',
  },
  {
    id: 'shape_tamer',
    name: 'Shape Tamer',
    hint: 'Explore all 6 shapes',
    icon: 'change_history',
    cardClasses: 'bg-realm-geometry-soft border-realm-geometry',
    circleClasses: 'bg-realm-geometry text-on-realm-geometry',
    textClasses: 'text-on-realm-geometry-soft',
  },
  {
    id: 'table_titan',
    name: 'Table Titan',
    hint: 'Solve 5 Tables facts',
    icon: 'grid_on',
    cardClasses: 'bg-realm-calculator-soft border-realm-calculator',
    circleClasses: 'bg-realm-calculator text-on-realm-calculator',
    textClasses: 'text-on-realm-calculator-soft',
  },
];

export function createFreshProgress() {
  return {
    level: 1,
    totalXp: 0,
    streakDays: 0,
    lastActiveDate: null,
    currentStreak: 0,
    bestStreak: 0,
    challengesCompleted: 0,
    challengeCorrect: 0,
    challengeAttempted: 0,
    lastChallengeXp: 0,
    tablesAttempted: 0,
    tablesCorrect: 0,
    tablesCurrentStreak: 0,
    tablesBestStreak: 0,
    tablesXpEarned: 0,
    selectedTable: 2,
    exploredShapes: [],
    selectedShape: 'square',
    shapeQuizAttempted: 0,
    shapeQuizCorrect: 0,
    shapeXpEarned: 0,
    badges: [],
    unlockedThemes: ['atlas'],
    selectedTheme: 'atlas',
  };
}

function getStorageKey(studentId) {
  const resolvedId = studentId || getSession()?.studentId;
  if (!resolvedId) return null;
  return `${PROGRESS_KEY_PREFIX}${resolvedId}`;
}

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayDateString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function updateDailyStreak(progress) {
  const today = getTodayDateString();
  if (progress.lastActiveDate === today) {
    return progress;
  }
  const yesterday = getYesterdayDateString();
  const nextStreakDays = progress.lastActiveDate === yesterday ? progress.streakDays + 1 : 1;
  return {
    ...progress,
    streakDays: nextStreakDays,
    lastActiveDate: today,
  };
}

function evaluateUnlocks(progress) {
  const badges = new Set(Array.isArray(progress.badges) ? progress.badges : []);
  if (progress.challengeCorrect >= 1) {
    badges.add('prime_hunter');
  }
  if (progress.tablesBestStreak >= 3) {
    badges.add('spark_streak');
  }
  if (progress.exploredShapes.length >= 6) {
    badges.add('shape_tamer');
  }
  if (progress.tablesCorrect >= 5) {
    badges.add('table_titan');
  }

  const themes = new Set(Array.isArray(progress.unlockedThemes) ? progress.unlockedThemes : ['atlas']);
  themes.add('atlas');
  if (progress.totalXp >= 50) {
    themes.add('ocean');
  }

  return {
    ...progress,
    level: getLevelFromXp(progress.totalXp),
    badges: [...badges],
    unlockedThemes: [...themes],
  };
}

function writeProgress(studentId, progress) {
  const key = getStorageKey(studentId);
  if (!key) return progress;
  try {
    window.localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    // Ignore storage quota errors
  }
  return progress;
}

export function initializeStudentProgress(studentId) {
  const key = getStorageKey(studentId);
  if (!key) return createFreshProgress();
  try {
    const existing = window.localStorage.getItem(key);
    if (existing) {
      return loadProgress(studentId);
    }
  } catch {
    // Continue to initialize fresh profile
  }
  return writeProgress(studentId, createFreshProgress());
}

export function loadProgress(studentId) {
  const key = getStorageKey(studentId);
  if (!key) {
    return createFreshProgress();
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return createFreshProgress();
    }
    const parsed = JSON.parse(raw);
    const fresh = createFreshProgress();
    const merged = {
      ...fresh,
      ...parsed,
      exploredShapes: Array.isArray(parsed.exploredShapes) ? parsed.exploredShapes : [],
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
      unlockedThemes:
        Array.isArray(parsed.unlockedThemes) && parsed.unlockedThemes.length > 0
          ? parsed.unlockedThemes
          : ['atlas'],
    };
    return {
      ...merged,
      level: getLevelFromXp(merged.totalXp),
    };
  } catch {
    return createFreshProgress();
  }
}

export function hasLegacySharedProgress() {
  try {
    return window.localStorage.getItem(LEGACY_PROGRESS_KEY) !== null;
  } catch {
    return false;
  }
}

export function saveChallengeAnswer({ isCorrect, xpEarned }, studentId) {
  const current = updateDailyStreak(loadProgress(studentId));
  const nextCurrentStreak = isCorrect ? current.currentStreak + 1 : 0;
  const updated = evaluateUnlocks({
    ...current,
    totalXp: current.totalXp + (isCorrect ? xpEarned : 0),
    currentStreak: nextCurrentStreak,
    bestStreak: Math.max(current.bestStreak, nextCurrentStreak),
    challengeCorrect: current.challengeCorrect + (isCorrect ? 1 : 0),
    challengeAttempted: current.challengeAttempted + 1,
  });
  return writeProgress(studentId, updated);
}

export function saveChallengeCompletion({ sessionXp }, studentId) {
  const current = updateDailyStreak(loadProgress(studentId));
  const updated = evaluateUnlocks({
    ...current,
    challengesCompleted: current.challengesCompleted + 1,
    lastChallengeXp: sessionXp,
  });
  return writeProgress(studentId, updated);
}

export function saveTablesAnswer({ isCorrect, xpEarned, selectedTable }, studentId) {
  const current = updateDailyStreak(loadProgress(studentId));
  const nextTablesStreak = isCorrect ? current.tablesCurrentStreak + 1 : 0;
  const nextOverallStreak = isCorrect ? current.currentStreak + 1 : 0;
  const updated = evaluateUnlocks({
    ...current,
    totalXp: current.totalXp + (isCorrect ? xpEarned : 0),
    currentStreak: nextOverallStreak,
    bestStreak: Math.max(current.bestStreak, nextOverallStreak),
    tablesAttempted: current.tablesAttempted + 1,
    tablesCorrect: current.tablesCorrect + (isCorrect ? 1 : 0),
    tablesCurrentStreak: nextTablesStreak,
    tablesBestStreak: Math.max(current.tablesBestStreak, nextTablesStreak),
    tablesXpEarned: current.tablesXpEarned + (isCorrect ? xpEarned : 0),
    selectedTable: selectedTable ?? current.selectedTable,
  });
  return writeProgress(studentId, updated);
}

export function saveSelectedTable(table, studentId) {
  const current = loadProgress(studentId);
  const updated = {
    ...current,
    selectedTable: table,
  };
  return writeProgress(studentId, updated);
}

export function saveExploredShape(shapeId, studentId) {
  const current = updateDailyStreak(loadProgress(studentId));
  const explored = current.exploredShapes.includes(shapeId)
    ? current.exploredShapes
    : [...current.exploredShapes, shapeId];
  const updated = evaluateUnlocks({
    ...current,
    exploredShapes: explored,
    selectedShape: shapeId,
  });
  return writeProgress(studentId, updated);
}

export function saveShapeQuizAnswer({ isCorrect, xpEarned }, studentId) {
  const current = updateDailyStreak(loadProgress(studentId));
  const nextOverallStreak = isCorrect ? current.currentStreak + 1 : 0;
  const updated = evaluateUnlocks({
    ...current,
    totalXp: current.totalXp + (isCorrect ? xpEarned : 0),
    currentStreak: nextOverallStreak,
    bestStreak: Math.max(current.bestStreak, nextOverallStreak),
    shapeQuizAttempted: current.shapeQuizAttempted + 1,
    shapeQuizCorrect: current.shapeQuizCorrect + (isCorrect ? 1 : 0),
    shapeXpEarned: current.shapeXpEarned + (isCorrect ? xpEarned : 0),
  });
  return writeProgress(studentId, updated);
}

export function saveSelectedTheme(themeId, studentId) {
  const current = loadProgress(studentId);
  if (!current.unlockedThemes.includes(themeId)) {
    return current;
  }
  const updated = {
    ...current,
    selectedTheme: themeId,
  };
  return writeProgress(studentId, updated);
}
