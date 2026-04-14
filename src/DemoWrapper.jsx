import { useRef, useState, useEffect } from "react";
import { Flame, Shield, Star, MapPin } from "lucide-react";
import App from "./App";
import CONFIG from "./demo.config";

export default function DemoWrapper() {
  const phoneRef = useRef(null);
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    const handler = (e) => setIsAdminMode(e.detail.isAdmin);
    window.addEventListener("adminModeChange", handler);
    return () => window.removeEventListener("adminModeChange", handler);
  }, []);

  const features = [
    { title: "Class Scheduling", desc: "Weekly schedule with real-time reservations" },
    { title: "Practice Tracking", desc: "Reflections, streaks, and milestone badges" },
    { title: "Community Feed", desc: "Member milestones and celebrations" },
    { title: "Teacher Profiles", desc: "Bios, certifications, and specialties" },
    { title: "Membership Tiers", desc: `${CONFIG.tierCount} plans from intro to unlimited` },
    { title: "Events & Workshops", desc: "Special sessions and teacher training" },
    { title: "Smart Notifications", desc: "Class reminders and streak alerts" },
    { title: "Admin Dashboard", desc: "Full analytics, CRM, and broadcast tools" },
  ];

  const salesCards = [
    {
      icon: <Shield size={28} color={CONFIG.accent} strokeWidth={1.5} />,
      title: "Admin Dashboard",
      desc: "Tap the shield icon in the app header to access the full admin suite -- analytics, member CRM, scheduling, and broadcast tools.",
    },
    {
      icon: <Star size={28} color={CONFIG.accent} strokeWidth={1.5} />,
      title: `Built for ${CONFIG.studioName}`,
      desc: `Custom-designed around SLPY's hot power vinyasa classes, Baptiste-trained instructors, and the SLC community that made it Utah's best studio.`,
    },
    {
      icon: <MapPin size={28} color={CONFIG.accent} strokeWidth={1.5} />,
      title: "All-in-One Platform",
      desc: "Handles booking, payments, and member management natively -- no third-party software needed.",
    },
  ];

  const sidebarStyle = {
    width: 320,
    flexShrink: 0,
    padding: "48px 32px 32px",
    overflowY: "auto",
    height: "100vh",
    position: "sticky",
    top: 0,
    boxSizing: "border-box",
  };

  const rightSidebarStyle = {
    ...sidebarStyle,
    width: 340,
    padding: "48px 28px 32px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      minHeight: "100vh",
      background: isAdminMode ? "#09090b" : "#f5f2ed",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      {/* Left Sidebar -- hidden in admin mode */}
      <div className="demo-sidebar-left" style={{
        ...sidebarStyle,
        ...(isAdminMode ? { display: "none" } : {}),
      }}>
        <p style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: CONFIG.accent,
          marginBottom: 28,
        }}>
          Prototype Demo
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <img src="/images/logo-square.png" alt="SLPY" style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            objectFit: "cover",
          }} />
          <div>
            <h2 style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#2c2418",
              margin: 0,
              letterSpacing: "0.02em",
              fontFamily: CONFIG.displayFont,
            }}>
              {CONFIG.sidebarTitle}
            </h2>
            <p style={{ fontSize: 13, color: "#7a7060", margin: "2px 0 0" }}>Yoga Studio App</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: CONFIG.accent,
                marginTop: 7,
                flexShrink: 0,
                opacity: 0.6,
              }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#2c2418", margin: 0 }}>{f.title}</p>
                <p style={{ fontSize: 13, color: "#7a7060", margin: "3px 0 0", lineHeight: 1.45 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{
          fontSize: 11,
          color: "#a8a090",
          marginTop: 40,
          letterSpacing: "0.04em",
        }}>
          Built by LUMI — LumiClass.app
        </p>
      </div>

      {/* Center: Phone Frame / Full Screen */}
      <div style={{
        display: "flex",
        alignItems: isAdminMode ? undefined : "flex-start",
        justifyContent: isAdminMode ? undefined : "center",
        padding: isAdminMode ? 0 : "32px 20px",
        flexShrink: 0,
        flex: isAdminMode ? 1 : undefined,
      }}>
        <div
          ref={phoneRef}
          style={isAdminMode ? {
            width: "100%",
            minHeight: "100vh",
          } : {
            width: 390,
            height: 780,
            borderRadius: 40,
            overflow: "hidden",
            boxShadow: "0 25px 80px rgba(0,0,0,.12), 0 8px 24px rgba(0,0,0,.08)",
            background: "#fff",
            position: "relative",
            transform: "translateZ(0)",
            flexShrink: 0,
          }}
        >
          <div style={isAdminMode ? {
            minHeight: "100vh",
          } : {
            height: "100%",
            position: "relative",
          }}>
            <App />
          </div>
        </div>
      </div>

      {/* Right Sidebar -- hidden in admin mode */}
      <div className="demo-sidebar-right" style={{
        ...rightSidebarStyle,
        ...(isAdminMode ? { display: "none" } : {}),
      }}>
        {salesCards.map((card, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "28px 24px",
              boxShadow: "0 1px 4px rgba(0,0,0,.04)",
            }}
          >
            <div style={{ marginBottom: 14 }}>{card.icon}</div>
            <h3 style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#2c2418",
              margin: "0 0 8px",
            }}>
              {card.title}
            </h3>
            <p style={{
              fontSize: 14,
              color: "#7a7060",
              lineHeight: 1.55,
              margin: 0,
            }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .demo-sidebar-left, .demo-sidebar-right { display: none !important; }
        }
        * { scrollbar-width: none; -ms-overflow-style: none; }
        *::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
