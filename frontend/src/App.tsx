import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AIChat from "./pages/AIChat";
import UploadPrescription from "./pages/UploadPrescription";
import Dashboard from "./pages/Dashboard";
import HealthRecords from "./pages/HealthRecords";
import VerifyOtp from "./pages/VerifyOtp";
import Profile from "./pages/Profile";
import FindHealthcare from "./pages/Findhealthcare";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/upload-prescription" element={<UploadPrescription />} />
          <Route path="/health-records" element={<HealthRecords />} />
          <Route path="/find-healthcare" element={<FindHealthcare />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;