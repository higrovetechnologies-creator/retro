import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";
import RetroMark from "../common/RetroMark";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "All Collection", to: "/collection" },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "Offer Product", to: "/offers" },
  { label: "Shirts", to: "/shirts" },
  { label: "Tees", to: "/tees" },
  { label: "Pants", to: "/pants" },
  { label: "Our Story", to: "/our-story" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const wrapRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    function onClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setSearchOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/collection?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled || !isHome ? "glass-strong" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-4 sm:px-8">
          {/* Desktop brand — unchanged */}
          <Link to="/" className="hidden items-center gap-2.5 shrink-0 sm:flex">
            <RetroMark className="h-8 w-8" />
            <span className="font-display text-[19px] leading-none tracking-tight text-bone">
              Retro <span className="italic text-mist">Clothing</span>
            </span>
          </Link>

          {/* Mobile: logo only, perfectly centered */}
          <Link
            to="/"
            aria-label="Retro Clothing home"
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:hidden"
          >
            <img
              src="Retro-logo.png"
              alt="Retro Clothing logo"
              className="h-9 w-9 object-contain"
              draggable={false}
            />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `relative text-[12.5px] font-medium uppercase tracking-widest transition-colors ${
                    isActive ? "text-bone" : "text-mist hover:text-bone"
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="relative pb-1">
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-0.5 left-0 h-px w-full bg-bone"
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div ref={wrapRef} className="relative">
              <AnimatePresence>
                {searchOpen && (
                  <motion.form
                    onSubmit={submitSearch}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 260, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-11 top-1/2 -translate-y-1/2 hidden overflow-hidden sm:block"
                  >
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search products…"
                      className="glass h-10 w-full rounded-full px-4 text-sm text-bone placeholder:text-mist focus:outline-none"
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <button
                aria-label="Search"
                onClick={() => setSearchOpen((s) => !s)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-bone transition-colors hover:bg-white/5"
              >
                {searchOpen ? <X size={17} strokeWidth={1.75} /> : <Search size={17} strokeWidth={1.75} />}
              </button>
            </div>

            <button
              aria-label="Menu"
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-bone transition-colors hover:bg-white/5 lg:hidden"
            >
              <Menu size={19} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={NAV_LINKS} />
    </>
  );
}
