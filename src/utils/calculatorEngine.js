import { getSession } from './authStorage';

const HISTORY_KEY_PREFIX = 'quantaquest_calc_history_';
const MAX_HISTORY_ITEMS = 4;

function getHistoryKey(studentId) {
  const resolvedId = studentId || getSession()?.studentId;
  if (!resolvedId) return null;
  return `${HISTORY_KEY_PREFIX}${resolvedId}`;
}

export function loadCalculatorHistory(studentId) {
  const key = getHistoryKey(studentId);
  if (!key) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.slice(0, MAX_HISTORY_ITEMS);
  } catch {
    return [];
  }
}

export function saveCalculatorHistory(items, studentId) {
  const trimmed = items.slice(0, MAX_HISTORY_ITEMS);
  const key = getHistoryKey(studentId);
  if (!key) return trimmed;
  try {
    window.localStorage.setItem(key, JSON.stringify(trimmed));
  } catch {
    // Ignore storage quota errors
  }
  return trimmed;
}

function tokenize(rawExpression) {
  const normalized = rawExpression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .trim();

  if (!normalized) {
    return { error: 'Enter a number or expression first.' };
  }

  const tokens = [];
  let index = 0;

  while (index < normalized.length) {
    const ch = normalized[index];

    if (/\s/.test(ch)) {
      index += 1;
      continue;
    }

    if (/[0-9.]/.test(ch)) {
      let numStr = '';
      let dotCount = 0;
      while (index < normalized.length && /[0-9.]/.test(normalized[index])) {
        if (normalized[index] === '.') {
          dotCount += 1;
          if (dotCount > 1) {
            return { error: 'Invalid number: too many decimal points.' };
          }
        }
        numStr += normalized[index];
        index += 1;
      }
      if (numStr === '.') {
        return { error: 'Invalid decimal point without digits.' };
      }
      const value = Number(numStr);
      if (!Number.isFinite(value)) {
        return { error: 'Number is too large to calculate.' };
      }
      tokens.push({ type: 'number', value });
      continue;
    }

    if (['+', '-', '*', '/', '%', '(', ')'].includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      index += 1;
      continue;
    }

    return { error: `Unsupported symbol "${ch}" in expression.` };
  }

  return { tokens };
}

function formatNumber(num) {
  if (!Number.isFinite(num)) {
    return null;
  }
  const normalizedZero = Object.is(num, -0) ? 0 : num;
  const rounded = Math.round(normalizedZero * 1e10) / 1e10;
  return String(rounded);
}

/**
 * Safely evaluates an arithmetic expression using a recursive-descent parser
 * (no eval or Function). Supports +, -, *, /, %, parentheses, and unary +/-.
 */
export function evaluateCalculatorExpression(rawExpression) {
  const tokenized = tokenize(rawExpression);
  if (tokenized.error) {
    return { ok: false, error: tokenized.error };
  }

  const { tokens } = tokenized;
  let pos = 0;

  function peek() {
    return tokens[pos] || null;
  }

  function consume() {
    const current = tokens[pos];
    pos += 1;
    return current;
  }

  function parseExpression() {
    let left = parseTerm();
    while (peek() && peek().type === 'op' && (peek().value === '+' || peek().value === '-')) {
      const op = consume().value;
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseTerm() {
    let left = parseUnary();
    while (peek() && peek().type === 'op' && (peek().value === '*' || peek().value === '/')) {
      const op = consume().value;
      const right = parseUnary();
      if (op === '/') {
        if (right === 0) {
          throw new Error('Cannot divide by zero.');
        }
        left /= right;
      } else {
        left *= right;
      }
    }
    return left;
  }

  function parseUnary() {
    const token = peek();
    if (token && token.type === 'op' && (token.value === '+' || token.value === '-')) {
      consume();
      const operand = parseUnary();
      return token.value === '-' ? -operand : operand;
    }
    return parsePostfix();
  }

  function parsePostfix() {
    let value = parsePrimary();
    while (peek() && peek().type === 'op' && peek().value === '%') {
      consume();
      value /= 100;
    }
    return value;
  }

  function parsePrimary() {
    const token = peek();
    if (!token) {
      throw new Error('Incomplete expression — finish entering a number.');
    }

    if (token.type === 'number') {
      consume();
      return token.value;
    }

    if (token.type === 'op' && token.value === '(') {
      consume();
      const inner = parseExpression();
      const closing = peek();
      if (!closing || closing.type !== 'op' || closing.value !== ')') {
        throw new Error('Missing closing parenthesis.');
      }
      consume();
      return inner;
    }

    throw new Error('Invalid expression — check your operators.');
  }

  try {
    const rawValue = parseExpression();
    if (pos < tokens.length) {
      return { ok: false, error: 'Invalid expression — unexpected value.' };
    }
    const formatted = formatNumber(rawValue);
    if (formatted === null) {
      return { ok: false, error: 'Result is out of range.' };
    }
    return { ok: true, result: formatted };
  } catch (err) {
    return { ok: false, error: err.message || 'Invalid expression.' };
  }
}
