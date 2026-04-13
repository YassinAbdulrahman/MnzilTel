import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { validateSaudiPhone, normalizeSaudiPhone, formatSaudiPhone } from "../utils/validators";

export default function TopUp() {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [bundle, setBundle] = useState("10GB");
  const [loading, setLoading] = useState(false);
  const { topUp, wallet } = useAppContext();
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    const rawVal = e.target.value;
    const formatted = formatSaudiPhone(rawVal);
    setPhone(formatted);
    
    if (formatted) {
      const { isValid, message } = validateSaudiPhone(formatted);
      setPhoneError(isValid ? "" : message);
    } else {
      setPhoneError("");
    }
  };

  const handlePhoneBlur = () => {
    if (phone) {
      const { isValid, message } = validateSaudiPhone(phone);
      if (isValid) {
        setPhoneError("");
        setPhone(normalizeSaudiPhone(phone));
      } else {
        setPhoneError(message);
      }
    }
  };

  const isFormValid = phone && !phoneError;

  const handleTopUp = () => {
    if (!isFormValid) {
      toast.error("Please provide a valid phone number");
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const normalizedNumber = normalizeSaudiPhone(phone);
        const res = await topUp({ phone: normalizedNumber, bundle });
        setLoading(false);

        if (!res.success) {
          toast.error(res.message);
          return;
        }

        toast.success(res.message);
        navigate("/");
      } catch (error) {
        setLoading(false);
        toast.error(error.message || "Top up failed");
      }
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-md bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Top Up Wallet</h1>
          <p className="text-slate-400 text-sm mt-2">Recharge an existing number</p>
          <div className="mt-4 px-4 py-2 bg-slate-900/50 rounded-xl inline-block">
            <span className="text-sm text-slate-400 mr-2">Current Balance:</span>
            <span className="font-semibold text-white">{wallet !== null ? `${wallet} SAR` : "..."}</span>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              className={`w-full p-3 bg-slate-900 border rounded-xl text-white focus:outline-none focus:ring-2 transition-shadow ${
                phoneError 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-slate-700 focus:ring-indigo-500 focus:border-transparent"
              }`}
              placeholder="e.g., 05XXXXXXXX"
              value={phone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
            />
            {phoneError ? (
              <p className="text-red-400 text-xs mt-1.5 ml-1">{phoneError}</p>
            ) : (
              <p className="text-slate-500 text-xs mt-1.5 ml-1">Format: 05XXXXXXXX or +9665XXXXXXXX</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Select Bundle
            </label>
            <div className="relative">
              <select
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                value={bundle}
                onChange={(e) => setBundle(e.target.value)}
              >
                <option value="10GB">10GB - 20 SAR</option>
                <option value="30GB">30GB - 50 SAR</option>
                <option value="Unlimited">Unlimited - 100 SAR</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
          </div>

          <button
            onClick={handleTopUp}
            disabled={loading || !isFormValid}
            className={`relative w-full overflow-hidden rounded-xl font-semibold text-white shadow-lg transition-all ${
              loading || !isFormValid
                ? "bg-indigo-400/50 cursor-not-allowed opacity-80"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/25 cursor-pointer active:scale-[0.98]"
            }`}
          >
            <div className="relative flex items-center justify-center gap-2 py-3 px-4">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Pay from Wallet</span>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
