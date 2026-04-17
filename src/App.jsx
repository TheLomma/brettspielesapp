import { useState, useEffect } from "react";

const SAMPLE_GAMES = [
  { id: 1, title: "Catan", wishlist: false, tags: ["Klassiker", "Tausch"],
    publisher: "Kosmos",
    year: 1995,
    players: "3\u20134",
    duration: "60\u2013120 min",
    category: "Strategie",
    image: "https://images.unsplash.com/photo-1611371736707-a5a2c2d9c7a4?w=400&q=80",
    price: 39.99,
    amazonPrice: 34.99,
    rating: 4,
    notes: "Klassiker! Macht immer Spa\u00df.",
    quantity: 1,
    addedAt: new Date().toISOString(),
  },
  { id: 2, title: "Ticket to Ride", wishlist: false, tags: ["Familie", "Einsteiger"],
    publisher: "Days of Wonder",
    year: 2004,
    players: "2\u20135",
    duration: "30\u201360 min",
    category: "Familie",
    image: "https://upload.wikimedia.org/wikipedia/en/9/92/Ticket_to_Ride_Board_Game_Box_EN.jpg",
    price: 44.99,
    amazonPrice: 41.99,
    rating: 5,
    notes: "Perfekt f\u00fcr den Familienabend.",
    quantity: 1,
    addedAt: new Date().toISOString(),
  },
  { id: 3, title: "Pandemic", wishlist: false, tags: ["Kooperativ", "Anspruchsvoll"],
    publisher: "Z-Man Games",
    year: 2008,
    players: "2\u20134",
    duration: "45\u201360 min",
    category: "Kooperativ",
    image: "https://images.unsplash.com/photo-1585504198199-20277593b94f?w=400&q=80",
    price: 34.99,
    amazonPrice: 29.99,
    rating: 4,
    notes: "Sehr spannend, aber anspruchsvoll.",
    quantity: 2,
    addedAt: new Date().toISOString(),
  },
];

