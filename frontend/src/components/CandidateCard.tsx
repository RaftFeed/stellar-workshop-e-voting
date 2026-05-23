import { User, Award, Vote } from "lucide-react";
import type { Candidate } from "../types";

interface CandidateCardProps {
  candidate: Candidate;
  onVote: (candidate: Candidate) => void;
  hasVoted: boolean;
  electionClosed: boolean;
  walletConnected: boolean;
  rank?: number;
}

export default function CandidateCard({
  candidate,
  onVote,
  hasVoted,
  electionClosed,
  walletConnected,
  rank
}: CandidateCardProps) {
  // Rank medal/badge colors
  const getRankBadge = (r: number) => {
    switch (r) {
      case 1:
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case 2:
        return "bg-slate-300/10 text-slate-300 border-slate-300/30";
      case 3:
        return "bg-amber-600/10 text-amber-500 border-amber-600/30";
      default:
        return "bg-slate-800/55 text-slate-400 border-slate-700/50";
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-800/80 hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-900/5 group hover:-translate-y-1">
      {/* Visual Header */}
      <div className="relative h-24 bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900/60 p-4 flex items-end">
        {/* Top glow */}
        <div className="absolute top-0 right-0 w-24 h-12 bg-blue-500/5 blur-xl group-hover:bg-blue-500/10 transition-colors" />

        {/* Rank Overlay */}
        {rank && (
          <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${getRankBadge(rank)}`}>
            <Award className="w-3.5 h-3.5" />
            <span>Rank #{rank}</span>
          </div>
        )}

        {/* Avatar Container */}
        <div className="absolute -bottom-6 left-5">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-slate-800 group-hover:border-blue-500/50 transition-all overflow-hidden flex items-center justify-center text-slate-500">
            {candidate.avatarUrl ? (
              <img
                src={candidate.avatarUrl}
                alt={candidate.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = ""; // Clear to show default icon on load error
                }}
              />
            ) : (
              <User className="w-8 h-8" />
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-8 px-5 pb-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div>
            <h3 className="font-display font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
              {candidate.name}
            </h3>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500">
              Candidate ID: #{candidate.id}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed min-h-[48px] line-clamp-3">
            {candidate.vision}
          </p>
        </div>

        {/* Vote Stats and CTA */}
        <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] block uppercase text-slate-500 font-medium tracking-wide">Current Votes</span>
            <span className="text-xl font-display font-bold text-white group-hover:text-blue-400 transition-colors">
              {candidate.voteCount} <span className="text-xs font-normal text-slate-500">votes</span>
            </span>
          </div>

          <div>
            {!walletConnected ? (
              <span className="text-[10px] text-slate-500 italic block text-right max-w-[100px]">
                Connect wallet to vote
              </span>
            ) : electionClosed ? (
              <span className="text-xs font-bold text-red-500/80 bg-red-950/20 border border-red-900/30 px-3 py-1.5 rounded-xl uppercase tracking-wider block">
                Closed
              </span>
            ) : hasVoted ? (
              <span className="text-xs font-bold text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl uppercase tracking-wider block">
                Voted
              </span>
            ) : (
              <button
                onClick={() => onVote(candidate)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-medium text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/10"
              >
                <Vote className="w-3.5 h-3.5" />
                Vote
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
