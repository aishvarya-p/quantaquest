import { useState } from 'react';
import LevelUpModal from '../components/LevelUpModal';
import { getLevelFromXp, getLevelInfo } from '../utils/levelSystem';
import {
  loadProgress,
  saveChallengeAnswer,
  saveChallengeCompletion,
  saveExploredShape,
  saveSelectedTable,
  saveSelectedTheme,
  saveShapeQuizAnswer,
  saveTablesAnswer,
} from '../utils/progressStorage';
import { useAuth } from './useAuth';
import { ProgressContext } from './useProgress';

export function ProgressProvider({ children }) {
  const { currentUser } = useAuth();
  const studentId = currentUser?.id;

  const [progress, setProgress] = useState(() => loadProgress(studentId));
  const [levelUpEvent, setLevelUpEvent] = useState(null);

  function applyWithLevelCheck(saveFn, payload) {
    const previousProgress = loadProgress(studentId);
    const previousLevel = getLevelFromXp(previousProgress.totalXp);
    const updated = saveFn(payload, studentId);
    const newLevel = getLevelFromXp(updated.totalXp);

    setProgress(updated);

    if (newLevel > previousLevel) {
      setLevelUpEvent({
        previousLevel,
        newLevel,
        totalXp: updated.totalXp,
      });
    }

    return updated;
  }

  function recordChallengeAnswer(payload) {
    return applyWithLevelCheck(saveChallengeAnswer, payload);
  }

  function recordChallengeCompletion(payload) {
    const updated = saveChallengeCompletion(payload, studentId);
    setProgress(updated);
    return updated;
  }

  function recordTablesAnswer(payload) {
    return applyWithLevelCheck(saveTablesAnswer, payload);
  }

  function updateSelectedTable(table) {
    const updated = saveSelectedTable(table, studentId);
    setProgress(updated);
    return updated;
  }

  function recordExploredShape(shapeId) {
    const updated = saveExploredShape(shapeId, studentId);
    setProgress(updated);
    return updated;
  }

  function recordShapeQuizAnswer(payload) {
    return applyWithLevelCheck(saveShapeQuizAnswer, payload);
  }

  function updateSelectedTheme(themeId) {
    const updated = saveSelectedTheme(themeId, studentId);
    setProgress(updated);
    return updated;
  }

  const levelInfo = getLevelInfo(progress.totalXp);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        levelInfo,
        recordChallengeAnswer,
        recordChallengeCompletion,
        recordTablesAnswer,
        updateSelectedTable,
        recordExploredShape,
        recordShapeQuizAnswer,
        updateSelectedTheme,
      }}
    >
      {children}
      <LevelUpModal levelUpEvent={levelUpEvent} onClose={() => setLevelUpEvent(null)} />
    </ProgressContext.Provider>
  );
}
