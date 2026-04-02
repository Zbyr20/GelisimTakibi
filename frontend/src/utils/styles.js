/* styles.js — legacy utilities kept for backward compatibility.
   New components use CSS classes from index.css directly. */

export const glass = (extra = {}) => ({
  background: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--border-lighter)",
  borderRadius: 14,
  ...extra,
});

export const softBtn = (color, active) => ({
  padding: "9px 14px", borderRadius: 10,
  border: `1px solid ${active ? color : "transparent"}`,
  background: active ? `${color}18` : "transparent",
  color: active ? color : "var(--text-secondary)",
  cursor: "pointer", fontSize: 13.5, fontWeight: 500,
  textAlign: "left", width: "100%", transition: "all 0.2s",
  display: "flex", alignItems: "center", gap: "10px",
});

export const topNavBtn = (color, active) => ({
  padding: "7px 16px", borderRadius: 9,
  border: `1px solid ${active ? color : "var(--border-light)"}`,
  background: active ? `${color}14` : "transparent",
  color: active ? color : "var(--text-secondary)",
  cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.2s",
});

export const inputStyle = {
  background: "var(--bg-main)",
  border: "1.5px solid var(--border-light)",
  borderRadius: 10, padding: "10px 13px",
  color: "var(--text-primary)", fontSize: 13.5,
  outline: "none", width: "100%", fontFamily: "Inter, sans-serif",
  transition: "border-color 0.2s",
};

export const LEVELS       = ["Başlamadım", "Öğreniyorum", "Biliyorum", "Uzmanım"];
export const LEVEL_COLORS = ["#e5e3dd", "#f5c069", "#5aacf5", "#5dc98a"];
export const LEVEL_TEXT   = ["#9b9890",  "#b07d20",  "#1b6fb5",  "#1f7a4a"];