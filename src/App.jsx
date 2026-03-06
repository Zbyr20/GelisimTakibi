import { useState, useEffect } from "react";

const CATEGORIES = [
  { id: "algorithms", label: "Algoritmalar & Veri Yapıları", icon: "🧮", color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  { id: "languages",  label: "Programlama Dilleri",          icon: "💻", color: "#38bdf8", bg: "rgba(56,189,248,0.12)" },
  { id: "systems",    label: "Sistem Tasarımı",              icon: "🏗️", color: "#fb923c", bg: "rgba(251,146,60,0.12)"  },
  { id: "databases",  label: "Veritabanları",                icon: "🗄️", color: "#4ade80", bg: "rgba(74,222,128,0.12)" },
  { id: "web",        label: "Web Geliştirme",               icon: "🌐", color: "#f472b6", bg: "rgba(244,114,182,0.12)" },
  { id: "devops",     label: "DevOps & Cloud",               icon: "☁️", color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  { id: "math",       label: "Matematik & Teori",            icon: "∑",  color: "#fbbf24", bg: "rgba(251,191,36,0.12)"  },
  { id: "projects",   label: "Projeler",                     icon: "🚀", color: "#60a5fa", bg: "rgba(96,165,250,0.12)"  },
];

const LEVELS = ["Başlamadım", "Öğreniyorum", "Biliyorum", "Uzmanım"];
const LEVEL_COLORS = ["rgba(255,255,255,0.15)", "#fbbf24", "#38bdf8", "#4ade80"];
const LEVEL_TEXT   = ["#94a3b8", "#fbbf24", "#38bdf8", "#4ade80"];

const defaultTopics = {
  algorithms: ["Dizi & String algoritmaları","Bağlı listeler","Stack & Queue","Binary Search","Sorting algoritmaları","Graf algoritmaları","Dynamic Programming","Ağaç yapıları (BST, Heap)","Hash tabloları"],
  languages:  ["Python","Java","C/C++","JavaScript","SQL","Bash/Shell"],
  systems:    ["Nesne Yönelimli Tasarım","SOLID prensipleri","Design Patterns","Microservisler","REST API tasarımı","Ölçeklenebilirlik"],
  databases:  ["SQL temelleri","PostgreSQL","NoSQL (MongoDB)","Redis","ORM kullanımı","İndeksleme & optimizasyon"],
  web:        ["HTML & CSS","React / Vue","Node.js","HTTP & RESTful API","Authentication (JWT, OAuth)","WebSocket"],
  devops:     ["Git & GitHub","Docker","Linux komutları","CI/CD","Kubernetes temelleri","AWS / GCP / Azure"],
  math:       ["Discrete matematik","Olasılık & İstatistik","Lineer cebir","Big O notasyonu","Hesaplama teorisi"],
  projects:   [],
};

const STORAGE_KEY = "sweng-tracker-v1";

const getInitialState = () => {
  const progress = {}, notes = {};
  Object.keys(defaultTopics).forEach(cat => {
    progress[cat] = {}; notes[cat] = {};
    defaultTopics[cat].forEach(topic => { progress[cat][topic] = 0; notes[cat][topic] = ""; });
  });
  return { progress, notes, customTopics: {}, projects: [], lastUpdated: new Date().toISOString() };
};

/* ─── glassmorphism helpers ─────────────────────────────────── */
const glass = (extra = {}) => ({
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 16,
  ...extra,
});

const softBtn = (color, active) => ({
  padding: "7px 18px",
  borderRadius: 10,
  border: `1px solid ${active ? color : "rgba(255,255,255,0.1)"}`,
  background: active ? `${color}22` : "rgba(255,255,255,0.04)",
  color: active ? color : "rgba(255,255,255,0.45)",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: 0.3,
  transition: "all 0.2s",
});

export default function App() {
  const [state, setState]               = useState(null);
  const [activeTab, setActiveTab]       = useState("dashboard");
  const [activeCategory, setActiveCategory] = useState("algorithms");
  const [editingNote, setEditingNote]   = useState(null);
  const [addingTopic, setAddingTopic]   = useState(false);
  const [newTopicText, setNewTopicText] = useState("");
  const [addingProject, setAddingProject] = useState(false);
  const [loaded, setLoaded]             = useState(false);
  const [saveStatus, setSaveStatus]     = useState("");

  const newProject = { name: "", desc: "", status: "Planlıyor", tech: "" };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setState(saved ? JSON.parse(saved) : getInitialState());
    } catch { setState(getInitialState()); }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || !state) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        setSaveStatus("✓ Kaydedildi");
        setTimeout(() => setSaveStatus(""), 2000);
      } catch { setSaveStatus("⚠ Kayıt hatası"); }
    }, 800);
    return () => clearTimeout(t);
  }, [state, loaded]);

  if (!loaded || !state) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#a78bfa", fontFamily: "Inter", fontSize: 18, opacity: 0.8 }}>Yükleniyor…</div>
    </div>
  );

  const allTopics    = (catId) => [...(defaultTopics[catId] || []), ...(state.customTopics[catId] || [])];
  const getCatProgress = (catId) => {
    const t = allTopics(catId);
    if (!t.length) return 0;
    return Math.round((t.reduce((s, tp) => s + (state.progress[catId]?.[tp] || 0), 0) / (t.length * 3)) * 100);
  };
  const totalProgress = () => Math.round(CATEGORIES.map(c => getCatProgress(c.id)).reduce((a,b)=>a+b,0) / CATEGORIES.length);

  const setLevel = (catId, topic, lvl) =>
    setState(p => ({ ...p, progress: { ...p.progress, [catId]: { ...p.progress[catId], [topic]: lvl } }, lastUpdated: new Date().toISOString() }));

  const setNote = (catId, topic, note) =>
    setState(p => ({ ...p, notes: { ...p.notes, [catId]: { ...p.notes[catId], [topic]: note } } }));

  const addTopic = () => {
    if (!newTopicText.trim()) return;
    setState(p => ({ ...p, customTopics: { ...p.customTopics, [activeCategory]: [...(p.customTopics[activeCategory]||[]), newTopicText.trim()] } }));
    setNewTopicText(""); setAddingTopic(false);
  };

  const deleteTopic = (catId, topic) => {
    if (!window.confirm(`"${topic}" konusunu silmek istiyor musun?`)) return;
    setState(p => {
      const np = { ...p.progress[catId] }; delete np[topic];
      const nn = { ...p.notes[catId] }; delete nn[topic];
      return { ...p, customTopics: { ...p.customTopics, [catId]: (p.customTopics[catId]||[]).filter(t=>t!==topic) }, progress: { ...p.progress, [catId]: np }, notes: { ...p.notes, [catId]: nn } };
    });
  };

  const updateProject = (id, field, val) =>
    setState(p => ({ ...p, projects: p.projects.map(pr => pr.id===id ? { ...pr, [field]: val } : pr) }));

  const deleteProject = (id) =>
    setState(p => ({ ...p, projects: p.projects.filter(pr => pr.id!==id) }));

  const tp      = totalProgress();
  const catData = CATEGORIES.map(c => ({ ...c, pct: getCatProgress(c.id) }));

  const projStatuses      = ["Planlıyor","Devam Ediyor","Tamamlandı","Duraklatıldı"];
  const projStatusColors  = { "Planlıyor":"#94a3b8","Devam Ediyor":"#38bdf8","Tamamlandı":"#4ade80","Duraklatıldı":"#fbbf24" };

  /* ─── INPUT / TEXTAREA shared style ─── */
  const inputStyle = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#e2e8f0",
    fontSize: 13,
    outline: "none",
    width: "100%",
    fontFamily: "Inter",
  };

  /* ══════════ DASHBOARD ══════════ */
  const Dashboard = () => (
    <div>
      {/* Top stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", gap:20, marginBottom:24 }}>

        {/* Big progress card */}
        <div style={{ ...glass({ padding:28 }) }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:3, marginBottom:12, textTransform:"uppercase" }}>Genel İlerleme</div>
          <div style={{ fontSize:64, fontWeight:700, color:"#a78bfa", lineHeight:1 }}>
            {tp}<span style={{ fontSize:28, opacity:0.5 }}>%</span>
          </div>
          {/* arc-like progress ring as simple bar */}
          <div style={{ marginTop:18, background:"rgba(255,255,255,0.08)", borderRadius:8, height:8, overflow:"hidden" }}>
            <div style={{ width:`${tp}%`, height:"100%", background:"linear-gradient(90deg,#a78bfa,#38bdf8)", borderRadius:8, transition:"width 1s ease" }} />
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:12 }}>
            Son güncelleme: {new Date(state.lastUpdated).toLocaleDateString("tr-TR")}
          </div>
        </div>

        {/* Category bars */}
        <div style={{ ...glass({ padding:28 }) }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:3, marginBottom:18, textTransform:"uppercase" }}>Kategori Bazında</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {catData.map(cat => (
              <div key={cat.id} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:15, width:22 }}>{cat.icon}</span>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", width:190, flexShrink:0 }}>{cat.label}</div>
                <div style={{ flex:1, background:"rgba(255,255,255,0.07)", borderRadius:6, height:7, overflow:"hidden" }}>
                  <div style={{ width:`${cat.pct}%`, height:"100%", background:cat.color, opacity:0.85, borderRadius:6, transition:"width 0.8s ease" }} />
                </div>
                <div style={{ fontSize:12, color:cat.color, width:36, textAlign:"right", fontWeight:600 }}>{cat.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category cards grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {catData.map(cat => {
          const topics = allTopics(cat.id);
          const counts = [0,1,2,3].map(l => topics.filter(t => (state.progress[cat.id]?.[t]||0)===l).length);
          return (
            <div key={cat.id} onClick={() => { setActiveCategory(cat.id); setActiveTab("konular"); }}
              style={{ ...glass({ padding:"18px 20px", cursor:"pointer", borderColor: cat.pct>50 ? `${cat.color}44` : "rgba(255,255,255,0.1)" }),
                transition:"all 0.25s", position:"relative", overflow:"hidden" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.06)"}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <span style={{ fontSize:24 }}>{cat.icon}</span>
                <span style={{ fontSize:20, fontWeight:700, color:cat.color }}>{cat.pct}%</span>
              </div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginBottom:12, lineHeight:1.45 }}>{cat.label}</div>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {counts.map((c,i) => c>0 && (
                  <span key={i} style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:`${LEVEL_COLORS[i]}33`, color:LEVEL_TEXT[i], fontWeight:500 }}>{c}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ══════════ KONULAR ══════════ */
  const Konular = () => {
    const cat    = CATEGORIES.find(c => c.id===activeCategory);
    const topics = allTopics(activeCategory);
    return (
      <div style={{ display:"grid", gridTemplateColumns:"230px 1fr", gap:20 }}>

        {/* Sidebar */}
        <div style={{ ...glass({ padding:16 }) }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", letterSpacing:3, marginBottom:14, textTransform:"uppercase" }}>Kategoriler</div>
          {CATEGORIES.map(c => (
            <div key={c.id} onClick={() => setActiveCategory(c.id)}
              style={{ padding:"10px 12px", marginBottom:4, borderRadius:10, cursor:"pointer",
                background: activeCategory===c.id ? c.bg : "transparent",
                border: `1px solid ${activeCategory===c.id ? `${c.color}44` : "transparent"}`,
                display:"flex", alignItems:"center", gap:10, transition:"all 0.18s" }}
              onMouseEnter={e => { if(activeCategory!==c.id) e.currentTarget.style.background="rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if(activeCategory!==c.id) e.currentTarget.style.background="transparent"; }}
            >
              <span style={{ fontSize:15 }}>{c.icon}</span>
              <span style={{ fontSize:12, color: activeCategory===c.id ? c.color : "rgba(255,255,255,0.5)", flex:1 }}>{c.label}</span>
              <span style={{ fontSize:11, color:c.color, fontWeight:600 }}>{getCatProgress(c.id)}%</span>
            </div>
          ))}
        </div>

        {/* Topic list */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <div style={{ fontSize:20, fontWeight:700, color:cat.color }}>{cat.icon} {cat.label}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{topics.length} konu • {getCatProgress(cat.id)}% tamamlandı</div>
            </div>
            <button onClick={() => setAddingTopic(true)}
              style={{ padding:"9px 18px", background:"rgba(255,255,255,0.06)", border:`1px solid ${cat.color}55`, borderRadius:10, color:cat.color, cursor:"pointer", fontSize:12, fontWeight:500, backdropFilter:"blur(10px)" }}>
              + Konu Ekle
            </button>
          </div>

          {addingTopic && (
            <div style={{ ...glass({ padding:16, marginBottom:16 }), display:"flex", gap:10 }}>
              <input value={newTopicText} onChange={e => setNewTopicText(e.target.value)}
                onKeyDown={e => e.key==="Enter" && addTopic()}
                placeholder="Konu adı..." autoFocus
                style={{ ...inputStyle, flex:1 }} />
              <button onClick={addTopic}
                style={{ padding:"10px 18px", background:cat.color, border:"none", borderRadius:10, color:"#0f172a", cursor:"pointer", fontWeight:700, fontSize:13 }}>Ekle</button>
              <button onClick={() => setAddingTopic(false)}
                style={{ padding:"10px 14px", background:"transparent", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:13 }}>İptal</button>
            </div>
          )}

          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {topics.map(topic => {
              const level    = state.progress[activeCategory]?.[topic] || 0;
              const note     = state.notes[activeCategory]?.[topic] || "";
              const isEditing = editingNote===`${activeCategory}-${topic}`;
              return (
                <div key={topic}
                  style={{ ...glass({ padding:"14px 18px", borderColor: level>0 ? `${LEVEL_TEXT[level]}33` : "rgba(255,255,255,0.09)" }) }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ flex:1, fontSize:13, fontWeight:500, color: level>0 ? "#e2e8f0" : "rgba(255,255,255,0.45)" }}>{topic}</div>

                    {/* Level buttons */}
                    <div style={{ display:"flex", gap:5 }}>
                      {LEVELS.map((lbl, i) => (
                        <button key={i} onClick={() => setLevel(activeCategory, topic, i)} title={lbl}
                          style={{ width:30, height:30, borderRadius:8, cursor:"pointer",
                            border:`1.5px solid ${level===i ? LEVEL_TEXT[i] : "rgba(255,255,255,0.1)"}`,
                            background: level===i ? `${LEVEL_COLORS[i]}55` : "rgba(255,255,255,0.04)",
                            color: level===i ? LEVEL_TEXT[i] : "rgba(255,255,255,0.25)", fontSize:11, fontWeight:700,
                            transition:"all 0.15s" }}>
                          {i}
                        </button>
                      ))}
                    </div>

                    <span style={{ fontSize:11, padding:"3px 12px", borderRadius:20,
                      background:`${LEVEL_COLORS[level]}22`, color:LEVEL_TEXT[level],
                      minWidth:90, textAlign:"center", fontWeight:500 }}>
                      {LEVELS[level]}
                    </span>

                    <button onClick={() => setEditingNote(isEditing ? null : `${activeCategory}-${topic}`)}
                      style={{ background:"transparent", border:"none", color:"rgba(255,255,255,0.25)", cursor:"pointer", fontSize:16, padding:"0 4px", transition:"color 0.15s" }}
                      onMouseEnter={e=>e.target.style.color="#fbbf24"}
                      onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.25)"}
                      title="Not ekle">📝</button>

                    <button onClick={() => deleteTopic(activeCategory, topic)}
                      style={{ background:"transparent", border:"none", color:"rgba(255,255,255,0.2)", cursor:"pointer", fontSize:13, padding:"0 4px", transition:"color 0.15s" }}
                      onMouseEnter={e=>e.target.style.color="#f87171"}
                      onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.2)"}
                      title="Sil">✕</button>
                  </div>

                  {isEditing && (
                    <textarea value={note} onChange={e => setNote(activeCategory, topic, e.target.value)}
                      placeholder="Notunuzu buraya yazın..." rows={3} autoFocus
                      style={{ ...inputStyle, marginTop:12, resize:"vertical", background:"rgba(255,255,255,0.05)" }} />
                  )}
                  {!isEditing && note && (
                    <div style={{ marginTop:10, fontSize:12, color:"rgba(255,255,255,0.45)", borderLeft:`2px solid ${cat.color}55`, paddingLeft:12, lineHeight:1.6 }}>{note}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ marginTop:20, display:"flex", gap:18, flexWrap:"wrap" }}>
            {LEVELS.map((lbl, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color:"rgba(255,255,255,0.4)" }}>
                <span style={{ width:10, height:10, borderRadius:3, background:LEVEL_TEXT[i], display:"inline-block", opacity: i===0?0.3:0.8 }} />
                {i}: {lbl}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ══════════ PROJELER ══════════ */
  const ProjelerView = () => {
    const projects = state.projects || [];
    return (
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:700, color:"#60a5fa" }}>🚀 Projeler</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>{projects.length} proje kayıtlı</div>
          </div>
          <button onClick={() => setAddingProject(true)}
            style={{ padding:"9px 20px", background:"rgba(96,165,250,0.12)", border:"1px solid rgba(96,165,250,0.35)", borderRadius:10, color:"#60a5fa", cursor:"pointer", fontSize:13, fontWeight:500, backdropFilter:"blur(10px)" }}>
            + Yeni Proje
          </button>
        </div>

        {addingProject && (
          <div style={{ ...glass({ padding:22, marginBottom:20 }) }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
              <input defaultValue="" onChange={e => { newProject.name = e.target.value; }} placeholder="Proje adı *" style={inputStyle} />
              <input defaultValue="" onChange={e => { newProject.tech = e.target.value; }} placeholder="Teknolojiler (React, Node…)" style={inputStyle} />
            </div>
            <textarea defaultValue="" onChange={e => { newProject.desc = e.target.value; }} placeholder="Proje açıklaması…" rows={2}
              style={{ ...inputStyle, resize:"vertical", marginBottom:12 }} />
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <select defaultValue="Planlıyor" onChange={e => { newProject.status = e.target.value; }}
                style={{ ...inputStyle, width:"auto", cursor:"pointer" }}>
                {projStatuses.map(s => <option key={s}>{s}</option>)}
              </select>
              <button
                onClick={() => {
                  if (!newProject.name?.trim()) return;
                  setState(p => ({ ...p, projects: [...(p.projects||[]), { name:newProject.name||"", desc:newProject.desc||"", tech:newProject.tech||"", status:newProject.status||"Planlıyor", id:Date.now(), created:new Date().toISOString() }] }));
                  newProject.name=""; newProject.desc=""; newProject.tech=""; newProject.status="Planlıyor";
                  setAddingProject(false);
                }}
                style={{ padding:"10px 22px", background:"#60a5fa", border:"none", borderRadius:10, color:"#0f172a", cursor:"pointer", fontWeight:700, fontSize:13 }}>
                Kaydet
              </button>
              <button onClick={() => setAddingProject(false)}
                style={{ padding:"10px 16px", background:"transparent", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:13 }}>
                İptal
              </button>
            </div>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {projects.map(p => (
            <div key={p.id} style={{ ...glass({ padding:22 }) }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div style={{ fontSize:16, fontWeight:600, color:"#e2e8f0" }}>{p.name}</div>
                <button onClick={() => { if(window.confirm(`"${p.name}" projesini silmek istiyor musun?`)) deleteProject(p.id); }}
                  style={{ background:"transparent", border:"none", color:"rgba(255,255,255,0.2)", cursor:"pointer", fontSize:14, transition:"color 0.15s" }}
                  onMouseEnter={e=>e.target.style.color="#f87171"}
                  onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.2)"}>✕</button>
              </div>
              {p.desc && <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:14, lineHeight:1.6 }}>{p.desc}</div>}
              {p.tech && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                  {p.tech.split(",").map((t,i) => (
                    <span key={i} style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.6)", border:"1px solid rgba(255,255,255,0.1)" }}>{t.trim()}</span>
                  ))}
                </div>
              )}
              <select value={p.status} onChange={e => updateProject(p.id,"status",e.target.value)}
                style={{ background:`${projStatusColors[p.status]}18`, border:`1px solid ${projStatusColors[p.status]}55`, borderRadius:8, padding:"5px 12px", color:projStatusColors[p.status], fontSize:12, cursor:"pointer", fontFamily:"Inter" }}>
                {projStatuses.map(s => <option key={s} style={{ background:"#1e1b4b", color:"#e2e8f0" }}>{s}</option>)}
              </select>
            </div>
          ))}
          {projects.length===0 && (
            <div style={{ gridColumn:"1/3", textAlign:"center", padding:60, color:"rgba(255,255,255,0.2)", fontSize:14 }}>
              Henüz proje eklenmedi. İlk projenizi ekleyin! 🚀
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ══════════ SHELL ══════════ */
  return (
    <div style={{ minHeight:"100vh", color:"#e2e8f0", fontFamily:"Inter, sans-serif" }}>

      {/* Header */}
      <div style={{ ...glass({ borderRadius:0, borderLeft:"none", borderRight:"none", borderTop:"none", padding:"18px 36px" }),
        display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div>
          <div style={{ fontSize:20, fontWeight:700, color:"#a78bfa", letterSpacing:1 }}>SW Engineer Tracker</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:3, marginTop:2, textTransform:"uppercase" }}>Yazılım Mühendisliği Gelişim Takibi</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:32, fontWeight:700, color:"#a78bfa" }}>{tp}<span style={{ fontSize:16, opacity:0.5 }}>%</span></div>
          <div style={{ fontSize:12, color: saveStatus ? "#4ade80" : "rgba(255,255,255,0.3)" }}>{saveStatus || `${CATEGORIES.length} kategori`}</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display:"flex", gap:8, padding:"14px 36px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        {[["dashboard","📊 Dashboard"],["konular","📚 Konular"],["projeler","🚀 Projeler"]].map(([id,label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={softBtn("#a78bfa", activeTab===id)}>{label}</button>
        ))}
      </div>

      {/* Main */}
      <div style={{ padding:"30px 36px", maxWidth:1140, margin:"0 auto" }}>
        {activeTab==="dashboard" && <Dashboard />}
        {activeTab==="konular"   && <Konular />}
        {activeTab==="projeler"  && <ProjelerView />}
      </div>
    </div>
  );
}