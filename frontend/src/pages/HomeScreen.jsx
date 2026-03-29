import { glass } from "../utils/styles";

export default function HomeScreen() {
  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '100%', minHeight: '80vh', textAlign: 'center', position: 'relative' 
    }}>
      
      {/* FULL SCREEN HQ BACKGROUND IMAGE */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: -1, overflow: 'hidden'
      }}>
        <img 
          src="/mikasa_hq.png" 
          alt="Mikasa HQ" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', opacity: 0.7 }} 
        />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle, transparent 0%, rgba(15, 23, 42, 0.9) 100%)'
        }} />
      </div>

      <h1 style={{
        fontSize: '4.5rem', fontWeight: 900, background: 'linear-gradient(to right, #ffffff, #a78bfa, #38bdf8)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 10px 0',
        filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))', letterSpacing: '-2px', zIndex: 1
      }}>
        Mikasa'nın Takibi
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', fontWeight: 400, letterSpacing: '1px', zIndex: 1, marginBottom: '40px' }}>
        Hedefine odaklan, asla pes etme.
      </p>

      {/* Tracker Buttons in front of the image */}
      <div style={{ display: 'flex', gap: '30px', zIndex: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ ...glass({ padding: "24px", backdropFilter: "blur(12px)", background: "rgba(167, 139, 250, 0.15)" }), width: "240px", cursor: "default" }}>
          <div style={{ fontSize: "36px", marginBottom: "15px" }}>💻</div>
          <h3 style={{ margin: "0 0 10px 0", color: "#a78bfa", fontSize: "20px" }}>SW Tracker</h3>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", margin: 0 }}>Yazılım becerilerini takip et.</p>
        </div>
        <div style={{ ...glass({ padding: "24px", backdropFilter: "blur(12px)", background: "rgba(56, 189, 248, 0.15)" }), width: "240px", cursor: "default" }}>
          <div style={{ fontSize: "36px", marginBottom: "15px" }}>🌍</div>
          <h3 style={{ margin: "0 0 10px 0", color: "#38bdf8", fontSize: "20px" }}>YDT Tracker</h3>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", margin: 0 }}>Dil yeterliliğini takip et.</p>
        </div>
      </div>

    </div>
  );
}