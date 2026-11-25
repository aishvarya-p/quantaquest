import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { ShapeHeroSvg, ShapeThumbSvg } from '../components/shapes/ShapeVisuals';
import { useProgress } from '../context/useProgress';
import { SHAPE_LIST, SHAPE_QUIZ_QUESTIONS, SHAPES } from '../utils/shapesData';

const QUIZ_XP = 25;

function parseDimension(raw) {
  const trimmed = String(raw).trim();
  if (!trimmed) {
    return { valid: false, value: null };
  }
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num <= 0 || num > 1000) {
    return { valid: false, value: null };
  }
  return { valid: true, value: num };
}

export default function ShapesPage() {
  const { progress, recordExploredShape, recordShapeQuizAnswer } = useProgress();

  const [currentShapeId, setCurrentShapeId] = useState(() =>
    SHAPES[progress.selectedShape] ? progress.selectedShape : 'square'
  );
  const [primaryInput, setPrimaryInput] = useState('6');
  const [secondaryInput, setSecondaryInput] = useState('12');

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);

  const shape = SHAPES[currentShapeId] || SHAPES.square;
  const isRectangle = currentShapeId === 'rectangle';

  const parsedPrimary = parseDimension(primaryInput);
  const parsedSecondary = isRectangle ? parseDimension(secondaryInput) : { valid: true, value: 0 };
  const isDimensionValid = parsedPrimary.valid && parsedSecondary.valid;

  const sliderValue = parsedPrimary.valid
    ? Math.min(12, Math.max(2, Math.round(parsedPrimary.value)))
    : 6;

  const metrics = isDimensionValid
    ? shape.calculate(parsedPrimary.value, parsedSecondary.value)
    : {
        area: '—',
        secondMetric: '—',
        dimBadge: 'Enter a positive dimension',
      };

  const visualScale = parsedPrimary.valid
    ? Math.min(1.12, Math.max(0.76, 0.72 + (Math.min(12, parsedPrimary.value) - 2) * 0.036))
    : 1;

  const currentQuestion = SHAPE_QUIZ_QUESTIONS[quizIndex];

  function handleSelectShape(shapeId) {
    setCurrentShapeId(shapeId);
    recordExploredShape(shapeId);
  }

  function handleSliderChange(event) {
    const val = Number(event.target.value);
    setPrimaryInput(String(val));
    if (isRectangle) {
      setSecondaryInput(String(val * 2));
    }
  }

  function handleQuizOptionClick(optionLabel) {
    if (quizAnswer !== null) return;

    const isCorrect = optionLabel === currentQuestion.correctAnswer;
    recordShapeQuizAnswer({ isCorrect, xpEarned: QUIZ_XP });
    setQuizAnswer({
      selected: optionLabel,
      isCorrect,
    });
  }

  function handleNextRiddle() {
    setQuizIndex((prev) => (prev + 1) % SHAPE_QUIZ_QUESTIONS.length);
    setQuizAnswer(null);
  }

  function getQuizBtnClass(optionLabel) {
    const base =
      'quiz-btn py-2.5 px-2 rounded-md border-2 font-label text-label-lg transition-colors duration-state-change';

    if (quizAnswer === null) {
      return `${base} bg-light-surface-container-low text-light-on-surface border-light-outline-variant hover:border-realm-geometry`;
    }

    if (optionLabel === currentQuestion.correctAnswer) {
      return `${base} bg-light-tertiary-container text-light-on-tertiary-container border-light-tertiary`;
    }

    if (quizAnswer.selected === optionLabel) {
      return `${base} bg-light-error-container text-light-on-error-container border-light-error`;
    }

    return `${base} bg-light-surface-container-low text-light-on-surface-variant border-light-outline-variant opacity-75`;
  }

  return (
    <div className="min-h-screen flex flex-col bg-light-background text-light-on-background">
      <AppHeader />

      {/* Main Shape Explorer Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-page-margin py-gutter-lg flex flex-col gap-gutter-lg">
        {/* 1. Title, Friendly Intro, Back Link & Progress/XP Indicator */}
        <section
          aria-label="Shape explorer header"
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
              <span className="w-12 h-12 rounded-lg bg-realm-geometry-soft text-on-realm-geometry-soft border-2 border-realm-geometry flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-headline-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden="true"
                >
                  pentagon
                </span>
              </span>
              <div>
                <h1 className="font-headline text-headline-lg text-light-on-surface">
                  Shape Explorer
                </h1>
                <p className="font-body text-body-md text-light-on-surface-variant">
                  Tap any geometric shape to inspect its sides, corners, area, and hidden secrets!
                </p>
              </div>
            </div>
          </div>

          {/* Progress & XP Indicator */}
          <div className="flex flex-wrap items-center gap-gutter-sm shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-realm-geometry-soft text-on-realm-geometry-soft border-2 border-realm-geometry">
              <span
                className="material-symbols-outlined text-title-md"
                style={{ fontVariationSettings: "'FILL' 1" }}
                aria-hidden="true"
              >
                explore
              </span>
              <span id="explored-count" className="font-mono text-mono-sm tabular-nums">
                {progress.exploredShapes.length} / {SHAPE_LIST.length} Shapes
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
              <span id="shape-xp" className="font-mono text-mono-sm tabular-nums">
                +{progress.shapeXpEarned} XP
              </span>
            </div>
          </div>
        </section>

        {/* 2. Interactive Shape Cards Collection */}
        <section
          aria-label="Choose a shape to explore"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-gutter-md items-stretch"
        >
          {SHAPE_LIST.map((item) => {
            const isSelected = currentShapeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-shape={item.id}
                aria-pressed={isSelected}
                onClick={() => handleSelectShape(item.id)}
                className={`shape-card h-full p-gutter-md rounded-xl border-2 tile-shadow flex flex-col items-center justify-center gap-gutter-sm hover:-translate-y-0.5 transition-transform duration-state-change ${
                  isSelected
                    ? 'bg-realm-geometry-soft border-realm-geometry'
                    : 'bg-light-surface-container-lowest border-light-outline-variant hover:border-realm-geometry'
                }`}
              >
                <ShapeThumbSvg shapeId={item.id} />
                <span
                  className={`font-title text-title-md ${
                    isSelected ? 'text-on-realm-geometry-soft' : 'text-light-on-surface'
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </section>

        {/* 3. Main Interactive Exploration Area (12 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          {/* Left / Main Focus: Selected Shape Stage & Properties (7 cols) */}
          <section
            aria-label="Selected shape details"
            className="lg:col-span-7 bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow p-gutter-xl flex flex-col gap-gutter-lg"
          >
            {/* Interactive Visual Canvas */}
            <div className="geo-grid-bg bg-light-surface-container-low rounded-xl border-2 border-light-outline-variant p-gutter-xl flex flex-col items-center justify-center gap-gutter-md min-h-[260px]">
              <div
                id="hero-shape-svg"
                className="transition-transform duration-surface-enter ease-surface-enter"
                style={{ transform: `scale(${visualScale})` }}
              >
                <ShapeHeroSvg shapeId={shape.id} />
              </div>
              <span
                id="hero-shape-dim"
                className="font-mono text-mono-sm px-3 py-1 rounded-full bg-light-surface-container-lowest text-light-on-surface border border-light-outline-variant tabular-nums"
              >
                {metrics.dimBadge}
              </span>
            </div>

            {/* Shape Information Section */}
            <div className="flex flex-col gap-gutter-md">
              <div className="flex flex-wrap items-center justify-between gap-gutter-sm">
                <h2
                  id="info-name"
                  className="font-headline text-display-lg-mobile md:text-display-lg text-light-on-surface"
                >
                  {shape.name}
                </h2>
                <div className="flex items-center gap-gutter-sm">
                  <span
                    id="info-sides"
                    className="font-label text-label-lg px-3 py-1 rounded-full bg-realm-geometry-soft text-on-realm-geometry-soft border border-realm-geometry tabular-nums"
                  >
                    {shape.sides}
                  </span>
                  <span
                    id="info-corners"
                    className="font-label text-label-lg px-3 py-1 rounded-full bg-light-secondary-container text-light-on-secondary-container border border-light-secondary tabular-nums"
                  >
                    {shape.corners}
                  </span>
                </div>
              </div>

              <p id="info-fact" className="font-body text-body-lg text-light-on-surface-variant text-pretty">
                {shape.fact}
              </p>

              <div className="p-gutter-md rounded-lg bg-light-surface-container-low border border-light-outline-variant">
                <p className="font-body text-body-md text-light-on-surface text-pretty">
                  <span className="font-label text-realm-geometry">Key Property: </span>
                  {shape.properties}
                </p>
              </div>
            </div>
          </section>

          {/* Right Column: Area & Perimeter Lab + Shape Mini-Quiz (5 cols) */}
          <aside className="lg:col-span-5 flex flex-col gap-gutter-lg">
            {/* Area & Perimeter Lab */}
            <article className="bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow p-gutter-lg flex flex-col gap-gutter-md">
              <header className="flex items-center gap-gutter-sm">
                <span className="w-10 h-10 rounded-md bg-realm-geometry-soft text-on-realm-geometry-soft border border-realm-geometry flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                    straighten
                  </span>
                </span>
                <div>
                  <h2 className="font-headline text-headline-md text-light-on-surface">
                    Area &amp; {shape.secondMetricLabel} Lab
                  </h2>
                  <p id="formula-hint" className="font-label text-label-sm text-light-on-surface-variant">
                    {shape.formula}
                  </p>
                </div>
              </header>

              {/* Size Slider */}
              <div className="flex flex-col gap-gutter-xs">
                <div className="flex items-center justify-between">
                  <label htmlFor="size-slider" className="font-label text-label-lg text-light-on-surface">
                    Adjust Size
                  </label>
                  <span id="slider-val" className="font-mono text-mono-sm text-realm-geometry tabular-nums">
                    {parsedPrimary.valid ? `${parsedPrimary.value} cm` : '—'}
                  </span>
                </div>
                <input
                  id="size-slider"
                  type="range"
                  min="2"
                  max="12"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  className="w-full accent-realm-geometry cursor-pointer"
                />
              </div>

              {/* Numeric Dimension Inputs */}
              <div className={`grid gap-gutter-sm ${isRectangle ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="dimension-primary"
                    className="font-label text-label-sm text-light-on-surface-variant"
                  >
                    {shape.primaryLabel} (cm)
                  </label>
                  <input
                    id="dimension-primary"
                    type="number"
                    min="0.1"
                    step="any"
                    value={primaryInput}
                    onChange={(event) => setPrimaryInput(event.target.value)}
                    placeholder="e.g. 6"
                    className="h-10 px-3 rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant focus:border-realm-geometry focus:outline-none font-mono text-mono-sm tabular-nums"
                  />
                </div>

                {isRectangle && (
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="dimension-secondary"
                      className="font-label text-label-sm text-light-on-surface-variant"
                    >
                      {shape.secondaryLabel} (cm)
                    </label>
                    <input
                      id="dimension-secondary"
                      type="number"
                      min="0.1"
                      step="any"
                      value={secondaryInput}
                      onChange={(event) => setSecondaryInput(event.target.value)}
                      placeholder="e.g. 12"
                      className="h-10 px-3 rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant focus:border-realm-geometry focus:outline-none font-mono text-mono-sm tabular-nums"
                    />
                  </div>
                )}
              </div>

              {!isDimensionValid && (
                <p role="alert" className="font-body text-body-md text-light-error">
                  Please enter a positive dimension between 0.1 and 1000 cm.
                </p>
              )}

              <div className="grid grid-cols-2 gap-gutter-sm">
                <div className="p-3 rounded-lg bg-light-surface-container-low border border-light-outline-variant flex flex-col gap-1">
                  <span className="font-label text-label-sm text-light-on-surface-variant">Area</span>
                  <span id="area-val" className="font-mono text-mono-lg text-light-on-surface tabular-nums">
                    {metrics.area}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-light-surface-container-low border border-light-outline-variant flex flex-col gap-1">
                  <span className="font-label text-label-sm text-light-on-surface-variant">
                    {shape.secondMetricLabel}
                  </span>
                  <span id="perim-val" className="font-mono text-mono-lg text-light-on-surface tabular-nums">
                    {metrics.secondMetric}
                  </span>
                </div>
              </div>

              <p className="font-body text-label-sm text-light-on-surface-variant">
                <strong className="text-light-on-surface">Area</strong> measures the flat space inside
                the shape; <strong className="text-light-on-surface">{shape.secondMetricLabel}</strong>{' '}
                measures the distance all the way around its outside edge.
              </p>
            </article>

            {/* Shape Identification Mini-Quiz */}
            <article className="bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow p-gutter-lg flex flex-col gap-gutter-md">
              <header className="flex items-center justify-between gap-gutter-sm">
                <div className="flex items-center gap-gutter-sm">
                  <span className="w-10 h-10 rounded-md bg-light-secondary-container text-light-on-secondary-container border border-light-secondary flex items-center justify-center shrink-0">
                    <span
                      className="material-symbols-outlined text-title-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                      aria-hidden="true"
                    >
                      quiz
                    </span>
                  </span>
                  <div>
                    <h2 className="font-headline text-headline-md text-light-on-surface">
                      Shape Riddle
                    </h2>
                    <span className="font-mono text-mono-sm text-light-on-surface-variant tabular-nums">
                      Score: {progress.shapeQuizCorrect}/{progress.shapeQuizAttempted}
                    </span>
                  </div>
                </div>
                <span className="font-label text-label-sm text-light-secondary tabular-nums">
                  +{QUIZ_XP} XP
                </span>
              </header>

              <p className="font-body text-body-md text-light-on-surface text-pretty">
                {currentQuestion.prompt}
              </p>

              <div className="grid grid-cols-3 gap-gutter-xs">
                {currentQuestion.options.map((optionLabel) => (
                  <button
                    key={optionLabel}
                    type="button"
                    disabled={quizAnswer !== null}
                    onClick={() => handleQuizOptionClick(optionLabel)}
                    className={getQuizBtnClass(optionLabel)}
                  >
                    {optionLabel}
                  </button>
                ))}
              </div>

              {quizAnswer !== null && (
                <div
                  id="quiz-feedback"
                  aria-live="polite"
                  className={`p-3 rounded-lg border-2 flex flex-col gap-gutter-sm ${
                    quizAnswer.isCorrect
                      ? 'bg-light-tertiary-container border-light-tertiary text-light-on-tertiary-container'
                      : 'bg-light-error-container border-light-error text-light-on-error-container'
                  }`}
                >
                  <p className="font-body text-body-md">
                    {quizAnswer.isCorrect
                      ? `Correct! ${currentQuestion.explanation} +${QUIZ_XP} XP!`
                      : `Not quite! The answer is ${currentQuestion.correctAnswer}. ${currentQuestion.explanation}`}
                  </p>
                  <button
                    type="button"
                    onClick={handleNextRiddle}
                    className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-on-surface tile-shadow hover:bg-light-surface-container-low font-label text-label-sm"
                  >
                    <span>Next Question</span>
                    <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                      arrow_forward
                    </span>
                  </button>
                </div>
              )}
            </article>
          </aside>
        </div>
      </main>
    </div>
  );
}
