export const SW_CATEGORIES = [
  { id: "algorithms", label: "Algoritmalar", icon: "", color: "#6c757d", bg: "rgba(108,117,125,0.12)" },
  { id: "languages",  label: "Diller",       icon: "", color: "#adb5bd", bg: "rgba(173,181,189,0.12)" },
  { id: "web",        label: "Web",          icon: "", color: "#868e96", bg: "rgba(134,142,150,0.12)" },
  { id: "databases",  label: "Veritabanı",   icon: "", color: "#495057", bg: "rgba(73,80,87,0.12)" }
];

export const swDefaultTopics = {
  algorithms: ["Dizi & String", "Bağlı listeler", "Graf algoritmaları", "Dynamic Programming"],
  languages:  ["Python", "Java", "C/C++", "JavaScript", "SQL"],
  web:        ["HTML & CSS", "React / Vue", "Node.js", "HTTP & RESTful API"],
  databases:  ["SQL temelleri", "PostgreSQL", "NoSQL (MongoDB)", "Redis"]
};

export const YDT_CATEGORIES = [
  { id: "grammar",    label: "Dilbilgisi",    icon: "", color: "#868e96", bg: "rgba(134,142,150,0.12)" },
  { id: "vocabulary", label: "Kelime Bilgisi",icon: "", color: "#adb5bd", bg: "rgba(173,181,189,0.12)" },
  { id: "reading",    label: "Okuma",         icon: "", color: "#495057", bg: "rgba(73,80,87,0.12)" },
  { id: "skills",     label: "Soru Tipleri",  icon: "", color: "#5c5f66", bg: "rgba(92,95,102,0.12)" },
  { id: "exams",      label: "Denemeler",     icon: "", color: "#6c757d", bg: "rgba(108,117,125,0.12)" }
];

export const ydtDefaultTopics = {
  grammar: ["Tenses", "Modals", "Passive Voice", "Pronouns", "Conjunctions", "Relative Clauses", "Noun Clauses", "If & Wish Clauses"],
  vocabulary: ["Phrasal Verbs", "Nouns", "Adjectives", "Verbs", "Adverbs", "Prepositions"],
  reading: ["Ana Fikir Bulma", "Çıkarım Yapma", "Yazarın Tonu ve Amacı", "Detay Soruları"],
  skills: ["Cümle Tamamlama", "İngilizce-Türkçe Çeviri", "Türkçe-İngilizce Çeviri", "Durum Soruları", "Diyalog Tamamlama", "Anlamca En Yakın Cümle", "Paragraf Tamamlama", "Akışı Bozan Cümle"],
  exams: ["2018 YDT Çıkmış", "2019 YDT Çıkmış", "2020 YDT Çıkmış", "2021 YDT Çıkmış", "2022 YDT", "2023 YDT"]
};

export const getInitialState = (defaultTops) => {
  const progress = {}, notes = {};
  Object.keys(defaultTops).forEach(cat => {
    progress[cat] = {}; notes[cat] = {};
    defaultTops[cat].forEach(topic => { progress[cat][topic] = 0; notes[cat][topic] = ""; });
  });
  return { progress, notes, customTopics: {}, projects: [], lastUpdated: new Date().toISOString() };
};