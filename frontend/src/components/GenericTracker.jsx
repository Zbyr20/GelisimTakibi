import { useState, useEffect } from "react";
import { glass, topNavBtn, inputStyle, LEVELS, LEVEL_COLORS, LEVEL_TEXT } from "../utils/styles";
import { getInitialState } from "../constants/data";

export default function GenericTracker({ currentUser, title, categories, defaultTopics, storageKeyPrefix, accentColor }) {
  const [state, setState] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [editingNote, setEditingNote] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const storageKey = `${storageKeyPrefix}_${currentUser.email}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setState(saved ? JSON.parse(saved) : getInitialState(defaultTopics));
    } catch { setState(getInitialState(defaultTopics)); }
    setLoaded(true);
  }, [storageKey, defaultTopics]);

  useEffect(() => {
    if (!loaded || !state) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
        setSaveStatus("✓ Kaydedildi");
        setTimeout(() => setSaveStatus(""), 2000);
      } catch { setSaveStatus("⚠ Hata"); }
    }, 800);
    return () => clearTimeout(t);
  }, [state, loaded, storageKey]);

  if (!loaded || !state) return <div style={{color: accentColor, textAlign:"center", padding:"50px"}}>Yükleniyor...</div>;

  const allTopics = (catId) => [...(defaultTopics[catId] || []), ...(state.customTopics[catId] || [])];
  const getCatProgress = (catId) => {
    const t = allTopics(catId);
    if (!t.length) return 0;
    return Math.round((t.reduce((s, tp) => s + (state.progress[catId]?.[tp] || 0), 0) / (t.length * 3)) * 100);
  };
  const totalProgress = () => Math.round(categories.map(c => getCatProgress(c.id)).reduce((a,b)=>a+b,0) / categories.length);

  const tp = totalProgress();
  const catData = categories.map(c => ({ ...c, pct: getCatProgress(c.id) }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "20px" }}>
        <div>
          <h2 style={{ margin: 0, color: accentColor, fontSize: "24px" }}>{title}</h2>
          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button onClick={() => setActiveTab("dashboard")} style={topNavBtn(accentColor, activeTab === "dashboard")}>📊 İlerleme (Dashboard)</button>
            <button onClick={() => setActiveTab("konular")} style={topNavBtn(accentColor, activeTab === "konular")}>📚 Müfredat & Konular</button>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "36px", fontWeight: 800, color: accentColor }}>{tp}<span style={{ fontSize: "18px", opacity: 0.5 }}>%</span></div>
          <div style={{ fontSize: "12px", color: saveStatus ? "#4ade80" : "rgba(255,255,255,0.4)" }}>{saveStatus || "Güncel"}</div>
        </div>
      </div>

      {activeTab === "dashboard" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
          {catData.map(cat => (
            <div key={cat.id} onClick={() => { setActiveCategory(cat.id); setActiveTab("konular"); }}
              style={{ ...glass({ padding: "20px", cursor: "pointer", borderColor: cat.pct > 50 ? `${cat.color}55` : "rgba(255,255,255,0.1)" }), transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <span style={{ fontSize: "28px" }}>{cat.icon}</span>
                <span style={{ fontSize: "22px", fontWeight: 700, color: cat.color }}>{cat.pct}%</span>
              </div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "10px" }}>{cat.label}</div>
              <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "6px", height: "6px", overflow: "hidden" }}>
                <div style={{ width: `${cat.pct}%`, height: "100%", background: cat.color, borderRadius: "6px" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "konular" && (
        <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: "20px" }}>
          <div style={{ ...glass({ padding: "16px" }) }}>
            {categories.map(c => (
              <div key={c.id} onClick={() => setActiveCategory(c.id)}
                style={{ padding: "12px", marginBottom: "6px", borderRadius: "10px", cursor: "pointer",
                  background: activeCategory === c.id ? c.bg : "transparent",
                  border: `1px solid ${activeCategory === c.id ? `${c.color}44` : "transparent"}`,
                  display: "flex", alignItems: "center", gap: "10px", transition: "all 0.2s" }}>
                <span style={{ fontSize: "16px" }}>{c.icon}</span>
                <span style={{ fontSize: "13px", color: activeCategory === c.id ? c.color : "rgba(255,255,255,0.6)", flex: 1, fontWeight: activeCategory === c.id ? 600 : 400 }}>{c.label}</span>
                <span style={{ fontSize: "12px", color: c.color, fontWeight: 700 }}>{getCatProgress(c.id)}%</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {allTopics(activeCategory).map(topic => {
                const level = state.progress[activeCategory]?.[topic] || 0;
                const note = state.notes[activeCategory]?.[topic] || "";
                const isEditing = editingNote === `${activeCategory}-${topic}`;
                return (
                  <div key={topic} style={{ ...glass({ padding: "16px", borderColor: level > 0 ? `${LEVEL_TEXT[level]}44` : "rgba(255,255,255,0.09)" }) }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ flex: 1, fontSize: "14px", fontWeight: 500, color: level > 0 ? "#e2e8f0" : "rgba(255,255,255,0.5)" }}>{topic}</div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {LEVELS.map((lbl, i) => (
                          <button key={i} onClick={() => setState(p => ({ ...p, progress: { ...p.progress, [activeCategory]: { ...p.progress[activeCategory], [topic]: i } } }))} title={lbl}
                            style={{ width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer",
                              border: `1.5px solid ${level === i ? LEVEL_TEXT[i] : "rgba(255,255,255,0.1)"}`,
                              background: level === i ? `${LEVEL_COLORS[i]}55` : "rgba(255,255,255,0.04)",
                              color: level === i ? LEVEL_TEXT[i] : "rgba(255,255,255,0.3)", fontSize: "12px", fontWeight: 700 }}>
                            {i}
                          </button>
                        ))}
                      </div>
                      <span style={{ fontSize: "11px", padding: "4px 12px", borderRadius: "20px", background: `${LEVEL_COLORS[level]}22`, color: LEVEL_TEXT[level], minWidth: "90px", textAlign: "center", fontWeight: 600 }}>
                        {LEVELS[level]}
                      </span>
                      <button onClick={() => setEditingNote(isEditing ? null : `${activeCategory}-${topic}`)}
                        style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "16px", padding: "0 5px" }}>📝</button>
                    </div>
                    {isEditing && (
                      <textarea value={note} onChange={e => setState(p => ({ ...p, notes: { ...p.notes, [activeCategory]: { ...p.notes[activeCategory], [topic]: e.target.value } } }))}
                        placeholder="Bu konuya dair notlarını buraya al..." rows={2} autoFocus
                        style={{ ...inputStyle, marginTop: "14px", background: "rgba(0,0,0,0.2)" }} />
                    )}
                    {!isEditing && note && (
                      <div style={{ marginTop: "12px", fontSize: "13px", color: "rgba(255,255,255,0.5)", borderLeft: `2px solid ${accentColor}`, paddingLeft: "12px", fontStyle: "italic" }}>{note}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}