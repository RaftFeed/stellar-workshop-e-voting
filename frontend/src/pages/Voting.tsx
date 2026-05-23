import { useState } from "react";
import { Search, SlidersHorizontal, UserX, Vote } from "lucide-react";
import type { Candidate, ElectionStats } from "../types";
import CandidateCard from "../components/CandidateCard";
import VoteModal from "../components/VoteModal";
import { CandidatesSkeleton } from "../components/LoadingSkeleton";

interface VotingProps {
  candidates: Candidate[];
  isLoading: boolean;
  walletConnected: boolean;
  electionStats: ElectionStats | null;
  hasVoted: boolean;
  votedCandidateId: string | null;
  onCastVote: (candidateId: string) => Promise<boolean>;
  onConnectWallet: () => void;
}

type SortOption = "id" | "name" | "votes";

export default function Voting({
  candidates,
  isLoading,
  walletConnected,
  electionStats,
  hasVoted,
  votedCandidateId,
  onCastVote,
  onConnectWallet: _onConnectWallet
}: VotingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("id");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  // Handle vote button trigger on card
  const handleVoteClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  // Confirm vote submission
  const handleConfirmVote = async () => {
    if (!selectedCandidate) return;
    setIsVoting(true);
    try {
      const success = await onCastVote(selectedCandidate.id);
      if (success) {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error in transaction submission:", error);
    } finally {
      setIsVoting(false);
    }
  };

  // Filter candidates based on search
  const filteredCandidates = candidates.filter(cand => 
    cand.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cand.id.includes(searchQuery)
  );

  // Sort candidates
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "votes") {
      return b.voteCount - a.voteCount;
    }
    // Default by ID
    return Number(a.id) - Number(b.id);
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white flex items-center gap-2">
            <Vote className="w-7 h-7 text-blue-500" />
            Voting Booth
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review candidates and cast your cryptographic ballot below.</p>
        </div>

        {/* Voting State indicator */}
        {walletConnected && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl w-fit">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Status:</span>
            {hasVoted ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Ballot Submitted
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                Eligible to Vote
              </span>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search candidates by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/40 transition-colors"
          />
        </div>

        {/* Sorting controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-400">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-blue-500/40 cursor-pointer"
          >
            <option value="id">Candidate ID</option>
            <option value="name">Alphabetical</option>
            <option value="votes">Current Votes</option>
          </select>
        </div>
      </div>

      {/* Main content grid */}
      {isLoading ? (
        <CandidatesSkeleton count={3} />
      ) : sortedCandidates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCandidates.map((cand) => (
            <CandidateCard
              key={cand.id}
              candidate={cand}
              onVote={handleVoteClick}
              hasVoted={hasVoted || (votedCandidateId !== null && votedCandidateId !== cand.id)}
              electionClosed={electionStats?.electionStatus === "Closed"}
              walletConnected={walletConnected}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl max-w-xl mx-auto space-y-4">
          <UserX className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-display font-bold text-base text-slate-300">No Candidates Found</h3>
            <p className="text-xs text-slate-500 leading-normal max-w-xs mx-auto">
              There are no candidates matching your criteria. Try adjusting your search query or check back later.
            </p>
          </div>
        </div>
      )}

      {/* Vote Confirmation Modal */}
      <VoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidate={selectedCandidate}
        onConfirm={handleConfirmVote}
        isVoting={isVoting}
      />
    </div>
  );
}
