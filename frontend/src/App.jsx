import { useState, useEffect, useRef } from "react";
import LoginScreen from "./components/LoginScreen";
import GenericTracker from "./components/GenericTracker";
import HomeScreen from "./pages/HomeScreen";
import { SW_CATEGORIES, swDefaultTopics, YDT_CATEGORIES, ydtDefaultTopics } from "./constants/data";

/* ── Greeting helper ── */
function getGreeting(name) {
  const h = new Date().getHours();
  const part = h < 12 ? "Günaydın" : h < 17 ? "İyi öğleden sonralar" : "İyi akşamlar";
  return `${part}, ${name}.`;
}

/* ── Icon components (inline SVG for zero dependencies) ── */
const IconPlus    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>;
const IconMenu    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>;
const IconHome    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconCode    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const IconGlobe   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const IconLogout  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IconChat    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;

const RECENT_CHATS = [
  "SW Tracker - Veri Yapıları",
  "YDT Sınav Takvimi",
  "Algoritma Soruları",
  "React Hooks Notları",
];

export default function App() {
  const [currentUser, setCurrentUser]   = useState(null);
  const [activeApp,   setActiveApp]     = useState("home");
  const [sidebarOpen, setSidebarOpen]   = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("platform_session");
    if (session) {
      try { setCurrentUser(JSON.parse(session)); }
      catch { localStorage.removeItem("platform_session"); }
    }
  }, []);

  const handleLogin  = (user) => {
    localStorage.setItem("platform_session", JSON.stringify(user));
    setCurrentUser(user);
    setActiveApp("home");
  };
  const handleLogout = () => {
    localStorage.removeItem("platform_session");
    setCurrentUser(null);
  };

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;

  const isCollapsed = !sidebarOpen;

  return (
    <div className="app-container">

      {/* ════════ SIDEBAR ════════ */}
      <aside className={`sidebar${isCollapsed ? " collapsed" : ""}`}>
        {/* New Chat */}
        <button className="btn-new-chat" onClick={() => setActiveApp("home")}>
          <IconPlus />
          Yeni Sohbet
        </button>

        {/* Nav items */}
        <div className="sidebar-label">Gezinti</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "20px" }}>
          <button
            className={`nav-item${activeApp === "home" ? " active" : ""}`}
            onClick={() => setActiveApp("home")}
          >
            <span className="nav-icon"><IconHome /></span>
            Ana Sayfa
          </button>
          <button
            className={`nav-item${activeApp === "sw_tracker" ? " active" : ""}`}
            onClick={() => setActiveApp("sw_tracker")}
          >
            <span className="nav-icon"><IconCode /></span>
            SW Tracker
          </button>
          <button
            className={`nav-item${activeApp === "ydt_tracker" ? " active" : ""}`}
            onClick={() => setActiveApp("ydt_tracker")}
          >
            <span className="nav-icon"><IconGlobe /></span>
            YDT Tracker
          </button>
        </nav>

        {/* Recent chats */}
        <div className="sidebar-label">Son Sohbetler</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", flex: 1, overflowY: "auto" }}>
          {RECENT_CHATS.map((chat, i) => (
            <div key={i} className="recent-chat-item">
              <span style={{ color: "var(--text-muted)", flexShrink: 0 }}><IconChat /></span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{chat}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <IconLogout />
            Çıkış Yap
          </button>
          <div className="user-card" style={{ marginTop: 4 }}>
            <div className="user-avatar">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="user-card-name">{currentUser.username}</div>
              <div className="user-card-sub">Öğrenci Hesabı</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ════════ MAIN CONTENT ════════ */}
      <div className="main-content">

        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="btn-toggle-sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Kenar çubuğunu aç/kapat"
            >
              <IconMenu />
            </button>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)" }}>
              {activeApp === "home"        && "Gelişim Takibi"}
              {activeApp === "sw_tracker"  && "SW Tracker"}
              {activeApp === "ydt_tracker" && "YDT Tracker"}
            </span>
          </div>

          <div className="topbar-right">
            <button className="btn-pill" onClick={() => setActiveApp("sw_tracker")}>
              <span>SW</span>
            </button>
            <button className="btn-pill" onClick={() => setActiveApp("ydt_tracker")}>
              <span>YDT</span>
            </button>
            <button className="btn-pill primary">Takibe Al</button>
          </div>
        </header>

        {/* Chat / content area */}
        <div className="chat-area">
          {activeApp === "home" && (
            <HomeScreen
              username={currentUser.username}
              onNavigate={setActiveApp}
            />
          )}
          {activeApp === "sw_tracker" && (
            <div style={{ width: "100%", maxWidth: 900 }}>
              <GenericTracker
                currentUser={currentUser}
                title="Yazılım Mühendisliği Takibi"
                categories={SW_CATEGORIES}
                defaultTopics={swDefaultTopics}
                storageKeyPrefix="sw_tracker"
                accentColor="var(--accent)"
              />
            </div>
          )}
          {activeApp === "ydt_tracker" && (
            <div style={{ width: "100%", maxWidth: 900 }}>
              <GenericTracker
                currentUser={currentUser}
                title="YDT (Yabancı Dil Testi) Takibi"
                categories={YDT_CATEGORIES}
                defaultTopics={ydtDefaultTopics}
                storageKeyPrefix="ydt_tracker"
                accentColor="var(--accent)"
              />
            </div>
          )}
        </div>



      </div>
    </div>
  );
}
