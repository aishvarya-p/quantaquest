import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { useProgress } from '../context/useProgress';
import {
  DIFFICULTIES,
  TOTAL_QUESTIONS,
  formatTimer,
  generateQuestionSet,
} from '../utils/mathChallenge';

const DIFFICULTY_LIST = [DIFFICULTIES.easy, DIFFICULTIES.medium, DIFFICULTIES.hard];

export default function ChallengePage() {
  const { progress, recordChallengeAnswer, recordChallengeCompletion } = useProgress();

  const [difficulty, setDifficulty] = useState('medium');
  const [questions, setQuestions] = useState(() => generateQuestionSet('medium', TOTAL_QUESTIONS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTIES.medium.timeLimit);
  const [showHint, setShowHint] = useState(false);
  const [answerState, setAnswerState] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const recordedTimeoutRef = useRef(new Set());

  const difficultyConfig = DIFFICULTIES[difficulty];
  const currentQuestion = questions[currentIndex];
  const isLocked = answerState !== null;
  const savedTotalXp = progress.totalXp;

  useEffect(() => {
    if (isCompleted || answerState !== null) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isCompleted, answerState, currentQuestion.id]);

  useEffect(() => {
    if (timeLeft !== 0 || answerState !== null || isCompleted) {
      return;
    }
    if (recordedTimeoutRef.current.has(currentQuestion.id)) {
      return;
    }
    recordedTimeoutRef.current.add(currentQuestion.id);

    setAnswerState({ status: 'timeout', selectedLetter: null });
    recordChallengeAnswer({ isCorrect: false, xpEarned: 0 });
  }, [timeLeft, answerState, isCompleted, currentQuestion.id, recordChallengeAnswer]);

  function startNewWave(nextDifficulty) {
    const config = DIFFICULTIES[nextDifficulty];
    recordedTimeoutRef.current = new Set();
    setDifficulty(nextDifficulty);
    setQuestions(generateQuestionSet(nextDifficulty, TOTAL_QUESTIONS));
    setCurrentIndex(0);
    setScore(0);
    setSessionXp(0);
    setTimeLeft(config.timeLimit);
    setShowHint(false);
    setAnswerState(null);
    setIsCompleted(false);
  }

  function handleSelectOption(option) {
    if (isLocked || isCompleted) return;

    const isCorrect = option.isCorrect;
    const earned = isCorrect ? difficultyConfig.xpPerCorrect : 0;

    setAnswerState({
      status: isCorrect ? 'correct' : 'incorrect',
      selectedLetter: option.letter,
    });

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setSessionXp((prev) => prev + earned);
    }

    recordChallengeAnswer({ isCorrect, xpEarned: earned });
  }

  function handleNextQuestion() {
    if (currentIndex + 1 >= TOTAL_QUESTIONS) {
      recordChallengeCompletion({ sessionXp });
      setIsCompleted(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setTimeLeft(difficultyConfig.timeLimit);
    setShowHint(false);
    setAnswerState(null);
  }

  function getOptionClasses(option) {
    const base =
      'answer-option group p-gutter-lg rounded-xl border-2 tile-shadow flex items-center gap-gutter-md text-left transition-transform duration-state-change ease-state-change focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary';

    if (!isLocked) {
      return `${base} bg-light-surface-container-low text-light-on-surface border-light-outline-variant hover:-translate-y-0.5 hover:border-light-primary active:translate-y-0.5`;
    }

    if (option.isCorrect) {
      return `${base} bg-light-tertiary-container border-light-tertiary text-light-on-tertiary-container`;
    }

    if (answerState.selectedLetter === option.letter) {
      return `${base} bg-light-error-container border-light-error text-light-on-error-container`;
    }

    return `${base} bg-light-surface-container-low text-light-on-surface-variant border-light-outline-variant opacity-75`;
  }

  const accuracyPercent = Math.round((score / TOTAL_QUESTIONS) * 100);
  const completedCount = isCompleted ? TOTAL_QUESTIONS : currentIndex + 1;

  return (
    <div className="min-h-screen flex flex-col bg-light-background text-light-on-background">
      <AppHeader />

      {/* Main Challenge Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-page-margin py-gutter-lg flex flex-col gap-gutter-lg">
        {/* 1. Challenge Title, Intro, Back Link & Difficulty Selector */}
        <section
          aria-label="Challenge setup"
          className="flex flex-col md:flex-row md:items-end justify-between gap-gutter-md"
        >
          <div className="flex flex-col gap-gutter-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 self-start text-light-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary rounded-sm"
            >
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                arrow_back
              </span>
              <span className="font-label text-label-lg">Back to Dashboard</span>
            </Link>

            <div className="flex items-center gap-gutter-md">
              <span className="w-12 h-12 rounded-lg bg-realm-challenge-soft text-on-realm-challenge-soft border-2 border-realm-challenge flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-headline-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden="true"
                >
                  swords
                </span>
              </span>
              <div>
                <h1 className="font-headline text-headline-lg text-light-on-surface">
                  Math Challenge
                </h1>
                <p className="font-body text-body-md text-light-on-surface-variant">
                  Solve puzzle waves at your own pace or race the clock for bonus XP.
                </p>
              </div>
            </div>
          </div>

          {/* Difficulty Selection Area */}
          <div className="flex flex-col items-start gap-gutter-xs shrink-0">
            <span className="font-label text-label-sm text-light-on-surface-variant">
              Difficulty
            </span>
            <div
              role="group"
              aria-label="Select difficulty"
              className="inline-flex items-center gap-1 p-1 rounded-lg bg-light-surface-container-low border-2 border-light-outline-variant"
            >
              {DIFFICULTY_LIST.map((item) => {
                const isActive = difficulty === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => startNewWave(item.id)}
                    className={`px-3 py-1.5 rounded-md transition-colors duration-state-change ${
                      isActive
                        ? 'bg-realm-challenge text-on-realm-challenge'
                        : 'text-light-on-surface-variant hover:text-light-on-surface'
                    }`}
                  >
                    <span className="font-label text-label-lg">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. Question Progress, Score, XP & Timer Strip */}
        <section
          aria-label="Challenge status"
          className="bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow px-gutter-lg py-gutter-md flex flex-wrap items-center justify-between gap-gutter-md"
        >
          {/* Question Progress Indicator */}
          <div className="flex items-center gap-gutter-md flex-1 min-w-[240px]">
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-center justify-between gap-gutter-sm">
                <span className="font-label text-label-lg text-light-on-surface tabular-nums">
                  {isCompleted
                    ? `Completed ${TOTAL_QUESTIONS} of ${TOTAL_QUESTIONS}`
                    : `Question ${currentIndex + 1} of ${TOTAL_QUESTIONS}`}
                </span>
                <span className="font-label text-label-sm text-light-on-surface-variant">
                  {difficultyConfig.waveName}
                </span>
              </div>
              <div
                className="grid grid-cols-10 gap-1.5"
                role="progressbar"
                aria-valuenow={completedCount}
                aria-valuemin={1}
                aria-valuemax={TOTAL_QUESTIONS}
                aria-label="Question progress"
              >
                {Array.from({ length: TOTAL_QUESTIONS }, (_, idx) => (
                  <span
                    key={idx}
                    className={`h-2.5 rounded-full ${
                      idx < completedCount ? 'bg-realm-challenge' : 'bg-light-surface-container-high'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Score / XP & Timer Pills */}
          <div className="flex flex-wrap items-center gap-gutter-sm shrink-0">
            {/* Score Indicator */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-light-surface-container-low text-light-on-surface border-2 border-light-outline-variant">
              <span
                className="material-symbols-outlined text-title-md text-light-tertiary"
                style={{ fontVariationSettings: "'FILL' 1" }}
                aria-hidden="true"
              >
                check_circle
              </span>
              <span className="font-mono text-mono-sm tabular-nums">
                Score: {score}/{TOTAL_QUESTIONS}
              </span>
            </div>

            {/* XP Indicator */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-light-secondary-container text-light-on-secondary-container border-2 border-light-secondary">
              <span
                className="material-symbols-outlined text-title-md"
                style={{ fontVariationSettings: "'FILL' 1" }}
                aria-hidden="true"
              >
                stars
              </span>
              <span className="font-mono text-mono-sm tabular-nums">+{sessionXp} XP</span>
            </div>

            {/* Timer Indicator */}
            <div
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border-2 ${
                !isCompleted && answerState === null && timeLeft <= 5
                  ? 'bg-realm-challenge-soft text-on-realm-challenge-soft border-realm-challenge'
                  : 'bg-light-surface-container-low text-light-on-surface border-light-outline-variant'
              }`}
            >
              <span
                className="material-symbols-outlined text-title-md text-realm-challenge"
                aria-hidden="true"
              >
                timer
              </span>
              <span className="font-mono text-mono-sm tabular-nums">
                {isCompleted ? '00:00' : formatTimer(timeLeft)}
              </span>
            </div>
          </div>
        </section>

        {/* 3. Primary Question Card OR Wave Completion Summary */}
        {isCompleted ? (
          <article className="bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow p-gutter-xl flex flex-col items-center text-center gap-gutter-lg">
            <span className="w-16 h-16 rounded-xl bg-light-secondary-container text-light-on-secondary-container border-2 border-light-secondary flex items-center justify-center tile-shadow">
              <span
                className="material-symbols-outlined text-display-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
                aria-hidden="true"
              >
                emoji_events
              </span>
            </span>

            <div className="flex flex-col gap-gutter-xs">
              <span className="inline-flex self-center font-label text-label-sm px-3 py-1 rounded-full bg-realm-challenge-soft text-on-realm-challenge-soft border border-realm-challenge">
                {difficultyConfig.label} Difficulty
              </span>
              <h2 className="font-headline text-display-lg-mobile md:text-display-lg text-light-on-surface">
                Challenge Wave Complete!
              </h2>
              <p className="font-body text-body-lg text-light-on-surface-variant max-w-prose">
                {score >= 8
                  ? 'Outstanding math instincts! You powered through the wave with top accuracy.'
                  : score >= 5
                    ? 'Great effort! Keep practicing to boost your speed and score even higher.'
                    : 'Good practice run! Every puzzle sharpens your skills for the next wave.'}
              </p>
            </div>

            <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-gutter-md">
              <div className="p-gutter-md rounded-xl bg-light-surface-container-low border-2 border-light-outline-variant flex flex-col items-center gap-1">
                <span className="font-label text-label-sm text-light-on-surface-variant">
                  Total Score
                </span>
                <span className="font-mono text-headline-lg text-light-on-surface tabular-nums">
                  {accuracyPercent}%
                </span>
              </div>
              <div className="p-gutter-md rounded-xl bg-light-tertiary-container border-2 border-light-tertiary flex flex-col items-center gap-1">
                <span className="font-label text-label-sm text-light-on-tertiary-container">
                  Correct Answers
                </span>
                <span className="font-mono text-headline-lg text-light-on-tertiary-container tabular-nums">
                  {score} / {TOTAL_QUESTIONS}
                </span>
              </div>
              <div className="p-gutter-md rounded-xl bg-light-secondary-container border-2 border-light-secondary flex flex-col items-center gap-1">
                <span className="font-label text-label-sm text-light-on-secondary-container">
                  XP Earned
                </span>
                <span className="font-mono text-headline-lg text-light-on-secondary-container tabular-nums">
                  +{sessionXp} XP
                </span>
              </div>
            </div>

            <p className="font-body text-body-md text-light-on-surface-variant tabular-nums">
              Saved Explorer XP: <span className="font-mono text-light-on-surface">{savedTotalXp.toLocaleString()} XP</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-gutter-md">
              <button
                type="button"
                onClick={() => startNewWave(difficulty)}
                className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary text-light-on-primary border-2 border-light-on-surface tile-shadow-ink hover:bg-light-primary-container active:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary transition-transform duration-state-change ease-state-change"
              >
                <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                  replay
                </span>
                <span className="font-label text-label-lg">Play Again</span>
              </button>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant tile-shadow hover:bg-light-surface-container-low active:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary transition-transform duration-state-change ease-state-change"
              >
                <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                  home
                </span>
                <span className="font-label text-label-lg">Back to Dashboard</span>
              </Link>
            </div>
          </article>
        ) : (
          <article className="bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow p-gutter-xl flex flex-col gap-gutter-lg">
            {/* Question Header: Topic Tag + Hint Button */}
            <header className="flex flex-wrap items-center justify-between gap-gutter-md">
              <span className="font-label text-label-sm px-3 py-1 rounded-full bg-realm-challenge-soft text-on-realm-challenge-soft border border-realm-challenge">
                {currentQuestion.topic}
              </span>

              <button
                id="hint-btn"
                type="button"
                aria-expanded={showHint}
                aria-controls="hint-panel"
                onClick={() => setShowHint((prev) => !prev)}
                className="inline-flex items-center justify-center gap-gutter-sm px-gutter-md py-2 rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant tile-shadow hover:bg-light-surface-container-low active:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary transition-transform duration-state-change ease-state-change"
              >
                <span
                  className="material-symbols-outlined text-title-md text-light-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden="true"
                >
                  lightbulb
                </span>
                <span className="font-label text-label-lg">
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </span>
              </button>
            </header>

            {/* Collapsible Hint Banner */}
            {showHint && (
              <div
                id="hint-panel"
                className="p-gutter-md rounded-lg bg-light-secondary-container text-light-on-secondary-container border-2 border-light-secondary flex items-start gap-gutter-sm"
              >
                <span
                  className="material-symbols-outlined text-title-lg shrink-0"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden="true"
                >
                  tips_and_updates
                </span>
                <p className="font-body text-body-md text-pretty">{currentQuestion.hint}</p>
              </div>
            )}

            {/* Question Prompt */}
            <div className="py-gutter-sm">
              <h2 className="font-headline text-headline-lg text-light-on-surface text-balance">
                {currentQuestion.prompt}
              </h2>
            </div>

            {/* Four Answer Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md" role="radiogroup" aria-label="Answer choices">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.letter}
                  type="button"
                  role="radio"
                  aria-checked={answerState?.selectedLetter === option.letter}
                  disabled={isLocked}
                  onClick={() => handleSelectOption(option)}
                  className={getOptionClasses(option)}
                >
                  <span className="option-badge w-10 h-10 rounded-md bg-light-surface-container-lowest border-2 border-light-outline-variant flex items-center justify-center shrink-0">
                    <span className="font-mono text-mono-sm text-light-on-surface">
                      {option.letter}
                    </span>
                  </span>
                  <span className="font-title text-title-lg text-light-on-surface tabular-nums">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Interactive Feedback State Banner */}
            {isLocked && (
              <div
                aria-live="polite"
                className={`p-gutter-lg rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md ${
                  answerState.status === 'correct'
                    ? 'bg-light-tertiary-container border-light-tertiary text-light-on-tertiary-container'
                    : 'bg-light-error-container border-light-error text-light-on-error-container'
                }`}
              >
                <div className="flex items-start gap-gutter-md">
                  <span
                    className="material-symbols-outlined text-headline-lg shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    {answerState.status === 'correct'
                      ? 'check_circle'
                      : answerState.status === 'timeout'
                        ? 'timer_off'
                        : 'cancel'}
                  </span>
                  <div className="flex flex-col gap-gutter-xs">
                    <h3 className="font-headline text-headline-md">
                      {answerState.status === 'correct'
                        ? `Spot on! +${difficultyConfig.xpPerCorrect} XP`
                        : answerState.status === 'timeout'
                          ? `Time’s up! The answer is ${currentQuestion.answer}`
                          : `Not quite — the answer is ${currentQuestion.answer}`}
                    </h3>
                    <p className="font-body text-body-md text-pretty">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>

                <button
                  id="next-question-btn"
                  type="button"
                  onClick={handleNextQuestion}
                  className="shrink-0 inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary text-light-on-primary border-2 border-light-on-surface tile-shadow-ink hover:bg-light-primary-container active:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary transition-transform duration-state-change ease-state-change"
                >
                  <span className="font-label text-label-lg">
                    {currentIndex + 1 >= TOTAL_QUESTIONS ? 'See Results' : 'Next Question'}
                  </span>
                  <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                    arrow_forward
                  </span>
                </button>
              </div>
            )}
          </article>
        )}
      </main>
    </div>
  );
}
