import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ItemsPage from "./pages/ItemsPage";
import SalesPage from "./pages/SalesPage";
import ProfitLossPage from "./pages/ProfitLossPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Directly render dashboard on "/" */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/profitLoss" element={<ProfitLossPage />} />
      </Routes>
    </Router>
  );
}

export default App;
