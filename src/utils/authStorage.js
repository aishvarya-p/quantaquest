import { initializeStudentProgress } from './progressStorage.js';

const USERS_KEY = 'quantaquest_users';
const SESSION_KEY = 'quantaquest_session';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function generateStudentId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `student_${crypto.randomUUID()}`;
  }
  return `student_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export function loadUsers() {
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch {
    return false;
  }
}

export function getSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.studentId !== 'string' || !parsed.studentId) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveSession(studentId) {
  const session = {
    studentId,
    loggedInAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  } catch {
    return null;
  }
}

export function logoutUser() {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore storage removal errors
  }
}

export function getCurrentUser() {
  const session = getSession();
  if (!session) return null;

  const users = loadUsers();
  const match = users.find((user) => user.id === session.studentId);
  if (!match) {
    logoutUser();
    return null;
  }

  return toPublicUser(match);
}

export function validateEmail(email) {
  return EMAIL_REGEX.test(normalizeEmail(email));
}

export function registerUser({ name, email, password, confirmPassword }) {
  const cleanName = String(name || '').trim();
  const cleanEmail = normalizeEmail(email);
  const rawPassword = String(password || '');
  const rawConfirm = String(confirmPassword || '');

  if (!cleanName || !cleanEmail || !rawPassword || !rawConfirm) {
    return { ok: false, error: 'Please fill in all fields to create your account.' };
  }

  if (cleanName.length < 2) {
    return { ok: false, error: 'Student name must be at least 2 characters long.' };
  }

  if (!validateEmail(cleanEmail)) {
    return { ok: false, error: 'Please enter a valid email address (for example, maya@school.edu).' };
  }

  if (rawPassword.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters long.' };
  }

  if (rawPassword !== rawConfirm) {
    return { ok: false, error: 'Password and confirm password do not match.' };
  }

  const users = loadUsers();
  const duplicate = users.some((user) => normalizeEmail(user.email) === cleanEmail);
  if (duplicate) {
    return {
      ok: false,
      error: 'An account with this email already exists. Try logging in instead.',
    };
  }

  const newUser = {
    id: generateStudentId(),
    name: cleanName,
    email: cleanEmail,
    password: rawPassword,
    createdAt: new Date().toISOString(),
  };

  const saved = saveUsers([...users, newUser]);
  if (!saved) {
    return { ok: false, error: 'Unable to save account in browser storage.' };
  }

  saveSession(newUser.id);
  initializeStudentProgress(newUser.id);
  return { ok: true, user: toPublicUser(newUser) };
}

export function loginUser({ email, password }) {
  const cleanEmail = normalizeEmail(email);
  const rawPassword = String(password || '');

  if (!cleanEmail || !rawPassword) {
    return { ok: false, error: 'Please enter both your email and password.' };
  }

  if (!validateEmail(cleanEmail)) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }

  const users = loadUsers();
  const match = users.find((user) => normalizeEmail(user.email) === cleanEmail);

  if (!match || match.password !== rawPassword) {
    return {
      ok: false,
      error: 'Incorrect email or password. Please check your details and try again.',
    };
  }

  saveSession(match.id);
  return { ok: true, user: toPublicUser(match) };
}
