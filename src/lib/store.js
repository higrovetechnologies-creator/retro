// ---------------------------------------------------------------------------
// Demo persistence layer.
//
// This sandbox has no live Supabase project, so admin actions (add/edit/
// delete product, announcements, company settings, contact messages) are
// persisted to localStorage instead. The shape of every record matches the
// Supabase tables in the brief, and every function here is written as the
// seam where a real @supabase/supabase-js call would go — see README.md.
// ---------------------------------------------------------------------------
import { PRODUCTS, ANNOUNCEMENTS, COMPANY_SETTINGS, REVIEWS } from "./data";

const KEYS = {
  products: "rc_products",
  announcements: "rc_announcements",
  settings: "rc_settings",
  reviews: "rc_reviews",
  messages: "rc_messages",
  session: "rc_admin_session",
};

const hasStorage = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

function read(key, fallback) {
  if (!hasStorage) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function write(key, value) {
  if (!hasStorage) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function ensureSeeded() {
  if (!hasStorage) return;
  if (!window.localStorage.getItem(KEYS.products)) write(KEYS.products, PRODUCTS);
  if (!window.localStorage.getItem(KEYS.announcements)) write(KEYS.announcements, ANNOUNCEMENTS);
  if (!window.localStorage.getItem(KEYS.settings)) write(KEYS.settings, COMPANY_SETTINGS);
  if (!window.localStorage.getItem(KEYS.reviews)) write(KEYS.reviews, REVIEWS);
  if (!window.localStorage.getItem(KEYS.messages)) write(KEYS.messages, []);
}
ensureSeeded();

const notify = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("rc-store-change"));
};

export const db = {
  getProducts: () => read(KEYS.products, PRODUCTS),
  saveProduct: (product) => {
    const list = db.getProducts();
    const idx = list.findIndex((p) => p.id === product.id);
    if (idx >= 0) list[idx] = product;
    else list.unshift({ ...product, id: createId(), created_at: new Date().toISOString() });
    write(KEYS.products, list);
    notify();
  },
  deleteProduct: (id) => {
    write(KEYS.products, db.getProducts().filter((p) => p.id !== id));
    notify();
  },

  getAnnouncements: () => read(KEYS.announcements, ANNOUNCEMENTS),
  saveAnnouncement: (a) => {
    const list = db.getAnnouncements();
    const idx = list.findIndex((x) => x.id === a.id);
    if (idx >= 0) list[idx] = a;
    else list.unshift({ ...a, id: createId() });
    write(KEYS.announcements, list);
    notify();
  },
  deleteAnnouncement: (id) => {
    write(KEYS.announcements, db.getAnnouncements().filter((a) => a.id !== id));
    notify();
  },

  getSettings: () => read(KEYS.settings, COMPANY_SETTINGS),
  saveSettings: (s) => {
    write(KEYS.settings, s);
    notify();
  },

  getReviews: () => read(KEYS.reviews, REVIEWS),

  getMessages: () => read(KEYS.messages, []),
  addMessage: (m) => {
    const list = db.getMessages();
    list.unshift({ ...m, id: createId(), created_at: new Date().toISOString(), status: "new" });
    write(KEYS.messages, list);
    notify();
    return list[0];
  },
  markMessageRead: (id) => {
    const list = db.getMessages().map((m) => (m.id === id ? { ...m, status: "read" } : m));
    write(KEYS.messages, list);
    notify();
  },

  resetAll: () => {
    window.localStorage.removeItem(KEYS.products);
    window.localStorage.removeItem(KEYS.announcements);
    window.localStorage.removeItem(KEYS.settings);
    window.localStorage.removeItem(KEYS.reviews);
    window.localStorage.removeItem(KEYS.messages);
    ensureSeeded();
    notify();
  },
};

// --- Demo admin auth -------------------------------------------------------
// Stands in for Supabase Authentication. Credentials are intentionally
// simple since this is a local prototype, not a production auth system.
const DEMO_ADMIN = { email: "admin@retroclothing.in", password: "retro2026" };

export const auth = {
  signIn: (email, password) => {
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      write(KEYS.session, { email, signedInAt: Date.now() });
      notify();
      return { ok: true };
    }
    return { ok: false, error: "Invalid email or password." };
  },
  signOut: () => {
    window.localStorage.removeItem(KEYS.session);
    notify();
  },
  getSession: () => read(KEYS.session, null),
  demoCredentials: DEMO_ADMIN,
};
