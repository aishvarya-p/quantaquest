export const TOTAL_QUESTIONS = 10;

export const DIFFICULTIES = {
  easy: {
    id: 'easy',
    label: 'Explorer',
    waveName: 'Explorer Wave',
    timeLimit: 45,
    xpPerCorrect: 15,
  },
  medium: {
    id: 'medium',
    label: 'Trailblazer',
    waveName: 'Trailblazer Wave',
    timeLimit: 30,
    xpPerCorrect: 25,
  },
  hard: {
    id: 'hard',
    label: 'Master',
    waveName: 'Master Wave',
    timeLimit: 20,
    xpPerCorrect: 40,
  },
};

const CHOICE_LETTERS = ['A', 'B', 'C', 'D'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildOptions(answer, operation) {
  const candidates = new Set([answer]);
  const offsets =
    operation === 'multiplication' || operation === 'division'
      ? [-12, -10, -6, -4, -3, -2, -1, 1, 2, 3, 4, 6, 10, 12]
      : [-10, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 10];

  const shuffledOffsets = shuffle(offsets);
  for (const offset of shuffledOffsets) {
    if (candidates.size >= 4) break;
    const candidate = answer + offset;
    if (candidate >= 0 && candidate !== answer) {
      candidates.add(candidate);
    }
  }

  let step = 1;
  while (candidates.size < 4) {
    const fallback = answer + step;
    if (!candidates.has(fallback)) {
      candidates.add(fallback);
    }
    step += 1;
  }

  return shuffle([...candidates]).map((value, index) => ({
    letter: CHOICE_LETTERS[index],
    value,
    label: String(value),
    isCorrect: value === answer,
  }));
}

function buildAdditionQuestion(difficulty) {
  const ranges = {
    easy: [4, 24],
    medium: [15, 95],
    hard: [65, 280],
  };
  const [min, max] = ranges[difficulty];
  const a = randomInt(min, max);
  const b = randomInt(min, max);
  const answer = a + b;

  const aTens = Math.floor(a / 10) * 10;
  const aOnes = a % 10;
  const bTens = Math.floor(b / 10) * 10;
  const bOnes = b % 10;

  return {
    operation: 'addition',
    topic: 'Addition Sprint',
    prompt: `What is ${a} + ${b}?`,
    hint:
      a >= 10 && b >= 10
        ? `Break each number into tens and ones: add ${aTens} + ${bTens} first, then add ${aOnes} + ${bOnes}, and combine both sums.`
        : `Start at the larger number (${Math.max(a, b)}) and count up by ${Math.min(a, b)}.`,
    explanation: `${a} + ${b} = ${answer}.`,
    answer,
    options: buildOptions(answer, 'addition'),
  };
}

function buildSubtractionQuestion(difficulty) {
  const ranges = {
    easy: { minA: 8, maxA: 30, minB: 2 },
    medium: { minA: 35, maxA: 140, minB: 11 },
    hard: { minA: 120, maxA: 420, minB: 35 },
  };
  const { minA, maxA, minB } = ranges[difficulty];
  const a = randomInt(minA, maxA);
  const b = randomInt(minB, Math.max(minB, a - 2));
  const answer = a - b;

  const bTens = Math.floor(b / 10) * 10;
  const bOnes = b % 10;

  return {
    operation: 'subtraction',
    topic: 'Subtraction Check',
    prompt: `Solve: ${a} − ${b} = ?`,
    hint:
      b >= 10
        ? `Subtract in two steps: first take away ${bTens} from ${a}, then subtract the remaining ${bOnes}.`
        : `Count backward ${b} steps from ${a}, or think: what number plus ${b} equals ${a}?`,
    explanation: `${a} − ${b} = ${answer}.`,
    answer,
    options: buildOptions(answer, 'subtraction'),
  };
}

function buildMultiplicationQuestion(difficulty) {
  const ranges = {
    easy: { minA: 2, maxA: 9, minB: 2, maxB: 9 },
    medium: { minA: 4, maxA: 14, minB: 3, maxB: 12 },
    hard: { minA: 11, maxA: 24, minB: 6, maxB: 16 },
  };
  const { minA, maxA, minB, maxB } = ranges[difficulty];
  const a = randomInt(minA, maxA);
  const b = randomInt(minB, maxB);
  const answer = a * b;

  const splitA = Math.floor(a / 10) * 10;
  const remA = a % 10;

  return {
    operation: 'multiplication',
    topic: 'Multiplication Power',
    prompt: `What is ${a} × ${b}?`,
    hint:
      a >= 12 && remA > 0
        ? `Split ${a} into ${splitA} + ${remA}. Multiply ${splitA} × ${b} and ${remA} × ${b}, then add both products together.`
        : `Think of ${a} groups of ${b}, or skip-count by ${b} a total of ${a} times.`,
    explanation: `${a} × ${b} = ${answer}.`,
    answer,
    options: buildOptions(answer, 'multiplication'),
  };
}

function buildDivisionQuestion(difficulty) {
  const ranges = {
    easy: { minDiv: 2, maxDiv: 9, minQuot: 2, maxQuot: 10 },
    medium: { minDiv: 3, maxDiv: 12, minQuot: 3, maxQuot: 15 },
    hard: { minDiv: 5, maxDiv: 18, minQuot: 6, maxQuot: 24 },
  };
  const { minDiv, maxDiv, minQuot, maxQuot } = ranges[difficulty];
  const divisor = randomInt(minDiv, maxDiv);
  const quotient = randomInt(minQuot, maxQuot);
  const dividend = divisor * quotient;

  return {
    operation: 'division',
    topic: 'Division Quest',
    prompt: `Solve: ${dividend} ÷ ${divisor} = ?`,
    hint:
      quotient > 10
        ? `Think in reverse with multiplication: ${divisor} × ? = ${dividend}. Start with ${divisor} × 10 = ${divisor * 10} to estimate.`
        : `Think in reverse with multiplication: ${divisor} × ? = ${dividend}. Try skip-counting by ${divisor} to reach ${dividend}.`,
    explanation: `${dividend} ÷ ${divisor} = ${quotient} because ${divisor} × ${quotient} = ${dividend}.`,
    answer: quotient,
    options: buildOptions(quotient, 'division'),
  };
}

export function generateQuestionSet(difficulty = 'medium', count = TOTAL_QUESTIONS) {
  const builders = [
    buildAdditionQuestion,
    buildSubtractionQuestion,
    buildMultiplicationQuestion,
    buildDivisionQuestion,
  ];

  const opsPattern = [];
  while (opsPattern.length < count) {
    opsPattern.push(...shuffle(builders));
  }

  return opsPattern.slice(0, count).map((buildFn, idx) => ({
    id: `${difficulty}-${Date.now()}-${idx}`,
    ...buildFn(difficulty),
  }));
}

export function formatTimer(seconds) {
  const safe = Math.max(0, seconds);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
