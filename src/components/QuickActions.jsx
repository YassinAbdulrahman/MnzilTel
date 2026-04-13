import React from "react";
import { Link } from "react-router-dom";

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Link
        to="/topup"
        className="group flex flex-col items-center justify-center p-6 bg-slate-800 rounded-3xl shadow-md border border-slate-700/50 hover:bg-slate-700/80 hover:border-indigo-500/50 transition-all gap-4"
      >
        <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        </div>
        <span className="font-semibold text-white text-sm">Top Up</span>
      </Link>

      <Link
        to="/activate"
        className="group flex flex-col items-center justify-center p-6 bg-slate-800 rounded-3xl shadow-md border border-slate-700/50 hover:bg-slate-700/80 hover:border-purple-500/50 transition-all gap-4"
      >
        <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="4" ry="4" />
            <path d="M7 6h10" />
            <path d="M7 10h10" />
            <path d="M12 14h5" />
            <path d="M7 14h1" />
            <path d="M7 18h1" />
            <path d="M12 18h5" />
          </svg>
        </div>
        <span className="font-semibold text-white text-sm">Activate eSIM</span>
      </Link>
    </div>
  );
}
