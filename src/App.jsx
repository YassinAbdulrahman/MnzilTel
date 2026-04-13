import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import TopUp from "./pages/TopUp";
import ActivateESIM from "./pages/ActivateESIM";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-900 text-white">
          <Navbar />
          <div className="max-w-5xl mx-auto p-4 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/topup" element={<TopUp />} />
              <Route path="/activate" element={<ActivateESIM />} />
            </Routes>
          </div>
        </div>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
