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
const IconClip    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>;
const IconSend    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IconChat    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IconMic     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>;

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
  const [inputValue,  setInputValue]    = useState("");
  const textRef = useRef(null);

  useEffect(() => {
    const session = localStorage.getItem("platform_session");
    if (session) {
      try { setCurrentUser(JSON.parse(session)); }
      catch { localStorage.removeItem("platform_session"); }
    }
  }, []);

  /* auto-resize textarea */
  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = Math.min(textRef.current.scrollHeight, 180) + "px";
    }
  }, [inputValue]);

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
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

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
              <span>💻 SW</span>
            </button>
            <button className="btn-pill" onClick={() => setActiveApp("ydt_tracker")}>
              <span>🌍 YDT</span>
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
                title="💻 Yazılım Mühendisliği Takibi"
                categories={SW_CATEGORIES}
                defaultTopics={swDefaultTopics}
                storageKeyPrefix="sw_tracker"
                accentColor="#cc785c"
              />
            </div>
          )}
          {activeApp === "ydt_tracker" && (
            <div style={{ width: "100%", maxWidth: 900 }}>
              <GenericTracker
                currentUser={currentUser}
                title="🌍 YDT (Yabancı Dil Testi) Takibi"
                categories={YDT_CATEGORIES}
                defaultTopics={ydtDefaultTopics}
                storageKeyPrefix="ydt_tracker"
                accentColor="#4a9d8f"
              />
            </div>
          )}
        </div>

        {/* ════════ INPUT AREA ════════ */}
        <div className={`input-wrapper${isCollapsed ? " sidebar-collapsed" : ""}`}>
          <div className="input-container">
            <textarea
              ref={textRef}
              className="input-textarea"
              placeholder="Takibine eklemek istediğin konuyu yaz…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  setInputValue("");
                }
              }}
              rows={1}
            />
            <div className="input-actions">
              <div className="input-action-left">
                <button className="input-icon-btn" title="Dosya ekle">
                  <IconClip />
                </button>
                <button className="input-icon-btn" title="Sesli yaz">
                  <IconMic />
                </button>
              </div>
              <button
                className="btn-send"
                disabled={!inputValue.trim()}
                onClick={() => setInputValue("")}
                title="Gönder"
              >
                <IconSend />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
