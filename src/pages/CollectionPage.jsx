import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import ProductCard from "../components/common/ProductCard";
import { EmptyState, FilterButton, SectionHeading } from "../components/common/Misc";
import { useProducts } from "../hooks/useStore";
import { SIZES, CATEGORIES } from "../lib/data";

const PRICE_BANDS = [
  { label: "Under ₹1,000", test: (p) => p.now_price < 1000 },
  { label: "₹1,000 – ₹1,500", test: (p) => p.now_price >= 1000 && p.now_price <= 1500 },
  { label: "Above ₹1,500", test: (p) => p.now_price > 1500 },
];

export default function CollectionPage({ mode = "all", category, title, eyebrow }) {
  const products = useProducts();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [debounced, setDebounced] = useState(query);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceBand, setPriceBand] = useState(null);
  const [size, setSize] = useState(null);
  const [extra, setExtra] = useState({ new: false, offer: false, featured: false });

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setQuery(params.get("q") || "");
  }, [params]);

  const base = useMemo(() => {
    let list = products;
    if (mode === "new") list = list.filter((p) => p.is_new_arrival);
    if (mode === "offers") list = list.filter((p) => p.is_offer);
    if (mode === "category") list = list.filter((p) => p.category === category);
    return list;
  }, [products, mode, category]);

  const filtered = useMemo(() => {
    let list = base;
    if (debounced.trim()) {
      const q = debounced.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.product_code.toLowerCase().includes(q)
      );
    }
    if (priceBand) list = list.filter((p) => PRICE_BANDS[priceBand].test(p));
    if (size) list = list.filter((p) => p.sizes.includes(size));
    if (extra.new) list = list.filter((p) => p.is_new_arrival);
    if (extra.offer) list = list.filter((p) => p.is_offer);
    if (extra.featured) list = list.filter((p) => p.is_featured);
    return list;
  }, [base, debounced, priceBand, size, extra]);

  const activeFilterCount =
    (priceBand !== null ? 1 : 0) + (size ? 1 : 0) + Object.values(extra).filter(Boolean).length;

  const clearFilters = () => {
    setPriceBand(null);
    setSize(null);
    setExtra({ new: false, offer: false, featured: false });
    setQuery("");
    setParams({});
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-32 sm:px-8">
      <SectionHeading eyebrow={eyebrow} title={title} />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} strokeWidth={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this collection…"
            className="glass h-11 w-full rounded-full pl-10 pr-4 text-sm text-bone placeholder:text-mist focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-mist">{filtered.length} products</p>
          <FilterButton onClick={() => setFiltersOpen(true)} active={activeFilterCount > 0} />
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs uppercase tracking-widest text-mist underline underline-offset-4 transition-colors hover:text-bone"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState actionLabel="Clear Filters" onAction={clearFilters} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}

      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        priceBand={priceBand}
        setPriceBand={setPriceBand}
        size={size}
        setSize={setSize}
        extra={extra}
        setExtra={setExtra}
        onClear={clearFilters}
        showCategory={mode === "all"}
      />
    </div>
  );
}

function FilterDrawer({ open, onClose, priceBand, setPriceBand, size, setSize, extra, setExtra, onClear }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/70"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong fixed inset-x-0 bottom-0 z-[80] max-h-[80vh] overflow-y-auto rounded-t-[26px] p-6 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-sm sm:rounded-t-none"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-2xl text-bone">Filters</h3>
              <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/5">
                <X size={18} strokeWidth={1.75} className="text-bone" />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-mist">Price</p>
                <div className="flex flex-wrap gap-2">
                  {PRICE_BANDS.map((b, i) => (
                    <button
                      key={b.label}
                      onClick={() => setPriceBand(priceBand === i ? null : i)}
                      className={`rounded-full border px-3.5 py-2 text-xs transition-colors ${
                        priceBand === i ? "border-bone bg-bone text-ink" : "border-line-strong text-bone hover:bg-white/5"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-mist">Size</p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(size === s ? null : s)}
                      className={`h-10 w-10 rounded-full border text-xs transition-colors ${
                        size === s ? "border-bone bg-bone text-ink" : "border-line-strong text-bone hover:bg-white/5"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-mist">Tag</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    ["new", "New Arrival"],
                    ["offer", "Offer Product"],
                    ["featured", "Featured"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setExtra((e) => ({ ...e, [key]: !e[key] }))}
                      className={`rounded-full border px-3.5 py-2 text-xs transition-colors ${
                        extra[key] ? "border-bone bg-bone text-ink" : "border-line-strong text-bone hover:bg-white/5"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-3">
              <button
                onClick={onClear}
                className="flex-1 rounded-full border border-line-strong py-3 text-xs font-medium uppercase tracking-widest text-bone transition-colors hover:bg-white/5"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-full bg-bone py-3 text-xs font-medium uppercase tracking-widest text-ink"
              >
                Show Results
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
