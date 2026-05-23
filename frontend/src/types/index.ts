export interface Candidate {
  id: string; // BigInt or string to support Soroban u64 safely
  name: string;
  voteCount: number;
  vision?: string; // Vision and mission short text for UI
  avatarUrl?: string; // Candidate photo
}

export interface VoteRecord {
  voter: string; // Stellar public key
  candidateId: string;
}

export interface ElectionStats {
  totalCandidates: number;
  totalVotes: number;
  electionStatus: 'Open' | 'Closed';
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}
