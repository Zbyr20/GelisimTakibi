
 
import { useState, useEffect } from "react";
import LoginScreen from "./components/LoginScreen";
import GenericTracker from "./components/GenericTracker";
import HomeScreen from "./pages/HomeScreen";
import { softBtn } from "./utils/styles";
import { SW_CATEGORIES, swDefaultTopics, YDT_CATEGORIES, ydtDefaultTopics } from "./constants/data";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeApp, setActiveApp] = useState("home");

  useEffect(() => {
    const session = localStorage.getItem('platform_session');
    if (session) setCurrentUser(JSON.parse(session));
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem('platform_session', JSON.stringify(user));
    setCurrentUser(user);
    setActiveApp("home");
  };

  const handleLogout = () => {
    localStorage.removeItem('platform_session');
    setCurrentUser(null);
  };

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#0f172a", color: "#e2e8f0", fontFamily: "Inter, sans-serif", overflow: "hidden" }}>
      
      {/* ════════ SOL PANEL (SIDEBAR) ════════ */}
      <div style={{ width: "260px", minWidth: "260px", backgroundColor: "rgba(30, 27, 75, 0.5)", borderRight: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", padding: "24px 20px", zIndex: 10 }}>
        <div style={{ marginBottom: "40px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #a78bfa, #38bdf8)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "18px" }}>
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "15px", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser.username}</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>Öğrenci Hesabı</div>
          </div>
        </div>

        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px", marginLeft: "10px" }}>Uygulamalar</div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          <button onClick={() => setActiveApp("home")} style={softBtn("#f8fafc", activeApp === "home")}>
            <span style={{ fontSize: "18px" }}>🏠</span> Ana Karşılama
          </button>
          <button onClick={() => setActiveApp("sw_tracker")} style={softBtn("#a78bfa", activeApp === "sw_tracker")}>
            <span style={{ fontSize: "18px" }}>💻</span> SW Tracker
          </button>
          <button onClick={() => setActiveApp("ydt_tracker")} style={softBtn("#38bdf8", activeApp === "ydt_tracker")}>
            <span style={{ fontSize: "18px" }}>🌍</span> YDT Tracker
          </button>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
          <button onClick={handleLogout} style={{ ...softBtn("#f87171", false), color: "#f87171" }}>
            <span style={{ fontSize: "18px" }}>🚪</span> Çıkış Yap
          </button>
        </div>
      </div>

      {/* ════════ SAĞ İÇERİK ALANI ════════ */}
      <div style={{ flex: 1, overflowY: "auto", position: "relative", scrollBehavior: "smooth" }}>
        <div style={{ position: "fixed", top: "-10%", left: "20%", width: "500px", height: "500px", background: "#a78bfa", filter: "blur(150px)", opacity: 0.05, borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "fixed", bottom: "-10%", right: "10%", width: "400px", height: "400px", background: "#38bdf8", filter: "blur(150px)", opacity: 0.05, borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ padding: "40px", maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1, height: activeApp === "home" ? "100%" : "auto" }}>
          {activeApp === "home" && <HomeScreen />}
          {activeApp === "sw_tracker" && (
            <GenericTracker currentUser={currentUser} title="💻 Yazılım Mühendisliği Takibi" categories={SW_CATEGORIES} defaultTopics={swDefaultTopics} storageKeyPrefix="sw_tracker" accentColor="#a78bfa" />
          )}
          {activeApp === "ydt_tracker" && (
            <GenericTracker currentUser={currentUser} title="🌍 YDT (Yabancı Dil Testi) Takibi" categories={YDT_CATEGORIES} defaultTopics={ydtDefaultTopics} storageKeyPrefix="ydt_tracker" accentColor="#38bdf8" />
          )}
        </div>
      </div>
    </div>
  );
}