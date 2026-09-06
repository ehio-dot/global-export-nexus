import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  GlobeHemisphereWest,
  Handshake,
  SealCheck,
  Sparkle,
  SquaresFour,
  TreeStructure,
} from "@phosphor-icons/react";
import type { Pillar, RfqDraft } from "./types";
import { partners, rfqs } from "./data/mockData";
import { BRAND_NAME, CONTACT_EMAIL } from "./constants";
import { usePersistedState } from "./hooks/usePersistedState";
import Header, { NAV_PILLARS } from "./components/Header";
import DirectoryView from "./components/DirectoryView";
import SupplyChainBuilder from "./components/SupplyChainBuilder";
import RfqModal from "./components/RfqModal";
import FinancingCalculator from "./components/FinancingCalculator";

const PLATFORM_STATS = [
  { label: "Vetted partners", value: "180+" },
  { label: "Origins covered", value: "42" },
  { label: "Markets served", value: "60+" },
  { label: "Avg. chain build", value: "11 days" },
];

export default function App() {
  const [dark, setDark] = usePersistedState<boolean>("export-nexus-dark", true);
  const [activePillar, setActivePillar] = useState<Pillar | "all">("all");
  const [bookmarks, setBookmarks] = usePersistedState<string[]>("export-nexus-bookmarks", []);
  const [rfqOpen, setRfqOpen] = useState(false);
  const [drafts, setDrafts] = usePersistedState<RfqDraft[]>("export-nexus-drafts", []);

  const toggleBookmark = useCallback(
    (id: string) => {
      setBookmarks((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
    },
    [setBookmarks],
  );

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const saveDraft = useCallback(
    (d: RfqDraft) => setDrafts((prev) => [d, ...prev].slice(0, 8)),
    [setDrafts],
  );

  const toggleDark = useCallback(() => setDark((d) => !d), [setDark]);

  const topPartners = partners.filter((p) => p.verified).slice(0, 6);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 ${dark ? "" : "dark"}`}>
      <Header
        activePillar={activePillar}
        onPillarChange={(p) => {
          setActivePillar(p);
          scrollTo("directory");
        }}
        dark={dark}
        onToggleDark={toggleDark}
        scrollTo={scrollTo}
      />

      <main className="mx-auto max-w-7xl space-y-14 px-4 pb-20 pt-8 sm:px-6">
        {/* HERO */}
        <section id="top" className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/60 px-6 py-14 sm:px-10 sm:py-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Sparkle size={13} weight="fill" /> The export supply chain, end to end
            </span>
            <h1 className="mt-4 max-w-2xl text-3xl font-black leading-tight tracking-tight text-slate-50 sm:text-5xl">
              From farm gate to foreign market —{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                one connected chain
              </span>
              .
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Find verified raw material suppliers, processing plants, packaging, logistics, freight
              forwarders, international buyers and financiers — then assemble your entire export
              pipeline in minutes.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollTo("directory")}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Explore the directory <ArrowRight size={15} weight="bold" />
              </button>
              <button
                onClick={() => scrollTo("builder")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
              >
                <TreeStructure size={15} /> Build a chain
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PLATFORM_STATS.map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-3">
                  <div className="text-xl font-black text-emerald-400">{s.value}</div>
                  <div className="text-[11px] text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* HOW IT WORKS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <SquaresFour size={18} className="text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-50">How Export Nexus works</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                icon: <GlobeHemisphereWest size={20} className="text-emerald-400" />,
                title: "1 · Find your partners",
                body: "Browse verified suppliers, plants, forwarders, buyers and financiers across 42 origins.",
              },
              {
                icon: <TreeStructure size={20} className="text-sky-400" />,
                title: "2 · Assemble the chain",
                body: "Drag together raw materials → processing → packaging → logistics → freight → buyer.",
              },
              {
                icon: <Handshake size={20} className="text-amber-400" />,
                title: "3 · Cost, finance & close",
                body: "Model landed costs, secure trade finance, publish RFQs and negotiate direct.",
              },
            ].map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
              >
                {s.icon}
                <h3 className="mt-3 text-sm font-bold text-slate-100">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* DIRECTORY */}
        <section id="directory" className="scroll-mt-24 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-50">Partner directory</h2>
              <p className="text-xs text-slate-500">
                {NAV_PILLARS.length - 1} categories · every partner credential-checked
              </p>
            </div>
          </div>
          <DirectoryView
            activePillar={activePillar}
            bookmarks={bookmarks}
            onToggleBookmark={toggleBookmark}
          />
        </section>

        {/* TOP VERIFIED */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <SealCheck size={18} className="text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-50">Top verified partners this week</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topPartners.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
                className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-sm font-black text-emerald-400">
                  {p.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-100">{p.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {p.city}, {p.country} · {p.specialties[0]}
                  </div>
                  <span className="mt-1.5 inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    {p.rating.toFixed(1)} ★ rated
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CHAIN BUILDER */}
        <section id="builder" className="scroll-mt-24 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-50">Supply chain builder</h2>
            <p className="text-xs text-slate-500">
              Select one partner per stage to assemble a complete doorstep-to-market chain.
            </p>
          </div>
          <SupplyChainBuilder disabled={false} />
        </section>

        {/* OPEN RFQS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-50">Open RFQs & tenders</h2>
              <p className="text-xs text-slate-500">Live buyer demand on the platform</p>
            </div>
            <button
              onClick={() => setRfqOpen(true)}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Post your own
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rfqs.slice(0, 6).map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-emerald-500/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                    {r.pillar.replace("-", " ")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Open
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-semibold leading-snug text-slate-100">{r.title}</h3>
                <p className="mt-1 text-[11px] text-slate-500">
                  {r.company} · {r.country} · {r.volume}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {r.specs.slice(0, 2).map((s) => (
                    <span key={s} className="rounded-md bg-slate-800/80 px-1.5 py-0.5 text-[10px] text-slate-400">
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FINANCING */}
        <section id="finance" className="scroll-mt-24 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-50">Financing calculator</h2>
            <p className="text-xs text-slate-500">
              Project landed cost, freight, duty and financed margin with the featured lenders.
            </p>
          </div>
          <FinancingCalculator />
        </section>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
          <div>
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 text-xs font-black text-slate-950">
                EN
              </span>
              <span className="text-sm font-bold text-slate-100">{BRAND_NAME}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Global trade & export supply chain hub. © {new Date().getFullYear()} · Demo dataset — contact
              {CONTACT_EMAIL} to list your company.
            </p>
          </div>
        </div>
      </footer>

      <RfqModal open={rfqOpen} onClose={() => setRfqOpen(false)} onSave={saveDraft} drafts={drafts} />
    </div>
  );
}