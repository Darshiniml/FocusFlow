# FocusFlow

A productivity and study-planning web app for organizing tasks, habits, focus sessions, and placement/exam prep — all in one dashboard.

Built with React 19, React Router, and Vite. All data currently lives in memory (React state) for the session; there's no backend yet, so refreshing the page resets tasks/habits.

## Features

- **Dashboard** – at-a-glance stats, today's schedule, habit tracker, and upcoming deadlines
- **Tasks** – create, edit, delete, and filter tasks by status, priority, or due date
- **Habits** – track daily habits with a logging grid and streak stats
- **Calendar** – monthly view with task/habit indicators per day, click any day for details
- **Timetable** – weekly schedule grid
- **Focus Timer** – Pomodoro-style focus/break timer
- **Study Tracker** – log study sessions per subject and see weekly totals
- **Roadmap** – placement/career readiness checklist and skill progress
- **Streaks** – activity heatmap, current/best streak, and recent activity feed
- **Auto Task Generator** – generate a task checklist from a goal and add it straight to Tasks
- **Settings** – profile fields, notification preferences, and a working dark/light theme toggle

## Tech Stack

- [React 19](https://react.dev/) with functional components and hooks
- [React Router v7](https://reactrouter.com/) for client-side routing
- [Vite](https://vite.dev/) for dev server and build tooling
- Plain CSS with CSS custom properties for theming (no CSS framework)
- [ESLint](https://eslint.org/) (flat config) with React Hooks and React Refresh rules

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Opens at `http://localhost:5173` by default.

### Build for production

```bash
npm run build
```

Outputs a static build to `dist/`, which you can preview locally with:

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── components/
│   └── Sidebar.jsx          # Left navigation
├── context/
│   ├── AppContextInstance.js  # React context object
│   ├── AppContext.jsx         # Provider: tasks, habits, theme, and their actions
│   └── useAppContext.js       # Hook to consume the context
├── pages/                   # One component per route
│   ├── Dashboard.jsx
│   ├── Tasks.jsx
│   ├── Habits.jsx
│   ├── Calendar.jsx
│   ├── Timetable.jsx
│   ├── FocusTimer.jsx
│   ├── StudyTracker.jsx
│   ├── Roadmap.jsx
│   ├── Streaks.jsx
│   ├── AutoTaskGenerator.jsx
│   └── Settings.jsx
├── utils/
│   ├── date.js                # Local-timezone-safe date helpers
│   └── download.js            # Browser JSON-file download helper
├── hooks/
│   └── usePersistedState.js   # localStorage-backed useState replacement
├── App.jsx                   # Route definitions + layout shell
├── App.css                   # App-wide styles
├── index.css                 # Theme variables (light/dark) and base styles
└── main.jsx                  # Entry point
```

## Data & Persistence

All app data — tasks, habits, habit logs, study sessions, timetable slots, roadmap steps/skills/goals, profile, preferences, and theme — is persisted to the browser's `localStorage` via a shared `usePersistedState` hook, so nothing resets on reload. There's still no backend/server, so data is local to whichever browser you use; it won't sync across devices.

You can move data around from **Settings**:
- **Export Data** downloads a full JSON snapshot of everything.
- **Backup Data** saves a snapshot into `localStorage` with a timestamp.
- **Restore Data** reloads the most recent backup (with a confirmation prompt, since it overwrites current data).

## State & Theming Notes

- App-wide state is managed centrally in `src/context/AppContext.jsx` via React Context — no external state library.
- Theme (dark/light) is persisted and applied via a `data-theme` attribute on `<html>`, set both by an inline script in `index.html` (to avoid a flash of the wrong theme on load) and kept in sync by the context afterward.
- Dates are handled with local-timezone helpers in `src/utils/date.js`. Avoid using `Date.prototype.toISOString()` or `new Date("yyyy-mm-dd")` for "today"/date-key logic elsewhere in the app — both convert to/parse as UTC and will shift the date for users outside UTC.

## Known Limitations

- No backend/server — data lives in the browser's `localStorage`, so it's local to that browser/device only (no cross-device sync, no accounts).
- The Dashboard's "Goals", "Recent Activity", "Achievements", and "Placement Readiness" bars are still illustrative rather than fully derived from usage data (Study Tracker hours and the Activity Heatmap are real, though — see above).
- Timetable's "Auto Generate" uses a simple rule (fill empty weekdays with pending tasks, one per day) rather than anything schedule-aware.

## License

Not yet specified.
