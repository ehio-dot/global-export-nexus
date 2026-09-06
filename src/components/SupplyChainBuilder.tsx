import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowsLeftRight,
  Check,
  CircleNotch,
  ClockClockwise,
  Factory,
  Package,
  PiggyBank,
  Plus,
  Trash,
  Truck,
  Warehouse,
  X,
} from "@phosphor-icons/react";
import type { Pillar, SupplyChainNode } from "../types";
import { partners } from "../data/mockData";
import { PILLAR_LABELS } from "../constants";

const STAGE_ORDER: Pillar[] = [
  "raw-materials",
  "processing",
  "packaging",
  "logistics",
  "freight",
  "buyers",
];

const STAGE_META: Record<Pillar, { label: string; icon: React.ReactNode; hint: string }> = {
  "raw-materials": {
    label: PILLAR_LABELS["raw-materials"],
    icon: <Package size={14} />,
    hint: "Source the commodity or input",
  },
  processing: {
    label: PILLAR_LABELS["processing"],
    icon: <Factory size={14} />,
    hint: "Mill, refine or process",
  },
  packaging: {
    label: PILLAR_LABELS["packaging"],
    icon: <Package size={14} />,
    hint: "Pack for export",
  },
  logistics: {
    label: PILLAR_LABELS["logistics"],
    icon: <Warehouse size={14} />,
    hint: "Store, cool & haul",
  },
  freight: {
    label: PILLAR_LABELS["freight"],
    icon: <Truck size={14} />,
    hint: "Move it overseas",
  },
  buyers: {
    label: PILLAR_LABELS["buyers"],
    icon: <ArrowsLeftRight size={14} />,
    hint: "Deliver to the market",
  },
  financiers: {
    label: PILLAR_LABELS["financiers"],
    icon: <PiggyBank size={14} />,
    hint: "Fund the shipment",
  },
};

const TOTAL_CAP = 800_000;

