import { useState, useEffect } from "react";
import { connectWallet, isMockMode, setMockMode } from "../services/stellar";

export interface WalletHook {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  mockMode: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  toggleMockMode: () => void;
}

export function useStellarWallet(): WalletHook {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mockMode, setMockModeState] = useState(isMockMode());

  // Check if wallet address is cached
  useEffect(() => {
    const cachedAddress = localStorage.getItem("stellar_evoting_address");
    if (cachedAddress) {
      setAddress(cachedAddress);
    }
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const walletAddr = await connectWallet();
      setAddress(walletAddr);
      localStorage.setItem("stellar_evoting_address", walletAddr);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet.");
      console.error("Wallet connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    localStorage.removeItem("stellar_evoting_address");
    if (mockMode) {
      localStorage.removeItem("stellar_evoting_mock_address");
    }
  };

  const toggleMockMode = () => {
    const nextVal = !mockMode;
    setMockMode(nextVal);
    setMockModeState(nextVal);
    // When toggling, disconnect current session
    disconnect();
    window.location.reload(); // Reload to refresh all services and state
  };

  return {
    address,
    isConnected: !!address,
    isConnecting,
    error,
    mockMode,
    connect,
    disconnect,
    toggleMockMode
  };
}
