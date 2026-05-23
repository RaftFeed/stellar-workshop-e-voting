import { Vote, ArrowRight, ShieldCheck, RefreshCw, KeyRound, Award } from "lucide-react";

interface LandingProps {
  onEnterApp: () => void;
  isConnected: boolean;
  onConnectWallet: () => void;
  isConnecting: boolean;
}

export default function Landing({
  onEnterApp,
  isConnected,
  onConnectWallet,
  isConnecting
}: LandingProps) {
  
  const features = [
    {
      icon: ShieldCheck,
      title: "Transparent Voting",
      description: "Every ballot cast is securely recorded in the public ledger, making results audits immediate and 100% verifiable by anyone."
    },
    {
      icon: KeyRound,
      title: "One Wallet One Vote",
      description: "Prevent double-voting natively. Smart contract logic verifies that each cryptographic address can vote exactly once."
    },
    {
      icon: RefreshCw,
      title: "Real-Time Results",
      description: "No manual counting or closed-door tallies. Watch the live voting leaderboard update dynamically as transactions land on-chain."
    },
    {
      icon: Award,
      title: "Secure On-Chain Storage",
      description: "Candidates and vote counts are safely stored in Soroban contract instances, preventing tampering by administrators."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between grid-bg relative overflow-hidden">
      {/* Decorative Aura Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/15 border border-blue-500/25 rounded-xl flex items-center justify-center text-blue-500">
            <Vote className="w-5 h-5" />
          </div>
          <span className="font-display font-extrabold text-lg text-white">
            Stellar <span className="text-blue-500 font-bold">E-Voting</span>
          </span>
        </div>

        <button
          onClick={onEnterApp}
          className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all cursor-pointer"
        >
          Enter Dashboard
        </button>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center z-10 space-y-12">
        <div className="space-y-6 max-w-3xl">
          {/* Tagline */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/25 rounded-full text-[10px] uppercase font-bold text-blue-400 tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
            Soroban Smart Contract Powered
          </div>

          {/* Main Headline */}
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-white leading-[1.1] text-center">
            Transparent Campus Voting on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 blue-glow-text">
              Stellar Blockchain
            </span>
          </h1>

          {/* Explanation text */}
          <p className="text-slate-400 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Experience next-generation governance. Cast your cryptographic ballot using secure decentralized ledgers. Safe, immutable, and fully audit-transparent.
          </p>
        </div>

        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isConnected ? (
            <button
              onClick={onEnterApp}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-sm rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
            >
              Go to Voting Booth
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={onConnectWallet}
                disabled={isConnecting}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-sm rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connecting Wallet...
                  </>
                ) : (
                  <>
                    Connect Freighter Wallet
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              
              <button
                onClick={onEnterApp}
                className="px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white font-semibold text-sm rounded-2xl transition-all cursor-pointer"
              >
                View Candidates
              </button>
            </>
          )}
        </div>

        {/* Features grid */}
        <section className="w-full pt-12 md:pt-20 border-t border-slate-900 space-y-6">
          <div className="text-left space-y-1 max-w-lg">
            <span className="text-[10px] uppercase font-bold text-blue-500 tracking-widest">Architecture</span>
            <h2 className="font-display font-extrabold text-2xl text-white">Why decentralized campus elections?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={index}
                  className="glass-card p-6 rounded-2xl border border-slate-800/80 hover:border-slate-800 transition-all text-left flex flex-col justify-between"
                >
                  <div className="p-3 bg-blue-600/10 border border-blue-500/10 rounded-xl text-blue-500 w-fit mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-sm text-white">{feat.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-8 border-t border-slate-900 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <span>© 2026 Stellar E-Voting DApp. Built for Student Council Elections.</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            Powered by 
            <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-400 hover:text-blue-500">Stellar</a>
          </span>
          <span className="flex items-center gap-1.5">
            Smart Contracts: 
            <a href="https://soroban.stellar.org" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-400 hover:text-blue-500">Soroban Rust SDK</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
