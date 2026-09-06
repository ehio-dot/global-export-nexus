import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarBlank, CheckCircle, PaperPlaneTilt, X } from "@phosphor-icons/react";
import type { Pillar, RfqDraft } from "../types";
import { PILLAR_LABELS } from "../constants";

interface RfqModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (draft: RfqDraft) => void;
  drafts: RfqDraft[];
}

const PILLAR_OPTIONS: Pillar[] = [
  "raw-materials",
  "processing",
  "packaging",
  "logistics",
  "freight",
  "buyers",
  "financiers",
];

export default function RfqModal({ open, onClose, onSave, drafts }: RfqModalProps) {
  const [pillar, setPillar] = useState<Pillar>("raw-materials");
  const [title, setTitle] = useState("");
  const [volume, setVolume] = useState("");
  const [specs, setSpecs] = useState("");
  const [targetCountry, setTargetCountry] = useState("");
  const [budget, setBudget] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const reset = () => {
    setPillar("raw-materials");
    setTitle("");
    setVolume("");
    setSpecs("");
    setTargetCountry("");
    setBudget("");
    setErrors([]);
  };

  const submit = () => {
    const errs: string[] = [];
    if (!title.trim()) errs.push("Title is required");
    if (!volume.trim()) errs.push("Volume is required");
    if (!targetCountry.trim()) errs.push("Target market is required");
    setErrors(errs);
    if (errs.length > 0) return;
    onSave({
      id: `draft-${Date.now()}`,
      pillar,
      title: title.trim(),
      volume: volume.trim(),
      specs: specs.trim(),
      targetCountry: targetCountry.trim(),
      budget: budget.trim(),
      createdAt: new Date().toISOString(),
    });
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-slate-800 bg-slate-950 shadow-2xl sm:rounded-2xl"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                <div>
                  <h2 className="text-base font-bold text-slate-50">Post a Request for Quote</h2>
                  <p className="text-xs text-slate-500">Broadcast your need across vetted export partners.</p>
                </div>
                <button
                  aria-label="Close RFQ form"
                  onClick={onClose}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PILLAR_OPTIONS.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPillar(p)}
                        className={`rounded-full border px-3 py-1 text-xs transition ${
                          pillar === p
                            ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-400"
                            : "border-slate-700 text-slate-400 hover:border-slate-500"
                        }`}
                      >
                        {PILLAR_LABELS[p]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Title / Requirement
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='e.g. "500 MT refined shea butter, food grade"'
                    className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/60 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Volume / Quantity
                    </label>
                    <input
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      placeholder='e.g. "10 MT"'
                      className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/60 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Target market
                    </label>
                    <input
                      value={targetCountry}
                      onChange={(e) => setTargetCountry(e.target.value)}
                      placeholder='e.g. "Germany"'
                      className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/60 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Specifications (optional)
                  </label>
                  <textarea
                    value={specs}
                    onChange={(e) => setSpecs(e.target.value)}
                    rows={3}
                    placeholder="Certifications, grade, packaging, Incoterms…"
                    className="w-full resize-none rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Budget / target price (optional)
                  </label>
                  <input
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder='e.g. "FOB $1,850 / MT"'
                    className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500/60 focus:outline-none"
                  />
                </div>

                {errors.length > 0 && (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                    {errors.map((e) => (
                      <div key={e}>• {e}</div>
                    ))}
                  </div>
                )}

                {drafts.length > 0 && (
                  <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <CalendarBlank size={13} className="text-emerald-500" /> Your drafts this session
                    </div>
                    <div className="space-y-1.5">
                      {drafts.map((d) => (
                        <div key={d.id} className="flex items-center justify-between text-xs">
                          <span className="truncate text-slate-300">{d.title}</span>
                          <span className="ml-2 shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                            {d.volume}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-800 p-4">
                <button
                  onClick={submit}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  <PaperPlaneTilt size={16} weight="fill" /> Publish RFQ
                  <CheckCircle size={16} className="ml-0.5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}