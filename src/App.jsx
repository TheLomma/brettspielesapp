import { useState, useEffect, useRef } from "react";

const SAMPLE_GAMES = [
  {
    id: 1,
    title: "Catan",
    publisher: "Kosmos",
    year: 1995,
    players: "3–4",
    duration: "60–120 min",
    category: "Strategie",
    image: "https://images-na.ssl-images-amazon.com/images/I/81oJoIBPFbL.jpg",
    price: 39.99,
    amazonPrice: 34.99,
    rating: 4,
    notes: "Klassiker! Macht immer Spaß.",
    quantity: 1,
    addedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Ticket to Ride",
    publisher: "Days of Wonder",
    year: 2004,
    players: "2–5",
    duration: "30–60 min",
    category: "Familie",
    image: "https://images-na.ssl-images-amazon.com/images/I/91YNJM4oyhL.jpg",
    price: 44.99,
    amazonPrice: 41.99,
    rating: 5,
    notes: "Perfekt für den Familienabend.",
    quantity: 1,
    addedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Pandemic",
    publisher: "Z-Man Games",
    year: 2008,
    players: "2–4",
    duration: "45–60 min",
    category: "Kooperativ",
    image: "https://images-na.ssl-images-amazon.com/images/I/81gOtTfHMGL.jpg",
    price: 34.99,
    amazonPrice: 29.99,
    rating: 4,
    notes: "Sehr spannend, aber anspruchsvoll.",
    quantity: 2,
    addedAt: new Date().toISOString(),
  },
];

const CATEGORIES = ["Alle", "Strategie", "Familie", "Kooperativ", "Party", "Kartenspiel", "Würfelspiel", "Sonstiges"];
const SORT_OPTIONS = [
  { value: "title", label: "Name A–Z" },
  { value: "rating", label: "Bewertung" },
  { value: "year", label: "Jahr" },
  { value: "addedAt", label: "Zuletzt hinzugefügt" },
];