function StageBlock({
  stage,
  node,
  onSelect,
  onRemove,
  isLoading,
}: {
  stage: Pillar;
  node: SupplyChainNode | undefined;
  onSelect: () => void;
  onRemove: () => void;
  isLoading: boolean;
}) {
  const meta = STAGE_META[stage];
  const filled = Boolean(node);
  return (
    <div className="relative rounded-xl border border-slate-800 bg-slate-900/60 p-3 transition hover:border-slate-700">
      <div className="mb-2 flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${
            filled ? "text-emerald-400" : "text-slate-500"
          }`}
        >
          <span className={filled ? "text-emerald-500" : ""}>{meta.icon}</span>
          {meta.label}
        </span>
        {node && (
          <button
            aria-label={`Remove ${node.partnerName}`}
            onClick={onRemove}
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-800 hover:text-rose-400"
          >
            <Trash size={13} />
          </button>
        )}
      </div>

      {filled && node ? (
        <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[13px] font-semibold leading-tight text-slate-100">{node.partnerName}</div>
              <div className="mt-0.5 text-[11px] text-slate-400">
                {node.country} · {node.partnerId}
              </div>
            </div>
            {isLoading ? (
              <CircleNotch size={14} className="animate-spin text-emerald-400" />
            ) : (
              <Check size={14} weight="bold" className="mt-0.5 shrink-0 text-emerald-400" />
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <ClockClockwise size={11} /> {node.leadDays}d lead
            </span>
            <span className="font-semibold text-emerald-400">${node.cost.toLocaleString()}</span>
          </div>
        </div>
      ) : (
        <button
          onClick={onSelect}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-700 px-3 py-4 text-xs text-slate-400 transition hover:border-emerald-500/50 hover:text-emerald-400"
        >
          <Plus size={13} weight="bold" /> Add partner
        </button>
      )}

      <span className="mt-2 block text-[10px] text-slate-600">{meta.hint}</span>
    </div>
  );
}

function PickerDrawer({
  stage,
  onClose,
  onPick,
}: {
  stage: Pillar;
  onClose: () => void;
  onPick: (partnerId: string) => void;
}) {
  const candidates = useMemo(
    () => partners.filter((p) => p.pillar === stage || p.pillar === "freight" || p.pillar === "logistics"),
    [stage],
  );
  const [q, setQ] = useState("");

  const list = candidates.filter(
    (p) =>
      !q ||
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.country.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[80vh] w-full max-w-lg overflow-hidden rounded-t-2xl border border-slate-800 bg-slate-950 shadow-2xl"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <span className="text-sm font-semibold text-slate-100">
            Choose · {STAGE_META[stage].label}
          </span>
          <button
            aria-label="Close picker"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={17} />
          </button>
        </div>
        <div className="border-b border-slate-800 px-4 py-2">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search partners…"
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/60 focus:outline-none"
          />
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-3">
          {list.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">No partners found.</p>
          )}
          {list.map((p) => (
            <button
              key={p.id}
              onClick={() => onPick(p.id)}
              className="mb-1.5 flex w-full items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-left transition hover:border-emerald-500/40 hover:bg-slate-900"
            >
              <div>
                <div className="text-[13px] font-semibold text-slate-100">{p.name}</div>
                <div className="text-[11px] text-slate-400">
                  {p.country} · {p.priceBand}
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                {PILLAR_LABELS[p.pillar]}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface SupplyChainBuilderProps {
  disabled: boolean;
}

export default function SupplyChainBuilder({ disabled }: SupplyChainBuilderProps) {
  const [nodes, setNodes] = useState<Partial<Record<Pillar, SupplyChainNode>>>({});
  const [pickerStage, setPickerStage] = useState<Pillar | null>(null);
  const [addingFor, setAddingFor] = useState<Pillar | null>(null);

  const total = useMemo(
    () => Object.values(nodes).reduce((sum, n) => (n ? sum + n.cost : sum), 0),
    [nodes],
  );
  const leadDays = useMemo(
    () => Object.values(nodes).reduce((sum, n) => (n ? sum + n.leadDays : sum), 0),
    [nodes],
  );
  const filledCount = Object.values(nodes).filter(Boolean).length;

  const handlePick = (partnerId: string) => {
    if (!pickerStage) return;
    const p = partners.find((x) => x.id === partnerId);
    setAddingFor(pickerStage);
    // Simulate a short credential-check delay for realistic UX
    window.setTimeout(() => {
      if (p) {
        const cost =
          p.pillar === "buyers"
            ? Math.round(Number(p.exportVolume.replace(/[^0-9]/g, "")) / 40)
            : Math.round(2000 + Math.random() * 14000);
        setNodes((prev) => ({
          ...prev,
          [pickerStage]: {
            id: partnerId,
            pillar: pickerStage,
            partnerId,
            partnerName: p.name,
            country: p.country,
            cost,
            leadDays: Math.max(2, Math.round(cost / 900)),
          },
        }));
      }
      setAddingFor(null);
      setPickerStage(null);
    }, 650);
  };

  const stageVisual = Array.from({ length: 6 }, (_, i) => {
    const stage = STAGE_ORDER[i];
    return { stage, node: nodes[stage] };
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="text-[11px] uppercase tracking-wider text-slate-500">Stages filled</div>
          <div className="mt-1 text-xl font-bold text-slate-100">{filledCount} / 6</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
              animate={{ width: `${(filledCount / 6) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="text-[11px] uppercase tracking-wider text-slate-500">Est. landed cost</div>
          <div className="mt-1 text-xl font-bold text-emerald-400">${total.toLocaleString()}</div>
          <div className="mt-1 text-[11px] text-slate-500">Budget {TOTAL_CAP.toLocaleString()}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="text-[11px] uppercase tracking-wider text-slate-500">Total lead time</div>
          <div className="mt-1 flex items-center gap-2 text-xl font-bold text-slate-100">
            <ClockClockwise size={18} className="text-sky-400" /> {leadDays} days
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Door-to-door estimate</div>
        </div>
      </div>

      {/* Stage chain */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stageVisual.map(({ stage, node }) => (
          <StageBlock
            key={stage}
            stage={stage}
            node={node}
            isLoading={addingFor === stage}
            onSelect={() => setPickerStage(stage)}
            onRemove={() => setNodes((prev) => ({ ...prev, [stage]: undefined }))}
          />
        ))}
      </div>

      {filledCount < 6 && !disabled && (
        <button
          onClick={() => setPickerStage(STAGE_ORDER[filledCount] ?? "raw-materials")}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 py-3 text-sm text-slate-400 transition hover:border-emerald-500/50 hover:text-emerald-400"
        >
          <Plus size={15} weight="bold" /> Complete next stage ({STAGE_ORDER[filledCount]?.replace("-", " ")})
        </button>
      )}

      {filledCount === 6 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-center"
        >
          <PiggyBank size={22} className="text-emerald-400" />
          <p className="text-sm font-semibold text-emerald-300">Supply chain complete — ready to cost out.</p>
          <p className="text-xs text-slate-400">
            Open the Financing Calculator to project FOB-to-delivered costs, finance and duty.
          </p>
        </motion.div>
      )}

      {disabled && (
        <p className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-xs text-amber-400">
          Data persistence is offline — builds are stored in this session only.
        </p>
      )}

      <AnimatePresence>
        {pickerStage && (
          <PickerDrawer
            stage={pickerStage}
            onClose={() => setPickerStage(null)}
            onPick={handlePick}
          />
        )}
      </AnimatePresence>
    </div>
  );
}