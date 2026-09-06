import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  MagnifyingGlass,
  MapPin,
  Medal,
  SealCheck,
  SlidersHorizontal,
  Star,
  Tag,
  X,
} from "@phosphor-icons/react";
import type { DirectoryPartner, Pillar } from "../types";
import { partners } from "../data/mockData";
import { PILLAR_LABELS } from "../constants";

interface DirectoryViewProps {
  activePillar: Pillar | "all";
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
}

const REGIONS = [
  "All Regions",
  "West Africa",
  "East Africa",
  "North Africa",
  "Southern Africa",
  "South America",
  "Western Europe",
  "Middle East",
  "South Asia",
  "Southeast Asia",
  "East Asia",
  "North America",
] as const;

const CERTS = [
  "All Certifications",
  "ISO 9001",
  "ISO 22000",
  "HACCP",
  "FDA",
  "Rainforest Alliance",
  "FairTrade",
  "Organic",
  "Halal",
] as const;

function PillarSwatch({ pillar }: { pillar: Pillar }) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide";
  const map: Record<Pillar, string> = {
    "raw-materials": "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
    processing: "border-sky-500/30 bg-sky-500/10 text-sky-500",
    packaging: "border-violet-500/30 bg-violet-500/10 text-violet-400",
    logistics: "border-amber-500/30 bg-amber-500/10 text-amber-500",
    freight: "border-cyan-500/30 bg-cyan-500/10 text-cyan-500",
    buyers: "border-rose-500/30 bg-rose-500/10 text-rose-500",
    financiers: "border-teal-500/30 bg-teal-500/10 text-teal-500",
  };
  return (
    <span className={`${base} ${map[pillar]}`}>
      <Tag size={10} weight="fill" />
      {PILLAR_LABELS[pillar]}
    </span>
  );
}

