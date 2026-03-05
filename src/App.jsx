import { useState, useEffect } from "react";

const CATEGORIES = [
  { id: "algorithms", label: "Algoritmalar & Veri Yapıları", icon: "🧮", color: "#00ffc8" },
  { id: "languages", label: "Programlama Dilleri", icon: "💻", color: "#7c3aed" },
  { id: "systems", label: "Sistem Tasarımı", icon: "🏗️", color: "#f59e0b" },
  { id: "databases", label: "Veritabanları", icon: "🗄️", color: "#3b82f6" },
  { id: "web", label: "Web Geliştirme", icon: "🌐", color: "#ec4899" },
  { id: "devops", label: "DevOps & Cloud", icon: "☁️", color: "#10b981" },
  { id: "math", label: "Matematik & Teori", icon: "∑", color: "#f97316" },
  { id: "projects", label: "Projeler", icon: "🚀", color: "#06b6d4" },
];

const LEVELS = ["Başlamadım", "Öğreniyorum", "Biliyorum", "Uzmanım"];
const LEVEL_COLORS = ["#374151", "#d97706", "#3b82f6", "#10b981"];

const defaultTopics = {
  algorithms: [
    "Dizi & String algoritmaları", "Bağlı listeler", "Stack & Queue",
    "Binary Search", "Sorting algoritmaları", "Graf algoritmaları",
    "Dynamic Programming", "Ağaç yapıları (BST, Heap)", "Hash tabloları"
  ],
  languages: [
    "Python", "Java", "C/C++", "JavaScript", "SQL", "Bash/Shell"
  ],
  systems: [
    "Nesne Yönelimli Tasarım", "SOLID prensipleri", "Design Patterns",
    "Microservisler", "REST API tasarımı", "Ölçeklenebilirlik"
  ],
  databases: [
    "SQL temelleri", "PostgreSQL", "NoSQL (MongoDB)", "Redis",
    "ORM kullanımı", "İndeksleme & optimizasyon"
  ],
  web: [
    "HTML & CSS", "React / Vue", "Node.js", "HTTP & RESTful API",
    "Authentication (JWT, OAuth)", "WebSocket"
  ],
  devops: [
    "Git & GitHub", "Docker", "Linux komutları", "CI/CD",
    "Kubernetes temelleri", "AWS / GCP / Azure"
  ],
  math: [
    "Discrete matematik", "Olasılık & İstatistik", "Lineer cebir",
    "Big O notasyonu", "Hesaplama teorisi"
  ],
  projects: [],
};

const getInitialState = () => {
  const progress = {};
  const notes = {};
  Object.keys(defaultTopics).forEach(cat => {
    progress[cat] = {};
    notes[cat] = {};
    defaultTopics[cat].forEach(topic => {
      progress[cat][topic] = 0;
      notes[cat][topic] = "";
    });
  });
  return { progress, notes, customTopics: {}, projects: [], lastUpdated: new Date().toISOString() };
};

const STORAGE_KEY = "sweng-tracker-v1";

