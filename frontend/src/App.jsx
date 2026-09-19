import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Stocks from "./pages/Stocks";
import StockProfile from "./pages/StockProfile";
import CorporateActions from "./pages/CorporateActions";
import Dividends from "./pages/Dividends";
import Portfolio from "./pages/Portfolio";
import Ipos from "./pages/Ipos";
import AiVault from "./pages/AiVault";
import Analytics from "./pages/Analytics";
import Documents from "./pages/Documents";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/markets"
            element={<Placeholder title="Markets" />}
          />

          <Route
            path="/stocks"
            element={<Stocks />}
          />

          <Route
            path="/stocks/:id"
            element={<StockProfile />}
          />

          <Route
            path="/portfolio"
            element={<Portfolio />}
          />

          <Route
            path="/dividends"
            element={<Dividends />}
          />

          <Route
            path="/ipos"
            element={<Ipos />}
          />

          <Route
            path="/corporate-actions"
            element={<CorporateActions />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/documents"
            element={<Documents />}
          />

          <Route
            path="/ai"
            element={<Placeholder title="AI Vault" />}
          />

          <Route
            path="/settings"
            element={<Placeholder title="Settings" />}
          />

        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
        
        <Route path="/ai-vault" element={<AiVault />} />
      </Routes>
    </BrowserRouter>
  );
}

function Placeholder({ title }) {
  return (
    <div style={{ padding: "40px" }}>
      <h1>{title}</h1>
      <p>This module is coming next.</p>
    </div>
  );
}

export default App;