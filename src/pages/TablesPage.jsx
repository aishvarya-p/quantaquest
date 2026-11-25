import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { useProgress } from '../context/useProgress';
import { formatTimer } from '../utils/mathChallenge';

const TABLES = Array.from({ length: 20 }, (_, idx) => idx + 1);
const FACTORS = Array.from({ length: 12 }, (_, idx) => idx + 1);
const PRACTICE_XP = 20;
const TIMED_XP = 25;
const TIMED_DURATION_SECONDS = 60;

const MODES = [
  { id: 'learn', label: 'Learn Mode' },
  { id: 'practice', label: 'Practice Mode' },
  { id: 'timed', label: 'Timed Challenge' },
];

function pickRandomFactor(excludeFactor) {
  let next = Math.floor(Math.random() * 12) + 1;
  if (excludeFactor && next === excludeFactor) {
    next = (next % 12) + 1;
  }
  return next;
}

export default function TablesPage() {
  const { progress, recordTablesAnswer, updateSelectedTable } = useProgress();

  const [activeTable, setActiveTable] = useState(() => progress.selectedTable || 2);
  const [mode, setMode] = useState('practice');

  // Learn Mode state
  const [learnFactor, setLearnFactor] = useState(1);

  // Practice Mode state
  const [practiceFactor, setPracticeFactor] = useState(() => pickRandomFactor());
  const [practiceFeedback, setPracticeFeedback] = useState(null);
  const [roundProgress, setRoundProgress] = useState(0);

  // Timed Mode state
  const [timedFactor, setTimedFactor] = useState(() => pickRandomFactor());
  const [timeLeft, setTimeLeft] = useState(TIMED_DURATION_SECONDS);
  const [timedCorrect, setTimedCorrect] = useState(0);
  const [timedAttempted, setTimedAttempted] = useState(0);
  const [timedXp, setTimedXp] = useState(0);
  const [timedFeedback, setTimedFeedback] = useState(null);

  // Shared form input state
  const [answerInput, setAnswerInput] = useState('');
  const [inputError, setInputError] = useState('');
  const inputRef = useRef(null);

  const isTimedFinished = mode === 'timed' && timeLeft === 0;

  useEffect(() => {
    if (mode !== 'timed' || timeLeft === 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [mode, timeLeft]);

  function handleSelectTable(tableNum) {
    setActiveTable(tableNum);
    updateSelectedTable(tableNum);
    setInputError('');
    setAnswerInput('');

    if (mode === 'learn') {
      setLearnFactor(1);
    } else if (mode === 'practice') {
      setPracticeFactor(pickRandomFactor(practiceFactor));
      setPracticeFeedback(null);
    } else {
      setTimedFactor(pickRandomFactor(timedFactor));
      setTimeLeft(TIMED_DURATION_SECONDS);
      setTimedCorrect(0);
      setTimedAttempted(0);
      setTimedXp(0);
      setTimedFeedback(null);
    }
  }

  function handleSelectMode(nextMode) {
    setMode(nextMode);
    setAnswerInput('');
    setInputError('');

    if (nextMode === 'learn') {
      setLearnFactor(1);
    } else if (nextMode === 'practice') {
      setPracticeFeedback(null);
      setPracticeFactor(pickRandomFactor());
    } else {
      setTimeLeft(TIMED_DURATION_SECONDS);
      setTimedCorrect(0);
      setTimedAttempted(0);
      setTimedXp(0);
      setTimedFeedback(null);
      setTimedFactor(pickRandomFactor());
    }
  }

  function parseIntegerAnswer(rawValue) {
    const trimmed = rawValue.trim();
    if (!trimmed) {
      return { valid: false, message: 'Please type a number before checking your answer.' };
    }
    if (!/^-?\d+$/.test(trimmed)) {
      return { valid: false, message: 'Please enter a valid whole number.' };
    }
    return { valid: true, value: Number.parseInt(trimmed, 10) };
  }

  function handlePracticeSubmit(event) {
    event.preventDefault();
    if (practiceFeedback !== null) return;

    const parsed = parseIntegerAnswer(answerInput);
    if (!parsed.valid) {
      setInputError(parsed.message);
      return;
    }

    setInputError('');
    const expected = activeTable * practiceFactor;
    const isCorrect = parsed.value === expected;
    const updated = recordTablesAnswer({
      isCorrect,
      xpEarned: PRACTICE_XP,
      selectedTable: activeTable,
    });
    setRoundProgress((prev) => (prev >= 10 ? 1 : prev + 1));

    setPracticeFeedback({
      isCorrect,
      expected,
      factor: practiceFactor,
      table: activeTable,
      streakAfter: updated.tablesCurrentStreak,
    });
  }

  function handleNextPracticeProblem() {
    setPracticeFactor((prev) => pickRandomFactor(prev));
    setPracticeFeedback(null);
    setAnswerInput('');
    setInputError('');
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  function handleTimedSubmit(event) {
    event.preventDefault();
    if (isTimedFinished) return;

    const parsed = parseIntegerAnswer(answerInput);
    if (!parsed.valid) {
      setInputError(parsed.message);
      return;
    }

    setInputError('');
    const expected = activeTable * timedFactor;
    const isCorrect = parsed.value === expected;

    recordTablesAnswer({
      isCorrect,
      xpEarned: TIMED_XP,
      selectedTable: activeTable,
    });

    setTimedAttempted((prev) => prev + 1);
    if (isCorrect) {
      setTimedCorrect((prev) => prev + 1);
      setTimedXp((prev) => prev + TIMED_XP);
    }

    setTimedFeedback({
      isCorrect,
      table: activeTable,
      factor: timedFactor,
      expected,
      userAnswer: parsed.value,
    });

    setTimedFactor((prev) => pickRandomFactor(prev));
    setAnswerInput('');
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  function handleRestartTimed() {
    setTimeLeft(TIMED_DURATION_SECONDS);
    setTimedCorrect(0);
    setTimedAttempted(0);
    setTimedXp(0);
    setTimedFeedback(null);
    setTimedFactor(pickRandomFactor());
    setAnswerInput('');
    setInputError('');
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  const practiceAccuracy =
    progress.tablesAttempted > 0
      ? Math.round((progress.tablesCorrect / progress.tablesAttempted) * 100)
      : 100;
  const timedAccuracy =
    timedAttempted > 0 ? Math.round((timedCorrect / timedAttempted) * 100) : 0;

  const activeModeLabel = MODES.find((m) => m.id === mode)?.label || 'Practice Mode';

  const progressSegmentsCount = mode === 'learn' ? 12 : 10;
  const filledSegments =
    mode === 'learn'
      ? learnFactor
      : mode === 'timed'
        ? Math.ceil((timeLeft / TIMED_DURATION_SECONDS) * 10)
        : roundProgress;

  return (
    <div className="min-h-screen flex flex-col bg-light-background text-light-on-background">
      <AppHeader />

      {/* Main Tables Practice Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-page-margin py-gutter-lg flex flex-col gap-gutter-lg">
        {/* 1. Title, Friendly Intro, Back Link & Practice Mode Selector */}
        <section
          aria-label="Tables practice setup"
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
              <span className="w-12 h-12 rounded-lg bg-realm-tables-soft text-on-realm-tables-soft border-2 border-realm-tables flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-headline-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden="true"
                >
                  grid_on
                </span>
              </span>
              <div>
                <h1 className="font-headline text-headline-lg text-light-on-surface">
                  Tables Practice
                </h1>
                <p className="font-body text-body-md text-light-on-surface-variant">
                  Pick a times table from 1 to 20 and sprint your way to mastery!
                </p>
              </div>
            </div>
          </div>

          {/* Practice Mode Selection */}
          <div className="flex flex-col items-start gap-gutter-xs shrink-0">
            <span className="font-label text-label-sm text-light-on-surface-variant">
              Practice Mode
            </span>
            <div
              role="group"
              aria-label="Select practice mode"
              className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-light-surface-container-low border-2 border-light-outline-variant"
            >
              {MODES.map((item) => {
                const isActive = mode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleSelectMode(item.id)}
                    className={`px-3 py-1.5 rounded-md transition-colors duration-state-change ${
                      isActive
                        ? 'bg-realm-tables text-on-realm-tables'
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

        {/* 2. Progress, Score, XP & Streak/Timer Strip */}
        <section
          aria-label="Session stats"
          className="bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow px-gutter-lg py-gutter-md flex flex-wrap items-center justify-between gap-gutter-md"
        >
          {/* Progress Indicator */}
          <div className="flex items-center gap-gutter-md flex-1 min-w-[240px]">
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-center justify-between gap-gutter-sm">
                <span className="font-label text-label-lg text-light-on-surface tabular-nums">
                  {mode === 'learn'
                    ? `Fact ${learnFactor} of 12`
                    : mode === 'timed'
                      ? isTimedFinished
                        ? 'Sprint complete!'
                        : `${timedAttempted} answered in sprint`
                      : `${roundProgress} of 10 completed`}
                </span>
                <span className="font-label text-label-sm text-light-on-surface-variant tabular-nums">
                  {activeTable}× Table
                </span>
              </div>
              <div
                className={`grid gap-1.5 ${mode === 'learn' ? 'grid-cols-12' : 'grid-cols-10'}`}
                role="progressbar"
                aria-valuenow={filledSegments}
                aria-valuemin={0}
                aria-valuemax={progressSegmentsCount}
                aria-label="Tables progress"
              >
                {Array.from({ length: progressSegmentsCount }, (_, idx) => (
                  <span
                    key={idx}
                    className={`h-2.5 rounded-full ${
                      idx < filledSegments ? 'bg-realm-tables' : 'bg-light-surface-container-high'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Score, XP & Streak/Timer Pills */}
          <div className="flex flex-wrap items-center gap-gutter-sm shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-light-surface-container-low text-light-on-surface border-2 border-light-outline-variant">
              <span
                className="material-symbols-outlined text-title-md text-light-tertiary"
                style={{ fontVariationSettings: "'FILL' 1" }}
                aria-hidden="true"
              >
                check_circle
              </span>
              <span id="score-display" className="font-mono text-mono-sm tabular-nums">
                {mode === 'timed'
                  ? `Score: ${timedCorrect}/${timedAttempted}`
                  : progress.tablesAttempted > 0
                    ? `Score: ${progress.tablesCorrect}/${progress.tablesAttempted} (${practiceAccuracy}%)`
                    : 'Score: 0/0'}
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-light-secondary-container text-light-on-secondary-container border-2 border-light-secondary">
              <span
                className="material-symbols-outlined text-title-md"
                style={{ fontVariationSettings: "'FILL' 1" }}
                aria-hidden="true"
              >
                stars
              </span>
              <span id="xp-display" className="font-mono text-mono-sm tabular-nums">
                +{mode === 'timed' ? timedXp : progress.tablesXpEarned} XP
              </span>
            </div>

            {mode === 'timed' ? (
              <div
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border-2 ${
                  timeLeft <= 10 && !isTimedFinished
                    ? 'bg-realm-challenge-soft text-on-realm-challenge-soft border-realm-challenge'
                    : 'bg-realm-tables-soft text-on-realm-tables-soft border-realm-tables'
                }`}
              >
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                  timer
                </span>
                <span id="timed-clock" className="font-mono text-mono-sm tabular-nums">
                  {formatTimer(timeLeft)}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-realm-tables-soft text-on-realm-tables-soft border-2 border-realm-tables">
                <span
                  className="material-symbols-outlined text-title-md"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden="true"
                >
                  bolt
                </span>
                <span id="streak-display" className="font-mono text-mono-sm tabular-nums">
                  {progress.tablesCurrentStreak} Streak
                </span>
              </div>
            )}
          </div>
        </section>

        {/* 3. Main Practice Arena: Table Selector (1-20) + Multiplication Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          {/* Table Selection Area (1 to 20) — 4 cols */}
          <aside
            aria-label="Select multiplication table"
            className="lg:col-span-4 bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow p-gutter-lg flex flex-col gap-gutter-md"
          >
            <header className="flex items-center justify-between gap-gutter-sm">
              <h2 className="font-headline text-headline-md text-light-on-surface">Choose Table</h2>
              <span className="font-label text-label-sm text-light-on-surface-variant tabular-nums">
                1 – 20
              </span>
            </header>

            <div
              id="table-grid"
              className="grid grid-cols-5 gap-gutter-xs"
              role="group"
              aria-label="Multiplication tables 1 to 20"
            >
              {TABLES.map((num) => {
                const isSelected = activeTable === num;
                return (
                  <button
                    key={num}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSelectTable(num)}
                    className={`table-btn h-11 rounded-md border-2 font-mono text-mono-sm tabular-nums transition-colors duration-state-change ${
                      isSelected
                        ? 'bg-realm-tables text-on-realm-tables border-light-on-surface'
                        : 'bg-light-surface-container-low text-light-on-surface border-light-outline-variant hover:border-realm-tables'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Primary Focus: Multiplication Practice Stage — 8 cols */}
          <section
            aria-label="Multiplication practice stage"
            className="lg:col-span-8 bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow p-gutter-xl flex flex-col gap-gutter-lg"
          >
            <header className="flex flex-wrap items-center justify-between gap-gutter-sm">
              <span className="font-label text-label-sm px-3 py-1 rounded-full bg-realm-tables-soft text-on-realm-tables-soft border border-realm-tables tabular-nums">
                {activeTable}× Table Quest
              </span>
              <span className="font-label text-label-sm px-3 py-1 rounded-full bg-light-surface-container-low text-light-on-surface-variant border border-light-outline-variant">
                {activeModeLabel}
              </span>
            </header>

            {/* MODE 1: LEARN MODE */}
            {mode === 'learn' && (
              <div className="flex flex-col gap-gutter-lg">
                <div className="bg-light-surface-container-low rounded-xl border-2 border-light-outline-variant py-gutter-lg px-gutter-lg flex flex-col items-center justify-center text-center gap-gutter-sm">
                  <span className="font-label text-label-lg text-light-on-surface-variant tabular-nums">
                    Fact {learnFactor} of 12
                  </span>
                  <h2 className="font-headline text-display-lg-mobile sm:text-display-lg text-light-on-surface tabular-nums">
                    {activeTable} × {learnFactor} = {activeTable * learnFactor}
                  </h2>
                  <p className="font-body text-body-md text-light-on-surface-variant tabular-nums">
                    {learnFactor} {learnFactor === 1 ? 'group' : 'groups'} of {activeTable} equals{' '}
                    {activeTable * learnFactor}.
                  </p>
                </div>

                {/* Previous / Next Navigation */}
                <div className="flex items-center justify-between gap-gutter-md">
                  <button
                    type="button"
                    disabled={learnFactor <= 1}
                    onClick={() => setLearnFactor((prev) => Math.max(1, prev - 1))}
                    className="inline-flex items-center justify-center gap-gutter-sm px-gutter-md py-2.5 rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant tile-shadow hover:bg-light-surface-container-low disabled:opacity-50 disabled:pointer-events-none transition-transform duration-state-change"
                  >
                    <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                      arrow_back
                    </span>
                    <span className="font-label text-label-lg">Previous</span>
                  </button>

                  <button
                    type="button"
                    disabled={learnFactor >= 12}
                    onClick={() => setLearnFactor((prev) => Math.min(12, prev + 1))}
                    className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-2.5 rounded-md bg-light-primary text-light-on-primary border-2 border-light-on-surface tile-shadow-ink hover:bg-light-primary-container disabled:opacity-50 disabled:pointer-events-none transition-transform duration-state-change"
                  >
                    <span className="font-label text-label-lg">Next Fact</span>
                    <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                      arrow_forward
                    </span>
                  </button>
                </div>

                {/* Full ×1 to ×12 Reference Grid */}
                <div className="flex flex-col gap-gutter-sm">
                  <h3 className="font-headline text-title-lg text-light-on-surface">
                    Complete {activeTable}× Table (×1 to ×12)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-gutter-sm">
                    {FACTORS.map((f) => {
                      const isCurrent = f === learnFactor;
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setLearnFactor(f)}
                          className={`p-3 rounded-lg border-2 font-mono text-mono-sm tabular-nums text-center transition-colors duration-state-change ${
                            isCurrent
                              ? 'bg-realm-tables-soft text-on-realm-tables-soft border-realm-tables'
                              : 'bg-light-surface-container-low text-light-on-surface border-light-outline-variant hover:border-realm-tables'
                          }`}
                        >
                          {activeTable} × {f} = {activeTable * f}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* MODE 2: PRACTICE MODE */}
            {mode === 'practice' && (
              <>
                <div className="bg-light-surface-container-low rounded-xl border-2 border-light-outline-variant py-gutter-xl px-gutter-lg flex flex-col items-center justify-center text-center gap-gutter-sm">
                  <span className="font-label text-label-lg text-light-on-surface-variant">
                    What is
                  </span>
                  <h2
                    id="equation-display"
                    className="font-headline text-display-lg text-light-on-surface tabular-nums"
                  >
                    {activeTable} × {practiceFactor} = ?
                  </h2>
                </div>

                <form
                  id="answer-form"
                  onSubmit={handlePracticeSubmit}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-gutter-md"
                >
                  <label htmlFor="answer-input" className="sr-only">
                    Your answer
                  </label>
                  <input
                    ref={inputRef}
                    id="answer-input"
                    type="number"
                    inputMode="numeric"
                    value={answerInput}
                    disabled={practiceFeedback !== null}
                    onChange={(event) => {
                      setAnswerInput(event.target.value);
                      if (inputError) setInputError('');
                    }}
                    placeholder="Type your answer..."
                    className="flex-1 h-14 px-gutter-lg rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant focus:border-realm-tables focus:outline-none disabled:bg-light-surface-container-low disabled:opacity-75 font-mono text-mono-lg tabular-nums"
                  />
                  <button
                    type="submit"
                    disabled={practiceFeedback !== null}
                    className="h-14 px-gutter-xl rounded-md bg-light-primary text-light-on-primary border-2 border-light-on-surface tile-shadow-ink hover:bg-light-primary-container active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary transition-transform duration-state-change ease-state-change inline-flex items-center justify-center gap-gutter-sm shrink-0"
                  >
                    <span className="font-label text-label-lg">Check Answer</span>
                    <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                      check
                    </span>
                  </button>
                </form>

                {inputError && (
                  <p role="alert" className="font-body text-body-md text-light-error">
                    {inputError}
                  </p>
                )}

                {practiceFeedback && (
                  <div
                    id="feedback-area"
                    aria-live="polite"
                    className={`p-gutter-lg rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md ${
                      practiceFeedback.isCorrect
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
                        {practiceFeedback.isCorrect ? 'celebration' : 'refresh'}
                      </span>
                      <div className="flex flex-col gap-gutter-xs">
                        <h3 className="font-headline text-headline-md">
                          {practiceFeedback.isCorrect ? `Awesome! +${PRACTICE_XP} XP` : 'Good try!'}
                        </h3>
                        <p className="font-body text-body-md text-pretty">
                          {practiceFeedback.isCorrect
                            ? `${practiceFeedback.table} × ${practiceFeedback.factor} = ${practiceFeedback.expected}. Your streak is now ${practiceFeedback.streakAfter} in a row!`
                            : `${practiceFeedback.table} × ${practiceFeedback.factor} equals ${practiceFeedback.expected}. Let’s keep practicing!`}
                        </p>
                      </div>
                    </div>
                    <button
                      id="next-btn"
                      type="button"
                      onClick={handleNextPracticeProblem}
                      className="shrink-0 inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-2.5 rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-on-surface tile-shadow hover:bg-light-surface-container-low transition-transform duration-state-change"
                    >
                      <span className="font-label text-label-lg">Next Problem</span>
                      <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* MODE 3: TIMED CHALLENGE */}
            {mode === 'timed' &&
              (isTimedFinished ? (
                <div className="flex flex-col items-center text-center gap-gutter-lg py-gutter-md">
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
                    <h2 className="font-headline text-headline-lg text-light-on-surface">
                      Time’s Up! {activeTable}× Table Sprint Complete
                    </h2>
                    <p className="font-body text-body-md text-light-on-surface-variant">
                      {timedCorrect >= 10
                        ? 'Lightning speed! You powered through the sprint.'
                        : 'Great hustle! Try another 60-second sprint to beat your score.'}
                    </p>
                  </div>

                  <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-gutter-md">
                    <div className="p-gutter-md rounded-xl bg-light-tertiary-container border-2 border-light-tertiary flex flex-col items-center gap-1">
                      <span className="font-label text-label-sm text-light-on-tertiary-container">
                        Correct Answers
                      </span>
                      <span className="font-mono text-headline-lg text-light-on-tertiary-container tabular-nums">
                        {timedCorrect} / {timedAttempted}
                      </span>
                    </div>
                    <div className="p-gutter-md rounded-xl bg-light-surface-container-low border-2 border-light-outline-variant flex flex-col items-center gap-1">
                      <span className="font-label text-label-sm text-light-on-surface-variant">
                        Accuracy
                      </span>
                      <span className="font-mono text-headline-lg text-light-on-surface tabular-nums">
                        {timedAccuracy}%
                      </span>
                    </div>
                    <div className="p-gutter-md rounded-xl bg-light-secondary-container border-2 border-light-secondary flex flex-col items-center gap-1">
                      <span className="font-label text-label-sm text-light-on-secondary-container">
                        XP Earned
                      </span>
                      <span className="font-mono text-headline-lg text-light-on-secondary-container tabular-nums">
                        +{timedXp} XP
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-gutter-md">
                    <button
                      type="button"
                      onClick={handleRestartTimed}
                      className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary text-light-on-primary border-2 border-light-on-surface tile-shadow-ink hover:bg-light-primary-container active:translate-y-0.5 transition-transform duration-state-change"
                    >
                      <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                        replay
                      </span>
                      <span className="font-label text-label-lg">Restart Sprint</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectMode('practice')}
                      className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant tile-shadow hover:bg-light-surface-container-low transition-transform duration-state-change"
                    >
                      <span className="font-label text-label-lg">Back to Practice Mode</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-light-surface-container-low rounded-xl border-2 border-light-outline-variant py-gutter-xl px-gutter-lg flex flex-col items-center justify-center text-center gap-gutter-sm">
                    <span className="font-label text-label-lg text-light-on-surface-variant">
                      Quick Sprint — What is
                    </span>
                    <h2
                      id="equation-display"
                      className="font-headline text-display-lg text-light-on-surface tabular-nums"
                    >
                      {activeTable} × {timedFactor} = ?
                    </h2>
                  </div>

                  <form
                    onSubmit={handleTimedSubmit}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-gutter-md"
                  >
                    <label htmlFor="timed-answer-input" className="sr-only">
                      Your answer
                    </label>
                    <input
                      ref={inputRef}
                      id="timed-answer-input"
                      type="number"
                      inputMode="numeric"
                      value={answerInput}
                      onChange={(event) => {
                        setAnswerInput(event.target.value);
                        if (inputError) setInputError('');
                      }}
                      placeholder="Type answer & press Enter..."
                      className="flex-1 h-14 px-gutter-lg rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant focus:border-realm-tables focus:outline-none font-mono text-mono-lg tabular-nums"
                    />
                    <button
                      type="submit"
                      className="h-14 px-gutter-xl rounded-md bg-light-primary text-light-on-primary border-2 border-light-on-surface tile-shadow-ink hover:bg-light-primary-container active:translate-y-0.5 transition-transform duration-state-change inline-flex items-center justify-center gap-gutter-sm shrink-0"
                    >
                      <span className="font-label text-label-lg">Check Answer</span>
                      <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                        check
                      </span>
                    </button>
                  </form>

                  {inputError && (
                    <p role="alert" className="font-body text-body-md text-light-error">
                      {inputError}
                    </p>
                  )}

                  {timedFeedback && (
                    <div
                      aria-live="polite"
                      className={`p-gutter-md rounded-xl border-2 flex items-center justify-between gap-gutter-md ${
                        timedFeedback.isCorrect
                          ? 'bg-light-tertiary-container border-light-tertiary text-light-on-tertiary-container'
                          : 'bg-light-error-container border-light-error text-light-on-error-container'
                      }`}
                    >
                      <div className="flex items-center gap-gutter-sm">
                        <span
                          className="material-symbols-outlined text-title-lg"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                          aria-hidden="true"
                        >
                          {timedFeedback.isCorrect ? 'celebration' : 'cancel'}
                        </span>
                        <span className="font-body text-body-md tabular-nums">
                          {timedFeedback.isCorrect
                            ? `Correct! ${timedFeedback.table} × ${timedFeedback.factor} = ${timedFeedback.expected} (+${TIMED_XP} XP)`
                            : `Not quite: ${timedFeedback.table} × ${timedFeedback.factor} = ${timedFeedback.expected}`}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ))}
          </section>
        </div>
      </main>
    </div>
  );
}
