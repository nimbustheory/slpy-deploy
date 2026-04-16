import { useState } from "react";
import {
  Calendar, TrendingUp, Users, Heart, Sparkles, Layers,
  Bell, Headphones, ChevronRight, Monitor, Smartphone, Star, Shield, Zap,
  ArrowLeft, MapPin
} from "lucide-react";
import App from "./App.jsx";
import { DEMO_CONFIG } from "./demo.config.js";

const iconMap = { Sparkles, Layers, Heart, Shield, Star, Zap, Calendar, TrendingUp, Users, Bell, Headphones, Monitor, Smartphone, MapPin };
const getIcon = (name) => iconMap[name] || Star;

export default function DemoWrapper() {
  const c = DEMO_CONFIG;
  const accent = c.accent;
  const accentDark = c.accentDark;
  const [isFullAdmin, setIsFullAdmin] = useState(false);

  if (isFullAdmin) {
    return <App startInAdmin={true} onExitAdmin={() => setIsFullAdmin(false)} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "'Outfit', system-ui, sans-serif", color: "#1a1a1a" }}>

      {/* --- HEADER BAR --- */}
      <div style={{ background: accentDark, color: "#fff", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <a href="https://lumiclass.app" style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
          <ArrowLeft size={18} /> Back to LUMI
        </a>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, letterSpacing: "0.08em" }}>LUMI</span>
      </div>

      {/* --- SUBTITLE / COPYRIGHT NOTICE --- */}
      <div style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "8px 24px", textAlign: "center", flexShrink: 0 }}>
        <p style={{ fontSize: 11, color: "#6b7280", margin: 0, lineHeight: 1.5, maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
          Live interactive demo built for {c.studio.name}. This link is not publicly listed. This prototype includes copyrighted images that are not intended for publication. They will be replaced with media chosen by the client and nothing will be published without expressed permission from rights holders.
        </p>
      </div>

      {/* --- THREE-COLUMN LAYOUT --- */}
      <div style={{ display: "flex", flex: 1, background: "#f5f5f5" }}>

        {/* --- LEFT SIDEBAR --- */}
        <aside style={{ width: 320, flexShrink: 0, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {/* Prototype Label */}
          <div style={{ padding: "16px 24px 0" }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: accent, background: `${accent}12`, padding: "4px 10px", borderRadius: 4 }}>Prototype Demo</span>
          </div>

          {/* Studio Identity */}
          <div style={{ padding: "20px 24px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: "#fff" }}>
                {c.studio.logo}
              </div>
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, letterSpacing: "0.02em", color: "#111827" }}>{c.studio.name}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>{c.studio.tagline}</div>
              </div>
            </div>
          </div>

          {/* Feature List */}
          <div style={{ padding: "0 24px", flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 12 }}>App Features</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {c.features.map((f, i) => {
                const FeatureIcon = getIcon(f.icon);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 10px", borderRadius: 8, background: "#f9fafb" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: `${accent}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <FeatureIcon size={14} color={accent} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{f.label}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1, lineHeight: 1.3 }}>{f.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: "16px 24px 20px", borderTop: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", textAlign: "center" }}>
              Built by <span style={{ color: accent }}>LUMI</span> — LumiClass.App
            </div>
          </div>
        </aside>

        {/* --- CENTER: PHONE FRAME --- */}
        <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: 32, paddingBottom: 32 }}>
          <div style={{ position: "relative" }}>
            {/* Phone chrome */}
            <div style={{
              width: 414, background: "#1a1a24", borderRadius: 44, padding: "12px 12px",
              boxShadow: "0 0 0 1px #2a2a34, 0 20px 60px rgba(0,0,0,.3), 0 0 120px rgba(72,168,140,.04)"
            }}>
              {/* Notch */}
              <div style={{ width: 120, height: 6, background: "#2a2a34", borderRadius: 3, margin: "0 auto 8px" }} />
              {/* Screen container - EXACT SPEC */}
              <div style={{
                width: 390, height: 844, borderRadius: 28, overflow: "hidden", background: "white",
                position: "relative"
              }}>
                <App onEnterAdmin={() => setIsFullAdmin(true)} />
              </div>
              {/* Home indicator */}
              <div style={{ width: 134, height: 5, background: "#3a3a44", borderRadius: 3, margin: "8px auto 4px" }} />
            </div>
          </div>
        </main>

        {/* --- RIGHT SIDEBAR --- */}
        <aside style={{ width: 340, flexShrink: 0, background: "#fff", borderLeft: "1px solid #e5e7eb", overflowY: "auto", padding: "24px 20px", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {c.salesCards.map((card, i) => {
              const IconComp = card.icon === "Shield" ? Shield : getIcon(card.icon);
              const isAdminCard = card.title === "Admin Dashboard";
              return (
                <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "18px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${accent}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {isAdminCard ? <Shield size={18} color={accent} /> : <IconComp size={18} color={accent} />}
                    </div>
                    <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: "#111827", margin: 0 }}>{card.title}</h3>
                  </div>
                  <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>{card.description}</p>
                  {isAdminCard && (
                    <button onClick={() => setIsFullAdmin(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "10px 0", marginTop: 14, borderRadius: 8, border: "none", background: accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                      <Shield size={16} /> Open Admin
                    </button>
                  )}
                </div>
              );
            })}

            {/* CTA Card */}
            <div style={{ background: `linear-gradient(135deg, ${accent}12, ${accentDark}08)`, border: `1px solid ${accent}30`, borderRadius: 14, padding: "22px 18px", textAlign: "center" }}>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: "#111827", margin: "0 0 6px" }}>{c.cta.heading}</h3>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px", lineHeight: 1.4 }}>{c.cta.subheading}</p>
              <a href={c.cta.buttonUrl} target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "12px 28px",
                borderRadius: 10, background: accent, color: "#fff", fontWeight: 700, fontSize: 14,
                textDecoration: "none", letterSpacing: "0.02em"
              }}>
                {c.cta.buttonText} <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </aside>

        {/* Responsive collapse for small viewports */}
        <style>{`
          @media (max-width: 1100px) {
            aside { display: none !important; }
            main { margin-left: 0 !important; margin-right: 0 !important; }
          }
          aside::-webkit-scrollbar { display: none; }
        `}</style>
      </div>
    </div>
  );
}
