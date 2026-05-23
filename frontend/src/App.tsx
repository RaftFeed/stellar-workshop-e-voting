import { useState, useEffect, useCallback } from "react";
import { useStellarWallet } from "./hooks/useStellarWallet";
import { 
  getCandidatesList, 
  getElectionStats, 
  voteCandidate, 
  addCandidate, 
  toggleElectionStatus, 
  resetMockElection 
} from "./services/stellar";
import type { Candidate, ElectionStats } from "./types";
import DashboardLayout from "./layouts/DashboardLayout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Voting from "./pages/Voting";
import Results from "./pages/Results";
import Admin from "./pages/Admin";
import { CheckCircle2, AlertTriangle, Info, AlertOctagon, X } from "lucide-react";

// Toast Type Definition
interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export type TabName = "overview" | "voting" | "results" | "admin" | "landing";

export default function App() {
  const {
    address,
    isConnected,
    isConnecting,
    error: walletError,
    mockMode,
    connect,
    disconnect,
    toggleMockMode
  } = useStellarWallet();

  const [activeTab, setActiveTab] = useState<TabName>("landing");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<ElectionStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom Toasts State
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  // Fetch election data
  const refreshElectionData = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await getCandidatesList();
      const summary = await getElectionStats();
      setCandidates(list);
      setStats(summary);
    } catch (err) {
      console.error("Error refreshing data:", err);
      showToast("Failed to sync on-chain data.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // Load candidates and stats on startup / mode change
  useEffect(() => {
    if (activeTab !== "landing") {
      refreshElectionData();
    }
  }, [activeTab, mockMode, refreshElectionData]);

  // Alert on wallet error
  useEffect(() => {
    if (walletError) {
      showToast(walletError, "error");
    }
  }, [walletError, showToast]);

  // Handle successful connection alert
  useEffect(() => {
    if (isConnected && address) {
      showToast(
        `Wallet connected! ${mockMode ? "(Mock Mode Active)" : ""}`, 
        mockMode ? "warning" : "success"
      );
      if (activeTab === "landing") {
        setActiveTab("overview");
      }
    }
  }, [isConnected, address, mockMode, showToast]);

  // Vote implementation
  const handleCastVote = async (candidateId: string): Promise<boolean> => {
    if (!address) {
      showToast("Please connect your wallet first.", "warning");
      return false;
    }
    try {
      const response = await voteCandidate(address, candidateId);
      if (response === "Voting berhasil") {
        showToast("Ballot submitted successfully!", "success");
        await refreshElectionData();
        return true;
      } else if (response === "Sudah voting") {
        showToast("You have already voted! One vote per wallet address is enforced.", "error");
        return false;
      } else {
        showToast(response, "warning");
        return false;
      }
    } catch (err: any) {
      showToast(err.message || "Failed to submit transaction.", "error");
      return false;
    }
  };

  // Add candidate implementation
  const handleAddCandidate = async (name: string, vision: string, avatarUrl?: string): Promise<boolean> => {
    try {
      const newCand = await addCandidate(name, vision, avatarUrl);
      if (newCand) {
        showToast(`Candidate "${name}" registered successfully on-chain!`, "success");
        await refreshElectionData();
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message || "Failed to submit candidate registry.", "error");
      return false;
    }
  };

  // Toggle election state
  const handleToggleStatus = async () => {
    try {
      const nextStatus = await toggleElectionStatus();
      showToast(`Election status set to: ${nextStatus}`, "info");
      await refreshElectionData();
    } catch (err: any) {
      showToast(err.message || "Failed to toggle status.", "error");
    }
  };

  // Reset sandbox databases
  const handleResetElection = () => {
    resetMockElection();
    showToast("Sandbox database cleared to initial state.", "info");
    refreshElectionData();
  };

  // Check if voter has already submitted a ballot
  const hasVoted = stats ? (() => {
    if (mockMode) {
      const votes = localStorage.getItem("stellar_evoting_voted_accounts");
      const list = votes ? JSON.parse(votes) : [];
      return address ? list.includes(address) : false;
    }
    // For live, we simulate it via checking if address has already voted in contracts
    return false;
  })() : false;

  // Render Sub-Page views
  const renderPage = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Dashboard
            stats={stats}
            candidates={candidates}
            isLoading={isLoading}
            onNavigateToBooth={() => setActiveTab("voting")}
            onNavigateToResults={() => setActiveTab("results")}
            walletConnected={isConnected}
            onConnectWallet={connect}
          />
        );
      case "voting":
        return (
          <Voting
            candidates={candidates}
            isLoading={isLoading}
            walletConnected={isConnected}
            electionStats={stats}
            hasVoted={hasVoted}
            votedCandidateId={null}
            onCastVote={handleCastVote}
            onConnectWallet={connect}
          />
        );
      case "results":
        return (
          <Results
            candidates={candidates}
            stats={stats}
            isLoading={isLoading}
          />
        );
      case "admin":
        return (
          <Admin
            candidates={candidates}
            stats={stats}
            isLoading={isLoading}
            onAddCandidate={handleAddCandidate}
            onToggleStatus={handleToggleStatus}
            onResetElection={handleResetElection}
            mockMode={mockMode}
          />
        );
      default:
        return (
          <Dashboard
            stats={stats}
            candidates={candidates}
            isLoading={isLoading}
            onNavigateToBooth={() => setActiveTab("voting")}
            onNavigateToResults={() => setActiveTab("results")}
            walletConnected={isConnected}
            onConnectWallet={connect}
          />
        );
    }
  };

  // If on Landing page, render Landing component directly without dashboard scaffolding
  if (activeTab === "landing") {
    return (
      <Landing
        onEnterApp={() => setActiveTab("overview")}
        isConnected={isConnected}
        onConnectWallet={connect}
        isConnecting={isConnecting}
      />
    );
  }

  // Otherwise, wrap in Dashboard layout
  return (
    <>
      <DashboardLayout
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        address={address}
        isConnected={isConnected}
        isConnecting={isConnecting}
        mockMode={mockMode}
        isAdmin={true} // In this campus setup, anyone can view/access admin panel to demo registrations
        electionStatus={stats?.electionStatus || "Open"}
        totalCandidates={candidates.length}
        onConnect={connect}
        onDisconnect={disconnect}
        onToggleMock={toggleMockMode}
      >
        {renderPage()}
      </DashboardLayout>

      {/* Toast Alerts Portal */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => {
          const Icon = 
            toast.type === "success" ? CheckCircle2 :
            toast.type === "error" ? AlertOctagon :
            toast.type === "warning" ? AlertTriangle : Info;
          
          const colors = 
            toast.type === "success" ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-400" :
            toast.type === "error" ? "bg-red-950/90 border-red-500/30 text-red-400" :
            toast.type === "warning" ? "bg-yellow-950/90 border-yellow-500/30 text-yellow-400" :
            "bg-slate-900/95 border-slate-800 text-blue-400";
            
          return (
            <div 
              key={toast.id} 
              className={`p-4 rounded-2xl border backdrop-blur-md shadow-2xl flex items-start gap-3 pointer-events-auto transition-all animate-in slide-in-from-right duration-350 ${colors}`}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs font-semibold leading-normal pr-2">
                {toast.message}
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-500 hover:text-white transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
