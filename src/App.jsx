import { useState, useEffect, useCallback, createContext, useContext } from "react";
import {
  Home, Calendar, TrendingUp, Users, CreditCard, CalendarDays,
  Menu, X, Bell, Settings, Shield, ChevronRight, ChevronDown, Clock,
  PartyPopper, ArrowUpRight, ArrowDownRight, Award, DollarSign, LayoutDashboard,
  UserCheck, Megaphone, LogOut, Send, Check, Search, Info,
  CircleCheck, Heart, Flame, Star, Sun, Moon, Wind, Sparkles,
  Mountain, Music, Gift, Share2, Plus, Edit3, Trash2, Tag, Radio
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ═══════════════════════════════════════════════════════════════
//  STUDIO_CONFIG — Salt Lake Power Yoga
// ═══════════════════════════════════════════════════════════════
const STUDIO_CONFIG = {
  name: "SLPY",
  subtitle: "SALT LAKE POWER YOGA",
  tagline: "Local. Original. Hot.",
  logoMark: null,
  logoImage: "/images/logo-square.png",
  description: "Hot power vinyasa with panoramic Wasatch Mountain views. Movement, breath, focus, fun, and heat — in the heart of Salt Lake City.",
  heroLine1: "IGNITE",
  heroLine2: "YOUR FIRE",

  address: { street: "250 East Broadway, Suite 200", city: "Salt Lake City", state: "UT", zip: "84111" },
  phone: "(801) 468-9642",
  email: "connect@slpy.xyz",
  neighborhood: "Downtown Salt Lake City",
  website: "https://www.slpy.xyz",
  social: { instagram: "@saltlakepoweryoga" },

  theme: {
    accent:     { h: 18, s: 85, l: 52 },    // Fiery orange
    accentAlt:  { h: 38, s: 90, l: 50 },     // Golden amber
    warning:    { h: 0,  s: 72, l: 50 },      // Deep red
    primary:    { h: 25, s: 20, l: 10 },      // Dark warm brown
    surface:    { h: 35, s: 25, l: 97 },      // Warm cream
    surfaceDim: { h: 30, s: 18, l: 93 },      // Warm sand
  },

  features: {
    workshops: true,
    retreats: true,
    soundBaths: true,
    teacherTrainings: true,
    practiceTracking: true,
    communityFeed: true,
    guestPasses: true,
    milestones: true,
  },

  classCapacity: 35,
  specialtyCapacity: 25,
};

// ═══════════════════════════════════════════════════════════════
//  THEME SYSTEM
// ═══════════════════════════════════════════════════════════════
const hsl = (c, a) => a !== undefined ? `hsla(${c.h},${c.s}%,${c.l}%,${a})` : `hsl(${c.h},${c.s}%,${c.l}%)`;
const hslShift = (c, lShift) => `hsl(${c.h},${c.s}%,${Math.max(0, Math.min(100, c.l + lShift))}%)`;

const T = {
  accent: hsl(STUDIO_CONFIG.theme.accent),
  accentDark: hslShift(STUDIO_CONFIG.theme.accent, -12),
  accentLight: hslShift(STUDIO_CONFIG.theme.accent, 30),
  accentGhost: hsl(STUDIO_CONFIG.theme.accent, 0.08),
  accentBorder: hsl(STUDIO_CONFIG.theme.accent, 0.18),
  success: hsl(STUDIO_CONFIG.theme.accentAlt),
  successGhost: hsl(STUDIO_CONFIG.theme.accentAlt, 0.08),
  successBorder: hsl(STUDIO_CONFIG.theme.accentAlt, 0.18),
  warning: hsl(STUDIO_CONFIG.theme.warning),
  warningGhost: hsl(STUDIO_CONFIG.theme.warning, 0.08),
  warningBorder: hsl(STUDIO_CONFIG.theme.warning, 0.2),
  bg: hsl(STUDIO_CONFIG.theme.primary),
  bgCard: hsl(STUDIO_CONFIG.theme.surface),
  bgDim: hsl(STUDIO_CONFIG.theme.surfaceDim),
  text: "#2c2218",
  textMuted: "#7a6850",
  textFaint: "#a89878",
  border: "#e8ddd0",
  borderLight: "#f2eae0",
};

// ═══════════════════════════════════════════════════════════════
//  DATE HELPERS
// ═══════════════════════════════════════════════════════════════
const today = new Date().toISOString().split("T")[0];
const offsetDate = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split("T")[0]; };
const formatDateShort = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); };
const formatDateLong = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); };
const fmtTime = (t) => { const [h, m] = t.split(":"); const hr = +h; return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA — Salt Lake Power Yoga
// ═══════════════════════════════════════════════════════════════
const TEACHERS = [
  { id: "t1", firstName: "Dillon", lastName: "B.", nickname: "Dillicious", role: "Icon Instructor & Studio Owner", certs: ["E-RYT-200", "Baptiste Level 1"], specialties: ["Hot Vinyasa", "DETOX", "PowerFLOW"], yearsTeaching: 10, bio: "Dillon — known as Dillicious — founded SLPY to build a community around hot power vinyasa. His energetic, music-driven classes push your boundaries while keeping you connected to your breath and intention.", photo: "" },
  { id: "t2", firstName: "Stephanie", lastName: "M.", role: "Instructor & Studio Shepherd", certs: ["RYT-200", "Baptiste Level 1"], specialties: ["PowerFLOW", "MELT", "Yin"], yearsTeaching: 7, bio: "Stephanie is the heart of the SLPY studio. As Studio Shepherd she ensures every practitioner feels welcomed, supported, and challenged. Her classes blend strength with deep intention.", photo: "" },
  { id: "t3", firstName: "Anna", lastName: "M.", role: "Instructor & Studio Newsie", certs: ["RYT-200", "Baptiste Level 1"], specialties: ["DETOX", "PowerFLOW", "Express"], yearsTeaching: 5, bio: "Anna brings fire and creativity to every practice. As the studio's voice, she connects the community through storytelling, events, and a fierce flow that'll leave you dripping.", photo: "" },
  { id: "t4", firstName: "Quinn", lastName: "W.", role: "Icon Instructor", certs: ["RYT-500", "Baptiste Level 2"], specialties: ["DETOX", "PowerFLOW", "WAKE"], yearsTeaching: 8, bio: "Quinn's classes are legendary — high energy, deep breath work, and playlists that hit different. His teaching style challenges you to find freedom through discipline.", photo: "" },
  { id: "t5", firstName: "Jess", lastName: "L.", role: "Icon Instructor", certs: ["E-RYT-200", "Baptiste Level 1"], specialties: ["PowerFLOW", "MELT", "powerDOWN"], yearsTeaching: 6, bio: "Jess seamlessly weaves power and grace. Her classes move from intense flows to soul-deep stretches, meeting every practitioner exactly where they are.", photo: "" },
  { id: "t6", firstName: "Sarah", lastName: "S.", role: "Icon Instructor", certs: ["RYT-200", "Yin Certified"], specialties: ["Yin", "powerDOWN", "MELT"], yearsTeaching: 5, bio: "Sarah's restorative practice is medicine for the modern world. She creates space for deep surrender, guided by intentional breathwork and a calm, grounding presence.", photo: "" },
];

const TODAYS_FOCUS = {
  id: "focus-today", date: today, name: "DETOX Power Flow", type: "DETOX",
  style: "Hot Vinyasa", temp: "98.6°F", duration: 75,
  description: "A mindfully curated sequence crafted to push your boundaries. Upbeat atmosphere, energetic pace — sweat, sculpt, and soar in the heated studio.",
  intention: "Step into the heat and let your fire burn away what no longer serves you.",
  teacherTip: "This is YOUR practice. Modify when you need to, push when you're ready. The mat is yours.",
  playlist: "Fire & Flow — Dillicious Spotify",
};

const PAST_PRACTICES = [
  { id: "p-y1", date: offsetDate(-1), name: "PowerFLOW", type: "FLOW", style: "Hot Power Vinyasa", temp: "98.6°F", duration: 75, description: "Our signature SLPY hot power vinyasa. Sweat, breathe, strengthen, and release. A transformative fusion of power and rejuvenation.", intention: "Embrace the power, embrace the flow.", teacherTip: "Let the heat do the work. Your only job is to breathe." },
  { id: "p-y2", date: offsetDate(-2), name: "MELT Yin-yasa", type: "MELT", style: "Yin-yasa", temp: "98.6°F", duration: 75, description: "A blend of power and restorative flows. Autonomous movement, stretch, sweat and breath crafted for the best sleep of your life.", intention: "Melt into the mat. Let everything else dissolve.", teacherTip: "This practice moves at your pace. Honor the space between effort and ease." },
  { id: "p-y3", date: offsetDate(-3), name: "Express Flow", type: "EXPRESS", style: "Hot Express", temp: "98.6°F", duration: 45, description: "The express version of our signature SLPY hot power vinyasa compressed into 45 intense minutes of sweat, breath, and strength.", intention: "Flow with purpose. Every second counts." },
];

const UPCOMING_PRACTICE = { id: "p-tmrw", date: offsetDate(1), name: "Friday Sound Bath", type: "SPECIAL", style: "Restorative", temp: "Room Temp", duration: 75, description: "Middle Friday sound bath with crystal bowls and deep vibrational healing. Close the week with restoration and presence.", intention: "Sound is medicine. Stillness is home.", teacherTip: "Bring an extra layer. Let yourself be fully held by the sound." };

const CLASSES_TODAY = [
  { id: "cl1", time: "06:00", type: "WAKE (75 min)", coach: "Quinn W.", capacity: 35, registered: 28, waitlist: 0 },
  { id: "cl2", time: "07:30", type: "PowerFLOW (75 min)", coach: "Dillicious", capacity: 35, registered: 35, waitlist: 4 },
  { id: "cl3", time: "09:30", type: "PowerFLOW (60 min)", coach: "Anna M.", capacity: 35, registered: 24, waitlist: 0 },
  { id: "cl4", time: "12:00", type: "Express (45 min)", coach: "Jess L.", capacity: 35, registered: 18, waitlist: 0 },
  { id: "cl5", time: "16:30", type: "DETOX (75 min)", coach: "Quinn W.", capacity: 35, registered: 32, waitlist: 0 },
  { id: "cl6", time: "17:45", type: "PowerFLOW (75 min)", coach: "Stephanie M.", capacity: 35, registered: 35, waitlist: 6 },
  { id: "cl7", time: "19:00", type: "MELT (75 min)", coach: "Sarah S.", capacity: 25, registered: 19, waitlist: 0 },
];

const WEEKLY_SCHEDULE = [
  { day: "Monday", classes: [{ time: "06:00", type: "WAKE", coach: "Quinn" }, { time: "07:30", type: "PowerFLOW", coach: "Dillicious" }, { time: "09:30", type: "PowerFLOW", coach: "Anna" }, { time: "12:00", type: "Express", coach: "Jess" }, { time: "16:30", type: "DETOX", coach: "Quinn" }, { time: "17:45", type: "PowerFLOW", coach: "Stephanie" }, { time: "19:00", type: "MELT", coach: "Sarah" }] },
  { day: "Tuesday", classes: [{ time: "06:00", type: "Express", coach: "Anna" }, { time: "07:30", type: "PowerFLOW", coach: "Dillicious" }, { time: "09:30", type: "DETOX", coach: "Quinn" }, { time: "12:00", type: "PowerFLOW", coach: "Stephanie" }, { time: "16:30", type: "PowerFLOW", coach: "Jess" }, { time: "17:45", type: "DETOX", coach: "Dillicious" }] },
  { day: "Wednesday", classes: [{ time: "06:00", type: "WAKE", coach: "Stephanie" }, { time: "07:30", type: "PowerFLOW", coach: "Quinn" }, { time: "09:30", type: "PowerFLOW", coach: "Anna" }, { time: "12:00", type: "Express", coach: "Jess" }, { time: "16:30", type: "DETOX", coach: "Dillicious" }, { time: "17:45", type: "PowerFLOW", coach: "Quinn" }, { time: "19:00", type: "Yin", coach: "Sarah" }] },
  { day: "Thursday", classes: [{ time: "06:00", type: "Express", coach: "Anna" }, { time: "07:30", type: "PowerFLOW", coach: "Dillicious" }, { time: "09:30", type: "DETOX", coach: "Quinn" }, { time: "12:00", type: "PowerFLOW", coach: "Stephanie" }, { time: "16:30", type: "PowerFLOW", coach: "Jess" }, { time: "17:45", type: "DETOX", coach: "Dillicious" }, { time: "19:00", type: "powerDOWN", coach: "Sarah" }] },
  { day: "Friday", classes: [{ time: "06:00", type: "WAKE", coach: "Quinn" }, { time: "07:30", type: "PowerFLOW", coach: "Dillicious" }, { time: "09:30", type: "PowerFLOW", coach: "Anna" }, { time: "12:00", type: "Express", coach: "Jess" }, { time: "16:30", type: "DETOX", coach: "Stephanie" }, { time: "19:30", type: "Sound Bath", coach: "Guest" }] },
  { day: "Saturday", classes: [{ time: "07:30", type: "PowerFLOW", coach: "Dillicious" }, { time: "09:00", type: "DETOX", coach: "Quinn" }, { time: "10:30", type: "PowerFLOW", coach: "Anna" }, { time: "12:00", type: "MELT", coach: "Sarah" }] },
  { day: "Sunday", classes: [{ time: "08:00", type: "PowerFLOW", coach: "Stephanie" }, { time: "09:30", type: "DETOX", coach: "Quinn" }, { time: "17:00", type: "Yin", coach: "Sarah" }] },
];

const COMMUNITY_FEED = [
  { id: "cf1", user: "Brittany R.", milestone: "200 Classes", message: "200 practices at SLPY. This community is my second family. See you on the mat!", date: today, celebrations: 34 },
  { id: "cf2", user: "Marcus T.", milestone: "30-Day Streak", message: "30 days straight, dripping sweat every single one. SLPY changed my life.", date: today, celebrations: 22 },
  { id: "cf3", user: "Sophia L.", milestone: "First Headstand!", message: "Finally went upside down! Couldn't have done it without Quinn's encouragement!", date: offsetDate(-1), celebrations: 41 },
  { id: "cf4", user: "Jake D.", milestone: "1 Year Member", message: "One year ago I walked in for mOMentum Pass. Now I can't imagine life without SLPY.", date: offsetDate(-1), celebrations: 56 },
];

const MILESTONE_BADGES = {
  "First Class": { icon: Flame, color: T.accent },
  "10 Classes": { icon: Wind, color: T.accent },
  "50 Classes": { icon: Mountain, color: T.accent },
  "100 Classes": { icon: Sun, color: T.success },
  "200 Classes": { icon: Star, color: T.success },
  "7-Day Streak": { icon: Flame, color: T.warning },
  "30-Day Streak": { icon: Sparkles, color: T.warning },
  "First Headstand!": { icon: ArrowUpRight, color: "#8b5cf6" },
  "1 Year Member": { icon: Award, color: T.success },
};

const EVENTS = [
  { id: "ev1", name: "200hr Yoga Teacher Training — 2026 Cohort", date: "2026-09-06", startTime: "09:00", type: "Training", description: "Award-winning YTT with alternating weekends. Deepen your relationship with yoga and learn to share it with the world. Yoga Alliance certified.", fee: 3200, maxParticipants: 20, registered: 14, status: "Registration Open" },
  { id: "ev2", name: "Friday Sound Bath", date: offsetDate(4), startTime: "19:30", type: "Sound Bath", description: "Middle Friday sound bath with crystal bowls and deep vibrational healing. Close the week with restoration and presence.", fee: 15, maxParticipants: 30, registered: 22, status: "Open" },
  { id: "ev3", name: "Summer Solstice Rooftop Flow", date: "2026-06-20", startTime: "07:00", type: "Special Event", description: "Sunrise practice on our rooftop with panoramic Wasatch Mountain views. Celebrate the longest day with community, breath, and light.", fee: 35, maxParticipants: 40, registered: 12, status: "Registration Open" },
  { id: "ev4", name: "DETOX & Brunch Pop-Up", date: "2026-04-18", startTime: "09:00", type: "Workshop", description: "75-minute DETOX class followed by a healthy brunch from local SLC vendors. Sweat, eat, connect. The ultimate Saturday morning.", fee: 45, maxParticipants: 35, registered: 28, status: "Almost Full" },
];

const MEMBERSHIP_TIERS = [
  { id: "m1", name: "Drop-In", type: "drop-in", price: 25, period: "per class", features: ["1 class credit", "Valid for 30 days", "No commitment"], popular: false },
  { id: "m2", name: "cOMmunity Rate", type: "community", price: 15, period: "per class", features: ["7:30 AM & 7:00 PM classes only", "Walk-in welcome", "Accessibility pricing"], popular: false },
  { id: "m3", name: "mOMentum Pass", type: "intro", price: 75, period: "14 days", features: ["14 days unlimited", "2 buddy passes included", "Mat & towel service", "Available once per 500 days"], popular: false },
  { id: "m4", name: "8x Monthly", type: "limited", price: 125, period: "/month", features: ["8 classes per month", "~$15.65 per practice", "Advanced booking", "Member discounts", "6-month commitment"], popular: false },
  { id: "m5", name: "Unlimited", type: "unlimited", price: 175, period: "/month", annualPrice: 1750, features: ["Unlimited classes", "Advanced booking", "No late cancel fees", "20% off events & retail", "2 buddy passes/month", "6-month commitment"], popular: true },
];

const ANNOUNCEMENTS = [
  { id: "a1", title: "2026 Teacher Training Opens!", message: "Award-winning 200hr YTT returns this fall. Alternating weekends. Limited spots — register now.", type: "celebration", pinned: true },
  { id: "a2", title: "Summer Schedule Starts June 1", message: "Extended weekend hours and rooftop classes launching for summer. Check the updated schedule.", type: "info", pinned: false },
];

const MEMBERS_DATA = [
  { id: "mem1", name: "Brittany Rivera", email: "brittany@email.com", membership: "Unlimited", status: "active", joined: "2023-03-01", checkIns: 412, lastVisit: today },
  { id: "mem2", name: "Marcus Torres", email: "marcus@email.com", membership: "Unlimited", status: "active", joined: "2024-01-15", checkIns: 287, lastVisit: today },
  { id: "mem3", name: "Sophia Lin", email: "sophia@email.com", membership: "8x Monthly", status: "active", joined: "2025-06-01", checkIns: 64, lastVisit: offsetDate(-1) },
  { id: "mem4", name: "Jake Dawson", email: "jake@email.com", membership: "Unlimited", status: "active", joined: "2025-03-24", checkIns: 178, lastVisit: today },
  { id: "mem5", name: "Emily Chen", email: "emily@email.com", membership: "Unlimited", status: "frozen", joined: "2024-09-01", checkIns: 102, lastVisit: offsetDate(-28) },
  { id: "mem6", name: "Kai Nakamura", email: "kai@email.com", membership: "mOMentum Pass", status: "active", joined: "2026-03-10", checkIns: 8, lastVisit: offsetDate(-2) },
  { id: "mem7", name: "Ava Ramirez", email: "ava@email.com", membership: "Unlimited (Annual)", status: "active", joined: "2023-08-01", checkIns: 356, lastVisit: today },
  { id: "mem8", name: "Noah Park", email: "noah@email.com", membership: "8x Monthly", status: "active", joined: "2025-11-01", checkIns: 38, lastVisit: offsetDate(-3) },
];

const ADMIN_METRICS = {
  activeMembers: 248, memberChange: 18,
  todayCheckIns: 92, weekCheckIns: 547,
  monthlyRevenue: 38200, revenueChange: 11.2,
  renewalRate: 93.5, workshopRevenue: 5800,
};

const ADMIN_CHARTS = {
  attendance: [
    { day: "Mon", total: 94, avg: 13 }, { day: "Tue", total: 82, avg: 14 },
    { day: "Wed", total: 88, avg: 13 }, { day: "Thu", total: 96, avg: 14 },
    { day: "Fri", total: 78, avg: 13 }, { day: "Sat", total: 105, avg: 26 },
    { day: "Sun", total: 52, avg: 17 },
  ],
  revenue: [
    { month: "Jul", revenue: 28500 }, { month: "Aug", revenue: 30200 },
    { month: "Sep", revenue: 31800 }, { month: "Oct", revenue: 33100 },
    { month: "Nov", revenue: 34200 }, { month: "Dec", revenue: 32800 },
    { month: "Jan", revenue: 35600 }, { month: "Feb", revenue: 36900 },
    { month: "Mar", revenue: 38200 },
  ],
  classPopularity: [
    { name: "6:00 AM", pct: 80 }, { name: "7:30 AM", pct: 98 },
    { name: "9:30 AM", pct: 72 }, { name: "12:00 PM", pct: 52 },
    { name: "4:30 PM", pct: 91 }, { name: "5:45 PM", pct: 99 },
    { name: "7:00 PM", pct: 76 },
  ],
  membershipBreakdown: [
    { name: "Unlimited Monthly", value: 128, color: T.accent },
    { name: "Unlimited Annual", value: 52, color: T.success },
    { name: "8x Monthly", value: 44, color: T.warning },
    { name: "Class Packs / Drop-In", value: 24, color: T.textMuted },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  APP CONTEXT
// ═══════════════════════════════════════════════════════════════
const AppContext = createContext(null);

// ═══════════════════════════════════════════════════════════════
//  SHARED UI COMPONENTS
// ═══════════════════════════════════════════════════════════════

function PageTitle({ title, subtitle }) {
  return (
    <div style={{ padding: "20px 0 16px" }}>
      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 600, color: T.text, margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: T.textMuted, margin: "4px 0 0" }}>{subtitle}</p>}
    </div>
  );
}

