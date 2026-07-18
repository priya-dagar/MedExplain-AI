import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AIChat from "./pages/AIChat";
import UploadPrescription from "./pages/UploadPrescription";
import Dashboard from "./pages/Dashboard";
import HealthRecords from "./pages/HealthRecords";
import VerifyOtp from "./pages/VerifyOtp";


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <AIChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload-prescription"
          element={
            <ProtectedRoute>
              <UploadPrescription />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-records"
          element={
            <ProtectedRoute>
              <HealthRecords />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;