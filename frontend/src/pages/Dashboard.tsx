import { Users, FileText, CheckCircle2, AlertCircle, BarChart3, HelpCircle, ArrowRight } from "lucide-react";
import type { Candidate, ElectionStats } from "../types";
import { StatsSkeleton } from "../components/LoadingSkeleton";

interface DashboardProps {
  stats: ElectionStats | null;
  candidates: Candidate[];
  isLoading: boolean;
  onNavigateToBooth: () => void;
  onNavigateToResults: () => void;
  walletConnected: boolean;
  onConnectWallet: () => void;
}

export default function Dashboard({
  stats,
  candidates,
  isLoading,
  onNavigateToBooth,
  onNavigateToResults,
  walletConnected,
  onConnectWallet
}: DashboardProps) {
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-1">Fetching live election data from Soroban ledger...</p>
        </div>
        <StatsSkeleton />
        <div className="h-64 bg-slate-900/20 border border-slate-800/80 rounded-2xl animate-pulse" />
      </div>
    );
  }

  // Sort candidates by votes for leaderboard
  const leaderboard = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
  const totalVotes = stats?.totalVotes || 1; // Avoid divide by zero

  return (
    <div className="space-y-8">
      {/* Header Title */}
      <div>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white">Dashboard Overview</h1>
        <p className="text-xs text-slate-400 mt-1">Real-time status of the Student Council Representative Elections.</p>
      </div>

      {/* Connection Callout (If wallet not connected) */}
      {!walletConnected && (
        <div className="p-5 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className="p-2 bg-blue-600/20 rounded-xl text-blue-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Freighter Wallet Disconnected</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Connect your wallet to authenticate on the Stellar network and cast your secure ballot.
              </p>
            </div>
          </div>
          <button
            onClick={onConnectWallet}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-600/10 shrink-0 text-center"
          >
            Connect Wallet
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card 1: Total Candidates */}
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 relative group">
          <div className="p-3 bg-blue-600/10 border border-blue-500/15 text-blue-500 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Total Candidates</span>
            <span className="text-2xl font-display font-extrabold text-white mt-0.5">
              {stats?.totalCandidates || 0}
            </span>
          </div>
        </div>

        {/* Card 2: Total Votes */}
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 relative group">
          <div className="p-3 bg-indigo-600/10 border border-indigo-500/15 text-indigo-400 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Total Votes Cast</span>
            <span className="text-2xl font-display font-extrabold text-white mt-0.5">
              {stats?.totalVotes || 0}
            </span>
          </div>
        </div>

        {/* Card 3: Election Status */}
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 relative group">
          {stats?.electionStatus === "Open" ? (
            <>
              <div className="p-3 bg-emerald-600/10 border border-emerald-500/15 text-emerald-400 rounded-xl">
                <CheckCircle2 className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Election Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/20 border border-emerald-900/30 px-2.5 py-1.5 rounded-xl mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Voting Active
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 bg-red-600/10 border border-red-500/15 text-red-400 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Election Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-widest bg-red-950/20 border border-red-900/30 px-2.5 py-1.5 rounded-xl mt-1.5">
                  Closed
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Grid: Leaderboard & Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Live Leaderboard */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-900 pb-4">
            <div>
              <h3 className="font-display font-bold text-base text-white">Live Leaderboard Standings</h3>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Sorted by total verified votes</span>
            </div>
            <button
              onClick={onNavigateToResults}
              className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 cursor-pointer"
            >
              Analytics
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {leaderboard.length > 0 ? (
              leaderboard.map((cand, index) => {
                const percentage = totalVotes > 0 ? Math.round((cand.voteCount / stats!.totalVotes) * 100) : 0;
                return (
                  <div key={cand.id} className="space-y-2 p-3 bg-slate-900/25 border border-slate-900 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-mono font-bold w-6 h-6 rounded-lg border flex items-center justify-center ${
                          index === 0 
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" 
                            : "bg-slate-900 text-slate-500 border-slate-800"
                        }`}>
                          {index + 1}
                        </span>
                        <span className="text-sm font-semibold text-white">{cand.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-300">{cand.voteCount} votes</span>
                        <span className="text-[10px] text-slate-500 block">{percentage}%</span>
                      </div>
                    </div>
                    
                    {/* Animated Progress Bar */}
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-900">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          index === 0 ? "bg-gradient-to-r from-blue-600 to-blue-400" : "bg-slate-800"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl space-y-2">
                <span className="text-xs text-slate-500 block">No candidates registered in contract.</span>
              </div>
            )}
          </div>
        </div>

        {/* Info / CTA card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="p-3 bg-blue-600/10 border border-blue-500/10 rounded-xl text-blue-500 w-fit">
              <BarChart3 className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-base text-white">Cast Your Ballot Now</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose the candidate that represents your vision. The ballot is entirely automated, and your digital signature verifies authenticity.
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            <button
              onClick={onNavigateToBooth}
              disabled={stats?.electionStatus === "Closed"}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/10 cursor-pointer disabled:opacity-50"
            >
              Enter Voting Booth
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="text-[10px] text-slate-500 leading-normal text-center">
              * Freighter Wallet browser extension is required to sign real live transactions.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
