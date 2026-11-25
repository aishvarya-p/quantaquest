import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../context/useAuth';
import {
  evaluateCalculatorExpression,
  loadCalculatorHistory,
  saveCalculatorHistory,
} from '../utils/calculatorEngine';

const OPERATORS = ['+', '−', '×', '÷'];

function getCurrentNumberSegment(expr) {
  const parts = expr.split(/[+−×÷\s]+/);
  return parts[parts.length - 1] || '';
}

export default function CalculatorPage() {
  const { currentUser } = useAuth();
  const studentId = currentUser?.id;

  const [history, setHistory] = useState(() => loadCalculatorHistory(studentId));
  const [expression, setExpression] = useState(() => {
    const initial = loadCalculatorHistory(studentId);
    return initial.length > 0 ? initial[0].expression : '0';
  });
  const [result, setResult] = useState(() => {
    const initial = loadCalculatorHistory(studentId);
    return initial.length > 0 ? initial[0].result : '0';
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [freshResult, setFreshResult] = useState(true);

  const handleClear = useCallback(() => {
    setExpression('0');
    setResult('0');
    setErrorMessage('');
    setFreshResult(true);
  }, []);

  const handleDelete = useCallback(() => {
    setErrorMessage('');
    if (freshResult || expression.length <= 1) {
      setExpression('0');
      setFreshResult(true);
      return;
    }

    const trimmed = expression.trimEnd();
    const lastChar = trimmed.slice(-1);
    if (OPERATORS.includes(lastChar)) {
      const next = trimmed.slice(0, -1).trimEnd() || '0';
      setExpression(next);
      return;
    }

    const next = trimmed.slice(0, -1).trimEnd() || '0';
    setExpression(next);
  }, [expression, freshResult]);

  const handleDigit = useCallback(
    (digit) => {
      setErrorMessage('');
      if (freshResult) {
        setExpression(digit);
        setFreshResult(false);
        return;
      }

      const segment = getCurrentNumberSegment(expression);
      if (segment.endsWith('%')) {
        setExpression((prev) => `${prev} × ${digit}`);
        return;
      }

      if (expression === '0') {
        setExpression(digit);
        return;
      }

      if (segment === '0') {
        setExpression((prev) => prev.slice(0, -1) + digit);
        return;
      }

      setExpression((prev) => prev + digit);
    },
    [expression, freshResult]
  );

  const handleDecimal = useCallback(() => {
    setErrorMessage('');
    if (freshResult) {
      setExpression('0.');
      setFreshResult(false);
      return;
    }

    const segment = getCurrentNumberSegment(expression);
    if (segment.includes('.')) {
      return;
    }

    if (segment.endsWith('%')) {
      setExpression((prev) => `${prev} × 0.`);
      return;
    }

    const trimmed = expression.trimEnd();
    const lastChar = trimmed.slice(-1);
    if (!trimmed || OPERATORS.includes(lastChar)) {
      setExpression((prev) => `${prev}0.`);
      return;
    }

    setExpression((prev) => `${prev}.`);
  }, [expression, freshResult]);

  const handleOperator = useCallback(
    (op) => {
      setErrorMessage('');
      if (freshResult) {
        const base = errorMessage ? '0' : result;
        setExpression(`${base} ${op} `);
        setFreshResult(false);
        return;
      }

      const trimmed = expression.trimEnd();
      const lastChar = trimmed.slice(-1);
      if (OPERATORS.includes(lastChar)) {
        setExpression(`${trimmed.slice(0, -1).trimEnd()} ${op} `);
        return;
      }

      setExpression(`${trimmed} ${op} `);
    },
    [errorMessage, expression, freshResult, result]
  );

  const handlePercent = useCallback(() => {
    setErrorMessage('');
    if (freshResult) {
      if (errorMessage) return;
      setExpression(`${result}%`);
      setFreshResult(false);
      return;
    }

    const trimmed = expression.trimEnd();
    const lastChar = trimmed.slice(-1);
    if (!/[0-9]/.test(lastChar)) {
      return;
    }

    setExpression(`${trimmed}%`);
  }, [errorMessage, expression, freshResult, result]);

  const handleEquals = useCallback(() => {
    const evaluation = evaluateCalculatorExpression(expression);
    if (!evaluation.ok) {
      setErrorMessage(evaluation.error);
      setFreshResult(false);
      return;
    }

    setErrorMessage('');
    setResult(evaluation.result);
    setFreshResult(true);

    setHistory((prev) => {
      const cleanExpr = expression.trim();
      const filtered = prev.filter(
        (item) => !(item.expression === cleanExpr && item.result === evaluation.result)
      );
      const next = [{ expression: cleanExpr, result: evaluation.result }, ...filtered].slice(0, 4);
      return saveCalculatorHistory(next, studentId);
    });
  }, [expression, studentId]);

  function handleReuseHistory(item) {
    setExpression(item.expression);
    setResult(item.result);
    setErrorMessage('');
    setFreshResult(true);
  }

  function handleClearHistory() {
    setHistory(saveCalculatorHistory([], studentId));
  }

  useEffect(() => {
    function onKeyDown(event) {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const { key } = event;

      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        handleDigit(key);
      } else if (key === '.') {
        event.preventDefault();
        handleDecimal();
      } else if (key === '+') {
        event.preventDefault();
        handleOperator('+');
      } else if (key === '-') {
        event.preventDefault();
        handleOperator('−');
      } else if (key === '*' || key === 'x' || key === 'X') {
        event.preventDefault();
        handleOperator('×');
      } else if (key === '/') {
        event.preventDefault();
        handleOperator('÷');
      } else if (key === '%') {
        event.preventDefault();
        handlePercent();
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        event.preventDefault();
        handleDelete();
      } else if (key === 'Escape' || key === 'Delete') {
        event.preventDefault();
        handleClear();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    handleClear,
    handleDecimal,
    handleDelete,
    handleDigit,
    handleEquals,
    handleOperator,
    handlePercent,
  ]);

  const digitBtnClass =
    'calc-btn h-14 rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant tile-shadow hover:bg-light-surface-container-low active:translate-y-0.5 transition-transform duration-state-change';
  const operatorBtnClass =
    'calc-btn h-14 rounded-md bg-realm-calculator-soft text-on-realm-calculator-soft border-2 border-realm-calculator tile-shadow hover:-translate-y-0.5 active:translate-y-0.5 transition-transform duration-state-change';

  return (
    <div className="min-h-screen flex flex-col bg-light-background text-light-on-background">
      <AppHeader />

      {/* Main Smart Calculator Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-page-margin py-gutter-lg flex flex-col gap-gutter-lg">
        {/* 1. Title, Friendly Description & Return to Dashboard */}
        <section aria-label="Calculator header" className="flex flex-col gap-gutter-sm">
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
            <span className="w-12 h-12 rounded-lg bg-realm-calculator-soft text-on-realm-calculator-soft border-2 border-realm-calculator flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-headline-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
                aria-hidden="true"
              >
                calculate
              </span>
            </span>
            <div>
              <h1 className="font-headline text-headline-lg text-light-on-surface">
                Smart Calculator
              </h1>
              <p className="font-body text-body-md text-light-on-surface-variant">
                Explore numbers, test patterns, and see every calculation clearly.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Calculator & Supporting History/Tip Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          {/* Primary Focus: Interactive Calculator (7 cols) */}
          <section
            aria-label="Calculator"
            className="lg:col-span-7 bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow p-gutter-lg flex flex-col gap-gutter-md"
          >
            {/* Display Area */}
            <div className="bg-light-surface-container-low rounded-lg border-2 border-light-outline-variant p-gutter-lg flex flex-col items-end justify-between gap-gutter-xs min-h-[124px]">
              <span
                id="calc-expression"
                className="font-mono text-mono-lg text-light-on-surface-variant tabular-nums break-all text-right"
              >
                {expression}
              </span>
              {errorMessage ? (
                <output
                  id="calc-result"
                  htmlFor="calc-expression"
                  aria-live="polite"
                  className="font-body text-title-lg text-light-error text-right"
                >
                  {errorMessage}
                </output>
              ) : (
                <output
                  id="calc-result"
                  htmlFor="calc-expression"
                  aria-live="polite"
                  className="font-mono text-display-lg-mobile sm:text-display-lg text-light-on-surface tabular-nums break-all text-right"
                >
                  {result}
                </output>
              )}
            </div>

            {/* Calculator Keypad */}
            <div className="grid grid-cols-4 gap-gutter-sm" role="group" aria-label="Calculator keypad">
              {/* Row 1: Clear All, Delete, Percent, Divide */}
              <button
                type="button"
                aria-label="Clear all"
                onClick={handleClear}
                className="calc-btn h-14 rounded-md bg-realm-challenge-soft text-on-realm-challenge-soft border-2 border-realm-challenge tile-shadow hover:-translate-y-0.5 active:translate-y-0.5 transition-transform duration-state-change"
              >
                <span className="font-title text-title-lg">AC</span>
              </button>
              <button
                type="button"
                aria-label="Delete last character"
                onClick={handleDelete}
                className="calc-btn h-14 rounded-md bg-light-surface-container text-light-on-surface border-2 border-light-outline-variant tile-shadow hover:bg-light-surface-container-high active:translate-y-0.5 transition-transform duration-state-change flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                  backspace
                </span>
              </button>
              <button
                type="button"
                aria-label="Percent"
                onClick={handlePercent}
                className={operatorBtnClass}
              >
                <span className="font-mono text-mono-lg">%</span>
              </button>
              <button
                type="button"
                aria-label="Divide"
                onClick={() => handleOperator('÷')}
                className={operatorBtnClass}
              >
                <span className="font-mono text-mono-lg">÷</span>
              </button>

              {/* Row 2: 7, 8, 9, Multiply */}
              <button type="button" onClick={() => handleDigit('7')} className={digitBtnClass}>
                <span className="font-mono text-mono-lg tabular-nums">7</span>
              </button>
              <button type="button" onClick={() => handleDigit('8')} className={digitBtnClass}>
                <span className="font-mono text-mono-lg tabular-nums">8</span>
              </button>
              <button type="button" onClick={() => handleDigit('9')} className={digitBtnClass}>
                <span className="font-mono text-mono-lg tabular-nums">9</span>
              </button>
              <button
                type="button"
                aria-label="Multiply"
                onClick={() => handleOperator('×')}
                className={operatorBtnClass}
              >
                <span className="font-mono text-mono-lg">×</span>
              </button>

              {/* Row 3: 4, 5, 6, Subtract */}
              <button type="button" onClick={() => handleDigit('4')} className={digitBtnClass}>
                <span className="font-mono text-mono-lg tabular-nums">4</span>
              </button>
              <button type="button" onClick={() => handleDigit('5')} className={digitBtnClass}>
                <span className="font-mono text-mono-lg tabular-nums">5</span>
              </button>
              <button type="button" onClick={() => handleDigit('6')} className={digitBtnClass}>
                <span className="font-mono text-mono-lg tabular-nums">6</span>
              </button>
              <button
                type="button"
                aria-label="Subtract"
                onClick={() => handleOperator('−')}
                className={operatorBtnClass}
              >
                <span className="font-mono text-mono-lg">−</span>
              </button>

              {/* Row 4: 1, 2, 3, Add */}
              <button type="button" onClick={() => handleDigit('1')} className={digitBtnClass}>
                <span className="font-mono text-mono-lg tabular-nums">1</span>
              </button>
              <button type="button" onClick={() => handleDigit('2')} className={digitBtnClass}>
                <span className="font-mono text-mono-lg tabular-nums">2</span>
              </button>
              <button type="button" onClick={() => handleDigit('3')} className={digitBtnClass}>
                <span className="font-mono text-mono-lg tabular-nums">3</span>
              </button>
              <button
                type="button"
                aria-label="Add"
                onClick={() => handleOperator('+')}
                className={operatorBtnClass}
              >
                <span className="font-mono text-mono-lg">+</span>
              </button>

              {/* Row 5: 0 (wide), Decimal, Equals */}
              <button
                type="button"
                onClick={() => handleDigit('0')}
                className={`${digitBtnClass} col-span-2`}
              >
                <span className="font-mono text-mono-lg tabular-nums">0</span>
              </button>
              <button
                type="button"
                aria-label="Decimal point"
                onClick={handleDecimal}
                className={digitBtnClass}
              >
                <span className="font-mono text-mono-lg">.</span>
              </button>
              <button
                type="button"
                aria-label="Equals"
                onClick={handleEquals}
                className="calc-btn h-14 rounded-md bg-realm-calculator text-on-realm-calculator border-2 border-light-on-surface tile-shadow-ink hover:bg-light-primary active:translate-y-0.5 transition-transform duration-state-change"
              >
                <span className="font-mono text-mono-lg">=</span>
              </button>
            </div>
          </section>

          {/* Supporting Column: Recent History & Math Tip (5 cols) */}
          <aside className="lg:col-span-5 flex flex-col gap-gutter-lg">
            {/* Recent Calculations History */}
            <article className="bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow p-gutter-lg flex flex-col gap-gutter-md">
              <header className="flex items-center justify-between gap-gutter-sm">
                <div className="flex items-center gap-gutter-sm">
                  <span className="w-10 h-10 rounded-md bg-realm-calculator-soft text-on-realm-calculator-soft border border-realm-calculator flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                      history
                    </span>
                  </span>
                  <h2 className="font-headline text-headline-md text-light-on-surface">
                    Recent History
                  </h2>
                </div>
                <div className="flex items-center gap-gutter-sm">
                  {history.length > 0 ? (
                    <button
                      type="button"
                      onClick={handleClearHistory}
                      className="font-label text-label-sm px-2.5 py-1 rounded-md border border-light-outline-variant text-realm-challenge hover:bg-realm-challenge-soft hover:border-realm-challenge transition-colors duration-state-change"
                    >
                      Clear
                    </button>
                  ) : (
                    <span className="font-label text-label-sm text-light-on-surface-variant">
                      Tap to reuse
                    </span>
                  )}
                </div>
              </header>

              {history.length === 0 ? (
                <p className="font-body text-body-md text-light-on-surface-variant p-3 rounded-lg bg-light-surface-container-low border border-dashed border-light-outline-variant text-center">
                  No recent calculations yet. Press = to save one here.
                </p>
              ) : (
                <ul id="history-list" className="flex flex-col gap-gutter-sm">
                  {history.map((item, idx) => (
                    <li key={`${item.expression}-${item.result}-${idx}`}>
                      <button
                        type="button"
                        onClick={() => handleReuseHistory(item)}
                        className="history-item w-full p-3 rounded-lg bg-light-surface-container-low border border-light-outline-variant hover:border-realm-calculator flex items-center justify-between gap-gutter-sm text-left transition-colors duration-state-change"
                      >
                        <span className="font-mono text-mono-sm text-light-on-surface-variant tabular-nums">
                          {item.expression}
                        </span>
                        <span className="font-mono text-mono-lg text-light-on-surface tabular-nums">
                          = {item.result}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            {/* Subtle Educational Math Tip */}
            <article className="bg-light-surface-container-lowest text-light-on-surface rounded-xl border-2 border-light-outline-variant tile-shadow p-gutter-lg flex flex-col gap-gutter-sm">
              <header className="flex items-center gap-gutter-sm">
                <span className="w-10 h-10 rounded-md bg-light-secondary-container text-light-on-secondary-container border border-light-secondary flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-title-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    tips_and_updates
                  </span>
                </span>
                <h2 className="font-headline text-headline-md text-light-on-surface">
                  Explorer Tip
                </h2>
              </header>
              <p className="font-body text-body-md text-light-on-surface-variant text-pretty">
                Finding 25% of any number is the same as dividing it by 4! Try typing 80 ÷ 4 or
                25% × 80 to see that they both equal 20.
              </p>
            </article>
          </aside>
        </div>
      </main>
    </div>
  );
}