export default function App() {
  const [state, setState] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeCategory, setActiveCategory] = useState("algorithms");
  const [editingNote, setEditingNote] = useState(null);
  const [addingTopic, setAddingTopic] = useState(false);
  const [newTopicText, setNewTopicText] = useState("");
  const [newProject, setNewProject] = useState({ name: "", desc: "", status: "Planlıyor", tech: "" });
  const [addingProject, setAddingProject] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  // Load from persistent storage
  useEffect(() => {
    const load = async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY);
        if (result && result.value) {
          setState(JSON.parse(result.value));
        } else {
          setState(getInitialState());
        }
      } catch {
        setState(getInitialState());
      }
      setLoaded(true);
    };
    load();
  }, []);

  // Auto-save on state change
  useEffect(() => {
    if (!loaded || !state) return;
    const save = async () => {
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify(state));
        setSaveStatus("✓ Kaydedildi");
        setTimeout(() => setSaveStatus(""), 2000);
      } catch {
        setSaveStatus("⚠ Kayıt hatası");
      }
    };
    const timeout = setTimeout(save, 800);
    return () => clearTimeout(timeout);
  }, [state, loaded]);

  if (!loaded || !state) {
    return (
      <div style={{ background: "#080c14", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#00ffc8", fontFamily: "monospace", fontSize: 20 }}>Yükleniyor...</div>
      </div>
    );
  }

  const allTopics = (catId) => [
    ...(defaultTopics[catId] || []),
    ...(state.customTopics[catId] || [])
  ];

  const getCatProgress = (catId) => {
    const topics = allTopics(catId);
    if (!topics.length) return 0;
    const total = topics.reduce((sum, t) => sum + (state.progress[catId]?.[t] || 0), 0);
    return Math.round((total / (topics.length * 3)) * 100);
  };

  const totalProgress = () => {
    const vals = CATEGORIES.map(c => getCatProgress(c.id));
    return Math.round(vals.reduce((a, b) => a + b, 0) / CATEGORIES.length);
  };

  const setLevel = (catId, topic, level) => {
    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [catId]: { ...prev.progress[catId], [topic]: level }
      },
      lastUpdated: new Date().toISOString()
    }));
  };

  const setNote = (catId, topic, note) => {
    setState(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [catId]: { ...prev.notes[catId], [topic]: note }
      }
    }));
  };

  const addTopic = () => {
    if (!newTopicText.trim()) return;
    setState(prev => ({
      ...prev,
      customTopics: {
        ...prev.customTopics,
        [activeCategory]: [...(prev.customTopics[activeCategory] || []), newTopicText.trim()]
      }
    }));
    setNewTopicText("");
    setAddingTopic(false);
  };

  const addProject = () => {
    if (!newProject.name.trim()) return;
    setState(prev => ({
      ...prev,
      projects: [...(prev.projects || []), { ...newProject, id: Date.now(), created: new Date().toISOString() }]
    }));
    setNewProject({ name: "", desc: "", status: "Planlıyor", tech: "" });
    setAddingProject(false);
  };

  const updateProject = (id, field, val) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: val } : p)
    }));
  };

  const deleteProject = (id) => {
    setState(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const tp = totalProgress();
  const catData = CATEGORIES.map(c => ({ ...c, pct: getCatProgress(c.id) }));

  const styles = {
    app: {
      background: "#080c14",
      minHeight: "100vh",
      fontFamily: "'Courier New', monospace",
      color: "#e2e8f0",
    },
    header: {
      borderBottom: "1px solid #1e293b",
      padding: "20px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "rgba(0,255,200,0.03)",
    },
    logo: {
      fontSize: 22,
      fontWeight: 700,
      color: "#00ffc8",
      letterSpacing: 2,
      textTransform: "uppercase",
    },
    subtitle: { fontSize: 11, color: "#64748b", letterSpacing: 4, marginTop: 2 },
    saveStatus: { fontSize: 12, color: "#10b981", letterSpacing: 1 },
    nav: {
      display: "flex",
      gap: 4,
      padding: "12px 32px",
      borderBottom: "1px solid #1e293b",
      background: "#0a0f1a",
    },
    navBtn: (active) => ({
      padding: "6px 18px",
      border: "1px solid",
      borderColor: active ? "#00ffc8" : "#1e293b",
      borderRadius: 3,
      background: active ? "rgba(0,255,200,0.1)" : "transparent",
      color: active ? "#00ffc8" : "#64748b",
      cursor: "pointer",
      fontSize: 12,
      letterSpacing: 1,
      transition: "all 0.2s",
    }),
    main: { padding: "28px 32px", maxWidth: 1100, margin: "0 auto" },
  };

  // ---- DASHBOARD ----
  const Dashboard = () => (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 32 }}>
        <div style={{ background: "#0f1520", border: "1px solid #1e293b", borderRadius: 8, padding: 24, gridColumn: "1/2" }}>
          <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 3, marginBottom: 12 }}>GENEL İLERLEME</div>
          <div style={{ fontSize: 52, fontWeight: 700, color: "#00ffc8", lineHeight: 1 }}>{tp}<span style={{ fontSize: 24, opacity: 0.5 }}>%</span></div>
          <div style={{ marginTop: 16, background: "#1e293b", borderRadius: 4, height: 6, overflow: "hidden" }}>
            <div style={{ width: `${tp}%`, height: "100%", background: "linear-gradient(90deg, #00ffc8, #7c3aed)", transition: "width 1s" }} />
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 10 }}>
            Son güncelleme: {new Date(state.lastUpdated).toLocaleDateString("tr-TR")}
          </div>
        </div>

        <div style={{ background: "#0f1520", border: "1px solid #1e293b", borderRadius: 8, padding: 24, gridColumn: "2/4" }}>
          <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 3, marginBottom: 16 }}>KATEGORİ BAZINDA İLERLEME</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {catData.map(cat => (
              <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 14, width: 22 }}>{cat.icon}</span>
                <div style={{ fontSize: 11, color: "#94a3b8", width: 180, flexShrink: 0 }}>{cat.label}</div>
                <div style={{ flex: 1, background: "#1e293b", borderRadius: 3, height: 6, overflow: "hidden" }}>
                  <div style={{ width: `${cat.pct}%`, height: "100%", background: cat.color, transition: "width 0.8s", opacity: 0.85 }} />
                </div>
                <div style={{ fontSize: 12, color: cat.color, width: 36, textAlign: "right" }}>{cat.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {catData.map(cat => {
          const topics = allTopics(cat.id);
          const counts = [0,1,2,3].map(l => topics.filter(t => (state.progress[cat.id]?.[t] || 0) === l).length);
          return (
            <div
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setActiveTab("konular"); }}
              style={{
                background: "#0f1520",
                border: `1px solid ${cat.pct > 60 ? cat.color + "44" : "#1e293b"}`,
                borderRadius: 8, padding: "16px 20px", cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{cat.icon}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: cat.color }}>{cat.pct}%</span>
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10, lineHeight: 1.4 }}>{cat.label}</div>
              <div style={{ display: "flex", gap: 4 }}>
                {counts.map((c, i) => c > 0 && (
                  <span key={i} style={{
                    fontSize: 10, padding: "2px 6px", borderRadius: 3,
                    background: LEVEL_COLORS[i] + "33", color: LEVEL_COLORS[i], letterSpacing: 0.5
                  }}>{c}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ---- KONULAR ----
  const Konular = () => {
    const cat = CATEGORIES.find(c => c.id === activeCategory);
    const topics = allTopics(activeCategory);

    return (
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}>
        {/* Sidebar */}
        <div>
          <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 3, marginBottom: 12 }}>KATEGORİLER</div>
          {CATEGORIES.map(c => (
            <div
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              style={{
                padding: "10px 14px",
                marginBottom: 4,
                borderRadius: 6,
                cursor: "pointer",
                background: activeCategory === c.id ? "rgba(0,255,200,0.08)" : "transparent",
                border: `1px solid ${activeCategory === c.id ? c.color + "66" : "transparent"}`,
                display: "flex", alignItems: "center", gap: 10,
                transition: "all 0.15s",
              }}
            >
              <span>{c.icon}</span>
              <span style={{ fontSize: 11, color: activeCategory === c.id ? c.color : "#64748b", flex: 1 }}>{c.label}</span>
              <span style={{ fontSize: 11, color: c.color }}>{getCatProgress(c.id)}%</span>
            </div>
          ))}
        </div>

        {/* Topics */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: cat.color }}>{cat.icon} {cat.label}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{topics.length} konu • {getCatProgress(cat.id)}% tamamlandı</div>
            </div>
            <button
              onClick={() => setAddingTopic(true)}
              style={{
                padding: "8px 16px", background: "transparent",
                border: `1px solid ${cat.color}66`, borderRadius: 4,
                color: cat.color, cursor: "pointer", fontSize: 12, letterSpacing: 1
              }}
            >+ KONU EKLE</button>
          </div>

          {addingTopic && (
            <div style={{ background: "#0f1520", border: "1px solid #1e293b", borderRadius: 8, padding: 16, marginBottom: 16, display: "flex", gap: 10 }}>
              <input
                value={newTopicText}
                onChange={e => setNewTopicText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTopic()}
                placeholder="Konu adı..."
                style={{ flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: 4, padding: "8px 12px", color: "#e2e8f0", fontSize: 13, outline: "none" }}
                autoFocus
              />
              <button onClick={addTopic} style={{ padding: "8px 16px", background: cat.color, border: "none", borderRadius: 4, color: "#080c14", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>Ekle</button>
              <button onClick={() => setAddingTopic(false)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #334155", borderRadius: 4, color: "#64748b", cursor: "pointer", fontSize: 12 }}>İptal</button>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {topics.map(topic => {
              const level = state.progress[activeCategory]?.[topic] || 0;
              const note = state.notes[activeCategory]?.[topic] || "";
              const isEditing = editingNote === `${activeCategory}-${topic}`;
              return (
                <div
                  key={topic}
                  style={{
                    background: "#0f1520",
                    border: `1px solid ${level > 0 ? LEVEL_COLORS[level] + "33" : "#1e293b"}`,
                    borderRadius: 8, padding: "14px 18px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1, fontSize: 13, color: level > 0 ? "#e2e8f0" : "#64748b" }}>{topic}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {LEVELS.map((lbl, i) => (
                        <button
                          key={i}
                          onClick={() => setLevel(activeCategory, topic, i)}
                          title={lbl}
                          style={{
                            width: 28, height: 28, borderRadius: 4, cursor: "pointer",
                            border: `1px solid ${level === i ? LEVEL_COLORS[i] : "#1e293b"}`,
                            background: level === i ? LEVEL_COLORS[i] + "33" : "transparent",
                            color: level === i ? LEVEL_COLORS[i] : "#334155",
                            fontSize: 10, fontWeight: 700, transition: "all 0.15s",
                          }}
                        >{i}</button>
                      ))}
                    </div>
                    <span style={{
                      fontSize: 10, padding: "2px 8px", borderRadius: 12,
                      background: LEVEL_COLORS[level] + "22",
                      color: LEVEL_COLORS[level], letterSpacing: 1, minWidth: 80, textAlign: "center"
                    }}>{LEVELS[level]}</span>
                    <button
                      onClick={() => setEditingNote(isEditing ? null : `${activeCategory}-${topic}`)}
                      style={{ background: "transparent", border: "none", color: "#334155", cursor: "pointer", fontSize: 16, padding: "0 4px" }}
                      title="Not ekle"
                    >📝</button>
                  </div>
                  {isEditing && (
                    <div style={{ marginTop: 10 }}>
                      <textarea
                        value={note}
                        onChange={e => setNote(activeCategory, topic, e.target.value)}
                        placeholder="Not ekle... (kaynaklar, öğrendiklerin, hatırlatmalar)"
                        rows={3}
                        style={{
                          width: "100%", background: "#1e293b", border: "1px solid #334155",
                          borderRadius: 4, padding: "8px 12px", color: "#e2e8f0",
                          fontSize: 12, resize: "vertical", outline: "none", boxSizing: "border-box"
                        }}
                        autoFocus
                      />
                    </div>
                  )}
                  {!isEditing && note && (
                    <div style={{ marginTop: 8, fontSize: 11, color: "#64748b", borderLeft: "2px solid #334155", paddingLeft: 10 }}>{note}</div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 20, display: "flex", gap: 16, flexWrap: "wrap" }}>
            {LEVELS.map((lbl, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b" }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: LEVEL_COLORS[i], display: "inline-block" }} />
                {i}: {lbl}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ---- PROJELER ----
  const Projeler = () => {
    const projects = state.projects || [];
    const statuses = ["Planlıyor", "Devam Ediyor", "Tamamlandı", "Duraklatıldı"];
    const statusColors = { "Planlıyor": "#64748b", "Devam Ediyor": "#3b82f6", "Tamamlandı": "#10b981", "Duraklatıldı": "#f59e0b" };

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#06b6d4" }}>🚀 Projeler</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{projects.length} proje kayıtlı</div>
          </div>
          <button
            onClick={() => setAddingProject(true)}
            style={{ padding: "8px 18px", background: "transparent", border: "1px solid #06b6d466", borderRadius: 4, color: "#06b6d4", cursor: "pointer", fontSize: 12, letterSpacing: 1 }}
          >+ YENİ PROJE</button>
        </div>

        {addingProject && (
          <div style={{ background: "#0f1520", border: "1px solid #1e293b", borderRadius: 10, padding: 20, marginBottom: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <input value={newProject.name} onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))}
                placeholder="Proje adı *"
                style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 4, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
              <input value={newProject.tech} onChange={e => setNewProject(p => ({ ...p, tech: e.target.value }))}
                placeholder="Teknolojiler (React, Node, ...)"
                style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 4, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
            </div>
            <textarea value={newProject.desc} onChange={e => setNewProject(p => ({ ...p, desc: e.target.value }))}
              placeholder="Proje açıklaması..."
              rows={2}
              style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: 4, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box", marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <select value={newProject.status} onChange={e => setNewProject(p => ({ ...p, status: e.target.value }))}
                style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 4, padding: "8px 12px", color: "#e2e8f0", fontSize: 12, cursor: "pointer" }}>
                {statuses.map(s => <option key={s}>{s}</option>)}
              </select>
              <button onClick={addProject} style={{ padding: "8px 20px", background: "#06b6d4", border: "none", borderRadius: 4, color: "#080c14", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>Kaydet</button>
              <button onClick={() => setAddingProject(false)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #334155", borderRadius: 4, color: "#64748b", cursor: "pointer", fontSize: 12 }}>İptal</button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {projects.map(p => (
            <div key={p.id} style={{ background: "#0f1520", border: "1px solid #1e293b", borderRadius: 10, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{p.name}</div>
                <button onClick={() => deleteProject(p.id)} style={{ background: "transparent", border: "none", color: "#334155", cursor: "pointer", fontSize: 14, padding: 0 }}>✕</button>
              </div>
              {p.desc && <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12, lineHeight: 1.5 }}>{p.desc}</div>}
              {p.tech && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                  {p.tech.split(",").map((t, i) => (
                    <span key={i} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 3, background: "#1e293b", color: "#94a3b8", letterSpacing: 1 }}>{t.trim()}</span>
                  ))}
                </div>
              )}
              <select
                value={p.status}
                onChange={e => updateProject(p.id, "status", e.target.value)}
                style={{
                  background: statusColors[p.status] + "22", border: `1px solid ${statusColors[p.status]}44`,
                  borderRadius: 4, padding: "4px 10px", color: statusColors[p.status],
                  fontSize: 11, cursor: "pointer", letterSpacing: 1
                }}
              >
                {statuses.map(s => <option key={s} style={{ background: "#0f1520", color: "#e2e8f0" }}>{s}</option>)}
              </select>
            </div>
          ))}
          {projects.length === 0 && (
            <div style={{ gridColumn: "1/3", textAlign: "center", padding: 60, color: "#334155", fontSize: 13 }}>
              Henüz proje eklenmedi. İlk projenizi ekleyin! 🚀
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div>
          <div style={styles.logo}>SW Engineer Tracker</div>
          <div style={styles.subtitle}>YAZILIM MÜHENDİSLİĞİ GELİŞİM TAKİBİ</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#00ffc8" }}>{tp}<span style={{ fontSize: 14, opacity: 0.5 }}>%</span></div>
          <div style={styles.saveStatus}>{saveStatus || `${CATEGORIES.length} kategori`}</div>
        </div>
      </div>

      <div style={styles.nav}>
        {[["dashboard", "📊 Dashboard"], ["konular", "📚 Konular"], ["projeler", "🚀 Projeler"]].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={styles.navBtn(activeTab === id)}>{label}</button>
        ))}
      </div>

      <div style={styles.main}>
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "konular" && <Konular />}
        {activeTab === "projeler" && <Projeler />}
      </div>
    </div>
  );
}
