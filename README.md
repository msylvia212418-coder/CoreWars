<div align="center">

<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Framer_Motion-Latest-FF0055?style=for-the-badge&logo=framer&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-3.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
<img src="https://img.shields.io/badge/Status-In_Development-orange?style=for-the-badge" />

<br/><br/>

```
               ██████╗ ██████╗ ██████╗ ███████╗██╗    ██╗ █████╗ ██████╗ ███████╗
              ██╔════╝██╔═══██╗██╔══██╗██╔════╝██║    ██║██╔══██╗██╔══██╗██╔════╝
              ██║     ██║   ██║██████╔╝█████╗  ██║ █╗ ██║███████║██████╔╝███████╗
              ██║     ██║   ██║██╔══██╗██╔══╝  ██║███╗██║██╔══██║██╔══██╗╚════██║
              ╚██████╗╚██████╔╝██║  ██║███████╗╚███╔███╔╝██║  ██║██║  ██║███████║
               ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
```

# 🧠 Gamified Intelligent Process Scheduling Simulator

**A cyberpunk-themed, fully animated game where YOU are the CoreWars Commander.**  
Learn OS scheduling algorithms by actually playing them — not just reading about them.

[🎮 Live Demo](#) · [📽️ Watch Demo Video](#) · [🐛 Report Bug](#) · [💡 Request Feature](#)

<br/>

![Game Preview](https://placehold.co/900x450/050814/3B82F6?text=COREWARS+%E2%80%94+Gameplay+Preview)

</div>

---


## 🎯 About The Project

> *"What if learning OS scheduling wasn't just reading a textbook — but actually managing a CPU under pressure?"*

**CoreWars** is a gamified, browser-based simulator built as a final-year Operating Systems project. It transforms four core CPU scheduling algorithms — FCFS, SJF, Round Robin, and Priority Scheduling — into an interactive, animated game experience.

The user inputs their own processes (burst time, arrival time, priority), picks a scheduling strategy, watches the CPU execute them in real-time with full animation, and gets scored on their efficiency. After each level, all four algorithms run silently on the same data and display a side-by-side comparison — so you immediately see what you could have done better.

### Why this exists

Traditional OS education is abstract. Students memorize Gantt charts without ever *feeling* what it means for a process to wait too long, or for the CPU to sit idle. This project fixes that by making the consequences of every scheduling decision immediate, visual, and scored.

---

## 🕹️ Game Features

| Feature | Description |
|---|---|
| 🎮 **5-Level Progression** | FCFS → SJF → Round Robin → Priority → Boss (Multi-CPU) |
| 🤖 **AI Recommendation Engine** | Analyses your process set and suggests the optimal algorithm with reasoning |
| ⚡ **Real-Time Animation** | Every process, CPU tick, and Gantt bar animates live with spring physics |
| 📋 **Custom Process Input** | Enter your own processes — burst time, arrival time, priority — or randomize |
| 📊 **Post-Level Comparison** | After every level, see all 4 algorithms run on your data side-by-side |
| 💀 **Multi-CPU Boss Mode** | Level 5 runs 3 CPUs simultaneously with load balancing and data-flow animations |
| 🏆 **Scoring & Ranking** | Scored on waiting time, CPU utilisation, speed, and AI alignment |
| 🎬 **Cinematic Transitions** | Every screen change is animated — shatter, cassette-insert, spring physics |

---

## ⚙️ Algorithms Implemented

### 🔵 FCFS — First Come First Served
Processes execute in the order they arrive. Simple and fair, but susceptible to the **convoy effect** when a long process blocks shorter ones behind it.
- **Best for:** Uniform workloads with similar burst times
- **Weakness:** High average waiting time with mixed process sizes

### 🟢 SJF — Shortest Job First
The process with the smallest burst time runs next. Provably **optimal for minimising average waiting time** in non-preemptive scheduling.
- **Best for:** Batch systems where burst times are known in advance
- **Weakness:** Long processes may starve indefinitely

### 🟣 RR — Round Robin
Each process gets a configurable **time quantum**. If not finished, it re-enters the queue. Guarantees fairness and responsiveness across all processes.
- **Best for:** Time-sharing systems, interactive workloads
- **Weakness:** High context-switching overhead with small quantum values

### 🟠 Priority Scheduling
Each process carries a priority number. Lower value = higher priority. Critical tasks are always executed before background work.
- **Best for:** Real-time systems where task urgency varies
- **Weakness:** Low-priority tasks may starve without an ageing mechanism

---

## 🗺️ Game Flow

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  BOOT SCREEN │────▶│ INSTRUCTIONS │────▶│ LEVEL SELECT │────▶│PROCESS INPUT │
│  Typewriter  │     │   How to play│     │  5 levels    │     │ Your data    │
└─────────────┘     └──────────────┘     └──────────────┘     └──────┬───────┘
                                                                       │
                    ┌──────────────┐     ┌──────────────┐             ▼
                    │ SCORE REVEAL │◀────│  SIMULATION  │◀────┌──────────────┐
                    │ Stars + Rank │     │  Animated    │     │AI SUGGESTION │
                    └──────┬───────┘     └──────────────┘     └──────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  ALGORITHM COMPARISON  │
              │  All 4 on your data    │
              └────────────┬───────────┘
                           │
              ┌────────────┴───────────┐
              ▼                        ▼
     [NEXT LEVEL]              [REPLAY LEVEL]
```

---

## 🛠️ Tech Stack

| Technology | Role | Why |
|---|---|---|
| **React 18** | UI Framework | Hooks + `useReducer` for game state management |
| **Framer Motion** | Animation Engine | Spring physics, `AnimatePresence`, layout animations |
| **Tailwind CSS** | Styling | Utility-first dark cyberpunk theme |
| **Recharts** | Data Visualisation | Animated Gantt bars and algorithm comparison charts |
| **canvas-confetti** | Celebration FX | Particle cannon on level completion |
| **Web Audio API** | Sound Feedback | Tick sounds synced to simulation, stamp on rank reveal |

---

## 📁 Project Structure

```
src/
│
├── App.jsx                    ← Master screen controller + game state
├── index.css                  ← Global animations, keyframes, grid background
│
├── game/
│   ├── GameEngine.js          ← Simulation tick loop (step-by-step, 700ms/unit)
│   ├── LevelManager.js        ← Level configs, constraints, process generators
│   └── ScoreSystem.js         ← Score calculation, stars, rank logic
│
├── algorithms/
│   ├── fcfs.js                ← First Come First Served
│   ├── sjf.js                 ← Shortest Job First
│   ├── roundRobin.js          ← Round Robin with configurable quantum
│   └── priority.js            ← Priority Scheduling (non-preemptive)
│
├── ai/
│   └── recommendation.js      ← Algorithm recommendation + reasoning engine
│
├── hooks/
│   ├── useGameEngine.js       ← Simulation tick + state management
│   ├── useCountUp.js          ← Animated number counter
│   └── useParticles.js        ← Lightweight particle system
│
├── components/
│   ├── BootScreen.jsx         ← Typewriter intro + animated grid
│   ├── InstructionsScreen.jsx ← How to play — animated tutorial cards
│   ├── LevelSelectScreen.jsx  ← 5 level cards with unlock states
│   ├── ProcessInputScreen.jsx ← Custom process entry + random fill
│   ├── GameUI.jsx             ← Master gameplay layout
│   ├── Header.jsx             ← Level / score / AI banner
│   ├── AIBanner.jsx           ← Recommendation + shatter on override
│   ├── ProcessQueue.jsx       ← Spring-physics animated process cards
│   ├── CPUUnit.jsx            ← Hex CPU + SVG progress ring + particles
│   ├── MultiCPU.jsx           ← Level 5: 3 CPUs + data-flow lines
│   ├── GanttChart.jsx         ← Real-time building Gantt bars + playhead
│   ├── ControlPanel.jsx       ← Algorithm buttons + quantum slider
│   ├── MetricsPanel.jsx       ← Count-up stats + donut CPU utilisation
│   ├── ScoreModal.jsx         ← Star reveal + rank stamp + confetti
│   └── ComparisonScreen.jsx   ← Post-level 4-algorithm comparison view
│
└── utils/
    └── metrics.js             ← Waiting time, turnaround, variance helpers
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- npm `v9+` or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/CoreWars.git

# 2. Navigate into the project
cd CoreWars

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🎮 How To Play

1. **Watch the boot screen** — the game introduces itself with a typewriter animation
2. **Read the instructions** — learn what each algorithm does and how scoring works
3. **Select a level** — start with Level 1 (FCFS) and unlock higher levels
4. **Enter your processes** — set the number of processes, burst times, arrival times, and priorities
5. **Review the AI suggestion** — the system recommends an algorithm and explains why
6. **Accept or override** — pick your algorithm (or trust the AI)
7. **Watch the simulation** — processes animate through the CPU in real-time with a live Gantt chart
8. **See your score** — stars, rank, and metrics revealed with full animation
9. **Study the comparison** — all 4 algorithms run on your data so you can see what worked best
10. **Replay or advance** — improve your score or unlock the next level

---

## 🏆 Scoring System

```
Base Score = 100 points

Deductions:
  − 2 points  per unit of average waiting time above threshold
  − 1 point   per % of CPU utilisation below 80%

Bonuses:
  + 10 points if you accepted the AI recommendation and scored well
  + 5 points  for completing the simulation under the time limit
```

| Score | Stars | Rank |
|---|---|---|
| 90 – 100 | ⭐⭐⭐ | Expert CoreWars Commander |
| 70 – 89 | ⭐⭐ | Advanced |
| 50 – 69 | ⭐ | Intermediate |
| Below 50 | 💀 | Beginner — Try Again |

**Cumulative rank** across all levels: `Beginner → Intermediate → Advanced → Expert 🏆`

---

## 🤖 AI Recommendation System

The AI engine analyses your process set before every simulation and recommends the most suitable algorithm:

```javascript
function recommendAlgorithm(processes, level) {
  const variance = calculateBurstVariance(processes);

  if (level >= 4)       return "PRIORITY";  // Priority values present
  if (variance > 10)    return "SJF";       // High burst time variance
  if (count > 5)        return "RR";        // Many processes — fairness needed
  return "FCFS";                            // Uniform, simple workload
}
```

- The AI banner **types itself** onto the screen with its reasoning
- You can **Accept** (green) or **Override** (red — the banner shatters)
- If you override and score lower: `"AI was right this time 😏"`
- Accepting a correct recommendation awards **+10 bonus points**

---

## 📸 Screenshots

> *(Add your screenshots here once the project is built)*

| Boot Screen | Level Select | Simulation |
|---|---|---|
| ![Boot](https://placehold.co/300x170/050814/3B82F6?text=Boot+Screen) | ![Level](https://placehold.co/300x170/050814/A855F7?text=Level+Select) | ![Sim](https://placehold.co/300x170/050814/22C55E?text=Simulation) |

| Process Input | Algorithm Comparison | Score Reveal |
|---|---|---|
| ![Input](https://placehold.co/300x170/050814/F97316?text=Process+Input) | ![Compare](https://placehold.co/300x170/050814/14B8A6?text=Comparison) | ![Score](https://placehold.co/300x170/050814/FBBF24?text=Score+Reveal) |

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the algorithms, add new animations, or fix bugs:

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature-name`
3. Commit your changes — `git commit -m "Add: your feature description"`
4. Push to the branch — `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code follows the existing structure and that algorithm implementations return the correct `{ schedule[], avgWaitingTime, avgTurnaroundTime, cpuUtilization }` shape.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📬 Contact

**Your Name** — [@yourtwitter](https://twitter.com/yourtwitter) — your.email@example.com

**Project Link:** [https://github.com/YOUR_USERNAME/CoreWars](https://github.com/YOUR_USERNAME/CoreWars)

---

<div align="center">

Made with ❤️ as a Final Year OS Project

*"If the CPU can schedule — so can you."*

</div>
