import { glass } from "../utils/styles";

export default function HomeScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '80vh', textAlign: 'center' }}>
      <h1 style={{
        fontSize: '5rem', fontWeight: 900, background: 'linear-gradient(to right, #a78bfa, #38bdf8, #f472b6, #4ade80)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 20px 0',
        filter: 'drop-shadow(0px 10px 20px rgba(167, 139, 250, 0.2))', letterSpacing: '-2px'
      }}>
        Eğitimin Takibi
      </h1>
      <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontWeight: 300, letterSpacing: '1px' }}>
        zübeyir tarafından gemini pro ile oluştur
      </p>
      
      <div style={{marginTop: "60px", display: "flex", gap: "20px"}}>
        <div style={{...glass({padding: "20px"}), width: "200px"}}>
          <div style={{fontSize: "30px", marginBottom: "10px"}}>💻</div>
          <h3 style={{margin: "0 0 10px 0", color: "#a78bfa"}}>SW Tracker</h3>
          <p style={{fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: 0}}>Yazılım mühendisliği becerilerini geliştir ve takip et.</p>
        </div>
        <div style={{...glass({padding: "20px"}), width: "200px"}}>
          <div style={{fontSize: "30px", marginBottom: "10px"}}>🌍</div>
          <h3 style={{margin: "0 0 10px 0", color: "#38bdf8"}}>YDT Tracker</h3>
          <p style={{fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: 0}}>İngilizce YDT sınavı müfredatını bitir ve yüzdeleri gör.</p>
        </div>
      </div>
    </div>
  );
}