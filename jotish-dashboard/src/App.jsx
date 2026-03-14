import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import ListPage from "./pages/ListPage";
import DetailsPage from "./pages/DetailsPage";
import AnalyticsPage from "./pages/AnalyticsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/list" element={<ListPage />} />
            <Route path="/details/:id" element={<DetailsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            
            <Route path="*" element={<Navigate to="/list" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
