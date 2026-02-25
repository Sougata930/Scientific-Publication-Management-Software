import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { AppLayout } from "@/components/AppLayout";
import Login from "./pages/Login";
import OperatorHome from "./pages/OperatorHome";
import AddResearcher from "./pages/AddResearcher";
import AddOffice from "./pages/AddOffice";
import AddEquipment from "./pages/AddEquipment";
import AssignEquipment from "./pages/AssignEquipment";
import AddJournal from "./pages/AddJournal";
import ResearcherDashboard from "./pages/ResearcherDashboard";
import ReportOccupancy from "./pages/ReportOccupancy";
import ReportEditors from "./pages/ReportEditors";
import ReportDigital from "./pages/ReportDigital";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AuthenticatedRoutes = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  const isOperatorOrAdmin = user.role === 'admin' || user.role === 'operator';

  return (
    <AppLayout>
      <Routes>
        {user.role === 'researcher' ? (
          <>
            <Route path="/" element={<Navigate to="/researcher-dashboard" />} />
            <Route path="/researcher-dashboard" element={<ResearcherDashboard />} />
          </>
        ) : (
          <>
            <Route path="/" element={<OperatorHome />} />
            <Route path="/add-researcher" element={<AddResearcher />} />
            <Route path="/add-office" element={<AddOffice />} />
            <Route path="/add-equipment" element={<AddEquipment />} />
            <Route path="/assign-equipment" element={<AssignEquipment />} />
            <Route path="/add-journal" element={<AddJournal />} />
          </>
        )}
        {user.role === 'admin' && (
          <>
            <Route path="/report-occupancy" element={<ReportOccupancy />} />
            <Route path="/report-editors" element={<ReportEditors />} />
            <Route path="/report-digital" element={<ReportDigital />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AppLayout>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/*" element={<AuthenticatedRoutes />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
