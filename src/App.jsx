import { useState, useEffect, useRef } from "react";

// ── NOVIO DESIGN TOKENS ──────────────────────────────────────────────────────
const T = {
  dark:    "#0e1e1e",
  primary: "#1e6060",
  accent:  "#3a9a9a",
  light:   "#e6f4f4",
  mint:    "#f4f8f7",
  muted:   "#5a8888",
  border:  "#b0d8d8",
  white:   "#ffffff",
  gold:    "#f0a500",
  red:     "#e05555",
  green:   "#3a9a6a",
};

const TABS = [
  { id: "home",      icon: "✦",  label: "Home"      },
  { id: "tasks",     icon: "◈",  label: "Tasks"     },
  { id: "focus",     icon: "◎",  label: "Focus"     },
  { id: "flashcards",icon: "⬡",  label: "Cards"     },
  { id: "mood",      icon: "◉",  label: "Mood"      },
];

const MOODS = [
  { emoji: "😌", label: "Calm",    color: "#3a9a9a" },
  { emoji: "😊", label: "Good",    color: "#3a9a6a" },
  { emoji: "😤", label: "Stressed",color: "#e05555" },
  { emoji: "😴", label: "Tired",   color: "#8a7fa0" },
  { emoji: "🔥", label: "Focused", color: "#f0a500" },
];

const SUBJECTS = ["Economics", "Business", "Marketing", "Law", "Finance", "Other"];

const QUOTES = [
  "Every expert was once a beginner. 🌱",
  "Progress over perfection, always. 💫",
  "Your only competition is yesterday's you. 🎯",
  "Rest is part of the process. 🌙",
  "Small steps compound into great things. 🏔️",
];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric"
  });
}

// ── SMALL COMPONENTS ─────────────────────────────────────────────────────────
const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    background: T.white,
    borderRadius: 16,
    padding: "14px 16px",
    boxShadow: "0 2px 16px rgba(14,30,30,0.07)",
    border: `1px solid ${T.border}`,
    marginBottom: 10,
    ...style,
  }}>{children}</div>
);

const Pill = ({ children, active, color, onClick }) => (
  <button onClick={onClick} style={{
    padding: "5px 14px",
    borderRadius: 20,
    border: `1.5px solid ${active ? (color || T.accent) : T.border}`,
    background: active ? (color || T.accent) : "transparent",
    color: active ? T.white : T.muted,
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    fontWeight: active ? 600 : 400,
    transition: "all 0.2s",
  }}>{children}</button>
);

const Input = ({ style = {}, ...props }) => (
  <input {...props} style={{
    width: "100%",
    padding: "10px 14px",
    borderRadius: 12,
    border: `1.5px solid ${T.border}`,
    background: T.mint,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    color: T.dark,
    outline: "none",
    boxSizing: "border-box",
    ...style,
  }} />
);

const Btn = ({ children, variant = "primary", onClick, style = {}, disabled }) => {
  const variants = {
    primary:  { background: T.primary, color: T.white, border: "none" },
    accent:   { background: T.accent,  color: T.white, border: "none" },
    ghost:    { background: "transparent", color: T.primary, border: `1.5px solid ${T.border}` },
    danger:   { background: T.red,    color: T.white, border: "none" },
    gold:     { background: T.gold,   color: T.dark,  border: "none" },
  };
  return (
    <button disabled={disabled} onClick={onClick} style={{
      ...variants[variant],
      padding: "10px 20px",
      borderRadius: 12,
      fontSize: 13,
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "all 0.2s",
      ...style,
    }}>{children}</button>
  );
};

const PremiumBadge = () => (
  <span style={{
    background: `linear-gradient(135deg, ${T.gold}, #e09000)`,
    color: T.dark,
    fontSize: 9,
    fontWeight: 700,
    padding: "2px 7px",
    borderRadius: 8,
    letterSpacing: 0.5,
    marginLeft: 6,
  }}>PRO</span>
);

