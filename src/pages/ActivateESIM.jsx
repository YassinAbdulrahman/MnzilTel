import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { validateICCID } from "../utils/validators";

export default function ActivateESIM() {
  const [iccid, setIccid] = useState("");
  const [iccidError, setIccidError] = useState("");
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [selfie, setSelfie] = useState(null);
  const [loading, setLoading] = useState(false);
  const { activateESIM, wallet } = useAppContext();
  const navigate = useNavigate();

  const mockKYC = () => new Promise((res) => setTimeout(res, 1200));

  const handleIccidChange = (e) => {
    // Only allow typing numbers without spaces for ICCID
    const val = e.target.value.replace(/[^\d]/g, "");
    setIccid(val);

    if (val) {
      const { isValid, message } = validateICCID(val);
      setIccidError(isValid ? "" : message);
    } else {
      setIccidError("");
    }
  };

  const handleIccidBlur = () => {
    if (iccid) {
      const { isValid, message } = validateICCID(iccid);
      setIccidError(isValid ? "" : message);
    }
  };

  const isFormValid = iccid && !iccidError && name.trim() && nationality.trim() && selfie;

  const handleActivate = async () => {
    if (!isFormValid) {
      toast.error("Please complete all required fields");
      return;
    }

    setLoading(true);

    try {
      // Simulate KYC process showing a toast
      toast.loading("Verifying identity (KYC)...", { id: "kyc" });
      await mockKYC();
      toast.success("Identity verified!", { id: "kyc" });

      // Clean the value one last time just to be safe
      const cleanIccid = iccid.trim().replace(/\s+/g, "");
      const res = await activateESIM({
        iccid: cleanIccid,
        name: name.trim(),
        nationality: nationality.trim(),
        selfie,
      });

      if (!res.success) {
        toast.error(res.message);
        setLoading(false);
        return;
      }

      toast.success(res.message);
      navigate("/");
    } catch (error) {
      toast.error("Activation failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-md bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="4" ry="4" />
              <path d="M7 6h10" />
              <path d="M7 10h10" />
              <path d="M12 14h5" />
              <path d="M7 14h1" />
              <path d="M7 18h1" />
              <path d="M12 18h5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Activate eSIM</h1>
          <p className="text-slate-400 text-sm mt-2">Get connected instantly</p>
          <div className="mt-4 px-4 py-2 bg-slate-900/50 rounded-xl inline-block">
            <span className="text-sm text-slate-400 mr-2">Wallet Deduction:</span>
            <span className="font-semibold text-rose-400">30 SAR</span>
            <div className="text-xs text-slate-500 mt-1">Current Balance: {wallet ?? "..."} SAR</div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              ICCID Number
            </label>
            <input
              type="text"
              className={`w-full p-3 bg-slate-900 border rounded-xl text-white focus:outline-none focus:ring-2 transition-shadow font-mono tracking-widest text-center ${
                iccidError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-700 focus:ring-purple-500 focus:border-transparent"
              }`}
              placeholder="899665XXXXXXXXXXXXX"
              value={iccid}
              onChange={handleIccidChange}
              onBlur={handleIccidBlur}
              maxLength={20}
            />
            {iccidError ? (
              <p className="text-red-400 text-xs mt-1.5 ml-1 text-center">{iccidError}</p>
            ) : (
              <p className="text-slate-500 text-xs mt-1.5 ml-1 text-center">Must start with 89 (19-20 digits)</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Nationality
            </label>
            <input
              type="text"
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
              placeholder="Enter your nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Selfie Upload
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-purple-500/20 file:px-3 file:py-2 file:text-sm file:font-medium file:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
              onChange={(e) => setSelfie(e.target.files?.[0] ?? null)}
            />
            <p className="text-slate-500 text-xs mt-1.5 ml-1">
              Upload a selfie image for KYC verification.
            </p>
          </div>

          <button
            onClick={handleActivate}
            disabled={loading || !isFormValid}
            className={`relative w-full overflow-hidden rounded-xl font-semibold text-white shadow-lg transition-all ${
              loading || !isFormValid
                ? "bg-purple-400/50 cursor-not-allowed opacity-80"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/25 cursor-pointer active:scale-[0.98]"
            }`}
          >
            <div className="relative flex items-center justify-center gap-2 py-3 px-4">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing Activation...</span>
                </>
              ) : (
                <span>Activate Now</span>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
