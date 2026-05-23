import { LayoutDashboard, Vote, BarChart3, Settings, HelpCircle, FileText } from "lucide-react";

export type TabName = "overview" | "voting" | "results" | "admin";

interface SidebarProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
  isAdmin: boolean;
  electionStatus: "Open" | "Closed";
  totalCandidates: number;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  isAdmin,
  electionStatus,
  totalCandidates: _totalCandidates
}: SidebarProps) {
  const menuItems = [
    {
      id: "overview" as TabName,
      label: "Dashboard Overview",
      icon: LayoutDashboard,
      description: "Quick stats & leaderboard"
    },
    {
      id: "voting" as TabName,
      label: "Voting Booth",
      icon: Vote,
      description: "Cast your secure vote",
      badge: electionStatus === "Open" ? "Active" : "Closed"
    },
    {
      id: "results" as TabName,
      label: "Live Results",
      icon: BarChart3,
      description: "Real-time statistics"
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/40 backdrop-blur-md hidden md:flex flex-col justify-between p-4 h-[calc(100vh-73px)] sticky top-[73px]">
      {/* Upper Navigation section */}
      <div className="space-y-6">
        <div className="px-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Navigation</span>
        </div>
        
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full group flex items-start gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-blue-600/10 border border-blue-500/20 text-white"
                    : "border border-transparent text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <Icon className={`w-5 h-5 mt-0.5 transition-colors ${isActive ? "text-blue-500" : "text-slate-400 group-hover:text-slate-300"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        item.badge === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse" : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] block mt-0.5 ${isActive ? "text-blue-400/85" : "text-slate-500 group-hover:text-slate-400"}`}>
                    {item.description}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Admin Navigation (Conditional) */}
        {isAdmin && (
          <div className="pt-4 border-t border-slate-900">
            <div className="px-2 mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Management</span>
            </div>
            <button
              onClick={() => onTabChange("admin")}
              className={`w-full group flex items-start gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                activeTab === "admin"
                  ? "bg-blue-600/10 border border-blue-500/20 text-white"
                  : "border border-transparent text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <Settings className={`w-5 h-5 mt-0.5 ${activeTab === "admin" ? "text-blue-500" : "text-slate-400 group-hover:text-slate-300"}`} />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold tracking-tight block">Admin Panel</span>
                <span className={`text-[11px] block mt-0.5 ${activeTab === "admin" ? "text-blue-400/85" : "text-slate-500 group-hover:text-slate-400"}`}>
                  Manage candidates & status
                </span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Footer Info inside Sidebar */}
      <div className="border-t border-slate-900 pt-4 px-2 space-y-3.5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <HelpCircle className="w-4 h-4" />
          <a href="#how" className="hover:underline">How blockchain voting works</a>
        </div>
        
        <div className="p-3 bg-slate-900/60 border border-slate-800/60 rounded-xl">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[11px] font-medium text-slate-400">Smart Contract</span>
          </div>
          <span className="text-[9px] font-mono text-slate-500 block truncate mt-1.5" title="CCSRB3CWYXM473AMFP6ZNEJE7WQQDD6BGV7HE4P7YHAUBRIDC4BNJHJY">
            CCSRB3...B4BNJHJY
          </span>
        </div>
      </div>
    </aside>
  );
}