const SectionTitle = ({ children }) => (
  <div style={{
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: T.muted,
    fontWeight: 600,
    marginBottom: 10,
    marginTop: 4,
    fontFamily: "'DM Sans', sans-serif",
  }}>{children}</div>
);

// ── HOME TAB ─────────────────────────────────────────────────────────────────
function HomeTab({ tasks, moods, pomodoroSessions, streak }) {
  const done = tasks.filter(t => t.done).length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const todayMood = moods[0];
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  return (
    <div>
      {/* Hero greeting */}
      <div style={{
        background: `linear-gradient(135deg, ${T.primary} 0%, ${T.accent} 100%)`,
        borderRadius: 20,
        padding: "20px 18px",
        marginBottom: 14,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -20, right: -20,
          width: 100, height: 100, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
        }} />
        <div style={{
          position: "absolute", bottom: -30, right: 20,
          width: 70, height: 70, borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        }} />
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: 1, marginBottom: 4 }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.white, marginBottom: 2 }}>
          Welcome back ✦
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontStyle: "italic" }}>
          "{quote}"
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { icon: "🔥", value: streak, label: "Day streak" },
          { icon: "⚡", value: pomodoroSessions, label: "Sessions" },
          { icon: "✅", value: `${done}/${tasks.length}`, label: "Tasks done" },
        ].map((s, i) => (
          <Card key={i} style={{ textAlign: "center", padding: "12px 8px", marginBottom: 0 }}>
            <div style={{ fontSize: 20 }}>{s.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.dark, lineHeight: 1.2 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: T.muted }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Today's progress */}
      <SectionTitle>Today's Progress</SectionTitle>
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.dark }}>Task completion</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>{progress}%</span>
        </div>
        <div style={{ height: 8, background: T.light, borderRadius: 10, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${T.primary}, ${T.accent})`,
            borderRadius: 10,
            transition: "width 0.6s ease",
          }} />
        </div>
        {tasks.slice(0, 3).map(t => (
          <div key={t.id} style={{
            display: "flex", alignItems: "center", gap: 10,
            marginTop: 10, opacity: t.done ? 0.5 : 1,
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              border: `2px solid ${T.accent}`,
              background: t.done ? T.accent : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, color: T.white, flexShrink: 0,
            }}>{t.done ? "✓" : ""}</div>
            <span style={{ fontSize: 13, color: T.dark, textDecoration: t.done ? "line-through" : "none" }}>
              {t.text}
            </span>
            {t.subject && (
              <span style={{
                marginLeft: "auto", fontSize: 10, color: T.muted,
                background: T.light, padding: "2px 8px", borderRadius: 8,
              }}>{t.subject}</span>
            )}
          </div>
        ))}
      </Card>

      {/* Mood snapshot */}
      {todayMood && (
        <>
          <SectionTitle>Latest Mood</SectionTitle>
          <Card style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 28 }}>{todayMood.mood.emoji}</span>
            <div>
              <div style={{ fontWeight: 600, color: T.dark }}>{todayMood.mood.label}</div>
              {todayMood.note && <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic" }}>{todayMood.note}</div>}
              <div style={{ fontSize: 11, color: T.border }}>{todayMood.date}</div>
            </div>
          </Card>
        </>
      )}

      {/* Premium teaser */}
      <div style={{
        background: `linear-gradient(135deg, ${T.dark} 0%, #1a3a3a 100%)`,
        borderRadius: 16,
        padding: "16px 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ color: T.gold, fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>
            ✦ NOVIO PRO
          </div>
          <div style={{ color: T.white, fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
            Unlock your AI study coach
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>
            Personalized plans · Analytics · More
          </div>
        </div>
        <Btn variant="gold" style={{ fontSize: 12, padding: "8px 14px", whiteSpace: "nowrap" }}>
          €2.99/mo
        </Btn>
      </div>
    </div>
  );
}

// ── TASKS TAB ────────────────────────────────────────────────────────────────
function TasksTab({ tasks, setTasks }) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [newTask, setNewTask] = useState({ text: "", subject: "Economics", date: getToday() });
  const FREE_LIMIT = 10;
  const atLimit = tasks.length >= FREE_LIMIT;

  const addTask = () => {
    if (!newTask.text.trim()) return;
    setTasks([...tasks, { ...newTask, id: Date.now(), done: false }]);
    setNewTask({ text: "", subject: "Economics", date: getToday() });
    setShowForm(false);
  };

  const filtered = filter === "All" ? tasks
    : filter === "Done" ? tasks.filter(t => t.done)
    : filter === "Pending" ? tasks.filter(t => !t.done)
    : tasks.filter(t => t.subject === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: T.dark }}>Tasks</h2>
        <Btn variant={atLimit ? "ghost" : "primary"} onClick={() => !atLimit && setShowForm(!showForm)}
          style={{ fontSize: 12, padding: "7px 14px" }}>
          {atLimit ? <span>+ Limit reached <PremiumBadge /></span> : "+ Add Task"}
        </Btn>
      </div>

      {atLimit && (
        <Card style={{ background: `linear-gradient(135deg, ${T.dark}, #1a3a3a)`, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: T.gold, fontSize: 11, fontWeight: 700, marginBottom: 2 }}>✦ FREE LIMIT REACHED</div>
              <div style={{ color: T.white, fontSize: 12 }}>Upgrade to add unlimited tasks</div>
            </div>
            <Btn variant="gold" style={{ fontSize: 11, padding: "6px 12px" }}>Upgrade</Btn>
          </div>
        </Card>
      )}

      {showForm && (
        <Card style={{ background: T.mint, marginBottom: 14 }}>
          <Input placeholder="What do you need to do?" value={newTask.text}
            onChange={e => setNewTask({ ...newTask, text: e.target.value })}
            style={{ marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <select value={newTask.subject} onChange={e => setNewTask({ ...newTask, subject: e.target.value })}
              style={{ flex: 1, padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${T.border}`,
                background: T.white, fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: T.dark, outline: "none" }}>
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
            <Input type="date" value={newTask.date}
              onChange={e => setNewTask({ ...newTask, date: e.target.value })}
              style={{ flex: 1 }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="primary" onClick={addTask} style={{ flex: 1 }}>Save Task</Btn>
            <Btn variant="ghost" onClick={() => setShowForm(false)} style={{ flex: 1 }}>Cancel</Btn>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
        {["All", "Pending", "Done", ...SUBJECTS].map(f => (
          <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Pill>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", color: T.muted, padding: "30px 0", fontSize: 14 }}>
          No tasks here. Add one! ✦
        </div>
      )}

      {filtered.map(task => (
        <Card key={task.id} style={{ display: "flex", alignItems: "center", gap: 12, opacity: task.done ? 0.6 : 1 }}>
          <div onClick={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}
            style={{
              width: 22, height: 22, borderRadius: "50%", flexShrink: 0, cursor: "pointer",
              border: `2px solid ${T.accent}`,
              background: task.done ? T.accent : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, color: T.white, transition: "all 0.2s",
            }}>{task.done ? "✓" : ""}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: T.dark, fontWeight: 500,
              textDecoration: task.done ? "line-through" : "none" }}>{task.text}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>
              {task.subject} · {formatDate(task.date)}
            </div>
          </div>
          <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: T.border, padding: 4 }}>
            ✕
          </button>
        </Card>
      ))}
    </div>
  );
}

// ── FOCUS TAB ────────────────────────────────────────────────────────────────
function FocusTab({ sessions, setSessions }) {
  const [state, setState] = useState("idle");
  const [isBreak, setIsBreak] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [customWork, setCustomWork] = useState(25);
  const intervalRef = useRef(null);

  const total = isBreak ? 5 * 60 : customWork * 60;
  const progress = ((total - time) / total) * 100;
  const radius = 90;
  const circ = 2 * Math.PI * radius;

  useEffect(() => {
    if (state === "running") {
      intervalRef.current = setInterval(() => {
        setTime(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            if (!isBreak) { setSessions(s => s + 1); setIsBreak(true); setTime(5 * 60); }
            else { setIsBreak(false); setTime(customWork * 60); }
            setState("idle");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [state, isBreak, customWork]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: T.dark }}>Focus Timer</h2>
      <p style={{ color: T.muted, fontSize: 13, margin: "0 0 24px" }}>
        {isBreak ? "☕ Break time! Breathe and recharge." : "✦ Stay in the zone. You've got this."}
      </p>

      {/* SVG circle timer */}
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center",
        justifyContent: "center", marginBottom: 28 }}>
        <svg width={220} height={220} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={110} cy={110} r={radius} fill="none" stroke={T.light} strokeWidth={12} />
          <circle cx={110} cy={110} r={radius} fill="none"
            stroke={isBreak ? T.accent : T.primary}
            strokeWidth={12}
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - progress / 100)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div style={{ position: "absolute", textAlign: "center" }}>
          <div style={{ fontSize: 46, fontWeight: 800, color: T.dark, letterSpacing: -3, fontFamily: "'DM Sans', sans-serif" }}>
            {fmt(time)}
          </div>
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: "uppercase" }}>
            {isBreak ? "break" : "focus"}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
        {state !== "running" ? (
          <Btn variant="primary" onClick={() => setState("running")}
            style={{ fontSize: 15, padding: "12px 32px" }}>▶ Start</Btn>
        ) : (
          <Btn variant="ghost" onClick={() => setState("paused")}
            style={{ fontSize: 15, padding: "12px 28px" }}>⏸ Pause</Btn>
        )}
        <Btn variant="ghost" onClick={() => { setState("idle"); setIsBreak(false); setTime(customWork * 60); }}
          style={{ fontSize: 15, padding: "12px 20px" }}>↺</Btn>
      </div>

      {/* Duration selector */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
        {[15, 25, 45, 60].map(m => (
          <Pill key={m} active={customWork === m} onClick={() => {
            setCustomWork(m);
            if (state === "idle" && !isBreak) setTime(m * 60);
          }}>{m}m</Pill>
        ))}
      </div>

      {/* Sessions */}
      <Card style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
        <span style={{ fontSize: 24 }}>⚡</span>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontWeight: 700, color: T.dark }}>{sessions} energy sessions today</div>
          <div style={{ fontSize: 12, color: T.muted }}>
            {sessions >= 4 ? "⚡ Full power mode!" : `${4 - sessions} more for full power`}
          </div>
        </div>
      </Card>

      {/* How it works */}
      <Card style={{ textAlign: "left" }}>
        <div style={{ fontSize: 11, color: T.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>
          The Focus Method
        </div>
        {[
          ["⚡", "Energy session", "Channel your focus on one task only"],
          ["🌊", "Short break", "Breathe, rest, recharge"],
          ["🔁", "Repeat", "4 sessions = peak performance"],
        ].map(([icon, title, desc]) => (
          <div key={title} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 16 }}>{icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.dark }}>{title}</div>
              <div style={{ fontSize: 12, color: T.muted }}>{desc}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── FLASHCARDS TAB ────────────────────────────────────────────────────────────
function FlashcardsTab() {
  const [cards, setCards] = useState([
    { id: 1, front: "What is GDP?", back: "Gross Domestic Product — total value of goods and services produced in a country.", subject: "Economics", known: false },
    { id: 2, front: "Define Supply Chain", back: "The network of all individuals, organizations, resources, activities and technologies involved in creating and selling a product.", subject: "Business", known: false },
    { id: 3, front: "What is a P&L?", back: "Profit & Loss statement — a financial report summarizing revenues, costs, and expenses over a period.", subject: "Finance", known: true },
  ]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState("browse"); // browse | quiz
  const [newCard, setNewCard] = useState({ front: "", back: "", subject: "Economics" });
  const FREE_LIMIT = 10;
  const atLimit = cards.length >= FREE_LIMIT;

  const addCard = () => {
    if (!newCard.front.trim() || !newCard.back.trim()) return;
    setCards([...cards, { ...newCard, id: Date.now(), known: false }]);
    setNewCard({ front: "", back: "", subject: "Economics" });
    setShowForm(false);
  };

  const markKnown = (known) => {
    setCards(cards.map((c, i) => i === current ? { ...c, known } : c));
    setFlipped(false);
    setCurrent(c => (c + 1) % cards.length);
  };

  const known = cards.filter(c => c.known).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: T.dark }}>Flashcards</h2>
        <Btn variant={atLimit ? "ghost" : "primary"} onClick={() => !atLimit && setShowForm(!showForm)}
          style={{ fontSize: 12, padding: "7px 14px" }}>
          {atLimit ? <span>+ Limit <PremiumBadge /></span> : "+ New Card"}
        </Btn>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[
          { label: "Total", value: cards.length },
          { label: "Known", value: known, color: T.green },
          { label: "Learning", value: cards.length - known, color: T.accent },
        ].map(s => (
          <Card key={s.label} style={{ flex: 1, textAlign: "center", marginBottom: 0, padding: "10px 8px" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color || T.dark }}>{s.value}</div>
            <div style={{ fontSize: 10, color: T.muted }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {showForm && (
        <Card style={{ background: T.mint, marginBottom: 14 }}>
          <Input placeholder="Front (question)" value={newCard.front}
            onChange={e => setNewCard({ ...newCard, front: e.target.value })}
            style={{ marginBottom: 8 }} />
          <textarea placeholder="Back (answer)" value={newCard.back}
            onChange={e => setNewCard({ ...newCard, back: e.target.value })}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${T.border}`,
              background: T.white, fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: T.dark,
              outline: "none", resize: "none", height: 70, boxSizing: "border-box", marginBottom: 8 }} />
          <select value={newCard.subject} onChange={e => setNewCard({ ...newCard, subject: e.target.value })}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${T.border}`,
              background: T.white, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
              color: T.dark, outline: "none", marginBottom: 8 }}>
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="primary" onClick={addCard} style={{ flex: 1 }}>Save</Btn>
            <Btn variant="ghost" onClick={() => setShowForm(false)} style={{ flex: 1 }}>Cancel</Btn>
          </div>
        </Card>
      )}

      {/* Flashcard */}
      {cards.length > 0 && (
        <>
          <div onClick={() => setFlipped(!flipped)} style={{
            background: flipped
              ? `linear-gradient(135deg, ${T.primary}, ${T.accent})`
              : T.white,
            borderRadius: 20,
            padding: "32px 20px",
            minHeight: 160,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            textAlign: "center",
            cursor: "pointer",
            border: `1.5px solid ${T.border}`,
            boxShadow: "0 4px 24px rgba(14,30,30,0.10)",
            marginBottom: 12,
            transition: "all 0.3s ease",
          }}>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
              color: flipped ? "rgba(255,255,255,0.7)" : T.muted, marginBottom: 12 }}>
              {flipped ? "ANSWER" : `QUESTION  ·  ${cards[current].subject}`}
            </div>
            <div style={{ fontSize: 16, fontWeight: flipped ? 600 : 700,
              color: flipped ? T.white : T.dark, lineHeight: 1.5 }}>
              {flipped ? cards[current].back : cards[current].front}
            </div>
            {!flipped && (
              <div style={{ fontSize: 11, color: T.border, marginTop: 16 }}>Tap to reveal answer</div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <button onClick={() => { setCurrent(c => (c - 1 + cards.length) % cards.length); setFlipped(false); }}
              style={{ background: T.light, border: "none", borderRadius: 12, padding: "10px 16px",
                cursor: "pointer", fontSize: 16, color: T.primary }}>←</button>
            <span style={{ fontSize: 13, color: T.muted }}>{current + 1} / {cards.length}</span>
            <button onClick={() => { setCurrent(c => (c + 1) % cards.length); setFlipped(false); }}
              style={{ background: T.light, border: "none", borderRadius: 12, padding: "10px 16px",
                cursor: "pointer", fontSize: 16, color: T.primary }}>→</button>
          </div>

          {flipped && (
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost" onClick={() => markKnown(false)}
                style={{ flex: 1, borderColor: T.red, color: T.red }}>
                Still learning 📖
              </Btn>
              <Btn variant="accent" onClick={() => markKnown(true)} style={{ flex: 1 }}>
                Got it! ✓
              </Btn>
            </div>
          )}
        </>
      )}

      {/* AI Flashcards teaser */}
      <Card style={{
        background: `linear-gradient(135deg, ${T.dark}, #1a3a3a)`,
        marginTop: 14,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div>
          <div style={{ color: T.gold, fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 3 }}>
            ✦ PRO FEATURE
          </div>
          <div style={{ color: T.white, fontSize: 13, fontWeight: 600 }}>AI-Generated Flashcards</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Upload notes → instant cards</div>
        </div>
        <Btn variant="gold" style={{ fontSize: 11, padding: "7px 12px" }}>Upgrade</Btn>
      </Card>
    </div>
  );
}

// ── MOOD TAB ──────────────────────────────────────────────────────────────────
function MoodTab({ moods, setMoods }) {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");

  const log = () => {
    if (!selected) return;
    setMoods([{
      id: Date.now(),
      mood: selected,
      note,
      date: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    }, ...moods]);
    setSelected(null);
    setNote("");
  };

  // Burnout detection
  const recentMoods = moods.slice(0, 5).map(m => m.mood.label);
  const stressCount = recentMoods.filter(m => m === "Stressed" || m === "Tired").length;
  const burnoutRisk = stressCount >= 3;

  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: T.dark }}>Mood Tracker</h2>
      <p style={{ color: T.muted, fontSize: 13, margin: "0 0 16px" }}>
        How are you feeling right now?
      </p>

      {/* Burnout alert */}
      {burnoutRisk && (
        <Card style={{
          background: `linear-gradient(135deg, #3a1a1a, #5a2a2a)`,
          marginBottom: 14,
          display: "flex", gap: 12, alignItems: "flex-start"
        }}>
          <span style={{ fontSize: 22 }}>⚠️</span>
          <div>
            <div style={{ color: "#ffaaaa", fontWeight: 700, fontSize: 13, marginBottom: 2 }}>
              Burnout Risk Detected
            </div>
            <div style={{ color: "rgba(255,200,200,0.8)", fontSize: 12 }}>
              You've been stressed or tired {stressCount} times recently. Please take a real break today. 💜
            </div>
          </div>
        </Card>
      )}

      {/* Mood selector */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-around", marginBottom: 14 }}>
          {MOODS.map(m => (
            <div key={m.label} onClick={() => setSelected(m)} style={{
              textAlign: "center", cursor: "pointer",
              padding: "10px 6px", borderRadius: 14, flex: 1,
              background: selected?.label === m.label
                ? m.color + "22"
                : T.mint,
              border: `2px solid ${selected?.label === m.label ? m.color : "transparent"}`,
              transition: "all 0.2s",
            }}>
              <div style={{ fontSize: 26 }}>{m.emoji}</div>
              <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>
        <Input placeholder="How's your study day going? (optional)"
          value={note} onChange={e => setNote(e.target.value)}
          style={{ marginBottom: 10 }} />
        <Btn variant="primary" onClick={log} disabled={!selected} style={{ width: "100%" }}>
          Log Mood ✦
        </Btn>
      </Card>

      {/* Pro analytics teaser */}
      <Card style={{
        background: `linear-gradient(135deg, ${T.dark}, #1a3a3a)`,
        marginBottom: 14,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div>
          <div style={{ color: T.gold, fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 3 }}>
            ✦ PRO FEATURE
          </div>
          <div style={{ color: T.white, fontSize: 13, fontWeight: 600 }}>Mood Analytics</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>Weekly trends & insights</div>
        </div>
        <Btn variant="gold" style={{ fontSize: 11, padding: "7px 12px" }}>Upgrade</Btn>
      </Card>

      {/* History */}
      {moods.length > 0 && (
        <>
          <SectionTitle>Recent Mood Log</SectionTitle>
          {moods.slice(0, 7).map(m => (
            <Card key={m.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              borderLeft: `4px solid ${m.mood.color}`,
            }}>
              <span style={{ fontSize: 24 }}>{m.mood.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: T.dark, fontSize: 14 }}>{m.mood.label}</div>
                {m.note && <div style={{ fontSize: 12, color: T.muted, fontStyle: "italic" }}>{m.note}</div>}
              </div>
              <div style={{ fontSize: 11, color: T.border, whiteSpace: "nowrap" }}>{m.date}</div>
            </Card>
          ))}
        </>
      )}

      {moods.length === 0 && (
        <div style={{ textAlign: "center", color: T.muted, padding: "30px 0", fontSize: 14 }}>
          No mood entries yet. Log your first! ✦
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");
  const [tasks, setTasks] = useState([
    { id: 1, text: "Read chapter 3 — Macroeconomics", done: false, subject: "Economics", date: getToday() },
    { id: 2, text: "Prepare oral presentation slides", done: true,  subject: "Business",  date: getToday() },
    { id: 3, text: "Review marketing case study", done: false, subject: "Marketing", date: getToday() },
  ]);
  const [moods, setMoods] = useState([]);
  const [pomodoroSessions, setPomodoroSessions] = useState(0);
  const [streak] = useState(7);

  return (
    <div style={{
      minHeight: "100vh",
      background: T.mint,
      fontFamily: "'DM Sans', Georgia, sans-serif",
      maxWidth: 430,
      margin: "0 auto",
      position: "relative",
      paddingBottom: 80,
    }}>
      {/* Top bar */}
      <div style={{
        padding: "16px 18px 12px",
        background: T.white,
        borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: T.white, fontWeight: 800, fontSize: 14,
          }}>N</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: T.dark, letterSpacing: -0.5 }}>NOVIO</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            background: T.light, borderRadius: 10, padding: "4px 10px",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span style={{ fontSize: 14 }}>🔥</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.primary }}>{streak}</span>
          </div>
          <div style={{
            background: `linear-gradient(135deg, ${T.gold}, #e09000)`,
            borderRadius: 10, padding: "4px 10px",
            fontSize: 11, fontWeight: 700, color: T.dark, letterSpacing: 0.5,
          }}>FREE</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 16px 0" }}>
        {tab === "home"       && <HomeTab tasks={tasks} moods={moods} pomodoroSessions={pomodoroSessions} streak={streak} />}
        {tab === "tasks"      && <TasksTab tasks={tasks} setTasks={setTasks} />}
        {tab === "focus"      && <FocusTab sessions={pomodoroSessions} setSessions={setPomodoroSessions} />}
        {tab === "flashcards" && <FlashcardsTab />}
        {tab === "mood"       && <MoodTab moods={moods} setMoods={setMoods} />}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0,
        left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: T.white,
        borderTop: `1px solid ${T.border}`,
        display: "flex",
        zIndex: 100,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "10px 0 8px",
              border: "none", background: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              borderTop: `2.5px solid ${active ? T.accent : "transparent"}`,
              transition: "all 0.2s",
            }}>
              <span style={{
                fontSize: 18,
                color: active ? T.primary : T.border,
                fontWeight: active ? 700 : 400,
              }}>{t.icon}</span>
              <span style={{
                fontSize: 9, letterSpacing: 0.5, textTransform: "uppercase",
                fontWeight: active ? 700 : 400,
                color: active ? T.primary : T.muted,
                fontFamily: "'DM Sans', sans-serif",
              }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