const WISHLIST_FILTER = ["Alle", "Sammlung", "Wunschliste"];
const LENT_FILTER = ["Alle", "Verfügbar", "Verliehen"];
const PLAYER_FILTER = ["Alle", "1", "2", "3", "4", "5+"];
const DURATION_FILTER = ["Alle", "< 30 min", "30–60 min", "60–120 min", "> 120 min"];
const SUGGESTED_TAGS = ["Klassiker", "Einsteiger", "Experte", "Schnell", "Komplex", "Familienabend", "Party", "2-Personen", "Solo", "Kooperativ", "Tausch", "Verkauf", "Anspruchsvoll", "Beliebt"];

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
  const [editWishlist, setEditWishlist] = useState(game.wishlist || false);
  const [editTags, setEditTags] = useState(game.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [editLentTo, setEditLentTo] = useState(game.lentTo || "");
  const [editLentDate, setEditLentDate] = useState(game.lentDate || new Date().toISOString().split("T")[0]);
  const [editRating, setEditRating] = useState(game.rating || 0);
  const [editQuantity, setEditQuantity] = useState(game.quantity || 1);
  const [editPrice, setEditPrice] = useState(game.price || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdate({ ...game, notes: editNotes, rating: editRating, quantity: editQuantity, price: parseFloat(editPrice) || 0, wishlist: editWishlist, lentTo: editLentTo, lentDate: editLentTo ? editLentDate : "", tags: editTags });
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

          <div className="bg-slate-700/40 rounded-xl p-3 border border-slate-600/50 space-y-2">
            <p className="text-slate-400 text-xs font-semibold">📤 Verliehen an</p>
            <input
              type="text"
              value={editLentTo}
              onChange={(e) => setEditLentTo(e.target.value)}
              placeholder="Name der Person..."
              className="w-full bg-slate-700 text-white rounded-xl px-3 py-2 text-sm outline-none border border-slate-600 focus:border-blue-500 transition-colors"
            />
            {editLentTo && (
              <div>
                <p className="text-slate-400 text-xs mb-1">Verliehen seit</p>
                <input
                  type="date"
                  value={editLentDate}
                  onChange={(e) => setEditLentDate(e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-xl px-3 py-2 text-sm outline-none border border-slate-600 focus:border-blue-500 transition-colors"
                />
              </div>
            )}
            {editLentTo && (
              <button
                onClick={() => { setEditLentTo(""); setEditLentDate(""); }}
                className="w-full text-xs text-blue-400 hover:text-white bg-blue-900/20 hover:bg-blue-700/40 border border-blue-800/40 rounded-lg py-1.5 transition-all"
              >
                ✅ Zurückgekommen
              </button>
            )}
          </div>

          <div className="bg-slate-700/40 rounded-xl p-3 border border-slate-600/50 space-y-2">
            <p className="text-slate-400 text-xs font-semibold">🏷️ Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {editTags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 bg-violet-600/20 text-violet-300 border border-violet-600/30 px-2 py-0.5 rounded-full text-xs">
                  {tag}
                  <button onClick={() => setEditTags(editTags.filter(t => t !== tag))} className="hover:text-white ml-0.5">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
                    e.preventDefault();
                    const t = tagInput.trim().replace(/,$/, "");
                    if (!editTags.includes(t)) setEditTags([...editTags, t]);
                    setTagInput("");
                  }
                }}
                placeholder="Tag eingeben + Enter"
                className="flex-1 bg-slate-700 text-white rounded-xl px-3 py-1.5 text-xs outline-none border border-slate-600 focus:border-violet-500 transition-colors"
              />
              <button
                onClick={() => {
                  if (tagInput.trim() && !editTags.includes(tagInput.trim())) {
                    setEditTags([...editTags, tagInput.trim()]);
                    setTagInput("");
                  }
                }}
                className="bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-xl text-xs transition-colors"
              >+</button>
            </div>
            <div className="flex flex-wrap gap-1">
              {SUGGESTED_TAGS.filter(t => !editTags.includes(t)).slice(0, 6).map(t => (
                <button key={t} onClick={() => setEditTags([...editTags, t])} className="text-xs bg-slate-700 hover:bg-violet-600/30 text-slate-400 hover:text-violet-300 border border-slate-600 hover:border-violet-600/50 px-2 py-0.5 rounded-full transition-all">{t}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-700/40 rounded-xl px-4 py-2.5 border border-slate-600/50">
            <span className="text-slate-400 text-xs flex-1">Auf Wunschliste</span>
            <button
              onClick={() => setEditWishlist(!editWishlist)}
              className={`relative w-10 h-5 rounded-full transition-colors ${editWishlist ? "bg-amber-500" : "bg-slate-600"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${editWishlist ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
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

const SettingsModal = ({ onClose, games, onImport, onExport, onReset }) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    if (confirmReset) {
      onReset();
      onClose();
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  const totalValue = games.filter(g => !g.wishlist).reduce((s, g) => s + (g.price || 0) * (g.quantity || 1), 0);
  const wishlistCount = games.filter(g => g.wishlist).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl w-full max-w-md border border-slate-700 shadow-2xl">
        <div className="p-5 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold">⚙️ Einstellungen</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl">✕</button>
        </div>

        <div className="p-5 space-y-4">

          {/* Stats */}
          <div className="bg-slate-700/40 rounded-2xl p-4 border border-slate-600/50">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Deine Sammlung</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-white font-bold text-xl">{games.length}</p>
                <p className="text-slate-400 text-xs">Spiele</p>
              </div>
              <div>
                <p className="text-white font-bold text-xl">{totalValue.toFixed(0)} €</p>
                <p className="text-slate-400 text-xs">Wert</p>
              </div>
              <div>
                <p className="text-white font-bold text-xl">{new Set(games.map(g => g.category)).size}</p>
                <p className="text-slate-400 text-xs">Kategorien</p>
              </div>
            </div>
          </div>

          {/* Export / Import */}
          <div className="bg-slate-700/40 rounded-2xl p-4 border border-slate-600/50 space-y-3">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Daten sichern & übertragen</p>
            <button
              onClick={() => { onExport(); onClose(); }}
              className="w-full flex items-center gap-3 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-600/40 text-violet-300 hover:text-white rounded-xl px-4 py-3 transition-all text-sm font-medium"
            >
              <span className="text-xl">⬆️</span>
              <div className="text-left">
                <p className="font-semibold">Exportieren</p>
                <p className="text-xs text-slate-400">Alle Spiele als JSON-Datei speichern</p>
              </div>
            </button>
            <label className="w-full flex items-center gap-3 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-600/40 text-indigo-300 hover:text-white rounded-xl px-4 py-3 transition-all text-sm font-medium cursor-pointer">
              <span className="text-xl">⬇️</span>
              <div className="text-left">
                <p className="font-semibold">Importieren</p>
                <p className="text-xs text-slate-400">JSON-Backup laden & wiederherstellen</p>
              </div>
              <input type="file" accept=".json" onChange={(e) => { onImport(e); onClose(); }} className="hidden" />
            </label>
          </div>

          {/* Cache Reset */}
          <div className="bg-slate-700/40 rounded-2xl p-4 border border-slate-600/50 space-y-3">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Zurücksetzen</p>
            <div className="flex items-start gap-3 bg-slate-700/30 rounded-xl p-3">
              <span className="text-lg mt-0.5">💡</span>
              <p className="text-slate-400 text-xs leading-relaxed">
                Falls Bilder nicht korrekt angezeigt werden, setze den Cache zurück. Dabei werden alle Spiele auf die <strong className="text-slate-300">Beispieldaten</strong> zurückgesetzt. Erstelle vorher ein Backup via Export!
              </p>
            </div>
            <button
              onClick={handleReset}
              className={`w-full flex items-center gap-3 border rounded-xl px-4 py-3 transition-all text-sm font-medium ${
                confirmReset
                  ? "bg-red-600 border-red-500 text-white animate-pulse"
                  : "bg-red-900/20 hover:bg-red-900/40 border-red-800/50 text-red-400 hover:text-white"
              }`}
            >
              <span className="text-xl">🗑️</span>
              <div className="text-left">
                <p className="font-semibold">{confirmReset ? "Nochmal tippen zum Bestätigen!" : "Cache & Daten zurücksetzen"}</p>
                <p className="text-xs opacity-70">{confirmReset ? "⚠️ Alle Daten werden gelöscht!" : "Stellt Beispieldaten wieder her"}</p>
              </div>
            </button>
          </div>

          {/* Version */}
          <p className="text-center text-slate-600 text-xs">BoardVault v. 1.7</p>
        </div>
      </div>
    </div>
  );
};

const AddGameModal = ({ onClose, onAdd }) => {
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    title: "", publisher: "", year: new Date().getFullYear(), players: "", duration: "",
    category: "Strategie", image: "", price: "", amazonPrice: "", notes: "", quantity: 1, rating: 0, wishlist: false, tags: [],
  });
  const [rating, setRating] = useState(0);
  const [tagInput, setTagInput] = useState("");

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
      wishlist: form.wishlist,
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

          <div className="bg-slate-700/50 rounded-xl p-3 border border-slate-600 space-y-2">
            <p className="text-slate-400 text-xs font-semibold">🏷️ Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {(form.tags || []).map((tag) => (
                <span key={tag} className="flex items-center gap-1 bg-violet-600/20 text-violet-300 border border-violet-600/30 px-2 py-0.5 rounded-full text-xs">
                  {tag}
                  <button onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))} className="hover:text-white">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
                    e.preventDefault();
                    const t = tagInput.trim().replace(/,$/, "");
                    if (!(form.tags || []).includes(t)) setForm(f => ({ ...f, tags: [...(f.tags || []), t] }));
                    setTagInput("");
                  }
                }}
                placeholder="Tag eingeben + Enter"
                className="flex-1 bg-slate-700 text-white rounded-xl px-3 py-1.5 text-xs outline-none border border-slate-600 focus:border-violet-500"
              />
              <button
                onClick={() => {
                  if (tagInput.trim() && !(form.tags||[]).includes(tagInput.trim())) {
                    setForm(f => ({ ...f, tags: [...(f.tags||[]), tagInput.trim()] }));
                    setTagInput("");
                  }
                }}
                className="bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-xl text-xs"
              >+</button>
            </div>
            <div className="flex flex-wrap gap-1">
              {SUGGESTED_TAGS.filter(t => !(form.tags||[]).includes(t)).slice(0, 6).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, tags: [...(f.tags||[]), t] }))} className="text-xs bg-slate-700 hover:bg-violet-600/30 text-slate-400 hover:text-violet-300 border border-slate-600 px-2 py-0.5 rounded-full transition-all">{t}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-700/50 rounded-xl px-4 py-2.5 border border-slate-600">
            <span className="text-slate-400 text-xs flex-1">🛒 Auf Wunschliste setzen</span>
            <button
              onClick={() => setForm(f => ({ ...f, wishlist: !f.wishlist }))}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.wishlist ? "bg-amber-500" : "bg-slate-600"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.wishlist ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
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
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Alle");
  const [filterWishlist, setFilterWishlist] = useState("Alle");
  const [filterLent, setFilterLent] = useState("Alle");
  const [filterPlayers, setFilterPlayers] = useState("Alle");
  const [filterTag, setFilterTag] = useState("");
  const [filterDuration, setFilterDuration] = useState("Alle");
  const [sortBy, setSortBy] = useState("addedAt");
  const [selectedGame, setSelectedGame] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem("boardvault_games", JSON.stringify(games));
  }, [games]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const allTags = [...new Set(games.flatMap(g => g.tags || []))];

  const updateLent = (id, lentTo, lentDate) => {
    setGames((prev) => prev.map((g) => g.id === id ? { ...g, lentTo: lentTo || "", lentDate: lentTo ? lentDate : "" } : g));
    showToast(lentTo ? `📤 An ${lentTo} verliehen!` : "✅ Spiel wieder zurück!");
  };

  const toggleWishlist = (id) => {
    setGames((prev) => prev.map((g) => g.id === id ? { ...g, wishlist: !g.wishlist } : g));
  };

  const addGame = (game) => {
    setGames((prev) => [game, ...prev]);
    showToast(`🎲 "${game.title}" hinzugefügt!`);
  };

  const updateGame = (updated) => {
    setGames((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    if (selectedGame?.id === updated.id) setSelectedGame(updated);
  };

  const resetCache = () => {
    localStorage.removeItem("boardvault_games");
    setGames(SAMPLE_GAMES);
    showToast("✅ Cache zurückgesetzt – Beispieldaten geladen!");
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
        (filterWishlist === "Alle" || (filterWishlist === "Wunschliste" ? g.wishlist : !g.wishlist)) &&
        (filterLent === "Alle" || (filterLent === "Verliehen" ? !!g.lentTo : !g.lentTo)) &&
        (filterPlayers === "Alle" || (() => {
          const p = g.players || "";
          const nums = p.match(/\d+/g)?.map(Number) || [];
          const min = nums[0] || 0;
          const max = nums[1] || min;
          const n = parseInt(filterPlayers);
          if (filterPlayers === "5+") return max >= 5;
          return min <= n && max >= n;
        })()) &&
        (!filterTag || (g.tags || []).map(t => t.toLowerCase()).includes(filterTag.toLowerCase())) &&
        (filterDuration === "Alle" || (() => {
          const d = g.duration || "";
          const nums = d.match(/\d+/g)?.map(Number) || [];
          const min = nums[0] || 0;
          const max = nums[1] || min;
          if (filterDuration === "< 30 min") return max < 30;
          if (filterDuration === "30\u201360 min") return min <= 60 && max >= 30;
          if (filterDuration === "60\u2013120 min") return min <= 120 && max >= 60;
          if (filterDuration === "> 120 min") return min > 120;
          return true;
        })()) &&
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
              <div className="w-10 h-10 rounded-xl shadow-lg shadow-violet-900/40 flex-shrink-0 overflow-hidden border border-violet-700/50">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <defs>
                    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0f172a"/>
                      <stop offset="100%" stopColor="#1e1b4b"/>
                    </linearGradient>
                    <linearGradient id="vault" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7c3aed"/>
                      <stop offset="100%" stopColor="#6366f1"/>
                    </linearGradient>
                  </defs>
                  <rect width="100" height="100" fill="url(#bg)"/>
                  <rect x="18" y="18" width="64" height="64" rx="10" fill="none" stroke="url(#vault)" strokeWidth="5"/>
                  <circle cx="50" cy="50" r="18" fill="none" stroke="#a78bfa" strokeWidth="4"/>
                  <circle cx="50" cy="50" r="7" fill="#f59e0b"/>
                  <line x1="50" y1="32" x2="50" y2="22" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="50" y1="68" x2="50" y2="78" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="32" y1="50" x2="22" y2="50" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="68" y1="50" x2="78" y2="50" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round"/>
                  <circle cx="28" cy="28" r="4" fill="#7c3aed"/>
                  <circle cx="72" cy="28" r="4" fill="#7c3aed"/>
                  <circle cx="28" cy="72" r="4" fill="#7c3aed"/>
                  <circle cx="72" cy="72" r="4" fill="#7c3aed"/>
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent leading-none">
                  BoardVault
                </h1>
                <p className="text-slate-500 text-xs">v. 1.7 · {games.length} Spiele · {totalValue.toFixed(0)} € Wert</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Toggle */}


              <button
                onClick={() => setShowSettings(true)}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs px-3 py-2 rounded-xl transition-colors"
              >
                ⚙️ Einstellungen
              </button>

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
              value={filterWishlist}
              onChange={(e) => setFilterWishlist(e.target.value)}
              className="bg-slate-800 text-white rounded-xl px-3 py-2 text-sm outline-none border border-slate-700 focus:border-violet-500 transition-colors"
            >
              {WISHLIST_FILTER.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
            <select
              value={filterLent}
              onChange={(e) => setFilterLent(e.target.value)}
              className="bg-slate-800 text-white rounded-xl px-3 py-2 text-sm outline-none border border-slate-700 focus:border-violet-500 transition-colors"
            >
              {LENT_FILTER.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            {allTags.length > 0 && (
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="bg-slate-800 text-white rounded-xl px-3 py-2 text-sm outline-none border border-slate-700 focus:border-violet-500 transition-colors"
              >
                <option value="">🏷️ Tags</option>
                {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            )}
            <select
              value={filterPlayers}
              onChange={(e) => setFilterPlayers(e.target.value)}
              className="bg-slate-800 text-white rounded-xl px-3 py-2 text-sm outline-none border border-slate-700 focus:border-violet-500 transition-colors"
            >
              {PLAYER_FILTER.map((p) => <option key={p} value={p}>{p === "Alle" ? "👥 Spieler" : `👥 ${p}`}</option>)}
            </select>
            <select
              value={filterDuration}
              onChange={(e) => setFilterDuration(e.target.value)}
              className="bg-slate-800 text-white rounded-xl px-3 py-2 text-sm outline-none border border-slate-700 focus:border-violet-500 transition-colors"
            >
              {DURATION_FILTER.map((d) => <option key={d} value={d}>{d === "Alle" ? "⏱ Dauer" : `⏱ ${d}`}</option>)}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold text-sm truncate">{game.title}</h3>
                    {game.wishlist && <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-full flex-shrink-0">🛒 Wunsch</span>}
                    {game.lentTo && <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded-full flex-shrink-0">📤 {game.lentTo}</span>}
                  </div>
                  <p className="text-slate-400 text-xs">{game.publisher} · {game.year} · {game.category}</p>
                  {(game.tags || []).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {game.tags.map(tag => (
                        <span key={tag} className="text-xs bg-violet-600/20 text-violet-400 border border-violet-600/30 px-1.5 py-0 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
                  <span>👥 {game.players}</span>
                  <span>⏱ {game.duration}</span>
                  <StarRating rating={game.rating} />
                </div>
                {game.amazonPrice > 0 && (
                  <span className="text-emerald-400 text-xs font-medium whitespace-nowrap">{game.amazonPrice.toFixed(2)} €</span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(game.id); }}
                  className={`text-lg transition-transform hover:scale-125 flex-shrink-0 ${game.wishlist ? "text-amber-400" : "text-slate-600 hover:text-amber-400"}`}
                  title={game.wishlist ? "Von Wunschliste entfernen" : "Zur Wunschliste hinzufügen"}
                >
                  {game.wishlist ? "🛒" : "🛒"}
                </button>
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
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          games={games}
          onExport={exportJSON}
          onImport={importJSON}
          onReset={resetCache}
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