function PartnerCard({
  p,
  bookmarked,
  onToggle,
  onOpen,
  index,
}: {
  p: DirectoryPartner;
  bookmarked: boolean;
  onToggle: () => void;
  onOpen: () => void;
  index: number;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
      className="group relative flex cursor-pointer flex-col rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-slate-900"
      onClick={onOpen}
    >
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <PillarSwatch pillar={p.pillar} />
        <div className="flex items-center gap-1.5">
          {p.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              <SealCheck size={11} weight="fill" /> Verified
            </span>
          )}
          <button
            aria-label="Toggle bookmark"
            className="rounded-lg p-1.5 text-slate-500 opacity-60 transition hover:bg-slate-800 hover:text-amber-400 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            <Star size={16} weight={bookmarked ? "fill" : "regular"} className={bookmarked ? "text-amber-400" : ""} />
          </button>
        </div>
      </div>

      <h3 className="text-[15px] font-semibold leading-tight text-slate-100">{p.name}</h3>
      <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
        <MapPin size={12} className="text-emerald-500" /> {p.city}, {p.country}
      </p>

      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">{p.blurb}</p>

      <div className="mt-3 flex flex-wrap gap-1">
        {p.certifications.slice(0, 3).map((c) => (
          <span
            key={c}
            className="rounded-md border border-slate-700/70 bg-slate-800/70 px-1.5 py-0.5 text-[10px] text-slate-300"
          >
            {c}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1">
          <Medal size={12} className="text-sky-400" /> est. {p.established}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
          {p.rating.toFixed(1)} <Star size={11} weight="fill" className="text-amber-400" />
        </span>
      </div>
      <div className="mt-1 text-[11px] font-medium text-slate-500">
        {p.exportVolume} · {p.moq ? `MOQ ${p.moq}` : p.capacity}
      </div>
    </motion.article>
  );
}

function PartnerDrawer({
  p,
  onClose,
  bookmarked,
  onToggle,
}: {
  p: DirectoryPartner | null;
  onClose: () => void;
  bookmarked: boolean;
  onToggle: () => void;
}) {
  return (
    <AnimatePresence>
      {p && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-800 bg-slate-950 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <PillarSwatch pillar={p.pillar} />
              <button
                aria-label="Close"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold text-slate-50">{p.name}</h2>
                <button
                  aria-label="Bookmark"
                  className={`rounded-lg border p-2 transition ${
                    bookmarked
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                      : "border-slate-700 text-slate-400 hover:text-amber-400"
                  }`}
                  onClick={onToggle}
                >
                  <Star size={17} weight={bookmarked ? "fill" : "regular"} />
                </button>
              </div>

              {p.verified && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                  <SealCheck size={14} weight="fill" /> Verified Partner · Audited credentials
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">Location</div>
                  <div className="mt-0.5 flex items-center gap-1 text-slate-200">
                    <MapPin size={13} className="text-emerald-500" /> {p.city}, {p.country}
                  </div>
                  <div className="text-xs text-slate-500">{p.region}</div>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">Established</div>
                  <div className="mt-0.5 text-slate-200">{p.established}</div>
                  <div className="text-xs text-slate-500">{p.badge}</div>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">Export Volume</div>
                  <div className="mt-0.5 text-slate-200">{p.exportVolume}</div>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">Rating</div>
                  <div className="mt-0.5 flex items-center gap-1 text-slate-200">
                    {p.rating.toFixed(1)} <Star size={13} weight="fill" className="text-amber-400" />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Specialties</h3>
                <div className="flex flex-wrap gap-1.5">
                  {p.specialties.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-xs text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Certifications</h3>
                <div className="flex flex-wrap gap-1.5">
                  {p.certifications.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/5 px-2.5 py-1 text-xs text-emerald-400"
                    >
                      <CheckCircle size={12} weight="fill" /> {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Terms & Pricing
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                    <span className="text-slate-400">Price band</span>
                    <span className="font-semibold text-emerald-400">{p.priceBand}</span>
                  </div>
                  {p.moq && (
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                      <span className="text-slate-400">MOQ</span>
                      <span className="font-semibold text-slate-200">{p.moq}</span>
                    </div>
                  )}
                  {p.capacity && (
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                      <span className="text-slate-400">Capacity</span>
                      <span className="font-semibold text-slate-200">{p.capacity}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 p-4">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
                Request Direct Contact <ArrowRight size={16} weight="bold" />
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default function DirectoryView({ activePillar, bookmarks, onToggleBookmark }: DirectoryViewProps) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("All Regions");
  const [cert, setCert] = useState<(typeof CERTS)[number]>("All Certifications");
  const [sort, setSort] = useState<"featured" | "rating" | "established">("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<DirectoryPartner | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = activePillar === "all" ? partners : partners.filter((p) => p.pillar === activePillar);
    const out = list.filter((p) => {
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.specialties.some((s) => s.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      const matchR = region === "All Regions" || p.region === region;
      const matchC =
        cert === "All Certifications" ||
        p.certifications.some((c) => c.includes(cert === "Organic" ? "Organic" : cert === "FDA" ? "FDA" : cert));
      return matchQ && matchR && matchC;
    });
    if (sort === "rating") return [...out].sort((a, b) => b.rating - a.rating);
    if (sort === "established") return [...out].sort((a, b) => b.established - a.established);
    return [...out].sort((a, b) => Number(b.verified) - Number(a.verified));
  }, [activePillar, query, region, cert, sort]);

  const selectedBookmarked = selected ? bookmarks.includes(selected.id) : false;

  return (
    <div className="space-y-4">
      {/* Search + filters */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <MagnifyingGlass
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${activePillar === "all" ? "all partners" : PILLAR_LABELS[activePillar].toLowerCase()} — name, country, specialty…`}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950/80 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as (typeof REGIONS)[number])}
              className="rounded-lg border border-slate-700/80 bg-slate-950/80 px-3 py-2 text-sm text-slate-200 focus:border-emerald-500/60 focus:outline-none"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition ${
                showFilters || cert !== "All Certifications"
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                  : "border-slate-700/80 bg-slate-950/80 text-slate-300 hover:border-slate-600"
              }`}
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "featured" | "rating" | "established")}
              className="rounded-lg border border-slate-700/80 bg-slate-950/80 px-3 py-2 text-sm text-slate-200 focus:border-emerald-500/60 focus:outline-none"
              aria-label="Sort"
            >
              <option value="featured">Featured</option>
              <option value="rating">Top rated</option>
              <option value="established">Newest</option>
            </select>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Certification</span>
                {CERTS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCert(c)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      cert === c
                        ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-400"
                        : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results meta */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500">
        <span>
          <span className="font-semibold text-slate-300">{filtered.length}</span> partners found
        </span>
        <span className="hidden sm:inline">
          {bookmarks.length > 0 ? `${bookmarks.length} bookmarked` : "Tap the star to bookmark partners"}
        </span>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <PartnerCard
              key={p.id}
              p={p}
              index={i}
              bookmarked={bookmarks.includes(p.id)}
              onToggle={() => onToggleBookmark(p.id)}
              onOpen={() => setSelected(p)}
            />
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 py-16 text-center">
          <MagnifyingGlass size={28} className="mb-3 text-slate-600" />
          <p className="text-sm font-medium text-slate-300">No partners match your filters</p>
          <p className="mt-1 text-xs text-slate-500">
            Try clearing the search or widening the region filter.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setRegion("All Regions");
              setCert("All Certifications");
            }}
            className="mt-4 rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
          >
            Clear all filters
          </button>
        </div>
      )}

      <PartnerDrawer
        p={selected}
        onClose={() => setSelected(null)}
        bookmarked={selectedBookmarked}
        onToggle={() => selected && onToggleBookmark(selected.id)}
      />
    </div>
  );
}