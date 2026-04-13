import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [wallet, setWallet] = useState(null);
  const [plan, setPlan] = useState(null);
  const [usage, setUsage] = useState(null);

  // Sync state with API
  const refreshState = async () => {
    const [nextWallet, nextPlan, nextUsage] = await Promise.all([
      api.getWallet(),
      api.getPlan(),
      api.getUsage(),
    ]);

    setWallet(nextWallet);
    setPlan(nextPlan);
    setUsage(nextUsage);
  };

  useEffect(() => {
    refreshState().catch((error) => {
      console.error("Failed to load app state", error);
    });
  }, []);

  const topUp = async ({ phone, bundle }) => {
    const res = await api.topUp({ phone, bundle });
    if (res.success) {
      await refreshState();
    }
    return res;
  };

  const activateESIM = async ({ iccid, name, nationality, selfie }) => {
    const res = await api.activateESIM({ iccid, name, nationality, selfie });
    if (res.success) {
      await refreshState();
    }
    return res;
  };

  return (
    <AppContext.Provider
      value={{
        wallet,
        plan,
        usage,
        topUp,
        activateESIM,
        refreshState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
