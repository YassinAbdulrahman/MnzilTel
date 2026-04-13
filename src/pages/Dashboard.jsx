import React from "react";
import BalanceCard from "../components/BalanceCard";
import PlanCard from "../components/PlanCard";
import UsageChart from "../components/UsageChart";
import QuickActions from "../components/QuickActions";

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
        <p className="text-slate-400 mt-1">Manage your account and usage</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column (Main Stats) */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <BalanceCard />
            <PlanCard />
          </div>
          <UsageChart />
        </div>

        {/* Right Column (Actions) */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
          <QuickActions />
          
          {/* Recent Activity Mock */}
          <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700/50 shadow-md flex-1">
            <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Wallet Top-up</p>
                    <p className="text-xs text-slate-400">Today, 2:40 PM</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-emerald-400">+50 SAR</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-700 rounded-xl text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 8v13H3V8" />
                      <path d="M1 3h22v5H1z" />
                      <path d="M10 12h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Plan Renewed</p>
                    <p className="text-xs text-slate-400">Oct 1, 9:00 AM</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-white">-20 SAR</span>
              </div>
            </div>
            <button className="w-full mt-4 py-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              View all transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
