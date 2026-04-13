import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useAppContext } from "../context/AppContext";

export default function UsageChart() {
  const { usage } = useAppContext();

  const data = [
    { name: "Used Data", value: usage?.used || 0 },
    { name: "Remaining Data", value: (usage?.total || 1) - (usage?.used || 0) },
  ];

  const total = usage?.total || 0;
  const used = usage?.used || 0;
  const percentUsed = total > 0 ? Math.round((used / total) * 100) : 0;

  return (
    <div className="bg-slate-800 p-6 rounded-3xl shadow-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <span className="p-3 bg-slate-700 rounded-2xl text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" x2="18" y1="20" y2="10" />
            <line x1="12" x2="12" y1="20" y2="4" />
            <line x1="6" x2="6" y1="20" y2="14" />
          </svg>
        </span>
        <h2 className="text-slate-400 font-medium text-sm uppercase tracking-wider">
          Data Usage
        </h2>
      </div>

      {!usage ? (
        <div className="animate-pulse flex flex-col gap-4 mt-6">
          <div className="mx-auto rounded-full bg-slate-700 h-32 w-32 border-8 border-slate-700"></div>
          <div className="bg-slate-700 h-4 w-1/2 mx-auto rounded-lg"></div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-40 h-40 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  stroke="none"
                  dataKey="value"
                  animationDuration={1000}
                >
                  <Cell fill="#6366f1" /> {/* Indigo-500 */}
                  <Cell fill="#334155" /> {/* Slate-700 */}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "12px", color: "#fff" }}
                  itemStyle={{ color: "#e2e8f0" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-white">{percentUsed}%</span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="flex justify-between items-center bg-slate-700/30 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-sm text-slate-300">Used</span>
              </div>
              <span className="font-semibold text-white">{used} GB</span>
            </div>
            <div className="flex justify-between items-center bg-slate-700/30 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                <span className="text-sm text-slate-300">Remaining</span>
              </div>
              <span className="font-semibold text-white">{total - used} GB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
