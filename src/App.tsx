import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Public Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RegisterMitra from "./pages/auth/RegisterMitra";

// Customer Pages
import CustomerDashboard from "./pages/customer/Dashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import MitraVerification from "./pages/admin/MitraVerification";
import AdminUsers from "./pages/admin/Users";
import AdminServices from "./pages/admin/Services";
import AdminOrders from "./pages/admin/Orders";
import AdminFinance from "./pages/admin/Finance";
import AdminPromos from "./pages/admin/Promos";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-mitra" element={<RegisterMitra />} />

            {/* Customer Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/finance"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminFinance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/promos"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminPromos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/mitra-verification"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <MitraVerification />
                </ProtectedRoute>
              }
            />

            {/* Placeholder routes for future implementation */}
            <Route path="/mitra" element={<ProtectedRoute allowedRoles={["mitra"]}><div>Mitra Dashboard (Coming Soon)</div></ProtectedRoute>} />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
