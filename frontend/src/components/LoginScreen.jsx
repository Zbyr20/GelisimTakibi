import { useState } from "react";

/* ─── LoginScreen — Claude.ai warm minimalist style ─────────────────── */

const EyeIcon = ({ show }) => show ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const LogoMark = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="10" fill="var(--accent)"/>
    <path d="M11 25 L18 11 L25 25" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.5 20.5 H22.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [errors,   setErrors]   = useState({});
  const [focused,  setFocused]  = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!username.trim())          errs.username = "Kullanıcı adı gerekli";
    if (!email.trim())             errs.email    = "E-posta adresi gerekli";
    else if (!validateEmail(email)) errs.email   = "Geçerli bir e-posta gir";
    if (Object.keys(errs).length)  { setErrors(errs); return; }
    onLogin({ username: username.trim(), email: email.trim() });
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: `1.5px solid ${
      errors[field] ? "#e57373" :
      focused === field ? "var(--accent)" :
      "var(--border-light)"
    }`,
    background: focused === field ? "#fff" : "var(--bg-main)",
    color: "var(--text-primary)",
    fontSize: 14,
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "Inter, sans-serif",
    boxShadow: focused === field
      ? "0 0 0 3px var(--accent-muted)"
      : "none",
  });

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "var(--bg-main)",
      fontFamily: "Inter, sans-serif",
      padding: "24px",
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: "fixed", top: "-10%", right: "-5%",
        width: 400, height: 400,
        background: "radial-gradient(circle, rgba(173,181,189,0.08) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: "-15%", left: "-5%",
        width: 500, height: 500,
        background: "radial-gradient(circle, rgba(134,142,150,0.06) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      <div style={{
        width: "100%",
        maxWidth: 400,
        background: "#fff",
        borderRadius: 20,
        border: "1px solid var(--border-lighter)",
        padding: "40px 36px 36px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 16px 40px -12px rgba(0,0,0,0.1)",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Logo + heading */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", marginBottom: 18 }}>
            <LogoMark />
          </div>
          <h1 style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "1.6rem",
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: "0 0 8px 0",
            letterSpacing: "-0.02em",
          }}>
            Gelişim Takibi
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
            Hesabına giriş yap ve takibe başla.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Username */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 7 }}>
              Kullanıcı Adı
            </label>
            <input
              type="text"
              autoComplete="name"
              placeholder="Adın"
              value={username}
              style={inputStyle("username")}
              onFocus={() => setFocused("username")}
              onBlur={() => setFocused(null)}
              onChange={e => {
                setUsername(e.target.value);
                if (errors.username) setErrors(p => ({ ...p, username: "" }));
              }}
            />
            {errors.username && (
              <p style={{ margin: "6px 0 0 4px", fontSize: 12, color: "#e57373" }}>{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 7 }}>
              E-posta Adresi
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="sen@mail.com"
              value={email}
              style={inputStyle("email")}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              onChange={e => {
                setEmail(e.target.value);
                if (errors.email) setErrors(p => ({ ...p, email: "" }));
              }}
            />
            {errors.email && (
              <p style={{ margin: "6px 0 0 4px", fontSize: 12, color: "#e57373" }}>{errors.email}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={{
              marginTop: 6,
              padding: "13px 0",
              borderRadius: 50,
              background: "var(--text-primary)",
              color: "var(--bg-main)",
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={e => {
              e.target.style.background = "var(--accent-light)";
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.18)";
            }}
            onMouseLeave={e => {
              e.target.style.background = "var(--text-primary)";
              e.target.style.transform = "none";
              e.target.style.boxShadow = "none";
            }}
          >
            Platforma Gir →
          </button>
        </form>

        {/* Footer note */}
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 24, marginBottom: 0, lineHeight: 1.6 }}>
          Veriler yalnızca bu cihazda saklanır.<br/>Hesap oluşturma gerekmez.
        </p>
      </div>
    </div>
  );
}
