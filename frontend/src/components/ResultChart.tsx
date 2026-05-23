import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid
} from "recharts";
import type { Candidate } from "../types";

interface ResultChartProps {
  candidates: Candidate[];
}

export default function ResultChart({ candidates }: ResultChartProps) {
  // Map candidates data for Recharts
  const data = candidates.map(c => ({
    name: c.name,
    votes: c.voteCount,
    id: c.id
  })).sort((a, b) => b.votes - a.votes); // Sort by vote count descending

  // Custom tooltips
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-xs font-bold text-white">{payload[0].payload.name}</p>
          <p className="text-[11px] text-blue-400 mt-1">
            <span className="font-bold font-mono">{payload[0].value}</span> Votes
          </p>
          <p className="text-[9px] text-slate-500 font-mono mt-0.5">ID: #{payload[0].payload.id}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 bg-slate-900/20 rounded-2xl border border-slate-800/40 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
        >
          {/* Soft Gridlines */}
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          
          <XAxis 
            dataKey="name" 
            stroke="#64748b" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={8}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            dx={-8}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.05)", radius: 10 }} />
          
          <Bar 
            dataKey="votes" 
            radius={[8, 8, 0, 0]}
            maxBarSize={48}
          >
            {data.map((entry, index) => {
              // Highlight the first place (winner) with a brighter glow/gradient
              const isWinner = index === 0 && entry.votes > 0;
              return (
                <Cell 
                  key={`cell-${index}`} 
                  fill={isWinner ? "#3b82f6" : "#1e3a8a"} 
                  opacity={isWinner ? 1 : 0.75}
                  className="transition-all duration-300 hover:opacity-100 cursor-pointer"
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
