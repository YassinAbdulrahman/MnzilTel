import React from "react";
import { useAppContext } from "../context/AppContext";

export default function PlanCard() {
  const { plan } = useAppContext();

  return (
    <div className="flex flex-col bg-slate-800 rounded-3xl p-6 shadow-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <span className="p-3 bg-slate-700 rounded-2xl text-emerald-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="21 8 21 21 3 21 3 8" />
            <rect width="22" height="5" x="1" y="3" rx="1" />
            <line x1="10" x2="14" y1="12" y2="12" />
          </svg>
        </span>
        <h2 className="text-slate-400 font-medium text-sm uppercase tracking-wider">
          Current Plan
        </h2>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {!plan ? (
          <div className="animate-pulse flex flex-col gap-3">
            <div className="bg-slate-700 h-8 w-3/4 rounded-lg"></div>
            <div className="bg-slate-700 h-4 w-1/2 rounded-lg"></div>
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold tracking-tight text-white mb-2">
              {plan.name}
            </p>
            <div className="flex items-center gap-2 mt-auto">
              <span className="inline-flex items-center rounded-md bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-400/20">
                Active
              </span>
              <span className="text-sm text-slate-400">Renews in 12 days</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}