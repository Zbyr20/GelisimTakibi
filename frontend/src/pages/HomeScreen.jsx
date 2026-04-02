/* ─────────────────────────────────────────────
   HomeScreen — Claude.ai-inspired greeting page
───────────────────────────────────────────── */

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5)  return "İyi geceler";
  if (h < 12) return "Günaydın";
  if (h < 17) return "İyi öğleden sonralar";
  if (h < 22) return "İyi akşamlar";
  return "İyi geceler";
}

const SUGGESTIONS = [
  { emoji: "💻", label: "SW Tracker'ı aç", app: "sw_tracker" },
  { emoji: "🌍", label: "YDT Tracker'ı aç", app: "ydt_tracker" },
  { emoji: "📅", label: "Bugünkü hedefler" },
  { emoji: "📈", label: "İlerleme raporu" },
];

export default function HomeScreen({ username = "Öğrenci", onNavigate }) {
  const greeting = getGreeting();

  return (
    <div className="greeting-section">

      {/* Main greeting */}
      <h1 className="greeting-text">
        {greeting},<br />
        <em>{username}</em>.
      </h1>

      <p className="greeting-sub">
        Bugün neyi takip etmek istersin?<br />
        Hedefine bir adım daha yaklaşmak için hazırım.
      </p>

      {/* Suggestion chips */}
      <div className="suggestion-chips">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            className="suggestion-chip"
            onClick={() => s.app && onNavigate?.(s.app)}
          >
            <span style={{ marginRight: 6 }}>{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Tracker cards */}
      <div className="tracker-cards">
        <div
          className="tracker-card"
          onClick={() => onNavigate?.("sw_tracker")}
        >
          <div className="tracker-card-icon">💻</div>
          <div className="tracker-card-title">SW Tracker</div>
          <div className="tracker-card-desc">
            Yazılım mühendisliği becerilerini kategorilere göre takip et.
          </div>
        </div>

        <div
          className="tracker-card"
          onClick={() => onNavigate?.("ydt_tracker")}
        >
          <div className="tracker-card-icon">🌍</div>
          <div className="tracker-card-title">YDT Tracker</div>
          <div className="tracker-card-desc">
            Yabancı dil yeterliliğini konu konu takip et.
          </div>
        </div>
      </div>

    </div>
  );
}