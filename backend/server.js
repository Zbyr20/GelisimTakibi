const express = require('express');
const cors = require('cors'); // CORS'u projeye dahil ediyoruz
const sqlite3 = require('sqlite3').verbose(); 

const app = express(); // 1. ÖNCE app oluşturulmalı!
app.use(cors());       // 2. SONRA app üzerinden cors kullanılmalı!

const port = 3000;

// Veritabanı Bağlantısı
const db = new sqlite3.Database('./veritabani.db', (err) => {
    if (err) {
        console.error("Veritabanı hatası:", err.message);
    } else {
        console.log("📦 SQLite veritabanına başarıyla bağlanıldı.");
        
        db.run(`CREATE TABLE IF NOT EXISTS kullanicilar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            isim TEXT,
            rol TEXT
        )`, () => {
            db.get("SELECT COUNT(*) as count FROM kullanicilar", (err, row) => {
                if (row && row.count === 0) {
                    db.run(`INSERT INTO kullanicilar (isim, rol) VALUES ('Ahmet', 'Kullanıcı'), ('Ayşe', 'Admin')`);
                    console.log("Veritabanına ilk veriler eklendi.");
                }
            });
        });
    }
});

// Verileri Frontend'e Gönderen Endpoint
app.get('/api/kullanicilar', (req, res) => {
    db.all("SELECT * FROM kullanicilar", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows); 
    });
});

app.listen(port, () => {
    console.log(`🚀 Backend sunucusu http://localhost:${port} adresinde çalışıyor!`);
});