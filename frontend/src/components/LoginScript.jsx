import { useState } from "react";
import { glass, inputStyle } from "../utils/styles";

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && email.trim()) onLogin({ username, email });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0f172a", fontFamily: "Inter, sans-serif" }}>
      <form onSubmit={handleSubmit} style={{ ...glass({ padding: "40px", width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "20px" }) }}>
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <h2 style={{ color: "#a78bfa", margin: "0 0 10px 0", fontSize: "28px" }}>Eğitim Platformu</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 }}>Gelişimini takip etmek için giriş yap</p>
        </div>
        <div>
          <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: "13px", marginBottom: "8px" }}>Kullanıcı Adı</label>
          <input type="text" required value={username} onChange={e => setUsername(e.target.value)} placeholder="Örn: Ahmet Yılmaz" style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: "13px", marginBottom: "8px" }}>E-posta Adresi</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Örn: ahmet@mail.com" style={inputStyle} />
        </div>
        <button type="submit" style={{ padding: "12px", background: "linear-gradient(to right, #a78bfa, #38bdf8)", color: "#1e1b4b", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer", marginTop: "10px", fontSize: "15px" }}>
          Platforma Gir
        </button>
      </form>
    </div>
  );
}