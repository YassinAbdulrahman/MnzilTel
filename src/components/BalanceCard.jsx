import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function BalanceCard() {
  const { wallet } = useAppContext();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-6 shadow-xl text-white">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-indigo-400 opacity-20 blur-xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-indigo-100 font-medium tracking-wide text-sm uppercase">
            Wallet Balance
          </h2>
          <span className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
          </span>
        </div>

        <div>
          {wallet === undefined ? (
            <div className="animate-pulse bg-white/20 h-10 w-1/2 rounded-lg"></div>
          ) : (
            <p className="text-4xl md:text-5xl font-bold tracking-tight">
              {wallet} <span className="text-lg font-medium text-indigo-200">SAR</span>
            </p>
          )}
        </div>

        <div className="pt-2">
          <Link
            to="/topup"
            className="inline-flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-semibold text-indigo-900 bg-white rounded-xl hover:bg-indigo-50 transition-colors shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Top Up Wallet
          </Link>
        </div>
      </div>
    </div>
  );
}
