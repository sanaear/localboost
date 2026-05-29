"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

// ─── Constants ───────────────────────────────────────────────────────────────

const LANG_FLAGS: Record<string, string> = {
  FR: "🇫🇷",
  EN: "🇬🇧",
  AR: "🇲🇦",
  ES: "🇪🇸",
};

const BUSINESS_IMAGES: Record<string, string> = {
  "Café Clock":              "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=80",
  "The Ruined Garden":       "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&auto=format&fit=crop&q=80",
  "Nur Restaurant":          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
  "Dar Hatim":               "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80",
  "Atelier Tissage Fassi":   "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=500&auto=format&fit=crop&q=80",
  "Riad Laaroussa":          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format&fit=crop&q=80",
  "Hammam Sidi Azzouz":      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=80",
  "Café Boulangerie Fassia": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
  "Nomad Restaurant":        "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=500&auto=format&fit=crop&q=80",
  "Earth Café Marrakech":    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80",
  "Souk Artisanat Marrakchi":"https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80",
  "Atelier Berbère":         "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=500&auto=format&fit=crop&q=80",
  "Riad Yasmine":            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80",
  "Les Bains de Marrakech":  "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500&auto=format&fit=crop&q=80",
  "Blend Specialty Coffee":  "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&auto=format&fit=crop&q=80",
  "La Sqala":                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80",
  "Rick's Café Casablanca":  "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500&auto=format&fit=crop&q=80",
  "Ain Diab Beach Club":     "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80",
  "Dinarjat Restaurant":     "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80",
  "Café Maure Oudaya":       "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=500&auto=format&fit=crop&q=80",
  "El Morocco Club":         "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=80",
  "Saveur de Poisson":       "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80",
  "Pure Passion Restaurant": "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500&auto=format&fit=crop&q=80",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80";

// Multilingual texts
const T = {
  fr: {
    welcome: "Bonjour ! Je suis LocalBoost AI, votre guide local intelligent au Maroc. Que puis-je chercher pour vous aujourd'hui ?",
    placeholder: "Posez une question sur Fès, Marrakech, ou les événements...",
    guideTitle: "LocalBoost Guide",
    itineraryIntro: (city: string, cost: number) =>
      `Voici l'itinéraire personnalisé que j'ai concocté pour votre soirée à ${city} (coût estimé : ~ ${cost} MAD) :`,
    itineraryError: "Impossible de générer l'itinéraire pour le moment.",
    serverError: "Erreur de connexion au serveur (port 5000).",
    reviews: "avis",
    away: "away",
  },
  en: {
    welcome: "Hello! I'm LocalBoost AI, your smart local guide in Morocco. What can I find for you today?",
    placeholder: "Ask about Fès, Marrakech, events or transport...",
    guideTitle: "LocalBoost Guide",
    itineraryIntro: (city: string, cost: number) =>
      `Here is your personalized evening itinerary for ${city} (estimated cost: ~ ${cost} MAD):`,
    itineraryError: "Unable to generate the itinerary right now.",
    serverError: "Server connection error (port 5000).",
    reviews: "reviews",
    away: "away",
  },
  ar: {
    welcome: "مرحباً! أنا LocalBoost AI، دليلك الذكي المحلي في المغرب. بماذا يمكنني مساعدتك اليوم؟",
    placeholder: "اسأل عن فاس أو مراكش أو الأحداث أو النقل...",
    guideTitle: "دليل LocalBoost",
    itineraryIntro: (city: string, cost: number) =>
      `إليك مسار رحلتك المخصص لأمسيتك في ${city} (التكلفة التقديرية: ~ ${cost} درهم):`,
    itineraryError: "تعذّر إنشاء خط السير في الوقت الحالي.",
    serverError: "خطأ في الاتصال بالخادم (المنفذ 5000).",
    reviews: "تقييم",
    away: "بُعداً",
  },
  es: {
    welcome: "¡Hola! Soy LocalBoost AI, tu guía local inteligente en Marruecos. ¿En qué puedo ayudarte hoy?",
    placeholder: "Pregunta sobre Fès, Marrakech, eventos o transporte...",
    guideTitle: "Guía LocalBoost",
    itineraryIntro: (city: string, cost: number) =>
      `Aquí está tu itinerario nocturno personalizado para ${city} (costo estimado: ~ ${cost} MAD):`,
    itineraryError: "No se puede generar el itinerario en este momento.",
    serverError: "Error de conexión al servidor (puerto 5000).",
    reviews: "reseñas",
    away: "de distancia",
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Business {
  id: number;
  name: string;
  city: string;
  category: string;
  lat: number | null;
  lng: number | null;
  images: string[];
  avgRating: number | null;
  rating: number;
  reviewCount: number;
  estimatedPrice: number;
  description: string;
}

interface FollowUp {
  question: string;
  options: string[];
}

interface ItineraryStep {
  order: number;
  time: string;
  business: Business;
  tip: string;
}

interface Itinerary {
  city: string;
  lang: string;
  totalEstimatedCost: number;
  steps: ItineraryStep[];
}

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  suggestions?: Business[];
  followUp?: FollowUp | null;
  itinerary?: Itinerary;
  detectedLang?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isVeggiePlace(biz: Business): boolean {
  const text = (biz.name + " " + biz.description).toLowerCase();
  return ["vegan", "végétarien", "vegetarian", "veggie", "نباتي", "vegetariano"].some(
    (kw) => text.includes(kw)
  );
}

function isArtisanPlace(biz: Business): boolean {
  return (biz.category || "").toLowerCase().includes("artisan");
}

function getDisplayRating(biz: Business): number | null {
  if (biz.avgRating !== null && biz.avgRating !== undefined && biz.avgRating > 0) return biz.avgRating;
  if (biz.rating !== null && biz.rating !== undefined && biz.rating > 0) return biz.rating;
  return null;
}

function openMap(biz: Business) {
  if (biz.lat && biz.lng) {
    window.open(
      `https://www.google.com/maps?q=${biz.lat},${biz.lng}&z=16&markers=${biz.lat},${biz.lng}`,
      "_blank"
    );
  } else {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        biz.name + " " + biz.city + " Morocco"
      )}`,
      "_blank"
    );
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const [lang, setLang] = useState<"FR" | "EN" | "AR" | "ES">("FR");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const t = T[lang.toLowerCase() as keyof typeof T];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: T.fr.welcome,
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === "welcome" ? { ...m, text: T[lang.toLowerCase() as keyof typeof T].welcome } : m
      )
    );
  }, [lang]);

  // ─── Send chat message ──────────────────────────────────────────────────────
  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        const d = result.data;
        // Auto-detect language from backend response and sync UI
        if (d.lang) {
          const backendLang = d.lang.toUpperCase() as "FR" | "EN" | "AR" | "ES";
          if (["FR", "EN", "AR", "ES"].includes(backendLang)) setLang(backendLang);
        }
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: d.text,
            suggestions: d.suggestions || [],
            followUp: d.followUp,
            detectedLang: d.lang,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: t.serverError,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: t.serverError,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Build itinerary ────────────────────────────────────────────────────────
  const handleItinerary = async (city: string, msgId: string, msgLang?: string) => {
    setIsLoading(true);
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, followUp: null } : m))
    );

    const useLang = msgLang || lang.toLowerCase();

    try {
      const response = await fetch("http://localhost:5000/api/v1/ai/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, lang: useLang }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        const itin = result.data;
        const texts = T[useLang as keyof typeof T] || T.fr;
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "bot",
            text: texts.itineraryIntro(city, itin.totalEstimatedCost),
            itinerary: itin,
          },
        ]);
      } else {
        const texts = T[useLang as keyof typeof T] || T.fr;
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "bot", text: texts.itineraryError },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "bot", text: t.itineraryError },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Handle quick buttons (itinerary / map / other) ──────────────────────────
  const handleQuickOption = (option: string, msg: Message) => {
    const opt = option.toLowerCase();

    // Itinerary keywords in all 4 languages
    const isItinerary =
      opt.includes("itinéraire") ||
      opt.includes("itinerary") ||
      opt.includes("itinerario") ||
      opt.includes("بناء") ||
      opt.includes("السير") ||
      opt.includes("مسار");

    // Map keywords in all 4 languages
    const isMap =
      opt.includes("carte") ||
      opt.includes("map") ||
      opt.includes("mapa") ||
      opt.includes("خريطة") ||
      opt.includes("خارطة");

    if (isItinerary) {
      const city = msg.suggestions?.[0]?.city || "Fès";
      handleItinerary(city, msg.id, msg.detectedLang);
    } else if (isMap) {
      // Open first suggestion on Google Maps
      const firstBiz = msg.suggestions?.[0];
      if (firstBiz) {
        openMap(firstBiz);
      }
    } else {
      handleSend(option);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  const isRTL = lang === "AR";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f6f8] p-2 sm:p-4 font-sans text-gray-800">
      <div
        className={`w-full max-w-lg md:max-w-xl h-[92vh] sm:h-[85vh] bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden border border-gray-100 ${isRTL ? "direction-rtl" : ""}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* ── Navbar ─────────────────────────────────────────────────────── */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Agent AI"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  LocalBoost AI
                </span>
                <span className="bg-emerald-50 text-emerald-600 font-bold text-[9px] px-1.5 py-0.5 rounded-full tracking-wide">
                  POWERED BY AI
                </span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">
                Assistant Personnel
              </span>
            </div>
          </div>

          {/* Language Picker */}
          <div className="relative">
            <button
              id="lang-picker-btn"
              onClick={() => setIsDropdownOpen((o) => !o)}
              className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-xs text-gray-700 font-semibold px-2.5 py-1.5 rounded-lg transition select-none"
            >
              <span className="text-base">{LANG_FLAGS[lang]}</span>
              <span>{lang}</span>
              <span className="text-[9px] text-gray-400">▼</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-24 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden">
                {(["FR", "EN", "AR", "ES"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 text-left px-3 py-2 text-xs font-semibold transition ${
                      lang === l
                        ? "bg-amber-50 text-amber-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-base">{LANG_FLAGS[l]}</span>
                    <span>{l}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Messages ───────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-[#fbfbfc]">
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col space-y-2">

              {/* User bubble */}
              {msg.sender === "user" && (
                <div
                  className={`self-end bg-[#e8a127] text-white text-sm px-4 py-3 rounded-2xl shadow-md max-w-[85%] leading-relaxed ${
                    isRTL ? "rounded-tl-none" : "rounded-tr-none"
                  }`}
                >
                  {msg.text}
                </div>
              )}

              {/* Bot guide card */}
              {msg.sender === "bot" && (
                <div className="flex flex-col space-y-3 w-full">
                  {/* Main text */}
                  <div className="bg-white border-l-4 border-[#e8a127] shadow-sm rounded-2xl p-4 flex gap-3">
                    <div className="text-yellow-600 text-lg mt-0.5 flex-shrink-0">✨</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider mb-1">
                        {t.guideTitle}
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    </div>
                  </div>

                  {/* ── Business Carousel ───────────────────────────────── */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto py-2 px-0.5 scroll-smooth snap-x snap-mandatory scrollbar-none">
                      {msg.suggestions.map((biz) => {
                        const imgUrl = BUSINESS_IMAGES[biz.name] || DEFAULT_IMAGE;
                        const displayRating = getDisplayRating(biz);
                        const veggie = isVeggiePlace(biz);
                        const artisan = isArtisanPlace(biz);

                        const badgeText = artisan
                          ? lang === "AR" ? "حرفي" : lang === "ES" ? "ARTESANAL" : "ARTISANAL"
                          : veggie
                          ? lang === "AR" ? "نباتي" : lang === "ES" ? "VEG FRIENDLY" : "VEGGIE FRIENDLY"
                          : lang === "AR" ? "إطلالة خارجية" : lang === "ES" ? "TERRAZA" : "OUTDOOR SEATING";

                        const badgeColor = artisan
                          ? "bg-purple-100 text-purple-700"
                          : veggie
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700";

                        return (
                          <div
                            key={biz.id}
                            className="flex-shrink-0 w-[230px] bg-white rounded-2xl border border-gray-100 shadow-md snap-start overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
                          >
                            {/* Photo */}
                            <div className="relative w-full h-[120px] bg-gray-100">
                              <Image
                                src={imgUrl}
                                alt={biz.name}
                                fill
                                className="object-cover"
                              />
                              <span
                                className={`absolute top-2 left-2 text-[8px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}
                              >
                                {badgeText}
                              </span>
                            </div>

                            {/* Details */}
                            <div className="p-3 flex flex-col flex-1 justify-between">
                              <div>
                                <h3 className="font-bold text-gray-900 text-[13.5px] leading-snug mb-1 line-clamp-1">
                                  {biz.name}
                                </h3>
                                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-2">
                                  {biz.description}
                                </p>
                              </div>

                              {/* Footer */}
                              <div className="flex items-center justify-between border-t border-gray-50 pt-2">
                                {/* Rating */}
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-1">
                                    <span className="text-yellow-400 text-[12px]">★</span>
                                    <span className="text-[12px] font-bold text-gray-900">
                                      {displayRating !== null
                                        ? displayRating.toFixed(1)
                                        : "—"}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-gray-400">
                                    {biz.reviewCount} {t.reviews} · {(biz.id * 150 + 100)}m {t.away}
                                  </span>
                                </div>

                                {/* Price + Map */}
                                <div className="flex flex-col items-end gap-1">
                                  <span className="text-[11px] font-bold text-gray-900">
                                    ~ {biz.estimatedPrice} MAD
                                  </span>
                                  <button
                                    title="Ouvrir dans Google Maps"
                                    onClick={() => openMap(biz)}
                                    className="w-6 h-6 rounded-full bg-amber-50 border border-amber-100 hover:bg-amber-100 flex items-center justify-center text-[10px] text-amber-600 transition"
                                  >
                                    📍
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ── Itinerary Timeline ─────────────────────────────── */}
                  {msg.itinerary && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
                      {msg.itinerary.steps.map((step, idx) => {
                        const imgUrl =
                          BUSINESS_IMAGES[step.business.name] || DEFAULT_IMAGE;
                        const isLast = idx === msg.itinerary!.steps.length - 1;
                        return (
                          <div key={step.order} className="flex gap-3 relative">
                            {!isLast && (
                              <div className="absolute left-[14px] top-[32px] bottom-[-16px] w-[2px] bg-gray-100 z-0" />
                            )}
                            {/* Number */}
                            <div className="relative z-10 w-[28px] h-[28px] rounded-full bg-amber-50 border-2 border-[#e8a127] flex items-center justify-center font-bold text-[11px] text-amber-700 flex-shrink-0">
                              {step.order}
                            </div>
                            {/* Box */}
                            <div className="flex-1 bg-gray-50 rounded-xl p-2.5 border border-gray-100 flex gap-2.5 items-start">
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                <Image
                                  src={imgUrl}
                                  alt={step.business.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <h5 className="font-bold text-[11.5px] text-gray-900 truncate">
                                    {step.business.name}
                                  </h5>
                                  <span className="text-[9px] font-semibold text-gray-400 flex-shrink-0">
                                    {step.time}
                                  </span>
                                </div>
                                <p className="text-[10px] text-gray-500 line-clamp-1 mb-1">
                                  {step.business.description}
                                </p>
                                <span className="text-[9px] bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-md inline-block">
                                  💡 {step.tip}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ── Follow-up Options ──────────────────────────────── */}
                  {msg.followUp?.options && msg.followUp.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.followUp.options.map((opt) => {
                        const optLower = opt.toLowerCase();
                        const isPrimary =
                          optLower.includes("oui") ||
                          optLower.includes("yes") ||
                          optLower.includes("sí") ||
                          optLower.includes("نعم");
                        const isMapOpt =
                          optLower.includes("carte") ||
                          optLower.includes("map") ||
                          optLower.includes("mapa") ||
                          optLower.includes("خريطة");

                        return (
                          <button
                            key={opt}
                            onClick={() => handleQuickOption(opt, msg)}
                            className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-full font-semibold transition shadow-sm ${
                              isPrimary
                                ? "bg-[#8b6508] hover:bg-[#725206] text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                          >
                            {isMapOpt && <span>📍</span>}
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Loading dots */}
          {isLoading && (
            <div className="flex items-center gap-1.5 bg-gray-100 text-gray-400 px-4 py-2.5 rounded-2xl w-20 self-start shadow-sm">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* ── Input Bar ──────────────────────────────────────────────────── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
        >
          <input
            type="text"
            id="chat-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.placeholder}
            dir={isRTL ? "rtl" : "ltr"}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#e8a127] focus:bg-white text-gray-900 transition"
          />
          <button
            type="submit"
            id="send-btn"
            disabled={isLoading}
            className="w-10 h-10 rounded-full bg-[#e8a127] hover:bg-[#d08c1a] disabled:opacity-50 text-white flex items-center justify-center shadow-md hover:shadow-lg transition flex-shrink-0"
          >
            <svg className="w-4 h-4 fill-current rotate-45 -translate-x-px translate-y-px" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
