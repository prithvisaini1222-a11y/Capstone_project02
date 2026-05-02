<<<<<<< HEAD
# Capstone_project02
=======
# 🏥 PostureCare — Smart Healthcare & Posture Monitoring Dashboard

A complete, production-ready React + Vite application for healthcare posture monitoring with smart doctor search.

## ✨ Features

- **🔐 Authentication** — Login/logout with Redux state
- **📊 Dashboard** — Live posture stats, weekly chart, upcoming appointments, alerts
- **🧍 Posture Tracking** — Animated spine SVG, live simulation, angle history chart
- **📅 Appointments (CRUD)** — Add, edit, delete with **Google-style doctor autocomplete**
- **📈 Analytics** — 5 Chart.js charts (bar, line, donut, hourly, monthly)
- **🧠 AI Insights** — Rule-based smart health recommendations
- **👤 Profile** — Editable info, health goals, dark mode toggle, achievements
- **🌙 Dark Mode** — Full dark theme support
- **⌨️ Keyboard Navigation** — Arrow keys + Enter in doctor search dropdown
- **🔍 Debounced Search** — Optimized search inputs across app

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

## 🔐 Demo Login
- **Email:** rahul@posturecare.health
- **Password:** demo123

## 🩺 Doctor Autocomplete Feature
The appointment form has a **Google Search-style doctor autocomplete**:
- Type doctor name → live suggestions appear
- Type specialty (e.g. "Ortho") → filters by specialty  
- Type hospital name → filters by hospital
- Arrow keys ↑↓ to navigate, Enter to select
- Auto-fills specialty, hospital & consultation fee
- Quick specialty pills for one-click filter

## 🗂️ Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   └── Topbar.jsx           # Top bar with dark mode & notifications
│   ├── posture/
│   │   └── PostureFigure.jsx    # Animated SVG human figure
│   └── ui/
│       ├── DoctorAutocomplete.jsx  # ⭐ Google-style doctor search
│       ├── ErrorBoundary.jsx    # Error boundary
│       └── Loader.jsx           # Loader + shared UI components + Icon
├── hooks/
│   └── index.js                 # Custom hooks (useDebounce, usePostureStatus, etc.)
├── pages/
│   ├── LoginPage.jsx            # Login screen
│   ├── Dashboard.jsx            # Main dashboard
│   ├── Posture.jsx              # Posture tracking
│   ├── Appointments.jsx         # CRUD with autocomplete
│   ├── Analytics.jsx            # Charts & analytics
│   ├── Insights.jsx             # AI insights
│   └── Profile.jsx              # User profile
├── store/
│   └── store.js                 # Redux Toolkit store (auth, ui, posture, appointments, alerts)
├── App.jsx                      # Router + lazy loading + auth guard
├── main.jsx                     # Entry point
└── index.css                    # Global design system (CSS variables)
```

## 🛠️ Tech Stack

| Tech              | Usage                          |
|-------------------|-------------------------------|
| React 18          | UI framework                  |
| Vite              | Build tool                    |
| React Router v6   | Client-side routing           |
| Redux Toolkit     | Global state management       |
| Chart.js          | Data visualization            |
| Axios             | HTTP client (ready to use)    |

## 📦 Build for Production

```bash
npm run build
# Output in ./dist — ready for Vercel/Netlify
```

## 🚀 Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

---
Made with 💚 | Capstone Project — Healthcare Domain
>>>>>>> 1dcdb80 (first commit)
