# ✨ Habitoo

> A modern, minimal, and deeply interactive habit tracking application built to make consistency feel satisfying.

![Habitoo Preview](./public/preview.png)

---

## 🌟 Overview

Habitoo is a full-stack habit tracker focused on:

* clean UX
* meaningful progress visualization
* measurable habits
* streak psychology
* beautiful analytics
* fast interactions

Unlike traditional checkbox habit trackers, Habitoo treats habits as **progress accumulation systems**.

You don’t just mark habits complete — you build progress over time.

---

# 🚀 Features

## ✅ Smart Habit System

Habits support:

* measurable progress
* custom units
* flexible targets
* dynamic completion logic

Examples:

| Habit       | Goal             |
| ----------- | ---------------- |
| Drink Water | 3 Liters/day     |
| Read Books  | 20 Pages/day     |
| Sleep Early | 1 time/day       |
| Walk        | 10,000 steps/day |

Completion is automatically derived from progress.

---

## 🔥 Streak Tracking

Track:

* current streaks
* longest streaks
* streak timelines
* consistency trends

Designed around behavioral momentum and habit psychology.

---

## 📊 Advanced Analytics

Beautiful analytics dashboard with:

* daily / weekly / monthly / yearly charts
* streak visualizations
* completion heatmaps
* averages
* trend insights
* progress distributions

---

## 🎯 Flexible Frequencies

Supports:

* Daily habits
* Weekly habits
* Monthly habits
* Yearly habits

Weekly/monthly habits intelligently aggregate progress across their periods.

---

## ⚡ Fast Interactions

* instant logging
* animated progress rings
* smooth UI transitions
* responsive interactions
* sound feedback
* collapsible habit cards

---

## 🎨 Modern UI

Inspired by apps like:

* Habitify
* Notion
* Linear
* Arc Browser

Features:

* dark-first design
* subtle grid backgrounds
* glassmorphism touches
* animated SVG progress rings
* premium card layouts

---

# 🛠 Tech Stack

## Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* Shadcn UI
* Lucide Icons
* Recharts
* Zustand
* TanStack Query

---

## Backend

* Neon Database
* Drizzle ORM

---

## Additional Libraries

* React Hook Form
* Zod
* Sonner
* React Use

---

# 🧠 Core Concepts

## Unified Progress Engine

All habits are treated as progress systems.

Instead of:

```txt
completed = true/false
```

Habitoo uses:

```txt
progress >= target
```

This enables:

* measurable habits
* scalable analytics
* flexible goals
* future gamification systems

---

## Dynamic Completion

Completion status is calculated dynamically based on:

* habit frequency
* accumulated logs
* selected date
* target values

---

# 📸 Screenshots

## Dashboard

Beautiful collapsible habit cards with animated progress rings.

## Analytics

Track consistency with streak timelines and chart insights.

## Habit Details

Detailed progress calendar and performance breakdowns.

---

# 🧩 Project Structure

```bash
app/
components/
hooks/
lib/
store/
db/
```

Organized around:

* reusable UI
* isolated logic
* composable components
* scalable architecture

---

# ⚙️ Installation

## Clone the repository

```bash
git clone https://github.com/yourusername/habitoo.git
```

## Navigate into the project

```bash
cd habitoo
```

## Install dependencies

```bash
npm install
```

## Setup environment variables

Create a `.env` file:

```env
DATABASE_URL=
```

---

## Run the development server

```bash
npm run dev
```

---

# 📈 Future Plans

* achievements system
* habit categories
* bad habit tracking
* reminders & notifications
* mobile app
* social accountability
* AI habit insights
* offline support
* drag-and-drop dashboard customization

---

# 💡 Philosophy

Habitoo is designed around one idea:

> Consistency should feel rewarding.

The app aims to make progress visible, motivating, and enjoyable.

---

# 🤝 Contributing

Contributions, ideas, and feedback are welcome.

Feel free to fork the project and open pull requests.

---

# 📜 License

MIT License

---

# 👨‍💻 Developer

Built with focus, obsession, and too many late-night redesigns by Arin Lamba.