const StarRating = ({ rating, onRate, size = "md" }) => {
  const [hovered, setHovered] = useState(0);
  const s = size === "lg" ? "text-2xl" : "text-lg";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`${s} transition-transform hover:scale-125 ${
            (hovered || rating) >= star ? "text-yellow-400" : "text-gray-600"
          }`}
          onMouseEnter={() => onRate && setHovered(star)}
          onMouseLeave={() => onRate && setHovered(0)}
          onClick={() => onRate && onRate(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const GameCard = ({ game, onSelect, view }) => {
  if (view === "shelf") {
    return (
      <div
        onClick={() => onSelect(game)}
        className="cursor-pointer group relative flex flex-col items-center"
        style={{ width: "90px" }}
      >
        <div className="relative w-full" style={{ height: "130px" }}>
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover rounded-t shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2"
            style={{ borderRadius: "4px 4px 0 0" }}
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/90x130/1e1b4b/a78bfa/png?text=${encodeURIComponent(game.title.charAt(0))}`; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t opacity-0 group-hover:opacity-100 transition-opacity" />
          {game.rating > 0 && (
            <div className="absolute top-1 right-1 bg-yellow-400 text-black text-xs font-bold rounded px-1">
              {"★".repeat(game.rating)}
            </div>
          )}
        </div>
        <div
          className="w-full bg-gradient-to-b from-amber-900 to-amber-950 text-center py-1 px-1"
          style={{ borderRadius: "0 0 4px 4px", minHeight: "32px" }}
        >
          <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{game.title}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(game)}
      className="cursor-pointer bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-violet-500 transition-all duration-300 hover:shadow-lg hover:shadow-violet-900/30 hover:-translate-y-1 group"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x160/1e1b4b/a78bfa/png?text=${encodeURIComponent(game.title)}`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <div className="absolute top-2 right-2">
          <span className="bg-violet-600/90 text-white text-xs px-2 py-0.5 rounded-full">{game.category}</span>
        </div>
        {game.quantity > 1 && (
          <div className="absolute top-2 left-2">
            <span className="bg-amber-500/90 text-white text-xs px-2 py-0.5 rounded-full">×{game.quantity}</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-white font-bold text-sm truncate">{game.title}</h3>
        <p className="text-slate-400 text-xs">{game.publisher} · {game.year}</p>
        <div className="flex items-center justify-between mt-2">
          <StarRating rating={game.rating} />
          <div className="flex gap-2 text-xs text-slate-400">
            <span>👥 {game.players}</span>
            <span>⏱ {game.duration}</span>
          </div>
        </div>
        {game.amazonPrice && (
          <p className="text-emerald-400 text-xs mt-1 font-medium">Amazon: {game.amazonPrice.toFixed(2)} €</p>
        )}
      </div>
    </div>
  );
};

const Modal = ({ game, onClose, onUpdate, onDelete }) => {
  const [editNotes, setEditNotes] = useState(game.notes || "");
  const [editRating, setEditRating] = useState(game.rating || 0);
  const [editQuantity, setEditQuantity] = useState(game.quantity || 1);
  const [editPrice, setEditPrice] = useState(game.price || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdate({ ...game, notes: editNotes, rating: editRating, quantity: editQuantity, price: parseFloat(editPrice) || 0 });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl w-full max-w-lg border border-slate-700 shadow-2xl overflow-hidden">
        <div className="relative h-48">
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/500x200/1e1b4b/a78bfa/png?text=${encodeURIComponent(game.title)}`; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/50 hover:bg-black/80 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
          <div className="absolute bottom-3 left-4">
            <span className="bg-violet-600/90 text-white text-xs px-2 py-0.5 rounded-full">{game.category}</span>
          </div>
        </div>

        <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
          <div>
            <h2 className="text-white text-2xl font-bold">{game.title}</h2>
            <p className="text-slate-400">{game.publisher} · {game.year}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-700/50 rounded-xl p-3">
              <p className="text-slate-400 text-xs mb-1">Spieler</p>
              <p className="text-white font-medium">👥 {game.players}</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-3">
              <p className="text-slate-400 text-xs mb-1">Spieldauer</p>
              <p className="text-white font-medium">⏱ {game.duration}</p>
            </div>
            {game.amazonPrice && (
              <div className="bg-slate-700/50 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">Amazon-Preis</p>
                <p className="text-emerald-400 font-medium">€ {game.amazonPrice.toFixed(2)}</p>
              </div>
            )}
            <div className="bg-slate-700/50 rounded-xl p-3">
              <p className="text-slate-400 text-xs mb-1">Mein Kaufpreis</p>
              <input
                type="number"
                step="0.01"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                placeholder="0.00"
                className="bg-transparent text-white font-medium w-full outline-none"
              />
            </div>
          </div>

          <div>
            <p className="text-slate-400 text-xs mb-2">Meine Bewertung</p>
            <StarRating rating={editRating} onRate={setEditRating} size="lg" />
          </div>

          <div>
            <p className="text-slate-400 text-xs mb-2">Anzahl</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditQuantity(Math.max(1, editQuantity - 1))}
                className="w-8 h-8 rounded-full bg-slate-700 text-white hover:bg-violet-600 transition-colors flex items-center justify-center"
              >
                −
              </button>
              <span className="text-white font-bold text-lg w-6 text-center">{editQuantity}</span>
              <button
                onClick={() => setEditQuantity(editQuantity + 1)}
                className="w-8 h-8 rounded-full bg-slate-700 text-white hover:bg-violet-600 transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <p className="text-slate-400 text-xs mb-2">Notizen</p>
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Deine persönlichen Notizen..."
              rows={3}
              className="w-full bg-slate-700/50 text-white rounded-xl p-3 text-sm outline-none border border-slate-600 focus:border-violet-500 transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                saved ? "bg-emerald-600 text-white" : "bg-violet-600 hover:bg-violet-500 text-white"
              }`}
            >
              {saved ? "✓ Gespeichert!" : "Speichern"}
            </button>
            <button
              onClick={() => { onDelete(game.id); onClose(); }}
              className="px-4 py-2.5 rounded-xl bg-red-900/50 hover:bg-red-700 text-red-300 hover:text-white font-semibold text-sm transition-all"
            >
              Löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddGameModal = ({ onClose, onAdd }) => {
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    title: "", publisher: "", year: new Date().getFullYear(), players: "", duration: "",
    category: "Strategie", image: "", price: "", amazonPrice: "", notes: "", quantity: 1, rating: 0,
  });
  const [rating, setRating] = useState(0);

  const fillFromQuery = () => {
    if (!query.trim()) return;
    setForm((f) => ({ ...f, title: query }));
  };

  const handleAdd = () => {
    if (!form.title.trim()) return;
    onAdd({
      ...form,
      id: Date.now(),
      year: parseInt(form.year),
      price: parseFloat(form.price) || 0,
      amazonPrice: parseFloat(form.amazonPrice) || 0,
      rating,
      addedAt: new Date().toISOString(),
    });
    onClose();
  };

  const googleSearch = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query + " Brettspiel")}`, "_blank");
  };
  const amazonSearch = () => {
    window.open(`https://www.amazon.de/s?k=${encodeURIComponent(query + " Brettspiel")}`, "_blank");
  };
  const bggSearch = () => {
    window.open(`https://boardgamegeek.com/search/boardgame?q=${encodeURIComponent(query)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl w-full max-w-lg border border-slate-700 shadow-2xl">
        <div className="p-5 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">🎲 Spiel hinzufügen</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl">✕</button>
        </div>

        <div className="p-5 space-y-4 max-h-screen overflow-y-auto">
          <div>
            <p className="text-slate-400 text-xs mb-2">Suche nach einem Spiel</p>
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fillFromQuery()}
                placeholder="Spielname eingeben..."
                className="flex-1 bg-slate-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-slate-600 focus:border-violet-500 transition-colors"
              />
              <button
                onClick={fillFromQuery}
                className="bg-violet-600 hover:bg-violet-500 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                ↵
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={googleSearch} className="flex-1 bg-slate-700/60 hover:bg-blue-700/40 text-slate-300 hover:text-white text-xs py-1.5 rounded-lg transition-colors border border-slate-600">
                🔍 Google
              </button>
              <button onClick={amazonSearch} className="flex-1 bg-slate-700/60 hover:bg-orange-700/40 text-slate-300 hover:text-white text-xs py-1.5 rounded-lg transition-colors border border-slate-600">
                📦 Amazon
              </button>
              <button onClick={bggSearch} className="flex-1 bg-slate-700/60 hover:bg-red-700/40 text-slate-300 hover:text-white text-xs py-1.5 rounded-lg transition-colors border border-slate-600">
                🎯 BGG
              </button>
            </div>
            <p className="text-slate-500 text-xs mt-1">💡 Tipp: Suche auf BGG nach Cover-Bild-URL für das beste Ergebnis.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "title", label: "Spieltitel *", placeholder: "z.B. Catan", colSpan: true },
              { key: "publisher", label: "Verlag", placeholder: "z.B. Kosmos" },
              { key: "year", label: "Jahr", placeholder: "2024", type: "number" },
              { key: "players", label: "Spieler", placeholder: "2–4" },
              { key: "duration", label: "Dauer", placeholder: "60–120 min" },
              { key: "price", label: "Kaufpreis (€)", placeholder: "39.99", type: "number" },
              { key: "amazonPrice", label: "Amazon-Preis (€)", placeholder: "34.99", type: "number" },
            ].map(({ key, label, placeholder, colSpan, type }) => (
              <div key={key} className={colSpan ? "col-span-2" : ""}>
                <p className="text-slate-400 text-xs mb-1">{label}</p>
                <input
                  type={type || "text"}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-slate-700 text-white rounded-xl px-3 py-2 text-sm outline-none border border-slate-600 focus:border-violet-500 transition-colors"
                />
              </div>
            ))}
          </div>

          <div>
            <p className="text-slate-400 text-xs mb-1">Kategorie</p>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full bg-slate-700 text-white rounded-xl px-3 py-2 text-sm outline-none border border-slate-600 focus:border-violet-500 transition-colors"
            >
              {CATEGORIES.filter((c) => c !== "Alle").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-slate-400 text-xs mb-1">Cover-Bild URL</p>
            <input
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              placeholder="https://..."
              className="w-full bg-slate-700 text-white rounded-xl px-3 py-2 text-sm outline-none border border-slate-600 focus:border-violet-500 transition-colors"
            />
          </div>

          <div>
            <p className="text-slate-400 text-xs mb-2">Bewertung</p>
            <StarRating rating={rating} onRate={setRating} size="lg" />
          </div>

          <div>
            <p className="text-slate-400 text-xs mb-1">Anzahl</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setForm((f) => ({ ...f, quantity: Math.max(1, f.quantity - 1) }))} className="w-8 h-8 rounded-full bg-slate-700 text-white hover:bg-violet-600 transition-colors">−</button>
              <span className="text-white font-bold text-lg w-6 text-center">{form.quantity}</span>
              <button onClick={() => setForm((f) => ({ ...f, quantity: f.quantity + 1 }))} className="w-8 h-8 rounded-full bg-slate-700 text-white hover:bg-violet-600 transition-colors">+</button>
            </div>
          </div>

          <div>
            <p className="text-slate-400 text-xs mb-1">Notizen</p>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Deine persönlichen Notizen..."
              rows={2}
              className="w-full bg-slate-700 text-white rounded-xl px-3 py-2 text-sm outline-none border border-slate-600 focus:border-violet-500 transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleAdd}
            disabled={!form.title.trim()}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold rounded-xl transition-all text-sm"
          >
            🎲 Spiel hinzufügen
          </button>
        </div>
      </div>
    </div>
  );
};

export default function BoardVault() {
  const [games, setGames] = useState(() => {
    try {
      const stored = localStorage.getItem("boardvault_games");
      return stored ? JSON.parse(stored) : SAMPLE_GAMES;
    } catch {
      return SAMPLE_GAMES;
    }
  });
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Alle");
  const [sortBy, setSortBy] = useState("addedAt");
  const [selectedGame, setSelectedGame] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem("boardvault_games", JSON.stringify(games));
  }, [games]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const addGame = (game) => {
    setGames((prev) => [game, ...prev]);
    showToast(`🎲 "${game.title}" hinzugefügt!`);
  };

  const updateGame = (updated) => {
    setGames((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    if (selectedGame?.id === updated.id) setSelectedGame(updated);
  };

  const deleteGame = (id) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
    showToast("🗑 Spiel entfernt.");
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(games, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "boardvault_export.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("✅ Export erfolgreich!");
  };

  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (Array.isArray(data)) {
          setGames(data);
          showToast(`✅ ${data.length} Spiele importiert!`);
        }
      } catch {
        showToast("❌ Ungültige Datei.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const filtered = games
    .filter((g) => {
      const q = search.toLowerCase();
      return (
        (filterCategory === "Alle" || g.category === filterCategory) &&
        (g.title.toLowerCase().includes(q) || g.publisher?.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "year") return (b.year || 0) - (a.year || 0);
      return new Date(b.addedAt) - new Date(a.addedAt);
    });

  const totalValue = games.reduce((s, g) => s + (g.price || 0) * (g.quantity || 1), 0);
  const avgRating = games.filter((g) => g.rating > 0).reduce((s, g, _, arr) => s + g.rating / arr.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎲</div>
              <div>
                <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent leading-none">
                  BoardVault
                </h1>
                <p className="text-slate-500 text-xs">{games.length} Spiele · {totalValue.toFixed(0)} € Wert</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="hidden sm:flex bg-slate-800 rounded-xl p-1 gap-1">
                {[
                  { id: "grid", icon: "▦" },
                  { id: "shelf", icon: "📚" },
                  { id: "list", icon: "≡" },
                ].map(({ id, icon }) => (
                  <button
                    key={id}
                    onClick={() => setView(id)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      view === id ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              <button
                onClick={exportJSON}
                className="hidden sm:block bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs px-3 py-2 rounded-xl transition-colors"
              >
                ↑ Export
              </button>

              <label className="hidden sm:block cursor-pointer bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs px-3 py-2 rounded-xl transition-colors">
                ↓ Import
                <input type="file" accept=".json" onChange={importJSON} className="hidden" />
              </label>

              <button
                onClick={() => setShowAdd(true)}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-violet-900/40"
              >
                + Spiel
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Spiel suchen..."
              className="flex-1 min-w-48 bg-slate-800 text-white rounded-xl px-4 py-2 text-sm outline-none border border-slate-700 focus:border-violet-500 transition-colors"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-800 text-white rounded-xl px-3 py-2 text-sm outline-none border border-slate-700 focus:border-violet-500 transition-colors"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-800 text-white rounded-xl px-3 py-2 text-sm outline-none border border-slate-700 focus:border-violet-500 transition-colors"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Spiele", value: games.length, icon: "🎲" },
            { label: "Gesamtwert", value: `${totalValue.toFixed(0)} €`, icon: "💰" },
            { label: "Ø Bewertung", value: avgRating > 0 ? `${"★".repeat(Math.round(avgRating))}` : "–", icon: "⭐" },
            { label: "Kategorien", value: new Set(games.map((g) => g.category)).size, icon: "📂" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
              <p className="text-slate-400 text-xs">{icon} {label}</p>
              <p className="text-white font-bold text-lg leading-tight">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Game Display */}
      <main className="max-w-6xl mx-auto px-4 pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🎲</div>
            <p className="text-slate-400 text-lg">Keine Spiele gefunden.</p>
            <button onClick={() => setShowAdd(true)} className="mt-4 bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-xl transition-colors text-sm font-medium">
              Erstes Spiel hinzufügen
            </button>
          </div>
        ) : view === "shelf" ? (
          <div>
            <div className="bg-gradient-to-b from-amber-950/30 to-slate-900/20 rounded-3xl p-6 border border-amber-900/30">
              <div
                className="flex flex-wrap gap-2"
                style={{ alignItems: "flex-end" }}
              >
                {filtered.map((game) => (
                  <GameCard key={game.id} game={game} onSelect={setSelectedGame} view="shelf" />
                ))}
              </div>
              <div className="h-3 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 rounded-b-lg mt-2 shadow-lg" />
            </div>
          </div>
        ) : view === "list" ? (
          <div className="space-y-2">
            {filtered.map((game) => (
              <div
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className="cursor-pointer flex items-center gap-4 bg-slate-800/50 hover:bg-slate-700/60 rounded-2xl p-3 border border-slate-700 hover:border-violet-500 transition-all"
              >
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/56x56/1e1b4b/a78bfa/png?text=${encodeURIComponent(game.title.charAt(0))}`; }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm truncate">{game.title}</h3>
                  <p className="text-slate-400 text-xs">{game.publisher} · {game.year} · {game.category}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
                  <span>👥 {game.players}</span>
                  <span>⏱ {game.duration}</span>
                  <StarRating rating={game.rating} />
                </div>
                {game.amazonPrice > 0 && (
                  <span className="text-emerald-400 text-xs font-medium whitespace-nowrap">{game.amazonPrice.toFixed(2)} €</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((game) => (
              <GameCard key={game.id} game={game} onSelect={setSelectedGame} view="grid" />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedGame && (
        <Modal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          onUpdate={updateGame}
          onDelete={deleteGame}
        />
      )}
      {showAdd && <AddGameModal onClose={() => setShowAdd(false)} onAdd={addGame} />}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-slate-600 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-medium animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}
