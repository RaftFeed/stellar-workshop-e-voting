import { useState } from "react";
import type { FormEvent } from "react";
import { Plus, ToggleLeft, ToggleRight, Settings, RefreshCw, AlertTriangle, CheckCircle, Image } from "lucide-react";
import type { Candidate, ElectionStats } from "../types";
import { TableSkeleton } from "../components/LoadingSkeleton";

interface AdminProps {
  candidates: Candidate[];
  stats: ElectionStats | null;
  isLoading: boolean;
  onAddCandidate: (name: string, vision: string, avatarUrl?: string) => Promise<boolean>;
  onToggleStatus: () => Promise<void>;
  onResetElection: () => void;
  mockMode: boolean;
}

export default function Admin({
  candidates,
  stats,
  isLoading,
  onAddCandidate,
  onToggleStatus,
  onResetElection,
  mockMode
}: AdminProps) {
  const [candName, setCandName] = useState("");
  const [candVision, setCandVision] = useState("");
  const [candAvatar, setCandAvatar] = useState("");
  
  const [isAdding, setIsAdding] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);

    if (!candName.trim()) {
      setFormError("Candidate name is required.");
      return;
    }
    if (!candVision.trim()) {
      setFormError("Vision statement is required.");
      return;
    }

    setIsAdding(true);
    try {
      const success = await onAddCandidate(candName, candVision, candAvatar || undefined);
      if (success) {
        setCandName("");
        setCandVision("");
        setCandAvatar("");
        setFormSuccess(true);
        setTimeout(() => setFormSuccess(false), 3000);
      } else {
        setFormError("Smart contract execution failed.");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to register candidate.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleState = async () => {
    setIsToggling(true);
    try {
      await onToggleStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white flex items-center gap-2">
          <Settings className="w-7 h-7 text-blue-500" />
          Admin Governance Panel
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Execute smart contract operations, register representatives, and configure status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Forms & Toggles (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Add Candidate Form */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div>
              <h3 className="font-display font-bold text-base text-white">Register New Candidate</h3>
              <span className="text-[10px] text-slate-500 block">Appends candidate data onto contract storage</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form Notifications */}
              {formError && (
                <div className="p-3.5 bg-red-950/20 border border-red-900/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="p-3.5 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Candidate registered successfully on-chain!</span>
                </div>
              )}

              {/* Input: Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">Candidate Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={candName}
                  onChange={(e) => setCandName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
                />
              </div>

              {/* Input: Vision */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">Vision & Mission</label>
                <textarea
                  placeholder="Summarize candidate objectives..."
                  value={candVision}
                  onChange={(e) => setCandVision(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors resize-none"
                />
              </div>

              {/* Input: Avatar */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block flex items-center gap-1">
                  <Image className="w-3.5 h-3.5" />
                  Photo URL <span className="text-[10px] text-slate-600 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={candAvatar}
                  onChange={(e) => setCandAvatar(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAdding}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/10 disabled:opacity-50"
              >
                {isAdding ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering Candidate...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Register Candidate
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Global Controller (Right Column) */}
        <div className="space-y-6">
          
          {/* Status Panel Toggle */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div>
              <h3 className="font-display font-bold text-base text-white">Election Switchboard</h3>
              <span className="text-[10px] text-slate-500 block font-mono">Status variable modification</span>
            </div>

            <div className="p-4 bg-slate-900/35 border border-slate-900 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-300 block">Open Enrollment</span>
                <span className="text-[10px] text-slate-500 block">Controls voter write actions</span>
              </div>
              <button
                onClick={handleToggleState}
                disabled={isToggling}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
              >
                {stats?.electionStatus === "Open" ? (
                  <ToggleRight className="w-12 h-8 text-emerald-500" />
                ) : (
                  <ToggleLeft className="w-12 h-8 text-slate-600" />
                )}
              </button>
            </div>

            <div className="p-4 bg-yellow-500/5 border border-yellow-500/15 rounded-xl flex gap-3 text-left">
              <AlertTriangle className="w-5 h-5 text-yellow-600/80 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-normal">
                Closing the election immediately disables candidate voting booth access. Results will freeze across all client instances.
              </p>
            </div>
          </div>

          {/* Reset / Settings (Visible in Mock Mode) */}
          {mockMode && (
            <div className="glass-panel p-6 rounded-2xl space-y-4 border border-red-950/20">
              <div>
                <h3 className="font-display font-bold text-base text-red-400">Mock Sandbox Settings</h3>
                <span className="text-[10px] text-slate-500 block">Reset simulated state back to default values</span>
              </div>
              <button
                onClick={onResetElection}
                className="w-full py-2.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-500/30 text-red-400 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Mock Database
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Candidate List Management */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div>
          <h3 className="font-display font-bold text-base text-white">Registered Candidate Ledger</h3>
          <span className="text-[10px] text-slate-500 block">Registry listing retrieved from contracts</span>
        </div>

        {isLoading ? (
          <TableSkeleton rows={3} />
        ) : candidates.length > 0 ? (
          <div className="border border-slate-900 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/40 border-b border-slate-900 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="p-4 w-24">ID</th>
                  <th className="p-4">Candidate Profile</th>
                  <th className="p-4">Vision Details</th>
                  <th className="p-4 text-right">Votes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs">
                {candidates.map((cand) => (
                  <tr key={cand.id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="p-4 font-mono text-slate-400">#{cand.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center text-slate-500 shrink-0">
                          {cand.avatarUrl ? (
                            <img src={cand.avatarUrl} alt={cand.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>👤</span>
                          )}
                        </div>
                        <span className="font-semibold text-white">{cand.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 max-w-sm truncate" title={cand.vision}>
                      {cand.vision}
                    </td>
                    <td className="p-4 text-right font-bold text-slate-200">{cand.voteCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-slate-850 rounded-xl space-y-2">
            <span className="text-xs text-slate-500 block">No candidates registered. Use the form above to add a candidate.</span>
          </div>
        )}
      </div>

    </div>
  );
}
