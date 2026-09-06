import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Anchor,
  Calculator,
  ClockClockwise,
  CurrencyDollar,
  PiggyBank,
  ShieldCheck,
  TrendUp,
} from "@phosphor-icons/react";
import type { CostLine, RouteQuote, ShipMode } from "../types";
import { BRAND_NAME } from "../constants";

const MODES: { key: ShipMode; label: string; days: number; cost: number }[] = [
  { key: "ocean", label: "Ocean FCL", days: 28, cost: 1850 },
  { key: "oceanLcl", label: "Ocean LCL", days: 32, cost: 2400 },
  { key: "air", label: "Air Freight", days: 8, cost: 9200 },
  { key: "rail", label: "Rail / Overland", days: 21, cost: 2900 },
];

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function FinancingCalculator() {
  const [productValue, setProductValue] = useState(50_000);
  const [mode, setMode] = useState<ShipMode>("ocean");
  const [insurancePct, setInsurancePct] = useState(1.2);
  const [dutyPct, setDutyPct] = useState(5);
  const [fobSet, setFobSet] = useState(46_000);
  const [ratePct, setRatePct] = useState(6.5);
  const [termMonths, setTermMonths] = useState(6);

  const quote: RouteQuote = useMemo(() => {
    const m = MODES.find((x) => x.key === mode) ?? MODES[0];
    const insurance = Math.round((fobSet * insurancePct) / 100);
    const freight = m.cost;
    const duty = Math.round(((fobSet + freight) * dutyPct) / 100);
    return {
      origin: "FOB origin",
      destination: "CIF + duties",
      mode,
      freightUsd: freight,
      transitDays: m.days,
      insurancePct,
      dutyPct,
      fob: fobSet,
      productValue,
      incubatorFee: 950,
    };
  }, [mode, insurancePct, dutyPct, fobSet, productValue]);

  const lines: CostLine[] = useMemo(() => {
    const insurance = Math.round((quote.fob * quote.insurancePct) / 100);
    const duty = Math.round(((quote.fob + quote.freightUsd) * quote.dutyPct) / 100);
    return [
      { kind: "product", label: "Product cost (FOB)", amount: quote.fob, note: "FOB origin" },
      { kind: "freight", label: "Freight & forwarding", amount: quote.freightUsd, note: "All-in per route" },
      { kind: "insurance", label: "Cargo insurance", amount: insurance, note: `${quote.insurancePct}% of FOB` },
      { kind: "duty", label: "Import duty & taxes", amount: duty, note: `${quote.dutyPct}% of CIF` },
      { kind: "finance", label: "Finance (interest)", amount: Math.round(quote.fob * (ratePct / 100) * (termMonths / 12)), note: `${ratePct}% over ${termMonths} months` },
    ];
  }, [quote, ratePct, termMonths]);

  const totalLanded = useMemo(() => lines.reduce((s, l) => s + l.amount, 0), [lines]);
  const financed = Math.round(quote.fob * 0.9);
  const margin = useMemo(() => {
    const sellPrice = totalLanded * 1.22;
    return sellPrice - totalLanded - financed * (ratePct / 100) * (termMonths / 12);
  }, [totalLanded, financed, ratePct, termMonths]);

  const kindColor: Record<CostLine["kind"], string> = {
    product: "text-emerald-400",
    freight: "text-sky-400",
    insurance: "text-amber-400",
    duty: "text-rose-400",
    finance: "text-violet-400",
  };

  const kindBar: Record<CostLine["kind"], string> = {
    product: "bg-emerald-500",
    freight: "bg-sky-500",
    insurance: "bg-amber-500",
    duty: "bg-rose-500",
    finance: "bg-violet-500",
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Calculator size={16} className="text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100">Cost & Finance Model</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Product value · <span className="text-emerald-400">{fmt(productValue)}</span>
            </label>
            <input
              type="range"
              min={5000}
              max={500000}
              step={5000}
              value={productValue}
              onChange={(e) => setProductValue(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>$5k</span>
              <span>$500k</span>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              FOB value · <span className="text-emerald-400">{fmt(fobSet)}</span>
            </label>
            <input
              type="range"
              min={4000}
              max={400000}
              step={2000}
              value={fobSet}
              onChange={(e) => setFobSet(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>$4k</span>
              <span>$400k</span>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">Shipping mode</label>
            <div className="grid grid-cols-4 gap-1">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className={`rounded-md border px-1 py-1.5 text-[10px] font-semibold transition ${
                    mode === m.key
                      ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-400"
                      : "border-slate-700 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Insurance · <span className="text-emerald-400">{insurancePct}%</span>
            </label>
            <input
              type="range"
              min={0.5}
              max={5}
              step={0.1}
              value={insurancePct}
              onChange={(e) => setInsurancePct(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Import duty · <span className="text-emerald-400">{dutyPct}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={30}
              step={0.5}
              value={dutyPct}
              onChange={(e) => setDutyPct(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Finance rate · <span className="text-emerald-400">{ratePct}%</span> · {termMonths} mo
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={2}
                max={18}
                step={0.25}
                value={ratePct}
                onChange={(e) => setRatePct(Number(e.target.value))}
                className="flex-1 accent-emerald-500"
              />
              <input
                type="number"
                min={1}
                max={36}
                value={termMonths}
                onChange={(e) => setTermMonths(Math.max(1, Number(e.target.value)))}
                className="w-16 rounded-md border border-slate-700/80 bg-slate-950/80 px-2 py-1 text-xs text-slate-100 focus:border-emerald-500/60 focus:outline-none"
                aria-label="Term months"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Route summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500">
            <Anchor size={12} className="text-sky-400" /> Transit
          </div>
          <div className="mt-1 flex items-center gap-1 text-lg font-bold text-slate-100">
            <ClockClockwise size={15} className="text-sky-400" /> {quote.transitDays}d
          </div>
          <div className="text-[10px] text-slate-500">
            {MODES.find((m) => m.key === mode)?.label}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500">
            <CurrencyDollar size={12} className="text-emerald-400" /> Freight
          </div>
          <div className="mt-1 text-lg font-bold text-emerald-400">{fmt(quote.freightUsd)}</div>
          <div className="text-[10px] text-slate-500">All-in rate</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500">
            <PiggyBank size={12} className="text-violet-400" /> Finance advance
          </div>
          <div className="mt-1 text-lg font-bold text-slate-100">{fmt(financed)}</div>
          <div className="text-[10px] text-slate-500">90% of FOB</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500">
            <TrendUp size={12} className="text-amber-400" /> Est. margin
          </div>
          <div className="mt-1 text-lg font-bold text-amber-400">{fmt(margin)}</div>
          <div className="text-[10px] text-slate-500">At 22% markup</div>
        </div>
      </div>

      {/* Landed cost stack */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100">Landed cost breakdown</h3>
          <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-400">
            {fmt(totalLanded)}
          </span>
        </div>
        <div className="space-y-2">
          {lines.map((l) => (
            <div key={l.kind} className="flex items-center gap-3">
              <div className="w-36 shrink-0 text-xs text-slate-400 sm:w-44">{l.label}</div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  className={`h-full rounded-full ${kindBar[l.kind]}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(2, (l.amount / Math.max(totalLanded, 1)) * 100)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className={`w-20 shrink-0 text-right text-xs font-semibold ${kindColor[l.kind]}`}>
                {fmt(l.amount)}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck size={13} className="text-emerald-500" />
          Includes the {fmt(950)} {BRAND_NAME} trade-services fee. Indicative only — confirm with your forwarder.
        </p>
      </div>
    </div>
  );
}