function PageHero({ title, subtitle, image }) {
  return (
    <div style={{ minHeight: 220, color: "#fff", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", marginBottom: 16 }}>
      {image ? (
        <img src={image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7)" }} loading="lazy" />
      ) : (
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(165deg, ${T.bg} 0%, hsl(20,25%,15%) 100%)` }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.45) 100%)" }} />
      <div style={{ position: "relative", padding: "24px 22px 22px", width: "100%" }}>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 600, margin: 0, textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
    </div>
  );
}

function SectionHeader({ title, linkText, linkPage }) {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 600, color: T.text, margin: 0 }}>{title}</h3>
      {linkText && <button onClick={() => setPage(linkPage)} style={{ fontSize: 13, color: T.accent, fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>{linkText} <ChevronRight size={14} /></button>}
    </div>
  );
}

function QuickAction({ icon: Icon, label, page, color }) {
  const { setPage } = useContext(AppContext);
  return (
    <button onClick={() => setPage(page)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
      <Icon size={22} color={color} />
      <span style={{ fontSize: 11, fontWeight: 600, color: T.textMuted }}>{label}</span>
    </button>
  );
}

function EmptyState({ icon: Icon, message, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 16px", background: T.bgDim, borderRadius: 12, border: `1px dashed ${T.border}` }}>
      <Icon size={32} color={T.textFaint} style={{ marginBottom: 8 }} />
      <p style={{ fontWeight: 600, color: T.textMuted, fontSize: 14, margin: 0 }}>{message}</p>
      {sub && <p style={{ fontSize: 12, color: T.textFaint, margin: "4px 0 0" }}>{sub}</p>}
    </div>
  );
}

function CTACard() {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ padding: "24px 20px", borderRadius: 16, background: `linear-gradient(135deg, ${T.bg} 0%, hsl(20,25%,18%) 100%)`, color: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/class-action.jpg)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.12 }} />
      <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, margin: "0 0 6px" }}>Ready to ignite?</h3>
      <p style={{ fontSize: 13, color: "#b8a090", margin: "0 0 16px", lineHeight: 1.5 }}>Try the mOMentum Pass — 14 days unlimited + 2 buddy passes for $75.</p>
      <button onClick={() => setPage("membership")} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Get Started</button>
    </div>
  );
}

function PracticeCardFull({ practice: p, variant, expanded, onToggle }) {
  const isToday = p.date === today;
  const isFuture = p.date > today;
  const isFeatured = variant === "featured";

  return (
    <div style={{ background: isFeatured ? `linear-gradient(135deg, ${T.accentGhost}, ${T.successGhost})` : T.bgCard, border: `1px solid ${isFeatured ? T.accentBorder : T.border}`, borderRadius: 14, overflow: "hidden" }}>
      <button onClick={onToggle} style={{ width: "100%", padding: "16px", background: "none", border: "none", cursor: onToggle ? "pointer" : "default", textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: isToday ? T.accent : isFuture ? T.success : T.textFaint, background: isToday ? T.accentGhost : isFuture ? T.successGhost : T.bgDim, padding: "2px 8px", borderRadius: 99 }}>
                {isToday ? "Today" : isFuture ? "Upcoming" : formatDateShort(p.date)}
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, color: T.textFaint }}>{p.type}</span>
            </div>
            <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: T.text, margin: "4px 0 0" }}>{p.name}</h4>
          </div>
          {onToggle && <ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {[{ icon: Clock, text: `${p.duration} min` }, { icon: Flame, text: p.temp }, { icon: Music, text: p.style }].map((m, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: T.textMuted }}>
              <m.icon size={13} /> {m.text}
            </span>
          ))}
        </div>
        <p style={{ fontSize: 13, color: T.textMuted, margin: "8px 0 0", lineHeight: 1.5 }}>{p.description}</p>
      </button>
      {(expanded || isFeatured) && (
        <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${T.borderLight}`, marginTop: 0, paddingTop: 12 }}>
          {p.intention && (
            <div style={{ background: T.bgDim, borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent, margin: "0 0 4px" }}>Intention</p>
              <p style={{ fontSize: 13, color: T.text, fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>{p.intention}</p>
            </div>
          )}
          {p.teacherTip && (
            <div style={{ background: T.successGhost, border: `1px solid ${T.successBorder}`, borderRadius: 10, padding: "12px 14px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.success, margin: "0 0 4px" }}>Teacher Tip</p>
              <p style={{ fontSize: 13, color: T.text, margin: 0, lineHeight: 1.5 }}>{p.teacherTip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CONSUMER PAGES
// ═══════════════════════════════════════════════════════════════

function HomePage() {
  const { classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed } = useContext(AppContext);
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const upcoming = CLASSES_TODAY.filter(c => c.time >= currentTime).slice(0, 4);

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Hero */}
      <section style={{ minHeight: 220, color: "#fff", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", marginBottom: 16 }}>
        <img src="/images/hero-studio.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.45) 100%)" }} />
        <div style={{ position: "relative", padding: "16px 22px 22px", width: "100%" }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 6, color: "rgba(255,255,255,0.8)" }}>
            {formatDateLong(today)}
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 48, lineHeight: 0.95, letterSpacing: "-0.02em", margin: 0, fontWeight: 400, textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
            {STUDIO_CONFIG.heroLine1}<br />
            <span style={{ color: T.accentLight, fontStyle: "italic" }}>{STUDIO_CONFIG.heroLine2}</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, maxWidth: 280, marginTop: 8, lineHeight: 1.5 }}>{STUDIO_CONFIG.description}</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ padding: "0 16px", marginTop: -16, position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { icon: Calendar, label: "Reserve", page: "schedule", color: T.accent },
            { icon: Flame, label: "Practice", page: "practice", color: T.success },
            { icon: Heart, label: "Community", page: "community", color: T.warning },
            { icon: Users, label: "Teachers", page: "teachers", color: T.textMuted },
          ].map(a => (
            <QuickAction key={a.label} {...a} />
          ))}
        </div>
      </section>

      {/* Today's Practice Focus */}
      <section style={{ padding: "0 16px", marginTop: 24 }}>
        <SectionHeader title="Today's Practice" linkText="All Classes" linkPage="classes" />
        <PracticeCardFull practice={TODAYS_FOCUS} variant="featured" />
      </section>

      {/* Upcoming Classes */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <SectionHeader title="Upcoming Classes" linkText="Full Schedule" linkPage="schedule" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {upcoming.length > 0 ? upcoming.map(c => {
            const regs = (classRegistrations[c.id] || 0);
            const totalReg = c.registered + regs;
            const isFull = totalReg >= c.capacity;
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ textAlign: "center", minWidth: 44 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: T.text, fontWeight: 600 }}>{fmtTime(c.time).split(":")[0]}</span>
                  <span style={{ display: "block", fontSize: 11, color: T.textMuted }}>{fmtTime(c.time).slice(-5)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: T.text, fontSize: 14, margin: 0 }}>{c.type}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{c.coach.split(" ")[0]}</p>
                </div>
                <div style={{ textAlign: "right", marginRight: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isFull ? T.warning : totalReg >= c.capacity * 0.8 ? T.success : T.accent }}>{totalReg}/{c.capacity}</span>
                  {c.waitlist > 0 && <span style={{ display: "block", fontSize: 11, color: T.textFaint }}>+{c.waitlist} waitlist</span>}
                </div>
                <button onClick={() => openReservation({ ...c, date: today })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: isFull ? T.bgDim : T.accent, color: isFull ? T.textMuted : "#fff", transition: "all 0.15s" }}>
                  {isFull ? "Waitlist" : "Reserve"}
                </button>
              </div>
            );
          }) : (
            <EmptyState icon={Moon} message="No more classes today" sub="See tomorrow's schedule" />
          )}
        </div>
      </section>

      {/* Community Feed */}
      {STUDIO_CONFIG.features.communityFeed && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="cOMmunity" linkText="View All" linkPage="community" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {COMMUNITY_FEED.slice(0, 3).map(item => {
              const myC = feedCelebrations[item.id] || 0;
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: `linear-gradient(135deg, ${T.successGhost}, transparent)`, border: `1px solid ${T.successBorder}`, borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.success, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Sparkles size={18} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>
                      {item.user} <span style={{ color: T.success }}>{item.milestone}</span>
                    </p>
                    <p style={{ fontSize: 12, color: "#6b5840", margin: "2px 0 0", lineHeight: 1.4 }}>
                      {item.message.length > 60 ? item.message.slice(0, 60) + "…" : item.message}
                    </p>
                  </div>
                  <button onClick={() => celebrateFeed(item.id)} style={{ padding: 8, borderRadius: 8, border: "none", background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}>
                    <Heart size={18} color={T.success} fill={myC > 0 ? T.success : "none"} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.success }}>{item.celebrations + myC}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Announcements */}
      {ANNOUNCEMENTS.length > 0 && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Announcements" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} style={{ padding: "14px 16px", borderRadius: 12, borderLeft: `4px solid ${a.type === "celebration" ? T.accent : T.textMuted}`, background: a.type === "celebration" ? T.accentGhost : T.bgDim }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: 0 }}>{a.title}</h3>
                    <p style={{ fontSize: 13, color: "#6b5840", margin: "4px 0 0" }}>{a.message}</p>
                  </div>
                  {a.pinned && <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, background: T.accentGhost, padding: "2px 8px", borderRadius: 99 }}>Pinned</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <CTACard />
      </section>
    </div>
  );
}

// ——— CLASSES PAGE ———
function ClassesPage() {
  const [expandedPractice, setExpandedPractice] = useState(null);
  const allPractices = [TODAYS_FOCUS, ...PAST_PRACTICES, UPCOMING_PRACTICE].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <PageHero title="Classes" subtitle="Past, present, and upcoming practice" image="/images/class-scene.jpg" />
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {allPractices.map(p => (
            <PracticeCardFull key={p.id} practice={p} expanded={expandedPractice === p.id} onToggle={() => setExpandedPractice(expandedPractice === p.id ? null : p.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ——— SCHEDULE PAGE ———
function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const { classRegistrations, openReservation } = useContext(AppContext);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div>
      <PageHero title="Schedule" subtitle="Reserve your spot -- classes fill up fast" image="/images/studio-interior.jpg" />
      <div style={{ padding: "20px 16px 0" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {days.map((d, i) => (
          <button key={d} onClick={() => setSelectedDay(i)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: selectedDay === i ? T.accent : T.bgCard, color: selectedDay === i ? "#fff" : T.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
            {d}
          </button>
        ))}
      </div>
      <h4 style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: "0 0 12px" }}>{dayNames[selectedDay]}</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {WEEKLY_SCHEDULE[selectedDay].classes.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
            <div style={{ textAlign: "center", minWidth: 44 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.text, fontWeight: 600 }}>{fmtTime(c.time).split(":")[0]}</span>
              <span style={{ display: "block", fontSize: 11, color: T.textMuted }}>{fmtTime(c.time).slice(-5)}</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, color: T.text, fontSize: 14, margin: 0 }}>{c.type}</p>
              <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{c.coach}</p>
            </div>
            <button onClick={() => openReservation({ ...c, date: today, capacity: 35, registered: Math.floor(Math.random() * 25) + 10, waitlist: 0 })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Reserve
            </button>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

// ——— PRACTICE TRACKER ———
function PracticePage() {
  const stats = { totalClasses: 87, currentStreak: 12, longestStreak: 24, thisMonth: 14, minutesThisMonth: 1050 };
  const badges = ["First Class", "10 Classes", "50 Classes", "7-Day Streak"];

  return (
    <div>
      <PageHero title="My Practice" subtitle="Track your growth on the mat" image="/images/yoga-flow.jpg" />
      <div style={{ padding: "20px 16px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Total Classes", value: stats.totalClasses, icon: Flame, color: T.accent },
          { label: "Current Streak", value: `${stats.currentStreak} days`, icon: Sparkles, color: T.success },
          { label: "This Month", value: stats.thisMonth, icon: Calendar, color: T.warning },
          { label: "Minutes", value: stats.minutesThisMonth, icon: Clock, color: T.textMuted },
        ].map((s, i) => (
          <div key={i} style={{ padding: "16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
            <s.icon size={20} color={s.color} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: T.text, margin: "6px 0 2px" }}>{s.value}</p>
            <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <SectionHeader title="Milestones" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 24 }}>
        {Object.entries(MILESTONE_BADGES).map(([name, badge]) => {
          const earned = badges.includes(name);
          return (
            <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 4px", borderRadius: 10, background: earned ? T.accentGhost : T.bgDim, border: `1px solid ${earned ? T.accentBorder : T.borderLight}`, opacity: earned ? 1 : 0.4 }}>
              <badge.icon size={22} color={earned ? badge.color : T.textFaint} />
              <span style={{ fontSize: 10, fontWeight: 600, color: earned ? T.text : T.textFaint, textAlign: "center", lineHeight: 1.2 }}>{name}</span>
            </div>
          );
        })}
      </div>

      <SectionHeader title="Next Milestone" />
      <div style={{ background: `linear-gradient(135deg, ${T.accentGhost}, ${T.successGhost})`, border: `1px solid ${T.accentBorder}`, borderRadius: 14, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontWeight: 600, color: T.text }}>100 Classes</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.accent }}>{stats.totalClasses}/100</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: T.bgDim, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(stats.totalClasses / 100) * 100}%`, borderRadius: 4, background: `linear-gradient(90deg, ${T.accent}, ${T.success})`, transition: "width 0.5s" }} />
        </div>
        <p style={{ fontSize: 12, color: T.textMuted, margin: "8px 0 0" }}>{100 - stats.totalClasses} more classes to go -- you're on fire!</p>
      </div>
      </div>
    </div>
  );
}

// ——— COMMUNITY PAGE ———
function CommunityPage() {
  const { feedCelebrations, celebrateFeed } = useContext(AppContext);

  return (
    <div>
      <PageHero title="cOMmunity" subtitle="Celebrate milestones and connect with your people" image="/images/team-photo.jpg" />
      <div style={{ padding: "20px 16px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {COMMUNITY_FEED.map(item => {
          const myC = feedCelebrations[item.id] || 0;
          const badgeInfo = MILESTONE_BADGES[item.milestone];
          return (
            <div key={item.id} style={{ padding: 16, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: badgeInfo ? `${T.accentGhost}` : T.bgDim, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${badgeInfo ? T.accent : T.border}` }}>
                  {badgeInfo ? <badgeInfo.icon size={20} color={badgeInfo.color} /> : <Star size={20} color={T.textFaint} />}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15, color: T.text, margin: 0 }}>{item.user}</p>
                  <p style={{ fontSize: 12, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{item.milestone}</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 11, color: T.textFaint }}>{formatDateShort(item.date)}</span>
              </div>
              <p style={{ fontSize: 14, color: T.text, lineHeight: 1.5, margin: "0 0 12px" }}>{item.message}</p>
              <button onClick={() => celebrateFeed(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${T.successBorder}`, background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer" }}>
                <Heart size={16} color={T.success} fill={myC > 0 ? T.success : "none"} />
                <span style={{ fontSize: 13, fontWeight: 600, color: T.success }}>{item.celebrations + myC} celebrations</span>
              </button>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

// ——— TEACHERS PAGE ———
function TeachersPage() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <PageHero title="Our Team" subtitle="Yoga with teachers that are unique, inspiring, and fun" image="/images/class-action.jpg" />
      <div style={{ padding: "20px 16px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {TEACHERS.map(t => (
          <div key={t.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
            <button onClick={() => setExpanded(expanded === t.id ? null : t.id)} style={{ width: "100%", padding: 16, background: "none", border: "none", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${T.accentGhost}, ${T.successGhost})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: T.accent, flexShrink: 0 }}>
                {t.nickname ? t.nickname[0] : t.firstName[0]}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 16, color: T.text, margin: 0 }}>{t.nickname || t.firstName} {t.lastName}</p>
                <p style={{ fontSize: 12, color: T.accent, margin: "2px 0 0" }}>{t.role}</p>
              </div>
              <ChevronDown size={18} color={T.textFaint} style={{ transform: expanded === t.id ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            {expanded === t.id && (
              <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 12 }}>
                <p style={{ fontSize: 13, color: T.text, lineHeight: 1.6, margin: "0 0 12px" }}>{t.bio}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                  {t.specialties.map(s => (
                    <span key={s} style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 99, background: T.accentGhost, color: T.accent, border: `1px solid ${T.accentBorder}` }}>{s}</span>
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {t.certs.map(c => (
                    <span key={c} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, background: T.bgDim, color: T.textMuted }}>{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

// ——— EVENTS PAGE ———
function EventsPage() {
  return (
    <div>
      <PageHero title="Events" subtitle="Workshops, sound baths, trainings, and more" image="/images/rooftop-flow.jpg" />
      <div style={{ padding: "20px 16px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {EVENTS.map(ev => {
          const spotsLeft = ev.maxParticipants - ev.registered;
          return (
            <div key={ev.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: ev.type === "Sound Bath" ? "#8b5cf6" : ev.type === "Training" ? T.success : T.accent, background: ev.type === "Sound Bath" ? "rgba(139,92,246,.08)" : ev.type === "Training" ? T.successGhost : T.accentGhost, padding: "2px 8px", borderRadius: 99 }}>
                    {ev.type}
                  </span>
                  <span style={{ fontSize: 11, color: T.textFaint }}>{formatDateShort(ev.date)}</span>
                </div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: T.text, margin: "0 0 6px" }}>{ev.name}</h4>
                <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.5, margin: "0 0 12px" }}>{ev.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, color: T.text }}>${ev.fee}</span>
                    <span style={{ fontSize: 12, color: T.textFaint, marginLeft: 6 }}>{spotsLeft} spots left</span>
                  </div>
                  <button style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: spotsLeft <= 5 ? T.warning : T.accent, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    {spotsLeft <= 5 ? "Almost Full" : "Register"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

// ——— MEMBERSHIP PAGE ———
function MembershipPage() {
  return (
    <div>
      <PageHero title="Membership" subtitle="Simple. Understandable. Accessible." image="/images/studio-view.jpg" />
      <div style={{ padding: "20px 16px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: T.bgCard, border: `1px solid ${tier.popular ? T.accent : T.border}`, borderRadius: 14, padding: 18, position: "relative", overflow: "hidden" }}>
            {tier.popular && (
              <div style={{ position: "absolute", top: 12, right: -28, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 32px", transform: "rotate(45deg)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Popular</div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: T.text, margin: 0 }}>{tier.name}</h4>
                <div style={{ marginTop: 4 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: T.text }}>${tier.price}</span>
                  <span style={{ fontSize: 13, color: T.textMuted, marginLeft: 4 }}>{tier.period}</span>
                </div>
                {tier.annualPrice && <p style={{ fontSize: 12, color: T.accent, fontWeight: 600, margin: "4px 0 0" }}>or ${tier.annualPrice}/year — save ${tier.price * 12 - tier.annualPrice}!</p>}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {tier.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Check size={14} color={T.accent} />
                  <span style={{ fontSize: 13, color: T.text }}>{f}</span>
                </div>
              ))}
            </div>
            <button style={{ marginTop: 14, width: "100%", padding: "12px", borderRadius: 10, border: tier.popular ? "none" : `1px solid ${T.accent}`, background: tier.popular ? T.accent : "transparent", color: tier.popular ? "#fff" : T.accent, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              {tier.type === "intro" ? "Get mOMentum" : "Choose Plan"}
            </button>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

// ——— GUEST PASSES PAGE ———
function GuestPassesPage() {
  const passes = [
    { id: "gp1", status: "available", label: "Pass 1 of 2" },
    { id: "gp2", status: "available", label: "Pass 2 of 2" },
  ];

  return (
    <div>
      <PageHero title="Buddy Passes" subtitle="Share the SLPY love with someone special" image="/images/community-gather.jpg" />
      <div style={{ padding: "20px 16px 0" }}>
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: 18, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <Gift size={24} color={T.accent} />
          <div>
            <p style={{ fontWeight: 600, fontSize: 16, color: T.text, margin: 0 }}>2 passes available</p>
            <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>Refreshes monthly with Unlimited membership</p>
          </div>
        </div>
        {passes.map(p => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: `1px solid ${T.borderLight}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CircleCheck size={18} color={T.accent} />
              <span style={{ fontSize: 14, color: T.text, fontWeight: 500 }}>{p.label}</span>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${T.accentBorder}`, background: T.accentGhost, cursor: "pointer", color: T.accent, fontSize: 13, fontWeight: 600 }}>
              <Share2 size={14} /> Share
            </button>
          </div>
        ))}
      </div>
      <div style={{ background: T.bgDim, border: `1px solid ${T.borderLight}`, borderRadius: 12, padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Info size={16} color={T.textMuted} />
          <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>Buddy passes give your friend one free class to experience SLPY. They'll love you for it.</p>
        </div>
      </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN PAGES (Light Theme)
// ═══════════════════════════════════════════════════════════════

const adminCard = { background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 };
const adminHeading = { fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 600, color: "#1f2937", margin: "0 0 20px" };
const adminSubheading = { fontSize: 16, fontWeight: 600, color: "#1f2937", margin: "0 0 16px" };
const adminTooltip = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1f2937" };
const adminBtn = (primary) => ({
  display: "flex", alignItems: "center", gap: 6, padding: primary ? "10px 20px" : "8px 14px",
  borderRadius: 8, border: primary ? "none" : "1px solid #e5e7eb", background: primary ? T.accent : "#ffffff",
  color: primary ? "#fff" : "#1f2937", fontSize: 14, fontWeight: 600, cursor: "pointer",
});
const adminIconBtn = { padding: 6, borderRadius: 6, border: "1px solid #e5e7eb", background: "#ffffff", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" };

function AdminDashboard() {
  const m = ADMIN_METRICS;
  return (
    <div>
      <h2 style={adminHeading}>Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Active Members", value: m.activeMembers, change: `+${m.memberChange}`, icon: Users, color: T.accent },
          { label: "Today's Check-ins", value: m.todayCheckIns, sub: `${m.weekCheckIns} this week`, icon: UserCheck, color: T.success },
          { label: "Monthly Revenue", value: `$${(m.monthlyRevenue / 1000).toFixed(1)}k`, change: `+${m.revenueChange}%`, icon: DollarSign, color: T.accent },
          { label: "Renewal Rate", value: `${m.renewalRate}%`, sub: "Last 90 days", icon: TrendingUp, color: T.success },
        ].map((card, i) => (
          <div key={i} style={{ ...adminCard }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <card.icon size={20} color={card.color} />
              {card.change && <span style={{ fontSize: 12, fontWeight: 600, color: card.change.startsWith("+") ? "#16a34a" : "#dc2626", display: "flex", alignItems: "center", gap: 2 }}>{card.change.startsWith("+") ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{card.change}</span>}
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, color: "#1f2937", margin: "0 0 2px" }}>{card.value}</p>
            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{card.sub || card.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ ...adminCard }}>
          <h3 style={adminSubheading}>Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ADMIN_CHARTS.attendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip contentStyle={adminTooltip} />
              <Bar dataKey="total" fill={T.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ ...adminCard }}>
          <h3 style={adminSubheading}>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={ADMIN_CHARTS.revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip contentStyle={adminTooltip} formatter={v => [`$${v.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke={T.accent} fill={T.accent} fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ ...adminCard }}>
          <h3 style={adminSubheading}>Membership Mix</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={ADMIN_CHARTS.membershipBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {ADMIN_CHARTS.membershipBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={adminTooltip} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {ADMIN_CHARTS.membershipBreakdown.map(mb => (
              <span key={mb.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6b7280" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: mb.color }} /> {mb.name} ({mb.value})
              </span>
            ))}
          </div>
        </div>
        <div style={{ ...adminCard }}>
          <h3 style={adminSubheading}>Class Fill Rates</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ADMIN_CHARTS.classPopularity.map(slot => (
              <div key={slot.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{slot.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: slot.pct >= 90 ? "#dc2626" : slot.pct >= 75 ? T.success : "#16a34a" }}>{slot.pct}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "#e5e7eb" }}>
                  <div style={{ height: "100%", width: `${slot.pct}%`, borderRadius: 3, background: slot.pct >= 90 ? "#dc2626" : slot.pct >= 75 ? T.success : "#16a34a" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminSchedule() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const dayData = WEEKLY_SCHEDULE.find(d => d.day === selectedDay);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ ...adminHeading, margin: 0 }}>Schedule</h2>
        <button style={adminBtn(true)}><Plus size={16} /> Add Class</button>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {WEEKLY_SCHEDULE.map(d => (
          <button key={d.day} onClick={() => setSelectedDay(d.day)} style={{
            padding: "7px 16px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, fontWeight: 600, cursor: "pointer",
            background: selectedDay === d.day ? T.accent : "#ffffff", color: selectedDay === d.day ? "#fff" : "#1f2937",
          }}>{d.day}</button>
        ))}
      </div>
      <div style={{ ...adminCard, padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              {["Time", "Class Type", "Teacher", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dayData && dayData.classes.map((cls, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{fmtTime(cls.time)}</td>
                <td style={{ padding: "12px 16px", fontSize: 14, color: "#1f2937" }}>{cls.type}</td>
                <td style={{ padding: "12px 16px", fontSize: 14, color: "#6b7280" }}>{cls.coach}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={adminIconBtn} title="Edit"><Edit3 size={14} color="#6b7280" /></button>
                    <button style={adminIconBtn} title="Delete"><Trash2 size={14} color="#dc2626" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminTeachers() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ ...adminHeading, margin: 0 }}>Teachers</h2>
        <button style={adminBtn(true)}><Plus size={16} /> Add Teacher</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {TEACHERS.map(t => (
          <div key={t.id} style={{ ...adminCard }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1f2937", margin: "0 0 2px" }}>{t.firstName} {t.lastName}</h3>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{t.role}</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={adminIconBtn} title="Edit"><Edit3 size={14} color="#6b7280" /></button>
                <button style={adminIconBtn} title="Delete"><Trash2 size={14} color="#dc2626" /></button>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>Specialties</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {t.specialties.map(s => (
                  <span key={s} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 99, background: T.accentGhost, color: T.accent, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>Certifications</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {t.certs.map(c => (
                  <span key={c} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 99, border: "1px solid #e5e7eb", color: "#6b7280" }}>{c}</span>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "10px 0 0" }}>{t.yearsTeaching} years teaching</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminMembers() {
  const [search, setSearch] = useState("");
  const filtered = MEMBERS_DATA.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ ...adminHeading, margin: 0 }}>Members</h2>
        <button style={adminBtn(true)}><Plus size={16} /> Add Member</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 16 }}>
        <Search size={18} color="#9ca3af" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." style={{ flex: 1, background: "none", border: "none", color: "#1f2937", fontSize: 14, outline: "none" }} />
      </div>
      <div style={{ ...adminCard, padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              {["Name", "Membership", "Status", "Check-ins", "Last Visit"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "12px 14px" }}>
                  <p style={{ fontWeight: 600, color: "#1f2937", fontSize: 14, margin: 0 }}>{m.name}</p>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>{m.email}</p>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "#6b7280" }}>{m.membership}</td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: m.status === "active" ? "rgba(22,163,74,.08)" : "rgba(220,38,38,.08)", color: m.status === "active" ? "#16a34a" : "#dc2626" }}>{m.status}</span>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{m.checkIns}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "#6b7280" }}>{formatDateShort(m.lastVisit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminEvents() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ ...adminHeading, margin: 0 }}>Events</h2>
        <button style={adminBtn(true)}><Plus size={16} /> Add Event</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {EVENTS.map(ev => (
          <div key={ev.id} style={{ ...adminCard, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1f2937", margin: 0 }}>{ev.name}</h3>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: T.accentGhost, color: T.accent }}>{ev.type}</span>
              </div>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 8px" }}>{ev.description}</p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6b7280" }}><CalendarDays size={14} /> {formatDateShort(ev.date)}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6b7280" }}><Clock size={14} /> {fmtTime(ev.startTime)}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6b7280" }}><Users size={14} /> {ev.registered}/{ev.maxParticipants} registered</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6b7280" }}><DollarSign size={14} /> ${ev.fee}</span>
              </div>
              <span style={{ display: "inline-block", marginTop: 8, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                background: ev.status === "Almost Full" ? "rgba(220,38,38,.08)" : "rgba(22,163,74,.08)",
                color: ev.status === "Almost Full" ? "#dc2626" : "#16a34a",
              }}>{ev.status}</span>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 16 }}>
              <button style={adminIconBtn} title="Edit"><Edit3 size={14} color="#6b7280" /></button>
              <button style={adminIconBtn} title="Delete"><Trash2 size={14} color="#dc2626" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPricing() {
  return (
    <div>
      <h2 style={adminHeading}>Pricing</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ ...adminCard, position: "relative", border: tier.popular ? `2px solid ${T.accent}` : "1px solid #e5e7eb" }}>
            {tier.popular && (
              <span style={{ position: "absolute", top: -10, left: 16, fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 99, background: T.accent, color: "#fff" }}>Most Popular</span>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1f2937", margin: "0 0 2px" }}>{tier.name}</h3>
                <p style={{ fontSize: 13, color: "#9ca3af", margin: 0, textTransform: "capitalize" }}>{tier.type}</p>
              </div>
              <button style={adminIconBtn} title="Edit"><Edit3 size={14} color="#6b7280" /></button>
            </div>
            <div style={{ marginBottom: 14 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#1f2937" }}>${tier.price}</span>
              <span style={{ fontSize: 13, color: "#6b7280", marginLeft: 4 }}>{tier.period}</span>
              {tier.annualPrice && <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>Annual: ${tier.annualPrice}/yr</p>}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              {tier.features.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6b7280" }}>
                  <Check size={14} color="#16a34a" /> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminBroadcast() {
  const [msgType, setMsgType] = useState("all");

  return (
    <div>
      <h2 style={adminHeading}>Broadcast</h2>
      <div style={{ ...adminCard }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", margin: "0 0 10px" }}>Select Audience</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["all", "unlimited", "8x monthly", "new"].map(t => (
            <button key={t} onClick={() => setMsgType(t)} style={{
              padding: "7px 16px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, fontWeight: 600, cursor: "pointer",
              background: msgType === t ? T.accent : "#ffffff", color: msgType === t ? "#fff" : "#6b7280", textTransform: "capitalize",
            }}>{t === "all" ? "All Members" : t}</button>
          ))}
        </div>
        <div style={{ marginBottom: 12 }}>
          <input placeholder="Subject line..." style={{ width: "100%", padding: "10px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1f2937", fontSize: 14, outline: "none", marginBottom: 8, boxSizing: "border-box" }} />
          <textarea placeholder="Write your message..." rows={5} style={{ width: "100%", padding: "10px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1f2937", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>Sending to: {msgType === "all" ? "248" : msgType === "unlimited" ? "180" : msgType === "8x monthly" ? "44" : "24"} members</span>
          <button style={adminBtn(true)}>
            <Send size={16} /> Send Broadcast
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminSettings() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSms, setNotifSms] = useState(false);

  const toggleStyle = (active) => ({
    width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", position: "relative",
    background: active ? T.accent : "#e5e7eb", transition: "background 0.2s",
  });
  const toggleKnob = (active) => ({
    position: "absolute", top: 2, left: active ? 22 : 2, width: 20, height: 20,
    borderRadius: 10, background: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,.15)", transition: "left 0.2s",
  });

  return (
    <div>
      <h2 style={adminHeading}>Settings</h2>

      <div style={{ ...adminCard, marginBottom: 16 }}>
        <h3 style={{ ...adminSubheading, marginBottom: 14 }}>Studio Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Studio Name", value: STUDIO_CONFIG.name + " - " + STUDIO_CONFIG.subtitle },
            { label: "Address", value: `${STUDIO_CONFIG.address.street}, ${STUDIO_CONFIG.address.city}, ${STUDIO_CONFIG.address.state} ${STUDIO_CONFIG.address.zip}` },
            { label: "Phone", value: STUDIO_CONFIG.phone },
            { label: "Email", value: STUDIO_CONFIG.email },
            { label: "Website", value: STUDIO_CONFIG.website },
            { label: "Neighborhood", value: STUDIO_CONFIG.neighborhood },
          ].map((item, i) => (
            <div key={i} style={{ padding: "10px 14px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>{item.label}</p>
              <p style={{ fontSize: 14, color: "#1f2937", margin: 0, wordBreak: "break-word" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...adminCard, marginBottom: 16 }}>
        <h3 style={{ ...adminSubheading, marginBottom: 14 }}>Social Media</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
            <Share2 size={16} color="#6b7280" />
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>Instagram</p>
              <p style={{ fontSize: 14, color: "#1f2937", margin: 0 }}>{STUDIO_CONFIG.social.instagram}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...adminCard }}>
        <h3 style={{ ...adminSubheading, marginBottom: 14 }}>Notification Preferences</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Email Notifications", sub: "Receive booking confirmations and member updates via email", active: notifEmail, toggle: () => setNotifEmail(!notifEmail) },
            { label: "Push Notifications", sub: "Real-time alerts for new bookings and cancellations", active: notifPush, toggle: () => setNotifPush(!notifPush) },
            { label: "SMS Notifications", sub: "Text message alerts for urgent studio updates", active: notifSms, toggle: () => setNotifSms(!notifSms) },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1f2937", margin: "0 0 2px" }}>{item.label}</p>
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{item.sub}</p>
              </div>
              <button onClick={item.toggle} style={toggleStyle(item.active)}>
                <span style={toggleKnob(item.active)} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MODALS
// ═══════════════════════════════════════════════════════════════

function SettingsModal({ onClose }) {
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(6px)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: T.bgCard, borderRadius: "20px 20px 0 0", padding: "20px 20px 32px", maxHeight: "70%", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: 0 }}>Settings</h3>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, border: "none", background: T.bgDim, cursor: "pointer" }}><X size={18} color={T.textMuted} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[{ label: "Notifications", sub: "Push & email preferences" }, { label: "Practice Reminders", sub: "Daily motivation" }, { label: "Privacy", sub: "Profile visibility" }, { label: "Account", sub: "Manage membership & billing" }].map((item, i) => (
            <button key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: T.bgDim, border: "none", borderRadius: 12, cursor: "pointer", textAlign: "left" }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 15, color: T.text, margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{item.sub}</p>
              </div>
              <ChevronRight size={18} color={T.textFaint} />
            </button>
          ))}
        </div>
        <div style={{ marginTop: 20, padding: "14px", background: T.bgDim, borderRadius: 12, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: T.textFaint, margin: 0 }}>Salt Lake Power Yoga</p>
          <p style={{ fontSize: 11, color: T.textFaint, margin: "2px 0 0" }}>{STUDIO_CONFIG.address.street}, {STUDIO_CONFIG.address.city} {STUDIO_CONFIG.address.state} {STUDIO_CONFIG.address.zip}</p>
          <p style={{ fontSize: 11, color: T.accent, margin: "4px 0 0" }}>{STUDIO_CONFIG.phone}</p>
        </div>
      </div>
    </div>
  );
}

function NotificationsModal({ onClose }) {
  const notifications = [
    { id: "n1", title: "Class Reminder", message: "DETOX at 4:30 PM today with Quinn — 3 spots left!", time: "1h ago", unread: true },
    { id: "n2", title: "Streak Alert", message: "You're at 12 days straight! Keep that fire burning!", time: "3h ago", unread: true },
    { id: "n3", title: "New Event", message: "Summer Solstice Rooftop Flow — registration now open.", time: "1d ago", unread: false },
    { id: "n4", title: "Milestone Achieved", message: "You've completed 50 classes! Halfway to 100!", time: "3d ago", unread: false },
  ];

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(6px)", zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: T.bgCard, borderRadius: "20px 20px 0 0", padding: "20px 20px 32px", maxHeight: "70%", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: 0 }}>Notifications</h3>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, border: "none", background: T.bgDim, cursor: "pointer" }}><X size={18} color={T.textMuted} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifications.map(n => (
            <div key={n.id} style={{ padding: "14px 16px", background: n.unread ? T.accentGhost : T.bgDim, border: `1px solid ${n.unread ? T.accentBorder : T.borderLight}`, borderRadius: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{n.title}</p>
                <span style={{ fontSize: 11, color: T.textFaint }}>{n.time}</span>
              </div>
              <p style={{ fontSize: 13, color: T.textMuted, margin: 0, lineHeight: 1.4 }}>{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReservationModal({ classData, onConfirm, onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const isFull = classData.registered >= classData.capacity;

  const handleConfirm = () => {
    onConfirm(classData.id);
    setConfirmed(true);
  };

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(6px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "90%", background: T.bgCard, borderRadius: 20, padding: 24, textAlign: "center" }}>
        {confirmed ? (
          <>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Check size={30} color={T.accent} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: "0 0 8px" }}>You're In!</h3>
            <p style={{ fontSize: 14, color: T.textMuted, margin: "0 0 6px" }}>{classData.type}</p>
            <p style={{ fontSize: 13, color: T.textFaint, margin: "0 0 20px" }}>{fmtTime(classData.time)} with {classData.coach}</p>
            <button onClick={onClose} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: T.accent, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Done</button>
          </>
        ) : (
          <>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: "0 0 16px" }}>{isFull ? "Join Waitlist" : "Reserve Spot"}</h3>
            <div style={{ background: T.bgDim, borderRadius: 12, padding: 16, marginBottom: 16, textAlign: "left" }}>
              <p style={{ fontWeight: 600, fontSize: 16, color: T.text, margin: "0 0 4px" }}>{classData.type}</p>
              <p style={{ fontSize: 13, color: T.textMuted, margin: "0 0 2px" }}>{fmtTime(classData.time)} · {classData.coach}</p>
              <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>{classData.registered}/{classData.capacity} registered</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1px solid ${T.border}`, background: "transparent", color: T.textMuted, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleConfirm} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", background: T.accent, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                {isFull ? "Join Waitlist" : "Confirm"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [classRegistrations, setClassRegistrations] = useState({});
  const [reservationClass, setReservationClass] = useState(null);
  const [feedCelebrations, setFeedCelebrations] = useState({});
  const registerForClass = useCallback((classId) => {
    setClassRegistrations(prev => ({ ...prev, [classId]: (prev[classId] || 0) + 1 }));
  }, []);

  const openReservation = useCallback((classData) => {
    setReservationClass(classData);
  }, []);

  const celebrateFeed = useCallback((feedId) => {
    setFeedCelebrations(prev => ({ ...prev, [feedId]: (prev[feedId] || 0) + 1 }));
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("adminModeChange", { detail: { isAdmin } }));
  }, [isAdmin]);

  const unreadCount = 2;

  const mainTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "schedule", label: "Schedule", icon: CalendarDays },
    { id: "practice", label: "Practice", icon: Flame },
    { id: "community", label: "Community", icon: Heart },
    { id: "more", label: "More", icon: Menu },
  ];

  const moreItems = [
    { id: "classes", label: "Classes", icon: Calendar },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "events", label: "Events", icon: PartyPopper },
    { id: "membership", label: "Membership", icon: CreditCard },
    { id: "guests", label: "Buddy Pass", icon: Gift },
  ];

  const isMoreActive = moreItems.some(m => m.id === page);

  const adminTabs = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-schedule", label: "Schedule", icon: CalendarDays },
    { id: "admin-teachers", label: "Teachers", icon: Users },
    { id: "admin-members", label: "Members", icon: UserCheck },
    { id: "admin-events", label: "Events", icon: PartyPopper },
    { id: "admin-pricing", label: "Pricing", icon: Tag },
    { id: "admin-broadcast", label: "Broadcast", icon: Radio },
    { id: "admin-settings", label: "Settings", icon: Settings },
  ];

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "classes": return <ClassesPage />;
      case "schedule": return <SchedulePage />;
      case "practice": return <PracticePage />;
      case "community": return <CommunityPage />;
      case "teachers": return <TeachersPage />;
      case "events": return <EventsPage />;
      case "membership": return <MembershipPage />;
      case "guests": return <GuestPassesPage />;
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-schedule": return <AdminSchedule />;
      case "admin-teachers": return <AdminTeachers />;
      case "admin-members": return <AdminMembers />;
      case "admin-events": return <AdminEvents />;
      case "admin-pricing": return <AdminPricing />;
      case "admin-broadcast": return <AdminBroadcast />;
      case "admin-settings": return <AdminSettings />;
      default: return <HomePage />;
    }
  };

  // ——— ADMIN LAYOUT ———
  if (isAdmin) {
    return (
      <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
        <div style={{ display: "flex", minHeight: "100vh", background: "#f5f5f5", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#1f2937" }}>
          <aside style={{ width: 240, background: "#ffffff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", position: "fixed", height: "100vh" }}>
            <div style={{ padding: "16px 14px", borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {STUDIO_CONFIG.logoImage ? (
                  <img src={STUDIO_CONFIG.logoImage} alt={STUDIO_CONFIG.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><Flame size={18} color="#fff" /></div>
                )}
                <div>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1f2937" }}>SLPY</span>
                  <span style={{ display: "block", fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>Admin Portal</span>
                </div>
              </div>
            </div>
            <nav style={{ flex: 1, padding: "12px 8px", overflow: "auto" }}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af", padding: "0 10px", margin: "0 0 8px" }}>Management</p>
              {adminTabs.map(tab => {
                const active = page === tab.id;
                return (
                  <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: active ? T.accent : "transparent", color: active ? "#fff" : "#6b7280", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", marginBottom: 2, textAlign: "left" }}>
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                    {active && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.6 }} />}
                  </button>
                );
              })}
            </nav>
            <div style={{ borderTop: "1px solid #e5e7eb", padding: "10px 8px" }}>
              <button onClick={() => { setIsAdmin(false); setPage("home"); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", color: "#6b7280", fontSize: 13, cursor: "pointer", textAlign: "left" }}>
                <LogOut size={18} />
                <span>Exit Admin</span>
              </button>
            </div>
          </aside>
          <main style={{ flex: 1, marginLeft: 240, padding: 24, overflow: "auto" }}>
            {renderPage()}
          </main>
        </div>
      </AppContext.Provider>
    );
  }

  // ——— CONSUMER LAYOUT ———
  return (
    <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: T.bgDim, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Header */}
        <header style={{ flexShrink: 0, zIndex: 30, background: T.bg, color: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
            {STUDIO_CONFIG.logoImage ? (
              <img src={STUDIO_CONFIG.logoImage} alt={STUDIO_CONFIG.name} style={{ width: 38, height: 38, borderRadius: 10, objectFit: "cover" }} />
            ) : (
              <div style={{ width: 38, height: 38, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><Flame size={20} color="#fff" /></div>
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, lineHeight: 1, letterSpacing: "0.02em" }}>{STUDIO_CONFIG.name}</span>
              <span style={{ fontSize: 8, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em" }}>{STUDIO_CONFIG.subtitle}</span>
            </div>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button onClick={() => { setIsAdmin(true); setPage("admin-dashboard"); }} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: T.accent }}>
              <Shield size={20} />
            </button>
            <button onClick={() => setShowNotifications(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff", position: "relative" }}>
              <Bell size={20} />
              {unreadCount > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: T.accent, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{unreadCount}</span>}
            </button>
            <button onClick={() => setShowSettings(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff" }}>
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch" }}>
          {renderPage()}
        </main>

        {/* Bottom Nav */}
        <nav style={{ flexShrink: 0, zIndex: 30, background: T.bgCard, borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-around", padding: "6px 4px 10px" }}>
            {mainTabs.map(tab => {
              const active = tab.id === "more" ? (isMoreActive || showMore) : page === tab.id;
              if (tab.id === "more") {
                return (
                  <button key={tab.id} onClick={() => setShowMore(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                    <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                    <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                  </button>
                );
              }
              return (
                <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                  <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                  <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* More Menu Overlay */}
        {showMore && (
          <div onClick={() => setShowMore(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 40 }}>
            <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 68, left: 16, right: 16, background: T.bgCard, borderRadius: 16, padding: "14px 12px", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 8px" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>More</span>
                <button onClick={() => setShowMore(false)} style={{ padding: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}><X size={18} color={T.textMuted} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {moreItems.map(item => {
                  const active = page === item.id;
                  return (
                    <button key={item.id} onClick={() => { setPage(item.id); setShowMore(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? T.accentGhost : T.bgDim, color: active ? T.accent : T.textMuted }}>
                      <item.icon size={22} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
        {reservationClass && <ReservationModal classData={reservationClass} onConfirm={registerForClass} onClose={() => setReservationClass(null)} />}
      </div>
    </AppContext.Provider>
  );
}
