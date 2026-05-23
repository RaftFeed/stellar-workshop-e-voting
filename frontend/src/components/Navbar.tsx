import { useState } from "react";
import { Vote, Power, Copy, Check, Cpu } from "lucide-react";
import { truncateAddress } from "../lib/utils";

interface NavbarProps {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  mockMode: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleMock: () => void;
}

export default function Navbar({
  address,
  isConnected,
  isConnecting,
  mockMode,
  onConnect,
  onDisconnect,
  onToggleMock
}: NavbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/10">
          <Vote className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <span className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
            Stellar <span className="text-blue-500">E-Voting</span>
          </span>
          <span className="text-[10px] text-slate-400 block tracking-widest uppercase">Decentralized Campus Platform</span>
        </div>
      </div>

      {/* Actions / Right Side */}
      <div className="flex items-center gap-4">
        {/* Mock Mode Alert/Toggle */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-full">
          <Cpu className={`w-4 h-4 ${mockMode ? "text-yellow-500" : "text-emerald-500"}`} />
          <span className="text-xs font-medium text-slate-300">
            {mockMode ? "Mock Mode" : "Soroban Live"}
          </span>
          <button
            onClick={onToggleMock}
            className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
              mockMode ? "bg-yellow-600" : "bg-slate-700"
            }`}
            title="Toggle between Simulated Browser Storage and live Freighter/Soroban wallet connection"
          >
            <div
              className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 ${
                mockMode ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Connection Status & Wallet Info */}
        {isConnected && address ? (
          <div className="flex items-center gap-2">
            {/* Address Display */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 font-mono shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{truncateAddress(address)}</span>
              <button
                onClick={handleCopy}
                className="text-slate-500 hover:text-white transition-colors p-0.5 rounded"
                title="Copy full address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Disconnect Button */}
            <button
              onClick={onDisconnect}
              className="p-2 border border-red-900/30 hover:border-red-500/40 bg-red-950/10 hover:bg-red-950/30 text-red-400 hover:text-red-300 rounded-xl transition-all duration-200"
              title="Disconnect Wallet"
            >
              <Power className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-medium text-sm rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50"
          >
            {isConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Power className="w-4 h-4" />
                Connect Wallet
              </>
            )}
          </button>
        )}
      </div>
    </nav>
  );
}
