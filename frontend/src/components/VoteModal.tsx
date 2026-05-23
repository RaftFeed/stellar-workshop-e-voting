import { AlertTriangle, CheckCircle2, ShieldCheck, X } from "lucide-react";
import type { Candidate } from "../types";

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  onConfirm: () => Promise<void>;
  isVoting: boolean;
}

export default function VoteModal({
  isOpen,
  onClose,
  candidate,
  onConfirm,
  isVoting
}: VoteModalProps) {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={isVoting ? undefined : onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-blue-950/20 to-slate-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <h3 className="font-display font-bold text-lg text-white">Confirm Voting Transaction</h3>
          </div>
          {!isVoting && (
            <button 
              onClick={onClose}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="text-center py-2">
            <span className="text-xs text-slate-500 uppercase tracking-widest block">You are voting for</span>
            <span className="text-2xl font-display font-extrabold text-white mt-1 block">{candidate.name}</span>
            <span className="text-xs font-mono text-slate-400 mt-0.5 inline-block px-2.5 py-1 bg-slate-950 rounded-lg border border-slate-800">
              Candidate ID: #{candidate.id}
            </span>
          </div>

          {/* Warning Banner */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3 text-left">
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className="text-xs font-bold text-yellow-500 uppercase tracking-wide">Immutable Action</span>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                Votes on the Stellar blockchain are permanent. You cannot change your vote, revoke it, or vote for another candidate after this transaction is submitted.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed text-center">
            By clicking "Confirm", you will sign a transaction calling the <code className="text-blue-400">vote()</code> function on the smart contract.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isVoting}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-900 rounded-xl transition-all cursor-pointer disabled:opacity-40"
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isVoting}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-medium text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/15 disabled:opacity-50"
          >
            {isVoting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing Transaction...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Confirm Vote
              </>
            )}
          </button>
        </div>
        
      </div>
    </div>
  );
}
