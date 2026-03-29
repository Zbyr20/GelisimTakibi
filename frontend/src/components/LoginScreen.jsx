import { useState } from "react";
import { glass, inputStyle } from "../utils/styles";

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    // ✅ FİX: Input validation eklendi
    if (!username.trim()) {
      newErrors.username = "Kullanıcı adı boş olamaz";
    }
    
    if (!email.trim()) {
      newErrors.email = "E-posta adresi boş olamaz";
    } else if (!validateEmail(email)) {
      newErrors.email = "Geçerli bir e-posta adresi gir";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onLogin({ username, email });
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
          <input 
            type="text" 
            required 
            value={username} 
            onChange={e => {
              setUsername(e.target.value);
              if (errors.username) setErrors({...errors, username: ""});
            }} 
            placeholder="Örn: Ahmet Yılmaz" 
            style={{...inputStyle, borderColor: errors.username ? "#f87171" : "rgba(255,255,255,0.12)"}} 
          />
          {errors.username && <p style={{color: "#f87171", fontSize: "12px", margin: "6px 0 0 0"}}>{errors.username}</p>}
        </div>
        
        <div>
          <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: "13px", marginBottom: "8px" }}>E-posta Adresi</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={e => {
              setEmail(e.target.value);
              if (errors.email) setErrors({...errors, email: ""});
            }} 
            placeholder="Örn: ahmet@mail.com" 
            style={{...inputStyle, borderColor: errors.email ? "#f87171" : "rgba(255,255,255,0.12)"}} 
          />
          {errors.email && <p style={{color: "#f87171", fontSize: "12px", margin: "6px 0 0 0"}}>{errors.email}</p>}
        </div>
        
        <button type="submit" style={{ padding: "12px", background: "linear-gradient(to right, #a78bfa, #38bdf8)", color: "#1e1b4b", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer", marginTop: "10px", fontSize: "15px", transition: "all 0.2s" }} onMouseEnter={e => e.target.style.opacity = "0.9"} onMouseLeave={e => e.target.style.opacity = "1"}>
          Platforma Gir
        </button>
      </form>
    </div>
  );
}
