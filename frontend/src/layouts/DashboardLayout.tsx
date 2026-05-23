import type { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import type { TabName } from "../components/Sidebar";
import { LayoutDashboard, Vote, BarChart3, Settings } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  mockMode: boolean;
  isAdmin: boolean;
  electionStatus: "Open" | "Closed";
  totalCandidates: number;
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleMock: () => void;
}

export default function DashboardLayout({
  children,
  activeTab,
  onTabChange,
  address,
  isConnected,
  isConnecting,
  mockMode,
  isAdmin,
  electionStatus,
  totalCandidates,
  onConnect,
  onDisconnect,
  onToggleMock
}: DashboardLayoutProps) {
  
  // Mobile navigation tabs
  const mobileNavs = [
    { id: "overview" as TabName, label: "Overview", icon: LayoutDashboard },
    { id: "voting" as TabName, label: "Vote", icon: Vote },
    { id: "results" as TabName, label: "Results", icon: BarChart3 },
    ...(isAdmin ? [{ id: "admin" as TabName, label: "Admin", icon: Settings }] : [])
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col grid-bg">
      {/* Top Navbar */}
      <Navbar
        address={address}
        isConnected={isConnected}
        isConnecting={isConnecting}
        mockMode={mockMode}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        onToggleMock={onToggleMock}
      />

      {/* Main body wrapper */}
      <div className="flex-1 flex relative">
        {/* Left Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          isAdmin={isAdmin}
          electionStatus={electionStatus}
          totalCandidates={totalCandidates}
        />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-8 p-4 md:p-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Mobile Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-900 backdrop-blur-lg flex items-center justify-around py-2 shadow-2xl">
        {mobileNavs.map((nav) => {
          const Icon = nav.icon;
          const isActive = activeTab === nav.id;
          return (
            <button
              key={nav.id}
              onClick={() => onTabChange(nav.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                isActive ? "text-blue-500 scale-105" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium tracking-tight">{nav.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
