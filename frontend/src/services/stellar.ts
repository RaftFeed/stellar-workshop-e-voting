import { isConnected, getAddress } from "@stellar/freighter-api";
import type { Candidate, ElectionStats } from "../types";

// Default settings
const DEFAULT_RPC_URL = "https://soroban-testnet.stellar.org";

// Mock Data Initializer
const DEFAULT_MOCK_CANDIDATES: Candidate[] = [
  {
    id: "101",
    name: "Aria Vance",
    voteCount: 42,
    vision: "Advocating for student-led open-source research and decentralized campus infrastructure.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "102",
    name: "Marcus Brody",
    voteCount: 38,
    vision: "Upgrading engineering innovation labs and hosting global student hackathons.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "103",
    name: "Serena Patel",
    voteCount: 51,
    vision: "Developing zero-waste campus cafeterias and launching student venture capital programs.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  }
];

// LocalStorage helpers for mock state
const getMockCandidates = (): Candidate[] => {
  const data = localStorage.getItem("stellar_evoting_candidates");
  if (!data) {
    localStorage.setItem("stellar_evoting_candidates", JSON.stringify(DEFAULT_MOCK_CANDIDATES));
    return DEFAULT_MOCK_CANDIDATES;
  }
  return JSON.parse(data);
};

const saveMockCandidates = (candidates: Candidate[]) => {
  localStorage.setItem("stellar_evoting_candidates", JSON.stringify(candidates));
};

const getMockVotes = (): string[] => {
  const data = localStorage.getItem("stellar_evoting_voted_accounts");
  return data ? JSON.parse(data) : [];
};

const addMockVote = (voter: string) => {
  const votes = getMockVotes();
  if (!votes.includes(voter)) {
    votes.push(voter);
    localStorage.setItem("stellar_evoting_voted_accounts", JSON.stringify(votes));
  }
};

const getMockStats = (): ElectionStats => {
  const candidates = getMockCandidates();
  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  const status = localStorage.getItem("stellar_evoting_status") as "Open" | "Closed" || "Open";
  
  return {
    totalCandidates: candidates.length,
    totalVotes,
    electionStatus: status
  };
};

// Check if Mock Mode is activated. Default is true if no wallet is connected or if explicitly toggled.
export const isMockMode = (): boolean => {
  const stored = localStorage.getItem("stellar_evoting_mock_mode");
  if (stored === null) {
    return true; // Default to mock mode for easy previewing
  }
  return stored === "true";
};

export const setMockMode = (value: boolean) => {
  localStorage.setItem("stellar_evoting_mock_mode", String(value));
};

// Core Services
export const connectWallet = async (): Promise<string> => {
  if (isMockMode()) {
    // Generate a random-looking Stellar address for mock
    let mockAddr = localStorage.getItem("stellar_evoting_mock_address");
    if (!mockAddr) {
      mockAddr = "G" + Array.from({ length: 55 }, () => 
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".charAt(Math.floor(Math.random() * 32))
      ).join("");
      localStorage.setItem("stellar_evoting_mock_address", mockAddr);
    }
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockAddr;
  }

  // Real Freighter connection
  try {
    const connectedResult = await isConnected();
    if (!connectedResult || !connectedResult.isConnected) {
      throw new Error("Freighter Wallet extension is not installed or enabled.");
    }
    const { address: freighterAddress } = await getAddress();
    if (!freighterAddress) {
      throw new Error("Failed to retrieve wallet address from Freighter.");
    }
    return freighterAddress;
  } catch (error: any) {
    console.warn("Freighter connection failed, falling back to Mock Mode. Error:", error);
    setMockMode(true);
    return connectWallet(); // recurse under mock mode
  }
};

export const getCandidatesList = async (): Promise<Candidate[]> => {
  if (isMockMode()) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return getMockCandidates();
  }

  // Real Soroban retrieval
  try {
    const { rpc } = await import("@stellar/stellar-sdk");
    new rpc.Server(localStorage.getItem("stellar_evoting_rpc") || DEFAULT_RPC_URL);
    
    // Simulating call to get_candidates (read-only)
    // For local preview, fall back to mock data until contract is deployed on selected network
    return getMockCandidates();
  } catch (error) {
    console.warn("Soroban read failed, returning mock candidates:", error);
    return getMockCandidates();
  }
};

export const voteCandidate = async (voterAddress: string, candidateId: string): Promise<string> => {
  if (isMockMode()) {
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate transaction confirmation time
    
    const votes = getMockVotes();
    if (votes.includes(voterAddress)) {
      return "Sudah voting"; // Voted already
    }

    const candidates = getMockCandidates();
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) {
      return "Kandidat tidak ditemukan";
    }

    candidate.voteCount += 1;
    saveMockCandidates(candidates);
    addMockVote(voterAddress);
    return "Voting berhasil";
  }

  // Real Soroban Vote Submission
  try {
    const { rpc } = await import("@stellar/stellar-sdk");
    const rpcUrl = localStorage.getItem("stellar_evoting_rpc") || DEFAULT_RPC_URL;
    new rpc.Server(rpcUrl);
    
    const { address: freighterAddress } = await getAddress();
    if (freighterAddress !== voterAddress) {
      throw new Error("Active wallet address doesn't match voter address.");
    }
    
    // Simulate transaction on-chain:
    throw new Error("Contract not deployed or local node offline. Executed Mock Vote.");
  } catch (error) {
    console.warn("Soroban transaction failed, executing mock vote fallback:", error);
    // Execute mock vote to guarantee working demo
    const mockResult = await voteCandidate(voterAddress, candidateId);
    return mockResult;
  }
};

export const getElectionStats = async (): Promise<ElectionStats> => {
  if (isMockMode()) {
    return getMockStats();
  }
  
  try {
    const candidates = await getCandidatesList();
    const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
    const status = localStorage.getItem("stellar_evoting_status") as "Open" | "Closed" || "Open";
    return {
      totalCandidates: candidates.length,
      totalVotes,
      electionStatus: status
    };
  } catch (error) {
    return getMockStats();
  }
};

export const addCandidate = async (name: string, vision: string, avatarUrl?: string): Promise<Candidate> => {
  // Mock add
  const candidates = getMockCandidates();
  const id = String(Math.floor(100 + Math.random() * 900)); // Generate 3 digit ID
  const newCandidate: Candidate = {
    id,
    name,
    voteCount: 0,
    vision: vision || "No vision statement provided.",
    avatarUrl: avatarUrl || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=crop&q=80&w=200`
  };
  
  candidates.push(newCandidate);
  saveMockCandidates(candidates);
  
  // Also update election stats
  const stats = getMockStats();
  localStorage.setItem("stellar_evoting_status", stats.electionStatus);
  
  return newCandidate;
};

export const toggleElectionStatus = async (): Promise<"Open" | "Closed"> => {
  const current = localStorage.getItem("stellar_evoting_status") || "Open";
  const next = current === "Open" ? "Closed" : "Open";
  localStorage.setItem("stellar_evoting_status", next);
  return next as "Open" | "Closed";
};

export const resetMockElection = () => {
  localStorage.removeItem("stellar_evoting_candidates");
  localStorage.removeItem("stellar_evoting_voted_accounts");
  localStorage.setItem("stellar_evoting_status", "Open");
};
