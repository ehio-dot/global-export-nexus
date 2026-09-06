import { Moon, Sun } from "@phosphor-icons/react";
import type { Pillar } from "../types";
import { BRAND_NAME, PILLAR_LABELS } from "../constants";

export const NAV_PILLARS: { key: Pillar | "all"; label: string }[] = [
  { key: "all", label: "All Partners" },
  { key: "raw-materials", label: PILLAR_LABELS["raw-materials"] },
  { key: "processing", label: PILLAR_LABELS["processing"] },
  { key: "packaging", label: PILLAR_LABELS["packaging"] },
  { key: "logistics", label: PILLAR_LABELS["logistics"] },
  { key: "freight", label: PILLAR_LABELS["freight"] },
  { key: "buyers", label: PILLAR_LABELS["buyers"] },
  { key: "financiers", label: PILLAR_LABELS["financiers"] },
];

interface HeaderProps {
  activePillar: Pillar | "all";
  onPillarChange: (p: Pillar | "all") => void;
  dark: boolean;
  onToggleDark: () => void;
  scrollTo: (id: string) => void;
}

export default function Header({ activePillar, onPillarChange, dark, onToggleDark, scrollTo }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button
          onClick={() => scrollTo("top")}
          className="flex items-center gap-2.5 text-left"
          aria-label={`${BRAND_NAME} home`}
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/20">
            EN
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-bold tracking-tight text-slate-50">{BRAND_NAME}</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-500">
              Global Trade Hub
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_PILLARS.map((item) => (
            <button
              key={item.key}
              onClick={() => onPillarChange(item.key)}
              className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${
                activePillar === item.key
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollTo("rfq")}
            className="hidden rounded-lg bg-emerald-500 px-3.5 py-2 text-[13px] font-semibold text-slate-950 transition hover:bg-emerald-400 sm:block"
          >
            Post an RFQ
          </button>
          <button
            aria-label="Toggle dark mode"
            onClick={onToggleDark}
            className="rounded-lg border border-slate-700/80 p-2 text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile pillar scroller */}
      <div className="flex gap-2 overflow-x-auto border-t border-slate-800/60 px-4 py-2 lg:hidden">
        {NAV_PILLARS.map((item) => (
          <button
            key={item.key}
            onClick={() => onPillarChange(item.key)}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition ${
              activePillar === item.key
                ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                : "border-slate-700/80 text-slate-400"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}