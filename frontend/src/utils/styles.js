export const glass = (extra = {}) => ({
  background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 16, ...extra,
});

export const softBtn = (color, active) => ({
  padding: "10px 18px", borderRadius: 10,
  border: `1px solid ${active ? color : "transparent"}`,
  background: active ? `${color}22` : "transparent",
  color: active ? color : "rgba(255,255,255,0.6)",
  cursor: "pointer", fontSize: 14, fontWeight: 500, textAlign: "left",
  width: "100%", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "10px"
});

export const topNavBtn = (color, active) => ({
  padding: "8px 16px", borderRadius: 10,
  border: `1px solid ${active ? color : "transparent"}`,
  background: active ? `${color}22` : "transparent",
  color: active ? color : "rgba(255,255,255,0.6)",
  cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.2s"
});

export const inputStyle = {
  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10, padding: "10px 14px", color: "#e2e8f0", fontSize: 13,
  outline: "none", width: "100%", fontFamily: "Inter",
};

export const LEVELS = ["Başlamadım", "Öğreniyorum", "Biliyorum", "Uzmanım"];
export const LEVEL_COLORS = ["rgba(255,255,255,0.15)", "#fbbf24", "#38bdf8", "#4ade80"];
export const LEVEL_TEXT   = ["#94a3b8", "#fbbf24", "#38bdf8", "#4ade80"];