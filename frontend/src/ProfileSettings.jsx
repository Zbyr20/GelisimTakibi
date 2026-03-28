import { useState, useEffect } from 'react';
import './ProfileSettings.css';

export default function ProfileSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profil');
  const [themeColor, setThemeColor] = useState('#d97757'); // Claude tarzı tatlı bir kiremit rengi

  // Kullanıcı verileri (İleride Node.js backend'den gelecek)
  const user = {
    username: 'Geliştirici',
    email: 'admin@mimari-proje.com',
    plan: 'Ücretsiz Plan'
  };

  // Renk değiştiğinde tüm uygulamanın rengini güncellemek için
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', themeColor);
  }, [themeColor]);

  if (!isOpen) {
    return (
      <button className="open-settings-btn" onClick={() => setIsOpen(true)}>
        ⚙️ Ayarlar
      </button>
    );
  }

  return (
    <div className="modal-overlay" onClick={() => setIsOpen(false)}>
      <div className="modal-content claude-style" onClick={(e) => e.stopPropagation()}>
        
        {/* Sol Menü (Sidebar) */}
        <div className="modal-sidebar">
          <div className="user-mini-profile">
            <div className="avatar">{user.username.charAt(0)}</div>
            <div>
              <h4>{user.username}</h4>
              <span>{user.plan}</span>
            </div>
          </div>
          
          <nav className="modal-nav">
            <button 
              className={activeTab === 'profil' ? 'active' : ''} 
              onClick={() => setActiveTab('profil')}
            >
              👤 Profil
            </button>
            <button 
              className={activeTab === 'gorunum' ? 'active' : ''} 
              onClick={() => setActiveTab('gorunum')}
            >
              🎨 Görünüm
            </button>
          </nav>
        </div>

        {/* Sağ İçerik Alanı */}
        <div className="modal-body">
          <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          
          {activeTab === 'profil' && (
            <div className="tab-content animate-fade-in">
              <h3>Profil Bilgileri</h3>
              <div className="info-group">
                <label>Kullanıcı Adı</label>
                <input type="text" value={user.username} readOnly />
              </div>
              <div className="info-group">
                <label>E-posta Adresi</label>
                <input type="email" value={user.email} readOnly />
              </div>
            </div>
          )}

          {activeTab === 'gorunum' && (
            <div className="tab-content animate-fade-in">
              <h3>Arayüz Rengi</h3>
              <p className="subtitle">Uygulamanın vurgu rengini kişiselleştir.</p>
              
              <div className="color-picker-group">
                {['#d97757', '#4d7c0f', '#0369a1', '#6d28d9', '#1f2937'].map((color) => (
                  <button
                    key={color}
                    className={`color-swatch ${themeColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setThemeColor(color)}
                  />
                ))}
              </div>
              
              <div className="preview-box" style={{ borderColor: 'var(--primary-color)' }}>
                <p>Seçili renk böyle görünecek.</p>
                <button className="demo-btn" style={{ backgroundColor: 'var(--primary-color)' }}>Örnek Buton</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}