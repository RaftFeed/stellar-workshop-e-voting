import { BarChart3, Trophy, Award, Flame } from "lucide-react";
import type { Candidate, ElectionStats } from "../types";
import ResultChart from "../components/ResultChart";

interface ResultsProps {
  candidates: Candidate[];
  stats: ElectionStats | null;
  isLoading: boolean;
}

export default function Results({ candidates, stats, isLoading }: ResultsProps) {
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white">Live Election Results</h1>
          <p className="text-xs text-slate-500 mt-1">Retrieving results directly from Soroban contract ledger...</p>
        </div>
        <div className="h-80 bg-slate-900/20 border border-slate-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  // Sort candidates by votes (descending)
  const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
  
  // Calculate total votes and check for winner
  const totalVotes = stats?.totalVotes || 0;
  const hasVotesCast = totalVotes > 0;
  
  // Get top candidate
  const topCandidate = sortedCandidates[0];
  const isWinnerClear = hasVotesCast && topCandidate && (sortedCandidates.length === 1 || topCandidate.voteCount > sortedCandidates[1].voteCount);
  const isTie = hasVotesCast && topCandidate && sortedCandidates.length > 1 && topCandidate.voteCount === sortedCandidates[1].voteCount;

  // Percentage calculations
  const getPercentage = (count: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((count / totalVotes) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-blue-500" />
          Election Analytics & Results
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographically compiled results verifying on-chain integrity.
        </p>
      </div>

      {hasVotesCast ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div>
                <h3 className="font-display font-bold text-base text-white">Votes Distribution</h3>
                <span className="text-[10px] text-slate-500 block">Live bar chart representation of candidate votes</span>
              </div>
              <ResultChart candidates={candidates} />
            </div>

            {/* Candidate Standings Ranking Table */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div>
                <h3 className="font-display font-bold text-base text-white">Cryptographic Standings</h3>
                <span className="text-[10px] text-slate-500 block">Detailed verification statistics</span>
              </div>
              
              <div className="space-y-3">
                {sortedCandidates.map((cand, index) => {
                  const percentage = getPercentage(cand.voteCount);
                  const isFirst = index === 0;
                  return (
                    <div key={cand.id} className="p-4 bg-slate-900/30 border border-slate-900 rounded-2xl flex items-center justify-between gap-4">
                      {/* Name/Rank */}
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${
                          index === 0 ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                          index === 1 ? "bg-slate-300/10 text-slate-300 border-slate-300/20" :
                          index === 2 ? "bg-amber-600/10 text-amber-500 border-amber-600/20" :
                          "bg-slate-950 text-slate-500 border-slate-800"
                        }`}>
                          {index === 0 ? <Trophy className="w-4 h-4" /> : index + 1}
                        </span>
                        
                        <div>
                          <span className="text-sm font-semibold text-white block">{cand.name}</span>
                          <span className="text-[10px] text-slate-500 block">ID: #{cand.id}</span>
                        </div>
                      </div>

                      {/* Vote statistics progress */}
                      <div className="flex-1 max-w-xs hidden sm:block">
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isFirst ? "bg-blue-500" : "bg-slate-700"}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-white block">{cand.voteCount} votes</span>
                        <span className="text-[10px] text-slate-500 font-mono block">{percentage}% of total</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Highlight Cards / Sidebar */}
          <div className="space-y-6">
            {/* Winner Spotlight Card */}
            {isWinnerClear && (
              <div className="p-6 bg-gradient-to-br from-blue-900/30 to-slate-900 border border-blue-500/20 rounded-3xl relative overflow-hidden flex flex-col justify-between h-80 shadow-2xl shadow-blue-500/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full" />
                
                {/* Visual Header Icon */}
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400">
                    <Trophy className="w-6 h-6 animate-bounce" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full tracking-wider">
                    Leading Candidate
                  </span>
                </div>

                {/* Candidate details */}
                <div className="space-y-2 mt-4">
                  <span className="text-[10px] uppercase text-slate-400 tracking-widest block">Projected Representative</span>
                  <h3 className="font-display font-black text-2xl text-white tracking-tight">{topCandidate.name}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                    "{topCandidate.vision}"
                  </p>
                </div>

                {/* Stat summary */}
                <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center mt-4">
                  <div>
                    <span className="text-[9px] uppercase text-slate-500 tracking-wider block">Leading Votes</span>
                    <span className="text-xl font-display font-extrabold text-white">{topCandidate.voteCount} votes</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase text-slate-500 tracking-wider block">Margin</span>
                    <span className="text-sm font-bold text-blue-400">{getPercentage(topCandidate.voteCount)}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tie Spotlight Card */}
            {isTie && (
              <div className="p-6 bg-gradient-to-br from-yellow-900/20 to-slate-900 border border-yellow-500/25 rounded-3xl relative overflow-hidden flex flex-col justify-between h-80 shadow-2xl">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/25 rounded-2xl text-yellow-500">
                    <Flame className="w-6 h-6 animate-pulse" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-yellow-500 bg-yellow-500/10 border border-yellow-500/25 px-2 py-0.5 rounded-full tracking-wider">
                    Tie Standing
                  </span>
                </div>

                <div className="space-y-2 mt-4">
                  <h3 className="font-display font-black text-xl text-white tracking-tight">Dead Heat</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {topCandidate.name} and {sortedCandidates[1].name} are currently tied at {topCandidate.voteCount} votes each. Cast your vote to break the tie!
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center mt-4">
                  <div>
                    <span className="text-[9px] uppercase text-slate-500 tracking-wider block">Tied Votes</span>
                    <span className="text-xl font-display font-extrabold text-white">{topCandidate.voteCount} votes</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase text-slate-500 tracking-wider block">Share</span>
                    <span className="text-sm font-bold text-yellow-500">{getPercentage(topCandidate.voteCount)}% each</span>
                  </div>
                </div>
              </div>
            )}

            {/* Platform Metrics Card */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform Diagnostics</h4>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-900">
                  <span className="text-slate-400">Ledger RPC Server</span>
                  <span className="font-mono text-slate-300">Soroban-Testnet</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-900">
                  <span className="text-slate-400">Protocol version</span>
                  <span className="font-mono text-slate-300">v21.0.0</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Tx Verification</span>
                  <span className="text-emerald-400 font-medium">Automatic</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl max-w-xl mx-auto space-y-4">
          <Award className="w-12 h-12 text-slate-700 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-display font-bold text-base text-slate-300">No Votes Recorded Yet</h3>
            <p className="text-xs text-slate-500 leading-normal max-w-xs mx-auto">
              The election is open but no cryptographic ballots have been cast so far. Head over to the Voting Booth to submit the first vote!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
