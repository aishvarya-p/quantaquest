# QuantaQuest – Learn Mathematics Through Adventure

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000)](https://react.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=fff)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React%20Router-7-CA4245?logo=reactrouter&logoColor=fff)](https://reactrouter.com/)
[![Storage](https://img.shields.io/badge/Persistence-localStorage-0F766E)](#current-implementation-notes)

A gamified mathematics learning platform designed for school students. Students explore interactive mathematical activities, earn XP, unlock achievements, track their progress, and level up through an adventure-themed interface.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Current Implementation Notes](#current-implementation-notes)
- [Future Enhancements](#future-enhancements)

## Project Overview

QuantaQuest turns core school mathematics into interactive learning realms accessible from a central Adventure Atlas dashboard. Students register an individual demo account, earn Experience Points (XP) across practice modules, build daily activity streaks, unlock badges, and advance through 10 explorer levels with level-up celebrations.

## Features

### Math Challenge (`/challenge`)

- **Three Difficulty Levels:** Explorer (45s timer, +15 XP), Trailblazer (30s timer, +25 XP), and Master (20s timer, +40 XP), each scaling operand complexity.
- **10-Question Waves:** Balanced random arithmetic problems covering addition, subtraction, multiplication, and exact-integer division with four multiple-choice options (`A`–`D`).
- **Timer, Hints & Explanations:** Per-question countdown with timeout handling, collapsible strategy hints, immediate right/wrong feedback, single-submission locking, and a completion summary with **Play Again**.

### Smart Calculator (`/calculator`)

- **Safe Expression Evaluator:** Custom recursive-descent parser supporting `+`, `−`, `×`, `÷`, decimals, percentages (`%`), parentheses, and operator precedence without `eval()` or `Function()`.
- **Error Handling:** Prevents division by zero and displays clear messages for incomplete or invalid expressions.
- **History & Keyboard Support:** Full keyboard input (`0–9`, `.`, `+`, `-`, `*`/`x`, `/`, `%`, `Enter`/`=`, `Backspace`, `Escape`/`Delete`) and per-student recent calculation history (latest 4 entries) with click-to-reuse and clear controls.

### Tables Practice (`/tables`)

- **Tables 1–20:** Interactive table grid for selecting any multiplication table from `1×` to `20×`.
- **Learn Mode:** Step-by-step fact spotlight (`Previous` and `Next Fact`) alongside a clickable `×1` to `×12` reference grid.
- **Practice Mode:** Randomized `×1`–`×12` questions with whole-number input validation, immediate feedback (+20 XP), accuracy tracking, and streak counter.
- **Timed Challenge:** 60-second sprint awarding +25 XP per correct answer, ending with a results summary and restart option.

### Shape Explorer (`/shapes`)

- **Six Geometric Shapes:** Circle, Triangle, Square, Rectangle, Pentagon, and Hexagon with custom SVG diagrams, side/corner counts, and student-friendly property explanations.
- **Area, Perimeter & Circumference Lab:** Live calculations driven by both a size slider and validated numeric dimension inputs (including length and width for rectangles, and circumference for circles).
- **Shape Riddle Quiz:** Multiple-choice shape identification questions with single-submission locking, explanations, and +25 XP rewards.

### Gamification

- **Shared XP & 10-Level Progression:** Unified XP earned in Math Challenge, Tables Practice, and Shape Explorer advances students from Level 1 (`0 XP`) to Level 10 (`2,700 XP`), with XP continuing to accumulate past `2,700 XP`. (Smart Calculator does not award XP.)
- **Level-Up Celebrations:** Crossing a level threshold opens a responsive CSS-animated **LEVEL UP!** modal displaying the highest newly reached level.
- **Badges & Streaks:** Tracks daily learning streaks and four achievement badges (*Prime Hunter*, *Spark Streak*, *Shape Tamer*, *Table Titan*).
- **Theme Workshop:**
  - *Implemented:* Displays *Sunlit Atlas* (default unlocked), *Coral Reef* (unlocks at `50 XP`), and a locked *Cosmic Lab* (`Lvl 8`) preview tile; persists the student's selected theme in `localStorage` and opens a **Preview Themes** comparison modal.
  - *Planned:* Full global re-theming across all pages (including activating *Coral Reef* colors app-wide and *Cosmic Lab* dark mode).

### Student Accounts

- **Authentication Routes:** Dedicated `/welcome`, `/login`, and `/register` pages for unauthenticated visitors, with route guards protecting `/`, `/challenge`, `/calculator`, `/tables`, and `/shapes`.
- **Isolated Student Profiles:** Newly registered students start at Level 1 with `0` XP and maintain independent XP, streaks, badges, theme selections, explored shapes, and calculator history.

## Technology Stack

- **UI Library:** React 19 (`react`, `react-dom`)
- **Language:** JavaScript (ES Modules)
- **Build Tool:** Vite 8 (`vite`, `@vitejs/plugin-react`)
- **Styling:** Tailwind CSS 3 (`tailwindcss` 3.4.17, `postcss`, `autoprefixer`)
- **Routing:** React Router DOM (`react-router-dom`)
- **Persistence:** Browser `localStorage`
- **Fonts & Icons:** Google Fonts (`Shantell Sans`, `Capriola`, `Source Code Pro`) and Material Symbols Outlined
- **Linter:** Oxlint (`oxlint`)

## Project Structure

```text
quantaquest-app/
├── public/
│   ├── assets/
│   │   ├── adventure-island.png
│   │   └── maya-avatar.png
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AdventureProgressCard.jsx
│   │   │   ├── BadgeCaseCard.jsx
│   │   │   ├── LearningRealms.jsx
│   │   │   ├── ThemeWorkshopCard.jsx
│   │   │   └── WelcomeBanner.jsx
│   │   ├── shapes/
│   │   │   └── ShapeVisuals.jsx
│   │   ├── AppHeader.jsx
│   │   ├── LevelUpModal.jsx
│   │   └── PublicHeader.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ProgressContext.jsx
│   │   ├── useAuth.js
│   │   └── useProgress.js
│   ├── pages/
│   │   ├── CalculatorPage.jsx
│   │   ├── ChallengePage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ShapesPage.jsx
│   │   ├── TablesPage.jsx
│   │   └── WelcomePage.jsx
│   ├── utils/
│   │   ├── authStorage.js
│   │   ├── calculatorEngine.js
│   │   ├── levelSystem.js
│   │   ├── mathChallenge.js
│   │   ├── progressStorage.js
│   │   └── shapesData.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js
```

## Installation and Setup

### Prerequisites

- **Node.js:** `^20.19.0` or `>=22.12.0` (required by the installed Vite `8.3.8` and `@vitejs/plugin-react` `6.3.0` packages)
- **npm**

### Steps

1. Clone the repository and open the project directory:

   ```bash
   git clone https://github.com/aishvarya-p/quantaquest.git
   cd quantaquest
   ```

   *(If `quantaquest-app` is nested inside the cloned folder, run `cd quantaquest-app` before installing packages.)*

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open the local URL printed in the terminal (by default `http://localhost:5173/`).

4. Build for production:

   ```bash
   npm run build
   ```

5. Run the linter:

   ```bash
   npm run lint
   ```

## Current Implementation Notes

- **Frontend Prototype:** QuantaQuest is a client-side React application running in the browser with no backend server or external database.
- **Authentication Security Warning:** Student accounts (`quantaquest_users`) and active sessions (`quantaquest_session`) are stored in browser `localStorage` for demonstration purposes only. Credentials are stored locally on the client and **must not be treated as production-secure authentication**.
- **Per-Student Storage Keys:** Progress (`quantaquest_progress_<student_id>`) and calculator history (`quantaquest_calc_history_<student_id>`) are isolated per student ID in `localStorage`. Clearing browser storage removes saved accounts and progress.
- **Theme Workshop Scope:** Unlocking *Coral Reef* at `50 XP`, saving the active theme selection, and previewing themes in the Theme Workshop modal are implemented; full app-wide CSS palette switching (including *Cosmic Lab* dark mode) is not yet wired to global page styles.

## Future Enhancements

- **Secure Backend Authentication:** Replace local demo auth with server-side authentication, password hashing, and secure session tokens.
- **Cloud Synchronization:** Store student profiles, XP, levels, badges, streaks, and calculator history in a backend database across devices.
- **Full Theme Customization:** Apply unlocked palettes (*Coral Reef*, *Cosmic Lab* dark mode) dynamically across every page and component.
- **Additional Learning Activities:** Expand the platform with new realms such as a fractions lab, word-problem adventures, and adaptive practice modes.
