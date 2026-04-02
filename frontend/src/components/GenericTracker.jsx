import { useState, useEffect } from "react";
import { getInitialState } from "../constants/data";

/* ── Level config ── */
const LEVELS      = ["Başlamadım", "Öğreniyorum", "Biliyorum", "Uzmanım"];
const LEVEL_COLORS = ["#e5e3dd", "#f5c069", "#5aacf5", "#5dc98a"];
const LEVEL_TEXT   = ["#9b9890",  "#b07d20",  "#1b6fb5",  "#1f7a4a"];
const LEVEL_BG     = ["rgba(155,152,144,0.1)", "rgba(245,192,105,0.12)", "rgba(90,172,245,0.12)", "rgba(93,201,138,0.12)"];

/* ── Tiny icon components ── */
const IconChevron = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const IconNote = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

/* ── Progress ring ── */
function Ring({ pct, color, size = 64 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border-lighter)" strokeWidth="5"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)" }}/>
    </svg>
  );
}

/* ── Topic row ── */
function TopicRow({ topic, level, note, accentColor, onLevelChange, onNoteChange }) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [localNote, setLocalNote] = useState(note);

  useEffect(() => { setLocalNote(note); }, [note]);

  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${level > 0 ? `${LEVEL_COLORS[level]}` : "var(--border-lighter)"}`,
      borderRadius: 12,
      padding: "14px 16px",
      transition: "all 0.2s",
    }}>
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        {/* Topic name */}
        <div style={{
          flex: 1, fontSize: 13.5, fontWeight: 500, minWidth: 120,
          color: level > 0 ? "var(--text-primary)" : "var(--text-tertiary)"
        }}>
          {topic}
        </div>

        {/* Level buttons */}
        <div style={{ display: "flex", gap: 5 }}>
          {LEVELS.map((lbl, i) => (
            <button key={i} title={lbl}
              onClick={() => onLevelChange(i)}
              style={{
                padding: "4px 11px",
                borderRadius: 50,
                border: `1.5px solid ${level === i ? LEVEL_COLORS[i] : "var(--border-lighter)"}`,
                background: level === i ? LEVEL_BG[i] : "transparent",
                color: level === i ? LEVEL_TEXT[i] : "var(--text-muted)",
                fontSize: 11.5, fontWeight: level === i ? 600 : 400,
                cursor: "pointer", transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {lbl}
            </button>
          ))}
        </div>

        {/* Note toggle */}
        <button
          onClick={() => setNoteOpen(!noteOpen)}
          title="Not ekle"
          style={{
            width: 30, height: 30, borderRadius: 8, display: "flex",
            alignItems: "center", justifyContent: "center",
            color: note ? accentColor : "var(--text-muted)",
            background: note ? `${accentColor}14` : "transparent",
            border: `1px solid ${note ? `${accentColor}40` : "var(--border-lighter)"}`,
            cursor: "pointer", transition: "all 0.15s", flexShrink: 0,
          }}
        >
          <IconNote />
        </button>
      </div>

      {/* Note field */}
      {noteOpen && (
        <div style={{ marginTop: 12 }}>
          <textarea
            autoFocus
            rows={2}
            placeholder="Bu konuya dair notlarını buraya yazabilirsin…"
            value={localNote}
            onChange={e => setLocalNote(e.target.value)}
            onBlur={() => onNoteChange(localNote)}
            style={{
              width: "100%", border: `1.5px solid var(--border-light)`,
              borderRadius: 10, padding: "10px 12px",
              fontSize: 13, color: "var(--text-primary)",
              background: "var(--bg-main)", outline: "none",
              resize: "none", fontFamily: "Inter, sans-serif",
              lineHeight: 1.6, transition: "border-color 0.2s",
              boxSizing: "border-box",
            }}
            onFocus={e => e.target.style.borderColor = `${accentColor}60`}
          />
        </div>
      )}

      {/* Existing note preview */}
      {!noteOpen && note && (
        <div style={{
          marginTop: 10, fontSize: 12.5, color: "var(--text-secondary)",
          borderLeft: `2.5px solid ${accentColor}`,
          paddingLeft: 10, fontStyle: "italic", lineHeight: 1.5,
        }}>
          {note}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
export default function GenericTracker({
  currentUser, title, categories, defaultTopics,
  storageKeyPrefix, accentColor = "#cc785c"
}) {
  const [state,          setState]          = useState(null);
  const [activeTab,      setActiveTab]      = useState("dashboard");
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [loaded,         setLoaded]         = useState(false);
  const [saveStatus,     setSaveStatus]     = useState("");

  const storageKey = `${storageKeyPrefix}_${currentUser.email}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setState(saved ? JSON.parse(saved) : getInitialState(defaultTopics));
    } catch {
      setState(getInitialState(defaultTopics));
    }
    setLoaded(true);
  }, [storageKey, defaultTopics]);

  useEffect(() => {
    if (!loaded || !state) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(""), 2000);
      } catch {
        setSaveStatus("error");
      }
    }, 600);
    return () => clearTimeout(t);
  }, [state, loaded, storageKey]);

  if (!loaded || !state) return (
    <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)", fontSize: 14 }}>
      Yükleniyor…
    </div>
  );

  /* helpers */
  const allTopics    = (cid) => [...(defaultTopics[cid] || []), ...(state.customTopics[cid] || [])];
  const getCatPct    = (cid) => {
    const t = allTopics(cid);
    if (!t.length) return 0;
    return Math.round((t.reduce((s, tp) => s + (state.progress[cid]?.[tp] || 0), 0) / (t.length * 3)) * 100);
  };
  const totalPct     = Math.round(categories.map(c => getCatPct(c.id)).reduce((a, b) => a + b, 0) / categories.length);

  const setLevel = (cid, topic, lvl) =>
    setState(p => ({ ...p, progress: { ...p.progress, [cid]: { ...p.progress[cid], [topic]: lvl } } }));

  const setNote = (cid, topic, text) =>
    setState(p => ({ ...p, notes: { ...p.notes, [cid]: { ...p.notes[cid], [topic]: text } } }));

  /* ── Render ── */
  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        marginBottom: 28, flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <h2 style={{ margin: "0 0 4px 0", fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>
            {title}
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
            {currentUser.username} · Genel ilerleme
          </p>
        </div>

        {/* Total progress badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {saveStatus === "saved" && (
            <span style={{ fontSize: 12, color: "#3d9b6e", background: "#eaf7f0", padding: "4px 10px", borderRadius: 50, fontWeight: 500 }}>
              ✓ Kaydedildi
            </span>
          )}
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Ring pct={totalPct} color={accentColor} size={72}/>
            <span style={{
              position: "absolute", fontSize: 15, fontWeight: 700,
              color: "var(--text-primary)"
            }}>
              {totalPct}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 24,
        background: "var(--bg-sidebar)",
        padding: 5, borderRadius: 12,
        width: "fit-content",
      }}>
        {[
          { id: "dashboard", label: "📊 Dashboard" },
          { id: "konular",   label: "📚 Konular"   },
        ].map(tab => (
          <button key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "8px 18px", borderRadius: 9,
              fontSize: 13, fontWeight: 500,
              cursor: "pointer", transition: "all 0.2s",
              border: "none",
              background: activeTab === tab.id ? "#fff" : "transparent",
              color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-secondary)",
              boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ════════ DASHBOARD TAB ════════ */}
      {activeTab === "dashboard" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {categories.map(cat => {
            const pct = getCatPct(cat.id);
            return (
              <div key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setActiveTab("konular"); }}
                style={{
                  background: "#fff",
                  border: `1px solid ${pct > 0 ? "var(--border-light)" : "var(--border-lighter)"}`,
                  borderRadius: 14, padding: 20,
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = `${cat.color}60`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = pct > 0 ? "var(--border-light)" : "var(--border-lighter)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 26 }}>{cat.icon}</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: cat.color }}>{pct}%</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>{cat.label}</div>
                {/* Progress bar */}
                <div style={{ background: "var(--bg-main)", borderRadius: 50, height: 5, overflow: "hidden" }}>
                  <div style={{
                    width: `${pct}%`, height: "100%", borderRadius: 50,
                    background: cat.color, transition: "width 0.6s cubic-bezier(.4,0,.2,1)"
                  }}/>
                </div>
                <div style={{ marginTop: 10, fontSize: 11.5, color: "var(--text-muted)" }}>
                  {allTopics(cat.id).length} konu · Tıkla →
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ════════ KONULAR TAB ════════ */}
      {activeTab === "konular" && (
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 18 }}>

          {/* Category sidebar */}
          <div style={{
            background: "var(--bg-sidebar)",
            borderRadius: 14, padding: 10,
            height: "fit-content",
            position: "sticky", top: 0,
          }}>
            {categories.map(c => {
              const isActive = activeCategory === c.id;
              const pct = getCatPct(c.id);
              return (
                <div key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                    marginBottom: 2, transition: "all 0.15s",
                    background: isActive ? "#fff" : "transparent",
                    boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.07)" : "none",
                  }}
                >
                  <span style={{ fontSize: 15 }}>{c.icon}</span>
                  <span style={{
                    flex: 1, fontSize: 13, fontWeight: isActive ? 600 : 400,
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {c.label}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: pct > 0 ? c.color : "var(--text-muted)",
                  }}>
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Topics list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 8,
            }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                {categories.find(c => c.id === activeCategory)?.label}
              </h3>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {allTopics(activeCategory).length} konu
              </span>
            </div>

            {allTopics(activeCategory).map(topic => (
              <TopicRow
                key={topic}
                topic={topic}
                level={state.progress[activeCategory]?.[topic] || 0}
                note={state.notes[activeCategory]?.[topic] || ""}
                accentColor={accentColor}
                onLevelChange={(lvl) => setLevel(activeCategory, topic, lvl)}
                onNoteChange={(text) => setNote(activeCategory, topic, text)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
